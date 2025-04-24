import * as THREE from "three";

class aPolyconeGeometry extends THREE.BufferGeometry {
    constructor(SPhi, DPhi, numZPlanes, zPlaneData) {
        super();
        this.type = "aPolyconeGeometry";

        const cmTOmm = 10;

        const z = [];
        const rInner = [];
        const rOuter = [];
        
        for (let i = 0; i < numZPlanes; i++) {
            const baseIndex = i * 3;
            z.push(zPlaneData[baseIndex] * cmTOmm);
            rInner.push(zPlaneData[baseIndex + 1] * cmTOmm);
            rOuter.push(zPlaneData[baseIndex + 2] * cmTOmm);
        }

        const startAngle = THREE.MathUtils.degToRad(SPhi);
        const totalAngle = THREE.MathUtils.degToRad(DPhi);
        const phiSegments = Math.max(Math.ceil(DPhi / 15), 8); 
        const angleIncrement = totalAngle / phiSegments;
        
        const positions = [];
        const normals = [];
        const indices = [];
        let vertexCount = 0;
        
        const addTriangle = (v1, v2, v3, normalIsOutward = true) => {
            positions.push(...v1, ...v2, ...v3);
            
            const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
            const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];
            
            let normal = [
                edge1[1] * edge2[2] - edge1[2] * edge2[1],
                edge1[2] * edge2[0] - edge1[0] * edge2[2],
                edge1[0] * edge2[1] - edge1[1] * edge2[0]
            ];
            
            const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
            if (length > 0) {
                normal = [
                    normal[0] / length,
                    normal[1] / length,
                    normal[2] / length
                ];
            }
            
            if (!normalIsOutward) {
                normal = [-normal[0], -normal[1], -normal[2]];
            }
            
            normals.push(...normal, ...normal, ...normal);
            
            indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
            vertexCount += 3;
        };
        
        const addQuad = (v1, v2, v3, v4, normalIsOutward = true) => {
            addTriangle(v1, v2, v3, normalIsOutward);
            addTriangle(v1, v3, v4, normalIsOutward);
        };
        
        for (let zIdx = 0; zIdx < numZPlanes - 1; zIdx++) {
            const z1 = z[zIdx];
            const z2 = z[zIdx + 1];
            const rIn1 = rInner[zIdx];
            const rIn2 = rInner[zIdx + 1];
            const rOut1 = rOuter[zIdx];
            const rOut2 = rOuter[zIdx + 1];
            
            for (let phiIdx = 0; phiIdx < phiSegments; phiIdx++) {
                const phi1 = startAngle + phiIdx * angleIncrement;
                const phi2 = startAngle + (phiIdx + 1) * angleIncrement;
                
                const cos1 = Math.cos(phi1);
                const sin1 = Math.sin(phi1);
                const cos2 = Math.cos(phi2);
                const sin2 = Math.sin(phi2);
                
                const outerV1 = [rOut1 * cos1, rOut1 * sin1, z1];
                const outerV2 = [rOut1 * cos2, rOut1 * sin2, z1];
                const outerV3 = [rOut2 * cos2, rOut2 * sin2, z2];
                const outerV4 = [rOut2 * cos1, rOut2 * sin1, z2];
                
                addQuad(outerV1, outerV2, outerV3, outerV4, true);
                
                if (rIn1 > 0 && rIn2 > 0) {
                    const innerV1 = [rIn1 * cos1, rIn1 * sin1, z1];
                    const innerV2 = [rIn1 * cos2, rIn1 * sin2, z1];
                    const innerV3 = [rIn2 * cos2, rIn2 * sin2, z2];
                    const innerV4 = [rIn2 * cos1, rIn2 * sin1, z2];
                    
                    addQuad(innerV1, innerV4, innerV3, innerV2, false);
                    
                    addQuad(innerV1, innerV2, outerV2, outerV1, false);
                    
                    addQuad(innerV4, outerV4, outerV3, innerV3, true);
                } else {
                    
                    if (zIdx === 0 || rInner[zIdx-1] > 0) {
                        const centerBottom = [0, 0, z1];
                        addTriangle(centerBottom, outerV1, outerV2, false);
                    }
                    
                    if (zIdx === numZPlanes - 2 || rInner[zIdx+2] > 0) {
                        const centerTop = [0, 0, z2];
                        addTriangle(centerTop, outerV3, outerV4, true);
                    }
                }
            }
        }
        
