import * as THREE from 'three';
import tippy from 'tippy.js';
import { CSG } from './libs/CSGMesh.js';
import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';
import { PolyconeGeometry } from './libs/geometry/PolyconeGeometry.js';

import { UIDiv, UIPanel, UIRow } from "./libs/ui.js";

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import boxImg from '../images/basicmodels/aBox.jpg';
import shpereImg from '../images/basicmodels/aOrb.jpg';
import tubImg from '../images/basicmodels/aTubs.jpg';
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

import { BoxGeometry } from './libs/geometry/Box.js';
import { SphereGeometry2 } from './libs/geometry/Sphere.js';
import { aTubeGeometry } from './libs/geometry/Tube.js';
import { aConeGeometry } from './libs/geometry/Cone.js';
import { aTorusGeometry } from './libs/geometry/Torus.js';
import { aEllipticalCylinderGeometry } from './libs/geometry/EllipticalCylinder.js';
import { aEllipsoidGeometry } from './libs/geometry/Ellipsoid.js';
import { aTwistedBoxGeometry } from './libs/geometry/TwistedBox.js';
import { aTrapeZoidGeometry } from './libs/geometry/TrapeZoid.js';

import { aEllipticalConeGeometry } from './libs/geometry/EllipticalCone.js';
import { aParallGeometry } from './libs/geometry/Parallelepiped.js';
import { aTwistedTubeGeometry } from './libs/geometry/TwistedTube.js';
import { aTrapeZoidPGeometry } from './libs/geometry/TrapeZoid2P.js';

// import { aTwistedTrdGeometry } from './libs/geometry/TrapeZoid3.js';
// import { aTwistedTrapGeometry } from './libs/geometry/TrapeZoid4.js';
// import { aTetrahedraGeometry } from './libs/geometry/Tetrahedra.js';
// import { aGenericTrapGeometry } from './libs/geometry/GenericTrap.js';
// import { aParaboloidGeometry } from './libs/geometry/Paraboloid.js';
// import { aHyperboloidGeometry } from './libs/geometry/Hyperboloid.js';
// import { aPolyconeGeometry } from './libs/geometry/Polycons.js';
// import { aPolyhedraGeometry } from './libs/geometry/PolyHedra.js';


