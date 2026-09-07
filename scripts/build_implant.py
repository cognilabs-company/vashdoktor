"""
Headless Blender builder for a realistic dental implant assembly.

Run:
  blender --background --python scripts/build_implant.py

Produces:
  scripts/preview.png                  (studio render for visual review)
  public/models/implant_blender.glb    (separate named parts for the web app)

Parts are kept as distinct, sensibly-named objects (Crown, Abutment, Screw,
Implant, Gum, Bone) so the site's GSAP timeline can still explode / animate them.
"""

import bpy
import bmesh
import math
import os
from mathutils import Vector

# --------------------------------------------------------------------------
# Paths
# --------------------------------------------------------------------------
SCRIPT_DIR = os.path.dirname(os.path.abspath(bpy.data.filepath)) if bpy.data.filepath else None
# When run via --python, __file__ is available
try:
    HERE = os.path.dirname(os.path.abspath(__file__))
except NameError:
    HERE = os.getcwd()
PROJECT = os.path.abspath(os.path.join(HERE, ".."))
PREVIEW_PNG = os.path.join(HERE, "preview.png")
GLB_OUT = os.path.join(PROJECT, "public", "models", "implant_blender.glb")
GLB_SHOWCASE = os.path.join(PROJECT, "public", "models", "implant_showcase.glb")
GLB_CROWN = os.path.join(PROJECT, "public", "models", "crown.glb")


# --------------------------------------------------------------------------
# Scene reset
# --------------------------------------------------------------------------
def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


# --------------------------------------------------------------------------
# Materials (Principled BSDF)
# --------------------------------------------------------------------------
def make_material(name, base_color, metallic, roughness, subsurface=0.0,
                  sss_color=(1, 1, 1), coat=0.0, ior=1.45):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    inputs = bsdf.inputs
    inputs["Base Color"].default_value = (*base_color, 1.0)
    inputs["Metallic"].default_value = metallic
    inputs["Roughness"].default_value = roughness
    if "IOR" in inputs:
        inputs["IOR"].default_value = ior
    # Coat (clearcoat) — name varies slightly across versions
    for key in ("Coat Weight", "Coat"):
        if key in inputs:
            inputs[key].default_value = coat
            break
    # Subsurface for ceramic translucency
    for key in ("Subsurface Weight", "Subsurface"):
        if key in inputs:
            inputs[key].default_value = subsurface
            break
    if subsurface > 0 and "Subsurface Radius" in inputs:
        inputs["Subsurface Radius"].default_value = (0.3, 0.18, 0.12)
    return mat


def build_materials():
    return {
        "crown": make_material("Zirconia_Crown", (0.90, 0.87, 0.80), 0.0, 0.28,
                               subsurface=0.12, coat=0.35, ior=1.55),
        "abutment": make_material("Ti_Abutment", (0.60, 0.61, 0.61), 1.0, 0.38),
        "screw": make_material("Ti_Screw", (0.52, 0.55, 0.57), 1.0, 0.42),
        "implant": make_material("Ti_Implant_SLA", (0.57, 0.58, 0.58), 1.0, 0.52),
        "gum": make_material("Gingiva", (0.78, 0.42, 0.42), 0.0, 0.55, subsurface=0.25,
                             sss_color=(0.85, 0.4, 0.4)),
        "bone": make_material("Cortical_Bone", (0.90, 0.86, 0.76), 0.0, 0.65),
    }


def assign(obj, mat):
    obj.data.materials.clear()
    obj.data.materials.append(mat)


def shade_smooth(obj):
    for p in obj.data.polygons:
        p.use_smooth = True


# --------------------------------------------------------------------------
# Geometry builders
# --------------------------------------------------------------------------
def add_cylinder(name, r1, r2, depth, z, verts=64):
    bpy.ops.mesh.primitive_cone_add(vertices=verts, radius1=r1, radius2=r2,
                                    depth=depth, location=(0, 0, z))
    obj = bpy.context.active_object
    obj.name = name
    shade_smooth(obj)
    return obj


