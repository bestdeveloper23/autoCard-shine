import * as THREE from "three";

class aTrapeZoidPGeometry extends THREE.BufferGeometry {
    constructor(pDz, pTheta, pPhi, pDy1, pDx1, pDx2, pAlpha1, pDy2, pDx3, pDx4, pAlpha2 ) {
        super();
        this.type = "aTrapeZoidPGeometry";
        
        const mmTocm = 10;
        const dz = pDz * mmTocm;
        const dy1 = pDy1 * mmTocm;
        const dx1 = pDx1 * mmTocm;
        const dx2 = pDx2 * mmTocm;
        const dy2 = pDy2 * mmTocm;
        const dx3 = pDx3 * mmTocm;
        const dx4 = pDx4 * mmTocm;
        
        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        
        const thetaRad = (pTheta * Math.PI) / 180;
        const phiRad = (pPhi * Math.PI) / 180;
        const alpha1Rad = (pAlpha1 * Math.PI) / 180;
        const alpha2Rad = (pAlpha2 * Math.PI) / 180;
        
        const tanTheta = Math.tan(thetaRad);
        const tanPhi = Math.tan(phiRad);
        
        const positions = boxGeometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];      
            const y = positions[i + 1];  
            const z = positions[i + 2];  
            
            let newX, newY, newZ;
            
            newZ = z * dz;
            
            const t = (z + 1) / 2;
            
            newY = y * ((1 - t) * dy1 + t * dy2);
            
            let xScale;
            if (y >= 0) {
                xScale = (1 - t) * dx2 + t * dx4;
            } else {
                xScale = (1 - t) * dx1 + t * dx3;
            }
            newX = x * xScale;
            
            const alphaRad = (1 - t) * alpha1Rad + t * alpha2Rad;
            const tanAlpha = Math.tan(alphaRad);
            
            newX += newY * tanAlpha;
            
            newX += newZ * tanTheta * Math.cos(phiRad);
            
            newY += newZ * tanTheta * Math.sin(phiRad);
            
            positions[i] = newX;
            positions[i + 1] = newY;
            positions[i + 2] = newZ;
        }
        
        boxGeometry.attributes.position.needsUpdate = true;
        boxGeometry.computeVertexNormals();
        
        this.setAttribute('position', boxGeometry.getAttribute('position'));
        this.setAttribute('normal', boxGeometry.getAttribute('normal'));
        this.setAttribute('uv', boxGeometry.getAttribute('uv'));
        this.setIndex(boxGeometry.getIndex());
        
        this.parameters = {
            'dz': pDz, 
            'theta': pTheta, 
            'phi': pPhi, 
            'dy1': pDy1, 
            'dx1': pDx1, 
            'dx2': pDx2, 
            'alpha1': pAlpha1,
            'dy2': pDy2, 
            'dx3': pDx3, 
            'dx4': pDx4, 
            'alpha2': pAlpha2
        };
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTrapeZoidPGeometry(
            data.dz, 
            data.theta, 
            data.phi, 
            data.dy1, 
            data.dx1, 
            data.dx2, 
            data.alpha1, 
            data.dy2, 
            data.dx3, 
            data.dx4, 
            data.alpha2
        );
    }
}

export { aTrapeZoidPGeometry };