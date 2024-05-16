import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';
import { PolyconeGeometry } from './libs/geometry/PolyconeGeometry.js';

import { UIDiv, UIPanel, UIRow } from "./libs/ui.js";

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import radiationsourceImg from '../images/basicmodels/radiationSource.jpg'

function BasicSources(editor) {
    const strings = editor.strings;
    const camera = editor.camera;

    const renderer = document.getElementById('viewport');

    const container = new UIPanel();
    // container.setId('Category');

    const options = new UIPanel();
    options.setClass('Category-widget');
    container.add(options);

    // Source model

    let item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);

        // Source model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);
   
    // Source model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);
   

    // Source model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);
   

    // Source model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);
   

    // Source model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);
   

    // Source model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);
   

    // Source model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();
        pointSource.name = 'RadiationSource';
		pointSource.source = 'Point';
        pointSource.planeshape = "Circle";
        pointSource.volumeshape = "Sphere";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";
        pointSource.halfX = 1;
        pointSource.halfY = 1;
        pointSource.halfZ = 1;
        pointSource.innerradius = 1;
        pointSource.outerradius = 1;

		editor.execute( new AddObjectCommand( editor, pointSource ) );

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

        const pointSource = new THREE.PerspectiveCamera();
		pointSource.name = 'PointSource';
		pointSource.type = "PointSource";
		pointSource.energysize = 1;
		pointSource.energyunit = "eV";
		pointSource.energykind = "B+";

        pointSource.position.copy(position);
		editor.execute( new AddObjectCommand( editor, pointSource ) );


    });

    options.add(item);
   


    return container;
}

export { BasicSources };