"""
Blender 5.2 3D Low-Poly Touhou Character Figurine Builder
Generates `public/models/gensokyo-characters.glb` and `blender-sources/gensokyo-characters.blend`.
Each of the 58 iconic residents is sculpted as a vertex-colored low-poly 3D chibi figurine
with canonical hair, headgear, wings, and weapons/props, centered in local object space
for zero-lag batch rendering in Three.js.
"""
import bpy
import bmesh
import math
import os

ROOT_DIR = r"d:\Touhou RPG Refined\GensokyoMaps"
MODELS_DIR = os.path.join(ROOT_DIR, "public", "models")
BLEND_DIR = os.path.join(ROOT_DIR, "blender-sources")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(BLEND_DIR, exist_ok=True)


def hex_to_rgba(h, alpha=1.0):
    h = h.lstrip('#')
    return (
        int(h[0:2], 16) / 255.0,
        int(h[2:4], 16) / 255.0,
        int(h[4:6], 16) / 255.0,
        alpha,
    )


def shade_rgba(rgba, factor):
    return (
        min(1.0, max(0.0, rgba[0] * factor)),
        min(1.0, max(0.0, rgba[1] * factor)),
        min(1.0, max(0.0, rgba[2] * factor)),
        rgba[3],
    )


RESIDENTS = [
    # id, hairColor, hairStyle, eyeColor, outfitPrimary, outfitSecondary, accentColor, headgear, wings, prop
    ("remilia-scarlet", "#92b4f4", "short", "#e0243c", "#f7d8e4", "#c81e32", "#ff3858", "mob_cap", "bat", "gungnir"),
    ("flandre-scarlet", "#f6d860", "side_tail", "#e62238", "#d92232", "#fce6ec", "#ffbe3c", "mob_cap", "flandre_crystal", "laevateinn"),
    ("sakuya-izayoi", "#d8e0ef", "braid", "#3b64b8", "#243a7a", "#f4f6fa", "#36a868", "maid_band", "none", "none"),
    ("patchouli-knowledge", "#9b54b6", "long", "#7a3ea0", "#d89ce8", "#682c8a", "#f2ca52", "patchouli_cap", "none", "book"),
    ("hong-meiling", "#c92e3a", "long", "#3c78c8", "#267844", "#f2f0e8", "#e8c448", "meiling_beret", "none", "none"),
    ("koakuma", "#c63646", "wavy", "#b02838", "#221e28", "#b62838", "#f2e8dc", "none", "bat", "book"),
    ("cirno", "#56a8f5", "bob", "#2575d8", "#2b6cd4", "#eef6ff", "#7be0ff", "ribbon", "cirno_ice", "none"),
    ("daiyousei", "#72cf68", "side_tail", "#2d8a4e", "#2d7a4c", "#f4f8ec", "#f2d44e", "ribbon", "fairy", "none"),
    ("wakasagihime", "#3c8cd4", "wavy", "#28a89e", "#225e9c", "#86d8d4", "#e26a8c", "none", "none", "none"),
    ("lunasa-prismriver", "#dcd8b8", "bob", "#9c3a44", "#26262e", "#f2eee6", "#d43844", "mob_cap", "none", "none"),
    ("reimu-hakurei", "#2c1f28", "long", "#8e2b36", "#d4262e", "#f8f6f2", "#f2ca48", "reimu_bow", "none", "gohei"),
    ("suika-ibuki", "#e89a54", "side_tail", "#c83c32", "#f2ece2", "#583898", "#d8382c", "oni_horns", "none", "gourd"),
    ("shinmyoumaru-sukuna", "#dcd8e8", "bob", "#c82848", "#b83258", "#f6eff4", "#e8b842", "shinmy_bowl", "none", "katana"),
    ("sunny-milk", "#f49a42", "twintails", "#d84828", "#e24434", "#fcf6ec", "#f8d048", "mob_cap", "fairy", "none"),
    ("luna-child", "#f4e078", "twintails", "#a86e24", "#f6f0dc", "#684428", "#e8c448", "mob_cap", "fairy", "none"),
    ("star-sapphire", "#362e3e", "long", "#2c5ec8", "#2852a8", "#f2f4fa", "#e83848", "ribbon", "fairy", "none"),
    ("marisa-kirisame", "#f6d458", "braid", "#d49a28", "#222028", "#f6f4f0", "#f4c842", "witch_hat", "none", "broom"),
    ("alice-margatroid", "#f4dc6c", "bob", "#3868b8", "#3464b8", "#f8f4f2", "#e4384c", "ribbon", "none", "book"),
    ("rinnosuke-morichika", "#c8cee0", "short", "#7a6848", "#2c4478", "#d8d4c8", "#b88638", "none", "none", "book"),
    ("narumi-yatadera", "#2c2832", "bob", "#b83238", "#c82c34", "#38343c", "#d8b448", "narumi_kasa", "none", "orb"),
    ("rumia", "#f4d862", "bob", "#c82834", "#201e26", "#f4f2ee", "#d82834", "ribbon", "none", "none"),
    ("kosuzu-motoori", "#b84a2c", "twintails", "#a84228", "#48884c", "#f2e8c8", "#d43c38", "ribbon", "none", "book"),
    ("hieda-no-akyuu", "#9852b8", "bob", "#7a3898", "#e87898", "#f6d884", "#c82c44", "ribbon", "none", "scroll"),
    ("keine-kamishirasawa", "#cdd8f0", "long", "#3858a8", "#28488e", "#f4f4f8", "#368a58", "crown", "none", "scroll"),
    ("miyoi-okunoda", "#e86888", "bob", "#2878a8", "#2c5888", "#f4f2ec", "#e87898", "kappa_cap", "none", "gourd"),
    ("sekibanki", "#b8283c", "bob", "#c82838", "#c82838", "#24242c", "#f2ece4", "ribbon", "none", "none"),
    ("mystia-lorelei", "#c87898", "short", "#983864", "#683458", "#f4ecee", "#d8b458", "tengu_tokin", "crow", "lantern"),
    ("mamizou-futatsuiwa", "#8c5a38", "long", "#b87828", "#3e6e48", "#f2ece0", "#c87834", "wolf_ears", "none", "scroll"),
    ("byakuren-hijiri", "#8e5ab8", "wavy", "#6848a8", "#24202c", "#f4f0f6", "#c888d8", "none", "none", "scroll"),
    ("shou-toramaru", "#e8b848", "bob", "#b87824", "#d87828", "#f6f2e8", "#f8d854", "crown", "none", "pagoda"),
    ("minamitsu-murasa", "#2c4848", "short", "#287888", "#243458", "#f4f6f8", "#c8343c", "meiling_beret", "none", "anchor"),
    ("nazrin", "#7c7884", "short", "#b82834", "#3e4252", "#dcd8d4", "#d43844", "wolf_ears", "none", "gohei"),
    ("kogasa-tatara", "#3ad4d8", "short", "#d82c3c", "#3858a8", "#f4eef2", "#8838a8", "none", "none", "parasol"),
    ("toyosatomimi-no-miko", "#e8c458", "short", "#a86828", "#683898", "#f6f2ec", "#f2ca48", "miko_earmuffs", "none", "katana"),
    ("mononobe-no-futo", "#b8bec8", "side_tail", "#2c5898", "#eef2f6", "#3868b8", "#2c4888", "futo_eboshi", "none", "orb"),
    ("seiga-kaku", "#2c68a8", "twintails", "#285898", "#2c5898", "#e8eef8", "#e8b848", "ribbon", "none", "fan"),
    ("kaguya-houraisan", "#1e1c24", "long", "#583868", "#d8385c", "#fce8ee", "#f2ca48", "none", "none", "fan"),
    ("eirin-yagokoro", "#d8dce8", "braid", "#586898", "#c8283c", "#343878", "#f2d458", "patchouli_cap", "none", "gohei"),
    ("reisen-udongein-inaba", "#b898d8", "long", "#d8283c", "#242434", "#f4f2f8", "#d83848", "bunny_ears", "none", "none"),
    ("tewi-inaba", "#282228", "bob", "#b82838", "#f4a8b8", "#f8f4f6", "#d8283c", "bunny_ears", "none", "none"),
    ("fujiwara-no-mokou", "#eef0f8", "long", "#c82834", "#c82834", "#f6f4f2", "#ff7828", "reimu_bow", "none", "none"),
    ("yuuka-kazami", "#44b858", "bob", "#c82834", "#c82834", "#f8f4f0", "#f4d448", "none", "none", "parasol"),
    ("medicine-melancholy", "#f2d458", "bob", "#c82838", "#b8283c", "#242028", "#f4e8ee", "ribbon", "none", "none"),
    ("yukari-yakumo", "#f4d868", "long", "#783898", "#783898", "#f8f4f8", "#d8283c", "yukari_cap", "none", "parasol"),
    ("ran-yakumo", "#f4d862", "short", "#4868b8", "#3452a8", "#f6f4f8", "#f2ca48", "ran_cap", "none", "scroll"),
    ("chen", "#684434", "short", "#884828", "#d8382c", "#2c7848", "#f2d458", "chen_cap", "none", "none"),
    ("sanae-kochiya", "#44c868", "long", "#2c9858", "#3878d8", "#f6f8fc", "#58d878", "suwako_hat", "none", "gohei"),
    ("kanako-yasaka", "#584888", "short", "#b82838", "#c82838", "#282438", "#e8d488", "crown", "none", "orb"),
    ("suwako-moriya", "#e8d068", "bob", "#688848", "#584498", "#f4f0f8", "#d8c468", "suwako_hat", "none", "orb"),
    ("aya-shameimaru", "#1e1c24", "bob", "#c82834", "#242228", "#f6f4f0", "#d82834", "tengu_tokin", "crow", "camera"),
    ("momiji-inubashiri", "#eef0f6", "short", "#c83434", "#f4f2ee", "#c82834", "#e8b842", "wolf_ears", "none", "shield_sword"),
    ("hatate-himekaidou", "#583c48", "twintails", "#9848a8", "#784898", "#f4eef8", "#e8c448", "tengu_tokin", "crow", "camera"),
    ("nitori-kawashiro", "#3888d8", "twintails", "#2868b8", "#2c78c8", "#68c858", "#f2d448", "kappa_cap", "none", "none"),
    ("kasen-ibaraki", "#e86888", "twintails", "#c83848", "#d8384c", "#f6f2ec", "#48a858", "ribbon", "none", "scroll"),
    ("seija-kijin", "#24222c", "bob", "#c82838", "#b82838", "#f2eef4", "#3858b8", "oni_horns", "none", "none"),
    ("ariya-iwanaga", "#989ca8", "long", "#d84858", "#585c68", "#dcdce4", "#e85848", "crown", "none", "orb"),
    ("tenshi-hinanawi", "#3868d8", "long", "#c82838", "#2c58b8", "#f6f4f8", "#e85878", "tenshi_hat", "none", "katana"),
    ("iku-nagae", "#6848a8", "bob", "#c8283c", "#2c2838", "#f4eef8", "#d83848", "patchouli_cap", "none", "fan"),
    ("yuyuko-saigyouji", "#f298b8", "bob", "#b83868", "#78b8e8", "#f6f8fc", "#e85888", "yuyuko_veil", "none", "fan"),
    ("youmu-konpaku", "#e4ece8", "bob", "#287868", "#246858", "#f4f8f6", "#283834", "ribbon", "myon", "katana"),
    ("eiki-shiki", "#34884c", "bob", "#2c6844", "#243878", "#f6f4f0", "#e8c448", "eiki_yama", "none", "rod_of_remorse"),
    ("komachi-onozuka", "#d82848", "twintails", "#b8283c", "#2c4888", "#f4f2f6", "#e8b848", "ribbon", "none", "scythe"),
    ("yuuma-toutetsu", "#e8ecf2", "wavy", "#c82834", "#28242c", "#b82834", "#78b8e8", "oni_horns", "none", "spoon"),
    ("keiki-haniyasushin", "#48b8c8", "long", "#288898", "#346898", "#e8c468", "#f4eef0", "patchouli_cap", "none", "katana"),
    ("satori-komeiji", "#d878a8", "bob", "#b84878", "#7898d8", "#f6d8e8", "#e02848", "satori_band", "satori_eye", "none"),
    ("koishi-komeiji", "#78c498", "wavy", "#389878", "#f2ca48", "#2c5848", "#386898", "koishi_hat", "satori_eye", "none"),
    ("utsuho-reiuji", "#382824", "long", "#c82834", "#287848", "#f4f2ee", "#e83828", "okuu_ribbon", "crow", "control_rod"),
    ("rin-kaenbyou", "#b8282c", "braid", "#c87828", "#243c38", "#f2ece4", "#d8382c", "cat_ears", "none", "lantern"),
    ("yuugi-hoshiguma", "#f4d862", "short", "#c82834", "#f4f2ec", "#2c3c68", "#d82828", "oni_horns", "none", "gourd"),
    ("parsee-mizuhashi", "#f4d868", "bob", "#389858", "#282434", "#388858", "#e87898", "none", "none", "none"),
    ("shinki", "#d8dce8", "long", "#8838a8", "#c8283c", "#f6f2f8", "#9848d8", "crown", "angel", "none"),
    ("watatsuki-no-yorihime", "#683868", "ponytail", "#b82838", "#d8384c", "#f8f4f6", "#f2ca48", "reimu_bow", "none", "katana"),
    ("junko", "#f4c848", "long", "#c82834", "#24202c", "#c82834", "#f4c848", "crown", "none", "orb"),
    ("okina-matara", "#f4d458", "long", "#c87828", "#882838", "#282434", "#f4c848", "koishi_hat", "none", "none"),
]


