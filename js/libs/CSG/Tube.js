import * as THREE from 'three';
import { aTubeGeometry } from '../geometry/aTubeGeometry.js';

function CreateTube( pRmin , pRmax , pdz, SPhi , DPhi ) {

    const geometry = new aTubeGeometry(pRmin , pRmax , pdz, SPhi , DPhi);
    const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
    finalMesh.rotateX(Math.PI/2);
    finalMesh.rotateX(Math.PI);
    finalMesh.updateMatrix();
    finalMesh.name = 'Tubs';
    return finalMesh;
}

export {CreateTube}