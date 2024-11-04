import * as THREE from 'three';
import { CSG } from '../CSGMesh.js';

function CreateEllipsoid( xSemiAxis , ySemiAxis , zSemiAxis , pzTopCut , zBottomCut ){
    const material = new THREE.MeshLambertMaterial();
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
    if (pzTopCut>0){
        FinalCSG=EllipsoidCSG.subtract(TopBoxCSG);
    }
    if (zBottomCut>0){
        FinalCSG=EllipsoidCSG.subtract(BottomBoxCSG);
    }
    const finalMesh = CSG.toMesh(FinalCSG, new THREE.Matrix4(), material);
    finalMesh.updateMatrix();

    finalMesh.name = 'Ellipsoid';    
    const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'zSemiAxis': zSemiAxis, 'zTopCut': pzTopCut, 'zBottomCut': zBottomCut };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aEllipsoidGeometry';
    
    return finalMesh;
}

export{CreateEllipsoid};