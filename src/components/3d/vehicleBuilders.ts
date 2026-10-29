/**
 * Procedural 3D Construction Vehicles built with Three.js
 * Assembles composite 3-12 part THREE.Groups with articulated moving parts:
 * - Truk Kuning: Tilting dump bed with rocks, 6 spinning wheels, friendly eyes on windshield
 * - Truk Merah: Sand bed, 6 spinning wheels, red cab
 * - Ekskavator: Caterpillar tracks, rotating body, 2-part articulated digging arm + bucket
 * - Truk Molen: Rotating cement mixer drum with spiral stripes, dispenser chute
 */

import * as THREE from 'three';
import { VehicleId } from '../../types';

export interface VehicleController {
  group: THREE.Group;
  type: VehicleId;
  wheels: THREE.Mesh[];
  dumpBed?: THREE.Group;
  excavatorArm?: {
    boom: THREE.Group;
    dipper: THREE.Group;
    bucket: THREE.Mesh;
  };
  mixerDrum?: THREE.Mesh;
  updateAnimation: (delta: number, actionState: string, speedFactor: number) => void;
  dispose: () => void;
}

// Common PBR Materials (Reused across parts)
function createMaterials() {
  return {
    yellowPaint: new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.15,
    }),
    yellowDark: new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      roughness: 0.45,
      metalness: 0.1,
    }),
    redPaint: new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.35,
      metalness: 0.15,
    }),
    orangePaint: new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.35,
      metalness: 0.15,
    }),
    cyanPaint: new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.35,
      metalness: 0.15,
    }),
    drumGreen: new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.4,
      metalness: 0.2,
    }),
    drumStripe: new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.4,
      metalness: 0.1,
    }),
    chassisMetal: new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.7,
      metalness: 0.5,
    }),
    rubberTire: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.05,
    }),
    wheelRim: new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.8,
    }),
    windowGlass: new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.85,
    }),
    eyeBlack: new THREE.MeshBasicMaterial({ color: 0x0f172a }),
    eyeWhite: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    headlightGlow: new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    }),
    stoneGray: new THREE.MeshStandardMaterial({
      color: 0x78716c,
      roughness: 0.85,
      metalness: 0.05,
    }),
    sandGold: new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.95,
      metalness: 0.0,
    }),
  };
}

