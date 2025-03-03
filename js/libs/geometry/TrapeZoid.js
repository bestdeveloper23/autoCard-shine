import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTrapeZoidGeometry extends THREE.BufferGeometry {
    constructor(dX1, dY1, dZ, dX2, dY2) {
        super();
        this.type = "aTrapeZoidGeometry";
        const mmTocm = 10;
        const dx1 = dX1*mmTocm;
        const dy1 = dY1*mmTocm;
        const dz = dZ*mmTocm;
        const dx2 = dX2*mmTocm;
        const dy2 = dY2*mmTocm;

        const maxWidth = Math.max(dx1, dx2);
        const maxHeight = Math.max(dy1, dy2);
        const finalGeometry = new THREE.BoxGeometry(maxWidth*2, maxHeight*2, dz * 2);
        
        // Get attributes for modification
        const positions = finalGeometry.attributes.position.array;
        
        // Modify the vertices to form a trapezoid
        for (let i = 0; i < positions.length; i += 3) {
        // Check if this vertex is at the top (z = dz)
        if (positions[i + 2] > 0) {
            // Scale x and y at the top face
            const scaleX = dx2 / maxWidth;
            const scaleY = dy2 / maxHeight;
            
            positions[i] *= scaleX;
            positions[i + 1] *= scaleY;
        } else {
            // Scale x and y at the bottom face
            const scaleX = dx1 / maxWidth;
            const scaleY = dy1 / maxHeight;
            
            positions[i] *= scaleX;
            positions[i + 1] *= scaleY;
        }
        }
        
        // Update the finalGeometry
        finalGeometry.attributes.position.needsUpdate = true;
        finalGeometry.computeVertexNormals();
        finalGeometry.type = "aTrapeZoidGeometry";
        finalGeometry.parameters = { 'dx1': dX1, 'dy1': dY1, 'dz': dZ, 'dx2': dX2, 'dy2': dY2 };

        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTrapeZoidGeometry(
            data.dx1, 
            data.dy1, 
            data.dz, 
            data.dx2, 
            data.dy2
        );
    }
}

export { aTrapeZoidGeometry };