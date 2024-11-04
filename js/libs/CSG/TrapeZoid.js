import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

function CreateTrapezoid( dx1 , dy1 , dz , dx2 , dy2 ){
    const maxdis = Math.max(dx1, dy1, dx2, dy2, dz) * 2;
    const maxwidth = Math.max(dx1, dy1, dx2, dy2) * 2;
    const geometry = new THREE.BoxGeometry(maxwidth, dz * 2, maxwidth);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

    let MeshCSG1 = CSG.fromMesh(mesh);
    let MeshCSG3;

    let alpha = Math.atan((dy1 - dy2) / 2 / dz);
    let phi = Math.atan((dx1 - dx2) / 2 / dz);

    let aCSG;

    boxmesh.geometry.translate(maxdis, maxdis, 0);
    boxmesh.position.set(0 + dx1, -dz, 0);
    if (dx1 < maxwidth && phi > 0) {
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = MeshCSG1.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(0, 0, phi);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    if (dx1 < maxwidth && phi > 0) {
    aCSG = aCSG.subtract(MeshCSG3);
    } else
    aCSG = MeshCSG1.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(-2 * maxdis, 0, 0);
    boxmesh.position.set(0 - dx1, -dz, 0);
    if (dx1 < maxwidth && phi > 0) {
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(0, 0, -phi);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(maxdis, 0, maxdis);
    boxmesh.position.set(0, -dz, dy1);
    if (dy1 < maxwidth && alpha > 0) {
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(-alpha, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(0, 0, -2 * maxdis);
    boxmesh.position.set(0, -dz, -dy1);
    if (dy1 < maxwidth && alpha > 0) {
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(alpha, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

    finalMesh.rotateX(Math.PI / 2);
    finalMesh.updateMatrix();
    aCSG = CSG.fromMesh(finalMesh);
    finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
        
    const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2 };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTrapeZoidGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'TrapeZoid';
    
    return finalMesh;
    
}

export {CreateTrapezoid};



// const x1 = width1.getValue(), y1 = depth1.getValue(), z = height.getValue(), x2 = width2.getValue(), y2 = depth2.getValue();
// if (x1 * y1 * x2 * y2 * z === 0) {
//   return;
// }
// var trd = new THREE.BufferGeometry();

//     const points = [
//         new THREE.Vector3(-x2, -y2, z),//2
//         new THREE.Vector3(-x2, y2, z),//1
//         new THREE.Vector3(x2, y2, z),//0

//         new THREE.Vector3(x2, y2, z),//0
//         new THREE.Vector3(x2, -y2, z),//3
//         new THREE.Vector3(-x2, -y2, z),//2

//         new THREE.Vector3(x1, y1, -z),//4
//         new THREE.Vector3(-x1, y1, -z),//5
//         new THREE.Vector3(-x1, -y1, -z),//6

//         new THREE.Vector3(-x1, -y1, -z),//6
//         new THREE.Vector3(x1, -y1, -z),//7
//         new THREE.Vector3(x1, y1, -z),//4

//         new THREE.Vector3(x2, y2, z),//0
//         new THREE.Vector3(x1, y1, -z),//4
//         new THREE.Vector3(x1, -y1, -z),//7

//         new THREE.Vector3(x1, -y1, -z),//7
//         new THREE.Vector3(x2, -y2, z),//3
//         new THREE.Vector3(x2, y2, z),//0

//         new THREE.Vector3(-x2, y2, z),//1
//         new THREE.Vector3(-x2, -y2, z),//2
//         new THREE.Vector3(-x1, -y1, -z),//6

//         new THREE.Vector3(-x1, -y1, -z),//6
//         new THREE.Vector3(-x1, y1, -z),//5
//         new THREE.Vector3(-x2, y2, z),//1

//         new THREE.Vector3(-x2, y2, z),//1
//         new THREE.Vector3(-x1, y1, -z),//5
//         new THREE.Vector3(x1, y1, -z),//4

//         new THREE.Vector3(x1, y1, -z),//4
//         new THREE.Vector3(x2, y2, z),//0
//         new THREE.Vector3(-x2, y2, z),//1

//         new THREE.Vector3(-x2, -y2, z),//2
//         new THREE.Vector3(x2, -y2, z),//3
//         new THREE.Vector3(x1, -y1, -z),//7

//         new THREE.Vector3(x1, -y1, -z),//7
//         new THREE.Vector3(-x1, -y1, -z),//6
//         new THREE.Vector3(-x2, -y2, z),//2
//     ]

//     trd.setFromPoints(points);

//     const param = { 'dx1': x1, 'dy1': y1, 'dz': z, 'dx2': x2, 'dy2': y2 };
//     trd.parameters = param;
//     trd.type = 'aTrapeZoidGeometry';
//     const finalMesh = new THREE.Mesh(trd, new THREE.MeshBasicMaterial())
//     finalMesh.updateMatrix();
//     finalMesh.name = 'TrapeZoid';