// 1. Truk Kuning (Dump Truck with rocks & tilting bed)
export function createYellowTruck(): VehicleController {
  const mats = createMaterials();
  const root = new THREE.Group();
  root.name = 'TrukKuning';

  const wheels: THREE.Mesh[] = [];

  // Chassis
  const chassisGeo = new THREE.BoxGeometry(4.2, 0.45, 1.8);
  const chassis = new THREE.Mesh(chassisGeo, mats.chassisMetal);
  chassis.position.y = 0.8;
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  root.add(chassis);

  // Cab Group
  const cabGroup = new THREE.Group();
  cabGroup.position.set(1.1, 1.5, 0);

  const cabBodyGeo = new THREE.BoxGeometry(1.6, 1.3, 1.7);
  const cabBody = new THREE.Mesh(cabBodyGeo, mats.yellowPaint);
  cabBody.castShadow = true;
  cabGroup.add(cabBody);

  // Windshield
  const windshieldGeo = new THREE.BoxGeometry(0.7, 0.7, 1.5);
  const windshield = new THREE.Mesh(windshieldGeo, mats.windowGlass);
  windshield.position.set(0.48, 0.2, 0);
  cabGroup.add(windshield);

  // Friendly Toddler Eyes on Windshield
  [-0.4, 0.4].forEach((zOffset) => {
    const eyeWhiteGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16);
    eyeWhiteGeo.rotateZ(Math.PI / 2);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, mats.eyeWhite);
    eyeWhite.position.set(0.84, 0.2, zOffset);

    const pupilGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
    pupilGeo.rotateZ(Math.PI / 2);
    const pupil = new THREE.Mesh(pupilGeo, mats.eyeBlack);
    pupil.position.set(0.85, 0.2, zOffset);

    cabGroup.add(eyeWhite);
    cabGroup.add(pupil);
  });

  // Headlights
  [-0.6, 0.6].forEach((zOffset) => {
    const lightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16);
    lightGeo.rotateZ(Math.PI / 2);
    const light = new THREE.Mesh(lightGeo, mats.headlightGlow);
    light.position.set(0.82, -0.25, zOffset);
    cabGroup.add(light);
  });

  // Bumper
  const bumperGeo = new THREE.BoxGeometry(0.3, 0.35, 1.9);
  const bumper = new THREE.Mesh(bumperGeo, mats.chassisMetal);
  bumper.position.set(0.9, -0.4, 0);
  cabGroup.add(bumper);

  // Exhaust pipe
  const exhaustGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.1, 12);
  const exhaust = new THREE.Mesh(exhaustGeo, mats.chassisMetal);
  exhaust.position.set(-0.7, 0.8, -0.75);
  cabGroup.add(exhaust);

  root.add(cabGroup);

  // Tilting Dump Bed Group (Hinged at rear axle x = -1.9, y = 1.05)
  const dumpBedGroup = new THREE.Group();
  dumpBedGroup.position.set(-1.9, 1.05, 0);

  const bedFloorGeo = new THREE.BoxGeometry(2.5, 0.18, 1.8);
  const bedFloor = new THREE.Mesh(bedFloorGeo, mats.yellowDark);
  bedFloor.position.set(1.25, 0.1, 0);
  bedFloor.castShadow = true;
  dumpBedGroup.add(bedFloor);

  // Side Walls of Bed
  const sideWallGeo = new THREE.BoxGeometry(2.5, 0.8, 0.12);
  [-0.85, 0.85].forEach((zPos) => {
    const wall = new THREE.Mesh(sideWallGeo, mats.yellowPaint);
    wall.position.set(1.25, 0.55, zPos);
    wall.castShadow = true;
    dumpBedGroup.add(wall);
  });

  // Front Wall of Bed
  const frontWallGeo = new THREE.BoxGeometry(0.12, 0.8, 1.8);
  const frontWall = new THREE.Mesh(frontWallGeo, mats.yellowPaint);
  frontWall.position.set(2.45, 0.55, 0);
  frontWall.castShadow = true;
  dumpBedGroup.add(frontWall);

  // Rocks inside Bed
  const rocksGroup = new THREE.Group();
  const rockPositions = [
    [0.6, 0.35, -0.4],
    [1.0, 0.4, 0.3],
    [1.4, 0.35, -0.2],
    [1.8, 0.4, 0.2],
    [0.4, 0.3, 0.1],
  ];
  rockPositions.forEach(([rx, ry, rz], idx) => {
    const rockGeo = new THREE.DodecahedronGeometry(0.24 + (idx % 2) * 0.08);
    const rock = new THREE.Mesh(rockGeo, mats.stoneGray);
    rock.position.set(rx, ry, rz);
    rock.castShadow = true;
    rocksGroup.add(rock);
  });
  dumpBedGroup.add(rocksGroup);

  root.add(dumpBedGroup);

  // 6 Wheels (3 on each side)
  const wheelXCoords = [1.2, -0.6, -1.6];
  const wheelZCoords = [-1.05, 1.05];

  wheelXCoords.forEach((wx) => {
    wheelZCoords.forEach((wz) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.5, wz);

      const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 20);
      tireGeo.rotateX(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, mats.rubberTire);
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.34, 16);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, mats.wheelRim);
      wheelGroup.add(rim);

      root.add(wheelGroup);
      wheels.push(tire);
    });
  });

  let bedTiltAngle = 0;

  return {
    group: root,
    type: 'truk-kuning',
    wheels,
    dumpBed: dumpBedGroup,
    updateAnimation: (delta, actionState, speedFactor) => {
      // Wheel rotation
      if (speedFactor > 0) {
        wheels.forEach((w) => {
          w.rotation.z -= delta * 6 * speedFactor;
        });
      }

      // Tilting action: rotates UPWARDS in front around Z
      const targetTilt =
        actionState === 'dumping' || actionState === 'celebrate' || actionState === 'bed-open'
          ? 0.72
          : 0;
      bedTiltAngle = THREE.MathUtils.damp(bedTiltAngle, targetTilt, 5, delta);
      dumpBedGroup.rotation.z = bedTiltAngle;
    },
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
      Object.values(mats).forEach((m) => m.dispose());
    },
  };
}

