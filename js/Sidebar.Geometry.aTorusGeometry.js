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

 maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/maxradius')).setWidth('90px'));
 maxRadiusRow.add(maxRadius);

 maxRadiusRow.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

 container.add(maxRadiusRow);

 // minRadius

 const minRadiusRow = new UIRow();
 const minRadius = new UINumber(parameters.pRMin).setRange(0, parameters.pRMax - 0.001).onChange(update);

 minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/minradius')).setWidth('90px'));
 minRadiusRow.add(minRadius);

 minRadiusRow.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

 container.add(minRadiusRow);

 // torRadius

 const torRadiusRow = new UIRow();
 const torRadius = new UINumber(parameters.pRTor).setRange(0.001, Infinity).onChange(update);

 torRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/torusradius')).setWidth('90px'));
 torRadiusRow.add(torRadius);

 torRadiusRow.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));
 
 container.add(torRadiusRow);

 // sphi

 const pSPhiRow = new UIRow();
 const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
 pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/pSPhi')).setWidth('90px'));
 pSPhiRow.add(pSPhi);

 container.add(pSPhiRow);

 // dphi

 const pDPhiRow = new UIRow();
 const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(update);
 pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/pDPhi')).setWidth('90px'));
 pDPhiRow.add(pDPhi);

 container.add(pDPhiRow);

 //

 function update() {

  // we need to new each geometry module

  const pRMax = maxRadius.getValue(), pRMin = minRadius.getValue(), pRtor = torRadius.getValue(), SPhi = pSPhi.getValue(), DPhi = pDPhi.getValue();

  const torgeometry1 = new THREE.TorusGeometry(pRtor, pRMax, 16, 16);
  const tormesh1 = new THREE.Mesh(torgeometry1, new THREE.MeshStandardMaterial());
  tormesh1.rotateX(Math.PI / 2);
  tormesh1.updateMatrix();

  const torgeometry2 = new THREE.TorusGeometry(pRtor, pRMin, 16, 16);
  const tormesh2 = new THREE.Mesh(torgeometry2, new THREE.MeshStandardMaterial());
  tormesh2.rotateX(Math.PI / 2);
  tormesh2.updateMatrix();

  const boxgeometry = new THREE.BoxGeometry(pRtor + pRMax, pRtor + pRMax, pRtor + pRMax);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

  boxmesh.geometry.translate((pRtor + pRMax) / 2, 0, (pRtor + pRMax) / 2);
  const MeshCSG1 = CSG.fromMesh(tormesh1);
  const MeshCSG2 = CSG.fromMesh(tormesh2);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  let aCSG;
        
  let bCSG;

  if(pRMin !== 0) {
      aCSG = MeshCSG1.subtract(MeshCSG2);
      bCSG = MeshCSG1.subtract(MeshCSG2);
  } else {
      aCSG = MeshCSG1;
      bCSG = MeshCSG1;
  }

  if (DPhi > 270 && DPhi < 360) {
   let v_DPhi = 360 - DPhi;

   boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
   boxmesh.updateMatrix();
   MeshCSG3 = CSG.fromMesh(boxmesh);
   bCSG = bCSG.subtract(MeshCSG3);

   let repeatCount = Math.floor((270 - v_DPhi) / 90);

   for (let i = 0; i < repeatCount; i++) {
    let rotateVaule = Math.PI / 2;
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

  } else if(DPhi <= 270){

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
  const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pRTor': pRtor, 'pSPhi': SPhi, 'pDPhi': DPhi };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aTorusGeometry';
  finalMesh.updateMatrix();
  finalMesh.name = 'aTorus';

  // set Range 
  maxRadius.setRange(pRMin + 0.001, pRtor - 0.001);
  minRadius.setRange(0, pRMax - 0.001);
  torRadius.setRange(pRMax + 0.001, Infinity);
  
  finalMesh.geometry.name = object.geometry.name;
  
  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
