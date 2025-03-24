

import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aTwistedTubeGeometry extends THREE.BufferGeometry {
    constructor(pRmin, pRmax, pdz, SPhi, DPhi, twistedangle) {
        super();
        this.type = "aTwistedTubeGeometry";
        
        const mmTOcm = 10;
        let pRMin = pRmin * mmTOcm;
        let pRMax = pRmax * mmTOcm;
        let pDz = pdz * mmTOcm;
        let pSPhi = Math.PI * SPhi / 180;
        let pDPhi = Math.PI * DPhi / 180;

        if (pRMin > pRMax) pRMin = pRMax - 0.1;
        const pieShape = new THREE.Shape();
        pieShape.absarc(0, 0, pRMax, pSPhi, pSPhi + pDPhi, false);
        pieShape.lineTo(0, 0);
        const extrusionsettings = { depth: pDz * 2, bevelEnabled: false };
        const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
        pieGeometry.translate(0, 0, -pDz);
        pieGeometry.rotateX(Math.PI / 2);

        const pieShape2 = new THREE.Shape();
        pieShape2.absarc(0, 0, pRMin, pSPhi, pSPhi + pDPhi, false);
        pieShape2.lineTo(0, 0);
        const extrusionsettings2 = { depth: pDz * 2, bevelEnabled: false };
        const pieGeometry2 = new THREE.ExtrudeGeometry(pieShape2, extrusionsettings2);
        pieGeometry2.translate(0, 0, -pDz);
        pieGeometry2.rotateX(Math.PI / 2);

        // Twist function
        const twistRad = (twistedangle / 180) * Math.PI;
        const axis = new THREE.Vector3(0, 1, 0); // Y-axis
        const vec3 = new THREE.Vector3();

        const twistGeometry = (geometry) => {
            const position = geometry.getAttribute("position");
            for (let i = 0; i < position.count; i++) {
                vec3.fromBufferAttribute(position, i);
                const angle = (vec3.y / (pDz * 2)) * twistRad;
                vec3.applyAxisAngle(axis, angle);
                position.setXYZ(i, vec3.x, vec3.y, vec3.z);
            }
            position.needsUpdate = true;
        };

        twistGeometry(pieGeometry);
        twistGeometry(pieGeometry2)


        const pieCSG = CSG.fromGeometry(pieGeometry);
        const pieCSG2 = CSG.fromGeometry(pieGeometry2)

        let resultCSG = pieCSG.subtract(pieCSG2);
        let geometry  = CSG.toGeometry(resultCSG);

        // Convert CSG back to geometry
        let finalGeometry = geometry;
        finalGeometry.type = "aTwistedTubeGeometry";
        finalGeometry.parameters = { 'pRMin': pRmin, 'pRMax': pRmax, 'pDz': pdz, 'pSPhi': pSPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };

        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aTwistedTubeGeometry(data.pRMin, data.pRMax, data.pDz, data.pSPhi, data.pDPhi, data.twistedangle);
    }
}

export { aTwistedTubeGeometry };


// import * as THREE from "three";
// import { CSG } from "../CSGMesh.js";

// class aTwistedTubeGeometry extends THREE.BufferGeometry {
//     constructor(pRmin, pRmax, pdz, SPhi, DPhi, twistedangle) {
//         super();
//         this.type = "aTwistedTubeGeometry";
//         const mmTOcm = 10;
//         let pRMin = pRmin * mmTOcm;
//         let pRMax = pRmax * mmTOcm;
//         let pDz = pdz * mmTOcm;
//         let pSPhi = Math.PI*SPhi/180;
//         let pDPhi = Math.PI*DPhi/180;
    
//         const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2);
//         const cylinder1CSG = CSG.fromGeometry(cylindergeometry1);
//         let resultCSG = cylinder1CSG;
        
//         if (pRMin !== 0) {
//             if (pRMin>pRMax) pRMin = pRMax - 0.1;
//             const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2);
//             const  cylinder2CSG = CSG.fromGeometry(cylindergeometry2);
//             resultCSG = cylinder1CSG.subtract(cylinder2CSG);
//         }
    
//         if (pDPhi < Math.PI*2){
//             const pieShape = new THREE.Shape();
//             pieShape.absarc(0, 0,  pRMax , pSPhi, pSPhi + pDPhi, false);
//             pieShape.lineTo(0, 0);
//             const extrusionsettings = { depth: pDz * 2, bevelEnabled: false };
//             const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
//             pieGeometry.translate(0, 0, -pDz);
//             pieGeometry.rotateX(Math.PI/2)
//             const pieCSG = CSG.fromGeometry(pieGeometry);
//             resultCSG = resultCSG.intersect(pieCSG);
//         }

//         const CloneGeometry = CSG.toGeometry(resultCSG);
//         let aCSG = CSG.fromGeometry(CloneGeometry);

//         let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
        
//         const positionAttribute = finalMesh.geometry.getAttribute('position');

//         let vec3 = new THREE.Vector3();
//         let axis_vector = new THREE.Vector3(0, 1, 0);
//         for (let i = 0; i < positionAttribute.count; i++) {
//             vec3.fromBufferAttribute(positionAttribute, i);
//             vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
//             finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
//         }

        
//         finalMesh.rotateX(Math.PI / 2);
//         finalMesh.updateMatrix();