// 2. Truk Merah (Red Dump Truck with sand load)
export function createRedTruck(): VehicleController {
  const mats = createMaterials();
  const root = new THREE.Group();
  root.name = 'TrukMerah';

  const wheels: THREE.Mesh[] = [];

  // Chassis
  const chassisGeo = new THREE.BoxGeometry(4.2, 0.45, 1.8);
  const chassis = new THREE.Mesh(chassisGeo, mats.chassisMetal);
  chassis.position.y = 0.8;
  chassis.castShadow = true;
  root.add(chassis);

  // Red Cab
  const cabGroup = new THREE.Group();
  cabGroup.position.set(1.1, 1.5, 0);

  const cabBodyGeo = new THREE.BoxGeometry(1.6, 1.3, 1.7);
  const cabBody = new THREE.Mesh(cabBodyGeo, mats.redPaint);
  cabBody.castShadow = true;
  cabGroup.add(cabBody);

  // Windshield
  const windshieldGeo = new THREE.BoxGeometry(0.7, 0.7, 1.5);
  const windshield = new THREE.Mesh(windshieldGeo, mats.windowGlass);
  windshield.position.set(0.48, 0.2, 0);
  cabGroup.add(windshield);

  // Eyes
  [-0.4, 0.4].forEach((zOffset) => {
    const eyeWhiteGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16);
    eyeWhiteGeo.rotateZ(Math.PI / 2);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, mats.eyeWhite);
    eyeWhite.position.set(0.84, 0.2, zOffset);

    const pupilGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
    pupilGeo.rotateZ(Math.PI / 2);
    const pupil = new THREE.Mesh(pupilGeo, mats.eyeBlack);
    pupil.position.set(0.85, 0.2, zOffset);

    cabGroup.add(eyeWhite);
    cabGroup.add(pupil);
  });

  // Headlights
  [-0.6, 0.6].forEach((zOffset) => {
    const lightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16);
    lightGeo.rotateZ(Math.PI / 2);
    const light = new THREE.Mesh(lightGeo, mats.headlightGlow);
    light.position.set(0.82, -0.25, zOffset);
    cabGroup.add(light);
  });

  root.add(cabGroup);

  // Sand Bed (Hinged at rear axle x = -1.9, y = 1.05)
  const sandBedGroup = new THREE.Group();
  sandBedGroup.position.set(-1.9, 1.05, 0);

  const bedFloor = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 1.8), mats.redPaint);
  bedFloor.position.set(1.25, 0.1, 0);
  sandBedGroup.add(bedFloor);

  [-0.85, 0.85].forEach((zPos) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.12), mats.redPaint);
    wall.position.set(1.25, 0.55, zPos);
    sandBedGroup.add(wall);
  });

  const frontWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.8, 1.8), mats.redPaint);
  frontWall.position.set(2.45, 0.55, 0);
  sandBedGroup.add(frontWall);

  // Golden Sand Mound inside Bed
  const sandGeo = new THREE.ConeGeometry(0.9, 0.6, 16);
  const sandMound = new THREE.Mesh(sandGeo, mats.sandGold);
  sandMound.position.set(1.15, 0.55, 0);
  sandMound.scale.set(1.4, 1.0, 1.2);
  sandBedGroup.add(sandMound);

  root.add(sandBedGroup);

  // Wheels
  [1.2, -0.6, -1.6].forEach((wx) => {
    [-1.05, 1.05].forEach((wz) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.5, wz);

      const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 20);
      tireGeo.rotateX(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, mats.rubberTire);
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.34, 16);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, mats.wheelRim);
      wheelGroup.add(rim);

      root.add(wheelGroup);
      wheels.push(tire);
    });
  });

  let bedTiltAngle = 0;

  return {
    group: root,
    type: 'truk-merah',
    wheels,
    dumpBed: sandBedGroup,
    updateAnimation: (delta, actionState, speedFactor) => {
      if (speedFactor > 0) {
        wheels.forEach((w) => {
          w.rotation.z -= delta * 6 * speedFactor;
        });
      }
      const targetTilt =
        actionState === 'dumping' || actionState === 'celebrate' || actionState === 'bed-open'
          ? 0.72
          : 0;
      bedTiltAngle = THREE.MathUtils.damp(bedTiltAngle, targetTilt, 5, delta);
      sandBedGroup.rotation.z = bedTiltAngle;
    },
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      Object.values(mats).forEach((m) => m.dispose());
    },
  };
}

