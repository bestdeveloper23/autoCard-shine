import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aHyperboloidGeometry extends THREE.BufferGeometry {
    constructor(radiusOut, radiusIn, stereo1, stereo2, pdz) {
        super();
        this.type = "aHyperboloidGeometry";

        const pDz = pdz*10;

        const c_z1 = Math.tan(stereo1 * Math.PI / 90);
        const c_z2 = Math.tan(stereo2 * Math.PI / 90);
        const cylindergeometry1 = new THREE.CylinderGeometry(radiusOut, radiusOut, pDz*2, 16, 8, false, 0, Math.PI * 2);
        const cylindergeometry2 = new THREE.CylinderGeometry(radiusIn, radiusIn, pDz*2, 16, 8, false, 0, Math.PI * 2);

        let positionAttribute = cylindergeometry1.getAttribute('position');
        let positionAttribute2 = cylindergeometry2.getAttribute('position');
        let vertex = new THREE.Vector3();
        let vertex2 = new THREE.Vector3();

        for (let i = 0; i < positionAttribute.count; i++) {

            vertex.fromBufferAttribute(positionAttribute, i);
            vertex2.fromBufferAttribute(positionAttribute2, i);
            let x, y, z, x2, y2, z2;
            x = vertex.x;
            y = vertex.y;
            z = vertex.z;
            x2 = vertex2.x;
            y2 = vertex2.y;
            z2 = vertex2.z;
            let r = radiusOut*Math.sqrt((1+ Math.pow((y/c_z1), 2)));
            let r2 = radiusIn*Math.sqrt((1+ Math.pow((y2/c_z2), 2)));

            let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

            if (vertex.z >= 0) {
                z = Math.abs(r * Math.sin(alpha));
                z2 = Math.abs(r2 * Math.sin(alpha));
            } else {
                z = - Math.abs(r * Math.sin(alpha));
                z2 = - Math.abs(r2 * Math.sin(alpha));
            }
            if (vertex.x >= 0) {
                x = r * Math.cos(alpha);
                x2 = r2 * Math.cos(alpha);
            } else {
                x = -r * Math.cos(alpha);
                x2 = -r2 * Math.cos(alpha);
            }

            cylindergeometry1.attributes.position.array[i * 3] = x;
            cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
            cylindergeometry1.attributes.position.array[i * 3 + 2] = z;

            
            cylindergeometry2.attributes.position.array[i * 3] = x2;
            cylindergeometry2.attributes.position.array[i * 3 + 1] = y2;
            cylindergeometry2.attributes.position.array[i * 3 + 2] = z2;

        }
        cylindergeometry1.attributes.position.needsUpdate = true;
        cylindergeometry2.attributes.position.needsUpdate = true;

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());

        const MeshCSG1 = CSG.fromMesh(cylindermesh);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);

        let aCSG;
        if(radiusIn === 0 ) {
            aCSG = MeshCSG1;
        } else {
            aCSG = MeshCSG1.subtract(MeshCSG2);
        }
        


        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        const finalGeometry = CSG.toGeometry(aCSG); 
        
        finalGeometry.type = "aHyperboloidGeometry";
        const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pdz };
        finalGeometry.parameters = param;
        
        Object.assign(this, finalGeometry);
    }

    copy(source) {
        super.copy(source);
        this.parameters = Object.assign({}, source.parameters);
        return this;
    }

    static fromJSON(data) {
        return new aHyperboloidGeometry(data.radiusOut, data.radiusIn, data.stereo1, data.stereo2, data.pDz);
    }
}

export { aHyperboloidGeometry };
