import * as THREE from "three";

class aTwistedTrapGeometry extends THREE.BufferGeometry {
    constructor(twistedangle, dz, theta, phi, dy1, dx1, dx2, dy2, dx3, dx4, alpha) {
        super();
        this.type = "aTwistedTrapGeometry";
        
        // Convert mm to cm if needed
        const mmTocm = 10;
        const pDx1 = dx1 * mmTocm; // Half length X at -Y, -dz
        const pDx2 = dx2 * mmTocm; // Half length X at +Y, -dz
        const pDy1 = dy1 * mmTocm; // Half length Y at -dz
        const pDx3 = dx3 * mmTocm; // Half length X at -Y, dz
        const pDx4 = dx4 * mmTocm; // Half length X at +Y, +dz
        const pDy2 = dy2 * mmTocm; // Half length Y at +dz
        const pDz = dz * mmTocm;   // Half length in Z
        
        const alphaRad = alpha * Math.PI / 180;
        const thetaRad = theta * Math.PI / 180;
        const phiRad = phi * Math.PI / 180;
        const twistedRad = twistedangle * Math.PI / 180;
        
        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        
        const positions = boxGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];      
            const y = positions[i + 1];  
            const z = positions[i + 2];  
            
            let newX, newY, newZ;
            
            newZ = z * pDz;
            
            newY = y * ((z >= 0) ? pDy2 : pDy1);
            
            if (z >= 0) { 
                if (y >= 0) { 
                    newX = x * pDx4;
                } else { 
                    newX = x * pDx3;  // Using correct pDx3 (maps to -Y, +dz)
                }
            } else { 
                if (y >= 0) { 
                    newX = x * pDx2;  // Using correct pDx2 (maps to +Y, -dz)
                } else { 
                    newX = x * pDx1;
                }
            }
            
            if (twistedangle !== 0) {
                const twistAmount = z * (twistedRad / 2);
                
                const cosTwist = Math.cos(twistAmount);
                const sinTwist = Math.sin(twistAmount);
                
                const tempX = newX;
                const tempY = newY;
                
                newX = tempX * cosTwist - tempY * sinTwist;
                newY = tempX * sinTwist + tempY * cosTwist;
            }
            
            positions[i] = newX;
            positions[i + 1] = newY;
            positions[i + 2] = newZ;
        }
        
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
        
        boxGeometry.attributes.position.needsUpdate = true;
        boxGeometry.computeVertexNormals();
        
        this.copy(boxGeometry);
        this.parameters = {
            'twistedangle': twistedangle,
            'dz': dz, 
            'theta': theta, 
            'phi': phi, 
            'dy1': dy1, 
            'dx1': dx1, 
            'dx2': dx2, 
            'dy2': dy2, 
            'dx3': dx3, 
            'dx4': dx4, 
            'alpha': alpha,
        };
        
        this.type = "aTwistedTrapGeometry";
    }

    copy(source) {
        super.copy(source);
        
        if (source.parameters) {
            this.parameters = Object.assign({}, source.parameters);
        }
        
        return this;
    }

    static fromJSON(data) {
        return new aTwistedTrapGeometry(
            data.twistedangle,
            data.dz,
            data.theta,
            data.phi,
            data.dy1,
            data.dx1,
            data.dx2,
            data.dy2,
            data.dx3,
            data.dx4,
            data.alpha
        );
    }
}

export { aTwistedTrapGeometry };