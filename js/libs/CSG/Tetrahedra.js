import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

function CreateTetrahedra(anchor, p2, p3, p4) {
    const material = new THREE.MeshBasicMaterial();
    const vertices = [];
    const indices = [];
    
    // Push the points into the vertices array
    vertices.push(...anchor, ...p2, ...p3, ...p4);
    
    // Define the indices for the tetrahedron
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
    
    // Create the geometry from vertices and indices
    const geometry = new THREE.PolyhedronGeometry(vertices, indices);

    // Create the mesh
    let mesh = new THREE.Mesh(geometry, material);

    // Rotate and update the mesh
    mesh.rotateX(Math.PI / 2);
    mesh.updateMatrix();
    
    // Perform CSG operations
    let aCSG = CSG.fromMesh(mesh);
    mesh = CSG.toMesh(aCSG, new THREE.Matrix4(), material);
    
    // Assign parameters to geometry
    const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
    mesh.name = 'Tetrahedra';
    mesh.geometry.parameters = param;
    mesh.geometry.type = 'aTetrahedraGeometry';

    return mesh; // Return the created mesh
}
export {CreateTetrahedra};
    
