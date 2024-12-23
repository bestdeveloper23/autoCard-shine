import * as THREE from 'three';
import { BoxGeometry } from '../geometry/BoxGeometry.js';

function CreateBox(pX, pY, pZ) {
    const geometry = new BoxGeometry(pX, pY, pZ, pX, pY, pZ);
    geometry.rotateX(Math.PI / 2);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
    mesh.updateMatrix();
  
    mesh.name = 'Box';
    mesh.geometry.type = "BoxGeometry";
    return mesh;
}

export { CreateBox };
