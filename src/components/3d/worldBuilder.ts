/**
 * Procedural Construction Site Environment for Three.js
 * Creates:
 * - Sandy ground with construction dirt path & asphalt road
 * - Rolling green hillocks in the horizon
 * - Big stone pile (for Misi 1 Antar Batu & Misi 5 Bongkar Muatan)
 * - Golden sand pit (for Misi 3 Ekskavator Menggali & Truk Merah)
 * - Striped traffic cones and rounded cartoon pine trees
 */

import * as THREE from 'three';

export interface WorldEnvironment {
  group: THREE.Group;
  dispose: () => void;
}

export function buildConstructionWorld(): WorldEnvironment {
  const world = new THREE.Group();
  world.name = 'ConstructionWorld';

  const materials: THREE.Material[] = [];

  // Ground Materials
  const dirtMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24, // Warm golden construction dirt
    roughness: 0.9,
    metalness: 0.05,
  });
  materials.push(dirtMat);

  const roadMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // Slate asphalt road
    roughness: 0.8,
    metalness: 0.1,
  });
  materials.push(roadMat);

  const hillMat = new THREE.MeshStandardMaterial({
    color: 0x86efac, // Soft pastel green grass
    roughness: 0.85,
    metalness: 0.0,
  });
  materials.push(hillMat);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x78716c,
    roughness: 0.85,
  });
  materials.push(stoneMat);

  const coneOrangeMat = new THREE.MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.4,
  });
  const coneWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.4,
  });
  materials.push(coneOrangeMat, coneWhiteMat);

  const treeTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x78350f,
    roughness: 0.9,
  });
  const treeFoliageMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    roughness: 0.6,
  });
  materials.push(treeTrunkMat, treeFoliageMat);

  // 1. Main Ground Plane
  const groundGeo = new THREE.PlaneGeometry(60, 60);
  groundGeo.rotateX(-Math.PI / 2);
  const ground = new THREE.Mesh(groundGeo, dirtMat);
  ground.receiveShadow = true;
  world.add(ground);

  // 2. Asphalt Roadway
  const roadGeo = new THREE.PlaneGeometry(60, 4.5);
  roadGeo.rotateX(-Math.PI / 2);
  const road = new THREE.Mesh(roadGeo, roadMat);
  road.position.set(0, 0.02, 0); // Slightly above ground to prevent Z-fighting
  road.receiveShadow = true;
  world.add(road);

  // Dashed Center Road Markings
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
  materials.push(dashMat);
  for (let x = -26; x <= 26; x += 4) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.2), dashMat);
    dash.rotateX(-Math.PI / 2);
    dash.position.set(x, 0.03, 0);
    world.add(dash);
  }

  // 3. Horizon Hills
  const hillPositions = [
    [-18, 0, -18, 12, 5],
    [0, 0, -22, 16, 7],
    [20, 0, -16, 14, 6],
    [-24, 0, 18, 14, 5],
    [16, 0, 20, 15, 6],
  ];
  hillPositions.forEach(([hx, hy, hz, r, h]) => {
    const hillGeo = new THREE.SphereGeometry(r, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const hill = new THREE.Mesh(hillGeo, hillMat);
    hill.position.set(hx, hy - 0.5, hz);
    hill.scale.set(1, h / r, 1);
    hill.receiveShadow = true;
    world.add(hill);
  });

  // 4. Big Stone Pile (Target for Dump Truck)
  const stoneCluster = new THREE.Group();
  stoneCluster.position.set(-6, 0, -4.5);
  const stoneCoords = [
    [0, 0.4, 0, 0.7],
    [0.7, 0.3, 0.3, 0.55],
    [-0.6, 0.35, -0.4, 0.6],
    [0.2, 0.7, -0.2, 0.5],
    [0.8, 0.25, -0.6, 0.45],
    [-0.8, 0.3, 0.4, 0.5],
  ];
  stoneCoords.forEach(([sx, sy, sz, scale]) => {
    const geo = new THREE.DodecahedronGeometry(scale);
    const stone = new THREE.Mesh(geo, stoneMat);
    stone.position.set(sx, sy, sz);
    stone.castShadow = true;
    stone.receiveShadow = true;
    stoneCluster.add(stone);
  });
  world.add(stoneCluster);

  // 5. Sand Pit (Target for Excavator)
  const sandPit = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 2.8, 0.3, 16),
    new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.95 })
  );
  sandPit.position.set(6, 0.15, -4.5);
  sandPit.receiveShadow = true;
  world.add(sandPit);

  // 6. Traffic Cones
  const coneLocations = [
    [-4, 3.2],
    [0, 3.2],
    [4, 3.2],
    [-3, -3.2],
    [3, -3.2],
  ];
  coneLocations.forEach(([cx, cz]) => {
    const coneGroup = new THREE.Group();
    coneGroup.position.set(cx, 0, cz);

    const baseGeo = new THREE.BoxGeometry(0.55, 0.08, 0.55);
    const base = new THREE.Mesh(baseGeo, coneOrangeMat);
    base.position.y = 0.04;
    coneGroup.add(base);

    const bodyGeo = new THREE.ConeGeometry(0.24, 0.65, 12);
    const body = new THREE.Mesh(bodyGeo, coneOrangeMat);
    body.position.y = 0.35;
    coneGroup.add(body);

    const stripeGeo = new THREE.CylinderGeometry(0.16, 0.2, 0.15, 12);
    const stripe = new THREE.Mesh(stripeGeo, coneWhiteMat);
    stripe.position.y = 0.32;
    coneGroup.add(stripe);

    world.add(coneGroup);
  });

  // 7. Cartoon Pine Trees along the edges
  const treeLocations = [
    [-12, -8],
    [-15, -5],
    [12, -9],
    [15, -6],
    [-10, 8],
    [11, 7],
  ];
  treeLocations.forEach(([tx, tz]) => {
    const treeGroup = new THREE.Group();
    treeGroup.position.set(tx, 0, tz);

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.25, 0.8, 8),
      treeTrunkMat
    );
    trunk.position.y = 0.4;
    treeGroup.add(trunk);

    const foliage1 = new THREE.Mesh(
      new THREE.ConeGeometry(1.2, 1.4, 8),
      treeFoliageMat
    );
    foliage1.position.y = 1.3;
    foliage1.castShadow = true;
    treeGroup.add(foliage1);

    const foliage2 = new THREE.Mesh(
      new THREE.ConeGeometry(0.9, 1.2, 8),
      treeFoliageMat
    );
    foliage2.position.y = 2.0;
    foliage2.castShadow = true;
    treeGroup.add(foliage2);

    world.add(treeGroup);
  });

  return {
    group: world,
    dispose: () => {
      world.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
      materials.forEach((m) => m.dispose());
    },
  };
}
