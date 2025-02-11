import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aParaboloidGeometry extends THREE.BufferGeometry {
    constructor(radius1, radius2, pDz) {
        super();
        this.type = "aParaboloidGeometry";
        const mmTocm = 10;
        const r1 = radius1 * mmTocm;
        const r2 = radius2 * mmTocm;
        const dz = pDz * mmTocm;

        const material = new THREE.MeshLambertMaterial();
        const k2 = (Math.pow(r1, 2) + Math.pow(r2, 2)) / 2;
        const k1 = ((Math.pow(r2, 2) - Math.pow(r1, 2)) / dz) * 2;

        let geometry = new THREE.CylinderGeometry(r2, r1, dz * 2, 32, 32, false, 0, Math.PI * 2);
        let positionAttribute = geometry.getAttribute("position");
        let vertex = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            let x = vertex.x;
            let y = vertex.y;
            let z = vertex.z;
            let r = Math.sqrt(y * k1 + k2);

            let alpha = Math.atan(z / x) || (geometry.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : -Math.PI / 2);

            z = vertex.z >= 0 ? Math.abs(r * Math.sin(alpha)) : -Math.abs(r * Math.sin(alpha));
            x = vertex.x >= 0 ? r * Math.cos(alpha) : -r * Math.cos(alpha);

            geometry.attributes.position.array[i * 3] = x;
            geometry.attributes.position.array[i * 3 + 1] = y;
            geometry.attributes.position.array[i * 3 + 2] = z || vertex.z;
        }
        geometry.attributes.position.needsUpdate = true;

        let mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        const finalGeometry = CSG.toGeometry(aCSG);

        finalGeometry.type = "aParaboloidGeometry";
        const param = { 'R1': radius1, 'R2': radius2, 'pDz': pDz };
        finalGeometry.parameters = param;
        
        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aParaboloidGeometry(data.R1, data.R2, data.pDz);
    }
}

export { aParaboloidGeometry };
