import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTwistedTrapGeometry extends THREE.BufferGeometry {
    constructor(pDx1, pDx2, pDy1, pDx3, pDx4, pDy2, pDz, pTheta, pPhi, pAlpha, twistedangle) {
        super();
        this.type = "aTwistedTrapGeometry";

        const material = new THREE.MeshBasicMaterial();
        
        const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4;
        const dy = (pDy1 + pDy2) / 2;
        const dz = pDz;
        const alpha = pAlpha;
        const theta = pTheta;
        const phi = pPhi;
        
        const maxWidth = Math.max(dx, pDx2, pDx3, pDx4) * 2;
        const geometry = new THREE.BoxGeometry(2 * maxWidth, dz * 2, 2 * maxWidth);
        const mesh = new THREE.Mesh(geometry, material);

        const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 8 * dz, 4 * maxWidth);
        const boxmesh = new THREE.Mesh(boxgeometry, material);

        let MeshCSG1 = CSG.fromMesh(mesh);
        let MeshCSG3;

        boxmesh.geometry.translate(2 * maxWidth, 0, 0);
        boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / (2 * pDz)) + (phi * Math.PI / 180), (alpha * Math.PI / 180) + Math.atan((pDy1 - pDy2) / (2 * dz)));
        boxmesh.position.set(dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        let aCSG = MeshCSG1.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
        boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / (2 * pDz)) - (phi * Math.PI / 180), (alpha * Math.PI / 180) - Math.atan((pDy1 - pDy2) / (2 * dz)));
        boxmesh.position.set(-dx, 0, 0);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
        boxmesh.rotation.set((-theta * Math.PI / 180) - Math.tan((pDx1 - pDx3) / (2 * pDz)), 0, 0);
        boxmesh.position.set(0, 0, dy);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        boxmesh.rotation.set(0, 0, 0);
        boxmesh.geometry.translate(0, 0, -4 * maxWidth);
        boxmesh.rotation.set((theta * Math.PI / 180) + Math.tan((pDx2 - pDx4) / (2 * pDz)), 0, 0);
        boxmesh.position.set(0, 0, -dy);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);

        const positionAttribute = finalMesh.geometry.getAttribute("position");
        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * (twistedangle * Math.PI / 180));
            finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);

        const finalCSG = CSG.fromMesh(finalMesh);
        const finalGeometry = CSG.toGeometry(finalCSG);
        finalGeometry.type = "aTwistedTrapGeometry";
        finalGeometry.parameters = {
            dx1: pDx1,
            dx2: pDx2,
            dy1: pDy1,
            dx3: pDx3,
            dx4: pDx4,
            dy2: pDy2,
            dz: pDz,
            alpha: alpha,
            theta: theta,
            phi: phi,
            twistedangle: -twistedangle
        };

        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTwistedTrapGeometry(
            data.dx1, data.dx2, data.dy1, data.dx3, data.dx4, data.dy2,
            data.dz, data.theta, data.phi, data.alpha, data.twistedangle
        );
    }
}

export { aTwistedTrapGeometry };
