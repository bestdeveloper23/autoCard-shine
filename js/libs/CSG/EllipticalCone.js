import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateEllipticalCone( xSemiAxis , ySemiAxis , zTopCut , height ){
    const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * ((height - zTopCut) / (height + zTopCut)), xSemiAxis, zTopCut * 2, 32, 32, false, 0, Math.PI * 2);
    // cylindergeometry1.translate(0, zTopCut / 2, 0)
    const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
    const ratioZ = ySemiAxis / xSemiAxis;

    cylindermesh.scale.z = ratioZ;
    cylindermesh.updateMatrix();
    let aCSG = CSG.fromMesh(cylindermesh);
    let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());

    
    finalMesh.rotateX(Math.PI / 2);
    finalMesh.updateMatrix();
    aCSG = CSG.fromMesh(finalMesh);
    finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    finalMesh.name = 'aEllipticalCone';
    const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'height': height, 'zTopCut': zTopCut };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aEllipticalConeGeometry';

    return finalMesh;
}

export{CreateEllipticalCone};

