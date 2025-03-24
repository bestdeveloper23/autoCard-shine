import * as THREE from 'three'
import { CSG } from '../CSGMesh.js';

class aEllipticalCylinderGeometry extends THREE.BufferGeometry{
    constructor(XSemiAxis , YSemiAxis , dz){
        super();

        const xSemiAxis = XSemiAxis;
        const semiAxisY = YSemiAxis;
        const Dz = dz*10;
        
        const ratioZ = semiAxisY / xSemiAxis;
        const cylindergeometry = new THREE.CylinderGeometry(xSemiAxis*10, xSemiAxis*10, Dz * 2);
        const cylindermesh = new THREE.Mesh(cylindergeometry, new THREE.MeshLambertMaterial());
            
        cylindermesh.scale.z = ratioZ;
        cylindermesh.rotateX(Math.PI / 2);
        cylindermesh.updateMatrix();
        const aCSG = CSG.fromMesh(cylindermesh);

        // Convert CSG back to a geometry
        const finalGeometry = CSG.toGeometry(aCSG);
        finalGeometry.parameters = { 'xSemiAxis': XSemiAxis, 'semiAxisY': YSemiAxis, 'Dz': dz };
        finalGeometry.type = 'aEllipticalCylinderGeometry';

        Object.assign(this, finalGeometry)
    }

    copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}
  
    static fromJSON(data) {
      return new aEllipticalCylinderGeometry(
        data.xSemiAxis,
        data.semiAxisY,
        data.Dz,
      );
    }
}

export{aEllipticalCylinderGeometry}