import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";

class aTetrahedraGeometry extends THREE.BufferGeometry {
    constructor(anchor, p2, p3, p4) {
        super();
        this.type = "aTetrahedraGeometry";

        const mmTOcm = 10;
        
        const points = [
            new THREE.Vector3(anchor[0] * mmTOcm, anchor[1] * mmTOcm, anchor[2] * mmTOcm),
            new THREE.Vector3(p2[0] * mmTOcm, p2[1] * mmTOcm, p2[2] * mmTOcm),
            new THREE.Vector3(p3[0] * mmTOcm, p3[1] * mmTOcm, p3[2] * mmTOcm),
            new THREE.Vector3(p4[0] * mmTOcm, p4[1] * mmTOcm, p4[2] * mmTOcm)
        ];
        
        const convexGeometry = new ConvexGeometry(points);
        
        const material = new THREE.MeshLambertMaterial({});
        
        let mesh = new THREE.Mesh(convexGeometry, material);
        
        mesh.rotateX(Math.PI / 2);
        mesh.updateMatrix();
        
        const finalGeometry = mesh.geometry.clone();
        finalGeometry.type = "aTetrahedraGeometry";
        finalGeometry.parameters = { 
            'anchor': anchor.slice(), 
            'p2': p2.slice(), 
            'p3': p3.slice(), 
            'p4': p4.slice() 
        };
        
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