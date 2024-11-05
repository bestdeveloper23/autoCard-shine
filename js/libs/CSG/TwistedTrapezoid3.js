import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateTwistedTrapezoid3(dx1, dy1, dz, dx2, dy2, twistedangle) {
    
    const maxdis = Math.max(dx1, dy1, dx2, dy2, dz) * 2;
    const maxwidth = Math.max(dx1, dy1, dx2, dy2) * 2;
    const geometry = new THREE.BoxGeometry(maxwidth, dz * 2, maxwidth, 32, 32, 32);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

    let MeshCSG1 = CSG.fromMesh(mesh);
    let MeshCSG3;

    let alpha = Math.atan((dy1 - dy2) / 2 / dz);
    let phi = Math.atan((dx1 - dx2) / 2 / dz);

    let aCSG;

    boxmesh.geometry.translate(maxdis, maxdis, 0);
    boxmesh.position.set(0 + dx1, -dz, 0);
    if (dx1 < maxwidth && phi > 0) {
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = MeshCSG1.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(0, 0, phi);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    if (dx1 < maxwidth && phi > 0) {
        aCSG = aCSG.subtract(MeshCSG3);
    } else
        aCSG = MeshCSG1.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(-2 * maxdis, 0, 0);
    boxmesh.position.set(0 - dx1, -dz, 0);
    if (dx1 < maxwidth && phi > 0) {
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(0, 0, -phi);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(maxdis, 0, maxdis);
    boxmesh.position.set(0, -dz, dy1);
    if (dy1 < maxwidth && alpha > 0) {
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(-alpha, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(0, 0, -2 * maxdis);
    boxmesh.position.set(0, -dz, -dy1);
    if (dy1 < maxwidth && alpha > 0) {
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);
    }
    boxmesh.rotation.set(alpha, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

    const positionAttribute = finalMesh.geometry.getAttribute('position');

    let vec3 = new THREE.Vector3();
    let axis_vector = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < positionAttribute.count; i++) {
        vec3.fromBufferAttribute(positionAttribute, i);
        vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
        finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
    }


    finalMesh.rotateX(Math.PI / 2);
    finalMesh.updateMatrix();

    aCSG = CSG.fromMesh(finalMesh);
    finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
    
    finalMesh.name = 'TwistedTrapeZoid';
    const param = {
        'dx1': dx1,
        'dy1': dy1,
        'dz': dz,
        'dx2': dx2,
        'dy2': dy2,
        'twistedangle': -twistedangle
    };
    
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTwistedTrdGeometry';
    
    return finalMesh; // Return the created mesh
}

export {CreateTwistedTrapezoid3};