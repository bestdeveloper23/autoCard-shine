import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateCone( pRMin1 , pRMax1 , pRMin2 , pRMax2 , pdz , pSPhi , pDPhi ){
    
    const mmTOcm=10;
    const pRmin1=pRMin1*mmTOcm;
    const pRmax1=pRMax1*mmTOcm;
    const pRmin2=pRMin2*mmTOcm;
    const pRmax2=pRMax2*mmTOcm;
    const pDz=pdz*mmTOcm;

    let SPhi = Math.PI*pSPhi/180;
    let DPhi = Math.PI*pDPhi/180;
    const cylindergeometry1 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz * 2, 32, 32);
    const cylindergeometry2 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz * 2, 32, 32);

    const maxRadius = Math.max(pRmax1, pRmax2) ;
    const  minRadius = Math.min(pRmin1, pRmin2) ;

    const cylinder1CSG = CSG.fromGeometry(cylindergeometry1);

    let resultCSG = cylinder1CSG;

    if (DPhi < Math.PI*2){
        const pieShape = new THREE.Shape();
        pieShape.absarc(0, 0,  maxRadius , SPhi, SPhi + DPhi, false);
        pieShape.lineTo(0, 0);
        const extrusionsettings = { depth: pDz * 2, bevelEnabled: false };
        const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
        pieGeometry.translate(0, 0, -pDz);
        pieGeometry.rotateX(Math.PI/2)
        const pieCSG = CSG.fromGeometry(pieGeometry);
        const finalMesh = CSG.toMesh(pieCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
        resultCSG = resultCSG.intersect(pieCSG);
    }

    // Convert geometries to CSG objects
    if (maxRadius>0 && minRadius>0){ 
        const cylinder2CSG = CSG.fromGeometry(cylindergeometry2);
        resultCSG = resultCSG.subtract(cylinder2CSG);
    }
    const finalMesh = CSG.toMesh(resultCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    finalMesh.rotateX(Math.PI/2);
    finalMesh.rotateX(Math.PI)
    const param = { 'pRMax1': pRMax1 , 'pRMin1': pRMin1 , 'pRMax2': pRMax2 , 'pRMin2': pRMin2 , 'pDz': pdz , 'pSPhi': pSPhi, 'pDPhi': pDPhi};
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aConeGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'Cone';
    
    return finalMesh;

}

export {CreateCone}