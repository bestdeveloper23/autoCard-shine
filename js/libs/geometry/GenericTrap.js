import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aGenericTrapGeometry extends THREE.BufferGeometry {
    constructor(pDz, px, py) {
        super();
        this.type = "aGenericTrapGeometry";

        const material = new THREE.MeshBasicMaterial();
        const vertices = [];
        const indices = [];

        for (let i = 0; i < 8; i++) {
            if (i > 3) {
                vertices.push(px[i], 1 * pDz, py[i]);
            } else {
                vertices.push(px[i], -1 * pDz, py[i]);
            }
        }

        indices.push(
            0, 2, 1,
            0, 3, 2,
            0, 1, 5,
            0, 5, 4,
            1, 2, 6,
            1, 6, 5,
            2, 3, 7,
            2, 7, 6,
            3, 0, 4,
            3, 4, 7,
            4, 5, 6,
            4, 6, 7
        );

        const geometry = new THREE.PolyhedronGeometry(vertices, indices);
        let mesh = new THREE.Mesh(geometry, material);

        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
        
        const finalCSG = CSG.fromMesh(mesh);
        const finalGeometry = CSG.toGeometry(finalCSG);
        finalGeometry.type = "aGenericTrapGeometry";
        finalGeometry.parameters = { 'pDz': pDz, 'px': px, 'py': py };

        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aGenericTrapGeometry(data.pDz, data.px, data.py);
    }
}

export { aGenericTrapGeometry };