// 3. Orange Excavator (with caterpillar tracks and articulated digging arm)
export function createOrangeExcavator(): VehicleController {
  const mats = createMaterials();
  const root = new THREE.Group();
  root.name = 'Ekskavator';

  // Crawler Tracks Base
  const trackBase = new THREE.Group();
  trackBase.position.y = 0.45;

  [-0.9, 0.9].forEach((zPos) => {
    const trackGeo = new THREE.BoxGeometry(3.6, 0.65, 0.48);
    const track = new THREE.Mesh(trackGeo, mats.rubberTire);
    track.position.set(0, 0, zPos);
    track.castShadow = true;
    trackBase.add(track);

    // Rollers inside tracks
    [-1.2, -0.4, 0.4, 1.2].forEach((rx) => {
      const rollerGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 12);
      rollerGeo.rotateX(Math.PI / 2);
      const roller = new THREE.Mesh(rollerGeo, mats.wheelRim);
      roller.position.set(rx, 0, zPos);
      trackBase.add(roller);
    });
  });

  // Cross beam
  const crossGeo = new THREE.BoxGeometry(1.8, 0.3, 1.5);
  const cross = new THREE.Mesh(crossGeo, mats.chassisMetal);
  cross.position.y = 0.15;
  trackBase.add(cross);

  root.add(trackBase);

  // Rotating Cab Group (Turntable)
  const rotatingCab = new THREE.Group();
  rotatingCab.position.y = 0.8;

  const cabBodyGeo = new THREE.BoxGeometry(2.4, 1.4, 1.8);
  const cabBody = new THREE.Mesh(cabBodyGeo, mats.orangePaint);
  cabBody.position.set(-0.2, 0.7, 0);
  cabBody.castShadow = true;
  rotatingCab.add(cabBody);

  // Cabin Window
  const windowGeo = new THREE.BoxGeometry(1.1, 0.9, 0.85);
  const cabinWindow = new THREE.Mesh(windowGeo, mats.windowGlass);
  cabinWindow.position.set(0.4, 0.85, 0.45);
  rotatingCab.add(cabinWindow);

  // Eyes on Cabin Window
  const eyeWhiteGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.05, 16);
  eyeWhiteGeo.rotateZ(Math.PI / 2);
  const eyeWhite = new THREE.Mesh(eyeWhiteGeo, mats.eyeWhite);
  eyeWhite.position.set(0.96, 0.85, 0.45);
  rotatingCab.add(eyeWhite);

  const pupilGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
  pupilGeo.rotateZ(Math.PI / 2);
  const pupil = new THREE.Mesh(pupilGeo, mats.eyeBlack);
  pupil.position.set(0.97, 0.85, 0.45);
  rotatingCab.add(pupil);

  // Counterweight
  const weightGeo = new THREE.BoxGeometry(0.6, 1.2, 1.7);
  const weight = new THREE.Mesh(weightGeo, mats.chassisMetal);
  weight.position.set(-1.2, 0.7, 0);
  rotatingCab.add(weight);

  // --- Articulated Digging Arm Hierarchy ---
  // 1. Boom Arm (Pivot on front of cab)
  const boomGroup = new THREE.Group();
  boomGroup.position.set(0.8, 0.6, -0.3);

  const boomMeshGeo = new THREE.BoxGeometry(2.2, 0.35, 0.28);
  const boomMesh = new THREE.Mesh(boomMeshGeo, mats.orangePaint);
  boomMesh.position.set(0.9, 0.4, 0);
  boomMesh.rotation.z = Math.PI / 5; // Tilted upward
  boomMesh.castShadow = true;
  boomGroup.add(boomMesh);

  // 2. Dipper Arm (Elbow pivot)
  const dipperGroup = new THREE.Group();
  dipperGroup.position.set(1.8, 1.2, 0);

  const dipperMeshGeo = new THREE.BoxGeometry(1.8, 0.28, 0.25);
  const dipperMesh = new THREE.Mesh(dipperMeshGeo, mats.orangePaint);
  dipperMesh.position.set(0.7, -0.4, 0);
  dipperMesh.rotation.z = -Math.PI / 4;
  dipperMesh.castShadow = true;
  dipperGroup.add(dipperMesh);

  // 3. Bucket Scoop
  const bucketGeo = new THREE.BoxGeometry(0.6, 0.5, 0.6);
  const bucket = new THREE.Mesh(bucketGeo, mats.chassisMetal);
  bucket.position.set(1.4, -1.0, 0);
  bucket.castShadow = true;
  dipperGroup.add(bucket);

  boomGroup.add(dipperGroup);
  rotatingCab.add(boomGroup);
  root.add(rotatingCab);

  let digAnimTime = 0;

  return {
    group: root,
    type: 'ekskavator',
    wheels: [],
    excavatorArm: {
      boom: boomGroup,
      dipper: dipperGroup,
      bucket,
    },
    updateAnimation: (delta, actionState) => {
      const isDigging = actionState === 'digging' || actionState === 'celebrate';
      if (isDigging) {
        digAnimTime += delta * 2.5;
        // Scoop motion
        boomGroup.rotation.z = Math.sin(digAnimTime) * 0.25 - 0.1;
        dipperGroup.rotation.z = Math.cos(digAnimTime) * 0.35 - 0.2;
      } else {
        boomGroup.rotation.z = THREE.MathUtils.damp(boomGroup.rotation.z, 0, 4, delta);
        dipperGroup.rotation.z = THREE.MathUtils.damp(dipperGroup.rotation.z, 0, 4, delta);
      }
    },
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      Object.values(mats).forEach((m) => m.dispose());
    },
  };
}

