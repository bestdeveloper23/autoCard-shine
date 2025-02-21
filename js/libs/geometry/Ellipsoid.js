import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

class aEllipsoidGeometry extends THREE.BufferGeometry{
    constructor(SemiAxisX , SemiAxisY , SemiAxisZ , pZBottomCut, pZTopCut ) {
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
        const TopBoxGeometry = new THREE.BoxGeometry(xSemiAxis*2,ySemiAxis*2, zSemiAxis*2); //z,y,x
        TopBoxGeometry.translate(0,0,zSemiAxis+pzTopCut);
        const BottomBoxGeometry = new THREE.BoxGeometry(xSemiAxis*2,ySemiAxis*2, zSemiAxis*2); //z,y,x
        BottomBoxGeometry.translate(0,0,-(zSemiAxis+zBottomCut));

        const TopBoxCSG= CSG.fromGeometry(TopBoxGeometry);
        const BottomBoxCSG = CSG.fromGeometry(BottomBoxGeometry);
        const EllipsoidCSG=CSG.fromGeometry(EllipsoidGeometry)
        let FinalCSG=EllipsoidCSG;

        if (pZTopCut === 0 && pZBottomCut === 0) {
            FinalCSG = EllipsoidCSG; 
        } else {
            FinalCSG = EllipsoidCSG; 
            FinalCSG = FinalCSG.subtract(TopBoxCSG); 
            FinalCSG = FinalCSG.subtract(BottomBoxCSG); 
        }
        
        
        const finalGeometry = CSG.toGeometry(FinalCSG);
        finalGeometry.type = 'aEllipsoidGeometry';
        finalGeometry.parameters = { 'xSemiAxis': SemiAxisX, 'ySemiAxis': SemiAxisY, 'zSemiAxis': SemiAxisZ, 'zBottomCut': -pZBottomCut, 'zTopCut': pZTopCut  }

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
        -data.zBottomCut,
        data.zTopCut
      );
    }
}

export {aEllipsoidGeometry}
