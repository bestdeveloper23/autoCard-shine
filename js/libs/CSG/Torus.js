import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateTorus(pRmin, pRmax, pRtor, pSPhi, pDPhi) {

    const OuterTorusGeometry = new THREE.TorusGeometry(pRtor, pRmax,14,35);
    const innerTorusGeometry = new THREE.TorusGeometry(pRtor, pRmin,14,35);

    const OuterTorusCSG = CSG.fromGeometry(OuterTorusGeometry);
    let resultCSG = OuterTorusCSG;

    if ((pSPhi + pDPhi) % (Math.PI * 2) != 0){
        const pieShape = new THREE.Shape();
        pieShape.absarc(0, 0, pRtor + pRmax+0.3, pSPhi, pSPhi + pDPhi, false);
        pieShape.lineTo(0, 0);
        const extrusionsettings = { depth: pRmax * 2, bevelEnabled: false };
        const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
        pieGeometry.translate(0, 0, -pRmax);
        const pieCSG = CSG.fromGeometry(pieGeometry);
        resultCSG = resultCSG.intersect(pieCSG);
    }

    // Convert geometries to CSG objects
    if (pRmax>0 && pRmin>0){ 
        const innerTorusCSG = CSG.fromGeometry(innerTorusGeometry);
        resultCSG = resultCSG.subtract(innerTorusCSG);
    }

    // Convert CSG back to a mesh
    const finalMesh = CSG.toMesh(resultCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial()); 
    finalMesh.updateMatrix();
    // finalMesh.rotateX(Math.PI/2);   //Figure out this
    finalMesh.name = 'Torus';
    const param = { 'pRMax': pRmax/10, 'pRMin': pRmin/10, 'pRTor': pRtor/10, 'pSPhi': (pSPhi/ Math.PI) * 180, 'pDPhi': (pDPhi/ Math.PI) * 180 };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTorusGeometry';

    return finalMesh;

}

export {CreateTorus}



// function CreateTorus(pRMin, pRMax, pRtor, SPhi, DPhi) {
    
//     const torgeometry1 = new THREE.TorusGeometry(pRtor, pRMax, 16, 16);
//     const tormesh1 = new THREE.Mesh(torgeometry1, new THREE.MeshBasicMaterial());
//     tormesh1.rotateX(Math.PI / 2);
//     tormesh1.updateMatrix();

//     const torgeometry2 = new THREE.TorusGeometry(pRtor, pRMin, 16, 16);
//     const tormesh2 = new THREE.Mesh(torgeometry2, new THREE.MeshBasicMaterial());
//     tormesh2.rotateX(Math.PI / 2);
//     tormesh2.updateMatrix();

//     const boxgeometry = new THREE.BoxGeometry(pRtor + pRMax, pRtor + pRMax, pRtor + pRMax);
//     const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

//     boxmesh.geometry.translate((pRtor + pRMax) / 2, 0, (pRtor + pRMax) / 2);
//     const MeshCSG1 = CSG.fromMesh(tormesh1);
//     const MeshCSG2 = CSG.fromMesh(tormesh2);
//     let MeshCSG3 = CSG.fromMesh(boxmesh);

//     let aCSG;
        
//     let bCSG;
  
//     if(pRMin !== 0) {
//         aCSG = MeshCSG1.subtract(MeshCSG2);
//         bCSG = MeshCSG1.subtract(MeshCSG2);
//     } else {
//         aCSG = MeshCSG1;
//         bCSG = MeshCSG1;
//     }

//     if (DPhi > 270 && DPhi < 360) {
//         let v_DPhi = 360 - DPhi;
     
//         boxmesh.rotateY((SPhi + 180) / 180 * Math.PI);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         bCSG = bCSG.subtract(MeshCSG3);
     
//         let repeatCount = Math.floor((270 - v_DPhi) / 90);
     
//         for (let i = 0; i < repeatCount; i++) {
//          let rotateVaule = - Math.PI / 2;
//          boxmesh.rotateY(rotateVaule);
//          boxmesh.updateMatrix();
//          MeshCSG3 = CSG.fromMesh(boxmesh);
//          bCSG = bCSG.subtract(MeshCSG3);
//         }
//         let rotateVaule = (-1) * (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
//         boxmesh.rotateY(rotateVaule);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         bCSG = bCSG.subtract(MeshCSG3);
//         aCSG = aCSG.subtract(bCSG);
     
//     } else if(DPhi <= 270){
     
//         boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         aCSG = aCSG.subtract(MeshCSG3);
     
//         let repeatCount = Math.floor((270 - DPhi) / 90);
     
//         for (let i = 0; i < repeatCount; i++) {
//          let rotateVaule = Math.PI / (2);
//          boxmesh.rotateY(rotateVaule);
//          boxmesh.updateMatrix();
//          MeshCSG3 = CSG.fromMesh(boxmesh);
//          aCSG = aCSG.subtract(MeshCSG3);
//         }
//         let rotateVaule = (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
//         boxmesh.rotateY(rotateVaule);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         aCSG = aCSG.subtract(MeshCSG3);
     
//     }         

//     let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
    
//     finalMesh.rotateX(Math.PI / 2);
//     finalMesh.updateMatrix();
    
//     aCSG = CSG.fromMesh(finalMesh);
//     finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

//     finalMesh.name = 'Torus';
//     const param = { 'pRMax': pRMax/10, 'pRMin': pRMin/10, 'pRTor': pRtor/10, 'pSPhi': SPhi, 'pDPhi': DPhi };
//     finalMesh.geometry.parameters = param;
//     finalMesh.geometry.type = 'aTorusGeometry';

//     return finalMesh;
// }