import * as THREE from "three";
import { CSG } from "../CSGMesh.js";
import { PolyconeGeometry } from "../geometry/PolyconeGeometry.js";

class aPolyconeGeometry extends THREE.BufferGeometry {
    constructor(SPhi, DPhi, numZPlanes, rInner, rOuter, z) {
        super();
        this.type = "aPolyconeGeometry";

        const material = new THREE.MeshBasicMaterial();

        const geometryIn = new PolyconeGeometry(numZPlanes, rInner, z, 32, 1, false, (SPhi + 90)/180*Math.PI, DPhi/180*Math.PI);
        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, (SPhi + 90)/180*Math.PI, DPhi/180*Math.PI);

        const meshIn = new THREE.Mesh(geometryIn, new THREE.MeshBasicMaterial());
        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());
        let maxWidth = Math.max(...rOuter);
        let maxHeight = Math.max(...z);

        const boxgeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());
        boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

        let MeshCSG1 = CSG.fromMesh(meshOut);
        let MeshCSG2 = CSG.fromMesh(meshIn);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4(), material);
        
        finalMesh.geometry.computeVertexNormals();
        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        let aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);

        // Convert to CSG and back for final geometry
        let finalCSG = CSG.fromMesh(finalMesh);
        const finalGeometry = CSG.toGeometry(finalCSG);

        finalGeometry.type = "aPolyconeGeometry";
        finalGeometry.parameters = { 'SPhi': SPhi, 'DPhi': DPhi, 'numZPlanes': numZPlanes, 'rInner': rInner, 'rOuter': rOuter, 'z': z   };
    
        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aPolyconeGeometry(data.SPhi, data.DPhi, data.numZPlanes, data.rInner, data.rOuter, data.z  );
    }
}

export { aPolyconeGeometry };
