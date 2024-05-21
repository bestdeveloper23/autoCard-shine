import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

 const strings = editor.strings;

 const container = new UIDiv();

 const geometry = object.geometry;
 const parameters = geometry.parameters;

 // maxRadius

 const maxRadiusRow = new UIRow();
 const maxRadius = new UINumber(parameters.pRMax).setRange(parameters.pRMin + 0.001, Infinity).onChange(update);

 maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/maxradius')).setWidth('90px'));
 maxRadiusRow.add(maxRadius);

 maxRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(maxRadiusRow);

 // minRadius

 const minRadiusRow = new UIRow();
 const minRadius = new UINumber(parameters.pRMin).setRange(0, parameters.pRMax - 0.001).onChange(update);

 minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/minradius')).setWidth('90px'));
 minRadiusRow.add(minRadius);

 minRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(minRadiusRow);

 // height

 const heightRow = new UIRow();
 const height = new UINumber(parameters.pDz).setRange(0.001, Infinity).onChange(update);

 heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'));
 heightRow.add(height);

 heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(heightRow);

 // sphi
 const pSPhiRow = new UIRow();
 const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
 pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
 pSPhiRow.add(pSPhi);

 pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
 container.add(pSPhiRow);

 // dphi

 const pDPhiRow = new UIRow();
 const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(update);
 pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
 pDPhiRow.add(pDPhi);
 pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

 container.add(pDPhiRow);

 // LowVector3

 const pLowNormRow = new UIRow();
 pLowNormRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pLowNorm')).setWidth('90px'));
 const pLowNormX = new UINumber(parameters.pLowNorm.x).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
 const pLowNormY = new UINumber(parameters.pLowNorm.y).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
 const pLowNormZ = new UINumber(parameters.pLowNorm.z).setPrecision( 5 ).setWidth( '50px' ).onChange(update);

 pLowNormRow.add(pLowNormX);
 pLowNormRow.add(pLowNormY);
 pLowNormRow.add(pLowNormZ);

 container.add(pLowNormRow);

 // HightVector3

 const pHighNormRow = new UIRow();
 pHighNormRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pHighNorm')).setWidth('90px'));
 const pHighNormX = new UINumber(parameters.pHighNorm.x).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
 const pHighNormY = new UINumber(parameters.pHighNorm.y).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
 const pHighNormZ = new UINumber(parameters.pHighNorm.z).setPrecision( 5 ).setWidth( '50px' ).onChange(update);

 pHighNormRow.add(pHighNormX);
 pHighNormRow.add(pHighNormY);
 pHighNormRow.add(pHighNormZ);

 container.add(pHighNormRow);

 //

 function update() {

  // we need to new each geometry module

  var pRMax = maxRadius.getValue(), pRMin = minRadius.getValue(), pDz = height.getValue(), SPhi = pSPhi.getValue(), DPhi = pDPhi.getValue(),
  pHighNorm = new THREE.Vector3(pHighNormX.getValue(), pHighNormY.getValue(), pHighNormZ.getValue()), 
  pLowNorm = new THREE.Vector3(pLowNormX.getValue(), pLowNormY.getValue(), pLowNormZ.getValue());

  function CutTube_vectorVal(vector) {
    if (CutTube_vectorVertical(vector)) {
        return true;
    } else if ((vector.x * vector.y) === 0 && (vector.x * vector.z) === 0 && (vector.y * vector.z) === 0) {
        return false;
    } else if (vector.y === 0) {
        return false;
    } else return true;
    }

    function CutTube_vectorVertical(vector) {
        if (vector.y !== 0 && vector.x === 0 && vector.z === 0) {
            return true;
        } else return false;
    }

    if (CutTube_vectorVal(pLowNorm) === false || CutTube_vectorVal(pHighNorm) === false) return;

    const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
    const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
    cylindermesh1.rotateX(Math.PI / 2);
    cylindermesh1.updateMatrix();

    const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
    const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
    cylindermesh2.rotateX(Math.PI / 2);
    cylindermesh2.updateMatrix();

    const maxdis = Math.max(pRMax, pRMin, pDz);

    const boxgeometry1 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
    const boxmesh1 = new THREE.Mesh(boxgeometry1, new THREE.MeshStandardMaterial());

    const boxgeometry2 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
    const boxmesh2 = new THREE.Mesh(boxgeometry2, new THREE.MeshStandardMaterial());

    const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, 2 * Math.sqrt(2) * maxdis);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());


    boxmesh1.geometry.translate(0, 0, Math.sqrt(2) * maxdis);
    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
    let MeshCSG3 = CSG.fromMesh(boxmesh1);

    
    let aCSG;
        
    if(pRMin !== 0) {
        aCSG = MeshCSG1.subtract(MeshCSG2);
    } else {
        aCSG = MeshCSG1;
    }


    if (CutTube_vectorVertical(pHighNorm) === false) {

        let rotateX = Math.atan(pHighNorm.z / pHighNorm.y);
        let rotateY = Math.atan(pHighNorm.x / pHighNorm.y);
        let rotateZ = Math.atan(pHighNorm.z / pHighNorm.x);

        if (rotateX === Infinity) rotateX = boxmesh1.rotation.x;
        if (rotateY === Infinity) rotateY = boxmesh1.rotation.y;
        if (rotateZ === Infinity) rotateZ = boxmesh1.rotation.z;

        boxmesh1.rotation.set(-rotateX, -rotateY, -rotateZ);
    }

    boxmesh1.position.set(0, 0, maxdis / 2);
    boxmesh1.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh1);

    aCSG = aCSG.subtract(MeshCSG3);

    boxmesh2.geometry.translate(0, 0, -Math.sqrt(2) * pDz);
    if (!CutTube_vectorVertical(pLowNorm)) {

        let rotateX = Math.atan(pLowNorm.z / pLowNorm.y);
        let rotateY = Math.atan(pLowNorm.x / pLowNorm.y);
        let rotateZ = Math.atan(pLowNorm.z / pLowNorm.x);

        if (rotateX === Infinity) rotateX = boxmesh2.rotation.x;
        if (rotateY === Infinity) rotateY = boxmesh2.rotation.y;
        if (rotateZ === Infinity) rotateZ = boxmesh2.rotation.z;

        boxmesh2.rotation.set(-rotateX, -rotateY, -rotateZ);
    }

    boxmesh2.position.set(0, 0, -maxdis / 2);
    boxmesh2.updateMatrix();
    MeshCSG3 = CSG.fromMesh(boxmesh2);

    aCSG = aCSG.subtract(MeshCSG3);


    boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
    let bCSG = aCSG;

    if (DPhi > 270 && DPhi < 360) {
        let v_DPhi = 360 - DPhi;

        boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        bCSG = bCSG.subtract(MeshCSG3);

        let repeatCount = Math.floor((270 - v_DPhi) / 90);

        for (let i = 0; i < repeatCount; i++) {
            let rotateVaule = Math.PI / 2;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
        }
        let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
        boxmesh.rotateZ(rotateVaule);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        bCSG = bCSG.subtract(MeshCSG3);
        aCSG = aCSG.subtract(bCSG);

    } else if(DPhi <= 270){

        boxmesh.rotateZ(SPhi / 180 * Math.PI);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

        let repeatCount = Math.floor((270 - DPhi) / 90);

        for (let i = 0; i < repeatCount; i++) {
            let rotateVaule = Math.PI / (-2);
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);
        }
        let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
        boxmesh.rotateZ(rotateVaule);
        boxmesh.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh);
        aCSG = aCSG.subtract(MeshCSG3);

    }

    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'pHighNorm': pHighNorm, 'pLowNorm': pLowNorm };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aCutTubeGeometry';
  finalMesh.updateMatrix();

  // set Range 
  maxRadius.setRange(pRMin + 0.001, Infinity);
  minRadius.setRange(0, pRMax - 0.001);

  finalMesh.geometry.name = object.geometry.name;
  
  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
