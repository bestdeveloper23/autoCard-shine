import * as THREE from 'three';
import { aConeGeometry } from '../geometry/aConeGeometry.js';
import { MeshLambertMaterial } from 'three';

function CreateCone( pRMin1 , pRMax1 , pRMin2 , pRMax2 , pdz , pSPhi , pDPhi ){

    const geometry = new aConeGeometry(pRMin1 , pRMax1 , pRMin2 , pRMax2 , pdz , pSPhi , pDPhi )
    const finalMesh = new THREE.Mesh(geometry, new MeshLambertMaterial()); 
    
    return finalMesh;

}

export {CreateCone}