import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';
import { PolyconeGeometry } from './libs/geometry/PolyconeGeometry.js';

import { UIDiv, UIPanel, UIRow } from "./libs/ui.js";

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import boxImg from '../images/basicmodels/aBox.jpg';
import shpereImg from '../images/basicmodels/aOrb.jpg';
import tubImg from '../images/basicmodels/aTubs.jpg';
import cuttubImg from '../images/basicmodels/aCutTube.jpg';
import coneImg from '../images/basicmodels/aCons.jpg';
import paraImg from '../images/basicmodels/aPara.jpg';
import trdImg from '../images/basicmodels/aTrd.jpg';
import trapImg from '../images/basicmodels/aTrap.jpg';
import torusImg from '../images/basicmodels/aTorus.jpg';
import ellipticaltubeImg from '../images/basicmodels/aEllipticalTube.jpg';
import ellipsoidImg from '../images/basicmodels/aEllipsoid.jpg';
import ellipticalconeImg from '../images/basicmodels/aEllipticalCone.jpg';
import twistedboxImg from '../images/basicmodels/aTwistedBox.jpg';
import twistedtrdImg from '../images/basicmodels/aTwistedTrd.jpg';
import twistedtrapImg from '../images/basicmodels/aTwistedTrap.jpg';
import twistedtubImg from '../images/basicmodels/aTwistedTubs.jpg';
import tetImg from '../images/basicmodels/aTet.jpg';
import generictrapImg from '../images/basicmodels/aGenericTrap.jpg';
import paraboloidImg from '../images/basicmodels/aParaboloid.jpg';
import hyperboloidImg from '../images/basicmodels/aHyperboloid.jpg';
import solidconeImg from '../images/basicmodels/aBREPSolidPCone.jpg';
import solidpolyhedraImg from '../images/basicmodels/aBREPSolidPolyhedra.jpg';

import { CreateBox } from './libs/CSG/Box.js'; 
import { CreateTorus } from './libs/CSG/Torus.js'; 
import { CreateTube } from './libs/CSG/Tube.js'; 
import { CreateCone } from './libs/CSG/Cone.js';
import { CreateSphere } from './libs/CSG/Sphere.js';
import { CreateCutTube } from './libs/CSG/CutTube.js';
import { CreateParallelepiped } from './libs/CSG/Parallelepiped.js';
import { CreateTrapezoid } from './libs/CSG/TrapeZoid.js';
import { CreateTrapezoidParallePiped } from './libs/CSG/TrapeZoidParallelpiped.js';
import { CreateElipticalCylinder } from './libs/CSG/EllipticalCylinder.js';
import { CreateEllipsoid } from './libs/CSG/Ellipsoid.js';
import { CreateEllipticalCone } from './libs/CSG/EllipticalCone.js';
import { CreateTwistedBox } from './libs/CSG/TwistedBox.js';
import { CreateTwistedTube } from './libs/CSG/TwistedTube.js';
import { CreatePrabolicCylinder } from './libs/CSG/PrabolicCylinder.js';
import { CreateHyperboloid } from './libs/CSG/Hyperboloid.js';


