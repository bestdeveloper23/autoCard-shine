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

    item.setTextContent(strings.getKey('menubar/add/source/point'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Point';
        // source.planeshape = "Circle";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        // source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Point';
        // source.planeshape = "Circle";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        // source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);
   
    
    // Circle Source

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/planeCircle'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'CircleSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.CylinderGeometry(1, 1, 0.01, 32, 32, false, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
        source.source = 'Plane';
        source.planeshape = "Circle";
        // source.volumeshape = "Sphere";
        source.energysize = 1;
        source.energyunit = "keV";
        source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.CylinderGeometry(1, 1, 0.01, 32, 32, false, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
        source.source = 'Plane';
        source.planeshape = "Circle";
        // source.volumeshape = "Sphere";
        source.energysize = 1;
        source.energyunit = "keV";
        source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
        editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);

    
        // Annulus model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/planeAnnulus'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'AnnulusSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.CylinderGeometry(1, 1, 0.01, 32, 32, false, 0, Math.PI * 2);
        const secondModelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.01, 32, 32, false, 0, Math.PI * 2);

        const sourceModelMaterial = new THREE.MeshStandardMaterial();
        const secondModelMaterial = new THREE.MeshStandardMaterial();

        const firstModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);
        const secondModel = new THREE.Mesh(secondModelGeometry, secondModelMaterial);

        let CSGMesh1 = CSG.fromMesh(firstModel);
        let secondMesh = CSG.fromMesh(secondModel);

        CSGMesh1 = CSGMesh1.subtract(secondMesh);

        const sourceModel = CSG.toMesh(CSGMesh1, new THREE.Matrix4());

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Annulus";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.CylinderGeometry(1, 1, 0.01, 32, 32, false, 0, Math.PI * 2);
        const secondModelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.01, 32, 32, false, 0, Math.PI * 2);

        const sourceModelMaterial = new THREE.MeshStandardMaterial();
        const secondModelMaterial = new THREE.MeshStandardMaterial();

        const firstModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);
        const secondModel = new THREE.Mesh(secondModelGeometry, secondModelMaterial);

        let CSGMesh1 = CSG.fromMesh(firstModel);
        let secondMesh = CSG.fromMesh(secondModel);

        CSGMesh1 = CSGMesh1.subtract(secondMesh);

        const sourceModel = CSG.toMesh(CSGMesh1, new THREE.Matrix4());
        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Annulus";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Elipse model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/planeElipse'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'ElipseSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Elipse";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Elipse";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Square model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/planeSquare'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'SqureSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Square";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        // source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Square";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        // source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);

    // Rectangle model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/planeRectangle'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'RectangleSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Rectangle";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        // source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Rectangle";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        // source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Beam model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/beam'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'BeamSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Beam';
        // source.planeshape = "Cylinder";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Beam';
        // source.planeshape = "Cylinder";
        // source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Surface Sphere model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/surfaceSphere'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'SSPhereSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Sphere";
        source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Sphere";
        source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Surface Ellipsoid model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/surfaceElipsoid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'SElipsoidSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Square";
        source.volumeshape = "Ellipsoid";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Square";
        source.volumeshape = "Ellipsoid";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Surface Cylinder model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/surfaceCylinder'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'SCylinderSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Square";
        source.volumeshape = "Cylinder";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Square";
        source.volumeshape = "Cylinder";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Surface Para model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/surfacePara'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'SParaSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Square";
        source.volumeshape = "Para";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Surface';
        // source.planeshape = "Square";
        source.volumeshape = "Para";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Volume Sphere model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumeSphere'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VSphereSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        // source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
        // source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    // Volume Ellipsoid model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumeElipsoid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VElipsoid');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Ellipsoid";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Ellipsoid";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);

// Volume Cylinder model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumeCylinder'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VCylinder');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Cylinder";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Cylinder";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);

// Volume Para model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${radiationsourceImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumePara'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VPara');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Para";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

		editor.execute( new AddObjectCommand( editor, source ) );

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

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshStandardMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        // source.planeshape = "Square";
        source.volumeshape = "Para";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 1;
        source.innerradius = 1;
        source.outerradius = 1;

        source.children.forEach(child => {
            child.matrixAutoUpdate = false;
            child.userData.draggable = false;

        });

        source.add(pointSource, sourceModel);

        source.position.copy(position);
		editor.execute( new AddObjectCommand( editor, source ) );


    });

    options.add(item);


    return container;
}

export { BasicSources };