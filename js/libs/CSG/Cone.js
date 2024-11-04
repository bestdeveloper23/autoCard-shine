import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateCone( pRmin1 , pRmax1 , pRmin2 , pRmax2 , pDz , SPhi , DPhi ){
    const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz * 2, 32, 32, false, 0, Math.PI * 2);
    const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
    cylindermesh1.rotateX(Math.PI / 2);
    cylindermesh1.updateMatrix();

    const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz * 2, 32, 32, false, 0, Math.PI * 2);
    const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());
    cylindermesh2.rotateX(Math.PI / 2);
    cylindermesh2.updateMatrix();

    const maxRadius = Math.max(pRmax1, pRmax2) * 2;
    const boxgeometry = new THREE.BoxGeometry(maxRadius, maxRadius, pDz * 2);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

    boxmesh.geometry.translate(maxRadius / 2, maxRadius / 2, 0);
    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
    let MeshCSG3 = CSG.fromMesh(boxmesh);

    let aCSG;
        
    let bCSG;
 
    if(pRmin1 === 0 && pRmin2 === 0 ) {
         aCSG = MeshCSG2;
         bCSG = MeshCSG2;
    } else {
        aCSG = MeshCSG2.subtract(MeshCSG1);
        bCSG = MeshCSG2.subtract(MeshCSG1);
    }

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
    const param = { 'pRMax1': pRmax1/10 , 'pRMin1': pRmin1/10 , 'pRMax2': pRmax2/10 , 'pRMin2': pRmin2/10 , 'pDz': pDz/10 , 'pSPhi': SPhi, 'pDPhi': DPhi };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aConeGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'Cone';
    
    return finalMesh;

}

export {CreateCone}
   