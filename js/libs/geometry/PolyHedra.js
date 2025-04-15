import * as THREE from "three";

class aPolyhedraGeometry extends THREE.BufferGeometry {
    constructor(SPhi, DPhi, numSide, numZPlanes, rInner, rOuter, z) {
        super();
        this.type = "aPolyhedraGeometry";

        // Input validation
        if (numZPlanes < 2 || rInner.length !== numZPlanes || rOuter.length !== numZPlanes || z.length !== numZPlanes) {
            console.error("aPolyhedraGeometry: Invalid input arrays");
            return;
        }

        const startPhi = THREE.MathUtils.degToRad(SPhi);
        const totalPhi = THREE.MathUtils.degToRad(DPhi);
        const phiSegments = numSide;
        const phiIncrement = totalPhi / phiSegments;

        const positions = [];
        const normals = [];
        const indices = [];
        let vertexCount = 0;

        const calculateNormal = (v1, v2, v3) => {
            const a = new THREE.Vector3().subVectors(new THREE.Vector3(...v2), new THREE.Vector3(...v1));
            const b = new THREE.Vector3().subVectors(new THREE.Vector3(...v3), new THREE.Vector3(...v1));
            const normal = new THREE.Vector3().crossVectors(a, b).normalize();
            return [normal.x, normal.y, normal.z];
        };

        // Create side and top/bottom faces
        for (let zIndex = 0; zIndex < numZPlanes - 1; zIndex++) {
            const z1 = z[zIndex], z2 = z[zIndex + 1];
            const rIn1 = rInner[zIndex], rIn2 = rInner[zIndex + 1];
            const rOut1 = rOuter[zIndex], rOut2 = rOuter[zIndex + 1];

            for (let phiIndex = 0; phiIndex < phiSegments; phiIndex++) {
                const phi1 = startPhi + phiIndex * phiIncrement;
                const phi2 = startPhi + (phiIndex + 1) * phiIncrement;
                const sin1 = Math.sin(phi1), cos1 = Math.cos(phi1);
                const sin2 = Math.sin(phi2), cos2 = Math.cos(phi2);

                // Vertices
                const innerV1 = [rIn1 * cos1, rIn1 * sin1, z1];
                const innerV2 = [rIn2 * cos1, rIn2 * sin1, z2];
                const innerV3 = [rIn2 * cos2, rIn2 * sin2, z2];
                const innerV4 = [rIn1 * cos2, rIn1 * sin2, z1];

                const outerV1 = [rOut1 * cos1, rOut1 * sin1, z1];
                const outerV2 = [rOut1 * cos2, rOut1 * sin2, z1];
                const outerV3 = [rOut2 * cos2, rOut2 * sin2, z2];
                const outerV4 = [rOut2 * cos1, rOut2 * sin1, z2];

                // Inner wall
                const n1 = calculateNormal(innerV1, innerV2, innerV3);
                positions.push(...innerV1, ...innerV2, ...innerV3);
                normals.push(...n1, ...n1, ...n1);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                const n2 = calculateNormal(innerV1, innerV3, innerV4);
                positions.push(...innerV1, ...innerV3, ...innerV4);
                normals.push(...n2, ...n2, ...n2);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                // Outer wall
                const n3 = calculateNormal(outerV1, outerV2, outerV3);
                positions.push(...outerV1, ...outerV2, ...outerV3);
                normals.push(...n3, ...n3, ...n3);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                const n4 = calculateNormal(outerV1, outerV3, outerV4);
                positions.push(...outerV1, ...outerV3, ...outerV4);
                normals.push(...n4, ...n4, ...n4);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                // Bottom ring (at z1)
                const n5 = [0, 0, -1];
                positions.push(...innerV1, ...innerV4, ...outerV2);
                normals.push(...n5, ...n5, ...n5);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                positions.push(...innerV1, ...outerV2, ...outerV1);
                normals.push(...n5, ...n5, ...n5);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                // Top ring (at z2)
                const n6 = [0, 0, 1];
                positions.push(...innerV2, ...outerV4, ...outerV3);
                normals.push(...n6, ...n6, ...n6);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                positions.push(...innerV2, ...outerV3, ...innerV3);
                normals.push(...n6, ...n6, ...n6);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;
            }
        }

        if (Math.abs(DPhi - 360) > 0.001) {
            for (let zIndex = 0; zIndex < numZPlanes - 1; zIndex++) {
                const z1 = z[zIndex], z2 = z[zIndex + 1];
                const rIn1 = rInner[zIndex], rIn2 = rInner[zIndex + 1];
                const rOut1 = rOuter[zIndex], rOut2 = rOuter[zIndex + 1];

                const phiStart = startPhi;
                const sinS = Math.sin(phiStart), cosS = Math.cos(phiStart);

                const phiEnd = startPhi + totalPhi;
                const sinE = Math.sin(phiEnd), cosE = Math.cos(phiEnd);

                // Start Cap
                const v1 = [rIn1 * cosS, rIn1 * sinS, z1];
                const v2 = [rIn2 * cosS, rIn2 * sinS, z2];
                const v3 = [rOut2 * cosS, rOut2 * sinS, z2];
                const v4 = [rOut1 * cosS, rOut1 * sinS, z1];
                const nStart = [-sinS, cosS, 0];
                positions.push(...v1, ...v2, ...v3);
                normals.push(...nStart, ...nStart, ...nStart);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                positions.push(...v1, ...v3, ...v4);
                normals.push(...nStart, ...nStart, ...nStart);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                // End Cap
                const v5 = [rIn1 * cosE, rIn1 * sinE, z1];
                const v6 = [rOut1 * cosE, rOut1 * sinE, z1];
                const v7 = [rOut2 * cosE, rOut2 * sinE, z2];
                const v8 = [rIn2 * cosE, rIn2 * sinE, z2];
                const nEnd = [sinE, -cosE, 0];
                positions.push(...v5, ...v6, ...v7);
                normals.push(...nEnd, ...nEnd, ...nEnd);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;

                positions.push(...v5, ...v7, ...v8);
                normals.push(...nEnd, ...nEnd, ...nEnd);
                indices.push(vertexCount, vertexCount + 1, vertexCount + 2);
                vertexCount += 3;
            }
        }

        this.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
        this.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        this.setIndex(indices);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aPolyhedraGeometry(
            data.SPhi, data.DPhi, data.numSide, data.numZPlanes,
            data.rInner, data.rOuter, data.z
        );
    }
}

export { aPolyhedraGeometry };
