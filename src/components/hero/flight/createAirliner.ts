import * as THREE from "three";

/** A self-contained model: no remote models, textures, or decoder requests. Nose is +X. */
export function createAirliner() {
  const aircraft = new THREE.Group();
  const pearl = new THREE.MeshStandardMaterial({
    color: 0xf7f8fa,
    metalness: 0.28,
    roughness: 0.32,
  });
  const wingMaterial = new THREE.MeshStandardMaterial({
    color: 0xcbd5df,
    metalness: 0.48,
    roughness: 0.35,
  });
  const navy = new THREE.MeshStandardMaterial({
    color: 0x112c4a,
    metalness: 0.25,
    roughness: 0.3,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: 0x102333,
    metalness: 0.45,
    roughness: 0.2,
  });
  const metal = new THREE.MeshStandardMaterial({
    color: 0xa5b0ba,
    metalness: 0.8,
    roughness: 0.27,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: 0x172330,
    metalness: 0.3,
    roughness: 0.6,
  });

  function add(
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    parent: THREE.Object3D = aircraft,
  ) {
    const mesh = new THREE.Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  }

  // Radius/longitudinal stations produce a closed, smoothly tapered pressure hull.
  const hull = [
    [0, -5.15],
    [0.06, -4.85],
    [0.16, -4.3],
    [0.3, -3.55],
    [0.43, -2.7],
    [0.48, -1.8],
    [0.49, 0],
    [0.49, 2.8],
    [0.47, 3.65],
    [0.4, 4.2],
    [0.27, 4.62],
    [0.12, 4.94],
    [0, 5.08],
  ].map(([radius, x]) => new THREE.Vector2(radius, x));
  const hullCurve = new THREE.SplineCurve(hull);
  const hullStations = hullCurve
    .getPoints(240)
    .map((p) => new THREE.Vector2(Math.max(0, p.x), p.y));
  function hullRadius(x: number) {
    const next = hullStations.findIndex((point) => point.y >= x);
    if (next <= 0) return hullStations[0].x;
    const a = hullStations[next - 1];
    const b = hullStations[next];
    return THREE.MathUtils.lerp(a.x, b.x, (x - a.y) / (b.y - a.y));
  }
  const hullGeometry = new THREE.LatheGeometry(hullStations, 64);
  hullGeometry.rotateZ(-Math.PI / 2);
  add(hullGeometry, pearl);

  // Airfoil sections give the wings actual thickness, dihedral, and raked tips.
  function wing(sections: number[][], side: number, material: THREE.Material) {
    const vertices: number[] = [];
    const indices: number[] = [];
    const ringSize = 24;
    for (const [leadingX, chord, span, height, thickness] of sections) {
      for (let j = 0; j < ringSize; j++) {
        const angle = (j / ringSize) * Math.PI * 2;
        const u = (1 - Math.cos(angle)) / 2;
        vertices.push(
          leadingX - chord * u,
          height + Math.sin(angle) * thickness,
          side * span,
        );
      }
    }
    for (let i = 0; i < sections.length - 1; i++) {
      for (let j = 0; j < ringSize; j++) {
        const a = i * ringSize + j;
        const b = i * ringSize + ((j + 1) % ringSize);
        indices.push(a, b, a + ringSize, b, b + ringSize, a + ringSize);
      }
    }
    for (let j = 1; j < ringSize - 1; j++) {
      indices.push(0, j + 1, j);
      const end = (sections.length - 1) * ringSize;
      indices.push(end, end + j, end + j + 1);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    // Mirrored wings need reversed winding to retain correct outward normals.
    geometry.setIndex(
      side > 0
        ? indices
        : indices.flatMap((_, i, all) =>
            i % 3 === 0 ? [all[i], all[i + 2], all[i + 1]] : [],
          ),
    );
    geometry.computeVertexNormals();
    return add(geometry, material);
  }

  for (const side of [-1, 1]) {
    wing(
      [
        [1.1, 2.65, 0.32, -0.12, 0.1],
        [0.05, 1.65, 2.25, -0.03, 0.07],
        [-1.65, 0.66, 4.65, 0.43, 0.035],
        [-2.45, 0.13, 5.45, 0.8, 0.012],
      ],
      side,
      wingMaterial,
    );
    wing(
      [
        [-3.32, 1.26, 0.16, 0.12, 0.065],
        [-4.3, 0.58, 1.65, 0.28, 0.03],
        [-4.69, 0.13, 2.1, 0.39, 0.012],
      ],
      side,
      wingMaterial,
    );

    // Slim pylons hold real open nacelles beneath the wing.
    const pylon = add(new THREE.BoxGeometry(0.8, 0.4, 0.1), wingMaterial);
    pylon.position.set(0.4, -0.34, side * 1.65);
    const engine = new THREE.Group();
    engine.position.set(0.75, -0.67, side * 1.65);
    aircraft.add(engine);
    const nacelleProfile = [
      [0.26, -0.85],
      [0.33, -0.65],
      [0.4, 0.2],
      [0.39, 0.64],
      [0.36, 0.72],
      [0.32, 0.68],
      [0.31, 0.48],
      [0.27, -0.65],
      [0.26, -0.85],
    ].map(([r, x]) => new THREE.Vector2(r, x));
    const nacelle = new THREE.LatheGeometry(nacelleProfile, 40);
    nacelle.rotateZ(-Math.PI / 2);
    add(nacelle, pearl, engine);
    const lip = add(
      new THREE.TorusGeometry(0.342, 0.025, 8, 48),
      metal,
      engine,
    );
    lip.rotation.y = Math.PI / 2;
    lip.position.x = 0.69;
    const fan = add(new THREE.CircleGeometry(0.31, 32), dark, engine);
    fan.rotation.y = Math.PI / 2;
    fan.position.x = 0.44;
    // Individual fan blades are visible inside the intake rather than glowing exhausts.
    for (let i = 0; i < 18; i++) {
      const theta = (i * Math.PI * 2) / 18;
      const blade = add(
        new THREE.BoxGeometry(0.025, 0.23, 0.035),
        metal,
        engine,
      );
      blade.position.set(0.46, Math.cos(theta) * 0.17, Math.sin(theta) * 0.17);
      blade.rotation.x = theta + 0.3;
    }
    const spinner = add(new THREE.ConeGeometry(0.09, 0.21, 20), metal, engine);
    spinner.rotation.z = -Math.PI / 2;
    spinner.position.x = 0.54;

    // Flush cabin windows, following the radius of the cylindrical body.
    const windowShape = new THREE.Shape();
    windowShape.absellipse(0, 0, 0.029, 0.045, 0, Math.PI * 2, false, 0);
    for (let i = 0; i < 43; i++) {
      const x = -2.4 + i * 0.137;
      if (i === 8 || i === 27) continue; // Door stations.
      const geometry = new THREE.ShapeGeometry(windowShape, 8);
      const positions = geometry.getAttribute("position");
      for (let j = 0; j < positions.count; j++) {
        const px = x + positions.getX(j);
        const py = 0.18 + positions.getY(j);
        positions.setXYZ(
          j,
          px,
          py,
          side *
            (Math.sqrt(Math.max(0, hullRadius(px) ** 2 - py ** 2)) + 0.006),
        );
      }
      if (side < 0) {
        const indices = geometry.getIndex()!;
        for (let j = 0; j < indices.count; j += 3) {
          const second = indices.getX(j + 1);
          indices.setX(j + 1, indices.getX(j + 2));
          indices.setX(j + 2, second);
        }
      }
      geometry.computeVertexNormals();
      add(geometry, glass);
    }
    for (const x of [-2.7, -1.24, 1.3, 3.55]) {
      const door = new THREE.Shape();
      door.moveTo(-0.055, -0.17);
      door.lineTo(0.055, -0.17);
      door.lineTo(0.055, 0.17);
      door.lineTo(-0.055, 0.17);
      door.closePath();
      const outline = new THREE.BufferGeometry().setFromPoints(
        door.getPoints(),
      );
      const line = new THREE.Line(
        outline,
        new THREE.LineBasicMaterial({ color: 0x8c9eaf }),
      );
      line.position.set(x, 0.04, side * 0.49);
      aircraft.add(line);
    }

    // Project the windshield onto the curved hull to avoid intersecting/flickering faces.
    const cockpit = new THREE.BufferGeometry();
    const cockpitVertices: number[] = [];
    const cockpitIndices: number[] = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const x = THREE.MathUtils.lerp(4.04, 4.61, t);
      for (const y of [
        THREE.MathUtils.lerp(0.29, 0.16, t),
        THREE.MathUtils.lerp(0.105, 0.075, t),
      ]) {
        cockpitVertices.push(
          x,
          y,
          side * (Math.sqrt(Math.max(0, hullRadius(x) ** 2 - y ** 2)) + 0.012),
        );
      }
      if (i < 12) {
        const a = i * 2;
        cockpitIndices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    cockpit.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(cockpitVertices, 3),
    );
    cockpit.setIndex(
      side > 0
        ? cockpitIndices
        : cockpitIndices.flatMap((_, i, all) =>
            i % 3 === 0 ? [all[i], all[i + 2], all[i + 1]] : [],
          ),
    );
    cockpit.computeVertexNormals();
    add(cockpit, glass);
  }

  const finShape = new THREE.Shape();
  finShape.moveTo(-4.87, 0.12);
  finShape.lineTo(-4.73, 2.07);
  finShape.quadraticCurveTo(-4.68, 2.18, -4.5, 2.12);
  finShape.lineTo(-3.05, 0.33);
  finShape.closePath();
  const finGeometry = new THREE.ExtrudeGeometry(finShape, {
    depth: 0.07,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.025,
    bevelSegments: 2,
    steps: 1,
  });
  finGeometry.translate(0, 0, -0.035);
  add(finGeometry, navy);

  // Graphic livery on both sides of the vertical stabilizer.
  for (const side of [-1, 1]) {
    const mark = new THREE.Shape();
    mark.moveTo(-4.6, 0.68);
    mark.lineTo(-4.56, 1.7);
    mark.lineTo(-4.39, 1.46);
    mark.lineTo(-4.4, 0.96);
    mark.lineTo(-3.93, 0.69);
    mark.lineTo(-4.1, 0.46);
    mark.closePath();
    const logo = add(
      new THREE.ShapeGeometry(mark),
      new THREE.MeshBasicMaterial({ color: 0xe6f3ff, side: THREE.DoubleSide }),
    );
    logo.position.z = side * 0.066;
  }

  return aircraft;
}

export function disposeAircraft(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  root.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material)
        ? object.material
        : [object.material])
        materials.add(material);
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}
