import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';
// import { SetGeometryCommand } from '../commands/SetGeometryCommand.js'; 
// import { AddObjectCommand } from './commands/AddObjectCommand.js';

function CreateTube( pRMin , pRMax , pDz, pSPhi , pDPhi ) {
    const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2);
    const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
    cylindermesh1.rotateX(Math.PI / 2);
    cylindermesh1.updateMatrix();
    const MeshCSG1 = CSG.fromMesh(cylindermesh1);

    const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, pDz * 2);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());
    boxmesh.geometry.translate(pRMax / 2, -pRMax / 2, 0);
    let MeshCSG3 = CSG.fromMesh(boxmesh);

    let aCSG = MeshCSG1;
    let bCSG = MeshCSG1;

    if (pRMin !== 0) {
        if (pRMin>pRMax) pRMin = pRMax - 1;
        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2);
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());
        cylindermesh2.rotateX(Math.PI / 2);
        cylindermesh2.updateMatrix();
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);
        aCSG = MeshCSG1.subtract(MeshCSG2);
        bCSG = MeshCSG1.subtract(MeshCSG2);
    }

    const oDPhi = pDPhi; // save the original pDPhi value
    
    if (pDPhi > 270 && pDPhi <= 360) {
        pDPhi = 360 - pDPhi;
        pSPhi = pSPhi - pDPhi;
    }

    boxmesh.rotateZ((pSPhi) / 180 * Math.PI);
    boxmesh.updateMatrix();

    let n = Math.floor((360 - pDPhi) / 90);

    for (let i = 0; i < n; i++) {
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);
        if (i<n-1) {
            let turn = -Math.PI / (2);
            boxmesh.rotateZ(turn);
            boxmesh.updateMatrix();
        }
    }

    let rotateValue = -(360 - pDPhi - n * 90) / 180 * Math.PI;
    boxmesh.rotateZ(rotateValue);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    if(oDPhi > 270 && oDPhi <= 360){
        aCSG = bCSG.subtract(aCSG);
        if(oDPhi == 360){
            aCSG = bCSG;
        }
    }

    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    const param = { 'pRMax': pRMax/10, 'pRMin': pRMin/10, 'pDz': pDz/10, 'pSPhi': pSPhi, 'pDPhi': oDPhi };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTubeGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'Tubs';
    return finalMesh;
}

export {CreateTube}