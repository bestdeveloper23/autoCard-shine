import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';
import { PolyconeGeometry } from './libs/geometry/PolyconeGeometry.js';

import { UIDiv, UIPanel, UIRow } from "./libs/ui.js";

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import radiationsourceImg from '../images/basicmodels/radiationSource.jpg'
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

function ModelCategory(editor) {
    const strings = editor.strings;
    const camera = editor.camera;

    const renderer = document.getElementById('viewport');

    const container = new UIPanel();
    container.setId('Category');

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
    
    // Box model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${boxImg})`;

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

    item.dom.style.backgroundImage = `url(${shpereImg})`;

    item.setTextContent(strings.getKey('menubar/add/sphere'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Sphere');
    item.onClick(function () {

        const geometry = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI);
        geometry.type = 'SphereGeometry2';
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
        geometry.type = 'SphereGeometry2';
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        mesh.position.copy(position);
        mesh.name = 'Sphere';

        editor.execute(new AddObjectCommand(editor, mesh));

    });

    options.add(item);


    // Tube model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${tubImg})`;

    item.setTextContent(strings.getKey('menubar/add/g4tube'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'eTub');
    item.onClick(function () {

        // we need to new each geometry module

        var pRMin = 1, pRMax = 1.5, pDz = 2, SPhi = 0, DPhi = 90;

        const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        cylindermesh1.rotateX(Math.PI / 2);
        cylindermesh1.updateMatrix();

        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
        cylindermesh2.rotateX(Math.PI / 2);
        cylindermesh2.updateMatrix();

        const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, pDz);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
        const MeshCSG1 = CSG.fromMesh(cylindermesh1);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let aCSG;
        aCSG = MeshCSG1.subtract(MeshCSG2);

        let bCSG;
        bCSG = MeshCSG1.subtract(MeshCSG2);

        if (DPhi > 270) {
            let v_DPhi = 360 - DPhi;

            boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - v_DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / 2;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
            aCSG = aCSG.subtract(bCSG);

        } else {

            boxmesh.rotateZ(SPhi / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / (-2);
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
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

        const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        cylindermesh1.rotateX(Math.PI / 2);
        cylindermesh1.updateMatrix();

        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
        cylindermesh2.rotateX(Math.PI / 2);
        cylindermesh2.updateMatrix();

        const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, pDz);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());
        boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);

        const MeshCSG1 = CSG.fromMesh(cylindermesh1);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let aCSG;
        aCSG = MeshCSG1.subtract(MeshCSG2);

        let bCSG;
        bCSG = MeshCSG1.subtract(MeshCSG2);

        if (DPhi > 270) {
            let v_DPhi = 360 - DPhi;

            boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI * (-1));
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - v_DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / 2;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
            aCSG = aCSG.subtract(bCSG);

        } else {

            boxmesh.rotateZ(SPhi / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / (-2);
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
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

    item.dom.style.backgroundImage = `url(${cuttubImg})`;

    item.setTextContent(strings.getKey('menubar/add/g4cuttube'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'cutTub');
    item.onClick(function () {

        // we need to new each geometry module

        var pRMin = 1, pRMax = 1.5, pDz = 4, SPhi = 0, DPhi = 270, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);

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
        cylindermesh1.rotateX(Math.PI / 2);
        cylindermesh1.updateMatrix();

        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
        cylindermesh2.rotateX(Math.PI / 2);
        cylindermesh2.updateMatrix();

        const maxdis = Math.max(pRMax, pRMin, pDz);

        const boxgeometry1 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
        const boxmesh1 = new THREE.Mesh(boxgeometry1, new THREE.MeshStandardMaterial());

        const boxgeometry2 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
        const boxmesh2 = new THREE.Mesh(boxgeometry2, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, 2 * Math.sqrt(2) * maxdis);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());


        boxmesh1.geometry.translate(0, 0, Math.sqrt(2) * maxdis);
        const MeshCSG1 = CSG.fromMesh(cylindermesh1);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);
        let MeshCSG3 = CSG.fromMesh(boxmesh1);

        let aCSG;
        aCSG = MeshCSG1.subtract(MeshCSG2);


        if (CutTube_vectorVertical(pHighNorm) === false) {

            let rotateX = Math.atan(pHighNorm.z / pHighNorm.y);
            let rotateY = Math.atan(pHighNorm.x / pHighNorm.y);
            let rotateZ = Math.atan(pHighNorm.z / pHighNorm.x);

            if (rotateX === Infinity) rotateX = boxmesh1.rotation.x;
            if (rotateY === Infinity) rotateY = boxmesh1.rotation.y;
            if (rotateZ === Infinity) rotateZ = boxmesh1.rotation.z;

            boxmesh1.rotation.set(-rotateX, -rotateY, -rotateZ);
        }

        boxmesh1.position.set(0, 0, maxdis / 2);
        boxmesh1.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh1);

        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh2.geometry.translate(0, 0, -Math.sqrt(2) * pDz);
        if (!CutTube_vectorVertical(pLowNorm)) {

            let rotateX = Math.atan(pLowNorm.z / pLowNorm.y);
            let rotateY = Math.atan(pLowNorm.x / pLowNorm.y);
            let rotateZ = Math.atan(pLowNorm.z / pLowNorm.x);

            if (rotateX === Infinity) rotateX = boxmesh2.rotation.x;
            if (rotateY === Infinity) rotateY = boxmesh2.rotation.y;
            if (rotateZ === Infinity) rotateZ = boxmesh2.rotation.z;

            boxmesh2.rotation.set(-rotateX, -rotateY, -rotateZ);
        }

        boxmesh2.position.set(0, 0, -maxdis / 2);
        boxmesh2.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh2);

        aCSG = aCSG.subtract(MeshCSG3);


        boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
        let bCSG = aCSG;

        if (DPhi > 270) {
            let v_DPhi = 360 - DPhi;

            boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - v_DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / 2;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
            aCSG = aCSG.subtract(bCSG);

        } else {

            boxmesh.rotateZ(SPhi / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / (-2);
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

        }

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'pHighNorm': pHighNorm, 'pLowNorm': pLowNorm };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aCutTubeGeometry';
        finalMesh.updateMatrix();
        finalMesh.name = 'CTubs';

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
        cylindermesh1.rotateX(Math.PI / 2);
        cylindermesh1.updateMatrix();

        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
        cylindermesh2.rotateX(Math.PI / 2);
        cylindermesh2.updateMatrix();

        const maxdis = Math.max(pRMax, pRMin, pDz);

        const boxgeometry1 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
        const boxmesh1 = new THREE.Mesh(boxgeometry1, new THREE.MeshStandardMaterial());

        const boxgeometry2 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
        const boxmesh2 = new THREE.Mesh(boxgeometry2, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, 2 * Math.sqrt(2) * maxdis);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());


        boxmesh1.geometry.translate(0, 0, Math.sqrt(2) * maxdis);
        const MeshCSG1 = CSG.fromMesh(cylindermesh1);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);
        let MeshCSG3 = CSG.fromMesh(boxmesh1);

        let aCSG;
        aCSG = MeshCSG1.subtract(MeshCSG2);


        if (CutTube_vectorVertical(pHighNorm) === false) {

            let rotateX = Math.atan(pHighNorm.z / pHighNorm.y);
            let rotateY = Math.atan(pHighNorm.x / pHighNorm.y);
            let rotateZ = Math.atan(pHighNorm.z / pHighNorm.x);

            if (rotateX === Infinity) rotateX = boxmesh1.rotation.x;
            if (rotateY === Infinity) rotateY = boxmesh1.rotation.y;
            if (rotateZ === Infinity) rotateZ = boxmesh1.rotation.z;

            boxmesh1.rotation.set(-rotateX, -rotateY, -rotateZ);
        }

        boxmesh1.position.set(0, 0, maxdis / 2);
        boxmesh1.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh1);

        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh2.geometry.translate(0, 0, -Math.sqrt(2) * pDz);
        if (!CutTube_vectorVertical(pLowNorm)) {

            let rotateX = Math.atan(pLowNorm.z / pLowNorm.y);
            let rotateY = Math.atan(pLowNorm.x / pLowNorm.y);
            let rotateZ = Math.atan(pLowNorm.z / pLowNorm.x);

            if (rotateX === Infinity) rotateX = boxmesh2.rotation.x;
            if (rotateY === Infinity) rotateY = boxmesh2.rotation.y;
            if (rotateZ === Infinity) rotateZ = boxmesh2.rotation.z;

            boxmesh2.rotation.set(-rotateX, -rotateY, -rotateZ);
        }

        boxmesh2.position.set(0, 0, -maxdis / 2);
        boxmesh2.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh2);

        aCSG = aCSG.subtract(MeshCSG3);


        boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
        let bCSG = aCSG;

        if (DPhi > 270) {
            let v_DPhi = 360 - DPhi;

            boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - v_DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / 2;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
            aCSG = aCSG.subtract(bCSG);

        } else {

            boxmesh.rotateZ(SPhi / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / (-2);
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

        }

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'pHighNorm': pHighNorm, 'pLowNorm': pLowNorm };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aCutTubeGeometry';
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        finalMesh.name = 'CTubs';
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

        var pRmin1 = 0.5, pRmax1 = 1, pRmin2 = 2, pRmax2 = 2.5, pDz = 4, SPhi = 0, DPhi = 270

        const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        cylindermesh1.rotateX(Math.PI / 2);
        cylindermesh1.updateMatrix();

        const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
        cylindermesh2.rotateX(Math.PI / 2);
        cylindermesh2.updateMatrix();

        const maxRadius = Math.max(pRmax1, pRmax2);
        const boxgeometry = new THREE.BoxGeometry(maxRadius, maxRadius, pDz);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        boxmesh.geometry.translate(maxRadius / 2, maxRadius / 2, 0);
        const MeshCSG1 = CSG.fromMesh(cylindermesh1);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let aCSG;

        aCSG = MeshCSG2.subtract(MeshCSG1);

        let bCSG;

        bCSG = MeshCSG2.subtract(MeshCSG1);


        if (DPhi > 270) {
            let v_DPhi = 360 - DPhi;

            boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - v_DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / 2;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
            aCSG = aCSG.subtract(bCSG);

        } else {

            boxmesh.rotateZ(SPhi / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / (-2);
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

        }

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'pRMax1': pRmax1, 'pRMin1': pRmin1, 'pRMax2': pRmax2, 'pRMin2': pRmin2, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aConeGeometry';
        finalMesh.updateMatrix();
        finalMesh.name = 'Cone';

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

        const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        cylindermesh1.rotateX(Math.PI / 2);
        cylindermesh1.updateMatrix();

        const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
        cylindermesh2.rotateX(Math.PI / 2);
        cylindermesh2.updateMatrix();

        const maxRadius = Math.max(pRmax1, pRmax2);
        const boxgeometry = new THREE.BoxGeometry(maxRadius, maxRadius, pDz);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        boxmesh.geometry.translate(maxRadius / 2, maxRadius / 2, 0);
        const MeshCSG1 = CSG.fromMesh(cylindermesh1);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let aCSG;

        aCSG = MeshCSG2.subtract(MeshCSG1);

        let bCSG;

        bCSG = MeshCSG2.subtract(MeshCSG1);


        if (DPhi > 270) {
            let v_DPhi = 360 - DPhi;

            boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - v_DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / 2;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
            aCSG = aCSG.subtract(bCSG);

        } else {

            boxmesh.rotateZ(SPhi / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / (-2);
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
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


    // Parallelepiped model

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${paraImg})`;

    item.setTextContent(strings.getKey('menubar/add/apara'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Parallelediped');
    item.onClick(function () {

        const dx = 1, dy = 2, dz = 1, alpha = -10, theta = 10, phi = -10;
        const maxRadius = Math.max(dx, dy, dz);
        const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        boxmesh.geometry.translate(2 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 + dx / 2, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 - dx / 2, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, dz / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -4 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, -dz / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
        boxmesh.position.set(0, dy / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.geometry.translate(0, -4 * maxRadius, 0);
        boxmesh.position.set(0, - dy / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': alpha, 'theta': theta, 'phi': phi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aParallGeometry';
        finalMesh.rotateX(Math.PI/2);
        finalMesh.updateMatrix();
        finalMesh.name = 'Parallelepiped';

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

        const dx = 1, dy = 2, dz = 1, alpha = -10, theta = 10, phi = -10;
        const maxRadius = Math.max(dx, dy, dz);
        const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        boxmesh.geometry.translate(2 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 + dx / 2, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0 - dx / 2, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, dz / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -4 * maxRadius);
        boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
        boxmesh.position.set(0, 0, -dz / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
        boxmesh.position.set(0, dy / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.geometry.translate(0, -4 * maxRadius, 0);
        boxmesh.position.set(0, - dy / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': alpha, 'theta': theta, 'phi': phi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aParallGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI/2);
        finalMesh.updateMatrix();
        finalMesh.name = 'Parallelepiped';

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

        
        const x1 = 2, y1 = 2, z = 5, x2 = 1, y2 = 1;
        
        var trd = new THREE.BufferGeometry();

        const points = [
            new THREE.Vector3(-x2, -y2, z),//2
            new THREE.Vector3(-x2, y2, z),//1
            new THREE.Vector3(x2, y2, z),//0

            new THREE.Vector3(x2, y2, z),//0
            new THREE.Vector3(x2, -y2, z),//3
            new THREE.Vector3(-x2, -y2, z),//2

            new THREE.Vector3(x1, y1, -z),//4
            new THREE.Vector3(-x1, y1, -z),//5
            new THREE.Vector3(-x1, -y1, -z),//6

            new THREE.Vector3(-x1, -y1, -z),//6
            new THREE.Vector3(x1, -y1, -z),//7
            new THREE.Vector3(x1, y1, -z),//4

            new THREE.Vector3(x2, y2, z),//0
            new THREE.Vector3(x1, y1, -z),//4
            new THREE.Vector3(x1, -y1, -z),//7

            new THREE.Vector3(x1, -y1, -z),//7
            new THREE.Vector3(x2, -y2, z),//3
            new THREE.Vector3(x2, y2, z),//0

            new THREE.Vector3(-x2, y2, z),//1
            new THREE.Vector3(-x2, -y2, z),//2
            new THREE.Vector3(-x1, -y1, -z),//6

            new THREE.Vector3(-x1, -y1, -z),//6
            new THREE.Vector3(-x1, y1, -z),//5
            new THREE.Vector3(-x2, y2, z),//1

            new THREE.Vector3(-x2, y2, z),//1
            new THREE.Vector3(-x1, y1, -z),//5
            new THREE.Vector3(x1, y1, -z),//4

            new THREE.Vector3(x1, y1, -z),//4
            new THREE.Vector3(x2, y2, z),//0
            new THREE.Vector3(-x2, y2, z),//1

            new THREE.Vector3(-x2, -y2, z),//2
            new THREE.Vector3(x2, -y2, z),//3
            new THREE.Vector3(x1, -y1, -z),//7

            new THREE.Vector3(x1, -y1, -z),//7
            new THREE.Vector3(-x1, -y1, -z),//6
            new THREE.Vector3(-x2, -y2, z),//2
        ]

        trd.setFromPoints(points);

        const param = { 'dx1': x1, 'dy1': y1, 'dz': z, 'dx2': x2, 'dy2': y2 };
        trd.parameters = param;
        trd.type = 'aTrapeZoidGeometry';
        const finalMesh = new THREE.Mesh(trd, new THREE.MeshStandardMaterial())
        finalMesh.updateMatrix();
        finalMesh.name = 'TrapeZoid';

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
        var mouseScenePosition = new THREE.THREE.Vector3(mouseSceneX, mouseSceneY, 0);

        mouseScenePosition.unproject(camera);
        var direction = mouseScenePosition.sub(camera.position).normalize();
        var distance = -camera.position.y / direction.y;
        var position = camera.position.clone().add(direction.multiplyScalar(distance));


        const x1 = 2, y1 = 2, z = 5, x2 = 1, y2 = 1;
        
        var trd = new THREE.BufferGeometry();

        const points = [
            new THREE.Vector3(-x2, -y2, z),//2
            new THREE.Vector3(-x2, y2, z),//1
            new THREE.Vector3(x2, y2, z),//0

            new THREE.Vector3(x2, y2, z),//0
            new THREE.Vector3(x2, -y2, z),//3
            new THREE.Vector3(-x2, -y2, z),//2

            new THREE.Vector3(x1, y1, -z),//4
            new THREE.Vector3(-x1, y1, -z),//5
            new THREE.Vector3(-x1, -y1, -z),//6

            new THREE.Vector3(-x1, -y1, -z),//6
            new THREE.Vector3(x1, -y1, -z),//7
            new THREE.Vector3(x1, y1, -z),//4

            new THREE.Vector3(x2, y2, z),//0
            new THREE.Vector3(x1, y1, -z),//4
            new THREE.Vector3(x1, -y1, -z),//7

            new THREE.Vector3(x1, -y1, -z),//7
            new THREE.Vector3(x2, -y2, z),//3
            new THREE.Vector3(x2, y2, z),//0

            new THREE.Vector3(-x2, y2, z),//1
            new THREE.Vector3(-x2, -y2, z),//2
            new THREE.Vector3(-x1, -y1, -z),//6

            new THREE.Vector3(-x1, -y1, -z),//6
            new THREE.Vector3(-x1, y1, -z),//5
            new THREE.Vector3(-x2, y2, z),//1

            new THREE.Vector3(-x2, y2, z),//1
            new THREE.Vector3(-x1, y1, -z),//5
            new THREE.Vector3(x1, y1, -z),//4

            new THREE.Vector3(x1, y1, -z),//4
            new THREE.Vector3(x2, y2, z),//0
            new THREE.Vector3(-x2, y2, z),//1

            new THREE.Vector3(-x2, -y2, z),//2
            new THREE.Vector3(x2, -y2, z),//3
            new THREE.Vector3(x1, -y1, -z),//7

            new THREE.Vector3(x1, -y1, -z),//7
            new THREE.Vector3(-x1, -y1, -z),//6
            new THREE.Vector3(-x2, -y2, z),//2
        ]

        trd.setFromPoints(points);

        const param = { 'dx1': x1, 'dy1': y1, 'dz': z, 'dx2': x2, 'dy2': y2 };
        trd.parameters = param;
        trd.type = 'aTrapeZoidGeometry';
        const finalMesh = new THREE.Mesh(trd, new THREE.MeshStandardMaterial())
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        finalMesh.name = 'TrapeZoid';


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
        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

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


        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aTrapeZoidPGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'aTrapeZoidP';

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
        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

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


        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aTrapeZoidPGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'aTrapeZoidP';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    // Tors model

    item = new UIDiv();
    item.setClass('Category-item');
    item.dom.style.backgroundImage = `url(${torusImg})`;

    item.setTextContent(strings.getKey('menubar/add/atorus'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'Torus');
    item.onClick(function () {

        const pRMin = 1, pRMax = 1.5, pRtor = 5, SPhi = 0, DPhi = 90;


        const torgeometry1 = new THREE.TorusGeometry(pRtor, pRMax, 16, 48);
        const tormesh1 = new THREE.Mesh(torgeometry1, new THREE.MeshStandardMaterial());
        tormesh1.rotateX(Math.PI / 2);
        tormesh1.updateMatrix();

        const torgeometry2 = new THREE.TorusGeometry(pRtor, pRMin, 16, 48);
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
        const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pRTor': pRtor, 'pSPhi': SPhi, 'pDPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aTorusGeometry';
        finalMesh.updateMatrix();
        finalMesh.name = 'aTorus';

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

        const pRMin = 1, pRMax = 1.5, pRtor = 5, SPhi = 0, DPhi = 90;


        const torgeometry1 = new THREE.TorusGeometry(pRtor, pRMax, 16, 48);
        const tormesh1 = new THREE.Mesh(torgeometry1, new THREE.MeshStandardMaterial());
        tormesh1.rotateX(Math.PI / 2);
        tormesh1.updateMatrix();

        const torgeometry2 = new THREE.TorusGeometry(pRtor, pRMin, 16, 48);
        const tormesh2 = new THREE.Mesh(torgeometry2, new THREE.MeshStandardMaterial());
        tormesh2.rotateX(Math.PI / 2);
        tormesh1.updateMatrix();

        const boxgeometry = new THREE.BoxGeometry(pRtor + pRMax, pRtor + pRMax, pRtor + pRMax);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        boxmesh.geometry.translate((pRtor + pRMax) / 2, 0, (pRtor + pRMax) / 2);
        const MeshCSG1 = CSG.fromMesh(tormesh1);
        const MeshCSG2 = CSG.fromMesh(tormesh2);
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
        const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pRTor': pRtor, 'pSPhi': SPhi, 'pDPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aTorusGeometry';
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        finalMesh.name = 'aTorus';

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

        var xSemiAxis = 1, semiAxisY = 2, Dz = 4;

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz, 32, 1, false, 0, Math.PI * 2);
        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        const ratioZ = semiAxisY / xSemiAxis;
        cylindermesh.scale.z = ratioZ;
        cylindermesh.updateMatrix();
        const aCSG = CSG.fromMesh(cylindermesh);
		const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'EllipeCylnder';

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


        var xSemiAxis = 1, semiAxisY = 2, Dz = 4;

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz, 32, 1, false, 0, Math.PI * 2);
        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        const ratioZ = semiAxisY / xSemiAxis;
        cylindermesh.scale.z = ratioZ;
        cylindermesh.updateMatrix();
        const aCSG = CSG.fromMesh(cylindermesh);
		const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'EllipeCylnder';

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

        var xSemiAxis = 1, ySemiAxis = 1.5, zSemiAxis = 4, zTopCut = 3, zBottomCut = -2;

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, zTopCut - zBottomCut, 32, 256, false, 0, Math.PI * 2);

        cylindergeometry1.translate(0, (zTopCut + zBottomCut)/2, 0);

        let positionAttribute = cylindergeometry1.getAttribute('position');

        let vertex = new THREE.Vector3();

        function calculate_normal_vector(x, y, z, a, b, c) {
            // Calculate the components of the normal vector
            let nx = 2 * (x / a ** 2)
            let ny = 2 * (y / b ** 2)
            let nz = 2 * (z / c ** 2)

            // Normalize the normal vector
            let magnitude = Math.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
            nx /= magnitude
            ny /= magnitude
            nz /= magnitude
            let normal = { x: nx, y: ny, z: nz };
            return normal;
        }
        for (let i = 0; i < positionAttribute.count; i++) {

            vertex.fromBufferAttribute(positionAttribute, i);
            let x, y, z;
            x = vertex.x, y = vertex.y;
            let k = 0;
            do {
                x = vertex.x + k;
                if (Math.abs(x) < 0) {
                    x = vertex.x;
                    break;
                }
                if (vertex.z > 0) {
                    z = ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                } else {
                    z = -ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                }
                if (x > 0) {
                    k -= 0.01
                } else {
                    k += 0.01;
                }

            } while (!z);


            cylindergeometry1.attributes.position.array[i * 3] = x;
            cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
            cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

            let normal = calculate_normal_vector(x, y, z, xSemiAxis, zSemiAxis, ySemiAxis)
            cylindergeometry1.attributes.normal.array[i * 3] = normal.x;
            cylindergeometry1.attributes.normal.array[i * 3 + 1] = normal.y;
            cylindergeometry1.attributes.normal.array[i * 3 + 2] = normal.z;

        }
        cylindergeometry1.attributes.position.needsUpdate = true;

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

        const finalMesh = cylindermesh;
        const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'zSemiAxis': zSemiAxis, 'zTopCut': zTopCut, 'zBottomCut': zBottomCut };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aEllipsoidGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'Ellipsoid';

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

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, zTopCut - zBottomCut, 32, 256, false, 0, Math.PI * 2);

        cylindergeometry1.translate(0, (zTopCut + zBottomCut)/2, 0);

        let positionAttribute = cylindergeometry1.getAttribute('position');

        let vertex = new THREE.Vector3();

        function calculate_normal_vector(x, y, z, a, b, c) {
            // Calculate the components of the normal vector
            let nx = 2 * (x / a ** 2)
            let ny = 2 * (y / b ** 2)
            let nz = 2 * (z / c ** 2)

            // Normalize the normal vector
            let magnitude = Math.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
            nx /= magnitude
            ny /= magnitude
            nz /= magnitude
            let normal = { x: nx, y: ny, z: nz };
            return normal;
        }
        for (let i = 0; i < positionAttribute.count; i++) {

            vertex.fromBufferAttribute(positionAttribute, i);
            let x, y, z;
            x = vertex.x, y = vertex.y;
            let k = 0;
            do {
                x = vertex.x + k;
                if (Math.abs(x) < 0) {
                    x = vertex.x;
                    break;
                }
                if (vertex.z > 0) {
                    z = ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                } else {
                    z = -ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                }
                if (x > 0) {
                    k -= 0.01
                } else {
                    k += 0.01;
                }

            } while (!z);


            cylindergeometry1.attributes.position.array[i * 3] = x;
            cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
            cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

            let normal = calculate_normal_vector(x, y, z, xSemiAxis, zSemiAxis, ySemiAxis)
            cylindergeometry1.attributes.normal.array[i * 3] = normal.x;
            cylindergeometry1.attributes.normal.array[i * 3 + 1] = normal.y;
            cylindergeometry1.attributes.normal.array[i * 3 + 2] = normal.z;

        }
        cylindergeometry1.attributes.position.needsUpdate = true;

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

        const finalMesh = cylindermesh;
        const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'zSemiAxis': zSemiAxis, 'zTopCut': zTopCut, 'zBottomCut': zBottomCut };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aEllipsoidGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'Ellipsoid';

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

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * ((height - zTopCut) / height), xSemiAxis, zTopCut, 32, 32, false, 0, Math.PI * 2);
        cylindergeometry1.translate(0, zTopCut / 2, 0)
        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        const ratioZ = ySemiAxis / xSemiAxis;

        cylindermesh.scale.z = ratioZ;
        cylindermesh.updateMatrix();
        const aCSG = CSG.fromMesh(cylindermesh);
        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'height': height, 'zTopCut': zTopCut };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aEllipticalConeGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'aEllipticalCone';

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

        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * ((height - zTopCut) / height), xSemiAxis, zTopCut, 32, 32, false, 0, Math.PI * 2);
        cylindergeometry1.translate(0, zTopCut / 2, 0)
        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        const ratioZ = ySemiAxis / xSemiAxis;

        cylindermesh.scale.z = ratioZ;
        cylindermesh.updateMatrix();
        const aCSG = CSG.fromMesh(cylindermesh);
        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'height': height, 'zTopCut': zTopCut };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aEllipticalConeGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'aEllipticalCone';

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

        const twistedangle = 30, pDx = 1, pDy = 2, pDz = 1;
        const geometry = new THREE.BoxGeometry(pDx, pDy, pDz, 32, 32, 32);
        geometry.type = 'aTwistedBoxGeometry';
        const positionAttribute = geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle / 180 * Math.PI);
            geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        const param = { 'width': pDx, 'height': pDy, 'depth': pDz, 'angle': twistedangle };
        geometry.parameters = param;
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'TwistedBox';
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
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


        const twistedangle = 30, pDx = 1, pDy = 2, pDz = 1;
        const geometry = new THREE.BoxGeometry(pDx, pDy, pDz, 32, 32, 32);
        geometry.type = 'aTwistedBoxGeometry';
        const positionAttribute = geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle / 180 * Math.PI);
            geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        const param = { 'width': pDx, 'height': pDy, 'depth': pDz, 'angle': twistedangle };
        geometry.parameters = param;
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.position.copy(position);
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        mesh.name = 'TwistedBox';

        editor.execute(new AddObjectCommand(editor, mesh));

    });

    options.add(item);

    // Twisted Trapezoid1

    item = new UIDiv();
    item.setClass('Category-item');

    item.dom.style.backgroundImage = `url(${twistedtrdImg})`;

    item.setTextContent(strings.getKey('menubar/add/atwistedtrd'));
    item.dom.setAttribute('draggable', true);
    item.dom.setAttribute('item-type', 'TrapeZoid3');
    item.onClick(function () {

        const dx1 = 2, dy1 = 2, dz = 5, dx2 = 1, dy2 = 1, twistedangle = 30;
        const maxdis = Math.max(dx1, dy1, dx2, dy2, dz);
        const maxwidth = Math.max(dx1, dy1, dx2, dy2);
        const geometry = new THREE.BoxGeometry(maxwidth, dz, maxwidth, 32, 32, 32);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let alpha = Math.atan((dx1 - dx2) / 2 / dz);
        let phi = Math.atan((dy1 - dy2) / 2 / dz);

        boxmesh.geometry.translate(maxdis, maxdis, 0);
        boxmesh.rotation.set(0, 0, phi);
        boxmesh.position.set(0 + dx1 / 2, -dz / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-2 * maxdis, 0, 0);
        boxmesh.rotation.set(0, 0, -phi);
        boxmesh.position.set(0 - dx1 / 2, -dz / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(maxdis, 0, maxdis);
        boxmesh.rotation.set(-alpha, 0, 0);
        boxmesh.position.set(0, -dz / 2, dy1 / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -2 * maxdis);
        boxmesh.rotation.set(alpha, 0, 0);
        boxmesh.position.set(0, -dz / 2, -dy1 / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': twistedangle };
        finalMesh.geometry.parameters = param;

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.geometry.type = 'aTwistedTrdGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'TwistedTrapeZoid';

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


        const dx1 = 2, dy1 = 2, dz = 5, dx2 = 1, dy2 = 1, twistedangle = 30;
        const maxdis = Math.max(dx1, dy1, dx2, dy2, dz);
        const maxwidth = Math.max(dx1, dy1, dx2, dy2);
        const geometry = new THREE.BoxGeometry(maxwidth, dz, maxwidth, 32, 32, 32);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let alpha = Math.atan((dx1 - dx2) / 2 / dz);
        let phi = Math.atan((dy1 - dy2) / 2 / dz);

        boxmesh.geometry.translate(maxdis, maxdis, 0);
        boxmesh.rotation.set(0, 0, phi);
        boxmesh.position.set(0 + dx1 / 2, -dz / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-2 * maxdis, 0, 0);
        boxmesh.rotation.set(0, 0, -phi);
        boxmesh.position.set(0 - dx1 / 2, -dz / 2, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(maxdis, 0, maxdis);
        boxmesh.rotation.set(-alpha, 0, 0);
        boxmesh.position.set(0, -dz / 2, dy1 / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -2 * maxdis);
        boxmesh.rotation.set(alpha, 0, 0);
        boxmesh.position.set(0, -dz / 2, -dy1 / 2);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': twistedangle };
        finalMesh.geometry.parameters = param;

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.geometry.type = 'aTwistedTrdGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        finalMesh.name = 'TwistedTrapeZoid';


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

        const pDx1 = 0.5, pDx2 = 1, pDy1 = 1.5, pDx3 = 1.5, pDx4 = 2, pDy2 = 1.6, pDz = 4, pTheta = 20, pPhi = 5, pAlpha = 10, twistedangle = 30;
        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

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


        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi, 'twistedangle': twistedangle };
        finalMesh.geometry.parameters = param;

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.geometry.type = 'aTwistedTrapGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'TwistedTrapeZoidP';

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

        const pDx1 = 0.5, pDx2 = 1, pDy1 = 1.5, pDx3 = 1.5, pDx4 = 2, pDy2 = 1.6, pDz = 4, pTheta = 20, pPhi = 5, pAlpha = 10, twistedangle = 30;
        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

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


        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi, 'twistedangle': twistedangle };
        finalMesh.geometry.parameters = param;

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.geometry.type = 'aTwistedTrapGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'TwistedTrapeZoidP';

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

        var pRMin = 1, pRMax = 1.5, pDz = 2, SPhi = 0, DPhi = 90, twistedangle = 30;

        const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(pRMax, pDz, pRMax, 32, 32, 32);
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
        const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };
        finalMesh.geometry.parameters = param;

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.geometry.type = 'aTwistedTubeGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'TwistedTubs';

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

        var pRMin = 1, pRMax = 1.5, pDz = 2, SPhi = 0, DPhi = 90, twistedangle = 30;

        const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

        const boxgeometry = new THREE.BoxGeometry(pRMax, pDz, pRMax);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());
        boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2, 32, 32, 32);
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
        const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };
        finalMesh.geometry.parameters = param;

        const positionAttribute = finalMesh.geometry.getAttribute('position');

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.geometry.type = 'aTwistedTubeGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'TwistedTubs';

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
        const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
        geometry.parameters = param;
        geometry.type = 'aTetrahedraGeometry';
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Tetrahedra';
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        
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
        const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
        geometry.parameters = param;
        geometry.type = 'aTetrahedraGeometry';
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'Tetrahedra';
        mesh.position.copy(position);
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();

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
        const param = { 'pDz': pDz, 'px': px, 'py': py };
        geometry.parameters = param;
        geometry.type = 'aGenericTrapGeometry';
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'GenericTrap';

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
        const param = { 'pDz': pDz, 'px': px, 'py': py };
        geometry.parameters = param;
        geometry.type = 'aGenericTrapGeometry';
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
        mesh.name = 'GenericTrap';
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
        const k2 = (Math.pow(radius1, 2) + Math.pow(radius2, 2)) / 2, k1 = (Math.pow(radius2, 2) - Math.pow(radius1, 2)) / pDz;

        const cylindergeometry1 = new THREE.CylinderGeometry(radius2, radius1, pDz, 32, 32, false, 0, Math.PI * 2);

        // cylindergeometry1.translate(0, zTopCut + zBottomCut, 0);

        let positionAttribute = cylindergeometry1.getAttribute('position');

        let vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {

            vertex.fromBufferAttribute(positionAttribute, i);
            let x, y, z;
            x = vertex.x;
            y = vertex.y;
            z = vertex.z;
            let r = Math.sqrt((y * k1 + k2));

            let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

            if (vertex.z >= 0) {
                z = Math.abs(r * Math.sin(alpha));
            } else {
                z = - Math.abs(r * Math.sin(alpha));
            }
            if (vertex.x >= 0) {
                x = r * Math.cos(alpha);
            } else {
                x = -r * Math.cos(alpha);
            }

            cylindergeometry1.attributes.position.array[i * 3] = x;
            cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
            cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

        }
        cylindergeometry1.attributes.position.needsUpdate = true;

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

        const finalMesh = cylindermesh;
        const param = { 'R1': radius1, 'R2': radius2, 'pDz': pDz };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aParaboloidGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'Paraboloid';

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
        const k2 = (Math.pow(radius1, 2) + Math.pow(radius2, 2)) / 2, k1 = (Math.pow(radius2, 2) - Math.pow(radius1, 2)) / pDz;

        const cylindergeometry1 = new THREE.CylinderGeometry(radius2, radius1, pDz, 32, 32, false, 0, Math.PI * 2);

        // cylindergeometry1.translate(0, zTopCut + zBottomCut, 0);

        let positionAttribute = cylindergeometry1.getAttribute('position');

        let vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {

            vertex.fromBufferAttribute(positionAttribute, i);
            let x, y, z;
            x = vertex.x;
            y = vertex.y;
            z = vertex.z;
            let r = Math.sqrt((y * k1 + k2));

            let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

            if (vertex.z >= 0) {
                z = Math.abs(r * Math.sin(alpha));
            } else {
                z = - Math.abs(r * Math.sin(alpha));
            }
            if (vertex.x >= 0) {
                x = r * Math.cos(alpha);
            } else {
                x = -r * Math.cos(alpha);
            }

            cylindergeometry1.attributes.position.array[i * 3] = x;
            cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
            cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

        }
        cylindergeometry1.attributes.position.needsUpdate = true;

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

        const finalMesh = cylindermesh;
        const param = { 'R1': radius1, 'R2': radius2, 'pDz': pDz };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aParaboloidGeometry';
        finalMesh.position.copy(position);
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        finalMesh.name = 'Paraboloid';

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

        var radiusOut = 1, radiusIn = 0.5, stereo1 = 30, stereo2 = 30, pDz = 6;
        const c_z1 = Math.tan(stereo1 * Math.PI / 180 / 2);
        const c_z2 = Math.tan(stereo2 * Math.PI / 180 / 2);
        const cylindergeometry1 = new THREE.CylinderGeometry(radiusOut, radiusOut, pDz, 32, 16, false, 0, Math.PI * 2);
        const cylindergeometry2 = new THREE.CylinderGeometry(radiusIn, radiusIn, pDz, 32, 16, false, 0, Math.PI * 2);

        let positionAttribute = cylindergeometry1.getAttribute('position');
        let positionAttribute2 = cylindergeometry2.getAttribute('position');
        let vertex = new THREE.Vector3();
        let vertex2 = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {

            vertex.fromBufferAttribute(positionAttribute, i);
            vertex2.fromBufferAttribute(positionAttribute2, i);
            let x, y, z, x2, y2, z2;
            x = vertex.x;
            y = vertex.y;
            z = vertex.z;
            x2 = vertex2.x;
            y2 = vertex2.y;
            z2 = vertex2.z;
            let r = radiusOut * Math.sqrt((1 + Math.pow((y / c_z1), 2)));
            let r2 = radiusIn * Math.sqrt((1 + Math.pow((y2 / c_z2), 2)));

            let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

            if (vertex.z >= 0) {
                z = Math.abs(r * Math.sin(alpha));
                z2 = Math.abs(r2 * Math.sin(alpha));
            } else {
                z = - Math.abs(r * Math.sin(alpha));
                z2 = - Math.abs(r2 * Math.sin(alpha));
            }
            if (vertex.x >= 0) {
                x = r * Math.cos(alpha);
                x2 = r2 * Math.cos(alpha);
            } else {
                x = -r * Math.cos(alpha);
                x2 = -r2 * Math.cos(alpha);
            }

            cylindergeometry1.attributes.position.array[i * 3] = x;
            cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
            cylindergeometry1.attributes.position.array[i * 3 + 2] = z;


            cylindergeometry2.attributes.position.array[i * 3] = x2;
            cylindergeometry2.attributes.position.array[i * 3 + 1] = y2;
            cylindergeometry2.attributes.position.array[i * 3 + 2] = z2;

        }
        cylindergeometry1.attributes.position.needsUpdate = true;
        cylindergeometry2.attributes.position.needsUpdate = true;

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

        const MeshCSG1 = CSG.fromMesh(cylindermesh);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);

        let aCSG = MeshCSG1.subtract(MeshCSG2);

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pDz };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aHyperboloidGeometry';
        finalMesh.updateMatrix();
        finalMesh.name = 'Hyperboloid';

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


        var radiusOut = 1, radiusIn = 0.5, stereo1 = 30, stereo2 = 30, pDz = 6;
        const c_z1 = Math.tan(stereo1 * Math.PI / 180 / 2);
        const c_z2 = Math.tan(stereo2 * Math.PI / 180 / 2);
        const cylindergeometry1 = new THREE.CylinderGeometry(radiusOut, radiusOut, pDz, 32, 16, false, 0, Math.PI * 2);
        const cylindergeometry2 = new THREE.CylinderGeometry(radiusIn, radiusIn, pDz, 32, 16, false, 0, Math.PI * 2);

        let positionAttribute = cylindergeometry1.getAttribute('position');
        let positionAttribute2 = cylindergeometry2.getAttribute('position');
        let vertex = new THREE.Vector3();
        let vertex2 = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {

            vertex.fromBufferAttribute(positionAttribute, i);
            vertex2.fromBufferAttribute(positionAttribute2, i);
            let x, y, z, x2, y2, z2;
            x = vertex.x;
            y = vertex.y;
            z = vertex.z;
            x2 = vertex2.x;
            y2 = vertex2.y;
            z2 = vertex2.z;
            let r = radiusOut * Math.sqrt((1 + Math.pow((y / c_z1), 2)));
            let r2 = radiusIn * Math.sqrt((1 + Math.pow((y2 / c_z2), 2)));

            let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

            if (vertex.z >= 0) {
                z = Math.abs(r * Math.sin(alpha));
                z2 = Math.abs(r2 * Math.sin(alpha));
            } else {
                z = - Math.abs(r * Math.sin(alpha));
                z2 = - Math.abs(r2 * Math.sin(alpha));
            }
            if (vertex.x >= 0) {
                x = r * Math.cos(alpha);
                x2 = r2 * Math.cos(alpha);
            } else {
                x = -r * Math.cos(alpha);
                x2 = -r2 * Math.cos(alpha);
            }

            cylindergeometry1.attributes.position.array[i * 3] = x;
            cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
            cylindergeometry1.attributes.position.array[i * 3 + 2] = z;


            cylindergeometry2.attributes.position.array[i * 3] = x2;
            cylindergeometry2.attributes.position.array[i * 3 + 1] = y2;
            cylindergeometry2.attributes.position.array[i * 3 + 2] = z2;

        }
        cylindergeometry1.attributes.position.needsUpdate = true;
        cylindergeometry2.attributes.position.needsUpdate = true;

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

        const MeshCSG1 = CSG.fromMesh(cylindermesh);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);

        let aCSG = MeshCSG1.subtract(MeshCSG2);

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pDz };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aHyperboloidGeometry';
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        finalMesh.name = 'Hyperboloid';

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

        const geometryIn = new PolyconeGeometry(numZPlanes, rInner, z, 32, 1, false, SPhi/180*Math.PI, DPhi/180*Math.PI);
        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, SPhi/180*Math.PI, DPhi/180*Math.PI);

        const meshIn = new THREE.Mesh(geometryIn, new THREE.MeshStandardMaterial());
        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());
        let maxWidth = Math.max(...rOuter);
        let maxHeight = Math.max(...z);

        const boxgeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());
        boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

        let MeshCSG1 = CSG.fromMesh(meshOut);
        let MeshCSG2 = CSG.fromMesh(meshIn);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
        const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.computeVertexNormals();
        finalMesh.geometry.type = 'aPolyconeGeometry';
        finalMesh.name = 'Polycone';
        finalMesh.updateMatrix();

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

        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI);

        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());

        let MeshCSG1 = CSG.fromMesh(meshOut);

        let aCSG;
        aCSG = MeshCSG1;

        const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
        const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.computeVertexNormals();
        finalMesh.geometry.type = 'aPolyconeGeometry';
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        finalMesh.name = 'Polycone';

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

        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI);

        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());

        let MeshCSG1 = CSG.fromMesh(meshOut);

        const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
        const param = { 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.computeVertexNormals();
        finalMesh.geometry.type = 'aPolyhedraGeometry';
        finalMesh.name = 'Polyhedra';
        finalMesh.updateMatrix();

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

        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI);

        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());

        let MeshCSG1 = CSG.fromMesh(meshOut);

        const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
        const param = {'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.computeVertexNormals();
        finalMesh.geometry.type = 'aPolyhedraGeometry';
        finalMesh.position.copy(position);
        finalMesh.updateMatrix();
        finalMesh.name = 'Polyhedra';

        editor.execute(new AddObjectCommand(editor, finalMesh));

    });

    options.add(item);


    return container;
}

export { ModelCategory };