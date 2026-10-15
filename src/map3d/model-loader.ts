import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const gltfLoader = new GLTFLoader();
const modelCache = new Map<string, Promise<THREE.Group>>();

const BASE_MODELS_URL = `${import.meta.env.BASE_URL}models`;

/**
 * Registry of locations that have Blender-sculpted `.glb` models in `public/models/<id>.glb`.
 */
export const BLENDER_GLB_LANDMARKS: Record<
  string,
  { url: string; scale?: number; rotationY?: number; yOffset?: number }
> = {
  'scarlet-devil-mansion': { url: `${BASE_MODELS_URL}/scarlet-devil-mansion.glb`, scale: 1.45 },
  'human-village': { url: `${BASE_MODELS_URL}/human-village.glb`, scale: 1.55 },
  'hakurei-shrine': { url: `${BASE_MODELS_URL}/hakurei-shrine.glb`, scale: 2.2 },
  'myouren-temple': { url: `${BASE_MODELS_URL}/myouren-temple.glb`, scale: 2.1 },
  'hall-of-dreams': { url: `${BASE_MODELS_URL}/hall-of-dreams.glb`, scale: 2.0 },
  'suzunaan': { url: `${BASE_MODELS_URL}/suzunaan.glb`, scale: 1.5 },
  'geidontei': { url: `${BASE_MODELS_URL}/geidontei.glb`, scale: 1.5 },
  'terakoya-school': { url: `${BASE_MODELS_URL}/terakoya-school.glb`, scale: 1.55 },
  'hieda-estate': { url: `${BASE_MODELS_URL}/hieda-estate.glb`, scale: 1.55 },
  'kourindou': { url: `${BASE_MODELS_URL}/kourindou.glb`, scale: 1.85 },
  'marisas-house': { url: `${BASE_MODELS_URL}/marisas-house.glb`, scale: 1.55 },
  'alices-house': { url: `${BASE_MODELS_URL}/alices-house.glb`, scale: 1.55 },
  'moriya-branch-shrine': { url: `${BASE_MODELS_URL}/radio-tower.glb`, scale: 1.45 },
  'eientei': { url: `${BASE_MODELS_URL}/eientei.glb`, scale: 1.55 },
  'mugenkan': { url: `${BASE_MODELS_URL}/mugenkan.glb`, scale: 2.1 },
  'moriya-shrine': { url: `${BASE_MODELS_URL}/moriya-shrine.glb`, scale: 1.55 },
  'tengu-village': { url: `${BASE_MODELS_URL}/tengu-village.glb`, scale: 1.55 },
  'muenzuka': { url: `${BASE_MODELS_URL}/muenzuka.glb`, scale: 1.55 },
  'heaven': { url: `${BASE_MODELS_URL}/heaven.glb`, scale: 1.55, yOffset: 88 },
  'asama-purifying-mountain': { url: `${BASE_MODELS_URL}/asama-purifying-mountain.glb`, scale: 2.0 },
  'shining-needle-castle': { url: `${BASE_MODELS_URL}/shining-needle-castle.glb`, scale: 2.3 },
  'hakugyokurou': { url: `${BASE_MODELS_URL}/hakugyokurou.glb`, scale: 2.3 },
  'palace-of-earth-spirits': { url: `${BASE_MODELS_URL}/palace-of-earth-spirits.glb`, scale: 2.3 },
  'nuclear-furnace': { url: `${BASE_MODELS_URL}/nuclear-furnace.glb`, scale: 2.1 },
  'pandaemonium': { url: `${BASE_MODELS_URL}/pandaemonium.glb`, scale: 2.3 },
  'lunar-capital': { url: `${BASE_MODELS_URL}/lunar-capital.glb`, scale: 2.3 },
};

export const sharedOpaqueVertexMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.78,
  metalness: 0.06,
});

export const sharedEmissiveVertexMat = new THREE.MeshStandardMaterial({
  vertexColors: true,
  roughness: 0.35,
  metalness: 0.08,
  emissive: new THREE.Color(0xff9d3b),
  emissiveIntensity: 0.55,
});

function applySharedVertexMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh.geometry?.attributes?.color) {
        const isEmissive = mesh.name.includes('Emissive');
        mesh.material = isEmissive ? sharedEmissiveVertexMat : sharedOpaqueVertexMat;
      }
    }
  });
}

export function tagHierarchyWithLocationId(root: THREE.Object3D, locationId: string) {
  root.userData.locationId = locationId;
  applySharedVertexMaterials(root);
}

