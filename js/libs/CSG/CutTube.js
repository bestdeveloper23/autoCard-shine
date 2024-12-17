import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

function CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm ){
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

    const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2 * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
    const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
    cylindermesh1.rotateX(Math.PI / 2);
    cylindermesh1.updateMatrix();

    const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2 * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
    const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());
    cylindermesh2.rotateX(Math.PI / 2);
    cylindermesh2.updateMatrix();

    const maxdis = Math.max(pRMax, pRMin, pDz * 2);

    const boxgeometry1 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
    const boxmesh1 = new THREE.Mesh(boxgeometry1, new THREE.MeshBasicMaterial());

    const boxgeometry2 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
    const boxmesh2 = new THREE.Mesh(boxgeometry2, new THREE.MeshBasicMaterial());

    const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, 2 * Math.sqrt(2) * maxdis);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());


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

    boxmesh2.geometry.translate(0, 0, -Math.sqrt(2) * pDz * 2);
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

    if (DPhi > 270 && DPhi < 360) {
        let v_DPhi = 360 - DPhi;

        boxmesh.rotateZ((SPhi - 90) / 180 * Math.PI);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        bCSG = bCSG.subtract(MeshCSG3);

        let repeatCount = Math.floor((270 - v_DPhi) / 90);

        for (let i = 0; i < repeatCount; i++) {
            let rotateVaule = - Math.PI / 2;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
        }
        let rotateVaule = (-1) * (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
        boxmesh.rotateZ(rotateVaule);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        bCSG = bCSG.subtract(MeshCSG3);
        aCSG = aCSG.subtract(bCSG);

    } else if(DPhi <= 270){

        boxmesh.rotateZ((SPhi) / 180 * Math.PI);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let repeatCount = Math.floor((270 - DPhi) / 90);

        for (let i = 0; i < repeatCount; i++) {
            let rotateVaule = Math.PI / (2);
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);
        }
        let rotateVaule = (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
        boxmesh.rotateZ(rotateVaule);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

    }

    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'pHighNorm': pHighNorm, 'pLowNorm': pLowNorm };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aCutTubeGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'CTubs';

    return finalMesh;
}

export{CreateCutTube}





// import cuttubImg from '../images/basicmodels/aCutTube.jpg';


// // CutTube model

// item = new UIDiv();
// item.setClass('Category-item');

// item.dom.style.backgroundImage = `url(${cuttubImg})`;

// item.setTextContent(strings.getKey('menubar/add/g4cuttube'));
// item.dom.setAttribute('draggable', true);
// item.dom.setAttribute('item-type', 'cutTub');
// item.onClick(function () {

//     // we need to new each geometry module

//     var pRMin = 1, pRMax = 1.5, pDz = 4, SPhi = 0, DPhi = 270, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);
//     const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );

//     editor.execute(new AddObjectCommand(editor, finalMesh));

// });

// item.dom.addEventListener('dragend', function (event) {

//     var position = getPositionFromMouse(event);        

//     var pRMin = 1, pRMax = 1.5, pDz = 4, SPhi = 0, DPhi = 270, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);
//     const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );
//     finalMesh.position.copy(position);

//     editor.execute(new AddObjectCommand(editor, finalMesh));

// });

// options.add(item);