// 4. Truk Molen (Cement Mixer with rotating spiral drum)
export function createCementMixer(): VehicleController {
  const mats = createMaterials();
  const root = new THREE.Group();
  root.name = 'TrukMolen';

  const wheels: THREE.Mesh[] = [];

  // Chassis
  const chassisGeo = new THREE.BoxGeometry(4.2, 0.45, 1.8);
  const chassis = new THREE.Mesh(chassisGeo, mats.chassisMetal);
  chassis.position.y = 0.8;
  chassis.castShadow = true;
  root.add(chassis);

  // Cyan Cab
  const cabGroup = new THREE.Group();
  cabGroup.position.set(1.1, 1.5, 0);

  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 1.7), mats.cyanPaint);
  cabBody.castShadow = true;
  cabGroup.add(cabBody);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 1.5), mats.windowGlass);
  windshield.position.set(0.48, 0.2, 0);
  cabGroup.add(windshield);

  // Eyes
  [-0.4, 0.4].forEach((zOffset) => {
    const eyeWhiteGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.05, 16);
    eyeWhiteGeo.rotateZ(Math.PI / 2);
    const eyeWhite = new THREE.Mesh(eyeWhiteGeo, mats.eyeWhite);
    eyeWhite.position.set(0.84, 0.2, zOffset);

    const pupilGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 16);
    pupilGeo.rotateZ(Math.PI / 2);
    const pupil = new THREE.Mesh(pupilGeo, mats.eyeBlack);
    pupil.position.set(0.85, 0.2, zOffset);

    cabGroup.add(eyeWhite);
    cabGroup.add(pupil);
  });

  // Headlights
  [-0.6, 0.6].forEach((zOffset) => {
    const lightGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16);
    lightGeo.rotateZ(Math.PI / 2);
    const light = new THREE.Mesh(lightGeo, mats.headlightGlow);
    light.position.set(0.82, -0.25, zOffset);
    cabGroup.add(light);
  });

  root.add(cabGroup);

  // Rotating Concrete Mixer Drum
  const drumGroup = new THREE.Group();
  drumGroup.position.set(-0.8, 1.7, 0);
  drumGroup.rotation.z = Math.PI / 12; // tilted slightly

  // Dual cones forming the barrel
  const drumFrontGeo = new THREE.ConeGeometry(0.9, 1.5, 18);
  drumFrontGeo.rotateZ(-Math.PI / 2);
  const drumFront = new THREE.Mesh(drumFrontGeo, mats.drumGreen);
  drumFront.position.x = 0.5;
  drumFront.castShadow = true;
  drumGroup.add(drumFront);

  const drumRearGeo = new THREE.ConeGeometry(0.9, 1.5, 18);
  drumRearGeo.rotateZ(Math.PI / 2);
  const drumRear = new THREE.Mesh(drumRearGeo, mats.drumGreen);
  drumRear.position.x = -0.6;
  drumRear.castShadow = true;
  drumGroup.add(drumRear);

  // Spiral ring around drum
  const stripeGeo = new THREE.TorusGeometry(0.85, 0.08, 8, 24);
  stripeGeo.rotateY(Math.PI / 4);
  const stripe = new THREE.Mesh(stripeGeo, mats.drumStripe);
  drumGroup.add(stripe);

  root.add(drumGroup);

  // Dispenser Chute
  const chuteGeo = new THREE.BoxGeometry(0.6, 0.2, 0.4);
  const chute = new THREE.Mesh(chuteGeo, mats.chassisMetal);
  chute.position.set(-1.8, 1.2, 0);
  chute.rotation.z = -Math.PI / 6;
  root.add(chute);

  // Wheels
  [1.2, -0.6, -1.6].forEach((wx) => {
    [-1.05, 1.05].forEach((wz) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, 0.5, wz);

      const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.32, 20);
      tireGeo.rotateX(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, mats.rubberTire);
      tire.castShadow = true;
      wheelGroup.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.34, 16);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, mats.wheelRim);
      wheelGroup.add(rim);

      root.add(wheelGroup);
      wheels.push(tire);
    });
  });

  return {
    group: root,
    type: 'truk-molen',
    wheels,
    mixerDrum: drumFront,
    updateAnimation: (delta, actionState, speedFactor) => {
      if (speedFactor > 0) {
        wheels.forEach((w) => {
          w.rotation.z -= delta * 6 * speedFactor;
        });
      }
      // Mixer drum rotates constantly or faster during spinning/celebrate
      const spinSpeed = actionState === 'spinning' || actionState === 'celebrate' ? 5.0 : 1.5;
      drumGroup.rotation.x += delta * spinSpeed;
    },
    dispose: () => {
      root.traverse((obj) => {
        if (obj instanceof THREE.Mesh) obj.geometry.dispose();
      });
      Object.values(mats).forEach((m) => m.dispose());
    },
  };
}
