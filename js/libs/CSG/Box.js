import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateBox(pX, pY, pZ) {
    const mmTOcm = 10;
    const geometry = new THREE.BoxGeometry(2 * pX*mmTOcm, 2 * pY *mmTOcm , 2 * pZ*mmTOcm);
    geometry.rotateX(Math.PI / 2);
    let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
    // mesh.updateMatrix();
  
    mesh.name = 'Box';
    mesh.geometry.type = "BoxGeometry";
    const param = { 
        width: pX , 
        height: pY , 
        depth: pZ ,
    };
    mesh.geometry.parameters = param;
    return mesh;
}

export { CreateBox };
