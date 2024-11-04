import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateBox(pX, pY, pZ) {
    const geometry = new THREE.BoxGeometry(2 * pX, 2 * pY, 2 * pZ);
    geometry.rotateX(Math.PI / 2);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
    mesh.updateMatrix();
  
    mesh.name = 'Box';
    mesh.geometry.type = "BoxGeometry";
    const param = { width: pX / 10, height: pY / 10, depth: pZ / 10 };
    mesh.geometry.parameters = param;
    return mesh;
}

export { CreateBox };
