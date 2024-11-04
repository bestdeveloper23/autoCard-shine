import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateElipticalCylinder( xSemiAxis , semiAxisY , Dz ){
    const ratioZ = semiAxisY / xSemiAxis;
    const cylindergeometry = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz * 2, 32, 1, false, 0, Math.PI * 2);
    const cylindermesh = new THREE.Mesh(cylindergeometry, new THREE.MeshBasicMaterial());
    
    cylindermesh.scale.z = ratioZ;
    cylindermesh.rotateX(Math.PI / 2);
    cylindermesh.updateMatrix();
    const aCSG = CSG.fromMesh(cylindermesh);
    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());

    const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
    finalMesh.name = 'EllipeCylnder';

    return finalMesh;
}
export {CreateElipticalCylinder};