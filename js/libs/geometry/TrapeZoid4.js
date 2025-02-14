import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTwistedTrapGeometry extends THREE.BufferGeometry {
    constructor(pdx1, pdx2, pdy1, pdx3, pdx4, pdy2, pdz, pTheta, pPhi, pAlpha, twistedangle) {
        super();
        this.type = "aTwistedTrapGeometry";

        const material = new THREE.MeshBasicMaterial();
        const mmTOcm = 10;

        const pDx1 = pdx1*mmTOcm;
        const pDx2 = pdx2*mmTOcm;
        const pDy1 = pdy1*mmTOcm;
        const pDx3 = pdx3*mmTOcm;
        const pDx4 = pdx4*mmTOcm;
        const pDy2 = pdy2*mmTOcm;
        const pDz = pdz*10;


        
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

        const finalCSG = CSG.fromMesh(finalMesh);
        const finalGeometry = CSG.toGeometry(finalCSG);
        finalGeometry.type = "aTwistedTrapGeometry";
        finalGeometry.parameters = {
            'dx1': pdx1,
            'dx2': pdx2,
            'dy1': pdy1,
            'dx3': pdx3,
            'dx4': pdx4,
            'dy2': pdy2,
            'dz': pdz,
            'alpha': alpha,
            'theta': theta,
            'phi': phi,
            'twistedangle': twistedangle
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
