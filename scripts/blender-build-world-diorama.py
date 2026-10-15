import bpy
import bmesh
import math
import os
from mathutils import Vector, Matrix, Euler, noise

OUT_DIR = r"d:\Touhou RPG Refined\GensokyoMaps\public\models"
BLEND_DIR = r"d:\Touhou RPG Refined\GensokyoMaps\blender-sources"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(BLEND_DIR, exist_ok=True)

WORLD_W = 2400.0
WORLD_D = 1600.0

def smoothstep(edge0, edge1, x):
    t = max(0.0, min(1.0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)

def get_elev(nx, ny):
    h = 4.0 + math.sin(nx * 19.0) * math.cos(ny * 15.0) * 1.6 + math.sin((nx + ny) * 37.0) * 0.65
    dxY = (nx - 0.658) / 0.195
    dyY = (ny - 0.155) / 0.135
    dYoukai = math.hypot(dxY, dyY)
    if dYoukai < 1.38:
        angle = math.atan2(dyY, dxY)
        ridgeMod = 1.0 + 0.12 * math.cos(angle * 5.0 + 0.4) + 0.07 * math.sin(angle * 9.0 - 1.1) * smoothstep(0.15, 0.85, dYoukai)
        m = pow(max(0.0, 1.0 - dYoukai / 1.38), 1.55)
        stepped = math.floor(m * 8.0) / 8.0
        h += (m * 0.76 + stepped * 0.24) * 172.0 * ridgeMod
    dWindLake = math.hypot((nx - 0.688) / 0.044, (ny - 0.112) / 0.032)
    if dWindLake < 1.0:
        h -= (1.0 - dWindLake * dWindLake) * 24.0
    dHakurei = math.hypot((nx - 0.252) / 0.115, (ny - 0.318) / 0.085)
    if dHakurei < 1.25:
        h += pow(max(0.0, 1.0 - dHakurei / 1.25), 1.5) * 56.0
    dEastRidge = math.hypot((nx - 0.91) / 0.085, (ny - 0.34) / 0.095)
    if dEastRidge < 1.2:
        h += pow(max(0.0, 1.0 - dEastRidge / 1.2), 1.6) * 46.0
    dNether = math.hypot((nx - 0.38) / 0.11, (ny - 0.07) / 0.055)
    if dNether < 1.1:
        h += (1.0 - smoothstep(0.5, 1.1, dNether)) * 34.0
    dLunar = math.hypot((nx - 0.91) / 0.085, (ny - 0.11) / 0.065)
    if dLunar < 1.15:
        h += (1.0 - smoothstep(0.55, 1.15, dLunar)) * 36.0
    dMisty = math.hypot((nx - 0.685) / 0.105, (ny - 0.79) / 0.09)
    if dMisty < 1.05:
        h -= (1.0 - smoothstep(0.4, 1.05, dMisty)) * 5.5
    pads = [
        (0.825, 0.745, 0.064, 0.082, 7.5),
        (0.480, 0.460, 0.062, 0.062, 4.2),
        (0.255, 0.320, 0.032, 0.038, 48.0),
        (0.382, 0.585, 0.028, 0.032, 5.0),
        (0.855, 0.470, 0.028, 0.030, 5.2),
        (0.645, 0.105, 0.030, 0.030, 108.0),
        (0.698, 0.148, 0.026, 0.024, 126.0),
        (0.752, 0.245, 0.018, 0.020, 48.0),
        (0.562, 0.215, 0.014, 0.014, 39.0),
        (0.125, 0.775, 0.028, 0.028, 4.5),
        (0.355, 0.070, 0.042, 0.032, 38.0),
        (0.912, 0.092, 0.038, 0.038, 39.5),
    ]
    for cx, cy, rx, ry, targetH in pads:
        d = math.hypot((nx - cx) / rx, (ny - cy) / ry)
        if d < 1.35:
            blend = 1.0 - smoothstep(0.65, 1.35, d)
            h = h * (1.0 - blend) + targetH * blend
    return h

def norm_to_blender(nx, ny, z_offset=0.0):
    bx = (nx - 0.5) * WORLD_W
    by = (0.5 - ny) * WORLD_D
    bz = get_elev(nx, ny) + z_offset
    return (bx, by, bz)

def hex_to_linear_rgb(hex_color):
    r = pow(((hex_color >> 16) & 0xFF) / 255.0, 2.2)
    g = pow(((hex_color >> 8) & 0xFF) / 255.0, 2.2)
    b = pow((hex_color & 0xFF) / 255.0, 2.2)
    return (r, g, b, 1.0)

def make_mat(name, hex_color, roughness=0.75, metallic=0.0, emission_hex=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    rgba = hex_to_linear_rgb(hex_color)
    bsdf.inputs["Base Color"].default_value = rgba
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    mat["hex_color"] = hex_color
    mat["is_emissive"] = bool(emission_hex is not None and emission_strength > 0.3)
    if emission_hex is not None and emission_strength > 0:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = hex_to_linear_rgb(emission_hex)
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat

def make_vertex_color_mat(name, roughness=0.78, metallic=0.06, emissive=False):
    """Creates a glTF-compatible Principled BSDF material driven by Vertex Color (`Color`)."""
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes.get("Principled BSDF")
    vcol = nt.nodes.new(type="ShaderNodeVertexColor")
    vcol.layer_name = "Color"
    nt.links.new(vcol.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if emissive:
        if "Emission Color" in bsdf.inputs:
            nt.links.new(vcol.outputs["Color"], bsdf.inputs["Emission Color"])
        if "Emission Strength" in bsdf.inputs:
            bsdf.inputs["Emission Strength"].default_value = 1.6
    return mat

def bake_and_merge_scene(base_name):
    """
    Merges all mesh objects in the current Blender scene into at most 2 meshes
    (`<base_name>_Opaque` and `<base_name>_Emissive`) with baked Vertex Colors (`Color`).
    Reduces 200+ draw calls per GLB down to 1-2 draw calls for locked 60-120fps WebGL rendering!
    """
    bpy.context.view_layer.update()
    mesh_objs = [o for o in list(bpy.context.scene.objects) if o.type == 'MESH']
    if not mesh_objs:
        return

    bm_opaque = bmesh.new()
    colors_opaque = []
    bm_emissive = bmesh.new()
    colors_emissive = []

    for obj in mesh_objs:
        mat = obj.data.materials[0] if obj.data.materials else None
        hex_c = mat.get("hex_color", 0xCCCCCC) if mat else 0xCCCCCC
        is_em = bool(mat.get("is_emissive", False)) if mat else False
        rgba = hex_to_linear_rgb(hex_c)

        bm_temp = bmesh.new()
        bm_temp.from_mesh(obj.data)
        bmesh.ops.transform(bm_temp, matrix=obj.matrix_world, verts=bm_temp.verts)

        target_bm = bm_emissive if is_em else bm_opaque
        target_cols = colors_emissive if is_em else colors_opaque

        v_map = {}
        for v in bm_temp.verts:
            nv = target_bm.verts.new(v.co)
            v_map[v] = nv
            target_cols.append(rgba)
        for f in bm_temp.faces:
            try:
                target_bm.faces.new([v_map[v] for v in f.verts])
            except ValueError:
                pass
        bm_temp.free()

        bpy.data.objects.remove(obj, do_unlink=True)

    if len(bm_opaque.verts) > 0:
        m_op = bpy.data.meshes.new(f"{base_name}_Opaque")
        o_op = bpy.data.objects.new(f"{base_name}_Opaque", m_op)
        bpy.context.collection.objects.link(o_op)
        bm_opaque.normal_update()
        bm_opaque.to_mesh(m_op)
        col_attr = m_op.color_attributes.new(name="Color", type='FLOAT_COLOR', domain='POINT')
        for idx, rgba in enumerate(colors_opaque):
            col_attr.data[idx].color = rgba
        o_op.data.materials.append(make_vertex_color_mat(f"{base_name}_OpaqueMat", roughness=0.78, metallic=0.06, emissive=False))
    bm_opaque.free()

    if len(bm_emissive.verts) > 0:
        m_em = bpy.data.meshes.new(f"{base_name}_Emissive")
        o_em = bpy.data.objects.new(f"{base_name}_Emissive", m_em)
        bpy.context.collection.objects.link(o_em)
        bm_emissive.normal_update()
        bm_emissive.to_mesh(m_em)
        col_attr = m_em.color_attributes.new(name="Color", type='FLOAT_COLOR', domain='POINT')
        for idx, rgba in enumerate(colors_emissive):
            col_attr.data[idx].color = rgba
        o_em.data.materials.append(make_vertex_color_mat(f"{base_name}_EmissiveMat", roughness=0.35, metallic=0.1, emissive=True))
    bm_emissive.free()

def assign_mat(obj, mat):
    if obj.data.materials:
        obj.data.materials[0] = mat
    else:
        obj.data.materials.append(mat)

def add_box(name, loc, dims, mat, rot=(0,0,0)):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=dims, verts=bm.verts)
    bm.to_mesh(mesh)
    bm.free()
    obj.location = loc
    obj.rotation_euler = rot
    assign_mat(obj, mat)
    return obj

def add_cyl(name, loc, r_bot, r_top, depth, mat, vertices=10, rot=(0,0,0)):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=vertices, radius1=r_bot, radius2=r_top, depth=depth)
    bm.to_mesh(mesh)
    bm.free()
    obj.location = loc
    obj.rotation_euler = rot
    assign_mat(obj, mat)
    return obj

def add_pitched_roof(name, loc, width, depth, height, mat, rot=(0,0,0), overhang=1.2, hip_factor=0.75):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    hw = (width * 0.5) + overhang
    hd = (depth * 0.5) + overhang
    rw = hw * hip_factor
    v0 = bm.verts.new((-hw, -hd, 0))
    v1 = bm.verts.new(( hw, -hd, 0))
    v2 = bm.verts.new(( hw,  hd, 0))
    v3 = bm.verts.new((-hw,  hd, 0))
    v4 = bm.verts.new((-rw, 0, height))
    v5 = bm.verts.new(( rw, 0, height))
    bm.faces.new((v0, v1, v5, v4))
    bm.faces.new((v2, v3, v4, v5))
    bm.faces.new((v3, v0, v4))
    bm.faces.new((v1, v2, v5))
    bm.faces.new((v0, v3, v2, v1))
    bm.to_mesh(mesh)
    bm.free()
    obj.location = loc
    obj.rotation_euler = rot
    assign_mat(obj, mat)
    return obj

def add_sculpted_rock_mass(name, loc, scale_xyz, mat, seed_val=1, rot_z=0.0):
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
    sx, sy, sz = scale_xyz
    for v in bm.verts:
        if v.co.z < -0.2:
            v.co.z = -0.25
        else:
            p = Vector((v.co.x * 1.7 + seed_val, v.co.y * 1.7 + seed_val * 0.7, v.co.z * 1.4))
            n = abs(noise.noise(p))
            ridge = 1.0 - abs(noise.noise(p * 2.1))
            factor = 0.75 + 0.45 * n + 0.35 * ridge
            v.co.x *= factor
            v.co.y *= factor
            v.co.z *= (0.8 + 0.55 * ridge)
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
    bm.to_mesh(mesh)
    bm.free()
    obj.location = loc
    obj.rotation_euler = (0, 0, rot_z)
    assign_mat(obj, mat)
    return obj

def clear_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for m in list(bpy.data.meshes):
        if m.users == 0:
            bpy.data.meshes.remove(m)
    for mat in list(bpy.data.materials):
        if mat.users == 0:
            bpy.data.materials.remove(mat)

def build_world_diorama():
    clear_scene()

    mat_mahogany = make_mat("DioramaMahogany", 0x26150E, roughness=0.42, metallic=0.08)
    mat_brass = make_mat("DioramaBrass", 0xC89D42, roughness=0.28, metallic=0.82)
    mat_crust_earth = make_mat("CrustEarth", 0x3D3128, roughness=0.92)
    mat_granite_dark = make_mat("GraniteDark", 0x5A534A, roughness=0.88)
    mat_granite_mid = make_mat("GraniteMid", 0x7A7267, roughness=0.85)
    mat_snow = make_mat("AlpineSnow", 0xF2EFE9, roughness=0.65)
    mat_basalt = make_mat("RavineBasalt", 0x3A3D42, roughness=0.82)
    mat_water_fall = make_mat("WaterfallCascade", 0x62B8E8, roughness=0.15, metallic=0.1, emission_hex=0x2B729E, emission_strength=0.45)
    mat_water_foam = make_mat("WaterfallFoam", 0xECF6FC, roughness=0.35, emission_hex=0x9AD4F5, emission_strength=0.55)
    mat_nether_cloud = make_mat("NetherCloud", 0xF5DCE8, roughness=0.72)
    mat_sakura_pink = make_mat("SakuraBlossom", 0xF4A4C4, roughness=0.68)
    mat_sakura_bark = make_mat("SakuraBark", 0x3A2218, roughness=0.9)
    mat_obsidian = make_mat("HellObsidian", 0x1E1618, roughness=0.45, metallic=0.2)
    mat_lava_glow = make_mat("HellLava", 0xFF4518, roughness=0.3, emission_hex=0xFF3B08, emission_strength=2.2)
    mat_makai_crystal = make_mat("MakaiCrystal", 0x9E42F5, roughness=0.18, metallic=0.35, emission_hex=0x7B22D8, emission_strength=1.4)
    mat_lunar_stone = make_mat("LunarMarble", 0xDCE4F0, roughness=0.55)
    mat_gold_roof = make_mat("CelestialGold", 0xE5B84B, roughness=0.3, metallic=0.75)
    mat_jade = make_mat("LunarJade", 0x48A888, roughness=0.35, metallic=0.2)
    mat_vermilion = make_mat("ShrineVermilion", 0xC82822, roughness=0.55)
    mat_wood_dark = make_mat("DarkTimber", 0x382417, roughness=0.85)
    mat_plaster = make_mat("WhitePlaster", 0xEFECE4, roughness=0.8)
    mat_tile_dark = make_mat("KawaraTile", 0x2B2D34, roughness=0.65, metallic=0.15)
    mat_stone_lantern = make_mat("StoneLantern", 0x9C9890, roughness=0.85)
    mat_lantern_glow = make_mat("LanternGlow", 0xFFB84C, roughness=0.2, emission_hex=0xFFA028, emission_strength=2.5)
    mat_heaven_cloud = make_mat("HeavenCloud", 0xFFF8E4, roughness=0.65)
    mat_ice_crystal = make_mat("CirnoIce", 0x8CE8FF, roughness=0.15, emission_hex=0x52C8F5, emission_strength=0.8)
    mat_sunflower_gold = make_mat("SunflowerTerrace", 0xE2B428, roughness=0.6)

    # 1. MUSEUM DIORAMA BASE & BRASS TABLE FRAME
    HW = WORLD_W * 0.5
    HD = WORLD_D * 0.5
    add_box("CrustSlab", (0, 0, -16.0), (WORLD_W + 8, WORLD_D + 8, 30.0), mat_crust_earth)

    wall_t = 24.0
    wall_h = 44.0
    wall_z = -18.0
    add_box("FrameNorth", (0, HD + wall_t*0.5, wall_z), (WORLD_W + wall_t*2, wall_t, wall_h), mat_mahogany)
    add_box("FrameSouth", (0, -HD - wall_t*0.5, wall_z), (WORLD_W + wall_t*2, wall_t, wall_h), mat_mahogany)
    add_box("FrameEast", (HW + wall_t*0.5, 0, wall_z), (wall_t, WORLD_D, wall_h), mat_mahogany)
    add_box("FrameWest", (-HW - wall_t*0.5, 0, wall_z), (wall_t, WORLD_D, wall_h), mat_mahogany)

    rail_z = wall_z + wall_h*0.5 + 1.5
    add_box("BrassRailNorth", (0, HD + wall_t*0.5, rail_z), (WORLD_W + wall_t*2 + 4, wall_t - 6, 3.0), mat_brass)
    add_box("BrassRailSouth", (0, -HD - wall_t*0.5, rail_z), (WORLD_W + wall_t*2 + 4, wall_t - 6, 3.0), mat_brass)
    add_box("BrassRailEast", (HW + wall_t*0.5, 0, rail_z), (wall_t - 6, WORLD_D + 4, 3.0), mat_brass)
    add_box("BrassRailWest", (-HW - wall_t*0.5, 0, rail_z), (wall_t - 6, WORLD_D + 4, 3.0), mat_brass)

    # 2. SCULPTED YOUKAI MOUNTAIN JAGGED ALPINE SPIRES & STEPPED LIMESTONE ESCARPMENTS (`yokai mountain.png`)
    mat_limestone = make_mat("YoukaiLimestoneEscarpment", 0xDDD9D0, roughness=0.78)
    mat_autumn_red = make_mat("YoukaiAutumnMomijiRed", 0xD8381E, roughness=0.70)
    mat_autumn_orange = make_mat("YoukaiAutumnMomijiOrange", 0xE86A24, roughness=0.70)

    youkai_outcrops = [
        # Jagged High-Summit Alpine Snow Spires (`yokai mountain.png` & `mountain shrine.png`)
        (0.608, 0.082, (26, 18, 46), 11, 0.3, mat_snow),
        (0.658, 0.068, (32, 22, 54), 17, 0.1, mat_snow),
        (0.695, 0.078, (28, 20, 48), 23, -0.4, mat_snow),
        (0.588, 0.112, (24, 18, 38), 29, 0.6, mat_snow),
        (0.738, 0.112, (26, 18, 40), 31, -0.5, mat_snow),
        (0.598, 0.136, (28, 20, 34), 37, 0.2, mat_granite_dark),
        (0.742, 0.135, (28, 22, 34), 41, 0.9, mat_granite_dark),
        (0.575, 0.165, (30, 22, 26), 43, 0.3, mat_granite_mid),
        (0.752, 0.168, (30, 22, 26), 47, -0.7, mat_granite_mid),
        # Western Hakurei & Eastern Mayohiga Crags (clear of Three Fairies Tree at 0.285, 0.285)
        (0.205, 0.285, (34, 22, 24), 53, 0.5, mat_granite_mid),
        (0.195, 0.252, (28, 20, 20), 59, -0.4, mat_granite_dark),
        (0.925, 0.315, (32, 24, 26), 61, 0.9, mat_granite_mid),
        (0.895, 0.385, (26, 20, 20), 67, -0.3, mat_granite_dark),
    ]
    for idx, (nx, ny, sc, sd, rz, m) in enumerate(youkai_outcrops):
        bx, by, bz = norm_to_blender(nx, ny, -4.0)
        add_sculpted_rock_mass(f"YoukaiCliff_{idx}", (bx, by, bz), sc, m, seed_val=sd, rot_z=rz)

    # Stepped Pale-Limestone Foothill Escarpment along Southern Youkai Mountain (`yokai mountain.png` foreground white cliffs)
    escarpment_segs = [
        (0.585, 0.222, 36.0, 13.0, 15.0, 0.12),
        (0.615, 0.224, 42.0, 14.0, 17.0, 0.04),
        (0.652, 0.225, 46.0, 15.0, 18.0, -0.05),
        (0.715, 0.218, 48.0, 14.0, 16.0, -0.14),
        (0.592, 0.238, 38.0, 12.0, 10.0, 0.08),
        (0.635, 0.242, 44.0, 12.0, 10.0, -0.02),
    ]
    for idx, (nx, ny, ew, ed, eh, rz) in enumerate(escarpment_segs):
        bx, by, bz = norm_to_blender(nx, ny, -2.0)
        add_box(f"YoukaiLimestoneEscarpment_{idx}", (bx, by, bz + eh * 0.35), (ew, ed, eh), mat_limestone, rot=(0, 0, rz))

    # 3. SHEER CLIFF WATERFALL OF NINE HEAVENS & CRIMSON AUTUMN GORGE (`mountain shrine top shot.png` left)
    wf_steps = 18
    for i in range(wf_steps):
        t = i / (wf_steps - 1)
        nx = 0.682 * (1 - t) + 0.672 * t
        ny = 0.132 * (1 - t) + 0.228 * t
        bx, by, bz = norm_to_blender(nx, ny, 2.0)
        w_seg = 13.0 + t * 11.0
        add_box(f"NineHeavensCascade_{i}", (bx, by, bz), (w_seg, 15.5, 4.8), mat_water_fall, rot=(0.45, 0, 0.08))
        # Tall sheer cliff walls flanking the waterfall gorge
        add_box(f"WfSheerCliffL_{i}", (bx - w_seg * 0.85, by, bz + 2.0), (14.0, 14.0, 18.0), mat_granite_mid, rot=(0, 0, 0.1))
        add_box(f"WfSheerCliffR_{i}", (bx + w_seg * 0.85, by, bz + 2.0), (14.0, 14.0, 18.0), mat_granite_mid, rot=(0, 0, -0.1))
        if i % 2 == 0:
            # Crimson-red & orange autumn maple foliage crowning the waterfall cliff rims (`mountain shrine top shot.png`)
            m_aut = mat_autumn_red if (i % 4 == 0) else mat_autumn_orange
            add_sculpted_rock_mass(f"WfAutumnRimL_{i}", (bx - w_seg * 0.9, by, bz + 12.5), (7.5, 7.5, 5.2), m_aut, seed_val=150 + i)
            add_sculpted_rock_mass(f"WfAutumnRimR_{i}", (bx + w_seg * 0.9, by, bz + 12.5), (7.5, 7.5, 5.2), m_aut, seed_val=250 + i)
        if i % 3 == 1:
            add_cyl(f"WfFoam_{i}", (bx, by - 3.5, bz + 2.0), w_seg * 0.62, w_seg * 0.62, 2.4, mat_water_foam, vertices=12)

    br_bx, br_by, br_bz = norm_to_blender(0.676, 0.188, 6.5)
    add_box("TenguBridgeDeck", (br_bx, br_by, br_bz), (38.0, 5.5, 1.8), mat_vermilion)
    add_box("TenguBridgeRailN", (br_bx, br_by + 2.4, br_bz + 2.0), (38.0, 0.6, 2.4), mat_vermilion)
    add_box("TenguBridgeRailS", (br_bx, br_by - 2.4, br_bz + 2.0), (38.0, 0.6, 2.4), mat_vermilion)

    tw_bx, tw_by, tw_bz = norm_to_blender(0.642, 0.178, 0.0)
    add_box("TenguTowerBase", (tw_bx, tw_by, tw_bz + 6.0), (12.0, 12.0, 12.0), mat_granite_dark)
    add_box("TenguTowerBody", (tw_bx, tw_by, tw_bz + 16.0), (9.5, 9.5, 8.5), mat_plaster)
    add_pitched_roof("TenguTowerRoof1", (tw_bx, tw_by, tw_bz + 13.0), 11.5, 11.5, 4.2, mat_jade, overhang=2.0)
    add_pitched_roof("TenguTowerRoof2", (tw_bx, tw_by, tw_bz + 20.2), 9.5, 9.5, 5.0, mat_jade, overhang=2.4)

    px_b, py_b, pz_b = norm_to_blender(0.672, 0.232, 0.8)
    add_cyl("NineHeavensPlungePool", (px_b, py_b, pz_b), 22.0, 22.0, 2.4, mat_water_foam, vertices=16)

    # 4. GENBU RAVINE BASALT GORGE & KAPPA WORKSHOPS
    for i in range(18):
        t = i / 17.0
        nx = 0.565 + t * 0.145
        ny = 0.258 - t * 0.032
        for side in (-1, 1):
            ox = nx + side * 0.008
            oy = ny + side * 0.013
            bx, by, bz = norm_to_blender(ox, oy, 0.0)
            col_h = 12.0 + (i % 4) * 4.5
            add_cyl(f"GenbuBasalt_{i}_{side}", (bx, by, bz + col_h*0.4), 3.6, 3.6, col_h, mat_basalt, vertices=6)

    kb_x, kb_y, kb_z = norm_to_blender(0.618, 0.246, 5.5)
    add_box("GenbuBridge", (kb_x, kb_y, kb_z), (8.0, 32.0, 1.4), mat_wood_dark, rot=(0, 0, 0.22))
    kw_x, kw_y, kw_z = norm_to_blender(0.602, 0.268, 0.0)
    add_box("KappaWorkshopBody", (kw_x, kw_y, kw_z + 4.5), (14.0, 10.0, 8.0), mat_wood_dark)
    add_pitched_roof("KappaWorkshopRoof", (kw_x, kw_y, kw_z + 8.5), 16.0, 12.0, 4.5, mat_jade, overhang=1.8)
    add_cyl("KappaWaterwheel", (kw_x, kw_y + 6.2, kw_z + 4.5), 4.5, 4.5, 1.5, mat_wood_dark, vertices=12, rot=(1.57, 0, 0))

    # 5. NETHERWORLD GRAND STAIRWAY & SAIGYOU AYAKASHI GIANT WEEPING SAKURA
    stair_segs = 14
    for i in range(stair_segs):
        t = i / (stair_segs - 1)
        nx = 0.380
        ny = 0.138 * (1 - t) + 0.086 * t
        bx, by, bz = norm_to_blender(nx, ny, 0.5)
        add_box(f"NetherStair_{i}", (bx, by, bz), (16.0, 7.5, 3.5), mat_lunar_stone)
        if i % 3 == 0:
            for side in (-1, 1):
                lx = bx + side * 9.5
                add_box(f"NetherLanternPost_{i}_{side}", (lx, by, bz + 3.0), (1.4, 1.4, 4.5), mat_stone_lantern)
                add_box(f"NetherLanternLight_{i}_{side}", (lx, by, bz + 5.8), (1.8, 1.8, 1.6), mat_lantern_glow)
                add_pitched_roof(f"NetherLanternCap_{i}_{side}", (lx, by, bz + 6.6), 2.4, 2.4, 1.4, mat_stone_lantern, overhang=0.5)

    sa_x, sa_y, sa_z = norm_to_blender(0.352, 0.052, 0.0)
    add_cyl("SaigyouTrunkBase", (sa_x, sa_y, sa_z + 10.0), 6.2, 3.4, 22.0, mat_sakura_bark, vertices=10)
    for b_i in range(7):
        ang = b_i * (2.0 * math.pi / 7.0)
        bx_o = sa_x + math.cos(ang) * 11.0
        by_o = sa_y + math.sin(ang) * 11.0
        bz_o = sa_z + 20.0 + (b_i % 2) * 4.0
        add_sculpted_rock_mass(f"SaigyouCanopy_{b_i}", (bx_o, by_o, bz_o), (13.5, 13.5, 9.5), mat_sakura_pink, seed_val=300+b_i)
    add_sculpted_rock_mass("SaigyouCrownTop", (sa_x, sa_y, sa_z + 27.0), (18.0, 18.0, 11.0), mat_sakura_pink, seed_val=399)

    for i in range(14):
        ang = math.pi * 0.1 + (i / 13.0) * math.pi * 0.8
        nx = 0.380 + math.cos(ang) * 0.095
        ny = 0.068 + math.sin(ang) * 0.048
        bx, by, bz = norm_to_blender(nx, ny, -2.0)
        add_sculpted_rock_mass(f"NetherCloudCliff_{i}", (bx, by, bz), (18.0, 12.0, 9.0), mat_nether_cloud, seed_val=400+i, rot_z=ang)

    # 6. SANZU RIVER FERRY PIER & YAMA'S COURTHOUSE (HIGAN)
    ym_x, ym_y, ym_z = norm_to_blender(0.155, 0.095, 0.0)
    add_box("YamaCourthousePodium", (ym_x, ym_y, ym_z + 2.5), (42.0, 32.0, 5.0), mat_granite_mid)
    add_box("YamaMainHall", (ym_x, ym_y + 3.0, ym_z + 11.0), (30.0, 18.0, 12.0), mat_plaster)
    add_pitched_roof("YamaMainRoofLower", (ym_x, ym_y + 3.0, ym_z + 13.5), 34.0, 22.0, 6.0, mat_tile_dark, overhang=3.0)
    add_pitched_roof("YamaMainRoofUpper", (ym_x, ym_y + 3.0, ym_z + 19.5), 26.0, 16.0, 7.5, mat_vermilion, overhang=2.8)
    add_box("YamaGateL", (ym_x - 6.0, ym_y - 13.0, ym_z + 6.5), (2.2, 2.2, 9.0), mat_vermilion)
    add_box("YamaGateR", (ym_x + 6.0, ym_y - 13.0, ym_z + 6.5), (2.2, 2.2, 9.0), mat_vermilion)
    add_pitched_roof("YamaGateRoof", (ym_x, ym_y - 13.0, ym_z + 10.5), 16.0, 6.0, 4.2, mat_tile_dark, overhang=1.8)

    fp_x, fp_y, fp_z = norm_to_blender(0.245, 0.145, 0.5)
    add_box("SanzuFerryPier", (fp_x, fp_y, fp_z + 1.2), (18.0, 6.0, 2.0), mat_wood_dark)
    add_box("KomachiBoat", (fp_x + 14.0, fp_y - 4.0, fp_z + 0.8), (14.0, 4.2, 2.2), mat_wood_dark, rot=(0, 0, 0.35))

    # 7. HEAVEN OF BHAVA-AGRA FLOATING CELESTIAL ISLAND & PEACH PAVILION
    hv_x, hv_y, hv_z = norm_to_blender(0.525, 0.048, 42.0)
    add_sculpted_rock_mass("BhavaAgraCloudIsland", (hv_x, hv_y, hv_z - 5.0), (36.0, 24.0, 10.0), mat_heaven_cloud, seed_val=510)
    add_box("BhavaAgraPodium", (hv_x, hv_y, hv_z + 2.0), (24.0, 18.0, 3.5), mat_lunar_stone)
    add_box("BhavaAgraHall", (hv_x, hv_y, hv_z + 8.0), (16.0, 12.0, 8.5), mat_plaster)
    add_pitched_roof("BhavaAgraRoof", (hv_x, hv_y, hv_z + 12.2), 20.0, 16.0, 6.5, mat_gold_roof, overhang=2.8)
    add_sculpted_rock_mass("KeystoneFloating", (hv_x - 28.0, hv_y - 8.0, hv_z - 6.0), (11.0, 11.0, 7.0), mat_granite_mid, seed_val=515)

    # 8. FORMER HELL / OLD CAPITAL STREETS, BRIDGE & OBSIDIAN CRATER RIM
    hell_pts = [
        (0.045, 0.72), (0.065, 0.67), (0.115, 0.65), (0.175, 0.66),
        (0.225, 0.69), (0.255, 0.74), (0.265, 0.81), (0.245, 0.88),
        (0.195, 0.93), (0.125, 0.94), (0.065, 0.91), (0.040, 0.83)
    ]
    for idx, (nx, ny) in enumerate(hell_pts):
        bx, by, bz = norm_to_blender(nx, ny, -2.0)
        add_sculpted_rock_mass(f"HellObsidianCliff_{idx}", (bx, by, bz), (22.0, 16.0, 18.0 + (idx % 3)*5.0), mat_obsidian, seed_val=600+idx, rot_z=idx*0.5)

    oc_x, oc_y, oc_z = norm_to_blender(0.185, 0.735, 0.0)
    add_box("OldCapitalBridge", (oc_x, oc_y, oc_z + 3.5), (26.0, 6.5, 2.5), mat_granite_dark, rot=(0, 0, -0.3))
    for idx, (ox, oy, rot_z) in enumerate([(-18, 12, 0.2), (16, 14, -0.3), (-14, -15, 0.1), (18, -12, -0.2)]):
        bx_o = oc_x + ox
        by_o = oc_y + oy
        add_box(f"OniTavernBody_{idx}", (bx_o, by_o, oc_z + 5.0), (12.0, 9.0, 8.5), mat_wood_dark)
        add_pitched_roof(f"OniTavernRoof_{idx}", (bx_o, by_o, oc_z + 9.2), 14.0, 11.0, 4.8, mat_tile_dark, rot=(0, 0, rot_z), overhang=1.8)
        add_box(f"OniLantern_{idx}", (bx_o, by_o - 5.2, oc_z + 6.0), (1.6, 1.6, 2.2), mat_lantern_glow)

    for idx, (nx, ny, w, l, ang) in enumerate([
        (0.125, 0.845, 8.0, 65.0, 0.35),
        (0.165, 0.815, 6.5, 52.0, -0.45),
        (0.090, 0.795, 6.0, 48.0, 0.75),
    ]):
        bx, by, bz = norm_to_blender(nx, ny, 0.5)
        add_box(f"HellMagmaRiver_{idx}", (bx, by, bz), (w, l, 1.8), mat_lava_glow, rot=(0, 0, ang))

    # 9. MAKAI CRYSTALLINE RIFT & PRISMATIC ARCHES
    makai_coords = [
        (0.455, 0.855, 26.0), (0.482, 0.835, 32.0), (0.545, 0.842, 30.0),
        (0.575, 0.875, 24.0), (0.558, 0.925, 28.0), (0.475, 0.922, 25.0),
        (0.502, 0.895, 20.0), (0.532, 0.905, 22.0),
    ]
    for idx, (nx, ny, ch) in enumerate(makai_coords):
        bx, by, bz = norm_to_blender(nx, ny, -1.0)
        tilt_x = ((idx % 3) - 1) * 0.22
        tilt_y = (((idx + 1) % 3) - 1) * 0.22
        add_cyl(f"MakaiCrystal_{idx}", (bx, by, bz + ch*0.42), 4.2, 0.4, ch, mat_makai_crystal, vertices=6, rot=(tilt_x, tilt_y, idx*0.5))

    # 10. LUNAR CAPITAL PAVILIONS, JADE BRIDGE & SCULPTED CRATER RIDGE
    for i in range(10):
        ang = -0.3 + (i / 9.0) * math.pi * 1.1
        nx = 0.915 + math.cos(ang) * 0.068
        ny = 0.105 - math.sin(ang) * 0.048
        if 0.01 < nx < 0.99 and 0.01 < ny < 0.99:
            bx, by, bz = norm_to_blender(nx, ny, -2.0)
            add_sculpted_rock_mass(f"LunarCraterRidge_{i}", (bx, by, bz), (16.0, 11.0, 9.5), mat_lunar_stone, seed_val=700+i, rot_z=ang)

    lc_x, lc_y, lc_z = norm_to_blender(0.885, 0.125, 0.0)
    add_box("LunarJadeBridge", (lc_x, lc_y, lc_z + 2.5), (24.0, 6.0, 2.2), mat_jade, rot=(0, 0, 0.4))
    for side in (-1, 1):
        px = lc_x + side * 22.0
        py = lc_y + side * 10.0
        add_cyl(f"LunarTowerPodium_{side}", (px, py, lc_z + 2.5), 9.0, 9.0, 4.5, mat_lunar_stone, vertices=8)
        add_cyl(f"LunarTowerBody_{side}", (px, py, lc_z + 10.0), 6.5, 6.5, 11.0, mat_plaster, vertices=8)
        add_cyl(f"LunarTowerRoof1_{side}", (px, py, lc_z + 16.5), 9.5, 1.0, 4.5, mat_gold_roof, vertices=8)

    # 11. MISTY LAKE SCARLET PIER, BOATHOUSE & CIRNO'S ICE CRYSTALS
    mp_x, mp_y, _ = norm_to_blender(0.762, 0.765, 0.0)
    add_box("MistyLakeScarletPier", (mp_x, mp_y, 3.4), (24.0, 5.0, 1.2), mat_wood_dark, rot=(0, 0, 0.25))
    add_box("MistyLakeBoat", (mp_x - 14.0, mp_y - 4.0, 2.7), (10.0, 3.6, 1.6), mat_wood_dark, rot=(0, 0, 0.6))
    # Cirno's Ice Crystals on Southern Misty Lake Shore (0.655, 0.875)
    ci_x, ci_y, ci_z = norm_to_blender(0.655, 0.875, 0.0)
    for idx, (ox, oy, ch, tx) in enumerate([(0, 0, 14.0, 0.15), (-8, 3, 10.5, -0.25), (8, -2, 11.5, 0.22)]):
        add_cyl(f"CirnoIceCrystal_{idx}", (ci_x + ox, ci_y + oy, ci_z + ch*0.4), 2.8, 0.3, ch, mat_ice_crystal, vertices=6, rot=(tx, -tx, idx))

    # 12. GARDEN OF THE SUN TERRACES & MAYOHIGA SHRINE
    gs_x, gs_y, gs_z = norm_to_blender(0.285, 0.725, 0.0)
    for idx, (ox, oy) in enumerate([(-22, -14), (0, -16), (22, -14), (-16, 14), (16, 14)]):
        add_box(f"SunflowerBed_{idx}", (gs_x + ox, gs_y + oy, gs_z + 0.8), (16.0, 10.0, 1.2), mat_sunflower_gold, rot=(0, 0, idx*0.2))

    # 13. GREAT HAKUREI BARRIER CARDINAL TORII GATES
    def add_grand_barrier_torii(name, loc, scale_s, rot_z):
        x, y, z = loc
        p_dist = 9.0 * scale_s
        p_h = 22.0 * scale_s
        p_r = 1.3 * scale_s
        ca = math.cos(rot_z)
        sa = math.sin(rot_z)
        for side in (-1, 1):
            lx = x + side * p_dist * ca
            ly = y + side * p_dist * sa
            add_cyl(f"{name}_Pillar_{side}", (lx, ly, z + p_h*0.5), p_r, p_r, p_h, mat_vermilion, vertices=12)
            add_cyl(f"{name}_Base_{side}", (lx, ly, z + 1.5*scale_s), p_r*1.45, p_r*1.45, 3.0*scale_s, mat_granite_dark, vertices=10)
        add_box(f"{name}_Kasagi", (x, y, z + p_h + 1.2*scale_s), (26.0*scale_s, 2.8*scale_s, 2.4*scale_s), mat_vermilion, rot=(0, 0, rot_z))
        add_box(f"{name}_Shimaki", (x, y, z + p_h + 2.6*scale_s), (28.0*scale_s, 3.2*scale_s, 1.4*scale_s), mat_tile_dark, rot=(0, 0, rot_z))
        add_box(f"{name}_Nuki", (x, y, z + p_h*0.76), (22.0*scale_s, 1.8*scale_s, 1.6*scale_s), mat_vermilion, rot=(0, 0, rot_z))

    add_grand_barrier_torii("HakureiApproachTorii", norm_to_blender(0.312, 0.365, 0.0), 1.15, 0.55)
    add_grand_barrier_torii("MoriyaMountainTorii", norm_to_blender(0.635, 0.165, 0.0), 1.15, 0.15)
    add_grand_barrier_torii("MyourenApproachTorii", norm_to_blender(0.415, 0.555, 0.0), 0.95, -0.35)
    add_grand_barrier_torii("BambooTrailTorii", norm_to_blender(0.755, 0.465, 0.0), 0.95, 1.15)

    # 14. ABANDONED OUTSIDE WORLD RADIO TOWER IN FOREST OF MAGIC (`RadioTower.png`)
    rt_x, rt_y, rt_z = norm_to_blender(0.535, 0.652, 0.0)
    mat_steel_tower = make_mat("DioramaRadioSteel", 0xE2E5EC, roughness=0.55, metallic=0.45)
    mat_rust_tower = make_mat("DioramaRadioRust", 0x785038, roughness=0.78, metallic=0.25)
    mat_vine_tower = make_mat("DioramaRadioVines", 0x3E702E, roughness=0.82)
    for lvl in range(6):
        t0 = lvl / 6.0
        t1 = (lvl + 1) / 6.0
        zm = rt_z + 1.0 + (t0 + t1) * 0.5 * 28.0
        wm = 3.8 * (1.0 - (t0 + t1) * 0.5) + 0.75 * ((t0 + t1) * 0.5)
        for cx in (-1, 1):
            for cy in (-1, 1):
                add_box(f"FOMRadioLeg_{lvl}_{cx}_{cy}", (rt_x + cx * wm, rt_y + cy * wm, zm), (0.38, 0.38, 5.0), mat_steel_tower if lvl % 2 == 0 else mat_rust_tower, rot=(cy * 0.09, -cx * 0.09, 0))
        add_box(f"FOMRadioRingX_{lvl}", (rt_x, rt_y + wm, zm + 2.2), (wm * 2.1, 0.32, 0.32), mat_steel_tower)
        add_box(f"FOMRadioRingY_{lvl}", (rt_x + wm, rt_y, zm + 2.2), (0.32, wm * 2.1, 0.32), mat_steel_tower)
        add_sculpted_rock_mass(f"FOMRadioVine_{lvl}", (rt_x + math.cos(lvl * 1.6) * wm, rt_y + math.sin(lvl * 1.6) * wm, zm), (1.3, 1.3, 1.2), mat_vine_tower, seed_val=910 + lvl)
    add_cyl("FOMRadioSpire", (rt_x, rt_y, rt_z + 32.5), 0.16, 0.05, 7.0, mat_steel_tower, vertices=8)

    # BAKE & MERGE ALL 240+ OBJECTS INTO 2 ULTRA-FAST VERTEX-COLORED MESHES!
    bake_and_merge_scene("WorldDiorama")

    blend_path = os.path.join(BLEND_DIR, "gensokyo-diorama-dressings.blend")
    glb_path = os.path.join(OUT_DIR, "gensokyo-diorama-dressings.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_MERGED_DIORAMA:", glb_path)

def build_human_village_compound():
    clear_scene()

    mat_stone = make_mat("VillageCobble", 0x8A8378, roughness=0.88)
    mat_street_ochre = make_mat("VillageStreetOchre", 0xD8BC8E, roughness=0.86)
    mat_timber = make_mat("VillageTimber", 0x3B2516, roughness=0.85)
    mat_plaster = make_mat("VillagePlaster", 0xF2EDE2, roughness=0.8)
    mat_tile_slate = make_mat("VillageTileSlate", 0x262930, roughness=0.62, metallic=0.12)
    mat_tile_warm = make_mat("VillageTileWarm", 0x6C442A, roughness=0.7)
    mat_vermilion = make_mat("VillageBridgeRed", 0xC82E24, roughness=0.52)
    mat_bronze = make_mat("DragonBronze", 0x4A6B5D, roughness=0.38, metallic=0.75)
    mat_canal_water = make_mat("CanalWater", 0x2E7BB5, roughness=0.15, metallic=0.25)
    mat_paddy_water = make_mat("PaddyTerrace", 0x6A9E48, roughness=0.35, metallic=0.15)
    mat_tree_green = make_mat("VillageTreeGreen", 0x3E7432, roughness=0.8)
    mat_lantern = make_mat("VillageLantern", 0xFFB444, roughness=0.2, emission_hex=0xFFA020, emission_strength=2.2)

    # Ochre-tan main thoroughfares & Dragon Plaza (`Humanvillage-thumb.png`)
    add_box("VillageMainAveNS", (0, -2.0, 0.18), (11.0, 78.0, 0.36), mat_street_ochre)
    add_box("VillageMainAveEW", (0, 0.0, 0.20), (88.0, 10.0, 0.38), mat_street_ochre)
    add_box("DragonPlazaPaving", (0, 0, 0.3), (26.0, 26.0, 0.6), mat_stone)
    add_box("DragonPedestal1", (0, 0, 1.5), (7.0, 7.0, 2.2), mat_stone)
    add_box("DragonPedestal2", (0, 0, 3.4), (4.8, 4.8, 2.0), mat_stone)
    add_cyl("DragonBronzePillar", (0, 0, 7.2), 1.3, 0.9, 6.2, mat_bronze, vertices=10)
    add_sculpted_rock_mass("DragonStatueCoils", (0, 0, 10.5), (2.8, 2.2, 3.2), mat_bronze, seed_val=88)

    # Southern Canal + Twin Vermilion Bridges
    add_box("VillageCanalWater", (0, -18.0, 0.15), (98.0, 7.5, 0.3), mat_canal_water)
    add_box("VillageCanalBankN", (0, -14.0, 0.5), (98.0, 1.2, 1.0), mat_stone)
    add_box("VillageCanalBankS", (0, -22.0, 0.5), (98.0, 1.2, 1.0), mat_stone)
    for bx_br in (-18.0, 18.0):
        add_box(f"CanalBridge_{bx_br}", (bx_br, -18.0, 1.4), (5.5, 10.0, 0.9), mat_vermilion)
        add_box(f"CanalBridgeRailL_{bx_br}", (bx_br - 2.4, -18.0, 2.3), (0.4, 10.0, 1.2), mat_vermilion)
        add_box(f"CanalBridgeRailR_{bx_br}", (bx_br + 2.4, -18.0, 2.3), (0.4, 10.0, 1.2), mat_vermilion)

    # Eastern River & Twin Arched Vermilion Bridges (`Humanvillage-thumb.png` right side)
    add_box("EastRiverWater", (46.0, 2.0, 0.16), (8.5, 76.0, 0.32), mat_canal_water)
    add_box("EastRiverBankW", (41.5, 2.0, 0.5), (1.2, 76.0, 1.0), mat_stone)
    add_box("EastRiverBankE", (50.5, 2.0, 0.5), (1.2, 76.0, 1.0), mat_stone)
    for by_br in (-6.0, 18.0):
        add_box(f"EastRiverBridge_{by_br}", (46.0, by_br, 1.45), (11.0, 5.2, 0.9), mat_vermilion)
        add_box(f"EastRiverRailN_{by_br}", (46.0, by_br + 2.3, 2.35), (11.0, 0.4, 1.2), mat_vermilion)
        add_box(f"EastRiverRailS_{by_br}", (46.0, by_br - 2.3, 2.35), (11.0, 0.4, 1.2), mat_vermilion)

    # Walled Garden Koi Pond & Arched Vermilion Bridge inside NW Quarter (`Humanvillage-thumb.png` left side)
    add_box("NWCompoundPond", (-26.0, 16.0, 0.25), (15.0, 11.0, 0.4), mat_canal_water)
    add_box("NWCompoundRedBridge", (-24.0, 16.0, 1.2), (3.4, 7.2, 0.6), mat_vermilion, rot=(0, 0, 0.35))
    add_box("NWCompoundWallN", (-26.0, 22.5, 1.8), (22.0, 0.9, 2.6), mat_plaster)
    add_pitched_roof("NWCompoundWallRoofN", (-26.0, 22.5, 3.2), 22.4, 1.5, 0.8, mat_tile_slate, overhang=0.3)

    # Watchtower (Yagura) with Bronze Fire Bell
    add_box("WatchtowerFrame", (15.0, 11.0, 8.0), (4.5, 4.5, 16.0), mat_timber)
    add_box("WatchtowerDeck", (15.0, 11.0, 15.5), (6.0, 6.0, 1.0), mat_timber)
    add_pitched_roof("WatchtowerRoof", (15.0, 11.0, 18.5), 6.2, 6.2, 3.2, mat_tile_slate, overhang=1.4)
    add_box("WatchtowerBell", (15.0, 11.0, 17.0), (1.4, 1.4, 1.8), mat_bronze)

    # Dense rows of charcoal-black and cedar-brown roofed Machiya Townhouses (`Humanvillage-thumb.png`)
    houses = [
        (-36, 28, 12, 8.5, 6.8, 0.0, True), (-18, 28, 10.5, 8, 5.8, 0.0, False),
        (  0, 28, 14.5, 9.5, 7.8, 0.0, True), ( 18, 28, 10.5, 8, 6.2, 0.0, False), ( 33, 28, 11.5, 8.5, 6.6, 0.0, True),
        (-38,  7, 10.5, 9, 6.5, 1.57, True), (-14, 14, 9.5, 8, 5.6, 0.0, False),
        ( 24,  7, 9.5, 8, 5.8, 0.0, True),   ( 35,  7, 10.5, 9, 6.5, 1.57, False),
        (-38, -7, 10.5, 8.5, 6.0, 1.57, False), (-24, -7, 9.5, 7.5, 5.4, 0.0, True),
        ( 24, -7, 9.5, 7.5, 5.6, 0.0, False),  ( 35, -7, 10.5, 8.5, 6.4, 1.57, True),
        (-34, -30, 11.5, 8.5, 6.2, 0.0, True), (-19, -30, 10.5, 8, 5.6, 0.0, False),
        (  0, -31, 13.5, 9, 7.2, 0.0, True), ( 19, -30, 10.5, 8, 5.6, 0.0, False), ( 34, -30, 11.5, 8.5, 6.4, 0.0, True),
    ]
    for idx, (hx, hy, hw, hd, hh, rz, is_two_story) in enumerate(houses):
        add_box(f"MachiyaBase_{idx}", (hx, hy, 0.5), (hw + 0.8, hd + 0.8, 1.0), mat_stone, rot=(0,0,rz))
        add_box(f"MachiyaWall_{idx}", (hx, hy, 1.0 + hh*0.5), (hw, hd, hh), mat_plaster, rot=(0,0,rz))
        add_box(f"MachiyaTimber_{idx}", (hx, hy, 1.0 + hh*0.5), (hw + 0.2, hd + 0.2, hh * 0.35), mat_timber, rot=(0,0,rz))
        t_mat = mat_tile_slate if idx % 3 != 0 else mat_tile_warm
        add_pitched_roof(f"MachiyaRoof_{idx}", (hx, hy, 1.0 + hh), hw, hd, 3.6, t_mat, rot=(0,0,rz), overhang=1.3)
        if is_two_story:
            add_box(f"MachiyaUpper_{idx}", (hx, hy, 1.0 + hh + 2.2), (hw*0.72, hd*0.72, 3.2), mat_plaster, rot=(0,0,rz))
            add_pitched_roof(f"MachiyaRoof2_{idx}", (hx, hy, 1.0 + hh + 3.8), hw*0.75, hd*0.75, 3.0, t_mat, rot=(0,0,rz), overhang=1.2)
        add_box(f"MachiyaLantern_{idx}", (hx, hy - hd*0.52, 3.2), (0.9, 0.9, 1.3), mat_lantern)

    # Lush Green Village Courtyard & Riverbank Trees (`Humanvillage-thumb.png`)
    for idx, (tx, ty, tr) in enumerate([
        (-32, 16, 3.2), (-18, 19, 2.8), (-11, 10, 2.6), (11, 16, 2.9),
        (39, 14, 3.0), (39, -14, 2.8), (-12, -12, 2.7), (12, -12, 2.7),
    ]):
        add_cyl(f"VillageTreeTrunk_{idx}", (tx, ty, 2.2), 0.55, 0.4, 4.4, mat_timber, vertices=7)
        add_sculpted_rock_mass(f"VillageTreeCrown_{idx}", (tx, ty, 5.2), (tr, tr, tr * 0.82), mat_tree_green, seed_val=500 + idx)

    for idx, (px, py, pw, pd, pz) in enumerate([
        (-28, -46, 22, 12, 0.2), (-2, -46, 22, 12, 0.2), (24, -46, 22, 12, 0.2),
        (-28, -60, 22, 12, -0.4), (-2, -60, 22, 12, -0.4), (24, -60, 22, 12, -0.4),
    ]):
        add_box(f"PaddyBerms_{idx}", (px, py, pz), (pw + 1.5, pd + 1.5, 0.7), mat_timber)
        add_box(f"PaddyWater_{idx}", (px, py, pz + 0.2), (pw, pd, 0.5), mat_paddy_water)

    for g_idx, gy in enumerate((38.0, -39.0)):
        add_box(f"VillageGateL_{g_idx}", (-5.5, gy, 4.5), (1.4, 1.4, 9.0), mat_timber)
        add_box(f"VillageGateR_{g_idx}", ( 5.5, gy, 4.5), (1.4, 1.4, 9.0), mat_timber)
        add_pitched_roof(f"VillageGateRoof_{g_idx}", (0.0, gy, 8.8), 14.0, 4.0, 3.2, mat_tile_slate, overhang=1.4)

    # BAKE & MERGE ALL 150+ VILLAGE OBJECTS INTO 2 MESHES!
    bake_and_merge_scene("HumanVillage")

    blend_path = os.path.join(BLEND_DIR, "human-village.blend")
    glb_path = os.path.join(OUT_DIR, "human-village.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_MERGED_VILLAGE:", glb_path)

if __name__ == "__main__":
    build_world_diorama()
    build_human_village_compound()

