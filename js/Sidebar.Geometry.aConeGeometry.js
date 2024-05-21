import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

 const strings = editor.strings;

 const container = new UIDiv();

 const geometry = object.geometry;
 const parameters = geometry.parameters;

 // maxRadius1

 const maxRadiusRow1 = new UIRow();
 const maxRadius1 = new UINumber(parameters.pRMax1).setRange(parameters.pRMin1 + 0.001, Infinity).onChange(update);

 maxRadiusRow1.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/maxradius1')).setWidth('90px'));
 maxRadiusRow1.add(maxRadius1);

 maxRadiusRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(maxRadiusRow1);

 // minRadius1

 const minRadiusRow1 = new UIRow();
 const minRadius1 = new UINumber(parameters.pRMin1).setRange(0, parameters.pRMax1 - 0.001).onChange(update);

 minRadiusRow1.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/minradius1')).setWidth('90px'));
 minRadiusRow1.add(minRadius1);

 minRadiusRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
 
 container.add(minRadiusRow1);

 // maxRadius2

 const maxRadiusRow2 = new UIRow();
 const maxRadius2 = new UINumber(parameters.pRMax2).setRange(parameters.pRMin2 + 0.001, Infinity).onChange(update);

 maxRadiusRow2.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/maxradius2')).setWidth('90px'));
 maxRadiusRow2.add(maxRadius2);

 maxRadiusRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(maxRadiusRow2);

 // minRadius2

 const minRadiusRow2 = new UIRow();
 const minRadius2 = new UINumber(parameters.pRMin2).setRange(0, parameters.pRMax2 - 0.001).onChange(update);

 minRadiusRow2.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/minradius2')).setWidth('90px'));
 minRadiusRow2.add(minRadius2);

 minRadiusRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(minRadiusRow2);

 // height

 const heightRow = new UIRow();
 const height = new UINumber(parameters.pDz).setRange(0.001, Infinity).onChange(update);

 heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'));
 heightRow.add(height);

 heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(heightRow);

 // height

 const pSPhiRow = new UIRow();
 const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
 pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
 pSPhiRow.add(pSPhi);

 container.add(pSPhiRow);

 // height

 const pDPhiRow = new UIRow();
 const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(update);
 pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
 pDPhiRow.add(pDPhi);

 container.add(pDPhiRow);

 //

 function update() {

  // we need to new each geometry module

  var pRmin1 = minRadius1.getValue(), pRmax1 = maxRadius1.getValue(), pRmin2 = minRadius2.getValue(), pRmax2 = maxRadius2.getValue(),
   pDz = height.getValue(), SPhi = pSPhi.getValue(), DPhi = pDPhi.getValue();

   if (pRmin1 === 0 && pRmin2 !== 0) {
        pRmin1 = 0.00001;
   }
  
   const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz, 32, 32, false, 0, Math.PI * 2);
   const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
   cylindermesh1.rotateX(Math.PI / 2);
   cylindermesh1.updateMatrix();

   const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz, 32, 32, false, 0, Math.PI * 2);
   const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
   cylindermesh2.rotateX(Math.PI / 2);
   cylindermesh2.updateMatrix();

   const maxRadius = Math.max(pRmax1, pRmax2);
   const boxgeometry = new THREE.BoxGeometry(maxRadius, maxRadius, pDz);
   const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

   boxmesh.geometry.translate(maxRadius / 2, maxRadius / 2, 0);
   const MeshCSG1 = CSG.fromMesh(cylindermesh1);
   const MeshCSG2 = CSG.fromMesh(cylindermesh2);
   let MeshCSG3 = CSG.fromMesh(boxmesh);

   let aCSG;
        
   let bCSG;

   if(pRmin1 === 0 && pRmin2 === 0 ) {
        aCSG = MeshCSG2;
        bCSG = MeshCSG2;
   } else {
       aCSG = MeshCSG2.subtract(MeshCSG1);
       bCSG = MeshCSG2.subtract(MeshCSG1);
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
   const param = { 'pRMax1': pRmax1, 'pRMin1': pRmin1, 'pRMax2': pRmax2, 'pRMin2': pRmin2, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
   finalMesh.geometry.parameters = param;
   finalMesh.geometry.type = 'aConeGeometry';
   finalMesh.updateMatrix();
   finalMesh.name = 'Cone';

  maxRadius1.setRange(pRmin1 + 0.001, Infinity);
  minRadius1.setRange(0, pRmax1 - 0.001);
  maxRadius2.setRange(pRmin2 + 0.001, Infinity);
  minRadius2.setRange(0, pRmax2 - 0.001);

  finalMesh.geometry.name = object.geometry.name;

  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
