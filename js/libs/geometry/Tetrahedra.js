
import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTetrahedraGeometry extends THREE.BufferGeometry {
    constructor(anchor, p2, p3, p4) {
        super();
        this.type = "aTetrahedraGeometry";

        const material = new THREE.MeshBasicMaterial();
        const vertices = [];
        const indices = [];
        
        vertices.push(...anchor, ...p2, ...p3, ...p4);
        
        indices.push(
            0, 1, 2,
            0, 2, 1,
            0, 2, 3,
            0, 3, 2,
            0, 1, 3,
            0, 3, 1,
            1, 2, 3,
            1, 3, 2
        );
        
        const geometry = new THREE.PolyhedronGeometry(vertices, indices);
        let mesh = new THREE.Mesh(geometry, material);

        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        
        const finalCSG = CSG.fromMesh(mesh);
        const finalGeometry = CSG.toGeometry(finalCSG);
        finalGeometry.type = "aTetrahedraGeometry";
        finalGeometry.parameters = { anchor, p2, p3, p4 };

        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTetrahedraGeometry(data.anchor, data.p2, data.p3, data.p4);
    }
}

export { aTetrahedraGeometry };
