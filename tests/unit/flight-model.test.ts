import { describe, expect, it, vi } from "vitest";
import * as THREE from "three";
import {
  createAirliner,
  disposeAircraft,
} from "@/components/hero/flight/createAirliner";
import {
  fitAircraftCamera,
  positionAircraft,
} from "@/components/hero/flight/motion";

describe("fleet model", () => {
  it("has finite geometry and outward surfaces, including mirrored wings", () => {
    const aircraft = createAirliner();
    aircraft.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      for (const key of ["position", "normal"]) {
        const attribute = object.geometry.getAttribute(key);
        expect(attribute).toBeDefined();
        expect(Array.from(attribute.array).every(Number.isFinite)).toBe(true);
      }
    });
    const bounds = new THREE.Box3().setFromObject(aircraft);
    expect(bounds.max.x).toBeGreaterThan(5);
    expect(bounds.min.x).toBeLessThan(-5);
    expect(bounds.min.z).toBeCloseTo(-bounds.max.z, 3);
    disposeAircraft(aircraft);
  });

  it("keeps the entire aircraft in frame across scroll positions and mobile/desktop aspect ratios", () => {
    const aircraft = createAirliner();
    const camera = new THREE.OrthographicCamera(-8, 8, 5, -5, 0.1, 100);
    camera.position.set(9, 6.5, 13);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const point = new THREE.Vector3();
    for (const aspect of [0.85, 1.05, 1.4, 1.85, 2.5]) {
      fitAircraftCamera(camera, aspect);
      for (const progress of [-1, 0, 0.25, 0.5, 0.75, 1, 2]) {
        positionAircraft(aircraft, progress);
        aircraft.updateMatrixWorld(true);
        let maxX = 0;
        let maxY = 0;
        aircraft.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          const positions = object.geometry.getAttribute("position");
          for (let i = 0; i < positions.count; i++) {
            point
              .fromBufferAttribute(positions, i)
              .applyMatrix4(object.matrixWorld)
              .project(camera);
            maxX = Math.max(maxX, Math.abs(point.x));
            maxY = Math.max(maxY, Math.abs(point.y));
          }
        });
        expect(
          maxX,
          `horizontal clipping: aspect ${aspect}, progress ${progress}`,
        ).toBeLessThan(0.95);
        expect(
          maxY,
          `vertical clipping: aspect ${aspect}, progress ${progress}`,
        ).toBeLessThan(0.95);
      }
    }
    disposeAircraft(aircraft);
  });

  it("disposes shared GPU resources exactly once", () => {
    const aircraft = createAirliner();
    const spies = new Map<object, ReturnType<typeof vi.spyOn>>();
    aircraft.traverse((object) => {
      if (!(object instanceof THREE.Mesh || object instanceof THREE.Line))
        return;
      for (const resource of [object.geometry, ...[object.material].flat()]) {
        if (!spies.has(resource))
          spies.set(resource, vi.spyOn(resource, "dispose"));
      }
    });
    disposeAircraft(aircraft);
    for (const spy of spies.values()) expect(spy).toHaveBeenCalledTimes(1);
  });
});
