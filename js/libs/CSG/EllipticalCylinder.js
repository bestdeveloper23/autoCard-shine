import * as THREE from 'three';
import { aEllipticalCylinderGeometry } from '../geometry/EllipticalCylinderGeometry.js';

function CreateElipticalCylinder( XSemiAxis , YSemiAxis , dz ){
  
    const geometry = new aEllipticalCylinderGeometry(XSemiAxis , YSemiAxis , dz)
    const finalMesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial())

    finalMesh.name = 'EllipeCylnder';

    return finalMesh;
}
export {CreateElipticalCylinder};