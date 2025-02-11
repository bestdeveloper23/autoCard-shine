import * as THREE from "three";
import { CSG } from "../CSGMesh.js";
import { PolyconeGeometry } from "../geometry/PolyconeGeometry.js";

class aPolyconeGeometry extends THREE.BufferGeometry {
    constructor(SPhi, DPhi, numZPlanes, rInner, rOuter, z) {
        super();
        this.type = "aPolyconeGeometry";

        // Create Polycone Inner and Outer Geometry
        const geometryIn = new PolyconeGeometry(numZPlanes, rInner, z, 32, 1, false, (SPhi + 90) * Math.PI / 180, DPhi * Math.PI / 180);
        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, (SPhi + 90) * Math.PI / 180, DPhi * Math.PI / 180);

        // Create Meshes
        const meshIn = new THREE.Mesh(geometryIn, new THREE.MeshBasicMaterial());
        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());

        // Compute bounding box dimensions
        let maxWidth = Math.max(...rOuter);
        let maxHeight = Math.max(...z);

        // Create Box Geometry for Boolean Operations
        const boxGeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);
        const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial());
        boxMesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

        // Convert to CSG for Boolean Operations
        let MeshCSG1 = CSG.fromMesh(meshOut);
        let MeshCSG2 = CSG.fromMesh(meshIn);
        let MeshCSG3 = CSG.fromMesh(boxMesh);

        // Final Mesh Creation
        let finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4(), new THREE.MeshBasicMaterial());
        finalMesh.geometry.computeVertexNormals();

        // Rotate and Update Mesh
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();

        // Convert to CSG and back for final geometry
        let finalCSG = CSG.fromMesh(finalMesh);
        const finalGeometry = CSG.toGeometry(finalCSG);

        // Assign parameters to geometry for serialization
        finalGeometry.type = "aPolyconeGeometry";
        const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
        finalGeometry.geometry.parameters = param;
    
        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aPolyconeGeometry(data.rInner, data.rOuter, data.z, data.numZPlanes, data.SPhi, data.DPhi);
    }
}

export { aPolyconeGeometry };
