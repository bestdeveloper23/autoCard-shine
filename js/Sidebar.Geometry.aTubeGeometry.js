import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

 const strings = editor.strings;

 const container = new UIDiv();

 const geometry = object.geometry;
 const parameters = geometry.parameters;

 // maxRadius

 const maxRadiusRow = new UIRow();
 const maxRadius = new UINumber(parameters.pRMax).setRange(parameters.pRMin + 0.001, Infinity).onChange(update);

 maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/maxradius')).setWidth('90px'));
 maxRadiusRow.add(maxRadius);

 container.add(maxRadiusRow);

 // minRadius

 const minRadiusRow = new UIRow();
 const minRadius = new UINumber(parameters.pRMin).setRange(0, parameters.pRMax - 0.001).onChange(update);

 minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/minradius')).setWidth('90px'));
 minRadiusRow.add(minRadius);

 container.add(minRadiusRow);

 // height

 const heightRow = new UIRow();
 const height = new UINumber(parameters.pDz).setRange(0.001, Infinity).onChange(update);

 heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'));
 heightRow.add(height);

 container.add(heightRow);

 // height

 const pSPhiRow = new UIRow();
 const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
 pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
 pSPhiRow.add(pSPhi);

 container.add(pSPhiRow);

 // height

 const pDPhiRow = new UIRow();
 const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 359.99).onChange(update);
 pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
 pDPhiRow.add(pDPhi);

 container.add(pDPhiRow);

 //

 function update() {

  // we need to new each geometry module

  var pRMax = maxRadius.getValue(), pRMin = minRadius.getValue(), pDz = height.getValue(), SPhi = pSPhi.getValue(), DPhi = pDPhi.getValue();

  const spheregeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 1, false, 0, Math.PI * 2);
  const spheremesh1 = new THREE.Mesh(spheregeometry1, new THREE.MeshStandardMaterial());

  const spheregeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 1, false, 0, Math.PI * 2);
  const spheremesh2 = new THREE.Mesh(spheregeometry2, new THREE.MeshStandardMaterial());

  const boxgeometry = new THREE.BoxGeometry(pRMax, pDz, pRMax);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());
  boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
  const MeshCSG1 = CSG.fromMesh(spheremesh1);
  const MeshCSG2 = CSG.fromMesh(spheremesh2);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  let aCSG;
  aCSG = MeshCSG1.subtract(MeshCSG2);

  let bCSG;
  bCSG = MeshCSG1.subtract(MeshCSG2);

  if (DPhi > 270) {
   let v_DPhi = 360 - DPhi;

   boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
   boxmesh.updateMatrix();
   MeshCSG3 = CSG.fromMesh(boxmesh);
   bCSG = bCSG.subtract(MeshCSG3);

   let repeatCount = Math.floor((270 - v_DPhi) / 90);

   for (let i = 0; i < repeatCount; i++) {
    let rotateVaule = Math.PI / (2);
    boxmesh.rotateY(rotateVaule);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    bCSG = bCSG.subtract(MeshCSG3);
   }
   let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
   boxmesh.rotateY(rotateVaule);
   boxmesh.updateMatrix();
   MeshCSG3 = CSG.fromMesh(boxmesh);
   bCSG = bCSG.subtract(MeshCSG3);
   aCSG = aCSG.subtract(bCSG);

  } else {

   boxmesh.rotateY(SPhi / 180 * Math.PI);
   boxmesh.updateMatrix();
   MeshCSG3 = CSG.fromMesh(boxmesh);
   aCSG = aCSG.subtract(MeshCSG3);

   let repeatCount = Math.floor((270 - DPhi) / 90);

   for (let i = 0; i < repeatCount; i++) {
    let rotateVaule = Math.PI / (-2);
    boxmesh.rotateY(rotateVaule);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);
   }
   let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
   boxmesh.rotateY(rotateVaule);
   boxmesh.updateMatrix();
   MeshCSG3 = CSG.fromMesh(boxmesh);
   aCSG = aCSG.subtract(MeshCSG3);

  }

  const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aTubeGeometry';
  finalMesh.updateMatrix();
  finalMesh.name = 'Tubs';

  // set Range 
  maxRadius.setRange(pRMin + 0.001, Infinity);
  minRadius.setRange(0.001, pRMax - 0.001);

  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
