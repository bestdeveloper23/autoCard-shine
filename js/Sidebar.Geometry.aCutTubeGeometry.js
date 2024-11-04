import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateCutTube } from './libs/CSG/CutTube.js';

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

  var pRMax = maxRadius.getValue(), pRMin = minRadius.getValue(), pDz = height.getValue(), SPhi = - pSPhi.getValue(), DPhi = pDPhi.getValue(),
  pHighNorm = new THREE.Vector3(pHighNormX.getValue(), pHighNormY.getValue(), pHighNormZ.getValue()), 
  pLowNorm = new THREE.Vector3(pLowNormX.getValue(), pLowNormY.getValue(), pLowNormZ.getValue());

  const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );
  // set Range 
  maxRadius.setRange(pRMin + 0.001, Infinity);
  minRadius.setRange(0, pRMax - 0.001);

  finalMesh.geometry.name = object.geometry.name;
  
  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