def build_implant_body(mat):
    """Tapered fixture body + rounded apex + helical thread (Screw modifier)."""
    # --- body ---
    body = add_cylinder("Implant", 0.42, 0.30, 1.8, 0.0, verts=64)

    # rounded apex cap (bottom)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.30, location=(0, 0, -0.9))
    apex = bpy.context.active_object
    apex.scale = (1, 1, 0.7)
    shade_smooth(apex)

    # coronal neck collar (polished, top)
    neck = add_cylinder("neck", 0.45, 0.44, 0.18, 0.95, verts=64)

    # --- helical thread via Screw modifier on a V-profile ---
    r = 0.42
    depth = 0.075
    pitch = 0.24
    turns = 7
    prof = bmesh.new()
    v1 = prof.verts.new((r, 0.0, -pitch * 0.42))
    v2 = prof.verts.new((r + depth, 0.0, 0.0))
    v3 = prof.verts.new((r, 0.0, pitch * 0.42))
    prof.edges.new((v1, v2))
    prof.edges.new((v2, v3))
    thread_mesh = bpy.data.meshes.new("Thread")
    prof.to_mesh(thread_mesh)
    prof.free()
    thread = bpy.data.objects.new("Thread", thread_mesh)
    bpy.context.collection.objects.link(thread)
    thread.location = (0, 0, -0.72)
    sc = thread.modifiers.new("Screw", 'SCREW')
    sc.axis = 'Z'
    sc.angle = math.radians(360)
    sc.screw_offset = pitch
    sc.iterations = turns
    sc.steps = 28
    sc.render_steps = 28
    sc.use_smooth_shade = True
    # apply modifier
    bpy.context.view_layer.objects.active = thread
    bpy.ops.object.modifier_apply(modifier="Screw")

    # join body + apex + neck + thread into one Implant object
    for o in (apex, neck, thread):
        o.select_set(True)
    body.select_set(True)
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.join()
    body.name = "Implant"
    assign(body, mat)
    return body


def build_abutment(mat):
    core = add_cylinder("Abutment", 0.30, 0.22, 0.55, 1.55, verts=48)
    collar = add_cylinder("collar", 0.40, 0.30, 0.22, 1.30, verts=48)
    collar.select_set(True)
    core.select_set(True)
    bpy.context.view_layer.objects.active = core
    bpy.ops.object.join()
    core.name = "Abutment"
    assign(core, mat)
    return core


def build_screw(mat):
    head = add_cylinder("Screw", 0.14, 0.14, 0.10, 1.92, verts=24)
    shaft = add_cylinder("shaft", 0.07, 0.07, 0.5, 1.65, verts=20)
    shaft.select_set(True)
    head.select_set(True)
    bpy.context.view_layer.objects.active = head
    bpy.ops.object.join()
    head.name = "Screw"
    assign(head, mat)
    return head


def build_crown(mat):
    """Realistic molar/premolar ceramic crown: full chunky body, narrow cervical,
    wide belly, flatter occlusal table with subtle cusps + central fossa.
    Larger and more anatomical than a rounded blob."""
    # Higher-res base for clean cusp definition
    bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=32, radius=0.62,
                                         location=(0, 0, 2.45))
    crown = bpy.context.active_object
    crown.name = "Crown"
    # Full molar footprint — width ~= depth, slightly taller than wide (not a ball)
    crown.scale = (1.08, 1.0, 1.12)
    bpy.ops.object.transform_apply(scale=True)

    me = crown.data
    zmin = min(v.co.z for v in me.vertices)
    zmax = max(v.co.z for v in me.vertices)
    span = (zmax - zmin) or 1.0
    MID = 0.4  # height of contour (widest point)

    # 1) Anatomical width profile — narrow cervical, wide belly, softly narrower occlusal
    for v in me.vertices:
        t = (v.co.z - zmin) / span
        if t <= MID:
            f = 0.72 + 0.28 * math.sin((t / MID) * (math.pi / 2))  # gum -> belly (rounded base)
        else:
            u = (t - MID) / (1 - MID)
            f = 1.0 - 0.12 * math.sin(u * (math.pi / 2))           # belly -> occlusal
        v.co.x *= f
        v.co.y *= f

    # 2) Flatten the chewing surface into a table, then carve fossa + a mesial groove
    zmax2 = max(v.co.z for v in me.vertices)
    table = zmax2 - 0.16  # occlusal table height
    for v in me.vertices:
        t = (v.co.z - zmin) / span
        if t > 0.74:
            # pull the dome down toward a flatter table
            v.co.z = table + (v.co.z - table) * 0.35
            # central fossa dip
            radial = math.hypot(v.co.x, v.co.y)
            v.co.z -= max(0.0, 0.12 - radial * 0.5)
            # shallow mesio-distal developmental groove along X
            v.co.z -= max(0.0, 0.05 - abs(v.co.y) * 0.9)

    # 3) Subtle cusps at four corners of the table
    cusp_dirs = [Vector((0.6, 0.42, 0)), Vector((-0.6, 0.42, 0)),
                 Vector((0.6, -0.42, 0)), Vector((-0.6, -0.42, 0))]
    for v in me.vertices:
        t = (v.co.z - zmin) / span
        if t > 0.72:
            p = Vector((v.co.x, v.co.y, 0))
            if p.length > 0.05:
                pn = p.normalized()
                for cd in cusp_dirs:
                    d = (pn - cd.normalized()).length
                    if d < 0.42:
                        v.co.z += (0.42 - d) * 0.16  # rounded cusp ridge
    me.update()
    shade_smooth(crown)
    sub = crown.modifiers.new("Subsurf", 'SUBSURF')
    sub.levels = 1
    sub.render_levels = 1
    bpy.context.view_layer.objects.active = crown
    bpy.ops.object.modifier_apply(modifier="Subsurf")
    assign(crown, mat)
    return crown


