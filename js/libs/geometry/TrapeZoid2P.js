import * as THREE from "three";

class aTrapeZoidPGeometry extends THREE.BufferGeometry {
    constructor(dx1, dx2, dy1, dx3, dx4, dy2, dz, theta, phi, alpha) {
        super();
        this.type = "aTrapeZoidPGeometry";
        
        // Convert mm to cm if needed
        const mmTocm = 10;
        const pDx1 = dx1 * mmTocm; // Half length X at smaller Y, -dz
        const pDx2 = dx2 * mmTocm; // Half length X at smaller Y, +dz
        const pDy1 = dy1 * mmTocm; // Half length Y at -dz
        const pDx3 = dx3 * mmTocm; // Half length X at bigger Y, -dz
        const pDx4 = dx4 * mmTocm; // Half length X at bigger Y, +dz
        const pDy2 = dy2 * mmTocm; // Half length Y at +dz
        const pDz = dz * mmTocm;   // Half length in Z
        const pTheta = theta;      // Polar angle
        const pPhi = phi;          // Azimuthal angle
        const pAlpha = alpha;      // Angle with respect to Y
        
        // Create a box geometry that we'll modify - use dimensions that will make vertex mapping easier
        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        
        // Convert angles to radians
        const thetaRad = (theta * Math.PI) / 180;
        const phiRad = (phi * Math.PI) / 180;
        const alphaRad = (alpha * Math.PI) / 180;
        
        // Calculate displacements based on theta and phi
        const dx = pDz * Math.sin(thetaRad) * Math.cos(phiRad);
        const dy = pDz * Math.sin(thetaRad) * Math.sin(phiRad);
        
        // Prepare rotation matrices
        const cosAlpha = Math.cos(alphaRad);
        const sinAlpha = Math.sin(alphaRad);
        
        // Get position attribute for modification
        const positions = boxGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            // Get normalized position in the box
            const x = positions[i];      // Will be between -1 and 1
            const y = positions[i + 1];  // Will be between -1 and 1
            const z = positions[i + 2];  // Will be between -1 and 1
            
            // Map vertices based on their position in the box
            let newX, newY, newZ;
            
            // Handle z-coordinate first (maps to the trapezoid's z dimension)
            newZ = z * pDz;
            
            // Important: Apply alpha rotation to each face BEFORE applying theta/phi displacement
            if (z > 0) { // Top face (+dz)
                // Handle x-coordinate (depends on y position)
                if (y > 0) { // Upper half of top face
                    newX = (x > 0) ? pDx4 : -pDx4;
                } else { // Lower half of top face
                    newX = (x > 0) ? pDx2 : -pDx2;
                }
                
                // Handle y-coordinate
                newY = (y > 0) ? pDy2 : -pDy2;
                
                // Apply alpha rotation to top face
                if (alpha !== 0) {
                    const tempX = newX;
                    const tempY = newY;
                    
                    newX = tempX * cosAlpha - tempY * sinAlpha;
                    newY = tempX * sinAlpha + tempY * cosAlpha;
                }
                
                // Apply theta/phi displacement AFTER alpha rotation
                newX += dx;
                newY += dy;
            } else { // Bottom face (-dz)
                // Handle x-coordinate (depends on y position)
                if (y > 0) { // Upper half of bottom face
                    newX = (x > 0) ? pDx3 : -pDx3;
                } else { // Lower half of bottom face
                    newX = (x > 0) ? pDx1 : -pDx1;
                }
                
                // Handle y-coordinate
                newY = (y > 0) ? pDy1 : -pDy1;
                
                // Apply alpha rotation to bottom face if needed
                if (alpha !== 0) {
                    const tempX = newX;
                    const tempY = newY;
                    
                    newX = tempX * cosAlpha - tempY * sinAlpha;
                    newY = tempX * sinAlpha + tempY * cosAlpha;
                }
                // No displacement for bottom face
            }
            
            // Linear interpolation for vertices between top and bottom faces
            if (Math.abs(z) < 0.9) { // Vertices on the side faces
                const t = (z + 1) / 2; // Normalized position between bottom (0) and top (1)
                
                // Calculate bottom face coordinates and apply alpha rotation
                let bottomX;
                if (y > 0) {
                    bottomX = (x > 0) ? pDx3 : -pDx3;
                } else {
                    bottomX = (x > 0) ? pDx1 : -pDx1;
                }
                
                let bottomY = (y > 0) ? pDy1 : -pDy1;
                
                // Apply alpha rotation to bottom coordinates
                if (alpha !== 0) {
                    const tempX = bottomX;
                    const tempY = bottomY;
                    
                    bottomX = tempX * cosAlpha - tempY * sinAlpha;
                    bottomY = tempX * sinAlpha + tempY * cosAlpha;
                }
                
                // Calculate top face coordinates, apply alpha rotation, then displacement
                let topX;
                if (y > 0) {
                    topX = (x > 0) ? pDx4 : -pDx4;
                } else {
                    topX = (x > 0) ? pDx2 : -pDx2;
                }
                
                let topY = (y > 0) ? pDy2 : -pDy2;
                
                // Apply alpha rotation to top coordinates
                if (alpha !== 0) {
                    const tempX = topX;
                    const tempY = topY;
                    
                    topX = tempX * cosAlpha - tempY * sinAlpha;
                    topY = tempX * sinAlpha + tempY * cosAlpha;
                }
                
                // Add displacement to top face AFTER alpha rotation
                topX += dx;
                topY += dy;
                
                // Interpolate
                newX = bottomX * (1 - t) + topX * t;
                newY = bottomY * (1 - t) + topY * t;
                newZ = -pDz * (1 - t) + pDz * t;
            }
            
            // Update vertex position
            positions[i] = newX;
            positions[i + 1] = newY;
            positions[i + 2] = newZ;
        }
        
        // Update the geometry
        boxGeometry.attributes.position.needsUpdate = true;
        boxGeometry.computeVertexNormals();
        boxGeometry.type = "aTrapeZoidPGeometry";
        boxGeometry.parameters = {
            'dx1': dx1, 
            'dx2': dx2, 
            'dy1': dy1, 
            'dx3': dx3, 
            'dx4': dx4, 
            'dy2': dy2, 
            'dz': dz, 
            'theta': theta, 
            'phi': phi, 
            'alpha': alpha
        };
        
        // Copy the modified box geometry to this geometry
        Object.assign(this, boxGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTrapeZoidPGeometry(
            data.dx1, 
            data.dx2, 
            data.dy1, 
            data.dx3, 
            data.dx4, 
            data.dy2, 
            data.dz, 
            data.theta, 
            data.phi, 
            data.alpha
        );
    }
}

export { aTrapeZoidPGeometry };