function BasicSolids(editor) {
    const strings = editor.strings;
    const camera = editor.camera;

    const renderer = document.getElementById('viewport');

    const container = new UIPanel();
    // container.setId('Category');

    const options = new UIPanel();
    options.setClass('Category-widget');

    let isDefaultLightsOn = false;

    function addDefaultLights(){

       //Default SpotLight
        const SpotLight = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI * 0.233,  0 );
		SpotLight.name = 'defaultSpotLight';
		SpotLight.target.name = 'SpotLight Target';
		SpotLight.decay = 0;
        SpotLight.position.set( 799, 798, 104 );

        // Default AmbientLight
        const ambientLight = new THREE.AmbientLight( 0xffffff, .1 );
		ambientLight.name = 'defaultAmbientLight';


		editor.execute( new AddObjectCommand( editor, ambientLight ) );
		editor.execute( new AddObjectCommand( editor, SpotLight ) );
    }

    options.onClick((e) => {
            if (e.target.classList.contains("Category-item") && !isDefaultLightsOn) {
                addDefaultLights();
                isDefaultLightsOn = true; // Update flag to prevent further triggering
            }})

    container.add(options);

    let item = new UIDiv();
    const material = new THREE.MeshLambertMaterial();

    // Box model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${boxImg})`;

    item.setTextContent(strings.getKey('menubar/add/box'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Box');
    const pX=100; // mm
    const pY=100; // mm
    const pZ=100; // mm
    
    item.onClick(function () {
        const mesh = CreateBox(pX, pY, pZ);
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

        const mesh = CreateBox(pX, pY, pZ);
        mesh.position.copy(position);
        editor.execute(new AddObjectCommand(editor, mesh));
    });

    options.add(item);


    // Sphere model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${shpereImg})`;

    item.setTextContent(strings.getKey('menubar/add/sphere'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Sphere');
    
    item.onClick(function () {
        var pRmin = 50, pRmax = 100, pSPhi = 0, pDPhi = Math.PI*2 , pSTheta = 0, pDTheta = Math.PI/1.5 ;
        const mesh = CreateSphere( pRmin , pRmax , pSTheta , pDTheta , pSPhi , pDPhi )

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
        
        var pRmin = 50, pRmax = 100, pSPhi = 0, pDPhi = Math.PI*2 , pSTheta = 0, pDTheta = Math.PI ;
        const mesh = CreateSphere( pRmin , pRmax , pSTheta , pDTheta , pSPhi , pDPhi )
        mesh.position.copy(position);
        editor.execute(new AddObjectCommand(editor, mesh));
    });

    options.add(item);

    // Tube model
    item = new UIDiv();
    item.setClass('Category-item');
    item.setTextContent(strings.getKey('menubar/add/g4tube'));
    item.dom.style.backgroundImage = `url(${tubImg})`;
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'eTub');
    item.onClick(function () {
        var pRMin = 0, pRMax = 150 /*mm*/, pDz = 200 /*mm*/, pSPhi = 0, pDPhi = 360;
        const finalMesh = CreateTube( pRMin , pRMax , pDz, pSPhi , pDPhi )

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

        var pRMin = 0, pRMax = 150 /*mm*/, pDz = 200 /*mm*/, pSPhi = 0, pDPhi = 360;
        const finalMesh = CreateTube( pRMin , pRMax , pDz, pSPhi , pDPhi );
        finalMesh.position.copy(position);
        editor.execute(new AddObjectCommand(editor, finalMesh));
    });

    options.add(item);



    // CutTube model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${cuttubImg})`;

    item.setTextContent(strings.getKey('menubar/add/g4cuttube'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'cutTub');
    item.onClick(function () {

        // we need to new each geometry module

        var pRMin = 1, pRMax = 1.5, pDz = 4, SPhi = 0, DPhi = 270, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);
        const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );

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

        var pRMin = 1, pRMax = 1.5, pDz = 4, SPhi = 0, DPhi = 270, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);
        const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Cone model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${coneImg})`;

    item.setTextContent(strings.getKey('menubar/add/g4cone'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Cons');
    item.onClick(function () {

        // we need to new each geometry module

        var pRmin1 = 5, pRmax1 = 10, pRmin2 = 20, pRmax2 = 25, pDz = 40, SPhi = 0, DPhi = 360;
        const finalMesh = CreateCone( pRmin1 , pRmax1 , pRmin2 , pRmax2 , pDz , SPhi , DPhi );

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

        var pRmin1 = 5, pRmax1 = 10, pRmin2 = 20, pRmax2 = 25, pDz = 40, SPhi = 0, DPhi = 360;
        const finalMesh = CreateCone( pRmin1 , pRmax1 , pRmin2 , pRmax2 , pDz , SPhi , DPhi );

        finalMesh.position.copy(position);
        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Parallelepiped model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${paraImg})`;

    item.setTextContent(strings.getKey('menubar/add/apara'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Parallelediped');
    item.onClick(function () {

        const dx = 1, dy = 1, dz = 2, alpha = -10, theta = 10, phi = -10;
        const finalMesh = CreateParallelepiped( dx , dy , dz , alpha , theta , phi )

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

        const dx = 1, dy = 1, dz = 2, alpha = -10, theta = 10, phi = -10;
        const finalMesh = CreateParallelepiped( dx , dy , dz , alpha , theta , phi )
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    // TrapeZoid model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${trdImg})`;

    item.setTextContent(strings.getKey('menubar/add/atrapezoid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'TrapeZoid');
    item.onClick(function () {

        const dx1 = 1.5, dy1 = 1.5, dz = 1, dx2 = 0.5, dy2 = 0.5;
        const finalMesh = CreateTrapezoid( dx1 , dy1 , dz , dx2 , dy2 )
        
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


        var mouseScenePosition = new THREE.Vector3(mouseSceneX, mouseSceneY, 0);

        mouseScenePosition.unproject(camera);
        var direction = mouseScenePosition.sub(camera.position).normalize();
        var distance = -camera.position.y / direction.y;
        var position = camera.position.clone().add(direction.multiplyScalar(distance));


        const dx1 = 1.5, dy1 = 1.5, dz = 1, dx2 = 0.5, dy2 = 0.5;
        const finalMesh = CreateTrapezoid( dx1 , dy1 , dz , dx2 , dy2 )
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // TrapeZoid-P model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${trapImg})`;

    item.setTextContent(strings.getKey('menubar/add/atrapezoid2'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Parallelediped');
    item.onClick(function () {

        const pDx1 = 0.5, pDx2 = 1, pDy1 = 1.5, pDx3 = 1.5, pDx4 = 2, pDy2 = 1.6, pDz = 4, pTheta = 20, pPhi = 5, pAlpha = 10;
        const finalMesh = CreateTrapezoidParallePiped( pDx1 , pDx2 , pDy1 , pDx3 , pDx4 , pDy2 , pDz , pTheta , pPhi , pAlpha )
        

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

        const pDx1 = 0.5, pDx2 = 1, pDy1 = 1.5, pDx3 = 1.5, pDx4 = 2, pDy2 = 1.6, pDz = 4, pTheta = 20, pPhi = 5, pAlpha = 10;
        const finalMesh = CreateTrapezoidParallePiped( pDx1 , pDx2 , pDy1 , pDx3 , pDx4 , pDy2 , pDz , pTheta , pPhi , pAlpha )

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Torus model

    item = new UIDiv();
    item.setClass('Category-item');
    item.dom.style.backgroundImage = `url(${torusImg})`;

    item.setTextContent(strings.getKey('menubar/add/atorus'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Torus');
    item.onClick(function () {

        const pRmin = 8, pRmax = 10, pRtor = 100, pSPhi = 0, pDPhi = Math.PI/2 ;
        const finalMesh = CreateTorus( pRmin , pRmax , pRtor , pSPhi , pDPhi );

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

        const pRmin = 8, pRmax = 10, pRtor = 100, pSPhi = 0, pDPhi = 90;
        const finalMesh = CreateTorus( pRmin , pRmax , pRtor , pSPhi , pDPhi );
        
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // EllipticalCylinder model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${ellipticaltubeImg})`;

    item.setTextContent(strings.getKey('menubar/add/aellipticalcylinder'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'eCylinder');
    item.onClick(function () {

        // we need to new each geometry module

        var xSemiAxis = 1, semiAxisY = 2, Dz = 2;
        const finalMesh = CreateElipticalCylinder( xSemiAxis , semiAxisY , Dz );

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


        var xSemiAxis = 1, semiAxisY = 2, Dz = 2;
		const finalMesh = CreateElipticalCylinder( xSemiAxis , semiAxisY , Dz );

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);



    // Ellipsoid model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${ellipsoidImg})`;

    item.setTextContent(strings.getKey('menubar/add/aellipsoid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Ellipsoid');
    item.onClick(function () {

        // we need to new each geometry module

        var xSemiAxis = 1, ySemiAxis = 1.5, zSemiAxis = 4, pzTopCut = 3, zBottomCut = -2;
        const  finalMesh = CreateEllipsoid( xSemiAxis , ySemiAxis , zSemiAxis , pzTopCut , zBottomCut );

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


        var xSemiAxis = 1, ySemiAxis = 1.5, zSemiAxis = 4, zTopCut = 3, zBottomCut = -2;
        const  finalMesh = CreateEllipsoid( xSemiAxis , ySemiAxis , zSemiAxis , zTopCut , zBottomCut );

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // EllipticalCone model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${ellipticalconeImg})`;

    item.setTextContent(strings.getKey('menubar/add/aellipticalcone'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'aEllipticalCone');
    item.onClick(function () {

        // we need to new each geometry module

        var xSemiAxis = 2, ySemiAxis = 1.5, zTopCut = 3, height = 5;
        const finalMesh = CreateEllipticalCone( xSemiAxis , ySemiAxis , zTopCut , height );

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


        var xSemiAxis = 2, ySemiAxis = 1.5, zTopCut = 3, height = 5;
        const finalMesh = CreateEllipticalCone( xSemiAxis , ySemiAxis , zTopCut , height );

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // twisted box

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedboxImg})`;

    item.setTextContent(strings.getKey('menubar/add/twistedbox'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Box');
    item.onClick(function () {

        const twistedangle = - 30, pDx = 1, pDy = 2, pDz = 1;
        const mesh = CreateTwistedBox( twistedangle , pDx , pDy , pDz );

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


        const twistedangle = - 30, pDx = 1, pDy = 2, pDz = 1;
        const mesh = CreateTwistedBox( twistedangle , pDx , pDy , pDz );
        mesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, mesh));

    });

    options.add(item);

    // Twisted Trapezoid1 //........    

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedtrdImg})`;

    item.setTextContent(strings.getKey('menubar/add/atwistedtrd'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'TrapeZoid3');
    item.onClick(function () {

        const dx1 = 2, dy1 = 2, dz = 5, dx2 = 1, dy2 = 1, twistedangle = - 30;
        const maxdis = Math.max(dx1, dy1, dx2, dy2, dz) * 2;
        const maxwidth = Math.max(dx1, dy1, dx2, dy2) * 2;
        const geometry = new THREE.BoxGeometry(maxwidth, dz * 2, maxwidth, 32, 32, 32);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

        const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let alpha = Math.atan((dx1 - dx2) / 2 / dz);
        let phi = Math.atan((dy1 - dy2) / 2 / dz);

        boxmesh.geometry.translate(maxdis, maxdis, 0);
        boxmesh.rotation.set(0, 0, phi);
        boxmesh.position.set(0 + dx1, -dz, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-2 * maxdis, 0, 0);
        boxmesh.rotation.set(0, 0, -phi);
        boxmesh.position.set(0 - dx1, -dz, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(maxdis, 0, maxdis);
        boxmesh.rotation.set(-alpha, 0, 0);
        boxmesh.position.set(0, -dz, dy1);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -2 * maxdis);
        boxmesh.rotation.set(alpha, 0, 0);
        boxmesh.position.set(0, -dz, -dy1);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        finalMesh.name = 'TwistedTrapeZoid';
        const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': - twistedangle };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aTwistedTrdGeometry';

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


        const dx1 = 2, dy1 = 2, dz = 5, dx2 = 1, dy2 = 1, twistedangle = - 30;
        const maxdis = Math.max(dx1, dy1, dx2, dy2, dz) * 2;
        const maxwidth = Math.max(dx1, dy1, dx2, dy2) * 2;
        const geometry = new THREE.BoxGeometry(maxwidth, dz * 2, maxwidth, 32, 32, 32);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

        const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let alpha = Math.atan((dx1 - dx2) / 2 / dz);
        let phi = Math.atan((dy1 - dy2) / 2 / dz);

        boxmesh.geometry.translate(maxdis, maxdis, 0);
        boxmesh.rotation.set(0, 0, phi);
        boxmesh.position.set(0 + dx1, -dz, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-2 * maxdis, 0, 0);
        boxmesh.rotation.set(0, 0, -phi);
        boxmesh.position.set(0 - dx1, -dz, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(maxdis, 0, maxdis);
        boxmesh.rotation.set(-alpha, 0, 0);
        boxmesh.position.set(0, -dz, dy1);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -2 * maxdis);
        boxmesh.rotation.set(alpha, 0, 0);
        boxmesh.position.set(0, -dz, -dy1);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        
        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        finalMesh.name = 'TwistedTrapeZoid';
        const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': - twistedangle };
        finalMesh.geometry.parameters = param;

        finalMesh.geometry.type = 'aTwistedTrdGeometry';


        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // TwistedTrap model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedtrapImg})`;

    item.setTextContent(strings.getKey('menubar/add/atwistedtrap'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Trapezoid4');
    item.onClick(function () {

        const pDx1 = 0.5, pDx2 = 1, pDy1 = 1.5, pDx3 = 1.5, pDx4 = 2, pDy2 = 1.6, pDz = 4, pTheta = 20, pPhi = 5, pAlpha = 10, twistedangle = - 30;
        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4) * 2;
        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz * 2, 2 * maxWidth, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 8 * dz, 4 * maxWidth, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, material);

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        boxmesh.geometry.translate(2 * maxWidth, 0, 0);
        boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
        boxmesh.position.set(0 + dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
        boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
        boxmesh.position.set(0 - dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
        boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
        boxmesh.position.set(0, 0, dy);
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


        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        finalMesh.name = 'TwistedTrapeZoidP';
        finalMesh.geometry.type = 'aTwistedTrapGeometry';
        const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi, 'twistedangle': - twistedangle };
        finalMesh.geometry.parameters = param;


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

        const pDx1 = 0.5, pDx2 = 1, pDy1 = 1.5, pDx3 = 1.5, pDx4 = 2, pDy2 = 1.6, pDz = 4, pTheta = 20, pPhi = 5, pAlpha = 10, twistedangle = - 30;
        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth, 32, 32, 32);
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
        boxmesh.position.set(0, 0, dy);
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


        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        
        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        finalMesh.name = 'TwistedTrapeZoidP';
        finalMesh.geometry.type = 'aTwistedTrapGeometry';
        const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi, 'twistedangle': - twistedangle };
        finalMesh.geometry.parameters = param;

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // TwitsedTube model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedtubImg})`;

    item.setTextContent(strings.getKey('menubar/add/atwistedtube'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'TwistedTube');
    item.onClick(function () {

        // we need to new each geometry module

        var pRMin = 1, pRMax = 1.5, pDz = 2, SPhi = 0, DPhi = 90, twistedangle = - 30;
        const finalMesh = CreateTwistedTube ( pRMin, pRMax , pDz , SPhi , DPhi , twistedangle )

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

        var pRMin = 1, pRMax = 1.5, pDz = 2, SPhi = 0, DPhi = 90, twistedangle = - 30;
        const finalMesh = CreateTwistedTube ( pRMin, pRMax , pDz , SPhi , DPhi , twistedangle )

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Tetrahedra model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${tetImg})`;

    item.setTextContent(strings.getKey('menubar/add/tetrahedra'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Tetrahedra');
    item.onClick(function () {

        const anchor = [0, Math.sqrt(3), 0], p2 = [0, -1 / Math.sqrt(3), 2 * Math.sqrt(2 / 3)], p3 = [-Math.sqrt(2), -1 / Math.sqrt(3), -Math.sqrt(2 / 3),], p4 = [Math.sqrt(2), -1 / Math.sqrt(3), -Math.sqrt(2 / 3)];

        const vertices = [], indices = [];
        vertices.push(...anchor, ...p2, ...p3, ...p4);
        indices.push(0, 1, 2, 0, 2, 1, 0, 2, 3, 0, 3, 2, 0, 1, 3, 0, 3, 1, 1, 2, 3, 1, 3, 2);
        const geometry = new PolyhedronGeometry(vertices, indices);
        
        let mesh = new THREE.Mesh(geometry, material);
        
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
        mesh.name = 'Tetrahedra';
        mesh.geometry.parameters = param;
        mesh.geometry.type = 'aTetrahedraGeometry';
        
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


        const anchor = [0, 0, Math.sqrt(3)], p2 = [0, 2 * Math.sqrt(2 / 3), -1 / Math.sqrt(3)], p3 = [-Math.sqrt(2), -Math.sqrt(2 / 3), -1 / Math.sqrt(3)], p4 = [Math.sqrt(2), -Math.sqrt(2 / 3), -1 / Math.sqrt(3)];

        const vertices = [], indices = [];
        vertices.push(...anchor, ...p2, ...p3, ...p4);
        indices.push(0, 1, 2, 0, 2, 1, 0, 2, 3, 0, 3, 2, 0, 1, 3, 0, 3, 1, 1, 2, 3, 1, 3, 2);
        const geometry = new PolyhedronGeometry(vertices, indices);
        
        let mesh = new THREE.Mesh(geometry, material);
        
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
        mesh.geometry.parameters = param;
        mesh.geometry.type = 'aTetrahedraGeometry';
        mesh.name = 'Tetrahedra';
        mesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, mesh));

    });

    options.add(item);


    // GenericTrap model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${generictrapImg})`;

    item.setTextContent(strings.getKey('menubar/add/generictrap'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'GenericTrap');
    item.onClick(function () {

        const pDz = 1, px = [-1, -1, 1, 1, -0.5, -0.5, 0.5, 0.5], py = [-1, 1, 1, -1, -0.5, 0.5, 0.5, -0.5];

        const vertices = [], indices = [];
        for (let i = 0; i < 8; i++) {
            if (i > 3) {
                vertices.push(px[i], 1 * pDz, py[i]);
            } else {
                vertices.push(px[i], -1 * pDz, py[i]);
            }
        }

        indices.push(0, 2, 1, 0, 3, 2, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7);
        const geometry = new PolyhedronGeometry(vertices, indices);
        
        let mesh = new THREE.Mesh(geometry, material);
        
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        mesh.name = 'GenericTrap';
        const param = { 'pDz': pDz, 'px': px, 'py': py };
        mesh.geometry.parameters = param;
        mesh.geometry.type = 'aGenericTrapGeometry';

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


        const pDz = 1, px = [-1, -1, 1, 1, -0.5, -0.5, 0.5, 0.5], py = [-1, 1, 1, -1, -0.5, 0.5, 0.5, -0.5];

        const vertices = [], indices = [];
        for (let i = 0; i < 8; i++) {
            if (i > 3) {
                vertices.push(px[i], 1 * pDz, py[i]);
            } else {
                vertices.push(px[i], -1 * pDz, py[i]);
            }
        }

        indices.push(0, 2, 1, 0, 3, 2, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7);
        const geometry = new PolyhedronGeometry(vertices, indices);
        
        let mesh = new THREE.Mesh(geometry, material);
                
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        mesh.name = 'GenericTrap';
        const param = { 'pDz': pDz, 'px': px, 'py': py };
        mesh.geometry.parameters = param;
        mesh.geometry.type = 'aGenericTrapGeometry';
        mesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, mesh));

    });

    options.add(item);



    // PrabolicCylinder model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${paraboloidImg})`;

    item.setTextContent(strings.getKey('menubar/add/aparaboloid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Paraboloid');
    item.onClick(function () {

        // we need to new each geometry module

        var radius1 = 0.5, radius2 = 1, pDz = 2;
        const finalMesh = CreatePrabolicCylinder(radius1 , radius2 , pDz);

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


        var radius1 = 0.5, radius2 = 1, pDz = 2;
        const finalMesh = CreatePrabolicCylinder(radius1 , radius2 , pDz)
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);



    // Hyperboloid model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${hyperboloidImg})`;

    item.setTextContent(strings.getKey('menubar/add/ahyperboloid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Hyperboloid');
    item.onClick(function () {

        // we need to new each geometry module

        var radiusOut = 1, radiusIn = 0.5, stereo1 = 70, stereo2 = 70, pDz = 2;
        const  finalMesh = CreateHyperboloid(radiusOut, radiusIn, stereo1, stereo2, pDz);

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


        var radiusOut = 1, radiusIn = 0.5, stereo1 = 70, stereo2 = 70, pDz = 2;
        const  finalMesh = CreateHyperboloid(radiusOut, radiusIn, stereo1, stereo2, pDz);
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    //Polycons model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${solidconeImg})`;

    item.setTextContent(strings.getKey('menubar/add/polycone'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Polycone');
    item.onClick(function () {

        const SPhi = 0, DPhi = 270, numZPlanes = 9, rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];

        const geometryIn = new PolyconeGeometry(numZPlanes, rInner, z, 32, 1, false, (SPhi + 90)/180*Math.PI, DPhi/180*Math.PI);
        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, (SPhi + 90)/180*Math.PI, DPhi/180*Math.PI);

        const meshIn = new THREE.Mesh(geometryIn, new THREE.MeshBasicMaterial());
        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());
        let maxWidth = Math.max(...rOuter);
        let maxHeight = Math.max(...z);

        const boxgeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());
        boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

        let MeshCSG1 = CSG.fromMesh(meshOut);
        let MeshCSG2 = CSG.fromMesh(meshIn);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4(), material);
        
        finalMesh.geometry.computeVertexNormals();
        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        let aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aPolyconeGeometry';
        finalMesh.name = 'Polycone';

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


        const SPhi = 0, DPhi = 270, numZPlanes = 9, rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];

        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, (SPhi + 90) / 180 * Math.PI, DPhi / 180 * Math.PI);

        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(meshOut);

        let aCSG;
        aCSG = MeshCSG1;

        let finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4(), material);
        
        finalMesh.geometry.computeVertexNormals();
        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.name = 'Polycone';
        finalMesh.geometry.type = 'aPolyconeGeometry';
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    //PolyHedra model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${solidpolyhedraImg})`;

    item.setTextContent(strings.getKey('menubar/add/polyhedra'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Polyhedra');
    item.onClick(function () {

        const SPhi = 30, DPhi = 210, numSide = 3, numZPlanes = 9, rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];

        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, (SPhi + 90) / 180 * Math.PI, DPhi / 180 * Math.PI);

        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(meshOut);

        let finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4(), material);
        
        finalMesh.geometry.computeVertexNormals();
        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        let aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        const param = { 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aPolyhedraGeometry';
        finalMesh.name = 'Polyhedra';
        

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

        const SPhi = 30, DPhi = 210, numSide = 3, numZPlanes = 9, rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];

        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, (SPhi + 90) / 180 * Math.PI, DPhi / 180 * Math.PI);

        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(meshOut);

        let finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4(), material);
        
        finalMesh.geometry.computeVertexNormals();
        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        let aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        const param = {'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aPolyhedraGeometry';
        finalMesh.position.copy(position);
        finalMesh.name = 'Polyhedra';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    return container;
}

export { BasicSolids };