        if (Math.abs(DPhi - 360) > 0.001) {
            for (let zIdx = 0; zIdx < numZPlanes - 1; zIdx++) {
                const z1 = z[zIdx];
                const z2 = z[zIdx + 1];
                const rIn1 = rInner[zIdx];
                const rIn2 = rInner[zIdx + 1];
                const rOut1 = rOuter[zIdx];
                const rOut2 = rOuter[zIdx + 1];
                
                const phi = startAngle;
                const cosPhi = Math.cos(phi);
                const sinPhi = Math.sin(phi);
                
                if (rIn1 > 0 && rIn2 > 0) {
                    const innerBottom = [rIn1 * cosPhi, rIn1 * sinPhi, z1];
                    const outerBottom = [rOut1 * cosPhi, rOut1 * sinPhi, z1];
                    const innerTop = [rIn2 * cosPhi, rIn2 * sinPhi, z2];
                    const outerTop = [rOut2 * cosPhi, rOut2 * sinPhi, z2];
                    
                    addQuad(innerBottom, outerBottom, outerTop, innerTop, false);
                } else {
                    const centerBottom = [0, 0, z1];
                    const centerTop = [0, 0, z2];
                    const outerBottom = [rOut1 * cosPhi, rOut1 * sinPhi, z1];
                    const outerTop = [rOut2 * cosPhi, rOut2 * sinPhi, z2];
                    
                    addQuad(centerBottom, outerBottom, outerTop, centerTop, false);
                }
            }
            
            for (let zIdx = 0; zIdx < numZPlanes - 1; zIdx++) {
                const z1 = z[zIdx];
                const z2 = z[zIdx + 1];
                const rIn1 = rInner[zIdx];
                const rIn2 = rInner[zIdx + 1];
                const rOut1 = rOuter[zIdx];
                const rOut2 = rOuter[zIdx + 1];
                
                const phi = startAngle + totalAngle;
                const cosPhi = Math.cos(phi);
                const sinPhi = Math.sin(phi);
                
                if (rIn1 > 0 && rIn2 > 0) {
                    const innerBottom = [rIn1 * cosPhi, rIn1 * sinPhi, z1];
                    const outerBottom = [rOut1 * cosPhi, rOut1 * sinPhi, z1];
                    const innerTop = [rIn2 * cosPhi, rIn2 * sinPhi, z2];
                    const outerTop = [rOut2 * cosPhi, rOut2 * sinPhi, z2];
                    
                    addQuad(outerBottom, innerBottom, innerTop, outerTop, true);
                } else {
                    const centerBottom = [0, 0, z1];
                    const centerTop = [0, 0, z2];
                    const outerBottom = [rOut1 * cosPhi, rOut1 * sinPhi, z1];
                    const outerTop = [rOut2 * cosPhi, rOut2 * sinPhi, z2];
                    
                    addQuad(outerBottom, centerBottom, centerTop, outerTop, true);
                }
            }
        }
        
        this.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setIndex(indices);
        this.computeVertexNormals();
        
        // this.rotateX(Math.PI / 2);
        
        this.parameters = {
            "SPhi": SPhi,
            "DPhi": DPhi,
            "numZPlanes": numZPlanes,
            "zPlaneData": zPlaneData.slice()
        };
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aPolyconeGeometry(
            data.SPhi, 
            data.DPhi, 
            data.numZPlanes,
            data.zPlaneData
        );
    }
}

export { aPolyconeGeometry };