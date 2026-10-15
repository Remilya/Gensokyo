import bpy
import bmesh
import math
import os
from mathutils import Vector, Matrix, Euler, noise

OUT_DIR = r"d:\Touhou RPG Refined\GensokyoMaps\public\models"
BLEND_DIR = r"d:\Touhou RPG Refined\GensokyoMaps\blender-sources"
os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(BLEND_DIR, exist_ok=True)


def clear_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for m in list(bpy.data.meshes):
        if m.users == 0:
            bpy.data.meshes.remove(m)
    for mat in list(bpy.data.materials):
        if mat.users == 0:
            bpy.data.materials.remove(mat)


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
    Guarantees 1-2 draw calls per landmark in Three.js!
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


def add_box(name, loc, dims, mat, rot=(0, 0, 0)):
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


def add_cyl(name, loc, r_bot, r_top, depth, mat, vertices=10, rot=(0, 0, 0)):
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


def add_irimoya_roof(name, loc, width, depth, height, mat, ridge_mat=None, rot=(0, 0, 0), overhang=1.4, hip_factor=0.68, curve_lift=0.45):
    """
    Creates an authentic Japanese curved hip-and-gable (irimoya) roof with upturned eaves
    and optional ornamental ridge beam.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    hw = (width * 0.5) + overhang
    hd = (depth * 0.5) + overhang
    mw = hw * 0.82
    md = hd * 0.72
    rw = hw * hip_factor
    mh = height * 0.42

    # Base upturned eave ring
    b0 = bm.verts.new((-hw, -hd, curve_lift))
    b1 = bm.verts.new((0.0, -hd * 0.96, 0.0))
    b2 = bm.verts.new((hw, -hd, curve_lift))
    b3 = bm.verts.new((hw * 0.96, 0.0, 0.0))
    b4 = bm.verts.new((hw, hd, curve_lift))
    b5 = bm.verts.new((0.0, hd * 0.96, 0.0))
    b6 = bm.verts.new((-hw, hd, curve_lift))
    b7 = bm.verts.new((-hw * 0.96, 0.0, 0.0))

    # Mid slope ring (gives curved Japanese roof profile)
    m0 = bm.verts.new((-mw, -md, mh))
    m1 = bm.verts.new((mw, -md, mh))
    m2 = bm.verts.new((mw, md, mh))
    m3 = bm.verts.new((-mw, md, mh))

    # Top ridge
    r0 = bm.verts.new((-rw, 0.0, height))
    r1 = bm.verts.new((rw, 0.0, height))

    # Lower skirt faces
    bm.faces.new((b0, b1, m1, m0))
    bm.faces.new((b1, b2, m1))
    bm.faces.new((b2, b3, m2, m1))
    bm.faces.new((b3, b4, m2))
    bm.faces.new((b4, b5, m3, m2))
    bm.faces.new((b5, b6, m3))
    bm.faces.new((b6, b7, m0, m3))
    bm.faces.new((b7, b0, m0))

    # Upper gable/hip faces
    bm.faces.new((m0, m1, r1, r0))
    bm.faces.new((m2, m3, r0, r1))
    bm.faces.new((m3, m0, r0))
    bm.faces.new((m1, m2, r1))

    # Underside soffit closure
    bm.faces.new((b0, b7, b6, b5, b4, b3, b2, b1))

    bm.to_mesh(mesh)
    bm.free()
    obj.location = loc
    obj.rotation_euler = rot
    assign_mat(obj, mat)

    if ridge_mat is not None:
        add_box(f"{name}_Ridge", (loc[0], loc[1], loc[2] + height + 0.25), (rw * 2.08, 0.55, 0.55), ridge_mat, rot=rot)
    return obj


def add_sculpted_crag(name, loc, scale_xyz, mat, seed_val=1, rot_z=0.0, sharpness=1.35):
    """Creates a jagged alpine crag / rock formation with sharp vertical ridges."""
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
    sx, sy, sz = scale_xyz
    for v in bm.verts:
        if v.co.z < -0.25:
            v.co.z = -0.3
        else:
            p = Vector((v.co.x * 1.9 + seed_val, v.co.y * 1.9 + seed_val * 0.7, v.co.z * 1.5))
            n = abs(noise.noise(p))
            ridge = 1.0 - abs(noise.noise(p * 2.3))
            taper = max(0.25, 1.0 - max(0.0, v.co.z) * 0.45)
            factor = (0.72 + 0.48 * n + 0.42 * ridge) * taper
            v.co.x *= factor
            v.co.y *= factor
            if v.co.z > 0:
                v.co.z = pow(v.co.z, 0.85) * (0.9 + 0.65 * ridge * sharpness)
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz
    bm.to_mesh(mesh)
    bm.free()
    obj.location = loc
    obj.rotation_euler = (0, 0, rot_z)
    assign_mat(obj, mat)
    return obj


def add_weeping_tree(name, loc, trunk_h, trunk_r, canopy_r, mat_bark, mat_leaf, mat_leaf_accent=None, seed_val=10):
    """Builds a gnarled weeping sakura or autumn momiji tree with multi-layered cascading foliage clouds."""
    x, y, z = loc
    add_cyl(f"{name}_TrunkBase", (x, y, z + trunk_h * 0.28), trunk_r * 1.35, trunk_r * 0.85, trunk_h * 0.56, mat_bark, vertices=8)
    add_cyl(f"{name}_TrunkUpper", (x + trunk_r * 0.2, y - trunk_r * 0.15, z + trunk_h * 0.72), trunk_r * 0.85, trunk_r * 0.45, trunk_h * 0.55, mat_bark, vertices=7, rot=(0.12, 0.15, 0))

    # Main crown + 6 weeping outer blossom clusters
    add_sculpted_crag(f"{name}_CrownTop", (x, y, z + trunk_h * 1.02), (canopy_r * 0.95, canopy_r * 0.95, canopy_r * 0.58), mat_leaf, seed_val=seed_val, sharpness=0.6)
    for i in range(6):
        ang = i * (math.pi * 2.0 / 6.0) + (seed_val * 0.3)
        dist = canopy_r * 0.68
        cx = x + math.cos(ang) * dist
        cy = y + math.sin(ang) * dist
        cz = z + trunk_h * 0.82 - (i % 2) * (canopy_r * 0.18)
        m_use = mat_leaf_accent if (mat_leaf_accent and i % 2 == 1) else mat_leaf
        add_sculpted_crag(f"{name}_Bough_{i}", (cx, cy, cz), (canopy_r * 0.62, canopy_r * 0.62, canopy_r * 0.48), m_use, seed_val=seed_val + i + 1, rot_z=ang, sharpness=0.55)


def add_pagoda(name, loc, stories, base_w, story_h, mat_wall, mat_timber, mat_roof, mat_gold, mat_glow=None):
    """Builds a multi-story Japanese pagoda with turquoise/jade roofs and golden finial spire."""
    x, y, z = loc
    add_box(f"{name}_Podium", (x, y, z + 1.1), (base_w + 2.2, base_w + 2.2, 2.2), mat_timber)
    cur_z = z + 2.2
    for s in range(stories):
        t = 1.0 - s * 0.11
        w = base_w * t
        h = story_h * (1.0 - s * 0.05)
        add_box(f"{name}_Core_{s}", (x, y, cur_z + h * 0.5), (w, w, h), mat_wall)
        add_box(f"{name}_Frame_{s}", (x, y, cur_z + h * 0.5), (w + 0.25, w + 0.25, h * 0.28), mat_timber)
        if mat_glow and s % 2 == 0:
            add_box(f"{name}_Win_{s}", (x, y, cur_z + h * 0.55), (w + 0.32, w * 0.42, h * 0.38), mat_glow)
        add_irimoya_roof(
            f"{name}_Roof_{s}",
            (x, y, cur_z + h - 0.15),
            w + 0.6,
            w + 0.6,
            h * 0.72,
            mat_roof,
            ridge_mat=mat_gold if s == stories - 1 else None,
            overhang=1.35 * t,
            hip_factor=0.35,
            curve_lift=0.35 * t,
        )
        cur_z += h + 0.35
    # Tall golden Sorin spire on top
    add_cyl(f"{name}_Sorin", (x, y, cur_z + 2.8), 0.35, 0.08, 4.8, mat_gold, vertices=8)


# ==============================================================================
# 1. MORIYA SHRINE SUMMIT COMPLEX (`moriya-shrine.glb`)
# Reference: `mountain shrine ref birds eye.png`, `mountain shrine refs.png`, `mountain shrine.png`
# ==============================================================================
def build_moriya_shrine_ref():
    clear_scene()

    mat_stone = make_mat("MoriyaStone", 0x8C877E, roughness=0.86)
    mat_stone_light = make_mat("MoriyaCourtyardSnowStone", 0xE6E2DC, roughness=0.72)
    mat_crag_rock = make_mat("MoriyaCragRock", 0x68645E, roughness=0.88)
    mat_snow = make_mat("MoriyaAlpineSnow", 0xF4F2EE, roughness=0.62)
    mat_timber = make_mat("MoriyaDarkTimber", 0x3A2416, roughness=0.82)
    mat_plaster = make_mat("MoriyaPlaster", 0xF2EFE6, roughness=0.78)
    mat_turquoise = make_mat("MoriyaTurquoiseRoof", 0x18988B, roughness=0.46, metallic=0.14)
    mat_turquoise_deep = make_mat("MoriyaTurquoiseDeep", 0x11756B, roughness=0.50, metallic=0.14)
    mat_gold = make_mat("MoriyaGold", 0xE5B842, roughness=0.28, metallic=0.82)
    mat_vermilion = make_mat("MoriyaVermilion", 0xC82C22, roughness=0.55)
    mat_sakura_pink = make_mat("MoriyaSakuraPink", 0xF29EC0, roughness=0.68)
    mat_sakura_light = make_mat("MoriyaSakuraLight", 0xF9C6DC, roughness=0.68)
    mat_glow = make_mat("MoriyaWindowGlow", 0xFFB444, roughness=0.2, emission_hex=0xFFA024, emission_strength=2.4)

    # 1. Stepped Summit Courtyard & Retaining Bastions (kept <= 1.4m at front/center so characters stand on top!)
    add_box("SummitMainBastion", (0.0, 0.0, 0.5), (34.0, 30.0, 1.0), mat_stone)
    add_box("SummitSnowCourtyard", (0.0, 0.0, 1.05), (31.5, 27.5, 0.2), mat_stone_light)

    # Upper Sanctum Terrace (North side, y > 4)
    add_box("UpperSanctumTerrace", (0.0, 8.5, 2.2), (26.0, 14.0, 2.4), mat_stone)
    for s in range(5):
        add_box(f"SanctumStair_{s}", (0.0, 0.8 + s * 0.65, 1.15 + s * 0.42), (6.5, 0.75, 0.45), mat_stone_light)

    # 2. Grand Turquoise-Roofed Haiden & Honden (Summit Sanctum from `mountain shrine ref birds eye.png`)
    # Haiden (Front Worship Hall)
    add_box("HaidenBody", (0.0, 6.8, 6.2), (18.5, 9.2, 5.8), mat_plaster)
    add_box("HaidenTimberFrame", (0.0, 6.8, 6.2), (18.9, 9.6, 2.2), mat_timber)
    add_box("HaidenShojiGlow", (0.0, 2.15, 6.4), (14.0, 0.3, 3.2), mat_glow)
    add_irimoya_roof("HaidenRoofLower", (0.0, 6.8, 8.8), 20.5, 11.2, 3.6, mat_turquoise, ridge_mat=mat_gold, overhang=2.2)
    add_box("HaidenUpperCore", (0.0, 6.8, 11.4), (13.5, 6.8, 3.2), mat_plaster)
    add_box("HaidenUpperGlow", (0.0, 3.35, 11.5), (10.2, 0.3, 1.8), mat_glow)
    add_irimoya_roof("HaidenRoofUpper", (0.0, 6.8, 12.8), 15.2, 8.4, 4.2, mat_turquoise_deep, ridge_mat=mat_gold, overhang=2.4)

    # Honden (Rear Elevated Sanctum Tower with Turquoise Pavilion Crown)
    add_box("HondenPodium", (7.5, 11.5, 5.2), (10.5, 9.5, 4.2), mat_stone)
    add_box("HondenBody", (7.5, 11.5, 9.8), (8.8, 8.0, 5.5), mat_plaster)
    add_irimoya_roof("HondenRoof1", (7.5, 11.5, 12.2), 10.4, 9.6, 3.4, mat_turquoise, ridge_mat=mat_gold, overhang=1.8)
    add_box("HondenUpper", (7.5, 11.5, 15.0), (6.4, 5.8, 3.6), mat_timber)
    add_box("HondenGlow", (7.5, 8.5, 15.0), (4.5, 0.3, 2.2), mat_glow)
    add_irimoya_roof("HondenRoof2", (7.5, 11.5, 16.6), 7.8, 7.2, 3.8, mat_turquoise_deep, ridge_mat=mat_gold, overhang=2.0)

    # 3. Cantilevered Kakezukuri Cliffside Wing (`mountain shrine refs.png` upper-left stilt hall)
    add_box("CantileverSubStructure", (-10.5, 9.5, 4.8), (9.5, 8.2, 4.5), mat_timber)
    for sx in (-14.2, -10.5, -6.8):
        for sy in (6.0, 12.8):
            add_box(f"KakezukuriStilt_{sx}_{sy}", (sx, sy, 3.8), (0.65, 0.65, 7.5), mat_timber)
    add_box("CantileverHallBody", (-10.5, 9.5, 9.2), (10.2, 8.8, 4.8), mat_plaster)
    add_box("CantileverHallGlow", (-10.5, 5.05, 9.4), (7.8, 0.3, 2.6), mat_glow)
    add_irimoya_roof("CantileverRoof1", (-10.5, 9.5, 11.4), 11.6, 10.0, 3.5, mat_turquoise, ridge_mat=mat_gold, overhang=2.0)
    add_box("CantileverTower", (-13.5, 11.5, 14.5), (4.8, 4.8, 4.2), mat_plaster)
    add_irimoya_roof("CantileverTowerRoof", (-13.5, 11.5, 16.5), 5.8, 5.8, 3.2, mat_turquoise_deep, ridge_mat=mat_gold, overhang=1.6)

    # 4. Twin 5-Story Turquoise Pagodas (`mountain shrine ref birds eye.png` NE ridge & SW bastion)
    add_pagoda("EastSummitPagoda", (15.5, 9.5, 1.0), 5, 5.2, 2.3, mat_plaster, mat_timber, mat_turquoise, mat_gold, mat_glow)
    add_pagoda("SouthwestOverlookPagoda", (-14.5, -11.5, 0.4), 5, 4.8, 2.1, mat_plaster, mat_timber, mat_turquoise_deep, mat_gold, mat_glow)

    # 5. Western Circular Stone Overlook & Giant Weeping Sakura Tree (`mountain shrine ref birds eye.png` left)
    add_cyl("SakuraOverlookStep1", (-21.0, 1.5, 0.6), 8.2, 8.8, 1.2, mat_stone, vertices=16)
    add_cyl("SakuraOverlookStep2", (-21.0, 1.5, 1.4), 6.8, 7.2, 0.8, mat_stone_light, vertices=16)
    add_weeping_tree("SummitWeepingSakura", (-21.5, 2.0, 1.8), 8.5, 1.15, 6.2, mat_timber, mat_sakura_pink, mat_sakura_light, seed_val=77)

    # 6. Covered Cloisters (`Kairo`), Outer Romon Gatehouse & Courtyard Lanterns
    # South Outer Gatehouse (Romon) at y = -13.5 (leaving central courtyard y in [-10..+2] wide open!)
    add_box("RomonGateL", (-3.8, -13.5, 3.6), (2.4, 3.2, 5.2), mat_plaster)
    add_box("RomonGateR", (3.8, -13.5, 3.6), (2.4, 3.2, 5.2), mat_plaster)
    add_box("RomonUpper", (0.0, -13.5, 7.2), (10.8, 3.6, 2.8), mat_timber)
    add_box("RomonGlow", (0.0, -15.35, 7.2), (6.5, 0.25, 1.6), mat_glow)
    add_irimoya_roof("RomonRoofLower", (0.0, -13.5, 5.8), 11.8, 4.4, 2.2, mat_turquoise, overhang=1.5)
    add_irimoya_roof("RomonRoofUpper", (0.0, -13.5, 8.5), 11.2, 4.2, 3.0, mat_turquoise_deep, ridge_mat=mat_gold, overhang=1.8)

    # Cloister side corridors
    for side in (-1, 1):
        cx = side * 14.2
        add_box(f"CloisterWall_{side}", (cx, -3.5, 3.0), (1.8, 14.0, 3.8), mat_plaster)
        add_irimoya_roof(f"CloisterRoof_{side}", (cx, -3.5, 4.8), 2.6, 15.0, 1.8, mat_turquoise, overhang=1.0)

    # Courtyard Stone Lanterns (Toro)
    for lx in (-5.5, 5.5):
        for ly in (-8.5, -3.5):
            add_box(f"ToroBase_{lx}_{ly}", (lx, ly, 2.2), (0.9, 0.9, 2.2), mat_stone)
            add_box(f"ToroLight_{lx}_{ly}", (lx, ly, 3.6), (1.1, 1.1, 0.9), mat_glow)
            add_irimoya_roof(f"ToroCap_{lx}_{ly}", (lx, ly, 4.1), 1.5, 1.5, 0.8, mat_stone, overhang=0.4)

    # 7. Four Sacred Onbashira Pillars at the compound corners
    for idx, (ox, oy) in enumerate([(-15.5, -6.5), (15.5, -6.5), (-15.5, 14.5), (16.5, 15.5)]):
        add_cyl(f"Onbashira_{idx}", (ox, oy, 9.5), 0.95, 0.78, 18.0, mat_timber, vertices=10)
        add_box(f"OnbashiraShide_{idx}", (ox, oy, 14.5), (2.2, 2.2, 0.8), mat_plaster)

    # 8. Jagged Snow-Dusted Alpine Crags Framing the North/East Behind the Shrine (`mountain shrine ref birds eye.png`)
    crags = [
        (0.0, 19.5, (11.0, 7.5, 21.0), 101, 0.1, mat_snow),
        (-11.5, 18.5, (9.5, 7.0, 18.0), 102, -0.3, mat_snow),
        (12.5, 18.0, (10.0, 7.5, 19.0), 103, 0.4, mat_snow),
        (21.5, 13.5, (7.5, 8.0, 15.5), 104, 0.8, mat_crag_rock),
        (21.5, 14.5, (6.5, 7.0, 16.5), 105, 0.8, mat_snow),
    ]
    for idx, (cx, cy, sc, sd, rz, m) in enumerate(crags):
        add_sculpted_crag(f"SummitCrag_{idx}", (cx, cy, 0.0), sc, m, seed_val=sd, rot_z=rz, sharpness=1.45)

    bake_and_merge_scene("MoriyaShrine")
    blend_path = os.path.join(BLEND_DIR, "moriya-shrine.blend")
    glb_path = os.path.join(OUT_DIR, "moriya-shrine.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_MORIYA_SHRINE:", glb_path)


# ==============================================================================
# 2. TENGU CLIFFSIDE VILLAGE & WATERWHEEL AQUEDUCT (`tengu-village.glb`)
# Reference: `mountain shrine ref ground.png`, `detailed shrine sides.png`, `mountain shrine ref night.png`
# ==============================================================================
def build_tengu_village_ref():
    clear_scene()

    mat_cliff = make_mat("TenguCliffGranite", 0x8A867E, roughness=0.88)
    mat_cliff_dark = make_mat("TenguCliffDark", 0x5E5B55, roughness=0.88)
    mat_plaza_earth = make_mat("TenguPlazaOchre", 0xC89B54, roughness=0.85)
    mat_timber = make_mat("TenguTimber", 0x4A2E1B, roughness=0.82)
    mat_timber_warm = make_mat("TenguWarmWood", 0x7A4B2A, roughness=0.78)
    mat_plaster = make_mat("TenguPlaster", 0xF0ECE2, roughness=0.78)
    mat_roof_slate = make_mat("TenguRoofSlate", 0x22262E, roughness=0.62, metallic=0.14)
    mat_turquoise = make_mat("TenguTurquoiseRoof", 0x1B9C8E, roughness=0.48, metallic=0.14)
    mat_autumn_red = make_mat("TenguMomijiRed", 0xD8381E, roughness=0.7)
    mat_autumn_orange = make_mat("TenguMomijiOrange", 0xE86824, roughness=0.7)
    mat_water = make_mat("TenguAqueductWater", 0x58B4E8, roughness=0.2, emission_hex=0x2B729E, emission_strength=0.45)
    mat_stall_purple = make_mat("StallPurple", 0x9E38B8, roughness=0.75)
    mat_stall_red = make_mat("StallRed", 0xD42C24, roughness=0.75)
    mat_gold = make_mat("TenguGold", 0xE5B842, roughness=0.3, metallic=0.8)
    mat_glow = make_mat("TenguLanternGlow", 0xFFB438, roughness=0.2, emission_hex=0xFFA020, emission_strength=2.5)

    # 1. Lower Autumn Market Plaza (`mountain shrine ref ground.png` foreground) — flat at z=0.6 so Aya/Momiji/Hatate stand cleanly!
    add_box("LowerMarketPlaza", (0.0, -10.0, 0.3), (38.0, 18.0, 0.6), mat_plaza_earth)
    add_box("LowerStoneRetaining", (0.0, -10.0, -0.4), (39.5, 19.5, 1.0), mat_cliff_dark)

    # Market stalls and glowing lantern strings in the lower plaza
    stalls = [
        (-8.5, -13.5, 0.15, mat_stall_purple),
        (-2.5, -15.0, -0.1, mat_stall_red),
        (4.5, -14.5, 0.2, mat_turquoise),
    ]
    for idx, (sx, sy, rz, s_mat) in enumerate(stalls):
        add_box(f"MarketStallPosts_{idx}", (sx, sy, 1.6), (3.4, 2.6, 2.0), mat_timber, rot=(0, 0, rz))
        add_irimoya_roof(f"MarketStallRoof_{idx}", (sx, sy, 2.6), 3.8, 3.0, 1.1, s_mat, rot=(0, 0, rz), overhang=0.6)
        add_box(f"MarketStallLantern_{idx}", (sx, sy - 1.3, 2.2), (0.55, 0.55, 0.75), mat_glow)

    # Glowing crimson autumn maple tree in the market square (`mountain shrine ref ground.png` bottom center-right)
    add_weeping_tree("PlazaAutumnMomiji", (4.5, -9.5, 0.6), 6.5, 0.85, 4.6, mat_timber, mat_autumn_red, mat_autumn_orange, seed_val=201)

    # 2. Stepped Cliff Terraces & Whitewashed Retaining Walls with Turquoise Copings
    add_box("MidCliffTerrace", (0.0, 2.5, 4.2), (42.0, 14.0, 8.4), mat_cliff)
    add_box("UpperCliffTerrace", (0.0, 13.5, 9.5), (40.0, 12.0, 19.0), mat_cliff)
    # Turquoise-coped castle retaining wall along MidCliffTerrace front (`mountain shrine ref ground.png` middle)
    add_box("RetainingWallPlaster", (-6.0, -4.2, 6.8), (24.0, 1.4, 3.2), mat_plaster)
    add_irimoya_roof("RetainingWallCoping", (-6.0, -4.2, 8.4), 24.5, 1.8, 1.1, mat_turquoise, overhang=0.5)

    # Jagged vertical granite cliff backdrop behind & framing the village (pushed to y >= 9 so front view is 100% open!)
    cliff_masses = [
        (-21.5, 9.5, (7.5, 9.5, 23.0), 210, 0.2),
        (21.5, 10.5, (7.5, 9.5, 22.0), 211, -0.3),
        (5.5, 17.5, (13.0, 7.5, 28.0), 212, 0.1),
        (-10.5, 17.0, (12.0, 7.5, 26.0), 213, -0.2),
    ]
    for idx, (cx, cy, sc, sd, rz) in enumerate(cliff_masses):
        add_sculpted_crag(f"VillageCliffMass_{idx}", (cx, cy, 0.0), sc, mat_cliff, seed_val=sd, rot_z=rz, sharpness=1.35)

    # 3. Giant Wooden Waterwheel & Vertical Stone Aqueduct (`mountain shrine ref ground.png` center-top)
    aq_x, aq_y = 2.5, 12.5
    add_box("AqueductStonePillar", (aq_x, aq_y, 12.5), (5.8, 5.5, 25.0), mat_cliff_dark)
    add_box("AqueductWaterChute", (aq_x, aq_y - 2.6, 12.0), (2.4, 0.8, 22.0), mat_water)
    # Giant spoked wooden waterwheel at top of aqueduct (facing front so spokes & rim are clearly visible!)
    add_cyl("GiantWaterwheelRim", (aq_x, aq_y - 2.2, 22.5), 4.8, 4.8, 1.2, mat_timber_warm, vertices=16, rot=(1.57, 0, 0))
    add_cyl("GiantWaterwheelHub", (aq_x, aq_y - 2.2, 22.5), 1.3, 1.3, 1.8, mat_timber, vertices=10, rot=(1.57, 0, 0))
    for sp_i in range(6):
        ang = sp_i * (math.pi / 6.0)
        add_box(f"WaterwheelSpoke_{sp_i}", (aq_x, aq_y - 2.2, 22.5), (9.2, 0.45, 0.45), mat_timber, rot=(0, ang, 0))
    # Cantilevered lookout platform mid-aqueduct
    add_box("AqueductLookoutDeck", (aq_x, aq_y - 4.2, 15.5), (4.2, 3.6, 0.8), mat_timber_warm)
    add_box("AqueductLookoutGlow", (aq_x, aq_y - 4.8, 16.6), (1.4, 1.4, 1.6), mat_glow)
    add_irimoya_roof("AqueductLookoutRoof", (aq_x, aq_y - 4.2, 17.5), 4.4, 3.8, 1.8, mat_roof_slate, overhang=0.8)

    # 4. Turquoise-Roofed Bunbunmaru Watchtower on Left Pinnacle (`detailed shrine sides.png` left)
    tw_x, tw_y = -16.5, 3.5
    add_box("BunbunmaruPinnacleBase", (tw_x, tw_y, 8.5), (6.8, 6.8, 17.0), mat_cliff_dark)
    add_box("BunbunmaruTimberStilts", (tw_x, tw_y, 18.0), (5.8, 5.8, 3.5), mat_timber)
    add_box("BunbunmaruTowerBody1", (tw_x, tw_y, 21.5), (6.4, 6.4, 4.2), mat_plaster)
    add_box("BunbunmaruGlow1", (tw_x, tw_y - 3.25, 21.5), (4.2, 0.3, 2.2), mat_glow)
    add_irimoya_roof("BunbunmaruRoof1", (tw_x, tw_y, 23.4), 7.6, 7.6, 2.8, mat_turquoise, ridge_mat=mat_gold, overhang=1.6)
    add_box("BunbunmaruTowerBody2", (tw_x, tw_y, 26.2), (4.6, 4.6, 3.4), mat_plaster)
    add_box("BunbunmaruGlow2", (tw_x, tw_y - 2.35, 26.2), (3.0, 0.3, 1.8), mat_glow)
    add_irimoya_roof("BunbunmaruRoof2", (tw_x, tw_y, 27.8), 5.8, 5.8, 3.2, mat_turquoise, ridge_mat=mat_gold, overhang=1.6)

    # 5. Tiered Cliffside Houses (`Kakezukuri` timber stilt houses & black-roofed Machiya)
    cliff_houses = [
        # Lower edge houses (z=1.0..4.5)
        (-15.5, -6.5, 1.2, 6.8, 5.2, 3.8, True, False),
        (-8.5, -6.2, 1.2, 6.2, 4.8, 3.6, False, False),
        (11.5, -7.5, 1.2, 7.2, 5.4, 4.0, True, False),
        (16.5, -11.5, 1.0, 6.0, 5.0, 3.6, False, False),
        # Mid terrace houses (z=8.4)
        (-11.5, 1.5, 8.4, 7.4, 5.6, 4.2, True, False),
        (-3.5, 1.8, 8.4, 8.8, 6.2, 4.8, True, True),   # Warm timber guildhall in center
        (6.5, 1.5, 8.4, 7.5, 5.5, 4.2, True, False),
        (14.5, 2.0, 8.4, 6.8, 5.2, 3.8, True, False),
        # Upper cliffside hanging houses (z=14..19)
        (-7.5, 10.5, 14.5, 6.5, 4.8, 3.8, True, False),
        (9.5, 10.5, 14.5, 7.2, 5.0, 4.0, True, False),
        (-11.5, 13.5, 19.0, 7.5, 5.5, 4.2, True, False),
        (11.5, 14.0, 19.0, 7.0, 5.2, 4.0, True, False),
    ]
    for idx, (hx, hy, hz, hw, hd, hh, has_stilts, is_warm_wood) in enumerate(cliff_houses):
        if has_stilts:
            for sx_o in (-hw * 0.4, 0.0, hw * 0.4):
                add_box(f"HouseStilt_{idx}_{sx_o}", (hx + sx_o, hy - hd * 0.42, hz - 2.2), (0.48, 0.48, 4.8), mat_timber)
        wall_m = mat_timber_warm if is_warm_wood else mat_plaster
        add_box(f"CliffHouseBody_{idx}", (hx, hy, hz + hh * 0.5), (hw, hd, hh), wall_m)
        add_box(f"CliffHouseTimber_{idx}", (hx, hy, hz + hh * 0.5), (hw + 0.2, hd + 0.2, hh * 0.32), mat_timber)
        add_box(f"CliffHouseGlow_{idx}", (hx, hy - hd * 0.51, hz + hh * 0.55), (hw * 0.65, 0.25, hh * 0.42), mat_glow)
        add_irimoya_roof(f"CliffHouseRoof_{idx}", (hx, hy, hz + hh - 0.1), hw + 0.8, hd + 0.8, 2.6, mat_roof_slate, overhang=1.2)

    # 6. Cascading Crimson Autumn Maple (`Momiji`) Clusters on the Left & Upper Ledges (`detailed shrine sides.png`)
    momiji_locs = [
        (-13.5, 6.5, 11.0, 4.8),
        (-8.0, 6.2, 10.5, 4.5),
        (-16.0, -1.5, 6.5, 4.2),
        (14.5, 6.5, 10.5, 4.2),
    ]
    for idx, (mx, my, mz, mr) in enumerate(momiji_locs):
        add_weeping_tree(f"CliffMomiji_{idx}", (mx, my, mz), 5.5, 0.75, mr, mat_timber, mat_autumn_red, mat_autumn_orange, seed_val=240 + idx)

    bake_and_merge_scene("TenguVillage")
    blend_path = os.path.join(BLEND_DIR, "tengu-village.blend")
    glb_path = os.path.join(OUT_DIR, "tengu-village.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_TENGU_VILLAGE:", glb_path)


# ==============================================================================
# 3. EIENTEI — SHINDEN PALACE, 3-TIERED STONE TERRACES & LOTUS POND (`eientei.glb`)
# Reference: `eintei ref.png`
# ==============================================================================
def build_eientei_ref():
    clear_scene()

    mat_stone = make_mat("EienteiAshlarStone", 0x8A8E94, roughness=0.84)
    mat_stone_dark = make_mat("EienteiStoneJoint", 0x52565C, roughness=0.88)
    mat_grass_bank = make_mat("EienteiMossTerrace", 0x567844, roughness=0.86)
    mat_timber = make_mat("EienteiCedarTimber", 0x3D2618, roughness=0.80)
    mat_fence_wood = make_mat("EienteiFenceWood", 0x6E4E32, roughness=0.84)
    mat_plaster = make_mat("EienteiWhitePlaster", 0xF2EFE8, roughness=0.76)
    mat_jade_roof = make_mat("EienteiVerdigrisRoof", 0x347E68, roughness=0.50, metallic=0.14)
    mat_jade_deep = make_mat("EienteiVerdigrisDeep", 0x266250, roughness=0.52, metallic=0.14)
    mat_gold = make_mat("EienteiGold", 0xE2B440, roughness=0.3, metallic=0.8)
    mat_banner_red = make_mat("EienteiBannerRed", 0xC82E28, roughness=0.65)
    mat_pond_water = make_mat("EienteiLotusPond", 0x2B6E8C, roughness=0.14, metallic=0.28)
    mat_lily_pad = make_mat("EienteiLilyPad", 0x4E8C3A, roughness=0.75)
    mat_lotus_pink = make_mat("EienteiLotusPink", 0xF8A8C8, roughness=0.4, emission_hex=0xF48CB6, emission_strength=0.65)
    mat_lotus_white = make_mat("EienteiLotusWhite", 0xFFF6FA, roughness=0.4, emission_hex=0xFFEBF2, emission_strength=0.65)
    mat_bamboo = make_mat("EienteiBambooGreen", 0x68A844, roughness=0.65)
    mat_tree_leaf = make_mat("EienteiForestCanopy", 0x5A7A3C, roughness=0.82)
    mat_lupine = make_mat("EienteiPurpleLupine", 0xB684F5, roughness=0.55, emission_hex=0x9A62E0, emission_strength=0.45)
    mat_glow = make_mat("EienteiLanternGlow", 0xFFB848, roughness=0.2, emission_hex=0xFFA228, emission_strength=2.2)

    # 1. Three-Tiered Cut-Stone Retaining Wall & Stepped Grass Banks (`eintei ref.png` center)
    tiers = [
        (0.0, 5.5, 0.7, 36.0, 22.0, 1.4),
        (0.0, 7.0, 2.1, 32.0, 18.5, 1.4),
        (0.0, 8.5, 3.5, 28.0, 15.0, 1.4),
    ]
    for idx, (tx, ty, tz, tw, td, th) in enumerate(tiers):
        add_box(f"StoneTerrace_{idx}", (tx, ty, tz), (tw, td, th), mat_stone)
        n_slots = int(tw // 3.2)
        for s_i in range(n_slots):
            sx = -tw * 0.44 + s_i * 3.1
            if abs(sx) > 3.2:
                add_box(f"TerraceNiche_{idx}_{s_i}", (sx, ty - td * 0.505, tz), (1.1, 0.25, th * 0.65), mat_stone_dark)

    # Central Grand Stone Staircase leading up the 3 terraces
    for st in range(9):
        add_box(f"EienteiStair_{st}", (0.0, -5.8 + st * 0.85, 0.25 + st * 0.45), (5.8, 0.9, 0.5), mat_stone)

    # Stepped mossy earth hillsides flanking the stone retaining walls (`eintei ref.png` left)
    for side in (-1, 1):
        for step_i in range(3):
            add_box(
                f"MossBank_{side}_{step_i}",
                (side * (19.5 + step_i * 1.5), 4.0 + step_i * 1.5, 0.7 + step_i * 1.3),
                (7.5, 16.0 - step_i * 2.5, 1.4),
                mat_grass_bank,
            )

    # 2. Grand Shinden-Zukuri Palace on the Upper Terrace (`eintei ref.png` top center)
    pz = 4.2
    add_box("ShindenVeranda", (0.0, 9.0, pz + 0.45), (24.0, 11.5, 0.9), mat_timber)
    add_box("ShindenWalls", (0.0, 9.2, pz + 3.4), (20.5, 8.8, 5.2), mat_plaster)
    for px in (-9.5, -6.3, -3.1, 0.0, 3.1, 6.3, 9.5):
        add_box(f"ShindenPillar_{px}", (px, 4.65, pz + 3.4), (0.52, 0.52, 5.2), mat_timber)
    add_box("ShindenGlow", (0.0, 4.75, pz + 3.4), (16.0, 0.25, 2.8), mat_glow)

    add_irimoya_roof("ShindenRoofLower", (0.0, 9.2, pz + 5.8), 23.5, 11.2, 3.4, mat_jade_roof, ridge_mat=mat_gold, overhang=2.4)
    add_irimoya_roof("ShindenFrontGable", (0.0, 5.2, pz + 6.4), 8.5, 5.2, 2.8, mat_jade_deep, ridge_mat=mat_gold, overhang=1.4)
    add_box("ShindenUpperCore", (0.0, 9.5, pz + 8.6), (13.5, 6.2, 3.0), mat_plaster)
    add_box("ShindenUpperTimber", (0.0, 9.5, pz + 8.6), (13.9, 6.6, 1.2), mat_timber)
    add_irimoya_roof("ShindenRoofUpper", (0.0, 9.5, pz + 10.0), 15.5, 7.8, 4.2, mat_jade_deep, ridge_mat=mat_gold, overhang=2.5)

    # Row of Crimson-Red Vertical Nobori Banners along the front terrace (`eintei ref.png` right of center)
    for b_i in range(6):
        bx = 3.8 + b_i * 1.65
        add_cyl(f"BannerPole_{b_i}", (bx, 2.4, pz + 1.8), 0.09, 0.09, 3.4, mat_timber, vertices=6)
        add_box(f"BannerCloth_{b_i}", (bx + 0.35, 2.4, pz + 2.1), (0.65, 0.12, 2.2), mat_banner_red)

    # 3. Foreground Tranquil Lotus Pond & Rustic Two-Rail Wooden Fences (`eintei ref.png` foreground)
    pond_y = -11.5
    add_box("LotusPondBasin", (0.0, pond_y, 0.12), (24.0, 9.5, 0.25), mat_pond_water)
    add_box("PondBankN", (0.0, pond_y + 5.1, 0.25), (25.5, 1.2, 0.5), mat_stone)
    add_box("PondBankS", (0.0, pond_y - 5.1, 0.25), (25.5, 1.2, 0.5), mat_stone)

    lotus_pts = [
        (-7.5, pond_y - 1.2, True), (-4.2, pond_y + 1.5, False), (-1.0, pond_y - 0.8, True),
        (2.8, pond_y + 1.2, True), (5.5, pond_y - 1.5, False), (8.2, pond_y + 0.6, True),
    ]
    for idx, (lx, ly, is_pink) in enumerate(lotus_pts):
        add_cyl(f"LilyPad_{idx}", (lx, ly, 0.28), 0.85, 0.85, 0.08, mat_lily_pad, vertices=10)
        add_cyl(f"LotusFlower_{idx}", (lx + 0.2, ly - 0.1, 0.48), 0.25, 0.48, 0.38, mat_lotus_pink if is_pink else mat_lotus_white, vertices=8)

    fence_segs = [
        (-9.5, pond_y + 5.4, 0.0), (-4.5, pond_y + 5.4, 0.0), (4.5, pond_y + 5.4, 0.0), (9.5, pond_y + 5.4, 0.0),
        (-6.0, pond_y - 5.4, 0.0), (6.0, pond_y - 5.4, 0.0),
        (-12.5, pond_y, 1.57), (12.5, pond_y, 1.57),
    ]
    for idx, (fx, fy, rz) in enumerate(fence_segs):
        ca, sa = math.cos(rz), math.sin(rz)
        for p_side in (-1.4, 1.4):
            add_box(f"FencePost_{idx}_{p_side}", (fx + p_side * ca, fy + p_side * sa, 0.85), (0.28, 0.28, 1.3), mat_fence_wood, rot=(0, 0, rz))
        add_box(f"FenceRailTop_{idx}", (fx, fy, 1.2), (3.0, 0.16, 0.18), mat_fence_wood, rot=(0, 0, rz))
        add_box(f"FenceRailBot_{idx}", (fx, fy, 0.72), (3.0, 0.16, 0.18), mat_fence_wood, rot=(0, 0, rz))

    # 4. Bamboo Clusters, Ancient Forest Trees & Violet-Purple Lupine Spikes (`eintei ref.png`)
    bamboo_locs = [(-4.2, -1.8, 1.4), (5.2, -1.5, 1.4), (-14.5, -3.5, 0.5), (14.5, -3.2, 0.5)]
    for idx, (bx, by, bz) in enumerate(bamboo_locs):
        for st_i, (ox, oy, h) in enumerate([(0, 0, 5.8), (0.55, 0.35, 5.2), (-0.5, 0.4, 4.8)]):
            add_cyl(f"EienteiBamboo_{idx}_{st_i}", (bx + ox, by + oy, bz + h * 0.5), 0.14, 0.11, h, mat_bamboo, vertices=7)
            add_sculpted_crag(f"EienteiBambooLeaf_{idx}_{st_i}", (bx + ox, by + oy, bz + h), (0.95, 0.95, 0.65), mat_bamboo, seed_val=300 + idx, sharpness=0.5)

    lupine_locs = [(-11.5, pond_y - 3.8), (-2.2, pond_y + 4.8), (7.5, pond_y + 4.8), (11.2, pond_y - 3.2)]
    for idx, (lx, ly) in enumerate(lupine_locs):
        add_cyl(f"LupineStem_{idx}", (lx, ly, 1.1), 0.12, 0.08, 1.8, mat_grass_bank, vertices=6)
        add_cyl(f"LupineBloom_{idx}", (lx, ly, 1.55), 0.45, 0.18, 1.6, mat_lupine, vertices=8)

    for idx, (tx, ty, tz, th, tr) in enumerate([
        (-16.5, -8.5, 0.2, 12.5, 4.8),
        (16.0, -7.5, 0.2, 13.0, 5.0),
        (-18.5, 7.5, 2.0, 11.5, 4.5),
        (18.5, 7.5, 2.0, 11.5, 4.5),
    ]):
        add_weeping_tree(f"EienteiAncientTree_{idx}", (tx, ty, tz), th, 1.1, tr, mat_timber, mat_tree_leaf, mat_grass_bank, seed_val=340 + idx)

    bake_and_merge_scene("Eientei")
    blend_path = os.path.join(BLEND_DIR, "eientei.blend")
    glb_path = os.path.join(OUT_DIR, "eientei.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_EIENTEI:", glb_path)


# ==============================================================================
# 4. MUENZUKA — HIGANBANA VALLEY & WEEPING PURPLE SAKURA GROVE (`muenzuka.glb`)
# Reference: `magenzuka ref.png`
# ==============================================================================
def build_muenzuka_ref():
    clear_scene()

    mat_slate_soil = make_mat("MuenzukaSlateSoil", 0x5E6C84, roughness=0.88)
    mat_slate_step = make_mat("MuenzukaSlateStep", 0x4D596E, roughness=0.90)
    mat_bark_dark = make_mat("MuenzukaDarkBark", 0x241A18, roughness=0.90)
    mat_sakura_purple = make_mat("MuenzukaPurpleSakura", 0x8A52B5, roughness=0.68)
    mat_sakura_violet = make_mat("MuenzukaVioletSakura", 0xA46CD0, roughness=0.68)
    mat_sakura_pink = make_mat("MuenzukaPinkSakura", 0xE696C6, roughness=0.68)
    mat_sakura_blush = make_mat("MuenzukaBlushSakura", 0xF5B8DC, roughness=0.68)
    mat_higanbana = make_mat("MuenzukaHiganbanaRed", 0xD94436, roughness=0.6, emission_hex=0xC83224, emission_strength=0.45)
    mat_higan_stem = make_mat("MuenzukaHiganStem", 0x3A5836, roughness=0.8)
    mat_lavender_grass = make_mat("MuenzukaLavenderFlora", 0x6E78B4, roughness=0.78)
    mat_stone_grave = make_mat("MuenzukaGorintouStone", 0x8C8A84, roughness=0.85)

    # 1. Stepped Blue-Slate Valley Terraces (`magenzuka ref.png` foreground & mid-ground)
    add_cyl("MuenzukaMainMeadow", (0.0, 0.0, 0.25), 24.0, 25.0, 0.5, mat_slate_soil, vertices=20)
    terrace_mounds = [
        (10.5, 6.5, 0.75, 11.0, 9.0, 0.7),
        (-11.0, 5.5, 0.65, 10.0, 8.5, 0.6),
        (8.5, -8.5, 0.6, 9.5, 7.5, 0.55),
        (-9.5, -7.5, 0.6, 9.0, 7.5, 0.55),
    ]
    for idx, (mx, my, mz, mw, md, mh) in enumerate(terrace_mounds):
        add_box(f"SlateTerrace_{idx}", (mx, my, mz), (mw, md, mh), mat_slate_step, rot=(0, 0, idx * 0.4))
        add_box(f"SlateTop_{idx}", (mx, my, mz + mh * 0.5 + 0.1), (mw - 0.6, md - 0.6, 0.2), mat_slate_soil, rot=(0, 0, idx * 0.4))

    # 2. Gnarled Weeping Purple & Pink Sakura Trees (`magenzuka ref.png`)
    sakura_trees = [
        (9.5, 5.5, 1.1, 11.5, 1.35, 6.8, mat_sakura_purple, mat_sakura_violet, 401),
        (17.5, -2.5, 0.5, 10.5, 1.2, 6.2, mat_sakura_pink, mat_sakura_blush, 402),
        (-11.5, -5.5, 0.8, 7.5, 0.95, 4.8, mat_sakura_pink, mat_sakura_violet, 403),
        (-13.5, 7.5, 0.9, 8.2, 1.05, 5.5, mat_sakura_purple, mat_sakura_pink, 404),
        (-2.5, 12.5, 0.5, 5.5, 0.65, 3.4, mat_sakura_purple, mat_sakura_violet, 405),
        (11.5, 15.5, 0.5, 7.8, 0.9, 4.6, mat_sakura_pink, mat_sakura_blush, 406),
    ]
    for idx, (tx, ty, tz, th, tr, cr, m1, m2, sd) in enumerate(sakura_trees):
        add_weeping_tree(f"MuenzukaSakura_{idx}", (tx, ty, tz), th, tr, cr, mat_bark_dark, m1, m2, seed_val=sd)

    # 3. Upright Tufted Crimson Spider Lilies (`Higanbana`) & Lavender-Blue Wildflower Sweeps (`magenzuka ref.png`)
    for i in range(48):
        ang = i * 2.39996
        r = 2.6 + math.sqrt(i / 48.0) * 19.0
        fx = math.cos(ang) * r
        fy = math.sin(ang) * r
        is_red = (i % 3 != 0)
        f_mat = mat_higanbana if is_red else mat_lavender_grass
        for sub in range(3):
            sa = ang + sub * 2.1
            sx = fx + math.cos(sa) * 0.75
            sy = fy + math.sin(sa) * 0.75
            if is_red:
                add_cyl(f"HiganStem_{i}_{sub}", (sx, sy, 0.85), 0.08, 0.06, 0.75, mat_higan_stem, vertices=5)
                add_cyl(f"HiganBloom_{i}_{sub}", (sx, sy, 1.25), 0.25, 0.55, 0.35, mat_higanbana, vertices=7)
            else:
                add_cyl(f"LavenderTuft_{i}_{sub}", (sx, sy, 0.75), 0.45, 0.22, 0.65, f_mat, vertices=6)

    # 4. Weathered Gorintou Memorial Stupas
    for idx, (gx, gy) in enumerate([(-4.5, 3.5), (4.2, -3.8), (-6.5, -1.5), (2.5, 7.5)]):
        add_box(f"GorintouBase_{idx}", (gx, gy, 0.8), (0.85, 0.85, 0.7), mat_stone_grave)
        add_cyl(f"GorintouSphere_{idx}", (gx, gy, 1.45), 0.42, 0.42, 0.55, mat_stone_grave, vertices=8)
        add_irimoya_roof(f"GorintouCap_{idx}", (gx, gy, 1.8), 0.95, 0.95, 0.45, mat_stone_grave, overhang=0.2)

    bake_and_merge_scene("Muenzuka")
    blend_path = os.path.join(BLEND_DIR, "muenzuka.blend")
    glb_path = os.path.join(OUT_DIR, "muenzuka.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_MUENZUKA:", glb_path)


# ==============================================================================
# 5. FLOATING HEAVEN / BHAVA-AGRA ARCHIPELAGO & SKY-SHIP (`heaven.glb`)
# Reference: `mountain shrine top shot.png` (top right floating celestial islands + sky-ship)
# ==============================================================================
def build_heaven_ref():
    clear_scene()

    mat_cloud_stone = make_mat("HeavenCloudStone", 0xEAE4D8, roughness=0.68)
    mat_rock_under = make_mat("HeavenFloatingRock", 0x7A7268, roughness=0.84)
    mat_crystal_pink = make_mat("HeavenMagentaCrystal", 0xE85298, roughness=0.3, emission_hex=0xD43882, emission_strength=1.2)
    mat_timber = make_mat("HeavenTimber", 0x4A2E1B, roughness=0.78)
    mat_plaster = make_mat("HeavenPlaster", 0xF7F4EC, roughness=0.72)
    mat_turquoise = make_mat("HeavenTurquoiseRoof", 0x1E9E8E, roughness=0.42, metallic=0.18)
    mat_gold = make_mat("HeavenCelestialGold", 0xE8BC44, roughness=0.25, metallic=0.85)
    mat_peach_pink = make_mat("HeavenPeachBlossom", 0xF69AC0, roughness=0.65)
    mat_peach_light = make_mat("HeavenPeachLight", 0xFCD0E4, roughness=0.65)
    mat_glow = make_mat("HeavenLanternGlow", 0xFFC048, roughness=0.2, emission_hex=0xFFA828, emission_strength=2.4)

    # 1. Main Floating Celestial Island Platform (`mountain shrine top shot.png` top-right)
    # Inverted tapered rocky underside completely below z=0 + flat celestial marble deck at z=0..1.2!
    add_cyl("HeavenMainDeck", (0.0, 0.0, 0.6), 23.0, 24.5, 1.2, mat_cloud_stone, vertices=20)
    add_cyl("HeavenMainUnderside1", (0.0, 0.0, -2.5), 15.5, 22.5, 5.0, mat_rock_under, vertices=16)
    add_cyl("HeavenMainUnderside2", (0.0, 0.0, -6.5), 6.5, 15.5, 4.5, mat_rock_under, vertices=12)
    add_box("HeavenGlowingBaseRing", (0.0, -2.0, -1.2), (18.0, 14.0, 1.2), mat_crystal_pink)

    # 2. Central Multi-Tiered Celestial Palace & Flanking Turquoise Pavilions (`mountain shrine top shot.png`)
    add_box("CelestialPodium", (0.0, 5.5, 1.8), (16.0, 10.0, 1.6), mat_cloud_stone)
    add_box("CelestialMainHall", (0.0, 5.5, 5.0), (13.5, 7.8, 4.8), mat_plaster)
    add_box("CelestialMainGlow", (0.0, 1.55, 5.0), (9.5, 0.3, 2.5), mat_glow)
    add_irimoya_roof("CelestialRoof1", (0.0, 5.5, 7.2), 15.5, 9.5, 3.2, mat_turquoise, ridge_mat=mat_gold, overhang=2.0)
    add_box("CelestialUpperHall", (0.0, 5.5, 9.8), (9.2, 5.4, 3.2), mat_plaster)
    add_irimoya_roof("CelestialRoof2", (0.0, 5.5, 11.2), 11.0, 6.8, 3.8, mat_gold, ridge_mat=mat_turquoise, overhang=2.2)

    # East & West Wing Pavilions
    for side in (-1, 1):
        px = side * 13.5
        add_pagoda(f"CelestialPagoda_{side}", (px, 2.5, 1.2), 3, 4.4, 2.2, mat_plaster, mat_timber, mat_turquoise, mat_gold, mat_glow)

    # Heavenly Peach Trees in Bloom (`mountain shrine top shot.png` pink trees on the floating island)
    for idx, (tx, ty) in enumerate([(-7.5, 7.5), (7.5, 7.5), (-8.5, -5.5), (8.5, -5.5)]):
        add_weeping_tree(f"HeavenPeachTree_{idx}", (tx, ty, 1.2), 5.8, 0.72, 3.8, mat_timber, mat_peach_pink, mat_peach_light, seed_val=520 + idx)

    # 3. Satellite Floating Islets & Celestial Sky-Ship (`mountain shrine top shot.png` upper left of floating island)
    sh_x, sh_y, sh_z = -18.5, 12.5, 9.5
    add_box("SkyShipHull", (sh_x, sh_y, sh_z), (12.5, 4.2, 2.6), mat_timber)
    add_box("SkyShipSternCastle", (sh_x - 4.2, sh_y, sh_z + 2.4), (4.8, 4.6, 2.4), mat_plaster)
    add_irimoya_roof("SkyShipRoof", (sh_x - 4.2, sh_y, sh_z + 3.6), 5.6, 5.2, 2.0, mat_gold, overhang=1.0)
    add_box("SkyShipBowDeck", (sh_x + 4.5, sh_y, sh_z + 1.8), (3.6, 3.8, 1.6), mat_timber)
    add_irimoya_roof("SkyShipBowRoof", (sh_x + 4.5, sh_y, sh_z + 2.6), 4.2, 4.2, 1.6, mat_turquoise, overhang=0.8)

    for idx, (ix, iy, iz, ir) in enumerate([(22.5, 6.5, 3.5, 5.5), (18.5, -10.5, -2.5, 4.2), (-16.5, -9.5, -3.5, 4.5)]):
        add_cyl(f"SatelliteIsletDeck_{idx}", (ix, iy, iz), ir * 0.55, ir, 2.2, mat_cloud_stone, vertices=12)
        add_pagoda(f"SatellitePavilion_{idx}", (ix, iy, iz + 1.0), 2, ir * 0.65, 1.8, mat_plaster, mat_timber, mat_turquoise, mat_gold, mat_glow)

    bake_and_merge_scene("HeavenBhavaAgra")
    blend_path = os.path.join(BLEND_DIR, "heaven.blend")
    glb_path = os.path.join(OUT_DIR, "heaven.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_HEAVEN:", glb_path)


# ==============================================================================
# 6. ALICE'S HOUSE — MARGATROID RESIDENCE (`alices-house.glb`)
# Reference: `AliceHouse.png`
# ==============================================================================
def build_alices_house_ref():
    clear_scene()

    mat_plaster = make_mat("AliceWhitePlaster", 0xF0ECE6, roughness=0.76)
    mat_timber = make_mat("AliceWarmTimber", 0x6E482A, roughness=0.80)
    mat_timber_dark = make_mat("AliceDarkTimber", 0x462C18, roughness=0.84)
    mat_roof_indigo = make_mat("AliceRoofIndigo", 0x4D4978, roughness=0.58, metallic=0.10)
    mat_roof_purple = make_mat("AliceRoofPurple", 0x2F2B50, roughness=0.60, metallic=0.10)
    mat_eave_white = make_mat("AliceEaveTrim", 0xE8E2DC, roughness=0.72)
    mat_porch_stone = make_mat("AlicePorchStone", 0xD6D4D0, roughness=0.80)
    mat_plinth_dark = make_mat("AlicePlinthStone", 0x484C54, roughness=0.85)
    mat_chimney_stone = make_mat("AliceChimneyBlueStone", 0x586882, roughness=0.84)
    mat_flower_green = make_mat("AlicePlanterFoliage", 0x487A36, roughness=0.78)
    mat_flower_pink = make_mat("AlicePlanterBloom", 0xD864A8, roughness=0.55)
    mat_glow = make_mat("AliceWindowGlow", 0xFFC468, roughness=0.2, emission_hex=0xFFAE38, emission_strength=2.0)

    # 1. Left Main Cottage Wing (`AliceHouse.png` left)
    wx, wy = -4.2, 0.0
    add_box("CottageBaseTimber", (wx, wy, 0.4), (11.6, 8.4, 0.8), mat_timber)
    add_box("CottageWalls", (wx, wy, 3.4), (11.2, 8.0, 5.2), mat_plaster)
    # Corner and wall half-timber posts & horizontal belt beams
    for cx in (-9.6, -4.2, 1.2):
        for cy in (-3.9, 3.9):
            add_box(f"CottagePost_{cx}_{cy}", (cx, cy, 3.4), (0.65, 0.65, 5.4), mat_timber)
    add_box("CottageUpperBelt", (wx, wy, 5.2), (11.5, 8.3, 0.55), mat_timber)

    # Striped Indigo & Deep-Purple Gable Roof + White Eave Trim (`AliceHouse.png`)
    add_irimoya_roof("CottageMainRoof", (wx, wy, 5.8), 12.2, 8.8, 3.8, mat_roof_indigo, ridge_mat=mat_roof_purple, overhang=1.1, hip_factor=0.95, curve_lift=0.15)
    # Purple roof stripe accents
    for st_i, sx_o in enumerate((-7.5, -4.2, -1.0)):
        add_box(f"RoofPurpleStripe_{st_i}", (sx_o, wy - 2.2, 7.3), (1.6, 5.2, 0.45), mat_roof_purple, rot=(0.62, 0, 0))
    add_box("CottageWhiteEaveF", (wx, wy - 4.95, 5.85), (13.4, 0.45, 0.45), mat_eave_white)

    # Blue-Grey Cobblestone Chimney on Left Roof Ridge (`AliceHouse.png` top-left)
    add_box("AliceChimneyShaft", (-7.2, wy + 0.8, 9.6), (1.6, 1.6, 2.8), mat_chimney_stone)
    add_box("AliceChimneyCap", (-7.2, wy + 0.8, 11.1), (2.0, 2.0, 0.45), mat_porch_stone)

    # 2. Stepped Pale-Stone Front Porch & 4 Timber Pillars on Stone Plinths (`AliceHouse.png` bottom-left)
    # Kept low (z <= 0.9) so Alice stands cleanly on the porch steps or front lawn!
    add_box("PorchStep1", (wx, wy - 5.8, 0.25), (10.6, 3.8, 0.5), mat_porch_stone)
    add_box("PorchStep2", (wx, wy - 5.4, 0.65), (9.8, 3.0, 0.4), mat_porch_stone)
    for px in (-8.4, -5.6, -2.8, 0.0):
        add_box(f"PorchPlinth_{px}", (px, wy - 6.4, 1.15), (0.68, 0.68, 0.7), mat_plinth_dark)
        add_box(f"PorchPillar_{px}", (px, wy - 6.4, 2.85), (0.48, 0.48, 2.8), mat_timber)
    add_box("PorchAwningTrim", (wx, wy - 5.5, 4.35), (10.4, 2.8, 0.35), mat_eave_white)
    add_box("PorchAwningRoof", (wx, wy - 5.5, 4.65), (10.2, 2.7, 0.45), mat_roof_purple, rot=(0.18, 0, 0))

    # Front door, glowing windows & wooden planter boxes with flowers
    add_box("FrontDoor", (-4.2, wy - 4.05, 2.2), (1.6, 0.25, 2.8), mat_timber_dark)
    for wx_win in (-7.2, -1.4):
        add_box(f"CottageFrontWin_{wx_win}", (wx_win, wy - 4.05, 2.8), (1.8, 0.25, 1.8), mat_glow)
        add_box(f"CottagePlanter_{wx_win}", (wx_win, wy - 4.45, 1.65), (2.1, 0.65, 0.55), mat_timber_dark)
        add_box(f"CottageFlowers_{wx_win}", (wx_win, wy - 4.45, 2.05), (1.8, 0.45, 0.35), mat_flower_green)
    # Right side window of cottage with wooden trellis awning
    add_box("CottageSideWin", (1.42, wy - 1.8, 2.8), (0.25, 2.0, 1.8), mat_glow)
    add_box("CottageSidePlanter", (1.8, wy - 1.8, 1.65), (0.65, 2.2, 0.55), mat_timber_dark)
    add_box("CottageSideTrellis", (1.9, wy - 1.8, 3.85), (0.85, 2.4, 0.22), mat_timber)

    # 3. Attached 2-Story Octagonal Half-Timbered Tower (`AliceHouse.png` right)
    tx, ty = 5.2, -0.5
    tr = 4.2
    th = 11.2
    add_cyl("TowerStoneBase", (tx, ty, 0.55), tr + 0.35, tr + 0.35, 1.1, mat_porch_stone, vertices=8)
    add_cyl("TowerPlasterCore", (tx, ty, 1.1 + th * 0.5), tr, tr, th, mat_plaster, vertices=8)
    # Horizontal timber belt rings on the tower
    for bz in (1.2, 6.2, 11.6):
        add_cyl(f"TowerTimberBelt_{bz}", (tx, ty, bz), tr + 0.18, tr + 0.18, 0.65, mat_timber, vertices=8)
    # 8 Vertical half-timber rib posts around the octagon
    for i in range(8):
        ang = i * (math.pi / 4.0) + (math.pi / 8.0)
        rx = tx + math.cos(ang) * (tr - 0.05)
        ry = ty + math.sin(ang) * (tr - 0.05)
        add_box(f"TowerRib_{i}", (rx, ry, 1.1 + th * 0.5), (0.58, 0.58, th + 0.2), mat_timber, rot=(0, 0, ang))

    # Tower windows & flower-box planters on 1st and 2nd stories
    for win_ang in (-1.15, -0.38, 0.38):
        for wz_lvl in (3.6, 8.8):
            wx_t = tx + math.cos(win_ang - 1.57) * (tr - 0.1)
            wy_t = ty + math.sin(win_ang - 1.57) * (tr - 0.1)
            add_box(f"TowerWin_{win_ang}_{wz_lvl}", (wx_t, wy_t, wz_lvl), (1.5, 0.4, 2.0), mat_glow, rot=(0, 0, win_ang))
            px_t = tx + math.cos(win_ang - 1.57) * (tr + 0.35)
            py_t = ty + math.sin(win_ang - 1.57) * (tr + 0.35)
            add_box(f"TowerPlanter_{win_ang}_{wz_lvl}", (px_t, py_t, wz_lvl - 1.15), (1.8, 0.65, 0.55), mat_timber_dark, rot=(0, 0, win_ang))
            add_box(f"TowerBloom_{win_ang}_{wz_lvl}", (px_t, py_t, wz_lvl - 0.75), (1.5, 0.45, 0.35), mat_flower_pink, rot=(0, 0, win_ang))

    # Stepped Conical Slate-Purple Tower Roof (`AliceHouse.png` top-right)
    add_cyl("TowerRoofStep1", (tx, ty, 12.6), tr + 1.1, tr * 0.72, 1.4, mat_roof_indigo, vertices=8)
    add_cyl("TowerRoofStep2", (tx, ty, 14.0), tr * 0.75, tr * 0.35, 1.5, mat_roof_purple, vertices=8)
    add_cyl("TowerRoofPeak", (tx, ty, 15.2), tr * 0.36, 0.4, 1.2, mat_roof_indigo, vertices=8)

    bake_and_merge_scene("AlicesHouse")
    blend_path = os.path.join(BLEND_DIR, "alices-house.blend")
    glb_path = os.path.join(OUT_DIR, "alices-house.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_ALICES_HOUSE:", glb_path)


# ==============================================================================
# 7. MARISA'S HOUSE — KIRISAME MAGIC SHOP & OBSERVATORY SILO (`marisas-house.glb`)
# Reference: `MarisaHouse.png`
# ==============================================================================
def build_marisas_house_ref():
    clear_scene()

    mat_cream_wall = make_mat("MarisaCreamPlaster", 0xDCCEB4, roughness=0.82)
    mat_chimney_cream = make_mat("MarisaChimneyPlaster", 0xE6DAC2, roughness=0.80)
    mat_timber = make_mat("MarisaShuttersTimber", 0x4A2E1A, roughness=0.82)
    mat_roof_slate = make_mat("MarisaSlateRoof", 0x4A4F58, roughness=0.68, metallic=0.10)
    mat_silo_stone = make_mat("MarisaSiloCobble", 0x585D66, roughness=0.86)
    mat_silo_rib = make_mat("MarisaSiloRibStone", 0x767B84, roughness=0.82)
    mat_dome_dark = make_mat("MarisaObservatoryDome", 0x363A42, roughness=0.58, metallic=0.18)
    mat_ivy = make_mat("MarisaClimbingIvy", 0x447832, roughness=0.82)
    mat_lupine = make_mat("MarisaPurpleLupine", 0xB884F8, roughness=0.55, emission_hex=0x9A62E0, emission_strength=0.45)
    mat_smoke = make_mat("MarisaChimneySmoke", 0xEBF0F5, roughness=0.90)
    mat_win_frame = make_mat("MarisaWhiteFrame", 0xEAE6DF, roughness=0.75)
    mat_glow = make_mat("MarisaWarmGlow", 0xFFC262, roughness=0.2, emission_hex=0xFFAA30, emission_strength=2.2)

    # 1. Left Two-Story Witch's Cottage (`MarisaHouse.png` left)
    cx, cy = -4.8, 0.0
    add_box("MarisaCottageBase", (cx, cy, 0.4), (12.4, 9.2, 0.8), mat_silo_rib)
    add_box("MarisaCottageWalls", (cx, cy, 4.2), (12.0, 8.8, 7.2), mat_cream_wall)

    # Steep Dark-Slate Gabled Roof + Twin Front Dormer Gables (`MarisaHouse.png`)
    add_irimoya_roof("MarisaMainRoof", (cx, cy, 7.6), 13.0, 9.6, 4.6, mat_roof_slate, overhang=1.2, hip_factor=0.96, curve_lift=0.15)
    for dx_o in (-7.2, -2.4):
        add_box(f"DormerWall_{dx_o}", (dx_o, cy - 4.2, 8.4), (2.4, 1.8, 1.8), mat_cream_wall)
        add_box(f"DormerWin_{dx_o}", (dx_o, cy - 5.12, 8.4), (1.1, 0.2, 1.2), mat_glow)
        add_irimoya_roof(f"DormerRoof_{dx_o}", (dx_o, cy - 4.3, 9.2), 2.8, 2.2, 1.4, mat_roof_slate, overhang=0.5, hip_factor=0.95, curve_lift=0.1)

    # Iron Weathervane / Antenna Finials on Right Roof Ridge (`MarisaHouse.png` top center)
    for vx_o in (-0.8, 0.4):
        add_box(f"RoofFinialBase_{vx_o}", (vx_o, cy, 12.2), (0.7, 0.7, 0.7), mat_silo_rib)
        add_cyl(f"RoofFinialRod_{vx_o}", (vx_o, cy, 13.6), 0.08, 0.05, 2.2, mat_silo_rib, vertices=6)

    # Tall Exterior Cream-Plaster Chimney on Front-Left Facade + Rising Smoke Puffs (`MarisaHouse.png` left)
    ch_x, ch_y = -8.8, cy - 4.4
    add_box("ChimneyLower", (ch_x, ch_y, 3.8), (2.2, 1.8, 6.8), mat_chimney_cream)
    add_box("ChimneyUpper", (ch_x, ch_y + 0.2, 9.4), (1.7, 1.5, 4.8), mat_chimney_cream)
    add_box("ChimneyStoneCap", (ch_x, ch_y + 0.2, 12.0), (1.9, 1.7, 0.6), mat_silo_rib)
    for sm_i, (ox, oy, oz, sr) in enumerate([(0.0, 0.2, 13.0, 0.55), (-0.2, 0.3, 14.0, 0.68), (0.1, 0.4, 15.1, 0.82), (-0.1, 0.5, 16.3, 0.65)]):
        add_sculpted_crag(f"ChimneySmoke_{sm_i}", (ch_x + ox, ch_y + oy, oz), (sr, sr, sr * 0.85), mat_smoke, seed_val=600 + sm_i, sharpness=0.4)

    # Small Wooden Front Stoop Awning & Stone Steps (`MarisaHouse.png` bottom-left)
    st_x = -5.4
    add_box("StoopSteps", (st_x, cy - 5.4, 0.35), (2.8, 2.0, 0.7), mat_silo_stone)
    add_box("StoopDoor", (st_x, cy - 4.42, 2.1), (1.5, 0.25, 2.6), mat_glow)
    for sp_side in (-1.1, 1.1):
        add_box(f"StoopPost_{sp_side}", (st_x + sp_side, cy - 5.9, 1.8), (0.32, 0.32, 2.2), mat_timber)
    add_box("StoopAwning", (st_x, cy - 5.3, 3.1), (2.9, 1.8, 0.45), mat_timber, rot=(0.22, 0, 0))

    # Shutters, Windows & Climbing Green Ivy Vines on Front & Right Walls (`MarisaHouse.png`)
    for wx_w, wz_w in [(-2.2, 2.4), (-2.2, 5.6), (-5.8, 5.6)]:
        add_box(f"MarisaWin_{wx_w}_{wz_w}", (wx_w, cy - 4.42, wz_w), (1.3, 0.25, 1.6), mat_glow)
        add_box(f"ShutterL_{wx_w}_{wz_w}", (wx_w - 0.9, cy - 4.42, wz_w), (0.45, 0.28, 1.6), mat_timber)
        add_box(f"ShutterR_{wx_w}_{wz_w}", (wx_w + 0.9, cy - 4.42, wz_w), (0.45, 0.28, 1.6), mat_timber)
    for iv_i, (ix, iy, iz, ih) in enumerate([(-10.6, cy - 4.45, 3.2, 4.5), (-3.8, cy - 4.45, 3.5, 3.8), (-0.2, cy - 4.45, 2.8, 4.8)]):
        add_box(f"ClimbingIvy_{iv_i}", (ix, iy, iz), (0.95, 0.3, ih), mat_ivy)

    # 2. Attached Cylindrical Stone Observatory / Windmill Silo Tower (`MarisaHouse.png` right)
    sx, sy = 6.2, 1.2
    sr = 4.8
    sh = 12.8
    add_cyl("SiloStoneBase", (sx, sy, 0.8), sr + 0.45, sr + 0.35, 1.6, mat_silo_rib, vertices=16)
    add_cyl("SiloMainCylinder", (sx, sy, 1.6 + sh * 0.5), sr, sr * 0.95, sh, mat_silo_stone, vertices=16)
    # Vertical stone buttress ribs around the silo
    for i in range(8):
        ang = i * (math.pi / 4.0)
        rx = sx + math.cos(ang) * (sr - 0.05)
        ry = sy + math.sin(ang) * (sr - 0.05)
        add_box(f"SiloButtressRib_{i}", (rx, ry, 1.6 + sh * 0.48), (0.65, 0.65, sh * 0.95), mat_silo_rib, rot=(0, 0, ang))
    # Small white-framed square windows on front of stone tower (`MarisaHouse.png`)
    for wz_s in (4.5, 10.2):
        add_box(f"SiloWhiteWin_{wz_s}", (sx - 0.8, sy - sr + 0.05, wz_s), (1.1, 0.35, 1.1), mat_win_frame)

    # Double Projecting Stone Cornice Rings & Domed Dark-Slate Observatory Roof (`MarisaHouse.png` top-right)
    add_cyl("SiloCornice1", (sx, sy, 13.6), sr + 0.55, sr + 0.55, 0.75, mat_silo_rib, vertices=16)
    add_cyl("SiloCornice2", (sx, sy, 14.8), sr + 0.65, sr + 0.65, 0.75, mat_silo_rib, vertices=16)
    add_cyl("SiloDomeTier1", (sx, sy, 16.2), sr + 0.1, sr * 0.78, 2.2, mat_dome_dark, vertices=16)
    add_cyl("SiloDomeTier2", (sx, sy, 18.0), sr * 0.78, sr * 0.38, 1.6, mat_dome_dark, vertices=16)
    add_cyl("SiloDomeCap", (sx, sy, 19.1), sr * 0.38, 0.6, 0.8, mat_dome_dark, vertices=12)

    # 3. Foreground Stone-Walled Lupine/Lavender Flower Courtyard (`MarisaHouse.png` bottom-right)
    wall_pts = [(0.5, -5.2), (2.2, -5.6), (4.0, -5.8), (5.8, -5.6), (7.6, -5.2), (9.2, -4.6)]
    for idx, (wx_p, wy_p) in enumerate(wall_pts):
        add_box(f"GardenWallBlock_{idx}", (wx_p, wy_p, 0.65), (1.7, 0.75, 1.3), mat_silo_rib, rot=(0, 0, -0.15 + idx * 0.06))
    # Dense cluster of violet-purple lupine flower spikes inside the garden wall
    for l_i in range(18):
        lx = 1.2 + (l_i % 6) * 1.35 + (l_i // 6) * 0.3
        ly = -4.4 + (l_i // 6) * 1.15
        add_cyl(f"MarisaGardenBush_{l_i}", (lx, ly, 0.55), 0.55, 0.45, 0.6, mat_ivy, vertices=7)
        add_cyl(f"MarisaLupineSpike_{l_i}", (lx, ly, 1.35), 0.38, 0.14, 1.45, mat_lupine, vertices=7)

    bake_and_merge_scene("MarisasHouse")
    blend_path = os.path.join(BLEND_DIR, "marisas-house.blend")
    glb_path = os.path.join(OUT_DIR, "marisas-house.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_MARISAS_HOUSE:", glb_path)


# ==============================================================================
# 8. HIEDA CLAN WALLED GARDEN ESTATE (`hieda-estate.glb`)
# Reference: `Humanvillage-thumb.png` (foreground walled compound with koi pond & red bridge)
# ==============================================================================
def build_hieda_estate_ref():
    clear_scene()

    mat_gravel = make_mat("HiedaWhiteGravel", 0xDFDCD4, roughness=0.85)
    mat_grass = make_mat("HiedaGardenLawn", 0x6AA844, roughness=0.82)
    mat_pond = make_mat("HiedaKoiPond", 0x26628A, roughness=0.14, metallic=0.28)
    mat_plaster = make_mat("HiedaWallPlaster", 0xF2EFE8, roughness=0.76)
    mat_timber = make_mat("HiedaDarkTimber", 0x3A2416, roughness=0.82)
    mat_roof_black = make_mat("HiedaKawaraBlack", 0x242830, roughness=0.60, metallic=0.14)
    mat_vermilion = make_mat("HiedaBridgeRed", 0xC82E24, roughness=0.55)
    mat_tree_green = make_mat("HiedaLushTree", 0x58AC38, roughness=0.78)
    mat_rock = make_mat("HiedaGardenRock", 0x7A7872, roughness=0.86)
    mat_glow = make_mat("HiedaLanternGlow", 0xFFB848, roughness=0.2, emission_hex=0xFFA228, emission_strength=2.2)

    # 1. Walled Estate Courtyard Base (`Humanvillage-thumb.png` foreground center-right)
    W, D = 32.0, 28.0
    add_box("EstateLawnBase", (0.0, 0.0, 0.25), (W, D, 0.5), mat_grass)
    add_box("EstateGravelPaths", (-4.5, -2.5, 0.52), (16.0, 14.0, 0.12), mat_gravel)

    # Perimeter Tsukiji-bei Walls (white plaster with black tiled coping)
    for side in (-1, 1):
        add_box(f"PerimeterWallX_{side}", (side * (W * 0.5 - 0.5), 0.0, 1.6), (0.9, D, 2.2), mat_plaster)
        add_irimoya_roof(f"PerimeterCopingX_{side}", (side * (W * 0.5 - 0.5), 0.0, 2.7), 1.4, D + 0.4, 0.7, mat_roof_black, overhang=0.3)
    add_box("PerimeterWallNorth", (0.0, D * 0.5 - 0.5, 1.6), (W, 0.9, 2.2), mat_plaster)
    add_irimoya_roof("PerimeterCopingNorth", (0.0, D * 0.5 - 0.5, 2.7), W + 0.4, 1.4, 0.7, mat_roof_black, overhang=0.3)
    # South wall with open central gatehouse
    for side in (-1, 1):
        add_box(f"PerimeterWallSouth_{side}", (side * 9.5, -D * 0.5 + 0.5, 1.6), (13.0, 0.9, 2.2), mat_plaster)
        add_irimoya_roof(f"PerimeterCopingSouth_{side}", (side * 9.5, -D * 0.5 + 0.5, 2.7), 13.4, 1.4, 0.7, mat_roof_black, overhang=0.3)
    add_irimoya_roof("SouthGateRoof", (0.0, -D * 0.5 + 0.5, 3.6), 6.8, 2.6, 1.5, mat_roof_black, overhang=0.8)

    # 2. Central Strolling Koi Pond & Arched Vermilion Bridge (`Humanvillage-thumb.png`)
    add_box("HiedaKoiPond", (2.5, -1.5, 0.32), (14.5, 10.5, 0.45), mat_pond)
    add_box("HiedaRedBridgeDeck", (6.5, -1.5, 1.25), (3.2, 6.8, 0.55), mat_vermilion, rot=(0, 0, 0.35))
    add_box("HiedaRedBridgeRailL", (5.3, -1.5, 1.75), (0.3, 6.8, 0.75), mat_vermilion, rot=(0, 0, 0.35))
    add_box("HiedaRedBridgeRailR", (7.7, -1.5, 1.75), (0.3, 6.8, 0.75), mat_vermilion, rot=(0, 0, 0.35))

    # 3. Grand Two-Story Black-Roofed Hieda Main Mansion & Side Pavilions (`Humanvillage-thumb.png`)
    add_box("HiedaMainHall1", (3.5, 8.2, 2.8), (16.5, 7.2, 4.6), mat_plaster)
    add_box("HiedaMainTimber1", (3.5, 8.2, 2.8), (16.8, 7.5, 1.6), mat_timber)
    add_box("HiedaMainGlow", (3.5, 4.55, 2.8), (12.0, 0.25, 2.2), mat_glow)
    add_irimoya_roof("HiedaMainRoof1", (3.5, 8.2, 4.9), 18.0, 8.5, 2.8, mat_roof_black, overhang=1.5)
    add_box("HiedaMainHall2", (3.5, 8.5, 7.2), (12.5, 5.2, 3.0), mat_plaster)
    add_irimoya_roof("HiedaMainRoof2", (3.5, 8.5, 8.6), 14.0, 6.4, 3.2, mat_roof_black, overhang=1.6)

    # Side Pavilions (West Archive Hall, Central Tea Pavilion, South-East Gate Pavilion)
    pavilions = [
        (-9.5, 5.5, 8.5, 5.2, 3.6, 0.0),
        (-5.5, -3.5, 6.2, 4.8, 3.4, 0.0),
        (9.5, -8.5, 7.8, 4.8, 3.6, 0.78),
    ]
    for idx, (px, py, pw, pd, ph, rz) in enumerate(pavilions):
        add_box(f"HiedaPavBody_{idx}", (px, py, 0.5 + ph * 0.5), (pw, pd, ph), mat_plaster, rot=(0, 0, rz))
        add_irimoya_roof(f"HiedaPavRoof_{idx}", (px, py, 0.5 + ph), pw + 0.8, pd + 0.8, 2.2, mat_roof_black, rot=(0, 0, rz), overhang=1.1)

    # Lush Green Garden Trees inside the Courtyard (`Humanvillage-thumb.png`)
    for idx, (tx, ty, tr) in enumerate([(0.5, 0.5, 2.8), (-9.5, -1.5, 2.6), (-3.5, -9.5, 2.5), (10.5, 1.5, 2.6), (-7.5, 10.5, 2.8)]):
        add_weeping_tree(f"HiedaGardenTree_{idx}", (tx, ty, 0.5), 4.5, 0.55, tr, mat_timber, mat_tree_green, seed_val=700 + idx)

    bake_and_merge_scene("HiedaEstate")
    blend_path = os.path.join(BLEND_DIR, "hieda-estate.blend")
    glb_path = os.path.join(OUT_DIR, "hieda-estate.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_HIEDA_ESTATE:", glb_path)


# ==============================================================================
# 9. OUTSIDE WORLD ABANDONED RADIO TOWER (`radio-tower.glb` / `moriya-branch-shrine.glb`)
# Reference: `RadioTower.png` (Oriental Sacred Place Ch.10 Fairy Shrine Radio Tower)
# ==============================================================================
def build_radio_tower_ref():
    clear_scene()

    mat_steel_white = make_mat("TowerWeatheredSteel", 0xE2E5EC, roughness=0.55, metallic=0.45)
    mat_rust_brown = make_mat("TowerRustedIron", 0x785038, roughness=0.78, metallic=0.25)
    mat_vine_green = make_mat("TowerClimbingVines", 0x3E702E, roughness=0.82)
    mat_leaf_bright = make_mat("TowerLeafCluster", 0x548C3C, roughness=0.78)
    mat_stone_base = make_mat("TowerFootingStone", 0x7A7C80, roughness=0.86)

    # 4 Tapered Lattice Corner Legs rising from base width 9.0m to top width 1.6m over 34m height (`RadioTower.png`)
    levels = 8
    total_h = 34.0
    base_half = 4.5
    top_half = 0.85

    for corner_x in (-1, 1):
        for corner_y in (-1, 1):
            add_box(f"Footing_{corner_x}_{corner_y}", (corner_x * base_half, corner_y * base_half, 0.6), (1.4, 1.4, 1.2), mat_stone_base)

    for lvl in range(levels):
        t0 = lvl / levels
        t1 = (lvl + 1) / levels
        z0 = 1.0 + t0 * total_h
        z1 = 1.0 + t1 * total_h
        zm = 0.5 * (z0 + z1)
        seg_h = z1 - z0
        w0 = base_half * (1.0 - t0) + top_half * t0
        w1 = base_half * (1.0 - t1) + top_half * t1
        wm = 0.5 * (w0 + w1)
        thick = 0.42 * (1.0 - 0.45 * t0)

        # 4 corner steel leg segments + horizontal perimeter ring beams
        for cx in (-1, 1):
            for cy in (-1, 1):
                m_leg = mat_steel_white if (lvl + cx + cy) % 2 == 0 else mat_rust_brown
                add_box(f"Leg_{lvl}_{cx}_{cy}", (cx * wm, cy * wm, zm), (thick, thick, seg_h + 0.3), m_leg, rot=(cy * 0.09, -cx * 0.09, 0))

        # Horizontal cross-struts on all 4 faces + X-bracing diagonals (`RadioTower.png`)
        for side in (-1, 1):
            add_box(f"HBeamX_{lvl}_{side}", (0.0, side * w1, z1), (w1 * 2.05, thick * 0.85, thick * 0.85), mat_steel_white)
            add_box(f"HBeamY_{lvl}_{side}", (side * w1, 0.0, z1), (thick * 0.85, w1 * 2.05, thick * 0.85), mat_steel_white)
            diag_len = math.hypot(wm * 2.0, seg_h)
            diag_ang = math.atan2(wm * 2.0, seg_h)
            add_box(f"DiagF1_{lvl}_{side}", (0.0, side * wm, zm), (thick * 0.7, thick * 0.7, diag_len), mat_rust_brown, rot=(0, diag_ang, 0))
            add_box(f"DiagF2_{lvl}_{side}", (0.0, side * wm, zm), (thick * 0.7, thick * 0.7, diag_len), mat_rust_brown, rot=(0, -diag_ang, 0))
            add_box(f"DiagS1_{lvl}_{side}", (side * wm, 0.0, zm), (thick * 0.7, thick * 0.7, diag_len), mat_rust_brown, rot=(diag_ang, 0, 0))

        # Overgrown climbing green vines & foliage bushes clinging to the steel lattice (`RadioTower.png`)
        ang_v = lvl * 1.7
        vx = math.cos(ang_v) * (wm + 0.35)
        vy = math.sin(ang_v) * (wm + 0.35)
        add_sculpted_crag(f"TowerVineBush_{lvl}", (vx, vy, zm), (1.45 - t0 * 0.45, 1.45 - t0 * 0.45, 1.3), mat_vine_green if lvl % 2 == 0 else mat_leaf_bright, seed_val=800 + lvl, sharpness=0.55)

    # Top Transmitter Crown & Tall Silver Lightning-Rod Antenna Spire (`RadioTower.png` top)
    top_z = 1.0 + total_h
    add_box("TowerCrownPlatform", (0.0, 0.0, top_z + 0.6), (2.1, 2.1, 1.2), mat_steel_white)
    add_cyl("TowerAntennaMast", (0.0, 0.0, top_z + 4.8), 0.18, 0.06, 7.6, mat_steel_white, vertices=8)

    bake_and_merge_scene("RadioTower")
    blend_path = os.path.join(BLEND_DIR, "radio-tower.blend")
    glb_path = os.path.join(OUT_DIR, "radio-tower.glb")
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    bpy.ops.export_scene.gltf(filepath=glb_path, export_format='GLB', export_yup=True, export_apply=True)
    print("EXPORTED_RADIO_TOWER:", glb_path)


if __name__ == "__main__":
    build_moriya_shrine_ref()
    build_tengu_village_ref()
    build_eientei_ref()
    build_muenzuka_ref()
    build_heaven_ref()
    build_alices_house_ref()
    build_marisas_house_ref()
    build_hieda_estate_ref()
    build_radio_tower_ref()


