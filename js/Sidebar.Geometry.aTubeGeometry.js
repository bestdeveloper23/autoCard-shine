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
 const height = new UINumber(parameters.pDz).setRange(0, Infinity).onChange(update);

 heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'));
 heightRow.add(height);

 heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(heightRow);

 // startphi

 const pSPhiRow = new UIRow();
 const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
 pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
 pSPhiRow.add(pSPhi);
 pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

 container.add(pSPhiRow);

 // deltaphi

 const pDPhiRow = new UIRow();
 const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(update);
 pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
 pDPhiRow.add(pDPhi);
 pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

 container.add(pDPhiRow);

 //

 function update() {

  // we need to new each geometry module

  var pRMax = maxRadius.getValue(), pRMin = minRadius.getValue(), pDz = height.getValue(), SPhi = pSPhi.getValue(), DPhi = pDPhi.getValue();

  const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
    const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
    cylindermesh1.rotateX(Math.PI / 2);
    cylindermesh1.updateMatrix();

    const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
    const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
    cylindermesh2.rotateX(Math.PI / 2);
    cylindermesh2.updateMatrix();

    const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, pDz);
    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

    boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
    let MeshCSG3 = CSG.fromMesh(boxmesh);

    let aCSG;
        
    let bCSG;

    if(pRMin !== 0) {
        aCSG = MeshCSG1.subtract(MeshCSG2);
        bCSG = MeshCSG1.subtract(MeshCSG2);
    } else {
        aCSG = MeshCSG1;
        bCSG = MeshCSG1;
    }

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
    const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
    finalMesh.geometry.parameters = param;
    finalMesh.geometry.type = 'aTubeGeometry';
    finalMesh.updateMatrix();
    finalMesh.name = 'Tubs';
  // set Range 
  maxRadius.setRange(pRMin + 0.001, Infinity);
  minRadius.setRange(0.00, pRMax - 0.001);

  finalMesh.geometry.name = object.geometry.name;
  
  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