//         const finalCSG = CSG.fromMesh(finalMesh);
//         const finalGeometry = CSG.toGeometry(finalCSG);
//         finalGeometry.type = "aTwistedTubeGeometry";
//         finalGeometry.parameters = { 'pRMin': pRmin, 'pRMax': pRmax, 'pDz': pdz, 'pSPhi': pSPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };

//         Object.assign(this, finalGeometry);
//     }

//     copy(source) {
//         super.copy(source);
//         this.parameters = Object.assign({}, source.parameters);
//         return this;
//     }

//     static fromJSON(data) {
//         return new aTwistedTubeGeometry(data.pRMin, data.pRMax, data.pDz, data.SPhi, data.pDPhi, data.twistedangle);
//     }
// }

// export { aTwistedTubeGeometry };



// import * as THREE from "three";
// import { CSG } from "../CSGMesh.js";

// class aTwistedTubeGeometry extends THREE.BufferGeometry {
//     constructor(pRmin, pRmax, pdz, pSPhi, DPhi, twistedangle) {
//         super();
//         this.type = "aTwistedTubeGeometry";
//         const mmTOcm=10;
//         const pRMin = pRmin*mmTOcm;
//         const pRMax = pRmax*mmTOcm;
//         const pDz = pdz*mmTOcm;

//         const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2, 32, 32, false, 0, Math.PI * 2);
//         const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());

//         const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2, 32, 32, false, 0, Math.PI * 2);
//         const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());

//         const boxgeometry = new THREE.BoxGeometry(pRMax, pDz * 2, pRMax, 32, 32, 32);
//         const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

//         boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
//         const MeshCSG1 = CSG.fromMesh(cylindermesh1);
//         const MeshCSG2 = CSG.fromMesh(cylindermesh2);
//         let MeshCSG3 = CSG.fromMesh(boxmesh);

//         let aCSG;
            
//         let bCSG;
    
//         if(pRMin !== 0) {
//             aCSG = MeshCSG1.subtract(MeshCSG2);
//             bCSG = MeshCSG1.subtract(MeshCSG2);
//         } else {
//             aCSG = MeshCSG1;
//             bCSG = MeshCSG1;
//         }

//         if (DPhi > 270 && DPhi < 360) {
//             let v_DPhi = 360 - DPhi;

//             boxmesh.rotateY((pSPhi + 180) / 180 * Math.PI);
//             boxmesh.updateMatrix();
//             MeshCSG3 = CSG.fromMesh(boxmesh);
//             bCSG = bCSG.subtract(MeshCSG3);

//             let repeatCount = Math.floor((270 - v_DPhi) / 90);

//             for (let i = 0; i < repeatCount; i++) {
//                 let rotateVaule = - Math.PI / 2;
//                 boxmesh.rotateY(rotateVaule);
//                 boxmesh.updateMatrix();
//                 MeshCSG3 = CSG.fromMesh(boxmesh);
//                 bCSG = bCSG.subtract(MeshCSG3);
//             }
//             let rotateVaule = (-1) * (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
//             boxmesh.rotateY(rotateVaule);
//             boxmesh.updateMatrix();
//             MeshCSG3 = CSG.fromMesh(boxmesh);
//             bCSG = bCSG.subtract(MeshCSG3);
//             aCSG = aCSG.subtract(bCSG);

//         } else if(DPhi <= 270){

//             boxmesh.rotateY((pSPhi + 90)  * Math.PI);
//             boxmesh.updateMatrix();
//             MeshCSG3 = CSG.fromMesh(boxmesh);
//             aCSG = aCSG.subtract(MeshCSG3);

//             let repeatCount = Math.floor((270 - DPhi) / 90);

//             for (let i = 0; i < repeatCount; i++) {
//                 let rotateVaule = Math.PI / (2);
//                 boxmesh.rotateY(rotateVaule);
//                 boxmesh.updateMatrix();
//                 MeshCSG3 = CSG.fromMesh(boxmesh);
//                 aCSG = aCSG.subtract(MeshCSG3);
//             }
//             let rotateVaule = (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
//             boxmesh.rotateY(rotateVaule);
//             boxmesh.updateMatrix();
//             MeshCSG3 = CSG.fromMesh(boxmesh);
//             aCSG = aCSG.subtract(MeshCSG3);

//         }

//         let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
        

//         const positionAttribute = finalMesh.geometry.getAttribute('position');

//         let vec3 = new THREE.Vector3();
//         let axis_vector = new THREE.Vector3(0, 1, 0);
//         for (let i = 0; i < positionAttribute.count; i++) {
//             vec3.fromBufferAttribute(positionAttribute, i);
//             vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
//             finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
//         }

        
//         finalMesh.rotateX(Math.PI / 2);
//         finalMesh.updateMatrix();
//         aCSG = CSG.fromMesh(finalMesh);
//         finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());

//         const finalCSG = CSG.fromMesh(finalMesh);
//         const finalGeometry = CSG.toGeometry(finalCSG);
//         finalGeometry.type = "aTwistedTubeGeometry";
//         finalGeometry.parameters = { 'pRMin': pRmin, 'pRMax': pRmax, 'pDz': pdz, 'pSPhi': pSPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };

//         Object.assign(this, finalGeometry);
//     }

//     copy(source) {
//         super.copy(source);
//         this.parameters = Object.assign({}, source.parameters);
//         return this;
//     }

//     static fromJSON(data) {
//         return new aTwistedTubeGeometry(data.pRMin, data.pRMax, data.pDz, data.pSPhi, data.pDPhi, data.twistedangle);
//     }
// }

// export { aTwistedTubeGeometry };