export async function loadBlenderLandmarkGLB(
  locationId: string,
  targetContainer: THREE.Group,
  worldPos?: THREE.Vector3,
  onLoaded?: () => void
): Promise<THREE.Group | null> {
  const entry = BLENDER_GLB_LANDMARKS[locationId];
  if (!entry) return null;

  try {
    let promise = modelCache.get(entry.url);
    if (!promise) {
      promise = new Promise<THREE.Group>((resolve, reject) => {
        gltfLoader.load(
          entry.url,
          (gltf) => resolve(gltf.scene),
          undefined,
          (err) => reject(err)
        );
      });
      modelCache.set(entry.url, promise);
    }

    const template = await promise;
    const instance = template.clone(true);
    if (worldPos) {
      instance.position.copy(worldPos);
    }
    if (entry.scale && entry.scale !== 1) {
      instance.scale.setScalar(entry.scale);
    }
    if (entry.rotationY) {
      instance.rotation.y = entry.rotationY;
    }
    if (entry.yOffset) {
      instance.position.y += entry.yOffset;
    }

    tagHierarchyWithLocationId(instance, locationId);
    targetContainer.add(instance);
    onLoaded?.();
    return instance;
  } catch {
    return null;
  }
}

/**
 * Loads the Blender-sculpted Gensokyo World Diorama Dressings (`gensokyo-diorama-dressings.glb`),
 * merged into 2 vertex-colored meshes (`WorldDiorama_Opaque` and `WorldDiorama_Emissive`).
 */
export async function loadWorldDioramaGLB(
  targetContainer: THREE.Object3D,
  onLoaded?: () => void
): Promise<THREE.Group | null> {
  const url = `${BASE_MODELS_URL}/gensokyo-diorama-dressings.glb`;
  try {
    let promise = modelCache.get(url);
    if (!promise) {
      promise = new Promise<THREE.Group>((resolve, reject) => {
        gltfLoader.load(
          url,
          (gltf) => resolve(gltf.scene),
          undefined,
          (err) => reject(err)
        );
      });
      modelCache.set(url, promise);
    }

    const template = await promise;
    const instance = template.clone(true);
    applySharedVertexMaterials(instance);
    targetContainer.add(instance);
    onLoaded?.();
    return instance;
  } catch {
    return null;
  }
}


/**
 * Loads the Blender-sculpted 3D Foliage Kit (`gensokyo-foliage-kit.glb`) containing
 * vertex-colored multi-branch trees (`PineTree`, `SakuraTree`, `AutumnTree`, `BambooCluster`, `MushroomCluster`).
 */
export async function loadBlenderFoliageKit(): Promise<Record<string, THREE.BufferGeometry> | null> {
  const url = `${BASE_MODELS_URL}/gensokyo-foliage-kit.glb`;
  try {
    let promise = modelCache.get(url);
    if (!promise) {
      promise = new Promise<THREE.Group>((resolve, reject) => {
        gltfLoader.load(
          url,
          (gltf) => resolve(gltf.scene),
          undefined,
          (err) => reject(err)
        );
      });
      modelCache.set(url, promise);
    }

    const scene = await promise;
    scene.updateMatrixWorld(true);
    const out: Record<string, THREE.BufferGeometry> = {};
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry.clone();
        geom.applyMatrix4(mesh.matrixWorld);
        geom.computeVertexNormals();
        out[mesh.name] = geom;
      }
    });
    return out;
  } catch {
    return null;
  }
}

/**
 * Loads the Blender-sculpted 3D Low-Poly Character Kit (`gensokyo-characters.glb`) containing
 * 58 Touhou residents (`<id>_Opaque` and `<id>_Emissive`), preserving local origin `(0,0,0)`.
 */
export async function loadBlenderCharactersKit(): Promise<Record<string, THREE.BufferGeometry> | null> {
  const url = `${BASE_MODELS_URL}/gensokyo-characters.glb`;
  try {
    let promise = modelCache.get(url);
    if (!promise) {
      promise = new Promise<THREE.Group>((resolve, reject) => {
        gltfLoader.load(
          url,
          (gltf) => resolve(gltf.scene),
          undefined,
          (err) => reject(err)
        );
      });
      modelCache.set(url, promise);
    }

    const scene = await promise;
    const out: Record<string, THREE.BufferGeometry> = {};
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const geom = mesh.geometry.clone();
        const savedPos = mesh.position.clone();
        mesh.position.set(0, 0, 0);
        mesh.updateMatrix();
        geom.applyMatrix4(mesh.matrix);
        mesh.position.copy(savedPos);
        mesh.updateMatrix();
        geom.computeVertexNormals();
        out[mesh.name] = geom;
      }
    });
    return out;
  } catch {
    return null;
  }
}



