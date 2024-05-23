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

 const widthRow2 = new UIRow();
 const width2 = new UINumber(parameters.dx2).setRange(0, Infinity).onChange(update);

 widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx2')).setWidth('90px'));
 widthRow2.add(width2);

 widthRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(widthRow2);

 // depth1

 const depthRow1 = new UIRow();
 const depth1 = new UINumber(parameters.dy1).setRange(0, Infinity).onChange(update);

 depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy1')).setWidth('90px'));
 depthRow1.add(depth1);

 depthRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(depthRow1);

 // width3

 const widthRow3 = new UIRow();
 const width3 = new UINumber(parameters.dx3).setRange(0, Infinity).onChange(update);

 widthRow3.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx3')).setWidth('90px'));
 widthRow3.add(width3);

 widthRow3.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(widthRow3);

 // width4

 const widthRow4 = new UIRow();
 const width4 = new UINumber(parameters.dx4).setRange(0, Infinity).onChange(update);

 widthRow4.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx4')).setWidth('90px'));
 widthRow4.add(width4);

 widthRow4.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(widthRow4);



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



 // alpha

 const alphaRow = new UIRow();
 const alphaI = new UINumber(parameters.alpha).setRange(-90, 90).onChange(update);

 alphaRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/alpha')).setWidth('90px'));
 alphaRow.add(alphaI);
 alphaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

 container.add(alphaRow);

 // theta

 const thetaRow = new UIRow();
 const thetaI = new UINumber(parameters.theta).setRange(-90, 90).onChange(update);

 thetaRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/theta')).setWidth('90px'));
 thetaRow.add(thetaI);
 thetaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

 container.add(thetaRow);

 // phi

 const phiRow = new UIRow();
 const phiI = new UINumber(parameters.phi).setRange(-90, 90).onChange(update);

 phiRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/phi')).setWidth('90px'));
 phiRow.add(phiI);
 phiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

 container.add(phiRow);


 //

 function update() {

  // we need to new each geometry module

  const pDx1 = width1.getValue(), pDx2 = width2.getValue(), pDy1 = depth1.getValue(), 
  pDx3 = width3.getValue(), pDx4 = width4.getValue(), pDy2 = depth2.getValue(), 
  pDz = height.getValue(), pTheta = thetaI.getValue(), pPhi = phiI.getValue(), 
  pAlpha = alphaI.getValue();

  const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
  const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
  const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

  const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

  let MeshCSG1 = CSG.fromMesh(mesh);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  boxmesh.geometry.translate(2 * maxWidth, 0, 0);
  boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
  boxmesh.position.set(0 + dx / 2, 0, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  let aCSG = MeshCSG1.subtract(MeshCSG3);

  boxmesh.rotation.set(0, 0, 0);
  boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
  boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
  boxmesh.position.set(0 - dx / 2, 0, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  boxmesh.rotation.set(0, 0, 0);
  boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
  boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
  boxmesh.position.set(0, 0, dy );
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  boxmesh.rotation.set(0, 0, 0);
  boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
  boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
  boxmesh.position.set(0, 0, -dy);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);


  const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aTrapeZoidP';
  finalMesh.updateMatrix();
  finalMesh.name = 'aTrapeZoidP';

  finalMesh.geometry.name = object.geometry.name;
  
  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));
 }

 return container;

}

export { GeometryParametersPanel };
