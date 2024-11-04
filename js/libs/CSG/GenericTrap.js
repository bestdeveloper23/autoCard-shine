import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateGenericTrap( pDz, px , py ) {
    // const vertices = [], indices = [];
    for (let i = 0; i < 8; i++) {
        if (i > 3) {
            vertices.push(px[i], 1 * pDz, py[i]);
        } else {
            vertices.push(px[i], -1 * pDz, py[i]);
        }
    }

    indices.push(0, 2, 1, 0, 3, 2, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7);
    const geometry = new PolyhedronGeometry(vertices, indices);
    
    let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
    
    mesh.rotateX(Math.PI / 2);
    mesh.updateMatrix();
    let aCSG = CSG.fromMesh(mesh);
    mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
    mesh.name = 'GenericTrap';
    const param = { 'pDz': pDz, 'px': px, 'py': py };
    mesh.geometry.parameters = param;
    mesh.geometry.type = 'aGenericTrapGeometry';

    return mesh;
}
export{CreateGenericTrap};