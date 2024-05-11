import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // width1

  const widthRow1 = new UIRow();
  const width1 = new UINumber(parameters.dx1).setRange(0, Infinity).onChange(update);

  widthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx1')).setWidth('90px'));
  widthRow1.add(width1);

  container.add(widthRow1);

  // depth1

  const depthRow1 = new UIRow();
  const depth1 = new UINumber(parameters.dy1).setRange(0, Infinity).onChange(update);

  depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy1')).setWidth('90px'));
  depthRow1.add(depth1);

  container.add(depthRow1);

  // width2

  const widthRow2 = new UIRow();
  const width2 = new UINumber(parameters.dx2).setRange(0, Infinity).onChange(update);

  widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx2')).setWidth('90px'));
  widthRow2.add(width2);

  container.add(widthRow2);

  // depth2

  const depthRow2 = new UIRow();
  const depth2 = new UINumber(parameters.dy2).setRange(0, Infinity).onChange(update);

  depthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy2')).setWidth('90px'));
  depthRow2.add(depth2);

  container.add(depthRow2);

  // height

  const heightRow = new UIRow();
  const height = new UINumber(parameters.dz).setRange(0, Infinity).onChange(update);

  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dz')).setWidth('90px'));
  heightRow.add(height);

  container.add(heightRow);

  //

  function update() {

    // we need to new each geometry module

    // const x1 = width1.getValue(), y1 = depth1.getValue(), z = height.getValue(), x2 = width2.getValue(), y2 = depth2.getValue();
    // if (x1 * y1 * x2 * y2 * z === 0) {
    //   return;
    // }
    // var trd = new THREE.BufferGeometry();

    //     const points = [
    //         new THREE.Vector3(-x2, -y2, z),//2
    //         new THREE.Vector3(-x2, y2, z),//1
    //         new THREE.Vector3(x2, y2, z),//0

    //         new THREE.Vector3(x2, y2, z),//0
    //         new THREE.Vector3(x2, -y2, z),//3
    //         new THREE.Vector3(-x2, -y2, z),//2

    //         new THREE.Vector3(x1, y1, -z),//4
    //         new THREE.Vector3(-x1, y1, -z),//5
    //         new THREE.Vector3(-x1, -y1, -z),//6

    //         new THREE.Vector3(-x1, -y1, -z),//6
    //         new THREE.Vector3(x1, -y1, -z),//7
    //         new THREE.Vector3(x1, y1, -z),//4

    //         new THREE.Vector3(x2, y2, z),//0
    //         new THREE.Vector3(x1, y1, -z),//4
    //         new THREE.Vector3(x1, -y1, -z),//7

    //         new THREE.Vector3(x1, -y1, -z),//7
    //         new THREE.Vector3(x2, -y2, z),//3
    //         new THREE.Vector3(x2, y2, z),//0

    //         new THREE.Vector3(-x2, y2, z),//1
    //         new THREE.Vector3(-x2, -y2, z),//2
    //         new THREE.Vector3(-x1, -y1, -z),//6

    //         new THREE.Vector3(-x1, -y1, -z),//6
    //         new THREE.Vector3(-x1, y1, -z),//5
    //         new THREE.Vector3(-x2, y2, z),//1

    //         new THREE.Vector3(-x2, y2, z),//1
    //         new THREE.Vector3(-x1, y1, -z),//5
    //         new THREE.Vector3(x1, y1, -z),//4

    //         new THREE.Vector3(x1, y1, -z),//4
    //         new THREE.Vector3(x2, y2, z),//0
    //         new THREE.Vector3(-x2, y2, z),//1

    //         new THREE.Vector3(-x2, -y2, z),//2
    //         new THREE.Vector3(x2, -y2, z),//3
    //         new THREE.Vector3(x1, -y1, -z),//7

    //         new THREE.Vector3(x1, -y1, -z),//7
    //         new THREE.Vector3(-x1, -y1, -z),//6
    //         new THREE.Vector3(-x2, -y2, z),//2
    //     ]

    //     trd.setFromPoints(points);

    //     const param = { 'dx1': x1, 'dy1': y1, 'dz': z, 'dx2': x2, 'dy2': y2 };
    //     trd.parameters = param;
    //     trd.type = 'aTrapeZoidGeometry';
    //     const finalMesh = new THREE.Mesh(trd, new THREE.MeshStandardMaterial())
    //     finalMesh.updateMatrix();
    //     finalMesh.name = 'TrapeZoid';

    const dx1 = width1.getValue(), dy1 = depth1.getValue(), dz = height.getValue(), dx2 = width2.getValue(), dy2 = depth2.getValue();
    if (dx1 * dy1 * dx2 * dy2 * dz === 0) {
      return;
    }
    const maxdis = Math.max(dx1, dy1, dx2, dy2, dz);
    const maxwidth = Math.max(dx1, dy1, dx2, dy2);
    const geometry = new THREE.BoxGeometry(maxwidth, dz, maxwidth);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

    const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

    let MeshCSG1 = CSG.fromMesh(mesh);
    let MeshCSG3;

    let alpha = Math.atan((dy1 - dy2) / 2 / dz);
    let phi = Math.atan((dx1 - dx2) / 2 / dz);

    let aCSG;

    boxmesh.geometry.translate(maxdis, maxdis, 0);
    boxmesh.position.set(0 + dx1 / 2, -dz / 2, 0);
    if (dx1 < maxwidth && phi > 0) {
      boxmesh.updateMatrix();
      MeshCSG3 = CSG.fromMesh(boxmesh);
      aCSG = MeshCSG1.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(0, 0, phi);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    if (dx1 < maxwidth && phi > 0) {
      aCSG = aCSG.subtract(MeshCSG3);
    } else
      aCSG = MeshCSG1.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(-2 * maxdis, 0, 0);
    boxmesh.position.set(0 - dx1 / 2, -dz / 2, 0);
    if (dx1 < maxwidth && phi > 0) {
      boxmesh.updateMatrix();
      MeshCSG3 = CSG.fromMesh(boxmesh);
      aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(0, 0, -phi);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(maxdis, 0, maxdis);
    boxmesh.position.set(0, -dz / 2, dy1 / 2);
    if (dy1 < maxwidth && alpha > 0) {
      boxmesh.updateMatrix();
      MeshCSG3 = CSG.fromMesh(boxmesh);
      aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(-alpha, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(0, 0, -2 * maxdis);
    boxmesh.position.set(0, -dz / 2, -dy1 / 2);
    if (dy1 < maxwidth && alpha > 0) {
      boxmesh.updateMatrix();
      MeshCSG3 = CSG.fromMesh(boxmesh);
      aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(alpha, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
    const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2 };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTrapeZoidGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'TrapeZoid';

    editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));
  }

  return container;

}

export { GeometryParametersPanel };
