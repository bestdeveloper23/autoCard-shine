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

 item.setTextContent(strings.getKey('menubar/add/box'));
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


 // Cone model

 item = new UIDiv();
 item.setClass('Category-item');

 item.dom.style.backgroundImage = "url(../images/basicmodels/aTubs.jpg)";

 item.setTextContent(strings.getKey('menubar/add/box'));
 item.dom.setAttribute('draggable', true);
 item.dom.setAttribute('item-type', 'eTub');
 item.onClick(function () {

  // we need to new each geometry module

  var pRMin = 1, pRMax = 1.5, pDz = 2;

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
  aCSG = aCSG.subtract(MeshCSG3);
  boxmesh.rotateY(Math.PI / 2);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);
  boxmesh.rotateY(Math.PI);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { x: 1, y: 2, z: 1 };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.center();
  finalMesh.updateMatrix()
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

  var pRMin = 1, pRMax = 1.5, pDz = 2;

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
  aCSG = aCSG.subtract(MeshCSG3);
  boxmesh.rotateY(Math.PI / 2);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);
  boxmesh.rotateY(Math.PI);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { x: 1, y: 2, z: 1 };
  finalMesh.geometry.parameters = param;
  finalMesh.position.copy(position);
  finalMesh.geometry.center();
  finalMesh.updateMatrix()
  finalMesh.name = 'Tubs';

  editor.execute(new AddObjectCommand(editor, finalMesh));

 });

 options.add(item);




 return container;
}

export { ModelCategory };