class CharacterBmeshBuilder:
    """Builds a single character's opaque & emissive bmeshes with per-loop Col vertex colors."""

    def __init__(self):
        self.bm_opaque = bmesh.new()
        self.col_opaque = self.bm_opaque.loops.layers.color.new("Col")
        self.bm_emissive = bmesh.new()
        self.col_emissive = self.bm_emissive.loops.layers.color.new("Col")

    def _color_geom(self, bm, col_layer, verts, rgba, shade_z=True):
        if not verts:
            return
        zs = [v.co.z for v in verts]
        zmin, zmax = min(zs), max(zs)
        zspan = max(0.001, zmax - zmin)
        vert_set = set(verts)
        for f in bm.faces:
            if all(v in vert_set for v in f.verts):
                f.smooth = True
                for loop in f.loops:
                    if shade_z:
                        t = (loop.vert.co.z - zmin) / zspan
                        fac = 0.84 + 0.24 * t
                        loop[col_layer] = shade_rgba(rgba, fac)
                    else:
                        loop[col_layer] = rgba

    def add_cone(self, r1, r2, depth, loc, rgba, segs=10, rot=(0, 0, 0), scale=(1, 1, 1), emissive=False):
        bm = self.bm_emissive if emissive else self.bm_opaque
        cl = self.col_emissive if emissive else self.col_opaque
        res = bmesh.ops.create_cone(
            bm, cap_ends=True, cap_tris=True, segments=segs, radius1=r1, radius2=r2, depth=depth
        )
        verts = res["verts"]
        bmesh.ops.scale(bm, vec=scale, verts=verts)
        if any(rot):
            bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=math_rot(rot), verts=verts)
        bmesh.ops.translate(bm, vec=loc, verts=verts)
        self._color_geom(bm, cl, verts, rgba, shade_z=not emissive)

    def add_sphere(self, radius, loc, rgba, u_segs=10, v_segs=8, scale=(1, 1, 1), rot=(0, 0, 0), emissive=False):
        bm = self.bm_emissive if emissive else self.bm_opaque
        cl = self.col_emissive if emissive else self.col_opaque
        res = bmesh.ops.create_uvsphere(bm, u_segments=u_segs, v_segments=v_segs, radius=radius)
        verts = res["verts"]
        bmesh.ops.scale(bm, vec=scale, verts=verts)
        if any(rot):
            bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=math_rot(rot), verts=verts)
        bmesh.ops.translate(bm, vec=loc, verts=verts)
        self._color_geom(bm, cl, verts, rgba, shade_z=not emissive)

    def add_box(self, size, loc, rgba, rot=(0, 0, 0), emissive=False):
        bm = self.bm_emissive if emissive else self.bm_opaque
        cl = self.col_emissive if emissive else self.col_opaque
        res = bmesh.ops.create_cube(bm, size=1.0)
        verts = res["verts"]
        bmesh.ops.scale(bm, vec=size, verts=verts)
        if any(rot):
            bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=math_rot(rot), verts=verts)
        bmesh.ops.translate(bm, vec=loc, verts=verts)
        self._color_geom(bm, cl, verts, rgba, shade_z=not emissive)


