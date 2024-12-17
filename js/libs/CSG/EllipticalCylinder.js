import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateElipticalCylinder( XSemiAxis , YSemiAxis , dz ){
    const mmTOcm=10;
    const xSemiAxis=XSemiAxis*mmTOcm;
    const semiAxisY=YSemiAxis*mmTOcm;
    const Dz=dz*mmTOcm;

    const ratioZ = semiAxisY / xSemiAxis;
    const cylindergeometry = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz * 2, 32, 1, false, 0, Math.PI * 2);
    const cylindermesh = new THREE.Mesh(cylindergeometry, new THREE.MeshLambertMaterial());
    
    cylindermesh.scale.z = ratioZ;
    cylindermesh.rotateX(Math.PI / 2);
    cylindermesh.updateMatrix();
    const aCSG = CSG.fromMesh(cylindermesh);
    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());

    const param = { 'xSemiAxis': XSemiAxis, 'semiAxisY': YSemiAxis, 'Dz': dz };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
    finalMesh.name = 'EllipeCylnder';

    return finalMesh;
}
export {CreateElipticalCylinder};