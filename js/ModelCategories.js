import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIPanel, UIRow } from "./libs/ui.js";

import { AddObjectCommand } from './commands/AddObjectCommand.js';

function ModelCategory(editor) {
 const strings = editor.strings;
 const camera = editor.camera;

 const renderer = document.getElementById('viewport');

 const container = new UIPanel();
 container.setId('Category');

 const options = new UIPanel();
 options.setClass('Category-widget');
 container.add(options);

 let item = new UIDiv();
 item.setClass('Category-item');

 // Box model

 item.dom.style.backgroundImage = "url(../images/basicmodels/aBox.jpg)";

 item.setTextContent(strings.getKey('menubar/add/box'));
 item.dom.setAttribute('draggable', true);
 item.dom.setAttribute('item-type', 'Box');
 item.onClick(function () {

  const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

  mesh.name = 'Box';

  editor.execute(new AddObjectCommand(editor, mesh));

 });

 item.dom.addEventListener('dragend', function (event) {

  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // Convert the mouse position to scene coordinates
  var rect = renderer.getBoundingClientRect();
  var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
  var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

  // Update the cube's position based on the mouse position
  var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

  mouseScenePosition.unproject(camera);
  var direction = mouseScenePosition.sub(camera.position).normalize();
  var distance = -camera.position.y / direction.y;
  var position = camera.position.clone().add(direction.multiplyScalar(distance));

  const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  mesh.position.copy(position);
  mesh.name = 'Box';

  editor.execute(new AddObjectCommand(editor, mesh));

 });

 options.add(item);


 // Sphere model

 item = new UIDiv();
 item.setClass('Category-item');

 item.dom.style.backgroundImage = "url(../images/basicmodels/aOrb.jpg)";

 item.setTextContent(strings.getKey('menubar/add/sphere'));
 item.dom.setAttribute('draggable', true);
 item.dom.setAttribute('item-type', 'Sphere');
 item.onClick(function () {

  const geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
  mesh.name = 'Sphere';

  editor.execute(new AddObjectCommand(editor, mesh));

 });

 item.dom.addEventListener('dragend', function (event) {

  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // Convert the mouse position to scene coordinates
  var rect = renderer.getBoundingClientRect();
  var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
  var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

  // Update the cube's position based on the mouse position
  var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

  mouseScenePosition.unproject(camera);
  var direction = mouseScenePosition.sub(camera.position).normalize();
  var distance = -camera.position.y / direction.y;
  var position = camera.position.clone().add(direction.multiplyScalar(distance));

  const geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

  mesh.position.copy(position);
  mesh.name = 'Sphere';

  editor.execute(new AddObjectCommand(editor, mesh));

 });

 options.add(item);


 // Tube model

 item = new UIDiv();
 item.setClass('Category-item');

 item.dom.style.backgroundImage = "url(../images/basicmodels/aTubs.jpg)";

 item.setTextContent(strings.getKey('menubar/add/g4tube'));
 item.dom.setAttribute('draggable', true);
 item.dom.setAttribute('item-type', 'eTub');
 item.onClick(function () {

  // we need to new each geometry module

  var pRMin = 1, pRMax = 1.5, pDz = 2, SPhi = 0, DPhi = 90;

  const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

  const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

  const boxgeometry = new THREE.BoxGeometry(pRMax, pDz, pRMax);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

  boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
  const MeshCSG1 = CSG.fromMesh(cylindermesh1);
  const MeshCSG2 = CSG.fromMesh(cylindermesh2);
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

  editor.execute(new AddObjectCommand(editor, finalMesh));

 });

 item.dom.addEventListener('dragend', function (event) {

  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // Convert the mouse position to scene coordinates
  var rect = renderer.getBoundingClientRect();
  var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
  var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

  // Update the cube's position based on the mouse position
  var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

  mouseScenePosition.unproject(camera);
  var direction = mouseScenePosition.sub(camera.position).normalize();
  var distance = -camera.position.y / direction.y;
  var position = camera.position.clone().add(direction.multiplyScalar(distance));

  var pRMin = 1, pRMax = 1.5, pDz = 2, SPhi = 0, DPhi = 90;

  const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

  const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

  const boxgeometry = new THREE.BoxGeometry(pRMax, pDz, pRMax);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());
  boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
  const MeshCSG1 = CSG.fromMesh(cylindermesh1);
  const MeshCSG2 = CSG.fromMesh(cylindermesh2);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  let aCSG;
  aCSG = MeshCSG1.subtract(MeshCSG2);

  let bCSG;
  bCSG = MeshCSG1.subtract(MeshCSG2);

  if (DPhi > 270) {
   let v_DPhi = 360 - DPhi;

   boxmesh.rotateY((SPhi + 90) / 180 * Math.PI * (-1));
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
  finalMesh.position.copy(position);
  finalMesh.updateMatrix();
  finalMesh.name = 'Tubs';

  editor.execute(new AddObjectCommand(editor, finalMesh));

 });

 options.add(item);



 // CutTube model

 item = new UIDiv();
 item.setClass('Category-item');

 item.dom.style.backgroundImage = "url(../images/basicmodels/aCutTube.jpg)";

 item.setTextContent(strings.getKey('menubar/add/g4cuttube'));
 item.dom.setAttribute('draggable', true);
 item.dom.setAttribute('item-type', 'cutTub');
 item.onClick(function () {

  // we need to new each geometry module

  var pRMin = 1, pRMax = 1.5, pDz = 4, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);

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
  finalMesh.name = 'Tubs';

  console.log(finalMesh)
  editor.execute(new AddObjectCommand(editor, finalMesh));

 });

 item.dom.addEventListener('dragend', function (event) {

  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // Convert the mouse position to scene coordinates
  var rect = renderer.getBoundingClientRect();
  var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
  var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

  // Update the cube's position based on the mouse position
  var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

  mouseScenePosition.unproject(camera);
  var direction = mouseScenePosition.sub(camera.position).normalize();
  var distance = -camera.position.y / direction.y;
  var position = camera.position.clone().add(direction.multiplyScalar(distance));

  var pRMin = 1, pRMax = 1.5, pDz = 4, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);

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
  finalMesh.position.copy(position);
  finalMesh.updateMatrix();
  finalMesh.name = 'Tubs';
  editor.execute(new AddObjectCommand(editor, finalMesh));

 });

 options.add(item);


 // Cone model

 item = new UIDiv();
 item.setClass('Category-item');

 item.dom.style.backgroundImage = "url(../images/basicmodels/aCons.jpg)";

 item.setTextContent(strings.getKey('menubar/add/g4cone'));
 item.dom.setAttribute('draggable', true);
 item.dom.setAttribute('item-type', 'Cons');
 item.onClick(function () {

  // we need to new each geometry module

  var pRmin1 = 0.5, pRmax1 = 1, pRmin2 = 2, pRmax2 = 2.5, pDz = 4, SPhi = 0, DPhi = 270

  const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

  const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

  const maxRadius = Math.max(pRmax1, pRmax2);
  console.log(maxRadius)
  const boxgeometry = new THREE.BoxGeometry(maxRadius, pDz, maxRadius);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

  boxmesh.geometry.translate(maxRadius / 2, 0, maxRadius / 2);
  const MeshCSG1 = CSG.fromMesh(cylindermesh1);
  const MeshCSG2 = CSG.fromMesh(cylindermesh2);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  let aCSG;

  aCSG = MeshCSG2.subtract(MeshCSG1);

  let bCSG;

  bCSG = MeshCSG2.subtract(MeshCSG1);


  if (DPhi > 270) {
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
  const param = { 'pRMax1': pRmax1, 'pRMin1': pRmin1, 'pRMax2': pRmax2, 'pRMin2': pRmin2, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aConeGeometry';
  finalMesh.updateMatrix();
  finalMesh.name = 'Tubs';

  editor.execute(new AddObjectCommand(editor, finalMesh));

 });

 item.dom.addEventListener('dragend', function (event) {

  var mouseX = event.clientX;
  var mouseY = event.clientY;

  // Convert the mouse position to scene coordinates
  var rect = renderer.getBoundingClientRect();
  var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
  var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

  // Update the cube's position based on the mouse position
  var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

  mouseScenePosition.unproject(camera);
  var direction = mouseScenePosition.sub(camera.position).normalize();
  var distance = -camera.position.y / direction.y;
  var position = camera.position.clone().add(direction.multiplyScalar(distance));

  var pRmin1 = 0.5, pRmax1 = 1, pRmin2 = 2, pRmax2 = 2.5, pDz = 4, SPhi = 0, DPhi = 270

  const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

  const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz, 32, 1, false, 0, Math.PI * 2);
  const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

  const maxRadius = Math.max(pRmax1, pRmax2);
  const boxgeometry = new THREE.BoxGeometry(maxRadius, pDz, maxRadius);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

  boxmesh.geometry.translate(maxRadius / 2, 0, maxRadius / 2);
  const MeshCSG1 = CSG.fromMesh(cylindermesh1);
  const MeshCSG2 = CSG.fromMesh(cylindermesh2);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  let aCSG;

  aCSG = MeshCSG2.subtract(MeshCSG1);


  let bCSG;

  bCSG = MeshCSG2.subtract(MeshCSG1);


  if (DPhi > 270) {
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
  const param = { 'pRMax1': pRmax1, 'pRMin1': pRmin1, 'pRMax2': pRmax2, 'pRMin2': pRmin2, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aConeGeometry';
  finalMesh.position.copy(position);
  finalMesh.updateMatrix();
  finalMesh.name = 'Cone';

  editor.execute(new AddObjectCommand(editor, finalMesh));

 });

 options.add(item);

 return container;
}

export { ModelCategory };