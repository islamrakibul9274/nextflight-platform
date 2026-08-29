"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ScrollFlightCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  fallbackMode?: boolean;
}

export function ScrollFlightCanvas({ scrollProgress }: ScrollFlightCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const [isLowPower, setIsLowPower] = useState(false);

  // Update target progress ref
  useEffect(() => {
    targetProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsLowPower(true);
    }

    // 1. Setup Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(0xf0f7ff, 0.015);

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: true,
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0x38bdf8, 2.2);
    sunLight.position.set(10, 20, 15);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xe0e7ff, 1.2);
    fillLight.position.set(-10, -5, -10);
    scene.add(fillLight);

    // 3. Create High-Fidelity 3D Jet Model & Aircraft Group
    const jetGroup = new THREE.Group();

    // Fuselage
    const fuselageGeo = new THREE.CylinderGeometry(0.55, 0.45, 6.2, 32);
    fuselageGeo.rotateX(Math.PI / 2);
    const aircraftMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.85,
      roughness: 0.18,
    });
    const fuselage = new THREE.Mesh(fuselageGeo, aircraftMat);
    jetGroup.add(fuselage);

    // Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.55, 1.8, 32);
    noseGeo.rotateX(-Math.PI / 2);
    const nose = new THREE.Mesh(noseGeo, aircraftMat);
    nose.position.set(0, 0, 3.8);
    jetGroup.add(nose);

    // Cockpit Windshield (Polished Dark Glass)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.9,
      roughness: 0.1,
      transmission: 0.6,
      thickness: 0.5,
      clearcoat: 1.0,
    });
    const windshieldGeo = new THREE.BoxGeometry(0.65, 0.35, 0.9);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 0.38, 2.6);
    windshield.rotation.x = -0.3;
    jetGroup.add(windshield);

    // Main Wings (Swept-back modern wing profile)
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0);
    wingShape.lineTo(4.8, -1.8);
    wingShape.lineTo(4.6, -2.4);
    wingShape.lineTo(0, -1.2);
    wingShape.closePath();

    const wingExtrudeSettings = { depth: 0.08, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrudeSettings);
    wingGeo.rotateX(Math.PI / 2);

    const rightWing = new THREE.Mesh(wingGeo, aircraftMat);
    rightWing.position.set(0.3, -0.05, 0.5);
    jetGroup.add(rightWing);

    const leftWing = rightWing.clone();
    leftWing.scale.set(-1, 1, 1);
    leftWing.position.set(-0.3, -0.05, 0.5);
    jetGroup.add(leftWing);

    // Winglet accents (Sky Blue tips)
    const wingletMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const wingletGeo = new THREE.BoxGeometry(0.08, 0.6, 0.3);
    const rightWinglet = new THREE.Mesh(wingletGeo, wingletMat);
    rightWinglet.position.set(4.7, 0.25, -1.6);
    jetGroup.add(rightWinglet);

    const leftWinglet = rightWinglet.clone();
    leftWinglet.position.set(-4.7, 0.25, -1.6);
    jetGroup.add(leftWinglet);

    // Vertical Stabilizer / Tail Fin
    const tailShape = new THREE.Shape();
    tailShape.moveTo(0, 0);
    tailShape.lineTo(0, 1.9);
    tailShape.lineTo(-1.1, 1.8);
    tailShape.lineTo(-1.8, 0);
    tailShape.closePath();

    const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.07, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.02, bevelThickness: 0.02 });
    const tailFin = new THREE.Mesh(tailGeo, aircraftMat);
    tailFin.position.set(-0.035, 0.35, -2.1);
    jetGroup.add(tailFin);

    // Horizontal Stabilizers
    const hStabGeo = new THREE.BoxGeometry(2.4, 0.06, 0.8);
    const hStab = new THREE.Mesh(hStabGeo, aircraftMat);
    hStab.position.set(0, 0.2, -2.7);
    jetGroup.add(hStab);

    // Jet Turbofan Engines
    const engineGeo = new THREE.CylinderGeometry(0.32, 0.28, 1.4, 24);
    engineGeo.rotateX(Math.PI / 2);
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });
    const engineR = new THREE.Mesh(engineGeo, engineMat);
    engineR.position.set(1.6, -0.4, 0.2);
    jetGroup.add(engineR);

    const engineL = engineR.clone();
    engineL.position.set(-1.6, -0.4, 0.2);
    jetGroup.add(engineL);

    // Engine Glow / Afterburner Rings
    const glowGeo = new THREE.RingGeometry(0.1, 0.26, 24);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const glowR = new THREE.Mesh(glowGeo, glowMat);
    glowR.position.set(1.6, -0.4, -0.52);
    jetGroup.add(glowR);

    const glowL = glowR.clone();
    glowL.position.set(-1.6, -0.4, -0.52);
    jetGroup.add(glowL);

    scene.add(jetGroup);

    // 4. Volumetric Cloud Particles & Atmospheric Streamlines
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      scales[i] = Math.random() * 0.8 + 0.2;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("scale", new THREE.BufferAttribute(scales, 1));

    const cloudParticleMat = new THREE.PointsMaterial({
      color: 0xbae6fd,
      size: 0.7,
      transparent: true,
      opacity: 0.45,
      blending: THREE.NormalBlending,
    });

    const particles = new THREE.Points(particleGeo, cloudParticleMat);
    scene.add(particles);

    // 5. Dynamic Jet Vapor Trails (Streamlines)
    const trailCount = 80;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);

    for (let i = 0; i < trailCount; i++) {
      trailPositions[i * 3] = (Math.random() > 0.5 ? 1.6 : -1.6) + (Math.random() - 0.5) * 0.2;
      trailPositions[i * 3 + 1] = -0.4 + (Math.random() - 0.5) * 0.1;
      trailPositions[i * 3 + 2] = -0.5 - (i * 0.35);
    }
    trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.25,
      transparent: true,
      opacity: 0.6,
    });
    const trail = new THREE.Points(trailGeo, trailMat);
    scene.add(trail);

    // 6. Smooth Lerp Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Lerp current progress smoothly towards target scroll progress
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.075;
      const p = currentProgressRef.current;

      // 5-Phase Camera & Aircraft Trajectory Mapping:
      // Phase 1 (0 - 0.25): Tarmac & Ground roll (low altitude, slight roll)
      // Phase 2 (0.25 - 0.50): Rotation & Climb (nose up, bank angle, rising elevation)
      // Phase 3 (0.50 - 0.75): Stratosphere Cruise (smooth level flight, cloud velocity)
      // Phase 4 (0.75 - 1.00): Horizon transition & Dock into search engine

      // Aircraft position and rotation based on scroll progress + subtle organic flight bobbing
      const idleBobY = Math.sin(elapsedTime * 1.5) * 0.06;
      const idleRoll = Math.sin(elapsedTime * 1.2) * 0.02;

      if (p < 0.25) {
        // Phase 1: Pre-flight & roll
        const localP = p / 0.25;
        jetGroup.position.set(0, -0.4 + localP * 0.6 + idleBobY, 0.5 - localP * 1.5);
        jetGroup.rotation.set(-0.05 + localP * 0.18, 0, idleRoll);
        camera.position.set(0, 1.2 + localP * 0.5, 11 - localP * 1.5);
      } else if (p < 0.5) {
        // Phase 2: Climb & Banking turn
        const localP = (p - 0.25) / 0.25;
        jetGroup.position.set(localP * 1.2, 0.2 + localP * 1.4 + idleBobY, -1.0 - localP * 2.0);
        jetGroup.rotation.set(0.13 - localP * 0.08, -localP * 0.25, -localP * 0.22 + idleRoll);
        camera.position.set(-localP * 0.8, 1.7 + localP * 0.8, 9.5 - localP * 2.0);
      } else if (p < 0.75) {
        // Phase 3: Stratospheric Cruise
        const localP = (p - 0.5) / 0.25;
        jetGroup.position.set(1.2 - localP * 1.6, 1.6 + localP * 0.2 + idleBobY, -3.0 - localP * 1.5);
        jetGroup.rotation.set(0.05, -0.25 + localP * 0.35, -0.22 + localP * 0.32 + idleRoll);
        camera.position.set(-0.8 + localP * 1.2, 2.5 + localP * 0.3, 7.5 - localP * 1.5);
      } else {
        // Phase 4: Horizon descent & Docking
        const localP = (p - 0.75) / 0.25;
        jetGroup.position.set(-0.4 + localP * 0.4, 1.8 - localP * 1.2 + idleBobY, -4.5 - localP * 3.0);
        jetGroup.rotation.set(0.05 - localP * 0.15, 0.1 - localP * 0.1, 0.1 - localP * 0.1 + idleRoll);
        camera.position.set(0.4 - localP * 0.4, 2.8 - localP * 1.0, 6.0 - localP * 1.0);
      }

      camera.lookAt(jetGroup.position.x * 0.4, jetGroup.position.y * 0.5, jetGroup.position.z);

      // Move particle clouds backwards to give high-speed forward sensation
      const posArr = particleGeo.attributes.position.array as Float32Array;
      const speedFactor = 0.12 + p * 0.25;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 2] += speedFactor;
        if (posArr[i * 3 + 2] > 20) {
          posArr[i * 3 + 2] = -40;
          posArr[i * 3] = (Math.random() - 0.5) * 45;
          posArr[i * 3 + 1] = (Math.random() - 0.5) * 20;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse engine afterburner
      const pulseScale = 1.0 + Math.sin(elapsedTime * 15) * 0.12;
      glowR.scale.set(pulseScale, pulseScale, 1);
      glowL.scale.set(pulseScale, pulseScale, 1);

      renderer.render(scene, camera);
    };

    animate();

    // 7. Responsive Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 8. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particleGeo.dispose();
      cloudParticleMat.dispose();
      aircraftMat.dispose();
      glassMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (isLowPower) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: "hidden" }}
    />
  );
}
