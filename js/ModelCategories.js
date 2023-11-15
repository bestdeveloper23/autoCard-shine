import * as THREE from 'three';

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


 // Cone model

 item = new UIDiv();
 item.setClass('Category-item');

 item.dom.style.backgroundImage = "url(../images/basicmodels/aTubs.jpg)";

 item.setTextContent(strings.getKey('menubar/add/box'));
 item.dom.setAttribute('draggable', true);
 item.dom.setAttribute('item-type', 'Cone');
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

  const geometry = new THREE.CylinderGeometry( 0.5, 0.5, 1, 32, 1, false, 0, Math.PI * 2 );
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

  mesh.position.copy(position);
  mesh.name = 'Tubs';

  editor.execute(new AddObjectCommand(editor, mesh));

 });

 options.add(item);

 

 return container;
}

export { ModelCategory };