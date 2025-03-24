import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

class aGenericTrapGeometry extends THREE.BufferGeometry {
    constructor(pDz, px, py) {
        super();
        this.type = "aGenericTrapGeometry";

        const mmTOcm = 10;
        const scaledDz = pDz * mmTOcm;
        
        const points = [];
        
        for (let i = 0; i < 4; i++) {
            points.push(new THREE.Vector3(px[i] * mmTOcm, -scaledDz, py[i] * mmTOcm));
        }
        
        for (let i = 4; i < 8; i++) {
            points.push(new THREE.Vector3(px[i] * mmTOcm, scaledDz, py[i] * mmTOcm));
        }
        
        const convexGeometry = new ConvexGeometry(points);
        
        const material = new THREE.MeshLambertMaterial({});
        
        let mesh = new THREE.Mesh(convexGeometry, material);
        
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        
        const finalGeometry = mesh.geometry.clone();
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
