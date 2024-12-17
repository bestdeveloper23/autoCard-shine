import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateTube( pRmin , pRmax , pdz, SPhi , DPhi ) {
    const mmTOcm = 10;
    let pRMin = pRmin * mmTOcm;
    let pRMax = pRmax * mmTOcm;
    let pDz = pdz * mmTOcm;
    let pSPhi = Math.PI*SPhi/180;
    let pDPhi = Math.PI*DPhi/180;

    const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2);
    const cylinder1CSG = CSG.fromGeometry(cylindergeometry1);
    let resultCSG=cylinder1CSG;
    
    if (pRMin !== 0) {
        if (pRMin>pRMax) pRMin = pRMax - 0.1;
        const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2);
        const  cylinder2CSG = CSG.fromGeometry(cylindergeometry2);
        resultCSG = cylinder1CSG.subtract(cylinder2CSG);
    }

    if (pDPhi < Math.PI*2){
        const pieShape = new THREE.Shape();
        pieShape.absarc(0, 0,  pRMax , pSPhi, pSPhi + pDPhi, false);
        pieShape.lineTo(0, 0);
        const extrusionsettings = { depth: pDz * 2, bevelEnabled: false };
        const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
        pieGeometry.translate(0, 0, -pDz);
        pieGeometry.rotateX(Math.PI/2)
        const pieCSG = CSG.fromGeometry(pieGeometry);
        resultCSG = resultCSG.intersect(pieCSG);
    }

    const finalMesh = CSG.toMesh(resultCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    finalMesh.rotateX(Math.PI/2);
    finalMesh.rotateX(Math.PI);
    const param = { 'pRMax': pRmax, 'pRMin': pRmin, 'pDz': pdz, 'pSPhi': SPhi, 'pDPhi':DPhi };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTubeGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'Tubs';
    return finalMesh;
}

export {CreateTube}