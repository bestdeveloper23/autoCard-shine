import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreatePrabolicCylinder(radius1 , radius2 , pDz){
    const material = new THREE.MeshLambertMaterial();
    const k2 = (Math.pow(radius1, 2) + Math.pow(radius2, 2)) / 2, k1 = (Math.pow(radius2, 2) - Math.pow(radius1, 2)) / pDz * 2;

    const cylindergeometry1 = new THREE.CylinderGeometry(radius2, radius1, pDz * 2, 32, 32, false, 0, Math.PI * 2);

    // cylindergeometry1.translate(0, zTopCut + zBottomCut, 0);

    let positionAttribute = cylindergeometry1.getAttribute('position');

    let vertex = new THREE.Vector3();

    for (let i = 0; i < positionAttribute.count; i++) {

        vertex.fromBufferAttribute(positionAttribute, i);
        let x, y, z;
        x = vertex.x;
        y = vertex.y;
        z = vertex.z;
        let r = Math.sqrt((y * k1 + k2));

        let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

        if (vertex.z >= 0) {
            z = Math.abs(r * Math.sin(alpha));
        } else {
            z = - Math.abs(r * Math.sin(alpha));
        }
        if (vertex.x >= 0) {
            x = r * Math.cos(alpha);
        } else {
            x = -r * Math.cos(alpha);
        }

        cylindergeometry1.attributes.position.array[i * 3] = x;
        cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
        cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

    }
    cylindergeometry1.attributes.position.needsUpdate = true;

    const cylindermesh = new THREE.Mesh(cylindergeometry1, material);

    let finalMesh = cylindermesh;
    
    finalMesh.rotateX(Math.PI / 2);
    finalMesh.updateMatrix();
    let aCSG = CSG.fromMesh(finalMesh);
    finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
    finalMesh.name = 'Paraboloid';
    const param = { 'R1': radius1, 'R2': radius2, 'pDz': pDz };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aParaboloidGeometry';
    return finalMesh;
}

export {CreatePrabolicCylinder};

// const k2 = (Math.pow(radius1, 2) + Math.pow(radius2, 2)) / 2, k1 = (Math.pow(radius2, 2) - Math.pow(radius1, 2)) / pDz;

