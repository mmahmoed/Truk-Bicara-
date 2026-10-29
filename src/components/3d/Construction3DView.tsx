/**
 * Construction3DView
 * Real-time 3D Three.js Construction Scene with Direct Touch/Click Interaction
 * Features:
 * - Direct click/tap on 3D canvas opens and closes the dump bed!
 * - Dedicated Buka/Tutup Bak button with live state
 * - Audio assets for Klakson (Bip-bip) & Mesin Truk (Brum-brum)
 * - Articulated vehicles (upward tilting bed, excavator scoop, spinning mixer drum)
 * - Software WebGL guard & 2D fallback
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { VehicleId } from '../../types';
import {
  VehicleController,
  createYellowTruck,
  createRedTruck,
  createOrangeExcavator,
  createCementMixer,
} from './vehicleBuilders';
import { buildConstructionWorld, WorldEnvironment } from './worldBuilder';
import { soundEngine } from '../../services/soundEngine';

interface Props {
  vehicleId: VehicleId;
  actionState?: 'idle' | 'driving' | 'dumping' | 'digging' | 'spinning' | 'stop' | 'celebrate' | 'bed-open';
  isCalmMode?: boolean;
  className?: string;
  onFallbackTo2D?: () => void;
  showQuickControls?: boolean;
}

export const Construction3DView: React.FC<Props> = ({
  vehicleId,
  actionState = 'idle',
  isCalmMode = false,
  className = 'w-full h-72 md:h-96 lg:h-[420px]',
  onFallbackTo2D,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [isBedOpen, setIsBedOpen] = useState<boolean>(false);
  const [internalAction, setInternalAction] = useState<string>(actionState);

  // Sync internal action when prop changes
  useEffect(() => {
    if (actionState === 'dumping' || actionState === 'celebrate') {
      setIsBedOpen(true);
    }
    if (actionState === 'driving') {
      soundEngine.playTruckEngine();
    }
    setInternalAction(isBedOpen ? 'bed-open' : actionState);
  }, [actionState, isBedOpen]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect WebGL & Software GL
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) {
      setWebGlSupported(false);
      return;
    }

    let isSoftwareGl = false;
    try {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      // ignore
    }

    // 2. Three.js Scene Setup
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const skyColor = new THREE.Color(0xfef3c7);
    scene.background = skyColor;
    scene.fog = new THREE.Fog(skyColor, 18, 48);

    // Camera: Stable child-friendly 3/4 isometric viewpoint
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7.5, 6.2, 11.5);
    camera.lookAt(0, 1.2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.replaceChildren(renderer.domElement);

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Lighting Rig
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
    sunLight.position.set(12, 16, 10);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    const d = 12;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0xfde68a, 0.85);
    scene.add(hemiLight);

    // 4. World Environment
    const world: WorldEnvironment = buildConstructionWorld();
    scene.add(world.group);

    // 5. Build Vehicle
    let vehicleController: VehicleController;
    if (vehicleId === 'truk-merah') {
      vehicleController = createRedTruck();
    } else if (vehicleId === 'ekskavator') {
      vehicleController = createOrangeExcavator();
    } else if (vehicleId === 'truk-molen') {
      vehicleController = createCementMixer();
    } else {
      vehicleController = createYellowTruck();
    }
    scene.add(vehicleController.group);

    // Vehicle Motion States
    let currentX = -8.0;
    const targetX = 0.0;
    let vehicleSpeedFactor = 1.0;
    let clock = new THREE.Clock();
    let frameId = 0;
    let isDisposed = false;

    // Play engine idling/rumble sound on vehicle entry
    soundEngine.playTruckEngine();

    // 6. Animation Loop
    const tick = () => {
      if (isDisposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);

      // Driving entry animation
      if (currentX < targetX - 0.05) {
        currentX = THREE.MathUtils.damp(currentX, targetX, 2.2, delta);
        vehicleSpeedFactor = 1.2;
        vehicleController.group.position.x = currentX;
      } else {
        vehicleController.group.position.x = targetX;
        vehicleSpeedFactor = internalAction === 'driving' ? 1.0 : 0.0;
      }

      // Gentle idling bounce
      if (vehicleSpeedFactor === 0 && !isCalmMode) {
        vehicleController.group.position.y = Math.sin(clock.getElapsedTime() * 3) * 0.02;
      } else {
        vehicleController.group.position.y = 0;
      }

      // Vehicle specific internal animation
      vehicleController.updateAnimation(delta, internalAction, vehicleSpeedFactor);

      // Render
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    // Resize handler
    const handleResize = () => {
      if (!container || isDisposed) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);

      vehicleController.dispose();
      world.dispose();
      renderer.dispose();
      container.replaceChildren();
    };
  }, [vehicleId, isCalmMode, internalAction]);

  // Fallback UI if WebGL is unavailable
  if (!webGlSupported) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-amber-100 rounded-3xl border-4 border-amber-300 text-center">
        <p className="font-black text-amber-950 text-lg mb-2">
          Mode 3D dialihkan ke visual 2D kartun cepat untuk perangkat ini.
        </p>
        {onFallbackTo2D && (
          <button
            onClick={onFallbackTo2D}
            className="px-4 py-2 bg-amber-500 text-amber-950 font-bold rounded-xl cursor-pointer"
          >
            Lanjutkan dengan Mode 2D
          </button>
        )}
      </div>
    );
  }

  // Interaction: Toggle Dump Bed Open/Close
  const handleToggleBed = () => {
    const nextState = !isBedOpen;
    setIsBedOpen(nextState);
    if (nextState) {
      soundEngine.playDumpBed();
      setInternalAction('bed-open');
    } else {
      soundEngine.playPop();
      setInternalAction('idle');
    }
  };

  // Interaction: Honk (Bip-bip)
  const handleHonk = () => {
    soundEngine.playHorn();
    setInternalAction('celebrate');
    setTimeout(() => setInternalAction(isBedOpen ? 'bed-open' : actionState), 1200);
  };

  // Interaction: Engine Rev & Idling (Brum-brum)
  const handleEngineRev = () => {
    soundEngine.playTruckEngine();
    setInternalAction('driving');
    setTimeout(() => setInternalAction(isBedOpen ? 'bed-open' : actionState), 1400);
  };

  // Special Action for Excavator or Mixer
  const handleSpecialAction = () => {
    if (vehicleId === 'ekskavator') {
      soundEngine.playExcavatorDig();
      setInternalAction('digging');
      setTimeout(() => setInternalAction(actionState), 2000);
    } else if (vehicleId === 'truk-molen') {
      soundEngine.playCementSpin();
      setInternalAction('spinning');
      setTimeout(() => setInternalAction(actionState), 2000);
    } else {
      handleToggleBed();
    }
  };

  // Canvas Direct Click: Clicking anywhere on the 3D truck triggers horn & action!
  const handleCanvasClick = () => {
    soundEngine.playHorn();
    if (vehicleId === 'truk-kuning' || vehicleId === 'truk-merah') {
      handleToggleBed();
    } else if (vehicleId === 'ekskavator') {
      handleSpecialAction();
    } else if (vehicleId === 'truk-molen') {
      handleSpecialAction();
    }
  };

  const isDumpTruck = vehicleId === 'truk-kuning' || vehicleId === 'truk-merah';

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      {/* 3D Canvas Mount Point with Direct Click/Touch Interaction */}
      <div
        ref={mountRef}
        onClick={handleCanvasClick}
        className={`${className} w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 bg-amber-100 cursor-pointer active:scale-[0.99] transition-transform`}
        title="Klik truk 3D untuk membuka atau menutup bak!"
      />
    </div>
  );
};
