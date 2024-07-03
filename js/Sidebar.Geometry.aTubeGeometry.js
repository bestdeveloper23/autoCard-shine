import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

const strings = editor.strings;

const container = new UIDiv();

const geometry = object.geometry;
const parameters = geometry.parameters;

// maxRadius

const maxRadiusRow = new UIRow();
const maxRadius = new UINumber(parameters.pRMax).setRange(parameters.pRMin + 0.0001, Infinity).onChange(update);

maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/maxradius')).setWidth('90px'));
maxRadiusRow.add(maxRadius);

maxRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

container.add(maxRadiusRow);

// minRadius

const minRadiusRow = new UIRow();
const minRadius = new UINumber(parameters.pRMin).setRange(0, parameters.pRMax - 0.0001).onChange(update);

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
const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0, 360).onChange(update);
pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
pDPhiRow.add(pDPhi);
pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

container.add(pDPhiRow);

// update shape on canvas

function update() {
  const cm = 10;
  // we need to new each geometry module
  var pRMax = maxRadius.getValue() * cm, pRMin = minRadius.getValue() * cm, pDz = height.getValue() * cm, SPhi = pSPhi.getValue(), DPhi = pDPhi.getValue();

  const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2);
  const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
  cylindermesh1.rotateX(Math.PI / 2);
  cylindermesh1.updateMatrix();

  const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2);

  const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, pDz * 2);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

  boxmesh.geometry.translate(pRMax / 2, -pRMax / 2, 0);
  const MeshCSG1 = CSG.fromMesh(cylindermesh1);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  let aCSG = MeshCSG1;
  let bCSG = MeshCSG1;
  if (pRMin !== 0) {
    const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());
    cylindermesh2.rotateX(Math.PI / 2);
    cylindermesh2.updateMatrix();
    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
    aCSG = MeshCSG1.subtract(MeshCSG2);
    bCSG = MeshCSG1.subtract(MeshCSG2);
  }
  
  const oDPhi = DPhi;
  
  if (DPhi > 270 && DPhi <= 360) {
    DPhi = 360 - DPhi;
    SPhi = SPhi - DPhi;
  }

  boxmesh.rotateZ((SPhi) / 180 * Math.PI);
  boxmesh.updateMatrix();

  let n = Math.floor((360 - DPhi) / 90);

  for(let i = 0; i < n; i++) {
    MeshCSG3 = CSG.fromMesh(boxmesh);
    aCSG = aCSG.subtract(MeshCSG3);
    if( i < (n-1)){
      let turn = - Math.PI / (2);
      boxmesh.rotateZ(turn);
      boxmesh.updateMatrix();
    }
  }

  let rotateValue = -(360 - DPhi - n * 90) / 180 * Math.PI;
  boxmesh.rotateZ(rotateValue);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  if(oDPhi > 270 && oDPhi <= 360){
    aCSG = bCSG.subtract(aCSG);
      if(oDPhi == 360){
        aCSG = bCSG;
      }
  }
  
  const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { 'pRMax': maxRadius.getValue(), 'pRMin': minRadius.getValue(), 'pDz': height.getValue(), 'pSPhi': pSPhi.getValue(), 'pDPhi': pDPhi.getValue() };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aTubeGeometry';
  finalMesh.updateMatrix();
  finalMesh.name = 'Tubs';
  // set Range 
  maxRadius.setRange(pRMin/cm+0.0001, Infinity);
  minRadius.setRange(0.00, pRMax/cm - 0.0001);

  finalMesh.geometry.name = object.geometry.name;

  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));
}

return container;
}

export { GeometryParametersPanel };