import mathutils


def math_rot(euler_xyz):
    return mathutils.Euler(euler_xyz, 'XYZ').to_matrix()


def build_character_meshes(entry, grid_pos):
    (
        cid,
        hair_hex,
        hair_style,
        eye_hex,
        prim_hex,
        sec_hex,
        acc_hex,
        headgear,
        wings,
        prop,
    ) = entry

    b = CharacterBmeshBuilder()
    hair_col = hex_to_rgba(hair_hex)
    hair_dark = shade_rgba(hair_col, 0.78)
    eye_col = hex_to_rgba(eye_hex)
    prim_col = hex_to_rgba(prim_hex)
    sec_col = hex_to_rgba(sec_hex)
    acc_col = hex_to_rgba(acc_hex)
    skin_col = hex_to_rgba("#ffe4d0")
    blush_col = hex_to_rgba("#ff92a6")
    white_col = hex_to_rgba("#f8f6f4")
    shoe_col = hex_to_rgba("#241e28")
    pedestal_col = hex_to_rgba("#2c2432")

    # 1. Pedestal Disc + Accent Ring (z = 0..0.08)
    b.add_cone(0.56, 0.52, 0.06, (0, 0, 0.03), pedestal_col, segs=12)
    b.add_cone(0.58, 0.58, 0.025, (0, 0, 0.06), acc_col, segs=12)

    # 2 & 3. Character-Specific Lower Body (Mermaid Tail, Suspender Trousers, Hakama, or Skirt)
    if cid == "wakasagihime":
        # Aquatic blue mermaid tail + flared pink caudal fin (`dairi_ref_sheet_3.png` [1,3])
        tail_blue = hex_to_rgba("#98cce0")
        fin_pink = hex_to_rgba("#f4a8c8")
        b.add_cone(0.32, 0.16, 0.56, (0, 0.06, 0.44), tail_blue, segs=10, rot=(-0.35, 0, 0))
        b.add_cone(0.16, 0.08, 0.36, (0.10, 0.24, 0.20), tail_blue, segs=8, rot=(0.2, 0.55, 0))
        b.add_box((0.36, 0.24, 0.06), (0.22, 0.34, 0.14), fin_pink, rot=(0.15, 0.35, 0.4))
        # Green kimono + purple obi + pink ruffle
        b.add_cone(0.42, 0.26, 0.48, (0, 0, 0.86), hex_to_rgba("#4c8858"), segs=12)
        b.add_cone(0.34, 0.32, 0.14, (0, 0, 1.02), hex_to_rgba("#783888"), segs=12)
    elif cid == "fujiwara-no-mokou":
        # High-waisted baggy crimson suspender trousers with white talisman patches (`dairi_ref_sheet_2.png` [2,4])
        pants_red = hex_to_rgba("#d84434")
        for sx in (-0.16, 0.16):
            b.add_cone(0.11, 0.09, 0.14, (sx, -0.04, 0.13), hex_to_rgba("#c82828"), segs=8, scale=(1.0, 1.35, 1.0))
            b.add_cone(0.19, 0.15, 0.84, (sx, 0.0, 0.58), pants_red, segs=10)
            b.add_box((0.12, 0.05, 0.12), (sx, -0.16, 0.54), white_col)
        b.add_cone(0.32, 0.26, 0.26, (0, 0, 0.98), pants_red, segs=10)
    elif cid == "rinnosuke-morichika":
        # Half-black, half-blue kimono haori over baggy blue hakama trousers (`dairi_ref_sheet_3.png` [3,2])
        hakama_blue = hex_to_rgba("#5868b8")
        for sx in (-0.16, 0.16):
            b.add_cone(0.11, 0.09, 0.14, (sx, -0.04, 0.13), white_col, segs=8, scale=(1.0, 1.35, 1.0))
            b.add_cone(0.18, 0.14, 0.68, (sx, 0.0, 0.50), hakama_blue, segs=10)
        b.add_box((0.26, 0.38, 0.56), (-0.13, 0, 0.88), hex_to_rgba("#282830"))
        b.add_box((0.26, 0.38, 0.56), (0.13, 0, 0.88), hex_to_rgba("#4858a8"))
        b.add_box((0.22, 0.12, 0.14), (0, -0.22, 0.98), hex_to_rgba("#e86828"))
    else:
        # Standard Chibi Legs & Shoes (z = 0.08..0.66)
        sock_col = shoe_col if cid in ("eiki-shiki", "yuuka-kazami") else white_col
        s_col = (
            hex_to_rgba("#d82834")
            if cid in ("reimu-hakurei", "remilia-scarlet", "flandre-scarlet", "rumia", "medicine-melancholy")
            else shoe_col
        )
        for sx in (-0.15, 0.15):
            b.add_cone(0.11, 0.09, 0.14, (sx, -0.04, 0.13), s_col, segs=8, scale=(1.0, 1.35, 1.0))
            b.add_cone(0.085, 0.095, 0.44, (sx, 0.0, 0.38), sock_col, segs=8)
        if cid == "utsuho-reiuji":
            # Okuu's heavy grey concrete nuclear containment foot on right leg (`dairi_ref_sheet_2.png` [3,3])
            b.add_cone(0.14, 0.13, 0.42, (-0.15, -0.02, 0.28), hex_to_rgba("#888480"), segs=8)

        # Flared Chibi Skirt & Ruffle Hem (z = 0.52..1.16)
        if cid == "eirin-yagokoro":
            # Split half-crimson / half-royal-blue sage dress (`dairi_ref_sheet_2.png` [2,2])
            b.add_cone(0.52, 0.48, 0.10, (0, 0, 0.57), white_col, segs=12)
            b.add_box((0.36, 0.56, 0.54), (-0.16, 0, 0.85), hex_to_rgba("#283888"))
            b.add_box((0.36, 0.56, 0.54), (0.16, 0, 0.85), hex_to_rgba("#d42c3c"))
        elif cid == "tenshi-hinanawi":
            # Blue skirt + 6-color rainbow pleated overskirt (`dairi_ref_sheet_1.png` [4,4])
            b.add_cone(0.52, 0.48, 0.10, (0, 0, 0.57), white_col, segs=12)
            b.add_cone(0.47, 0.24, 0.54, (0, 0, 0.85), hex_to_rgba("#2858b8"), segs=12)
            rainbow = ["#ff3848", "#ff9828", "#f8e838", "#48d868", "#4898ff", "#a858f8"]
            for r_idx, r_hex in enumerate(rainbow):
                rx = -0.20 + r_idx * 0.08
                b.add_box((0.075, 0.08, 0.38), (rx, -0.32, 0.88), hex_to_rgba(r_hex), rot=(-0.36, 0, 0))
        elif cid == "momiji-inubashiri":
            # Black skirt with bold red maple-flame hem (`dairi_ref_sheet_1.png` [4,2])
            b.add_cone(0.52, 0.46, 0.16, (0, 0, 0.60), hex_to_rgba("#d82828"), segs=12)
            b.add_cone(0.45, 0.24, 0.48, (0, 0, 0.88), hex_to_rgba("#1e1c24"), segs=12)
        elif cid in ("yukari-yakumo", "ran-yakumo", "kasen-ibaraki", "okina-matara"):
            # Skirt with vertical center Taoist/sage tabard
            tab_col = (
                hex_to_rgba("#283888")
                if cid == "ran-yakumo"
                else (hex_to_rgba("#d82828") if cid == "kasen-ibaraki" else (hex_to_rgba("#e88828") if cid == "okina-matara" else white_col))
            )
            b.add_cone(0.52, 0.48, 0.10, (0, 0, 0.57), sec_col, segs=12)
            b.add_cone(0.47, 0.24, 0.54, (0, 0, 0.85), prim_col, segs=12)
            b.add_box((0.26, 0.08, 0.56), (0, -0.34, 0.84), tab_col, rot=(-0.36, 0, 0))
        else:
            b.add_cone(0.52, 0.48, 0.10, (0, 0, 0.57), sec_col, segs=12)
            b.add_cone(0.47, 0.24, 0.54, (0, 0, 0.85), prim_col, segs=12)
            if cid in ("marisa-kirisame", "sakuya-izayoi", "kosuzu-motoori", "miyoi-okunoda", "remilia-scarlet", "komachi-onozuka"):
                apron_col = (
                    hex_to_rgba("#f4c868")
                    if cid == "kosuzu-motoori"
                    else (hex_to_rgba("#1e6898") if cid == "miyoi-okunoda" else white_col)
                )
                b.add_box((0.34, 0.08, 0.50), (0, -0.34, 0.84), apron_col, rot=(-0.38, 0, 0))

    # 4. Chibi Torso, Collar Bow & Character-Accurate Sleeves (z = 1.08..1.52)
    torso_col = (
        white_col
        if cid in ("fujiwara-no-mokou", "yuugi-hoshiguma", "utsuho-reiuji", "aya-shameimaru", "momiji-inubashiri", "reisen-udongein-inaba", "minamitsu-murasa")
        else (hex_to_rgba("#f2b844") if cid == "koishi-komeiji" else (hex_to_rgba("#b8d4f4") if cid == "satori-komeiji" else prim_col))
    )
    if cid == "eirin-yagokoro":
        b.add_box((0.22, 0.34, 0.44), (-0.10, 0, 1.28), hex_to_rgba("#d42c3c"))
        b.add_box((0.22, 0.34, 0.44), (0.10, 0, 1.28), hex_to_rgba("#283888"))
    else:
        b.add_cone(0.24, 0.20, 0.44, (0, 0, 1.28), torso_col, segs=10)
        b.add_box((0.22, 0.08, 0.36), (0, -0.19, 1.28), sec_col)

    # Throat Ribbon / Chest Emblem
    b.add_box((0.24, 0.08, 0.10), (0, -0.22, 1.44), acc_col)
    if cid == "kanako-yasaka":
        # Round silver/black Yata Mirror on Kanako's chest (`dairi_ref_sheet_1.png` [3,3])
        b.add_sphere(0.11, (0, -0.23, 1.28), white_col, u_segs=8, v_segs=6, scale=(1.0, 0.4, 1.0))
        b.add_sphere(0.07, (0, -0.25, 1.28), shoe_col, u_segs=8, v_segs=6, scale=(1.0, 0.4, 1.0))
    elif cid == "eiki-shiki":
        # Gold shoulder epaulets (`dairi_ref_sheet_2.png` [4,3])
        for sx in (-1, 1):
            b.add_box((0.16, 0.14, 0.06), (sx * 0.24, 0, 1.46), hex_to_rgba("#f4d048"))

    # Sleeves & Hands (Detached wide miko sleeves for Reimu/Sanae/Suwako, standard for others)
    for sx in (-1, 1):
        if cid in ("reimu-hakurei", "sanae-kochiya", "suwako-moriya"):
            # Bare skin shoulder + wide flaring detached white miko sleeve (`dairi_ref_sheet_1.png` [1,1], [3,2])
            b.add_sphere(0.10, (sx * 0.24, 0.0, 1.40), skin_col, u_segs=8, v_segs=6)
            b.add_cone(
                0.18,
                0.09,
                0.36,
                (sx * 0.36, -0.03, 1.16),
                white_col,
                segs=8,
                rot=(0.15, sx * -0.38, 0),
            )
            b.add_sphere(0.075, (sx * 0.42, -0.08, 0.98), skin_col, u_segs=8, v_segs=6)
        else:
            b.add_sphere(0.13, (sx * 0.26, 0.0, 1.38), sec_col, u_segs=8, v_segs=6)
            b.add_cone(
                0.075,
                0.085,
                0.32,
                (sx * 0.33, -0.04, 1.18),
                torso_col,
                segs=8,
                rot=(0.15, sx * -0.32, 0),
            )
            b.add_sphere(0.075, (sx * 0.38, -0.08, 1.02), skin_col, u_segs=8, v_segs=6)

    # 5. Chibi Head, Eyes, Blush & Hair (z = 1.50..2.26)
    head_z = 1.84
    b.add_sphere(0.36, (0, -0.02, head_z), skin_col, u_segs=12, v_segs=10, scale=(1.02, 0.98, 1.0))

    # Anime Eyes (facing -Y, supporting Kogasa's heterochromia!)
    for sx in (-0.13, 0.13):
        this_eye = hex_to_rgba("#2878d8") if (cid == "kogasa-tatara" and sx > 0) else eye_col
        b.add_sphere(0.068, (sx, -0.34, head_z - 0.03), this_eye, u_segs=8, v_segs=6, scale=(0.9, 0.45, 1.15))
        b.add_sphere(0.026, (sx + 0.02, -0.37, head_z + 0.01), white_col, u_segs=6, v_segs=6)
        b.add_sphere(0.042, (sx * 1.45, -0.32, head_z - 0.11), blush_col, u_segs=6, v_segs=6, scale=(1.2, 0.4, 0.7))

    # Hair Crown & Bangs (shifted slightly up & back so face is 100% clean)
    b.add_sphere(0.38, (0, 0.06, head_z + 0.08), hair_col, u_segs=12, v_segs=10, scale=(1.04, 0.98, 0.94))
    for bx, rot_z in ((-0.15, 0.15), (0.0, 0.0), (0.15, -0.15)):
        b.add_cone(0.065, 0.11, 0.24, (bx, -0.32, head_z + 0.14), hair_col, segs=6, rot=(0.25, 0, rot_z))
    for sx in (-0.32, 0.32):
        s_lock_col = white_col if cid == "reimu-hakurei" else hair_col
        b.add_cone(0.06, 0.10, 0.42, (sx, -0.16, head_z - 0.06), s_lock_col, segs=6, rot=(0.08, 0, 0))

    # Style-Specific Back Hair
    if hair_style in ("long", "wavy"):
        b.add_box((0.64, 0.18, 0.85), (0, 0.22, head_z - 0.34), hair_dark, rot=(-0.18, 0, 0))
        if cid == "byakuren-hijiri":
            # Blonde-peach gradient hair tips (`dairi_ref_sheet_2.png` [4,1])
            b.add_box((0.68, 0.18, 0.36), (0, 0.28, head_z - 0.68), hex_to_rgba("#f2ca78"), rot=(-0.18, 0, 0))
    elif hair_style == "twintails":
        for sx in (-1, 1):
            b.add_cone(
                0.15,
                0.08,
                0.68,
                (sx * 0.44, 0.08, head_z - 0.16),
                hair_col,
                segs=8,
                rot=(-0.1, sx * 0.32, 0),
            )
    elif hair_style == "side_tail":
        b.add_cone(0.16, 0.08, 0.56, (0.44, 0.05, head_z - 0.06), hair_col, segs=8, rot=(0, 0.42, 0))
    elif hair_style == "ponytail":
        b.add_cone(0.16, 0.08, 0.62, (0, 0.38, head_z - 0.05), hair_dark, segs=8, rot=(-0.45, 0, 0))
    elif hair_style == "braid":
        b.add_cone(0.10, 0.07, 0.62, (-0.34, -0.12, head_z - 0.28), hair_col, segs=7, rot=(0.2, 0.15, 0))

    # 6. Headgear
    top_z = head_z + 0.36
    if headgear == "reimu_bow":
        for sx in (-1, 1):
            b.add_box(
                (0.42, 0.10, 0.24),
                (sx * 0.26, 0.16, top_z - 0.04),
                hex_to_rgba("#d8242e"),
                rot=(0, sx * 0.28, 0),
            )
        b.add_sphere(0.11, (0, 0.16, top_z - 0.04), hex_to_rgba("#f43842"), u_segs=8, v_segs=6)
    elif headgear == "witch_hat":
        hat_blk = hex_to_rgba("#1e1c26")
        b.add_cone(0.68, 0.64, 0.05, (0, 0, top_z - 0.04), hat_blk, segs=14)
        b.add_cone(0.36, 0.32, 0.10, (0, 0, top_z + 0.02), white_col, segs=12)
        b.add_box((0.42, 0.14, 0.16), (0, -0.32, top_z + 0.04), white_col)  # Giant front white bow
        b.add_cone(0.34, 0.03, 0.62, (0, 0.06, top_z + 0.32), hat_blk, segs=10, rot=(-0.22, 0, 0))
    elif headgear in ("mob_cap", "yukari_cap", "patchouli_cap"):
        cap_col = prim_col if headgear == "patchouli_cap" else hex_to_rgba("#fcf4f8")
        b.add_sphere(0.42, (0, 0.02, top_z - 0.02), cap_col, u_segs=12, v_segs=8, scale=(1.08, 1.08, 0.55))
        b.add_cone(0.44, 0.40, 0.07, (0, 0.02, top_z - 0.08), acc_col, segs=12)
    elif headgear == "maid_band":
        b.add_cone(0.38, 0.38, 0.07, (0, -0.04, top_z - 0.04), white_col, segs=12)
    elif headgear in ("meiling_beret", "kappa_cap"):
        b_col = hex_to_rgba("#288898") if cid == "miyoi-okunoda" else (hex_to_rgba("#98b848") if cid == "nitori-kawashiro" else prim_col)
        b.add_sphere(0.40, (0, 0.0, top_z - 0.02), b_col, u_segs=12, v_segs=8, scale=(1.05, 1.08, 0.48))
        b.add_sphere(0.06, (0, -0.38, top_z - 0.04), hex_to_rgba("#ffd848"), u_segs=6, v_segs=6, emissive=True)
    elif headgear == "yuyuko_veil":
        b.add_sphere(0.41, (0, 0.02, top_z - 0.02), hex_to_rgba("#88c8f4"), u_segs=12, v_segs=8, scale=(1.06, 1.06, 0.52))
        b.add_box((0.24, 0.06, 0.18), (0, -0.36, top_z - 0.05), white_col)
    elif headgear == "tengu_tokin":
        b.add_cone(0.11, 0.09, 0.16, (0, -0.18, top_z + 0.04), hex_to_rgba("#d82834"), segs=6)
    elif headgear == "suwako_hat":
        if cid == "sanae-kochiya":
            # Green frog hairclip + white snake hairband (`dairi_ref_sheet_1.png` [3,2])
            b.add_sphere(0.09, (0.24, -0.18, top_z - 0.04), hex_to_rgba("#58d878"), u_segs=8, v_segs=6)
        else:
            hat_tan = hex_to_rgba("#e4cf78")
            b.add_cone(0.56, 0.54, 0.05, (0, 0, top_z - 0.04), hat_tan, segs=12)
            b.add_cone(0.34, 0.30, 0.20, (0, 0, top_z + 0.06), hat_tan, segs=12)
            for sx in (-0.14, 0.14):
                b.add_sphere(0.08, (sx, -0.22, top_z + 0.16), white_col, u_segs=8, v_segs=6)
                b.add_sphere(0.04, (sx, -0.28, top_z + 0.17), shoe_col, u_segs=6, v_segs=6)
    elif headgear in ("eiki_yama", "futo_eboshi", "tojiko_eboshi"):
        c_col = hex_to_rgba("#1e2c58") if headgear == "eiki_yama" else white_col
        b.add_box((0.34, 0.26, 0.32), (0, 0, top_z + 0.08), c_col)
        b.add_box((0.52, 0.10, 0.06), (0, 0, top_z - 0.02), acc_col)
    elif headgear in ("tenshi_hat", "koishi_hat", "narumi_kasa"):
        h_col = (
            hex_to_rgba("#d8b868")
            if headgear == "narumi_kasa"
            else (hex_to_rgba("#282430") if headgear == "tenshi_hat" else shoe_col)
        )
        r_brim = 0.64 if headgear == "narumi_kasa" else 0.54
        b.add_cone(r_brim, r_brim * 0.95, 0.05, (0, 0, top_z - 0.04), h_col, segs=12)
        b.add_cone(0.34, 0.28, 0.18, (0, 0, top_z + 0.06), h_col, segs=12)
        if headgear == "tenshi_hat":
            b.add_sphere(0.08, (0.28, -0.18, top_z), hex_to_rgba("#ff8898"), u_segs=6, v_segs=6)  # Peach on brim
    elif headgear == "oni_horns":
        if cid == "yuugi-hoshiguma":
            b.add_cone(0.06, 0.01, 0.32, (0, -0.26, top_z + 0.08), hex_to_rgba("#ff2828"), segs=6, rot=(0.45, 0, 0), emissive=True)
        else:
            for sx in (-1, 1):
                b.add_cone(
                    0.065,
                    0.01,
                    0.34,
                    (sx * 0.24, -0.06, top_z + 0.08),
                    hex_to_rgba("#e8d088"),
                    segs=6,
                    rot=(0.15, sx * -0.45, 0),
                )
    elif headgear == "bunny_ears":
        ear_col = white_col if cid == "tewi-inaba" else hair_col
        for sx in (-1, 1):
            b.add_cone(
                0.075,
                0.045,
                0.48,
                (sx * 0.18, 0.0, top_z + 0.18),
                ear_col,
                segs=8,
                rot=(0.08, sx * -0.12, 0),
                scale=(1.0, 0.55, 1.0),
            )
    elif headgear in ("wolf_ears", "cat_ears", "ran_cap", "chen_cap", "miko_earmuffs"):
        for sx in (-1, 1):
            b.add_cone(
                0.10,
                0.01,
                0.24,
                (sx * 0.24, 0.0, top_z + 0.04),
                hair_col,
                segs=6,
                rot=(0, sx * -0.25, 0),
            )
    elif headgear == "crown":
        b.add_cone(0.24, 0.28, 0.16, (0, 0, top_z + 0.04), hex_to_rgba("#ffd848"), segs=8)
    elif headgear == "shinmy_bowl":
        b.add_cone(0.32, 0.44, 0.22, (0, 0, top_z + 0.04), hex_to_rgba("#b82848"), segs=12)
    elif headgear in ("ribbon", "okuu_ribbon", "satori_band"):
        b.add_box((0.26, 0.10, 0.14), (0.22, -0.08, top_z - 0.02), acc_col, rot=(0, 0.35, 0))
        if headgear == "okuu_ribbon":
            # Glowing red nuclear sun on Okuu's chest
            b.add_sphere(0.09, (0, -0.24, 1.30), hex_to_rgba("#ff2828"), u_segs=8, v_segs=6, emissive=True)

    # 7. Wings, Nine-Tails, Shimenawa, Capes & Back Auras
    if cid == "ran-yakumo":
        # 9 fluffy golden-blonde fox tails fanning behind Ran (`dairi_ref_sheet_2.png` [1,4])
        tail_gold = hex_to_rgba("#f6d862")
        for idx in range(9):
            ang = (idx - 4) * 0.28
            tx = math.sin(ang) * 0.48
            tz = 0.92 + math.cos(ang) * 0.34
            b.add_cone(0.14, 0.03, 0.62, (tx, 0.32, tz), tail_gold, segs=8, rot=(-0.35, ang, 0))
    elif cid == "kanako-yasaka":
        # Giant braided straw shimenawa ring + 4 onbashira logs behind Kanako (`dairi_ref_sheet_1.png` [3,3])
        rope_col = hex_to_rgba("#c89e58")
        log_col = hex_to_rgba("#785030")
        for idx in range(12):
            ang = (idx / 12.0) * math.pi * 2.0
            rx = math.cos(ang) * 0.58
            rz = 1.38 + math.sin(ang) * 0.58
            b.add_sphere(0.11, (rx, 0.28, rz), rope_col, u_segs=6, v_segs=6)
        for sx in (-0.52, 0.52):
            for sz in (0.95, 1.55):
                b.add_cone(0.09, 0.09, 0.42, (sx, 0.32, sz), log_col, segs=6, rot=(0, sx * 0.6, 0))
    elif cid == "toyosatomimi-no-miko":
        # Billowing magenta & crimson royal cape (`dairi_ref_sheet_2.png` [4,2])
        b.add_box((0.92, 0.08, 0.68), (0, 0.24, 1.18), hex_to_rgba("#d82878"), rot=(-0.22, 0, 0))
    elif cid == "junko":
        # 7 glowing magenta energy tails (`dairi_ref_sheet_5.png` [3,1])
        for idx in range(7):
            ang = (idx - 3) * 0.34
            b.add_cone(0.09, 0.01, 0.68, (math.sin(ang) * 0.48, 0.28, 1.15 + math.cos(ang) * 0.25), hex_to_rgba("#e848b8"), segs=6, rot=(-0.2, ang, 0), emissive=True)
    elif cid == "nitori-kawashiro":
        # Huge purple kappa hiking backpack (`dairi_ref_sheet_1.png` [4,3])
        b.add_sphere(0.32, (0, 0.28, 1.18), hex_to_rgba("#886498"), u_segs=8, v_segs=8, scale=(1.1, 0.8, 1.2))
    elif cid == "mamizou-futatsuiwa":
        # Giant bushy brown tanuki tail (`dairi_ref_sheet_4.png` [1,3])
        b.add_sphere(0.28, (0.28, 0.32, 0.78), hex_to_rgba("#8c5a38"), u_segs=8, v_segs=8, scale=(0.9, 1.3, 1.1))
    elif cid == "momiji-inubashiri":
        # Fluffy white wolf tail (`dairi_ref_sheet_1.png` [4,2])
        b.add_cone(0.14, 0.04, 0.48, (0.22, 0.30, 0.76), white_col, segs=8, rot=(-0.4, 0.35, 0))
    elif cid in ("rin-kaenbyou", "chen"):
        # Twin cat tails + Orin's blue skull spirit flames
        for sx in (-0.14, 0.14):
            b.add_cone(0.04, 0.02, 0.52, (sx, 0.28, 0.78), hair_dark, segs=6, rot=(-0.45, sx * 1.2, 0))
        if cid == "rin-kaenbyou":
            for sx in (-0.54, 0.54):
                b.add_sphere(0.11, (sx, -0.06, 1.48), hex_to_rgba("#48a8ff"), u_segs=8, v_segs=6, emissive=True)
    elif cid == "alice-margatroid":
        # Floating miniature blonde Shanghai doll (`dairi_ref_sheet_1.png` [3,1])
        b.add_sphere(0.11, (-0.52, -0.08, 1.62), hex_to_rgba("#f6d868"), u_segs=8, v_segs=6)
        b.add_cone(0.12, 0.06, 0.22, (-0.52, -0.08, 1.42), shoe_col, segs=8)

    if wings == "bat":
        bat_col = hex_to_rgba("#2c1838")
        for sx in (-1, 1):
            b.add_box((0.52, 0.04, 0.36), (sx * 0.46, 0.22, 1.32), bat_col, rot=(0, sx * 0.28, sx * -0.18))
    elif wings == "flandre_crystal":
        branch_col = hex_to_rgba("#28202c")
        crystal_hexes = [
            "#58b8ff", "#ff3848", "#ff9828", "#f8e838",
            "#48d868", "#4868f8", "#a848f8", "#ff68c8",
        ]
        for sx in (-1, 1):
            b.add_box((0.78, 0.035, 0.035), (sx * 0.52, 0.22, 1.36), branch_col, rot=(0, sx * 0.12, 0))
        for idx, c_hex in enumerate(crystal_hexes):
            side = -1 if idx < 4 else 1
            slot = idx if idx < 4 else idx - 4
            cx = side * (0.26 + slot * 0.18)
            cz = 1.18 + (slot % 2) * 0.06
            b.add_cone(0.085, 0.0, 0.16, (cx, 0.22, cz + 0.08), hex_to_rgba(c_hex), segs=4, emissive=True)
            b.add_cone(0.0, 0.085, 0.16, (cx, 0.22, cz - 0.08), hex_to_rgba(c_hex), segs=4, emissive=True)
    elif wings == "cirno_ice":
        ice_col = hex_to_rgba("#80ecff")
        for sx in (-1, 1):
            for idx, ang in enumerate((-0.38, 0.0, 0.38)):
                b.add_cone(
                    0.07,
                    0.01,
                    0.56,
                    (sx * 0.46, 0.22, 1.28 + (idx - 1) * 0.16),
                    ice_col,
                    segs=4,
                    rot=(0, sx * (1.25 + ang), 0),
                    emissive=True,
                )
    elif wings in ("fairy", "crow", "angel"):
        w_col = (
            hex_to_rgba("#dff6ff")
            if wings == "fairy"
            else (hex_to_rgba("#1e1c28") if wings == "crow" else hex_to_rgba("#c868e8"))
        )
        for sx in (-1, 1):
            b.add_box((0.48, 0.04, 0.44), (sx * 0.44, 0.22, 1.32), w_col, rot=(0, sx * 0.22, sx * -0.15))
        if cid == "utsuho-reiuji":
            # Okuu's starry blue nuclear cape between her crow wings (`dairi_ref_sheet_2.png` [3,3])
            b.add_box((0.68, 0.04, 0.72), (0, 0.25, 0.98), hex_to_rgba("#184888"), rot=(-0.18, 0, 0))
    elif wings == "myon":
        b.add_sphere(0.18, (-0.54, 0.05, 1.56), white_col, u_segs=8, v_segs=8, emissive=True)
        b.add_cone(0.14, 0.02, 0.38, (-0.58, 0.18, 1.35), white_col, segs=8, rot=(-0.4, 0.3, 0), emissive=True)
    elif wings == "satori_eye":
        e_col = hex_to_rgba("#7888a8") if cid == "koishi-komeiji" else hex_to_rgba("#ff3868")
        b.add_sphere(0.12, (0, -0.34, 1.12), e_col, u_segs=8, v_segs=8, emissive=True)

    # 8. Held Props & Weapons
    if prop in ("gungnir", "laevateinn"):
        w_col = hex_to_rgba("#ff2848") if prop == "gungnir" else hex_to_rgba("#ff4828")
        b.add_cone(0.04, 0.02, 1.65, (0.48, -0.14, 1.28), w_col, segs=6, rot=(0.18, 0, 0), emissive=True)
    elif prop in ("gohei", "broom", "scythe", "rod_of_remorse", "spoon", "anchor"):
        b.add_cone(0.03, 0.03, 1.35, (0.46, -0.12, 1.15), hex_to_rgba("#784828"), segs=6)
        if prop == "gohei":
            b.add_box((0.18, 0.06, 0.28), (0.46, -0.12, 1.78), white_col)
        elif prop == "broom":
            b.add_cone(0.16, 0.04, 0.38, (0.46, -0.12, 0.56), hex_to_rgba("#d8b458"), segs=8)
        elif prop == "scythe":
            b.add_box((0.46, 0.04, 0.12), (0.28, -0.12, 1.80), hex_to_rgba("#d8e0ef"))
        elif prop == "anchor":
            b.add_box((0.56, 0.08, 0.14), (0.46, 0.18, 0.85), hex_to_rgba("#c898a8"))
    elif prop in ("katana", "shield_sword"):
        blade_col = hex_to_rgba("#ffd848") if cid == "tenshi-hinanawi" else hex_to_rgba("#dce4f0")
        b.add_box((0.04, 0.08, 1.15), (0.46, -0.14, 1.25), blade_col, rot=(0.22, 0, 0), emissive=(cid == "tenshi-hinanawi"))
        if prop == "shield_sword":
            # Momiji's round white buckler shield with red maple leaf (`dairi_ref_sheet_1.png` [4,2])
            b.add_sphere(0.22, (-0.36, -0.22, 1.08), white_col, u_segs=10, v_segs=8, scale=(1.0, 0.35, 1.0))
            b.add_sphere(0.11, (-0.36, -0.26, 1.08), hex_to_rgba("#d82828"), u_segs=8, v_segs=6, scale=(1.0, 0.35, 1.0))
    elif prop == "parasol":
        b.add_cone(0.025, 0.025, 1.45, (0.44, -0.06, 1.38), hex_to_rgba("#583442"), segs=6)
        p_col = hex_to_rgba("#783898") if cid == "kogasa-tatara" else acc_col
        b.add_cone(0.52, 0.04, 0.26, (0.44, -0.06, 2.08), p_col, segs=12)
        if cid == "kogasa-tatara":
            # Kogasa's big red umbrella tongue (`dairi_ref_sheet_4.png` [2,3])
            b.add_box((0.12, 0.08, 0.28), (0.44, -0.34, 1.88), hex_to_rgba("#e82828"), rot=(0.35, 0, 0))
    elif prop == "control_rod":
        b.add_cone(0.16, 0.16, 0.68, (0.46, -0.12, 1.10), hex_to_rgba("#f49838"), segs=6, rot=(0.25, 0, 0))
        b.add_cone(0.12, 0.12, 0.52, (0.46, -0.12, 1.10), hex_to_rgba("#ffb858"), segs=6, rot=(0.25, 0, 0), emissive=True)
    elif prop in ("fan", "book", "scroll"):
        b.add_box((0.22, 0.16, 0.24), (0.42, -0.16, 1.08), acc_col, rot=(0.3, 0.2, 0))
    elif prop in ("orb", "pagoda", "lantern", "gourd"):
        orb_col = hex_to_rgba("#e82828") if cid == "yuugi-hoshiguma" else hex_to_rgba("#ffd848")
        b.add_sphere(0.12, (0.44, -0.16, 1.12), orb_col, u_segs=8, v_segs=6, emissive=True)

    # Create Blender Mesh Objects
    objs = []
    for suffix, bm in (("_Opaque", b.bm_opaque), ("_Emissive", b.bm_emissive)):
        if len(bm.verts) == 0:
            bm.free()
            continue
        mesh = bpy.data.meshes.new(f"{cid}{suffix}")
        bm.to_mesh(mesh)
        bm.free()
        obj = bpy.data.objects.new(f"{cid}{suffix}", mesh)
        obj.location = grid_pos
        bpy.context.collection.objects.link(obj)
        objs.append(obj)
    return objs


