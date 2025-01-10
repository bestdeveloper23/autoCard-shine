import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

class aEllipsoidGeometry extends THREE.BufferGeometry{
    constructor(SemiAxisX , SemiAxisY , SemiAxisZ , pZTopCut , pZBottomCut) {
        super();

		this.type = 'aEllipsoidGeometry';

        const mmToCm=10;
        const xSemiAxis = SemiAxisX*mmToCm;
        const ySemiAxis = SemiAxisY*mmToCm;
        const zSemiAxis = SemiAxisZ*mmToCm;
        const pzTopCut = pZTopCut*mmToCm;
        const zBottomCut = pZBottomCut*mmToCm;

        const EllipsoidGeometry = new THREE.SphereGeometry(1);

        EllipsoidGeometry.scale(xSemiAxis, ySemiAxis, zSemiAxis);
        const TopBoxGeometry = new THREE.BoxGeometry(xSemiAxis*2,ySemiAxis*2, pzTopCut*2); //z,y,x
        TopBoxGeometry.translate(0,0,zSemiAxis);
        const BottomBoxGeometry = new THREE.BoxGeometry(xSemiAxis*2,ySemiAxis*2, zBottomCut*2); //z,y,x
        BottomBoxGeometry.translate(0,0,-zSemiAxis);

        const TopBoxCSG= CSG.fromGeometry(TopBoxGeometry);
        const BottomBoxCSG = CSG.fromGeometry(BottomBoxGeometry);
        const EllipsoidCSG=CSG.fromGeometry(EllipsoidGeometry)
        let FinalCSG=EllipsoidCSG;
        
        if (pzTopCut > 0) {
            FinalCSG = FinalCSG.subtract(TopBoxCSG);
        }
        if (zBottomCut > 0) {
            FinalCSG = FinalCSG.subtract(BottomBoxCSG);
        }
        
        const finalGeometry = CSG.toGeometry(FinalCSG);
        finalGeometry.type = 'aEllipsoidGeometry';
        finalGeometry.parameters = { 'xSemiAxis': SemiAxisX, 'ySemiAxis': SemiAxisY, 'zSemiAxis': SemiAxisZ, 'zTopCut': pZTopCut, 'zBottomCut': pZBottomCut }

        Object.assign(this, finalGeometry);


    }        
    copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}
  
    static fromJSON(data) {
      return new aEllipsoidGeometry(
        data.xSemiAxis,
        data.ySemiAxis,
        data.zSemiAxis,
        data.pzTopCut,
        data.zBottomCut
      );
    }
}

export {aEllipsoidGeometry}
