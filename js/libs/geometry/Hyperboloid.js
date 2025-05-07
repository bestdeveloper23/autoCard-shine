import * as THREE from "three";

class aHyperboloidGeometry extends THREE.BufferGeometry {
    constructor(radiusIn, radiusOut, innerStereo, outerStereo, pdz) {
        super();
        this.type = "aHyperboloidGeometry";

        const mmTOcm = 10;
        const halfZ = pdz * mmTOcm;

        const rMin = radiusIn * mmTOcm;
        const rMax = radiusOut * mmTOcm;

        const stInRad = innerStereo * Math.PI / 180;
        const stOutRad = outerStereo * Math.PI / 180;

        const radialSegments = 150;
        const heightSegments = 150;

        const slopeOut = Math.tan(stOutRad);
        const slopeIn = Math.tan(stInRad);

        const outerProfile = [];
        for (let i = 0; i <= heightSegments; i++) {
            const z = (i / heightSegments) * 2 * halfZ - halfZ;
            
            // hyperbolic radius: r^2 = (r0)^2 + (z*tan(θ))^2)

            const asymptote = Math.abs(z) * slopeOut;
            //calculate the hyperbolic radius
            const r = Math.sqrt(rMax*rMax + asymptote*asymptote);
            
            outerProfile.push(new THREE.Vector2(r, z));
        }

        let innerProfile = [];
        if (rMin > 0) {
            for (let i = heightSegments; i >= 0; i--) {
                const z = (i / heightSegments) * 2 * halfZ - halfZ;
                
                const asymptote = Math.abs(z) * slopeIn;
                const r = Math.sqrt(rMin*rMin + asymptote*asymptote);
                
                innerProfile.push(new THREE.Vector2(r, z));
            }
        }

        let profilePoints = [];
        if (rMin > 0) {
            profilePoints = [...outerProfile, ...innerProfile, outerProfile[0].clone()];
        } else {
            profilePoints = outerProfile;
        }

        const latheGeometry = new THREE.LatheGeometry(
            profilePoints,
            radialSegments,
            0,
            Math.PI * 2
        );

        this.copy(latheGeometry);
        this.rotateX(Math.PI / 2); 
        this.computeVertexNormals();

        this.parameters = {
            'radiusOut': radiusOut, 
            'radiusIn': radiusIn,
            'stereo1': outerStereo,
            'stereo2': innerStereo,
            'pDz': pdz
        };
    }

    copy(source) {
        super.copy(source);
        if (source.parameters) {
            this.parameters = { ...source.parameters };
        }
        return this;
    }

    static fromJSON(data) {
        return new aHyperboloidGeometry(
            data.radiusIn,
            data.radiusOut,
            data.stereo2,
            data.stereo1,
            data.pDz
        );
    }
}

export { aHyperboloidGeometry };