import * as THREE from "three";
import { CSG } from "../CSGMesh.js";
import { PolyconeGeometry } from "../geometry/PolyconeGeometry.js";

class aPolyhedraGeometry extends THREE.BufferGeometry {
    constructor(SPhi, DPhi, numSide, numZPlanes, rInner, rOuter, z) {
        super();
        this.type = "aPolyhedraGeometry";

        const material = new THREE.MeshBasicMaterial();
        // Convert SPhi and DPhi from degrees to radians
        const startPhi = (SPhi + 90) * Math.PI / 180;
        const deltaPhi = DPhi * Math.PI / 180;

        // Create the polycone geometry
        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, startPhi, deltaPhi);
        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());

        // Convert the mesh to CSG
        let MeshCSG1 = CSG.fromMesh(meshOut);

        // Apply transformation and create final mesh
        let finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4(), material);
        // finalMesh.geometry.computeVertexNormals();
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();

        // Apply further CSG operation if needed
        let aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);

        // Convert to CSG and back for final geometry
        let finalCSG = CSG.fromMesh(finalMesh);
        const finalGeometry = CSG.toGeometry(finalCSG);

        // Store parameters for serialization
        finalGeometry.type = "aPolyhedraGeometry";
        const param = {'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
        finalGeometry.parameters = param;
        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aPolyhedraGeometry(data.SPhi, data.DPhi, data.numSide, data.numZPlanes, data.rInner, data.rOuter, data.z);
    }
}

export { aPolyhedraGeometry };
