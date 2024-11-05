import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateGenericTrap(pDz, px, py) {
    const material = new THREE.MeshBasicMaterial();
    const vertices = [];
    const indices = [];

    // Create the vertices based on the input arrays
    for (let i = 0; i < 8; i++) {
        if (i > 3) {
            vertices.push(px[i], 1 * pDz, py[i]);
        } else {
            vertices.push(px[i], -1 * pDz, py[i]);
        }
    }

    // Define the indices for the geometry
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
    const param = { 'pDz': pDz, 'px': px, 'py': py };
    mesh.name = 'GenericTrap';
    mesh.geometry.parameters = param;
    mesh.geometry.type = 'aGenericTrapGeometry';

    return mesh; // Return the created mesh
}

export{CreateGenericTrap};