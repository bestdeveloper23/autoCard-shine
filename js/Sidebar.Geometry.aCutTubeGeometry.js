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

 // LowVector3

 const pLowNormRow = new UIRow();
 pLowNormRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pLowNorm')).setWidth('90px'));
 const pLowNormX = new UINumber(parameters.pLowNorm.x).setPrecision( 3 ).setWidth( '50px' ).onChange(update);
 const pLowNormY = new UINumber(parameters.pLowNorm.y).setPrecision( 3 ).setWidth( '50px' ).onChange(update);
 const pLowNormZ = new UINumber(parameters.pLowNorm.z).setPrecision( 3 ).setWidth( '50px' ).onChange(update);

 pLowNormRow.add(pLowNormX);
 pLowNormRow.add(pLowNormY);
 pLowNormRow.add(pLowNormZ);

 container.add(pLowNormRow);

 // HightVector3

 const pHighNormRow = new UIRow();
 pHighNormRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pHighNorm')).setWidth('90px'));
 const pHighNormX = new UINumber(parameters.pHighNorm.x).setPrecision( 3 ).setWidth( '50px' ).onChange(update);
 const pHighNormY = new UINumber(parameters.pHighNorm.y).setPrecision( 3 ).setWidth( '50px' ).onChange(update);
 const pHighNormZ = new UINumber(parameters.pHighNorm.z).setPrecision( 3 ).setWidth( '50px' ).onChange(update);

 pHighNormRow.add(pHighNormX);
 pHighNormRow.add(pHighNormY);
 pHighNormRow.add(pHighNormZ);

 container.add(pHighNormRow);

 //

 function update() {

  // we need to new each geometry module

  var pRMax = maxRadius.getValue(), pRMin = minRadius.getValue(), pDz = height.getValue(), 
  pHighNorm = new THREE.Vector3(pHighNormX.getValue(), pHighNormY.getValue(), pHighNormZ.getValue()), 
  pLowNorm = new THREE.Vector3(pLowNormX.getValue(), pLowNormY.getValue(), pLowNormZ.getValue());

  function CutTube_vectorVal(vector) {
   if (CutTube_vectorVertical(vector)) {
    return true;
   } else if ((vector.x * vector.y) === 0 && (vector.x * vector.z) === 0 && (vector.y * vector.z) === 0) {
    return false;
   } else if (vector.y === 0) {
    return false;
   } else return true;
  }

  function CutTube_vectorVertical(vector) {
   if (vector.y !== 0 && vector.x === 0 && vector.z === 0) {
    return true;
   } else return false;
  }

  if (CutTube_vectorVal(pLowNorm) === false || CutTube_vectorVal(pHighNorm) === false) return;

  const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

  const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

  const boxgeometry = new THREE.BoxGeometry(2 * Math.sqrt(2) * pDz, 2 * Math.sqrt(2) * pDz, 2 * Math.sqrt(2) * pDz);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

  const boxgeometry2 = new THREE.BoxGeometry(2 * Math.sqrt(2) * pDz, 2 * Math.sqrt(2) * pDz, 2 * Math.sqrt(2) * pDz);
  const boxmesh2 = new THREE.Mesh(boxgeometry2, new THREE.MeshStandardMaterial());

  boxmesh.geometry.translate(0, Math.sqrt(2) * pDz, 0);
  const MeshCSG1 = CSG.fromMesh(cylindermesh1);
  const MeshCSG2 = CSG.fromMesh(cylindermesh2);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  let aCSG;
  aCSG = MeshCSG1.subtract(MeshCSG2);


  if (CutTube_vectorVertical(pHighNorm) === false) {

   let rotateX = Math.atan(pHighNorm.z / pHighNorm.y);
   let rotateY = Math.atan(pHighNorm.z / pHighNorm.x);
   let rotateZ = Math.atan(pHighNorm.x / pHighNorm.y);

   if (rotateX === Infinity) rotateX = boxmesh.rotation.x;
   if (rotateY === Infinity) rotateY = boxmesh.rotation.y;
   if (rotateZ === Infinity) rotateZ = boxmesh.rotation.z;

   boxmesh.rotation.set(-rotateX, -rotateY, -rotateZ);
  }

  boxmesh.position.set(0, pDz / 2, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);

  aCSG = aCSG.subtract(MeshCSG3);

  boxmesh2.geometry.translate(0, -Math.sqrt(2) * pDz, 0);
  if (!CutTube_vectorVertical(pLowNorm)) {

   let rotateX = Math.atan(pLowNorm.z / pLowNorm.y);
   let rotateY = Math.atan(pLowNorm.z / pLowNorm.x);
   let rotateZ = Math.atan(pLowNorm.x / pLowNorm.y);

   if (rotateX === Infinity) rotateX = boxmesh2.rotation.x;
   if (rotateY === Infinity) rotateY = boxmesh2.rotation.y;
   if (rotateZ === Infinity) rotateZ = boxmesh2.rotation.z;

   boxmesh2.rotation.set(-rotateX, -rotateY, -rotateZ);
  }

  boxmesh2.position.set(0, -pDz / 2, 0);
  boxmesh2.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh2);

  aCSG = aCSG.subtract(MeshCSG3);


  const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pHighNorm': pHighNorm, 'pLowNorm': pLowNorm };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aCutTubeGeometry';
  finalMesh.updateMatrix();

  // set Range 
  maxRadius.setRange(pRMin + 0.001, Infinity);
  minRadius.setRange(0.001, pRMax - 0.001);

  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
