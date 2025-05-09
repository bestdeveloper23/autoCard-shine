import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateTwistedTube( pRMin, pRMax , pDz , SPhi , DPhi , twistedangle ){
    const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2, 32, 32, false, 0, Math.PI * 2);
    const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());

    const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2, 32, 32, false, 0, Math.PI * 2);
    const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());

    const boxgeometry = new THREE.BoxGeometry(pRMax, pDz * 2, pRMax, 32, 32, 32);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

    boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
    let MeshCSG3 = CSG.fromMesh(boxmesh);

    let aCSG;
        
    let bCSG;
  
    if(pRMin !== 0) {
        aCSG = MeshCSG1.subtract(MeshCSG2);
        bCSG = MeshCSG1.subtract(MeshCSG2);
    } else {
        aCSG = MeshCSG1;
        bCSG = MeshCSG1;
    }

    if (DPhi > 270 && DPhi < 360) {
        let v_DPhi = 360 - DPhi;

        boxmesh.rotateY((SPhi + 180) / 180 * Math.PI);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        bCSG = bCSG.subtract(MeshCSG3);

        let repeatCount = Math.floor((270 - v_DPhi) / 90);

        for (let i = 0; i < repeatCount; i++) {
            let rotateVaule = - Math.PI / 2;
            boxmesh.rotateY(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
        }
        let rotateVaule = (-1) * (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
        boxmesh.rotateY(rotateVaule);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        bCSG = bCSG.subtract(MeshCSG3);
        aCSG = aCSG.subtract(bCSG);

    } else if(DPhi <= 270){

        boxmesh.rotateY((SPhi + 90)  * Math.PI);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let repeatCount = Math.floor((270 - DPhi) / 90);

        for (let i = 0; i < repeatCount; i++) {
            let rotateVaule = Math.PI / (2);
            boxmesh.rotateY(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);
        }
        let rotateVaule = (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
        boxmesh.rotateY(rotateVaule);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

    }

    let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    

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
    finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    finalMesh.name = 'TwistedTubs';
    finalMesh.geometry.type = 'aTwistedTubeGeometry';
    const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'twistedangle': - twistedangle };
    finalMesh.geometry.parameters = param;

    return finalMesh;
}
export{CreateTwistedTube};