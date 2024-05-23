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

 widthRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(widthRow1);

 // depth1

 const depthRow1 = new UIRow();
 const depth1 = new UINumber(parameters.dy1).setRange(0, Infinity).onChange(update);

 depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy1')).setWidth('90px'));
 depthRow1.add(depth1);

 depthRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(depthRow1);

 // width2

 const widthRow2 = new UIRow();
 const width2 = new UINumber(parameters.dx2).setRange(0, Infinity).onChange(update);

 widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx2')).setWidth('90px'));
 widthRow2.add(width2);

 widthRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(widthRow2);

 // depth2

 const depthRow2 = new UIRow();
 const depth2 = new UINumber(parameters.dy2).setRange(0, Infinity).onChange(update);

 depthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy2')).setWidth('90px'));
 depthRow2.add(depth2);

 depthRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(depthRow2);

 // height

 const heightRow = new UIRow();
 const height = new UINumber(parameters.dz).setRange(0, Infinity).onChange(update);

 heightRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dz')).setWidth('90px'));
 heightRow.add(height);

 heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
 
 container.add(heightRow);

 // twistedangle

 const twistedAngleRow = new UIRow();
 const angleI = new UINumber(parameters.twistedangle).setRange(0, Infinity).onChange(update);

 twistedAngleRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/twistedangle')).setWidth('90px'));
 twistedAngleRow.add(angleI);
 twistedAngleRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

 container.add(twistedAngleRow);


 //

 function update() {

  // we need to new each geometry module

  const dx1 = width1.getValue(), dy1 = depth1.getValue(), dz = height.getValue(), dx2 = width2.getValue(), dy2 = depth2.getValue(), twistedangle = angleI.getValue();
  if (dx1 * dy1 * dx2 * dy2 * dz === 0) {
   return;
  }
  const maxdis = Math.max(dx1, dy1, dx2, dy2, dz) * 2;
  const maxwidth = Math.max(dx1, dy1, dx2, dy2) * 2;
  const geometry = new THREE.BoxGeometry(maxwidth, dz * 2, maxwidth, 32, 32, 32);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

  const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

  let MeshCSG1 = CSG.fromMesh(mesh);
  let MeshCSG3;

  let alpha = Math.atan((dy1 - dy2) / 2 / dz);
  let phi = Math.atan((dx1 - dx2) / 2 / dz);

  let aCSG;

  boxmesh.geometry.translate(maxdis, maxdis, 0);
  boxmesh.position.set(0 + dx1, -dz, 0);
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
  boxmesh.position.set(0 - dx1, -dz, 0);
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
  boxmesh.position.set(0, -dz, dy1);
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
  boxmesh.position.set(0, -dz, -dy1);
  if (dy1 < maxwidth && alpha > 0) {
   boxmesh.updateMatrix();
   MeshCSG3 = CSG.fromMesh(boxmesh);
   aCSG = aCSG.subtract(MeshCSG3);
  }
  boxmesh.rotation.set(alpha, 0, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  
  const positionAttribute = finalMesh.geometry.getAttribute('position');

  let vec3 = new THREE.Vector3();
  let axis_vector = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i < positionAttribute.count; i++) {
   vec3.fromBufferAttribute(positionAttribute, i);
   vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
   finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
  }

 
  finalMesh.rotateX(Math.PI / 2);
  finalMesh.updateMatrix();

  aCSG = CSG.fromMesh(finalMesh);
  finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

  finalMesh.geometry.name = object.geometry.name;
  const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': twistedangle };
  finalMesh.geometry.parameters = param;

  finalMesh.geometry.type = 'aTwistedTrdGeometry';
  
  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));
 }

 return container;

}

export { GeometryParametersPanel };
