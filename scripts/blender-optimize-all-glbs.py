import bpy
import bmesh
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, SCRIPT_DIR)

import importlib.util
spec = importlib.util.spec_from_file_location("diorama_mod", os.path.join(SCRIPT_DIR, "blender-build-world-diorama.py"))
diorama_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(diorama_mod)

OUT_DIR = r"d:\Touhou RPG Refined\GensokyoMaps\public\models"
BLEND_DIR = r"d:\Touhou RPG Refined\GensokyoMaps\blender-sources"

def extract_mat_rgba_and_emissive(mat):
    if not mat:
        return (0.8, 0.8, 0.8, 1.0), False
    if "hex_color" in mat:
        return diorama_mod.hex_to_linear_rgb(mat["hex_color"]), bool(mat.get("is_emissive", False))
    if mat.use_nodes and mat.node_tree:
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        if bsdf:
            bc = bsdf.inputs["Base Color"].default_value
            rgba = (float(bc[0]), float(bc[1]), float(bc[2]), 1.0)
            em_str = 0.0
            if "Emission Strength" in bsdf.inputs:
                em_str = float(bsdf.inputs["Emission Strength"].default_value)
            if em_str > 0.3 and "Emission Color" in bsdf.inputs:
                ec = bsdf.inputs["Emission Color"].default_value
                if (ec[0] + ec[1] + ec[2]) > 0.05:
                    rgba = (float(ec[0]), float(ec[1]), float(ec[2]), 1.0)
            return rgba, (em_str > 0.3)
    dc = mat.diffuse_color
    return (float(dc[0]), float(dc[1]), float(dc[2]), 1.0), False

def optimize_current_scene_and_export(base_name, glb_out_path):
    bpy.context.view_layer.update()
    mesh_objs = [o for o in list(bpy.context.scene.objects) if o.type == 'MESH']
    if not mesh_objs:
        return 0, 0

    orig_count = len(mesh_objs)
    bm_opaque = bmesh.new()
    colors_opaque = []
    bm_emissive = bmesh.new()
    colors_emissive = []

    depsgraph = bpy.context.evaluated_depsgraph_get()

    for obj in mesh_objs:
        eval_obj = obj.evaluated_get(depsgraph)
        eval_mesh = eval_obj.to_mesh()

        mat = obj.data.materials[0] if obj.data.materials else None
        rgba, is_em = extract_mat_rgba_and_emissive(mat)

        bm_temp = bmesh.new()
        bm_temp.from_mesh(eval_mesh)
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
        eval_obj.to_mesh_clear()

    for obj in list(bpy.context.scene.objects):
        bpy.data.objects.remove(obj, do_unlink=True)

    new_count = 0
    if len(bm_opaque.verts) > 0:
        m_op = bpy.data.meshes.new(f"{base_name}_Opaque")
        o_op = bpy.data.objects.new(f"{base_name}_Opaque", m_op)
        bpy.context.collection.objects.link(o_op)
        bm_opaque.normal_update()
        bm_opaque.to_mesh(m_op)
        col_attr = m_op.color_attributes.new(name="Color", type='FLOAT_COLOR', domain='POINT')
        for idx, rgba in enumerate(colors_opaque):
            col_attr.data[idx].color = rgba
        o_op.data.materials.append(diorama_mod.make_vertex_color_mat(f"{base_name}_OpaqueMat", roughness=0.76, metallic=0.06, emissive=False))
        new_count += 1
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
        o_em.data.materials.append(diorama_mod.make_vertex_color_mat(f"{base_name}_EmissiveMat", roughness=0.35, metallic=0.1, emissive=True))
        new_count += 1
    bm_emissive.free()

    bpy.ops.export_scene.gltf(filepath=glb_out_path, export_format='GLB', export_yup=True, export_apply=True)
    return orig_count, new_count

if __name__ == "__main__":
    # 1. Build merged World Diorama & Human Village
    diorama_mod.build_world_diorama()
    diorama_mod.build_human_village_compound()

    # 2. Optimize all 21 landmark .blend files into 1-2 merged meshes each
    skip_files = {"all-landmarks-showcase.blend", "gensokyo-diorama-dressings.blend", "human-village.blend", "gensokyo-foliage-kit.blend"}
    for fname in sorted(os.listdir(BLEND_DIR)):
        if not fname.endswith(".blend") or fname in skip_files:
            continue
        loc_id = fname[:-6]
        blend_path = os.path.join(BLEND_DIR, fname)
        glb_path = os.path.join(OUT_DIR, f"{loc_id}.glb")
        bpy.ops.wm.open_mainfile(filepath=blend_path)
        orig_c, new_c = optimize_current_scene_and_export(loc_id, glb_path)
        print(f"OPTIMIZED {loc_id}: {orig_c} meshes -> {new_c} meshes ({os.path.getsize(glb_path)} bytes)")
