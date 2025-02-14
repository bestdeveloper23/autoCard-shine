import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTwistedBoxGeometry extends THREE.BufferGeometry {
    constructor(pdx, pdy, pdz, twistedangle ) {
        super();
        this.type = "aTwistedBoxGeometry";
        const mmTOcm = 10;
        const pDx = pdx*mmTOcm;
        const pDy = pdy*mmTOcm;
        const pDz = pdz*mmTOcm;

        const geometry = new THREE.BoxGeometry(pDx * 2, pDz * 2, pDy * 2, 32, 32, 32);
        const positionAttribute = geometry.getAttribute("position");

        let vec3 = new THREE.Vector3();
        let axis_vector = new THREE.Vector3(0, 1, 0);
        for (let i = 0; i < positionAttribute.count; i++) {
            vec3.fromBufferAttribute(positionAttribute, i);
            vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle * Math.PI / 180);
            geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }

        let mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());

        const finalCSG = CSG.fromMesh(mesh);
        const finalGeometry = CSG.toGeometry(finalCSG);
        finalGeometry.type = "aTwistedBoxGeometry";
        finalGeometry.parameters = { 'width': pdx, 'height': pdy, 'depth': pdz, 'angle':  twistedangle };

        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTwistedBoxGeometry(data.width, data.height, data.depth, data.angle);
    }
}

export { aTwistedBoxGeometry };
