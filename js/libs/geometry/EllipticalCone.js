import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

class aEllipticalConeGeometry extends THREE.BufferGeometry{
    constructor( SemiAxisX , SemiAxisY , TopCutZ , Height ) {
        super();

		this.type = 'aEllipticalConeGeometry';

        const mmTOcm = 10;
        const xSemiAxis = SemiAxisX * mmTOcm;
        const ySemiAxis = SemiAxisY * mmTOcm;
        const zTopCut = TopCutZ * mmTOcm;
        const height = Height * mmTOcm;

                
        const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * ((height - zTopCut) / (height + zTopCut)), xSemiAxis, zTopCut * 2, 32, 32, false, 0, Math.PI * 2);
        // cylindergeometry1.translate(0, zTopCut / 2, 0)
        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
        const ratioZ = ySemiAxis / xSemiAxis;

        cylindermesh.scale.z = ratioZ;
        cylindermesh.updateMatrix();
        let aCSG = CSG.fromMesh(cylindermesh);
        let finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());


        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();
        aCSG = CSG.fromMesh(finalMesh);
        finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
        const FinalCSG = CSG.fromMesh(finalMesh);

        
        const finalGeometry = CSG.toGeometry(FinalCSG);
        finalGeometry.type = 'aEllipticalConeGeometry';
        finalGeometry.parameters = { 'xSemiAxis': SemiAxisX, 'ySemiAxis': SemiAxisY, 'zTopCut': TopCutZ , 'height': Height }

        Object.assign(this, finalGeometry);


    }        
    copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}
  
    static fromJSON(data) {
      return new aEllipticalConeGeometry(
        data.xSemiAxis,
        data.ySemiAxis,
        data.zTopCut,
        data.height
      );
    }
}

export {aEllipticalConeGeometry}
