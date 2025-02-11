import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTrapeZoidPGeometry extends THREE.BufferGeometry {
    constructor(pdX1, pdX2, pdY1, pdX3, pdX4, pdY2, pdZ, pTheta, pPhi, pAlpha) {
        super();
        this.type = "aTrapeZoidPGeometry";
        const mmTocm = 10;
        const pDx1= pdX1*mmTocm;
        const pDx2= pdX2*mmTocm;
        const pDy1= pdY1*mmTocm;
        const pDx3= pdX3*mmTocm;
        const pDx4= pdX4*mmTocm;
        const pDy2= pdY2*mmTocm;
        const pDz= pdZ*mmTocm;
        

        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4;
        const dy = (pDy1 + pDy2) / 2;
        const dz = pDz;
        const alpha = pAlpha;
        const theta = pTheta;
        const phi = pPhi;
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4) * 2;

        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz * 2, 2 * maxWidth);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3;
        let aCSG;

        boxmesh.geometry.translate(2 * maxWidth, 0, 0);
        boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + (phi * Math.PI) / 180, (alpha * Math.PI) / 180 + Math.atan((pDy1 - pDy2) / 2 / dz));
        boxmesh.position.set(dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
        boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - (phi * Math.PI) / 180, (alpha * Math.PI) / 180 - Math.atan((pDy1 - pDy2) / 2 / dz));
        boxmesh.position.set(-dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
        boxmesh.rotation.set(-theta * Math.PI / 180 - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
        boxmesh.position.set(0, 0, dy);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -4 * maxWidth);
        boxmesh.rotation.set(theta * Math.PI / 180 + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
        boxmesh.position.set(0, 0, -dy);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());

        const finalCSG = CSG.fromMesh(finalMesh);
        const finalGeometry = CSG.toGeometry(finalCSG);
        finalGeometry.type = "aTrapeZoidPGeometry";
        finalGeometry.parameters = { 'dx1': pdX1, 'dx2': pdX2, 'dy1': pdY1, 'dx3': pdX3, 'dx4': pdX4, 'dy2': pdY2, 'dz': pdZ, 'theta': theta, 'phi': phi , 'alpha': alpha   };

        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTrapeZoidPGeometry(
            data.dx1, 
            data.dx2, 
            data.dy1, 
            data.dx3, 
            data.dx4, 
            data.dy2, 
            data.dz, 
            data.theta, 
            data.phi, 
            data.alpha
        );
    }
}

export { aTrapeZoidPGeometry };
