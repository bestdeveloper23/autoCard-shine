import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateTube } from './libs/CSG/Tube.js'; 

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
    const pRMax = maxRadius.getValue() * cm;
    const pRMin = minRadius.getValue() * cm;
    const pDz = height.getValue() * cm;
    const SPhi = pSPhi.getValue();
    const DPhi = pDPhi.getValue();

    const finalMesh = CreateTube(pRMin, pRMax, pDz, SPhi, DPhi);

    maxRadius.setRange(pRMin / cm + 0.0001, Infinity);
    minRadius.setRange(0.00, pRMax / cm - 0.0001);
    editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));
}

return container;
}

export { GeometryParametersPanel };
