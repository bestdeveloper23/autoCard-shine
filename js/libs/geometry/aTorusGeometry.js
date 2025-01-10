import * as THREE from 'three'
import { CSG } from '../CSGMesh.js';

class aTorusGeometry extends THREE.BufferGeometry {
    constructor(pRMin, pRMax, pRTor, pSphi, pDphi){
        super();
            const mmTOcm = 10;
            const pRmin = pRMin*mmTOcm;
            const pRmax = pRMax*mmTOcm;
            const pRtor = pRTor*mmTOcm;
            const pSPhi = pSphi*Math.PI/180;
            const pDPhi = pDphi*Math.PI/180;
        
            const OuterTorusGeometry = new THREE.TorusGeometry(pRtor, pRmax,14,35);
            const innerTorusGeometry = new THREE.TorusGeometry(pRtor, pRmin,14,35);
        
            const OuterTorusCSG = CSG.fromGeometry(OuterTorusGeometry);
            let resultCSG = OuterTorusCSG;
        
            if  (pDPhi < Math.PI*2){
                const pieShape = new THREE.Shape();
                pieShape.absarc(0, 0, pRtor + pRmax+0.3, pSPhi, pSPhi + pDPhi, false);
                pieShape.lineTo(0, 0);
                const extrusionsettings = { depth: pRmax * 2, bevelEnabled: false };
                const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
                pieGeometry.translate(0, 0, -pRmax);
                const pieCSG = CSG.fromGeometry(pieGeometry);
                resultCSG = resultCSG.intersect(pieCSG);
            }
        
            // Convert geometries to CSG objects
            if (pRmax>0 && pRmin>0){ 
                const innerTorusCSG = CSG.fromGeometry(innerTorusGeometry);
                resultCSG = resultCSG.subtract(innerTorusCSG);
            }
        
            // Convert CSG back to a geometry
            const finalGeometry = CSG.toGeometry(resultCSG);
            finalGeometry.type = 'aTorusGeometry';
            finalGeometry.parameters = { 'pRMax': pRMax, 'pRMin': pRMin, 'pRTor': pRTor, 'pSPhi': pSphi, 'pDPhi': pDphi };

            Object.assign(this, finalGeometry);
    }

    copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}
  
    static fromJSON(data) {
      return new aTorusGeometry(
        data.pRMin,
        data.pRMax,
        data.pRTor,
        data.pSPhi,
        data.pDPhi
      );
    }
}
export {aTorusGeometry}