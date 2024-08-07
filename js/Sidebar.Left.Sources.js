import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIPanel} from "./libs/ui.js";
import { AddObjectCommand } from './commands/AddObjectCommand.js';
import radiationsourceImg from '../images/basicmodels/radiationSource.jpg';
import pointImg from '../images/sources/point.png';
import squareImg from '../images/sources/square.png';
import circleImg from '../images/sources/circle.png';
import annulusImg from '../images/sources/annulus.png';
import rectangleImg from '../images/sources/rectangle.png';
import ellipseImg from '../images/sources/ellipse.png';
import sphereImg from '../images/sources/sphere.png';
import cylinderImg from '../images/sources/cylinder.png';
import ellipsoidImg from '../images/sources/ellipsoid.png';
import paraImg from '../images/sources/para.png';

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

    item.dom.style.backgroundImage = `url(${pointImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/point'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'PointSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(0.01, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Point';
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";

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
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Point';
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";

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

    item.dom.style.backgroundImage = `url(${circleImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/circle'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'CircleSource');
    item.onClick(function () {
        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.CylinderGeometry(10, 10, 0.01, 32, 32, false, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
        source.source = 'Plane';
        source.planeshape = "Circle";
        source.energysize = 1;
        source.energyunit = "keV";
        source.energykind = "B+";
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

        const sourceModelGeometry = new THREE.CylinderGeometry(10, 10, 0.01, 32, 32, false, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
        source.source = 'Plane';
        source.planeshape = "Circle";
        source.energysize = 1;
        source.energyunit = "keV";
        source.energykind = "B+";
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

    item.dom.style.backgroundImage = `url(${annulusImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/annulus'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'AnnulusSource');
    item.onClick(function () {
        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.CylinderGeometry(10, 10, 0.01, 32, 32, false, 0, Math.PI * 2);
        const secondModelGeometry = new THREE.CylinderGeometry(8, 8, 0.01, 32, 32, false, 0, Math.PI * 2);

        const sourceModelMaterial = new THREE.MeshBasicMaterial();
        const secondModelMaterial = new THREE.MeshBasicMaterial();

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
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.innerradius = 0.8;
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

        const sourceModelGeometry = new THREE.CylinderGeometry(10, 10, 0.01, 32, 32, false, 0, Math.PI * 2);
        const secondModelGeometry = new THREE.CylinderGeometry(8, 8, 0.01, 32, 32, false, 0, Math.PI * 2);

        const sourceModelMaterial = new THREE.MeshBasicMaterial();
        const secondModelMaterial = new THREE.MeshBasicMaterial();

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
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.innerradius = 0.8;
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

    // Ellipse model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${ellipseImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/ellipse'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'EllipseSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        var xSemiAxis = 1, semiAxisY = 0.6, Dz = 0.01;

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz, 32, 1, false, 0, Math.PI * 2);
        const sourceModel = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
        const ratioZ = semiAxisY / xSemiAxis;
        sourceModel.scale.z = ratioZ;
        sourceModel.updateMatrix();

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Ellipse";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 0.6;

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

        var xSemiAxis = 1, semiAxisY = 0.6, Dz = 0.01;

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz, 32, 1, false, 0, Math.PI * 2);
        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
        const ratioZ = semiAxisY / xSemiAxis;
        cylindermesh.scale.z = ratioZ;
        cylindermesh.updateMatrix();
        const aCSG = CSG.fromMesh(cylindermesh);
		const sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Ellipse";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 0.6;

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

    item.dom.style.backgroundImage = `url(${squareImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/square'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'SqureSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.BoxGeometry(10, 10, 0.01)
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Square";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;
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

        const sourceModelGeometry = new THREE.BoxGeometry(10, 10, 0.01)
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Square";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        // source.halfY = 1;
        // source.halfZ = 1;

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

    item.dom.style.backgroundImage = `url(${rectangleImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/rectangle'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'RectangleSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.BoxGeometry(10, 15, 0.01, 1, 1, 1)
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

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
        source.halfY = 1.5;
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

        const sourceModelGeometry = new THREE.BoxGeometry(10, 15, 0.01, 1, 1, 1)
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Plane';
        source.planeshape = "Rectangle";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1.5;

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

        const sourceModelGeometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Beam';
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

        const sourceModelGeometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Beam';
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


    // // Surface Sphere model

    // item = new UIDiv();

    // item.setClass('Category-item');

    // item.dom.style.backgroundImage = `url(${sphereImg})`;

    // item.setTextContent(strings.getKey('menubar/add/source/surfaceSphere'));
    // item.dom.setAttribute('draggable', true);
    // item.dom.setAttribute('item-type', 'SSPhereSource');
    // item.onClick(function () {

    //     const pointSource = new THREE.PerspectiveCamera();

    //     const sourceModelGeometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
    //     const sourceModelMaterial = new THREE.MeshBasicMaterial();

    //     const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     // source.planeshape = "Sphere";
    //     source.volumeshape = "Sphere";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     // source.halfX = 1;
    //     // source.halfY = 1;
    //     // source.halfZ = 1;
    //     // source.innerradius = 1;
    //     source.outerradius = 1;

    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;

    //     });

    //     source.add(pointSource, sourceModel);

	// 	editor.execute( new AddObjectCommand( editor, source ) );

    // });

    // item.dom.addEventListener('dragend', function (event) {

    //     var mouseX = event.clientX;
    //     var mouseY = event.clientY;

    //     // Convert the mouse position to scene coordinates
    //     var rect = renderer.getBoundingClientRect();
    //     var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
    //     var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

    //     // Update the cube's position based on the mouse position
    //     var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

    //     mouseScenePosition.unproject(camera);
    //     var direction = mouseScenePosition.sub(camera.position).normalize();
    //     var distance = -camera.position.y / direction.y;
    //     var position = camera.position.clone().add(direction.multiplyScalar(distance));

    //     const pointSource = new THREE.PerspectiveCamera();

    //     const sourceModelGeometry = new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
    //     const sourceModelMaterial = new THREE.MeshBasicMaterial();

    //     const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     source.volumeshape = "Sphere";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     source.outerradius = 1;

    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;
    //     });

    //     source.add(pointSource, sourceModel);

    //     source.position.copy(position);
	// 	editor.execute( new AddObjectCommand( editor, source ) );
    // });

    // options.add(item);


    // // Surface Ellipsoid model

    // item = new UIDiv();

    // item.setClass('Category-item');

    // item.dom.style.backgroundImage = `url(${ellipsoidImg})`;

    // item.setTextContent(strings.getKey('menubar/add/source/surfaceEllipsoid'));
    // item.dom.setAttribute('draggable', true);
    // item.dom.setAttribute('item-type', 'SEllipsoidSource');
    // item.onClick(function () {

    //     const pointSource = new THREE.PerspectiveCamera();

    //     const xSemiAxis = 1, semiAxisY = 0.5, Dz = 1;

    //     const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz, 32, 1, false, 0, Math.PI * 2);
    //     let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
    //     const ratioZ = semiAxisY / xSemiAxis;
    //     cylindermesh.scale.z = ratioZ;
    //     cylindermesh.updateMatrix();
    //     const aCSG = CSG.fromMesh(cylindermesh);
    //     const sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     source.volumeshape = "Ellipsoid";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     source.halfX = 1;
    //     source.halfY = 0.5;
    //     source.halfZ = 1;

    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;
    //     });

    //     source.add(pointSource, sourceModel);

	// 	editor.execute( new AddObjectCommand( editor, source ) );
    // });

    // item.dom.addEventListener('dragend', function (event) {

    //     var mouseX = event.clientX;
    //     var mouseY = event.clientY;

    //     // Convert the mouse position to scene coordinates
    //     var rect = renderer.getBoundingClientRect();
    //     var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
    //     var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

    //     // Update the cube's position based on the mouse position
    //     var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

    //     mouseScenePosition.unproject(camera);
    //     var direction = mouseScenePosition.sub(camera.position).normalize();
    //     var distance = -camera.position.y / direction.y;
    //     var position = camera.position.clone().add(direction.multiplyScalar(distance));

    //     const pointSource = new THREE.PerspectiveCamera();

    //     const xSemiAxis = 1, semiAxisY = 0.5, Dz = 1;

    //     const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz*2, 32, 1, false, 0, Math.PI * 2);
    //     let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
    //     const ratioZ = semiAxisY / xSemiAxis;
    //     cylindermesh.scale.z = ratioZ;
    //     cylindermesh.updateMatrix();
    //     const aCSG = CSG.fromMesh(cylindermesh);
    //     const sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     source.volumeshape = "Ellipsoid";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     source.halfX = 1;
    //     source.halfY = 0.5;
    //     source.halfZ = 1;
    //     // source.innerradius = 1;
    //     // source.outerradius = 1;

    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;
    //     });

    //     source.add(pointSource, sourceModel);

    //     source.position.copy(position);
	// 	editor.execute( new AddObjectCommand( editor, source ) );
    // });

    // options.add(item);


    // // Surface Cylinder model

    // item = new UIDiv();

    // item.setClass('Category-item');

    // item.dom.style.backgroundImage = `url(${cylinderImg})`;

    // item.setTextContent(strings.getKey('menubar/add/source/surfaceCylinder'));
    // item.dom.setAttribute('draggable', true);
    // item.dom.setAttribute('item-type', 'SCylinderSource');
    // item.onClick(function () {

    //     const pointSource = new THREE.PerspectiveCamera();

    //     const sourceModelGeometry = new THREE.CylinderGeometry(1, 1, 2, 32, 32, false, 0, Math.PI * 2);
    //     const sourceModelMaterial = new THREE.MeshBasicMaterial();

    //     const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     // source.planeshape = "Square";
    //     source.volumeshape = "Cylinder";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     // source.halfX = 1;
    //     // source.halfY = 1;
    //     source.halfZ = 1;
    //     // source.innerradius = 1;
    //     source.outerradius = 1;

    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;
    //     });

    //     source.add(pointSource, sourceModel);

	// 	editor.execute( new AddObjectCommand( editor, source ) );
    // });

    // item.dom.addEventListener('dragend', function (event) {

    //     var mouseX = event.clientX;
    //     var mouseY = event.clientY;

    //     // Convert the mouse position to scene coordinates
    //     var rect = renderer.getBoundingClientRect();
    //     var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
    //     var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

    //     // Update the cube's position based on the mouse position
    //     var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

    //     mouseScenePosition.unproject(camera);
    //     var direction = mouseScenePosition.sub(camera.position).normalize();
    //     var distance = -camera.position.y / direction.y;
    //     var position = camera.position.clone().add(direction.multiplyScalar(distance));

    //     const pointSource = new THREE.PerspectiveCamera();

    //     const sourceModelGeometry = new THREE.CylinderGeometry(1, 1, 2, 32, 32, false, 0, Math.PI * 2);
    //     const sourceModelMaterial = new THREE.MeshBasicMaterial();

    //     const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     source.volumeshape = "Cylinder";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     source.halfZ = 1;
    //     source.outerradius = 1;

    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;
    //     });

    //     source.add(pointSource, sourceModel);

    //     source.position.copy(position);
	// 	editor.execute( new AddObjectCommand( editor, source ) );
    // });

    // options.add(item);


    // // Surface Para model

    // item = new UIDiv();

    // item.setClass('Category-item');

    // item.dom.style.backgroundImage = `url(${paraImg})`;

    // item.setTextContent(strings.getKey('menubar/add/source/surfacePara'));
    // item.dom.setAttribute('draggable', true);
    // item.dom.setAttribute('item-type', 'SParaSource');
    // item.onClick(function () {

    //     const pointSource = new THREE.PerspectiveCamera();

                    
    //     const dx = 1, dy = 1, dz = 2, alpha = -10, theta = 10, phi = -10;
    //     const maxRadius = Math.max(dx, dy, dz) * 2;
    //     const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
    //     const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    //     const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
    //     const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

    //     let MeshCSG1 = CSG.fromMesh(mesh);
    //     let MeshCSG3 = CSG.fromMesh(boxmesh);

    //     boxmesh.geometry.translate(2 * maxRadius, 0, 0);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0 + dx, 0, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     let aCSG = MeshCSG1.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0 - dx, 0, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0, 0, dz);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(0, 0, -4 * maxRadius);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0, 0, -dz);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
    //     boxmesh.position.set(0, dy, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.geometry.translate(0, -4 * maxRadius, 0);
    //     boxmesh.position.set(0, - dy, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
    //     // sourceModel.rotateX(Math.PI / 2);
    //     // sourceModel.updateMatrix();
    //     // aCSG = CSG.fromMesh(sourceModel);
    //     // sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

    //     const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': alpha, 'theta': theta, 'phi': phi };
    //     sourceModel.geometry.parameters = param;
    //     sourceModel.geometry.type = 'aParallGeometry';
        
    //     sourceModel.name = 'Parallelepiped';


    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     // source.planeshape = "Square";
    //     source.volumeshape = "Para";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     source.halfX = 1;
    //     source.halfY = 1;
    //     source.halfZ = 2;
    //     // source.innerradius = 1;
    //     // source.outerradius = 1;
    //     source.alpha = alpha;
    //     source.theta = theta;
    //     source.phi = phi;

    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;

    //     });

    //     source.add(pointSource, sourceModel);

	// 	editor.execute( new AddObjectCommand( editor, source ) );

    // });

    // item.dom.addEventListener('dragend', function (event) {

    //     var mouseX = event.clientX;
    //     var mouseY = event.clientY;

    //     // Convert the mouse position to scene coordinates
    //     var rect = renderer.getBoundingClientRect();
    //     var mouseSceneX = ((mouseX - rect.left) / rect.width) * 2 - 1;
    //     var mouseSceneY = -((mouseY - rect.top) / rect.height) * 2 + 1;

    //     // Update the cube's position based on the mouse position
    //     var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

    //     mouseScenePosition.unproject(camera);
    //     var direction = mouseScenePosition.sub(camera.position).normalize();
    //     var distance = -camera.position.y / direction.y;
    //     var position = camera.position.clone().add(direction.multiplyScalar(distance));

    //     const pointSource = new THREE.PerspectiveCamera();

    //     const dx = 1, dy = 1, dz = 2, alpha = -10, theta = 10, phi = -10;
    //     const maxRadius = Math.max(dx, dy, dz) * 2;
    //     const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
    //     const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    //     const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
    //     const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

    //     let MeshCSG1 = CSG.fromMesh(mesh);
    //     let MeshCSG3 = CSG.fromMesh(boxmesh);

    //     boxmesh.geometry.translate(2 * maxRadius, 0, 0);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0 + dx, 0, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     let aCSG = MeshCSG1.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0 - dx, 0, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0, 0, dz);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(0, 0, -4 * maxRadius);
    //     boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
    //     boxmesh.position.set(0, 0, -dz);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.rotation.set(0, 0, 0);
    //     boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
    //     boxmesh.position.set(0, dy, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     boxmesh.geometry.translate(0, -4 * maxRadius, 0);
    //     boxmesh.position.set(0, - dy, 0);
    //     boxmesh.updateMatrix();
    //     MeshCSG3 = CSG.fromMesh(boxmesh);
    //     aCSG = aCSG.subtract(MeshCSG3);

    //     let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
    //     // sourceModel.rotateX(Math.PI / 2);
    //     // sourceModel.updateMatrix();
    //     // aCSG = CSG.fromMesh(sourceModel);
    //     // sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

    //     const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': alpha, 'theta': theta, 'phi': phi };
    //     sourceModel.geometry.parameters = param;
    //     sourceModel.geometry.type = 'aParallGeometry';
        
    //     sourceModel.name = 'Parallelepiped';


    //     const source = new THREE.Group();

    //     source.name = 'RadiationSource';
	// 	source.source = 'Surface';
    //     source.volumeshape = "Para";
	// 	source.energysize = 1;
	// 	source.energyunit = "keV";
	// 	source.energykind = "B+";
    //     source.halfX = 1;
    //     source.halfY = 1;
    //     source.halfZ = 2;
    //     // source.innerradius = 1;
    //     // source.outerradius = 1;
    //     source.alpha = alpha;
    //     source.theta = theta;
    //     source.phi = phi;
        
    //     source.children.forEach(child => {
    //         child.matrixAutoUpdate = false;
    //         child.userData.draggable = false;
    //     });

    //     source.add(pointSource, sourceModel);

    //     source.position.copy(position);
	// 	editor.execute( new AddObjectCommand( editor, source ) );
    // });

    // options.add(item);


    // Volume Sphere model

    item = new UIDiv();

    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${sphereImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumeSphere'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VSphereSource');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const sourceModelGeometry = new THREE.SphereGeometry(10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
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

        const sourceModelGeometry = new THREE.SphereGeometry(10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Sphere";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
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

    item.dom.style.backgroundImage = `url(${ellipsoidImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumeEllipsoid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VEllipsoid');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const xSemiAxis = 1, semiAxisY = 0.5, Dz = 1;

        const sphereGeometry = new THREE.SphereGeometry(xSemiAxis, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        let ellipsoidMesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
        const ratioZ = Dz / xSemiAxis;
        const ratioY = semiAxisY / xSemiAxis;
        ellipsoidMesh.scale.z = ratioZ;
        ellipsoidMesh.scale.y = ratioY;
        ellipsoidMesh.updateMatrix();
        const aCSG = CSG.fromMesh(ellipsoidMesh);
        const sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Ellipsoid";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 0.5;
        source.halfZ = 1;

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

        const xSemiAxis = 1, semiAxisY = 0.5, Dz = 1;

        const sphereGeometry = new THREE.SphereGeometry(xSemiAxis, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        let ellipsoidMesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
        const ratioZ = Dz / xSemiAxis;
        const ratioY = semiAxisY / xSemiAxis;
        ellipsoidMesh.scale.z = ratioZ;
        ellipsoidMesh.scale.y = ratioY;
        ellipsoidMesh.updateMatrix();
        const aCSG = CSG.fromMesh(ellipsoidMesh);
        const sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Ellipsoid";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 0.5;
        source.halfZ = 1;

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

    item.dom.style.backgroundImage = `url(${cylinderImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumeCylinder'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VCylinder');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        
        const sourceModelGeometry = new THREE.CylinderGeometry(10, 10, 20, 32, 32, false, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Cylinder";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfZ = 1;
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

        
        const sourceModelGeometry = new THREE.CylinderGeometry(10, 10, 20, 32, 32, false, 0, Math.PI * 2);
        const sourceModelMaterial = new THREE.MeshBasicMaterial();

        const sourceModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Cylinder";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfZ = 1;
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

    item.dom.style.backgroundImage = `url(${paraImg})`;

    item.setTextContent(strings.getKey('menubar/add/source/volumePara'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'VPara');
    item.onClick(function () {

        const pointSource = new THREE.PerspectiveCamera();

        const dx = 10, dy = 10, dz = 20, alpha = -10, theta = 10, phi = -10;
        const maxRadius = Math.max(dx, dy, dz) * 2;
        const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        boxmesh.geometry.translate(2 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 + dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 - dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, dz);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -4 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, -dz);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
        boxmesh.position.set(0, dy, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.geometry.translate(0, -4 * maxRadius, 0);
        boxmesh.position.set(0, - dy, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
        // sourceModel.rotateX(Math.PI / 2);
        // sourceModel.updateMatrix();
        // aCSG = CSG.fromMesh(sourceModel);
        // sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
        sourceModel.geometry.parameters = param;
        sourceModel.geometry.type = 'aParallGeometry';
        
        sourceModel.name = 'Parallelepiped';


        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Para";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 2;
        source.alpha = alpha;
        source.theta = theta;
        source.phi = phi;

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

        const dx = 10, dy = 10, dz = 20, alpha = -10, theta = 10, phi = -10;
        const maxRadius = Math.max(dx, dy, dz) * 2;
        const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        boxmesh.geometry.translate(2 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 + dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 - dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, dz);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -4 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, -dz);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
        boxmesh.position.set(0, dy, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.geometry.translate(0, -4 * maxRadius, 0);
        boxmesh.position.set(0, - dy, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
        // sourceModel.rotateX(Math.PI / 2);
        // sourceModel.updateMatrix();
        // aCSG = CSG.fromMesh(sourceModel);
        // sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
        sourceModel.geometry.parameters = param;
        sourceModel.geometry.type = 'aParallGeometry';
        
        sourceModel.name = 'Parallelepiped';

        const source = new THREE.Group();

        source.name = 'RadiationSource';
		source.source = 'Volume';
        source.volumeshape = "Para";
		source.energysize = 1;
		source.energyunit = "keV";
		source.energykind = "B+";
        source.halfX = 1;
        source.halfY = 1;
        source.halfZ = 2;
        source.alpha = alpha;
        source.theta = theta;
        source.phi = phi;

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
