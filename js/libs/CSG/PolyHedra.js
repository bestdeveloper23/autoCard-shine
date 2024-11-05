import * as THREE from "three";
import { CSG } from "../CSGMesh.js";
import { PolyconeGeometry } from "../geometry/PolyconeGeometry.js";
import { PolyhedronGeometry } from "../geometry/PolyhedronGeometry.js";


function CreatePolyHedra(SPhi, DPhi, numSide, numZPlanes, rInner, rOuter, z) {

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

    // Attach custom parameters to geometry
    const param = {'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aPolyhedraGeometry';
    finalMesh.name = 'Polyhedra';

    return finalMesh;
}
export { CreatePolyHedra };