import * as THREE from 'three'
import { CSG } from '../CSGMesh.js';

class aConeGeometry extends THREE.BufferGeometry{
    constructor(pRMin1 , pRMax1 , pRMin2 , pRMax2 , pdz , pSPhi , pDPhi){
        super();
        
        const cmTOmm=10;
        const pRmin1=pRMin1*cmTOmm;
        const pRmax1=pRMax1*cmTOmm;
        const pRmin2=pRMin2*cmTOmm;
        const pRmax2=pRMax2*cmTOmm;
        const pDz=pdz*cmTOmm;
    
        let SPhi = Math.PI*pSPhi/180;
        let DPhi = Math.PI*pDPhi/180;
        const cylindergeometry1 = new THREE.CylinderGeometry(pRmax2, pRmax1, pDz * 2, 32, 32);
        const cylindergeometry2 = new THREE.CylinderGeometry(pRmin2,pRmin1 , pDz * 2, 32, 32);
    
        const maxRadius = Math.max(pRmax1, pRmax2) ;
        const  minRadius = Math.min(pRmin1, pRmin2) ;
    
        const cylinder1CSG = CSG.fromGeometry(cylindergeometry1);
    
        let resultCSG = cylinder1CSG;
    
        if (DPhi < Math.PI*2){
            const pieShape = new THREE.Shape();
            pieShape.absarc(0, 0,  maxRadius , SPhi, SPhi + DPhi, false);
            pieShape.lineTo(0, 0);
            const extrusionsettings = { depth: pDz * 2, bevelEnabled: false };
            const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
            pieGeometry.translate(0, 0, -pDz);
            pieGeometry.rotateX(Math.PI/2)
            const pieCSG = CSG.fromGeometry(pieGeometry);
            const finalMesh = CSG.toMesh(pieCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
            resultCSG = resultCSG.intersect(pieCSG);
        }
    
        // Convert geometries to CSG objects
        if (maxRadius > 0 || minRadius > 0) {
            const cylinder2CSG = CSG.fromGeometry(cylindergeometry2);
            resultCSG = resultCSG.subtract(cylinder2CSG);
        }

        // Convert CSG back to a geometry
        const finalGeometry = CSG.toGeometry(resultCSG);
        finalGeometry.rotateX(Math.PI/2);
        finalGeometry.rotateX(Math.PI); 
        finalGeometry.type = 'aConeGeometry';
        finalGeometry.parameters = { 'pRMin1': pRMin1 , 'pRMax1': pRMax1 , 'pRMin2': pRMin2 , 'pRMax2': pRMax2 , 'pDz': pdz , 'pSPhi': pSPhi, 'pDPhi': pDPhi};


        Object.assign(this, finalGeometry);
    }

    copy( source ) {

		super.copy( source );

		this.parameters = Object.assign( {}, source.parameters );

		return this;

	}
  
    static fromJSON(data) {
      return new aConeGeometry(
        data.pRMin1,
        data.pRMax1,
        data.pRMin2,
        data.pRMax2,
        data.pDz,
        data.pSPhi,
        data.pDPhi
      );
    }
}

export {aConeGeometry}