def create_vertex_color_material(name, emissive=False):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    vcol = nodes.new("ShaderNodeVertexColor")
    vcol.layer_name = "Col"

    bsdf.inputs["Roughness"].default_value = 0.35 if emissive else 0.72
    links.new(vcol.outputs["Color"], bsdf.inputs["Base Color"])
    if emissive and "Emission Color" in bsdf.inputs:
        links.new(vcol.outputs["Color"], bsdf.inputs["Emission Color"])
        bsdf.inputs["Emission Strength"].default_value = 1.8
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def main():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for mesh in list(bpy.data.meshes):
        if mesh.users == 0:
            bpy.data.meshes.remove(mesh)
    for mat in list(bpy.data.materials):
        if mat.users == 0:
            bpy.data.materials.remove(mat)

    mat_opaque = create_vertex_color_material("CharVertexOpaque", emissive=False)
    mat_emissive = create_vertex_color_material("CharVertexEmissive", emissive=True)

    cols = 8
    spacing = 2.2
    for idx, entry in enumerate(RESIDENTS):
        row = idx // cols
        col = idx % cols
        gx = (col - (cols - 1) / 2.0) * spacing
        gy = (row - 3.5) * spacing
        objs = build_character_meshes(entry, (gx, gy, 0.0))
        for o in objs:
            if o.name.endswith("_Emissive"):
                o.data.materials.append(mat_emissive)
            else:
                o.data.materials.append(mat_opaque)

    # Add Camera & Sun light for Blender viewport inspection
    cam_data = bpy.data.cameras.new("Camera")
    cam_obj = bpy.data.objects.new("Camera", cam_data)
    cam_obj.location = (0.0, -14.5, 9.5)
    cam_obj.rotation_euler = (math.radians(58), 0.0, 0.0)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj

    light_data = bpy.data.lights.new("Sun", type='SUN')
    light_data.energy = 3.5
    light_obj = bpy.data.objects.new("Sun", light_data)
    light_obj.location = (6.0, -8.0, 12.0)
    light_obj.rotation_euler = (math.radians(45), math.radians(15), math.radians(20))
    bpy.context.collection.objects.link(light_obj)

    glb_path = os.path.join(MODELS_DIR, "gensokyo-characters.glb")
    blend_path = os.path.join(BLEND_DIR, "gensokyo-characters.blend")

    bpy.ops.export_scene.gltf(
        filepath=glb_path,
        export_format='GLB',
        export_apply=False,
        export_yup=True,
    )
    bpy.ops.wm.save_as_mainfile(filepath=blend_path)
    print(f"Exported {len(RESIDENTS)} 3D Touhou characters to {glb_path}")


if __name__ == "__main__":
    main()
