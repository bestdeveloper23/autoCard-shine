import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

// Alternative implementation using a transformed box geometry
class aParallGeometry extends THREE.BufferGeometry {
    constructor(dX, dZ, dY, alpha, theta, phi) {
        super();
        
        this.type = 'aParallGeometry';
        
        // Convert mm to cm
        const dx = dX * 10;
        const dy = dY * 10;
        const dz = dZ * 10;
        
        // Convert angles from degrees to radians
        const alphaRad = alpha * Math.PI / 180;
        const thetaRad = theta * Math.PI / 180;
        const phiRad = phi * Math.PI / 180;
        
        // Start with a box of the specified dimensions
        const boxGeometry = new THREE.BoxGeometry(dx, dy, dz);
        
        // Create a transformation matrix that includes the shearing
        // 1. Shear in the y-z plane (alpha)
        const shearYZ = new THREE.Matrix4().set(
            1, 0, 0, 0,
            0, 1, Math.tan(alphaRad), 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        
        // 2. Shear in the x-z plane (theta, phi)
        const tanTheta = Math.tan(thetaRad);
        const shearXZ = new THREE.Matrix4().set(
            1, 0, tanTheta * Math.cos(phiRad), 0,
            0, 1, tanTheta * Math.sin(phiRad), 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        
        // Apply the transformations
        const transformMatrix = new THREE.Matrix4().multiply(shearXZ).multiply(shearYZ);
        boxGeometry.applyMatrix4(transformMatrix);
        
        // Clone the attributes from the transformed box
        this.copy(boxGeometry);
        
        // Calculate flat normals for better lighting
        this.computeVertexNormals();
        
        // Store parameters
        this.type = 'aParallGeometry';
        this.parameters = {
            'dx': dX,
            'dy': dY,
            'dz': dZ,
            'alpha': alpha,
            'theta': theta,
            'phi': phi
        };
        
    }
    
    copy(source) {
        super.copy(source);
        if (source.parameters) {
            this.parameters = Object.assign({}, source.parameters);
        }
        return this;
    }
    
    static fromJSON(data) {
        return new aParallGeometry(
            data.dx,
            data.dz,
            data.dy,
            data.alpha,
            data.theta,
            data.phi
        );
    }
}
export {aParallGeometry}