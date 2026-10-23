import * as THREE from "three";

export function positionAircraft(aircraft: THREE.Object3D, progress: number) {
  const p = THREE.MathUtils.clamp(progress, 0, 1);
  aircraft.rotation.set(
    THREE.MathUtils.lerp(-0.055, 0.11, p),
    THREE.MathUtils.lerp(-0.28, 0.24, p),
    THREE.MathUtils.lerp(-0.055, 0.07, p),
  );
  aircraft.position.y = Math.sin(p * Math.PI) * 0.22 - 0.1;
}

export function fitAircraftCamera(
  camera: THREE.OrthographicCamera,
  aspect: number,
) {
  const viewHeight = Math.max(8.1, 13.4 / aspect);
  camera.left = (-viewHeight * aspect) / 2;
  camera.right = (viewHeight * aspect) / 2;
  camera.top = viewHeight / 2;
  camera.bottom = -viewHeight / 2;
  camera.updateProjectionMatrix();
}
