import * as THREE from 'three';
import { BoxGeometry } from '../geometry/BoxGeometry.js';

function CreateBox(pX, pY, pZ) {
    const mmTOcm = 10;
    const geometry = new BoxGeometry(2 * pX*mmTOcm, 2 * pY *mmTOcm , 2 * pZ*mmTOcm,2 * pX*mmTOcm, 2 * pY *mmTOcm , 2 * pZ*mmTOcm);
    geometry.rotateX(Math.PI / 2);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
    mesh.updateMatrix();
  
    mesh.name = 'Box';
    mesh.geometry.type = "BoxGeometry";
    return mesh;
}

export { CreateBox };