def build_gum(mat):
    gum = add_cylinder("Gum", 0.72, 0.85, 0.5, 1.15, verts=64)
    assign(gum, mat)
    return gum


def build_bone(mat):
    bpy.ops.mesh.primitive_cube_add(size=2.0, location=(0, 0, -0.2))
    bone = bpy.context.active_object
    bone.name = "Bone"
    bone.scale = (1.3, 1.3, 1.1)
    bpy.ops.object.transform_apply(scale=True)
    assign(bone, mat)
    return bone


# --------------------------------------------------------------------------
# Lighting + camera + world
# --------------------------------------------------------------------------
def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def setup_studio():
    # World: soft neutral studio
    world = bpy.data.worlds.new("Studio")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    bg.inputs[0].default_value = (0.86, 0.88, 0.90, 1.0)
    bg.inputs[1].default_value = 0.5

    def area(name, loc, energy, size, target=(0, 0, 0.5)):
        light = bpy.data.lights.new(name, 'AREA')
        light.energy = energy
        light.size = size
        ob = bpy.data.objects.new(name, light)
        ob.location = loc
        bpy.context.collection.objects.link(ob)
        look_at(ob, target)
        return ob

    area("Key", (4.5, -5.5, 6.0), 700, 5.0)
    area("Fill", (-5.0, -3.0, 2.5), 260, 6.0)
    area("Rim", (0.0, 5.5, 5.0), 420, 4.0)

    # Camera — pulled back to frame the full apex→crown stack
    cam_data = bpy.data.cameras.new("Cam")
    cam_data.lens = 70
    cam = bpy.data.objects.new("Cam", cam_data)
    cam.location = (7.6, -9.4, 3.4)
    bpy.context.collection.objects.link(cam)
    look_at(cam, (0, 0, 1.2))
    bpy.context.scene.camera = cam


def setup_render():
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    try:
        scene.cycles.samples = 96
        scene.cycles.use_denoising = True
    except Exception:
        pass
    scene.render.resolution_x = 900
    scene.render.resolution_y = 900
    scene.render.film_transparent = False
    scene.view_settings.view_transform = 'AgX' if 'AgX' in [v.name for v in bpy.data.scenes[0].view_settings.bl_rna.properties['view_transform'].enum_items] else 'Standard'
    scene.render.filepath = PREVIEW_PNG


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def main():
    reset_scene()
    mats = build_materials()

    bone = build_bone(mats["bone"])
    gum = build_gum(mats["gum"])
    implant = build_implant_body(mats["implant"])
    abutment = build_abutment(mats["abutment"])
    screw = build_screw(mats["screw"])
    crown = build_crown(mats["crown"])

    setup_studio()
    setup_render()

    # 1) Export GLB in the ASSEMBLED state (all parts, apply modifiers, +Y up)
    os.makedirs(os.path.dirname(GLB_OUT), exist_ok=True)
    bpy.ops.object.select_all(action='DESELECT')
    for o in bpy.data.objects:
        if o.type == 'MESH':
            o.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=GLB_OUT,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )
    print("GLB_WRITTEN:", GLB_OUT)

    # 1b) Showcase GLB — implant assembly only (no bone/gum) for the 360° inspector
    bpy.ops.object.select_all(action='DESELECT')
    for o in (crown, abutment, screw, implant):
        o.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=GLB_SHOWCASE,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )
    print("SHOWCASE_WRITTEN:", GLB_SHOWCASE)

    # 1c) Crown-only GLB, re-centered to its own origin, for the hero story crown slot
    crown.location = (0, 0, 0)
    # move crown mesh so its bounding-box center sits at object origin
    bpy.context.view_layer.objects.active = crown
    bpy.ops.object.select_all(action='DESELECT')
    crown.select_set(True)
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    crown.location = (0, 0, 0)
    bpy.ops.export_scene.gltf(
        filepath=GLB_CROWN,
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_yup=True,
    )
    print("CROWN_WRITTEN:", GLB_CROWN)

    # 2) CROWN FRONT VALIDATION RENDER — crown only, straight-on front view.
    #    (crown was re-centred to origin in step 1c above)
    for o in (bone, gum, implant, abutment, screw):
        o.hide_render = True

    cam = bpy.context.scene.camera
    cam.data.lens = 55
    cam.location = (0.0, -4.6, 0.15)
    look_at(cam, (0, 0, 0.05))

    bpy.ops.render.render(write_still=True)
    print("PREVIEW_WRITTEN:", PREVIEW_PNG)


main()
