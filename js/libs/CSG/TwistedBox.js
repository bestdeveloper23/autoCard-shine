import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateTwistedBox( twistedangle , pDx , pDy , pDz ){
    const geometry = new THREE.BoxGeometry(pDx * 2, pDy * 2, pDz * 2, 32, 32, 32);
    const positionAttribute = geometry.getAttribute('position');

    let vec3 = new THREE.Vector3();
    let axis_vector = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < positionAttribute.count; i++) {
        vec3.fromBufferAttribute(positionAttribute, i);
        vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle / 180 * Math.PI);
        geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
    }

    let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial(), new THREE.MeshLambertMaterial());
    
    mesh.rotateX(Math.PI / 2);
    mesh.updateMatrix();
    let aCSG = CSG.fromMesh(mesh);
    mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    mesh.name = 'TwistedBox';
    const param = { 'width': pDx, 'height': pDy, 'depth': pDz, 'angle': - twistedangle };
    mesh.geometry.parameters = param;
    mesh.geometry.type = 'aTwistedBoxGeometry';

    return mesh;
}

export {CreateTwistedBox};