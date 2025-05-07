import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTwistedTubeGeometry extends THREE.BufferGeometry {
    constructor(pRmin, pRmax, pdz, SPhi, DPhi, Twistedangle) {
        super();
        this.type = "aTwistedTubeGeometry";
        
        const numSide = 120;
        const numZPlanes = 2;
        const zPlaneData = [-pdz, pRmin, pRmax, pdz, pRmin, pRmax];
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

        const halfDPhi = DPhi / 2;
        const startAngle = THREE.MathUtils.degToRad(SPhi - halfDPhi);
        const totalAngle = THREE.MathUtils.degToRad(DPhi);
        const angleIncrement = totalAngle / numSide;
        
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
            normal = [
                normal[0] / length,
                normal[1] / length,
                normal[2] / length
            ];
            
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
        
        // main tube surfaces
        for (let zIdx = 0; zIdx < numZPlanes - 1; zIdx++) {
            const z1 = z[zIdx];
            const z2 = z[zIdx + 1];
            const rIn1 = rInner[zIdx];
            const rIn2 = rInner[zIdx + 1];
            const rOut1 = rOuter[zIdx];
            const rOut2 = rOuter[zIdx + 1];
            
            for (let phiIdx = 0; phiIdx < numSide; phiIdx++) {
                const phi1 = startAngle + phiIdx * angleIncrement;
                const phi2 = startAngle + (phiIdx + 1) * angleIncrement;
                
                const cos1 = Math.cos(phi1);
                const sin1 = Math.sin(phi1);
                const cos2 = Math.cos(phi2);
                const sin2 = Math.sin(phi2);
                
                //outer surface
                const outerV1 = [rOut1 * cos1, rOut1 * sin1, z1];
                const outerV2 = [rOut1 * cos2, rOut1 * sin2, z1];
                const outerV3 = [rOut2 * cos2, rOut2 * sin2, z2];
                const outerV4 = [rOut2 * cos1, rOut2 * sin1, z2];
                addQuad(outerV1, outerV2, outerV3, outerV4, true);
                
                //inner surface
                const innerV1 = [rIn1 * cos1, rIn1 * sin1, z1];
                const innerV2 = [rIn1 * cos2, rIn1 * sin2, z1];
                const innerV3 = [rIn2 * cos2, rIn2 * sin2, z2];
                const innerV4 = [rIn2 * cos1, rIn2 * sin1, z2];
                addQuad(innerV1, innerV4, innerV3, innerV2, false);
                
                addQuad(innerV1, innerV2, outerV2, outerV1, false); // bottom cap
                addQuad(innerV4, outerV4, outerV3, innerV3, true);  // top cap
            }
        }
        
        if (Math.abs(DPhi - 360) > 0.001) {
            const phi1 = startAngle;
            const cos1 = Math.cos(phi1);
            const sin1 = Math.sin(phi1);
            
            const innerBottom1 = [rInner[0] * cos1, rInner[0] * sin1, z[0]];
            const outerBottom1 = [rOuter[0] * cos1, rOuter[0] * sin1, z[0]];
            const innerTop1 = [rInner[1] * cos1, rInner[1] * sin1, z[1]];
            const outerTop1 = [rOuter[1] * cos1, rOuter[1] * sin1, z[1]];
            
            const numRadialSegments = numSide;
            
            for (let i = 0; i < numRadialSegments; i++) {
                const t1 = i / numRadialSegments;
                const t2 = (i + 1) / numRadialSegments;
                
                const bottomX1 = innerBottom1[0] + t1 * (outerBottom1[0] - innerBottom1[0]);
                const bottomY1 = innerBottom1[1] + t1 * (outerBottom1[1] - innerBottom1[1]);
                const bottomX2 = innerBottom1[0] + t2 * (outerBottom1[0] - innerBottom1[0]);
                const bottomY2 = innerBottom1[1] + t2 * (outerBottom1[1] - innerBottom1[1]);
                
                const topX1 = innerTop1[0] + t1 * (outerTop1[0] - innerTop1[0]);
                const topY1 = innerTop1[1] + t1 * (outerTop1[1] - innerTop1[1]);
                const topX2 = innerTop1[0] + t2 * (outerTop1[0] - innerTop1[0]);
                const topY2 = innerTop1[1] + t2 * (outerTop1[1] - innerTop1[1]);
                
                const v1 = [bottomX1, bottomY1, z[0]];
                const v2 = [bottomX2, bottomY2, z[0]];
                const v3 = [topX2, topY2, z[1]];
                const v4 = [topX1, topY1, z[1]];
                
                addQuad(v1, v2, v3, v4, false);
            }
            
            //side wall
            const phi2 = startAngle + totalAngle;
            const cos2 = Math.cos(phi2);
            const sin2 = Math.sin(phi2);
            
            const innerBottom2 = [rInner[0] * cos2, rInner[0] * sin2, z[0]];
            const outerBottom2 = [rOuter[0] * cos2, rOuter[0] * sin2, z[0]];
            const innerTop2 = [rInner[1] * cos2, rInner[1] * sin2, z[1]];
            const outerTop2 = [rOuter[1] * cos2, rOuter[1] * sin2, z[1]];
            
            for (let i = 0; i < numRadialSegments; i++) {
                const t1 = i / numRadialSegments;
                const t2 = (i + 1) / numRadialSegments;
                
                const bottomX1 = innerBottom2[0] + t1 * (outerBottom2[0] - innerBottom2[0]);
                const bottomY1 = innerBottom2[1] + t1 * (outerBottom2[1] - innerBottom2[1]);
                const bottomX2 = innerBottom2[0] + t2 * (outerBottom2[0] - innerBottom2[0]);
                const bottomY2 = innerBottom2[1] + t2 * (outerBottom2[1] - innerBottom2[1]);
                
                const topX1 = innerTop2[0] + t1 * (outerTop2[0] - innerTop2[0]);
                const topY1 = innerTop2[1] + t1 * (outerTop2[1] - innerTop2[1]);
                const topX2 = innerTop2[0] + t2 * (outerTop2[0] - innerTop2[0]);
                const topY2 = innerTop2[1] + t2 * (outerTop2[1] - innerTop2[1]);
                
                const v1 = [bottomX1, bottomY1, z[0]];
                const v2 = [bottomX2, bottomY2, z[0]];
                const v3 = [topX2, topY2, z[1]];
                const v4 = [topX1, topY1, z[1]];
                
                addQuad(v2, v1, v4, v3, true);
            }
        }
        
        this.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        this.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        this.setIndex(indices);
        
        // Apply twist centered on X axis
        const twistRad = (Twistedangle / 180) * Math.PI;
        const position = this.getAttribute('position');
        const vec3 = new THREE.Vector3();
        
        let zMin = z[0];
        let zMax = z[1];
        let zRange = zMax - zMin;
        
        for (let i = 0; i < position.count; i++) {
            vec3.fromBufferAttribute(position, i);
            
            const normalizedZ = (vec3.z - zMin) / zRange;
            
            const centeredZ = normalizedZ - 0.5;
            const angle = centeredZ * twistRad;
            
            const radius = Math.sqrt(vec3.x * vec3.x + vec3.y * vec3.y);
            const theta = Math.atan2(vec3.y, vec3.x);

            const newTheta = theta + angle;
            vec3.x = radius * Math.cos(newTheta);
            vec3.y = radius * Math.sin(newTheta);
            
            position.setXYZ(i, vec3.x, vec3.y, vec3.z);
        }
        
        position.needsUpdate = true;
        this.computeVertexNormals();
                
        this.type = "aTwistedTubeGeometry";
        this.parameters = {
            'pRMin': pRmin,
            'pRMax': pRmax,
            'pDz': pdz,
            'pSPhi': SPhi,
            'pDPhi': DPhi,
            'twistedangle': Twistedangle
        };
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTwistedTubeGeometry(
            data.pRMin,
            data.pRMax,
            data.pDz,
            data.pSPhi,
            data.pDPhi,
            data.twistedangle
        );
    }
}

export { aTwistedTubeGeometry };