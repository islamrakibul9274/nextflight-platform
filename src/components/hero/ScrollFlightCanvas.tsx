"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ScrollFlightCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
}

export function ScrollFlightCanvas({ scrollProgress }: ScrollFlightCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  useEffect(() => {
    targetProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = null; // transparent background

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 14);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    // 2. Sophisticated Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x0284c7, 2.2);
    keyLight.position.set(12, 18, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x94a3b8, 1.5);
    rimLight.position.set(-12, -6, -10);
    scene.add(rimLight);

    // 3. Create Sleek Aerodynamic Jet Group (Positioned in 3D space with elegant scale)
    const flightGroup = new THREE.Group();

    // Sleek Titanium White Aircraft Material
    const jetBodyMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      metalness: 0.85,
      roughness: 0.15,
    });

    const cobaltAccents = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      metalness: 0.6,
      roughness: 0.2,
    });

    const glassCockpitMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.05,
      transmission: 0.7,
      thickness: 0.4,
      clearcoat: 1.0,
    });

    // Aerodynamic Streamlined Fuselage
    const fuselageShape = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 3.8),
      new THREE.Vector3(0, 0.05, 2.2),
      new THREE.Vector3(0, 0.02, 0),
      new THREE.Vector3(0, -0.02, -2.4),
      new THREE.Vector3(0, 0.1, -4.0),
    ]);

    const fuselageGeo = new THREE.TubeGeometry(fuselageShape, 64, 0.38, 24, false);
    const fuselage = new THREE.Mesh(fuselageGeo, jetBodyMat);
    flightGroup.add(fuselage);

    // Cockpit Visor
    const cockpitGeo = new THREE.BoxGeometry(0.36, 0.22, 0.9);
    const cockpit = new THREE.Mesh(cockpitGeo, glassCockpitMat);
    cockpit.position.set(0, 0.24, 2.0);
    cockpit.rotation.x = -0.22;
    flightGroup.add(cockpit);

    // Modern Blended Wings
    const wingShape = new THREE.Shape();
    wingShape.moveTo(0, 0.2);
    wingShape.lineTo(4.6, -1.8);
    wingShape.lineTo(4.4, -2.2);
    wingShape.lineTo(0, -1.0);
    wingShape.closePath();

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
    wingGeo.rotateX(Math.PI / 2);

    const rightWing = new THREE.Mesh(wingGeo, jetBodyMat);
    rightWing.position.set(0.15, -0.02, 0.3);
    flightGroup.add(rightWing);

    const leftWing = rightWing.clone();
    leftWing.scale.set(-1, 1, 1);
    leftWing.position.set(-0.15, -0.02, 0.3);
    flightGroup.add(leftWing);

    // Winglets
    const wingletGeo = new THREE.BoxGeometry(0.04, 0.5, 0.25);
    const rightWinglet = new THREE.Mesh(wingletGeo, cobaltAccents);
    rightWinglet.position.set(4.55, 0.22, -1.55);
    flightGroup.add(rightWinglet);

    const leftWinglet = rightWinglet.clone();
    leftWinglet.position.set(-4.55, 0.22, -1.55);
    flightGroup.add(leftWinglet);

    // Vertical Tail Fin
    const tailShape = new THREE.Shape();
    tailShape.moveTo(0, 0);
    tailShape.lineTo(0, 1.6);
    tailShape.lineTo(-0.9, 1.5);
    tailShape.lineTo(-1.6, 0);
    tailShape.closePath();

    const tailGeo = new THREE.ExtrudeGeometry(tailShape, {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    });
    const tail = new THREE.Mesh(tailGeo, cobaltAccents);
    tail.position.set(-0.025, 0.25, -2.4);
    flightGroup.add(tail);

    // Horizontal Stabilizers
    const hStabGeo = new THREE.BoxGeometry(2.0, 0.04, 0.65);
    const hStab = new THREE.Mesh(hStabGeo, jetBodyMat);
    hStab.position.set(0, 0.18, -3.2);
    flightGroup.add(hStab);

    // Engine Nacelles
    const engineGeo = new THREE.CylinderGeometry(0.24, 0.2, 1.2, 24);
    engineGeo.rotateX(Math.PI / 2);
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });

    const rightEngine = new THREE.Mesh(engineGeo, engineMat);
    rightEngine.position.set(1.4, -0.28, 0.1);
    flightGroup.add(rightEngine);

    const leftEngine = rightEngine.clone();
    leftEngine.position.set(-1.4, -0.28, 0.1);
    flightGroup.add(leftEngine);

    // Engine Luminous Thruster Rings
    const thrusterGeo = new THREE.RingGeometry(0.08, 0.19, 24);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });

    const rightThruster = new THREE.Mesh(thrusterGeo, thrusterMat);
    rightThruster.position.set(1.4, -0.28, -0.52);
    flightGroup.add(rightThruster);

    const leftThruster = rightThruster.clone();
    leftThruster.position.set(-1.4, -0.28, -0.52);
    flightGroup.add(leftThruster);

    // Scale flightGroup to fit harmoniously in the background
    flightGroup.scale.set(0.72, 0.72, 0.72);
    scene.add(flightGroup);

    // 4. Geodesic Flight Arcs & Interactive Route Matrix in 3D Space
    const arcGroup = new THREE.Group();

    // Create 3 dynamic curved airway routes
    const createCurvedAirway = (start: THREE.Vector3, mid: THREE.Vector3, end: THREE.Vector3, color: number) => {
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineDashedMaterial({
        color: color,
        dashSize: 0.4,
        gapSize: 0.2,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      return line;
    };

    const airway1 = createCurvedAirway(
      new THREE.Vector3(-12, -4, -6),
      new THREE.Vector3(0, 3, -4),
      new THREE.Vector3(12, 1, -8),
      0x38bdf8
    );
    const airway2 = createCurvedAirway(
      new THREE.Vector3(-10, 4, -10),
      new THREE.Vector3(2, 6, -6),
      new THREE.Vector3(14, -2, -12),
      0x818cf8
    );
    arcGroup.add(airway1);
    arcGroup.add(airway2);
    scene.add(arcGroup);

    // 5. Atmospheric Streamline Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.18,
      transparent: true,
      opacity: 0.5,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Smooth Lerp Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth progress lerp
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.08;
      const p = currentProgressRef.current;

      // Natural organic flight bobbing
      const bobY = Math.sin(elapsedTime * 1.8) * 0.08;
      const bobRoll = Math.sin(elapsedTime * 1.2) * 0.03;

      // Smooth trajectory across scroll:
      // Positioned strategically above the widget and to the right so it never obscures text
      if (p < 0.3) {
        // Phase 1: Ascent & departure bank
        const localP = p / 0.3;
        flightGroup.position.set(1.5 + localP * 0.8, 0.4 + localP * 0.6 + bobY, -1.2 - localP * 1.5);
        flightGroup.rotation.set(-0.08 + localP * 0.15, -0.25 - localP * 0.15, -0.15 + bobRoll);
        camera.position.set(0, 1.0 + localP * 0.4, 13 - localP * 1.5);
      } else if (p < 0.7) {
        // Phase 2: Stratospheric High-Speed Transit
        const localP = (p - 0.3) / 0.4;
        flightGroup.position.set(2.3 - localP * 1.2, 1.0 + localP * 0.3 + bobY, -2.7 - localP * 2.0);
        flightGroup.rotation.set(0.07, -0.4 + localP * 0.5, -0.15 + localP * 0.3 + bobRoll);
        camera.position.set(0.2 - localP * 0.4, 1.4 + localP * 0.2, 11.5 - localP * 1.5);
      } else {
        // Phase 3: Horizon Descent & Approach
        const localP = (p - 0.7) / 0.3;
        flightGroup.position.set(1.1 + localP * 0.6, 1.3 - localP * 0.8 + bobY, -4.7 - localP * 2.5);
        flightGroup.rotation.set(0.07 - localP * 0.12, 0.1 - localP * 0.2, 0.15 - localP * 0.2 + bobRoll);
        camera.position.set(-0.2 + localP * 0.2, 1.6 - localP * 0.4, 10.0 - localP * 1.0);
      }

      // Move particles forward
      const posArr = particleGeo.attributes.position.array as Float32Array;
      const speed = 0.1 + p * 0.2;
      for (let i = 0; i < particleCount; i++) {
        posArr[i * 3 + 2] += speed;
        if (posArr[i * 3 + 2] > 15) {
          posArr[i * 3 + 2] = -25;
          posArr[i * 3] = (Math.random() - 0.5) * 35;
          posArr[i * 3 + 1] = (Math.random() - 0.5) * 16;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Pulse engine rings
      const pulse = 1.0 + Math.sin(elapsedTime * 12) * 0.1;
      rightThruster.scale.set(pulse, pulse, 1);
      leftThruster.scale.set(pulse, pulse, 1);

      // Subtle rotation of airway arcs
      arcGroup.rotation.y = Math.sin(elapsedTime * 0.3) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      fuselageGeo.dispose();
      jetBodyMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: "hidden" }}
    />
  );
}