function BasicSolids(editor) {
    const strings = editor.strings;
    const camera = editor.camera;

    const renderer = document.getElementById('viewport');

    const container = new UIPanel();
    // container.setId('Category');

    const options = new UIPanel();
    options.setClass('Category-widget');

    container.add(options);

    function getPositionFromMouse(event) {
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
    
        return position; // Return the calculated position
    }

    let item = new UIDiv();
    const material = new THREE.MeshLambertMaterial();

    // Box model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${boxImg})`;

    item.setTextContent(strings.getKey('menubar/add/box'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Box');
    tippy(item.dom, { //For comment
        content: 'Click or drag it to add.',
        placement: 'top', 
    });

    item.onClick(function () {

        const pX=10,        pY=10,      pZ=10;     
        const geometry = new BoxGeometry(pX, pY, pZ);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        mesh.name = 'Box';

        editor.execute(new AddObjectCommand(editor, mesh));
    });

    item.dom.addEventListener('dragend', function (event) {
        var position = getPositionFromMouse(event);    

        const pX=10,        pY=10,      pZ=10;     
        const geometry = new BoxGeometry(pX, pY, pZ);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial(0xbbbbbb));
        mesh.name = 'Box';

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

    tippy(item.dom, { //For comment
        content: 'Click or drag it to add.',
        placement: 'top', 
    });
  
    
    item.onClick(function () {
        var pRmin = 5, pRmax = 10, pSPhi = 0, pDPhi = 360 , pSTheta = 0, pDTheta = 120;
        const geometry = new SphereGeometry2(pRmin , pRmax , pSTheta , pDTheta , pSPhi , pDPhi);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        mesh.name = 'Sphere';

        editor.execute(new AddObjectCommand(editor, mesh)); 
    });

    item.dom.addEventListener('dragend', function (event) {
        var position = getPositionFromMouse(event);
               
        var pRmin = 5, pRmax = 10, pSPhi = 0, pDPhi = 360 , pSTheta = 0, pDTheta = 120;
        const geometry = new SphereGeometry2(pRmin , pRmax , pSTheta , pDTheta , pSPhi , pDPhi);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        mesh.name = 'Sphere';

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

    tippy(item.dom, { //For comment
        content: 'Click or drag it to add.',
        placement: 'top', 
    });

    item.onClick(function () {
        var pRMin = 5, pRMax = 10 , pDz = 10 , pSPhi = 0, pDPhi = 360;

        const geometry = new aTubeGeometry( pRMin , pRMax , pDz, pSPhi , pDPhi );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Tubs';

        editor.execute(new AddObjectCommand(editor, finalMesh));
    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        var pRMin = 5, pRMax = 10 , pDz = 10 , pSPhi = 0, pDPhi = 360;

        const geometry = new aTubeGeometry( pRMin , pRMax , pDz, pSPhi , pDPhi );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Tubs';
        
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

    tippy(item.dom, { //For comment
        content: 'Click or drag it to add.',
        placement: 'top', 
    });

    item.onClick(function () {

        // we need to new each geometry module

        var pRmin1 = 6, pRmax1 = 8, pRmin2 = 1, pRmax2 = 3, pDz = 10, SPhi = 0, DPhi = 360;
        const geometry = new aConeGeometry(pRmin1 , pRmax1 , pRmin2 , pRmax2 , pDz , SPhi , DPhi );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial()); 
        finalMesh.name = 'Cone';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        var pRmin1 = 6, pRmax1 = 8, pRmin2 = 1, pRmax2 = 3, pDz = 10, SPhi = 0, DPhi = 360;
        const geometry = new aConeGeometry(pRmin1 , pRmax1 , pRmin2 , pRmax2 , pDz , SPhi , DPhi );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial()); 
        finalMesh.name = 'Cone';

        finalMesh.position.copy(position);
        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Torus model

    item = new UIDiv();
    item.setClass('Category-item');
    item.dom.style.backgroundImage = `url(${torusImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/atorus'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Torus');

    tippy(item.dom, { //For comment
        content: 'Click or drag it to add.',
        placement: 'top', 
    });

    item.onClick(function () {

        const pRmin = 1, pRmax = 1.5, pRtor = 10, pSPhi = 0, pDPhi = 90 ;
        const geometry = new aTorusGeometry( pRmin , pRmax , pRtor , pSPhi , pDPhi );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Torus';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const pRmin = 1, pRmax = 1.5, pRtor = 10, pSPhi = 0, pDPhi = 90 ;
        const geometry = new aTorusGeometry( pRmin , pRmax , pRtor , pSPhi , pDPhi );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Torus';
        
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // EllipticalCylinder model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${ellipticaltubeImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/aellipticalcylinder'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'eCylinder');

    tippy(item.dom, { //For comment
        content: 'Click or drag it to add.',
        placement: 'top', 
    });

    item.onClick(function () {

        // we need to new each geometry module

        var xSemiAxis = 50, semiAxisY = 100, Dz = 100;            
        const geometry = new aEllipticalCylinderGeometry( xSemiAxis , semiAxisY , Dz );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'EllipticalCylinder';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);       

        var xSemiAxis = 50, semiAxisY = 100, Dz = 100;
        const geometry = new aEllipticalCylinderGeometry( xSemiAxis , semiAxisY , Dz );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'EllipticalCylinder';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Ellipsoid model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${ellipsoidImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/aellipsoid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Ellipsoid');

    tippy(item.dom, { //For comment
        content: 'Click or drag it to add.',
        placement: 'top', 
    });

    item.onClick(function () {

        // we need to new each geometry module

        var xSemiAxis = 10, ySemiAxis = 8, zSemiAxis = 10, zBottomCut = 6, pzTopCut = 10 ;
        const geometry = new aEllipsoidGeometry(xSemiAxis , ySemiAxis , zSemiAxis , zBottomCut, pzTopCut );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Ellipsoid';


        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        var xSemiAxis = 10, ySemiAxis = 8, zSemiAxis = 10, zBottomCut = 6, pzTopCut = 10 ;
        const geometry = new aEllipsoidGeometry(xSemiAxis , ySemiAxis , zSemiAxis , zBottomCut, pzTopCut );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Ellipsoid';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    // twisted box

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedboxImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/twistedbox'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Box');

    tippy(item.dom, { //For comment
        content: 'Click or drag to add it.',
        placement: 'top', 
    });

    item.onClick(function () {

        const twistedangle = 15, pDx = 10, pDy = 15, pDz = 10;
        const geometry = new aTwistedBoxGeometry(twistedangle, pDx, pDy, pDz);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = ' TwistedBox'


        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const twistedangle = 15, pDx = 10, pDy = 15, pDz = 10;
        const geometry = new aTwistedBoxGeometry(twistedangle, pDx, pDy, pDz);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = ' TwistedBox'

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    // TrapeZoid model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${trdImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/atrapezoid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'TrapeZoid');

    tippy(item.dom, { //For comment
        content: 'Click or drag to add it.',
        placement: 'top', 
    });

    item.onClick(function () {

        const dx1 = 15, dy1 = 15, dz = 10, dx2 = 5, dy2 = 5;
        const geometry = new aTrapeZoidGeometry(dx1 , dy1 , dz , dx2 , dy2);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Trapezoid'
        
        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const dx1 = 15, dy1 = 15, dz = 10, dx2 = 5, dy2 = 5;
        const geometry = new aTrapeZoidGeometry(dx1 , dy1 , dz , dx2 , dy2);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Trapezoid'

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // EllipticalCone model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${ellipticalconeImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/aellipticalcone'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'aEllipticalCone');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top',     
    });

    item.onClick(function () {

        // we need to new each geometry module

        var xSemiAxis = 10, ySemiAxis = 8, zTopCut = 3, height = 5;
        const geometry = new aEllipticalConeGeometry(xSemiAxis , ySemiAxis , zTopCut , height);
        const finalMesh = new THREE.Mesh(geometry , new THREE.MeshLambertMaterial());
        finalMesh.name = 'EllipticalCone';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        var xSemiAxis = 2, ySemiAxis = 1.5, zTopCut = 3, height = 5;
        const geometry = new aEllipticalConeGeometry(xSemiAxis , ySemiAxis , zTopCut , height);
        const finalMesh = new THREE.Mesh(geometry , new THREE.MeshLambertMaterial());
        finalMesh.name = 'EllipticalCone';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Parallelepiped model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${paraImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/apara'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Parallelediped');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const dx = 10, dy = 10, dz = 10, alpha = -10, theta = 10, phi = -10;
        const geometry = new aParallGeometry(dx, dy, dz, alpha, theta, phi);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Parallelepiped';


        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const dx = 10, dy = 10, dz = 10, alpha = -10, theta = 10, phi = -10;
        const geometry = new aParallGeometry(dx, dy, dz, alpha, theta, phi);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Parallelepiped';
        
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    // TwitsedTube model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedtubImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/atwistedtube'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'TwistedTube');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        // we need to new each geometry module

        var pRMin = 6, pRMax = 11, pDz = 10, SPhi = 0, DPhi = 90, twistedangle = 30;
        const geometry = new aTwistedTubeGeometry( pRMin, pRMax , pDz , SPhi , DPhi , twistedangle );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'TwistedTubs';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        var pRMin = 6, pRMax = 11, pDz = 10, SPhi = 0, DPhi = 90, twistedangle = 30;
        const geometry = new aTwistedTubeGeometry( pRMin, pRMax , pDz , SPhi , DPhi , twistedangle );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'TwistedTubs';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    // TrapeZoid-P(2) model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${trapImg})`;
    // item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/atrapezoid2'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Parallelediped');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const pDx1 = 5, pDx2 = 10, pDy1 = 15, pDx3 = 15, pDx4 = 2, pDy2 = 14, pDz = 10, pTheta = 20, pPhi = 5, pAlpha = 10;
        const geometry = new aTrapeZoidPGeometry(pDx1 , pDx2 , pDy1 , pDx3 , pDx4 , pDy2 , pDz , pTheta , pPhi , pAlpha );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'aTrapezoidParallePiped'
        

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const pDx1 = 5, pDx2 = 10, pDy1 = 15, pDx3 = 15, pDx4 = 2, pDy2 = 14, pDz = 10, pTheta = 20, pPhi = 5, pAlpha = 10;
        const geometry = new aTrapeZoidPGeometry(pDx1 , pDx2 , pDy1 , pDx3 , pDx4 , pDy2 , pDz , pTheta , pPhi , pAlpha );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'aTrapezoidParallePiped'

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    // Twisted Trapezoid3

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedtrdImg})`;
    item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/atwistedtrd'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'TrapeZoid3');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const dx1 = 2.5, dy1 = 2.5, dz = 10, dx2 = 3, dy2 = 3, twistedangle = - 30;
        const geometry = new aTwistedTrdGeometry(dx1, dy1, dz, dx2, dy2, twistedangle );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'TwistedTrapeZoid'

               

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const dx1 = 2.5, dy1 = 2.5, dz = 10, dx2 = 3, dy2 = 3, twistedangle = - 30;
        const geometry = new aTwistedTrdGeometry(dx1, dy1, dz, dx2, dy2, twistedangle );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'TwistedTrapeZoid'

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // TwistedTrap model (TwistedTrap4)

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedtrapImg})`;
    item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/atwistedtrap'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Trapezoid4');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const pDx1 = 2.5, pDx2 = 5, pDy1 = 8, pDx3 = 8, pDx4 = 10, pDy2 = 8, pDz = 15, pTheta = 10, pPhi = 10, pAlpha = 10, twistedangle = - 30;
        const geometry = new aTwistedTrapGeometry(pDx1, pDx2, pDy1, pDx3, pDx4, pDy2, pDz, pTheta, pPhi, pAlpha, twistedangle, material);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'aTwistedTrapGeometry'

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const pDx1 = 2.5, pDx2 = 5, pDy1 = 8, pDx3 = 8, pDx4 = 10, pDy2 = 8, pDz = 15, pTheta = 10, pPhi = 10, pAlpha = 10, twistedangle = - 30;
        const geometry = new aTwistedTrapGeometry(pDx1, pDx2, pDy1, pDx3, pDx4, pDy2, pDz, pTheta, pPhi, pAlpha, twistedangle, material);
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'aTwistedTrapGeometry'

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Tetrahedra model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${tetImg})`;
    item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/tetrahedra'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Tetrahedra');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const anchor = [0, 5 * Math.sqrt(3), 0];
        const p2 = [0, -5 / Math.sqrt(3), 10 * Math.sqrt(2 / 3)];
        const p3 = [-5 * Math.sqrt(2), -5 / Math.sqrt(3), -5 * Math.sqrt(2 / 3)];
        const p4 = [5 * Math.sqrt(2), -5 / Math.sqrt(3), -5 * Math.sqrt(2 / 3)];
        const geometry = new aTetrahedraGeometry( anchor, p2, p3, p4 );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Tetrahedra';

        
        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const anchor = [0, 5 * Math.sqrt(3), 0];
        const p2 = [0, -5 / Math.sqrt(3), 10 * Math.sqrt(2 / 3)];
        const p3 = [-5 * Math.sqrt(2), -5 / Math.sqrt(3), -5 * Math.sqrt(2 / 3)];
        const p4 = [5 * Math.sqrt(2), -5 / Math.sqrt(3), -5 * Math.sqrt(2 / 3)];
        const geometry = new aTetrahedraGeometry( anchor, p2, p3, p4 );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Tetrahedra';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // GenericTrap model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${generictrapImg})`;
    item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/generictrap'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'GenericTrap');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const pDz = 1, px = [-1, -1, 1, 1, -0.5, -0.5, 0.5, 0.5], py = [-1, 1, 1, -1, -0.5, 0.5, 0.5, -0.5];
        const geometry = new aGenericTrapGeometry( pDz, px, py );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'GenericTrap'

        
        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const pDz = 1, px = [-1, -1, 1, 1, -0.5, -0.5, 0.5, 0.5], py = [-1, 1, 1, -1, -0.5, 0.5, 0.5, -0.5];
        const geometry = new aGenericTrapGeometry( pDz, px, py );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'GenericTrap'
        
        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);



    // PrabolicCylinder model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${paraboloidImg})`;
    item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/aparaboloid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Paraboloid');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        // we need to new each geometry module

        var radius1 = 5, radius2 = 7, pDz = 10;
        const geometry = new aParaboloidGeometry( radius1 , radius2 , pDz );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Paraboloid';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        var radius1 = 5, radius2 = 7, pDz = 10;
        const geometry = new aParaboloidGeometry( radius1 , radius2 , pDz );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Paraboloid';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);



    // Hyperboloid model

    item = new UIDiv();
    item.setClass('Category-item');
    item.dom.style.filter = 'blur(2px)';

    item.dom.style.backgroundImage = `url(${hyperboloidImg})`;

    item.setTextContent(strings.getKey('menubar/add/ahyperboloid'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Hyperboloid');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        // we need to new each geometry module

        var radiusOut = 1, radiusIn = 0.5, stereo1 = 70, stereo2 = 70, pDz = 10;
        const geometry = new aHyperboloidGeometry( radiusOut, radiusIn, stereo1, stereo2, pDz );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Hyperboloid';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        var radiusOut = 1, radiusIn = 0.5, stereo1 = 70, stereo2 = 70, pDz = 10;
        const geometry = new aHyperboloidGeometry( radiusOut, radiusIn, stereo1, stereo2, pDz );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        finalMesh.name = 'Hyperboloid';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    //Polycons model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${solidconeImg})`;
    item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/polycone'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Polycone');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const SPhi = 0, DPhi = 270, numZPlanes = 9, rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];
        const geometry = new aPolyconeGeometry( SPhi , DPhi , numZPlanes , rInner , rOuter , z );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        finalMesh.name = 'Polycone';
        
        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const SPhi = 0, DPhi = 270, numZPlanes = 9, rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];
        const geometry = new aPolyconeGeometry( SPhi , DPhi , numZPlanes , rInner , rOuter , z );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        finalMesh.name = 'Polycone';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);

    //PolyHedra model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${solidpolyhedraImg})`;
    item.dom.style.filter = 'blur(2px)';

    item.setTextContent(strings.getKey('menubar/add/polyhedra'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Polyhedra');

    tippy(item.dom, { //For comment
        content: 'Under Development',
        placement: 'top', 
    });

    item.onClick(function () {

        const SPhi = 30 , DPhi = 210 , numSide = 3 , numZPlanes = 9 , rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01] , rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];
        const geometry = new aPolyhedraGeometry( SPhi, DPhi, numSide, numZPlanes, rInner, rOuter, z );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        finalMesh.name = 'Polyhedra';


        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    item.dom.addEventListener('dragend', function (event) {

        var position = getPositionFromMouse(event);        

        const SPhi = 30, DPhi = 210, numSide = 3, numZPlanes = 9, rInner = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter = [0, 1.0, 1.0, .5, .5, 1.0, 1.0, .2, .2], z = [.5, .7, .9, 1.1, 2.5, 2.7, 2.9, 3.1, 3.5];
        const geometry = new aPolyhedraGeometry( SPhi, DPhi, numSide, numZPlanes, rInner, rOuter, z );
        const finalMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        finalMesh.name = 'Polyhedra';

        finalMesh.position.copy(position);

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    return container;
}

export { BasicSolids };
