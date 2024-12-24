import * as THREE from 'three';
import { aTorusGeometry } from '../geometry/aTorusGeometry.js';

function CreateTorus(pRMin, pRMax, pRTor, pSphi, pDphi) {

    const geometry = new aTorusGeometry(pRMin, pRMax, pRTor, pSphi, pDphi);
    const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
    finalMesh.updateMatrix();
    finalMesh.name = 'Torus';

    return finalMesh;

}

export {CreateTorus}