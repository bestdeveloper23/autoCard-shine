import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

class aHyperboloidGeometry extends THREE.BufferGeometry {
    constructor(radiusOut, radiusIn, stereo1, stereo2, pDz) {
        super();
        this.type = "aHyperboloidGeometry";
        const mmTocm = 10;
        const rOut = radiusOut * mmTocm;
        const rIn = radiusIn * mmTocm;
        const dz = pDz * mmTocm;
        
        const c_z1 = Math.tan(stereo1 * Math.PI / 90);
        const c_z2 = Math.tan(stereo2 * Math.PI / 90);
        let geometryOut = new THREE.CylinderGeometry(rOut, rOut, dz, 16, 8, false, 0, Math.PI * 2);
        let geometryIn = new THREE.CylinderGeometry(rIn, rIn, dz, 16, 8, false, 0, Math.PI * 2);

        let positionAttributeOut = geometryOut.getAttribute("position");
        let positionAttributeIn = geometryIn.getAttribute("position");
        let vertexOut = new THREE.Vector3();
        let vertexIn = new THREE.Vector3();

        for (let i = 0; i < positionAttributeOut.count; i++) {
            vertexOut.fromBufferAttribute(positionAttributeOut, i);
            vertexIn.fromBufferAttribute(positionAttributeIn, i);
            
            let rOuter = rOut * Math.sqrt(1 + Math.pow(vertexOut.y / c_z1, 2));
            let rInner = rIn * Math.sqrt(1 + Math.pow(vertexIn.y / c_z2, 2));
            
            let alphaOut = Math.atan(vertexOut.z / vertexOut.x) || (vertexOut.z >= 0 ? Math.PI / 2 : -Math.PI / 2);
            let alphaIn = Math.atan(vertexIn.z / vertexIn.x) || (vertexIn.z >= 0 ? Math.PI / 2 : -Math.PI / 2);
            
            vertexOut.x = vertexOut.x >= 0 ? rOuter * Math.cos(alphaOut) : -rOuter * Math.cos(alphaOut);
            vertexOut.z = vertexOut.z >= 0 ? Math.abs(rOuter * Math.sin(alphaOut)) : -Math.abs(rOuter * Math.sin(alphaOut));
            
            vertexIn.x = vertexIn.x >= 0 ? rInner * Math.cos(alphaIn) : -rInner * Math.cos(alphaIn);
            vertexIn.z = vertexIn.z >= 0 ? Math.abs(rInner * Math.sin(alphaIn)) : -Math.abs(rInner * Math.sin(alphaIn));
            
            geometryOut.attributes.position.setXYZ(i, vertexOut.x, vertexOut.y, vertexOut.z);
            geometryIn.attributes.position.setXYZ(i, vertexIn.x, vertexIn.y, vertexIn.z);
        }
        geometryOut.attributes.position.needsUpdate = true;
        geometryIn.attributes.position.needsUpdate = true;

        let meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());
        let meshIn = new THREE.Mesh(geometryIn, new THREE.MeshBasicMaterial());

        let MeshCSGOut = CSG.fromMesh(meshOut);
        let MeshCSGIn = CSG.fromMesh(meshIn);
        
        let aCSG = radiusIn === 0 ? MeshCSGOut : MeshCSGOut.subtract(MeshCSGIn);
        const finalGeometry = CSG.toGeometry(aCSG); 
        
        finalGeometry.type = "aHyperboloidGeometry";
        const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pDz };
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
