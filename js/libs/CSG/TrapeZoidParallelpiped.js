import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

function CreateTrapezoidParallePiped( pDx1 , pDx2 , pDy1 , pDx3 , pDx4 , pDy2 , pDz , pTheta , pPhi , pAlpha ){

    const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
    const maxWidth = Math.max(dx, pDx2, pDx3, pDx4) * 2;
    const geometry = new THREE.BoxGeometry(2 * maxWidth, dz * 2, 2 * maxWidth, 1, 1, 1);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

    const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

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
    boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
    boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
    boxmesh.position.set(0, 0, -dy);
    boxmesh.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);


    let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial())
    finalMesh.rotateX(Math.PI / 2);
    finalMesh.updateMatrix();
    aCSG = CSG.fromMesh(finalMesh);
    finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
    finalMesh.name = 'aTrapeZoidP';

    const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTrapeZoidPGeometry';

    return finalMesh;
}

export {CreateTrapezoidParallePiped};