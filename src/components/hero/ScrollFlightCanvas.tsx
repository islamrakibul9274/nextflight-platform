"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createAirliner, disposeAircraft } from "./flight/createAirliner";
import { fitAircraftCamera, positionAircraft } from "./flight/motion";

interface Props {
  progress: MotionValue<number>;
  paused: boolean;
}

/** Scroll controls a single continuous pose. Render only while visible and moving. */
export function ScrollFlightCanvas({ progress, paused }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(paused);
  const wakeRef = useRef<() => void>(() => {});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    pausedRef.current = paused;
    wakeRef.current();
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      // The static illustration remains visible when WebGL is unavailable.
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 100);
    camera.position.set(9, 6.5, 13);
    camera.lookAt(0, 0, 0);
    const environment = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmrem.fromScene(environment, 0.04);
    scene.environment = environmentMap.texture;
    environment.dispose();
    pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xf5faff, 0x7c98b4, 2.2));
    const sun = new THREE.DirectionalLight(0xfff4df, 3.2);
    sun.position.set(3, 9, 6);
    scene.add(sun);
    const aircraft = createAirliner();
    scene.add(aircraft);

    let frame = 0;
    let disposed = false;
    let visible = false;
    let contextLost = false;
    let sized = false;
    let firstFrame = true;
    let current = THREE.MathUtils.clamp(progress.get(), 0, 1);
    let lastTime = 0;
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const render = (time: number) => {
      frame = 0;
      if (disposed || !visible || document.hidden || contextLost || !sized)
        return;
      const fixed = pausedRef.current || motionPreference.matches;
      const target = motionPreference.matches
        ? 0.45
        : pausedRef.current
          ? current
          : THREE.MathUtils.clamp(progress.get(), 0, 1);
      const dt = Math.min((time - lastTime) / 1000 || 1 / 60, 0.05);
      lastTime = time;
      current = fixed ? target : THREE.MathUtils.damp(current, target, 7, dt);
      // A bounded bank, with a continuous reversible trajectory (no phase jumps).
      positionAircraft(aircraft, current);
      renderer.render(scene, camera);
      container.dataset.progress = current.toFixed(3);
      if (firstFrame) {
        firstFrame = false;
        setReady(true);
      }
      if (!fixed && Math.abs(current - target) > 0.0001) wake();
    };
    const wake = () => {
      if (!frame && !disposed && visible && !document.hidden && !contextLost)
        frame = requestAnimationFrame(render);
    };
    wakeRef.current = wake;
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (width < 1 || height < 1) {
        sized = false;
        return;
      }
      sized = true;
      const aspect = width / height;
      fitAircraftCamera(camera, aspect);
      renderer.setSize(width, height);
      wake();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        lastTime = performance.now();
        wake();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    observer.observe(container);
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const unsubscribe = progress.on("change", wake);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      setReady(false);
    };
    const onContextRestored = () => {
      contextLost = false;
      firstFrame = true;
      resize();
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost);
    renderer.domElement.addEventListener(
      "webglcontextrestored",
      onContextRestored,
    );
    document.addEventListener("visibilitychange", wake);
    motionPreference.addEventListener("change", wake);
    resize();

    return () => {
      disposed = true;
      wakeRef.current = () => {};
      cancelAnimationFrame(frame);
      unsubscribe();
      observer.disconnect();
      resizeObserver.disconnect();
      document.removeEventListener("visibilitychange", wake);
      motionPreference.removeEventListener("change", wake);
      renderer.domElement.removeEventListener(
        "webglcontextlost",
        onContextLost,
      );
      renderer.domElement.removeEventListener(
        "webglcontextrestored",
        onContextRestored,
      );
      disposeAircraft(scene);
      environmentMap.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, [progress]);

  return (
    <div
      ref={containerRef}
      data-testid="flight-canvas"
      data-ready={ready}
      className={`fleet-canvas ${ready ? "is-ready" : ""}`}
      aria-hidden="true"
    />
  );
}
