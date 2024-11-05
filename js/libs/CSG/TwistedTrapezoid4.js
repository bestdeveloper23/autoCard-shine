import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateTwistedTrapezoid4(pDx1, pDx2, pDy1, pDx3, pDx4, pDy2, pDz, pTheta, pPhi, pAlpha, twistedangle) {
    const material = new THREE.MeshBasicMaterial();

    const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4;
    const dy = (pDy1 + pDy2) / 2;
    const dz = pDz;
    const alpha = pAlpha;
    const theta = pTheta;
    const phi = pPhi;

    const maxWidth = Math.max(dx, pDx2, pDx3, pDx4) * 2;
    const geometry = new THREE.BoxGeometry(2 * maxWidth, dz * 2, 2 * maxWidth, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 8 * dz, 4 * maxWidth, 32, 32, 32);
    const boxmesh = new THREE.Mesh(boxgeometry, material);

    let MeshCSG1 = CSG.fromMesh(mesh);
    let MeshCSG3 = CSG.fromMesh(boxmesh);

    boxmesh.geometry.translate(2 * maxWidth, 0, 0);
    boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
    boxmesh.position.set(0 + dx, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    let aCSG = MeshCSG1.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
    boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
    boxmesh.position.set(0 - dx, 0, 0);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
    boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
    boxmesh.position.set(0, 0, dy);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh.rotation.set(0, 0, 0);
    boxmesh.geometry.translate(0, 0, -4 * maxWidth);
    boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
    boxmesh.position.set(0, 0, -dy);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);

    let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);

    const positionAttribute = finalMesh.geometry.getAttribute('position');

    let vec3 = new THREE.Vector3();
    let axis_vector = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < positionAttribute.count; i++) {
        vec3.fromBufferAttribute(positionAttribute, i);
        vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
        finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
    }

    finalMesh.rotateX(Math.PI / 2);
    finalMesh.updateMatrix();
    aCSG = CSG.fromMesh(finalMesh);
    finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
    finalMesh.name = 'TwistedTrapeZoidP';
    finalMesh.geometry.type = 'aTwistedTrapGeometry';
    
    const param = {
        'dx1': pDx1,
        'dx2': pDx2,
        'dy1': pDy1,
        'dx3': pDx3,
        'dx4': pDx4,
        'dy2': pDy2,
        'dz': pDz,
        'alpha': alpha,
        'theta': theta,
        'phi': phi,
        'twistedangle': -twistedangle
    };
    
    finalMesh.geometry.parameters = param;
    
    return finalMesh; // Return the created mesh
}

export {CreateTwistedTrapezoid4};