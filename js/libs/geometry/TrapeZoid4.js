import * as THREE from "three";

class aTwistedTrapGeometry extends THREE.BufferGeometry {
    constructor(dx1, dx2, dy1, dx3, dx4, dy2, dz, theta, phi, alpha,twistedangle) {
        super();
        this.type = "aTwistedTrapGeometry";
        
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
        boxGeometry.type = "aTwistedTrapGeometry";
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
            'alpha': alpha,
            'twistedangle': twistedangle
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
        return new aTwistedTrapGeometry(
            data.dx1, 
            data.dx2, 
            data.dy1, 
            data.dx3, 
            data.dx4, 
            data.dy2, 
            data.dz, 
            data.theta, 
            data.phi, 
            data.alpha,
            data.twistedangle
        );
    }
}

export { aTwistedTrapGeometry };



// import * as THREE from "three";
// import { CSG } from "../CSGMesh.js";

// class aTwistedTrapGeometry extends THREE.BufferGeometry {
//     constructor(pdx1, pdx2, pdy1, pdx3, pdx4, pdy2, pdz, pTheta, pPhi, pAlpha, twistedangle) {
//         super();
        
//         this.type = "aTwistedTrapGeometry";
        
//         // Convert mm to cm
//         const mmTOcm = 10;
//         const pDx1 = pdx1 * mmTOcm;  // Half length X at smaller Y, -dz
//         const pDx2 = pdx2 * mmTOcm;  // Half length X at smaller Y, +dz
//         const pDy1 = pdy1 * mmTOcm;  // Half length Y at -dz
//         const pDx3 = pdx3 * mmTOcm;  // Half length X at bigger Y, -dz
//         const pDx4 = pdx4 * mmTOcm;  // Half length X at bigger Y, +dz
//         const pDy2 = pdy2 * mmTOcm;  // Half length Y at +dz
//         const pDz = pdz * mmTOcm;    // Half length in Z
        
//         // Convert angles to radians
//         const thetaRad = -pTheta * Math.PI / 180;
//         const phiRad = -pPhi * Math.PI / 180;
//         const alphaRad = -pAlpha * Math.PI / 180;
//         const twistRad = twistedangle * Math.PI / 180;
        
//         // Constants
//         const cosAlpha = Math.cos(alphaRad);
//         const sinAlpha = Math.sin(alphaRad);
//         const tanTheta = Math.tan(thetaRad);
//         const cosPhi = Math.cos(phiRad);
//         const sinPhi = Math.sin(phiRad);
        
//         // Create a box geometry with higher resolution for smoother twist
//         const boxGeometry = new THREE.BoxGeometry(2, 2, 2, 30, 30, 30);
//         const positions = boxGeometry.attributes.position.array;
        
//         // Process each vertex
//         for (let i = 0; i < positions.length; i += 3) {
//             // Get normalized position in the box
//             const x = positions[i];
//             const y = positions[i + 1];
//             const z = positions[i + 2];
            
//             // 1. Calculate the z fraction (0 at bottom, 1 at top)
//             const zFraction = (z + 1) / 2;
            
//             // 2. Calculate twist angle based on z position
//             const twistAngle = twistRad * zFraction;
            
//             // 3. Determine the x and y dimensions at this z-level through interpolation
//             let xDim, yDim;
            
//             if (y > 0) {  // Upper half
//                 xDim = pDx3 * (1 - zFraction) + pDx4 * zFraction;
//             } else {      // Lower half
//                 xDim = pDx1 * (1 - zFraction) + pDx2 * zFraction;
//             }
            
//             yDim = pDy1 * (1 - zFraction) + pDy2 * zFraction;
            
//             // 4. Create initial untransformed coordinates
//             let initialX = x * xDim;
//             let initialY = y * yDim;
//             let initialZ = z * pDz;
            
//             // 5. Apply alpha rotation (YX shear)
//             let tempX = initialX;
//             let tempY = initialY;
//             initialX = tempX * cosAlpha - tempY * sinAlpha;
//             initialY = tempX * sinAlpha + tempY * cosAlpha;
            
//             // 6. Apply theta/phi displacement proportional to z
//             const displacementX = tanTheta * cosPhi * initialZ;
//             const displacementY = tanTheta * sinPhi * initialZ;
            
//             initialX += displacementX * zFraction;  // Apply proportionally to z position
//             initialY += displacementY * zFraction;
            
//             // 7. Now apply the twist around z-axis
//             const cosTwist = Math.cos(twistAngle);
//             const sinTwist = Math.sin(twistAngle);
            
//             const twistedX = initialX * cosTwist - initialY * sinTwist;
//             const twistedY = initialX * sinTwist + initialY * cosTwist;
            
//             // 8. Update vertex position
//             positions[i] = twistedX;
//             positions[i + 1] = twistedY;
//             positions[i + 2] = initialZ;
//         }
        
//         // Update the geometry
//         boxGeometry.attributes.position.needsUpdate = true;
//         boxGeometry.computeVertexNormals();
        
//         // Copy the modified geometry
//         this.copy(boxGeometry);
        
//         // Set parameters
//         this.type = "aTwistedTrapGeometry";
//         this.parameters = {
//             'dx1': pdx1,
//             'dx2': pdx2,
//             'dy1': pdy1,
//             'dx3': pdx3,
//             'dx4': pdx4,
//             'dy2': pdy2,
//             'dz': pdz,
//             'theta': pTheta,
//             'phi': pPhi,
//             'alpha': pAlpha,
//             'twistedangle': twistedangle
//         };
//     }
    
//     copy(source) {
//         super.copy(source);
//         if (source.parameters) {
//             this.parameters = Object.assign({}, source.parameters);
//         }
//         return this;
//     }
    
//     static fromJSON(data) {
//         return new aTwistedTrapGeometry(
//             data.dx1, data.dx2, data.dy1, data.dx3, data.dx4, data.dy2,
//             data.dz, data.theta, data.phi, data.alpha, data.twistedangle
//         );
//     }
// }

// export { aTwistedTrapGeometry };