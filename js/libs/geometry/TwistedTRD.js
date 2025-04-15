import * as THREE from "three";

class aTwistedTrdGeometry extends THREE.BufferGeometry {
    constructor(dx1, dy1, dz, dx2, dy2, twistedangle) {
        super();
        
        const mmTocm = 10;
        const dX1 = dx1*mmTocm;
        const dY1 = dy1*mmTocm;
        const dZ = dz*mmTocm;
        const dX2 = dx2*mmTocm;
        const dY2 = dy2*mmTocm;        
        
        const boxGeometry = new THREE.BoxGeometry(2,2,2,5,5,5);
        
        const positions = boxGeometry.attributes.position.array.slice();
        
        for (let i = 0; i < positions.length; i += 3) {
            let x = positions[i];
            let y = positions[i + 1];
            let z = positions[i + 2];
            
            const zRatio = (z + 1) / 2;
            
            const xScale = dX1 + (dX2 - dX1) * zRatio;
            const yScale = dY1 + (dY2 - dY1) * zRatio;
            
            x *= xScale;
            y *= yScale;
            
            const relativeZ = zRatio - 0.5;
            const twistAmount = (twistedangle * Math.PI / 180) * relativeZ;
            
            const newX = x * Math.cos(twistAmount) - y * Math.sin(twistAmount);
            const newY = x * Math.sin(twistAmount) + y * Math.cos(twistAmount);
            
            z *= dZ;
            
            positions[i] = newX;
            positions[i + 1] = newY;
            positions[i + 2] = z;
        }
        
        this.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.setIndex([...boxGeometry.index.array]);
        this.computeVertexNormals();
        
        this.parameters = {'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': twistedangle };
        this.type = "aTwistedTrdGeometry";
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTwistedTrdGeometry(
            data.dx1,
            data.dy1,
            data.dz,
            data.dx2,
            data.dy2,
            data.twistedangle
        );
    }
}

export { aTwistedTrdGeometry };
