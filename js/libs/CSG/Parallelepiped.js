
import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

function CreateParallelepiped( dx , dy , dz , alpha , theta , phi ){
    const maxRadius = Math.max(dx, dy, dz) * 2;
    const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

    let MeshCSG1 = CSG.fromMesh(mesh);
    let MeshCSG3 = CSG.fromMesh(boxmesh);

    boxmesh.geometry.translate(2 * maxRadius, 0, 0);
    boxmesh.rotation.set(alpha / 180 * Math.PI, theta / 180 * Math.PI, phi / 180 * Math.PI);
    boxmesh.position.set(0 + dx, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    let aCSG = MeshCSG1.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
    boxmesh.rotation.set(alpha / 180 * Math.PI, theta / 180 * Math.PI, phi / 180 * Math.PI);
    boxmesh.position.set(0 - dx, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
    boxmesh.rotation.set(alpha / 180 * Math.PI, theta / 180 * Math.PI, phi / 180 * Math.PI);
    boxmesh.position.set(0, 0, dz);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(0, 0, -4 * maxRadius);
    boxmesh.rotation.set(alpha / 180 * Math.PI, theta / 180 * Math.PI, phi / 180 * Math.PI);
    boxmesh.position.set(0, 0, -dz);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
    boxmesh.position.set(0, dy, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.geometry.translate(0, -4 * maxRadius, 0);
    boxmesh.position.set(0, - dy, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());        
    // finalMesh.rotateX(Math.PI / 2);
    // finalMesh.updateMatrix();
    // aCSG = CSG.fromMesh(finalMesh);
    // finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

    const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': - alpha, 'theta': - theta, 'phi': - phi };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aParallGeometry';
    
    finalMesh.name = 'Parallelepiped';

    return finalMesh;

}

export {CreateParallelepiped};