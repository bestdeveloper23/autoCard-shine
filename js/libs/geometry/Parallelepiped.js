import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aParallGeometry extends THREE.BufferGeometry {
    constructor(dX, dY, dZ, alpha, theta, phi) {
        super();
        
        this.type = 'aParallGeometry';
        
        const dx = dX * 10 *2;
        const dy = dY * 10 *2;
        const dz = dZ * 10 *2;
        
        const alphaRad = -alpha * Math.PI / 180;
        const thetaRad = -theta * Math.PI / 180;
        const phiRad = -phi * Math.PI / 180;
        
        const boxGeometry = new THREE.BoxGeometry(dx, dy, dz);
        
        const shearYX = new THREE.Matrix4().set(
            1, Math.tan(alphaRad), 0, 0,   
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        
        const tanTheta = Math.tan(thetaRad);
        const shearXZ = new THREE.Matrix4().set(
            1, 0, tanTheta * Math.cos(phiRad), 0,
            0, 1, tanTheta * Math.sin(phiRad), 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
        
        const transformMatrix = new THREE.Matrix4().multiply(shearXZ).multiply(shearYX);
        boxGeometry.applyMatrix4(transformMatrix);
        boxGeometry.rotateX(Math.PI)
        
        this.copy(boxGeometry);
        
        this.computeVertexNormals();
        
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