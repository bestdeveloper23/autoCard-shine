// TrapezoidParallePiped Geometry, 

import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTrapeZoidPGeometry } from './libs/geometry/TrapeZoid2P.js';

function GeometryParametersPanel(editor, object) {

  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // height

  const heightRow = new UIRow();
  const height = new UINumber(parameters.dz).setRange(0, Infinity).onChange(update);

  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dz')).setWidth('90px'));
  heightRow.add(height);

  heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(heightRow);


  // theta

  const thetaRow = new UIRow();
  const thetaI = new UINumber(parameters.theta).setRange(-90, 90).onChange(update);

  thetaRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/theta')).setWidth('90px'));
  thetaRow.add(thetaI);
  thetaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

  container.add(thetaRow);

  // phi

  const phiRow = new UIRow();
  const phiI = new UINumber(parameters.phi).setRange(-90, 90).onChange(update);

  phiRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/phi')).setWidth('90px'));
  phiRow.add(phiI);
  phiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

  container.add(phiRow);


  // depth1

  const depthRow1 = new UIRow();
  const depth1 = new UINumber(parameters.dy1).setRange(0, Infinity).onChange(update);

  depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dy1')).setWidth('90px'));
  depthRow1.add(depth1);

  depthRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(depthRow1);


  // width1

  const widthRow1 = new UIRow();
  const width1 = new UINumber(parameters.dx1).setRange(0, Infinity).onChange(update);

  widthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx1')).setWidth('90px'));
  widthRow1.add(width1);

  widthRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(widthRow1);

  // width2

  const widthRow2 = new UIRow();
  const width2 = new UINumber(parameters.dx2).setRange(0, Infinity).onChange(update);

  widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx2')).setWidth('90px'));
  widthRow2.add(width2);

  widthRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(widthRow2);


  // alpha1

  const alphaRow = new UIRow();
  const alphaI = new UINumber(parameters.alpha1).setRange(-90, 90).onChange(update);

  alphaRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/alpha1')).setWidth('90px'));
  alphaRow.add(alphaI);
  alphaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

  container.add(alphaRow);

  // depth2

  const depthRow2 = new UIRow();
  const depth2 = new UINumber(parameters.dy2).setRange(0, Infinity).onChange(update);

  depthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dy2')).setWidth('90px'));
  depthRow2.add(depth2);

  depthRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(depthRow2);


  //width3
  const widthRow3 = new UIRow();
  const width3 = new UINumber(parameters.dx3).setRange(0, Infinity).onChange(update);

  widthRow3.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx3')).setWidth('90px'));
  widthRow3.add(width3);

  widthRow3.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(widthRow3);


  // width4

  const widthRow4 = new UIRow();
  const width4 = new UINumber(parameters.dx4).setRange(0, Infinity).onChange(update);

  widthRow4.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx4')).setWidth('90px'));
  widthRow4.add(width4);

  widthRow4.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(widthRow4);


  // alpha2

  const alpha2Row = new UIRow();
  const alpha2 = new UINumber(parameters.alpha2).setRange(-90, 90).onChange(update);

  alpha2Row.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/alpha2')).setWidth('90px'));
  alpha2Row.add(alpha2);
  alpha2Row.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

  container.add(alpha2Row);

  //

  function update() {
    // Get all parameters in the correct order for the constructor
    const pDz = height.getValue();
    const pTheta = thetaI.getValue();
    const pPhi = phiI.getValue();
    const pDy1 = depth1.getValue();
    const pDx1 = width1.getValue();
    const pDx2 = width2.getValue();
    const pAlpha = alphaI.getValue();
    const pDy2 = depth2.getValue();
    const pDx3 = width3.getValue();
    const pDx4 = width4.getValue();
    const pAlpha2 = alpha2.getValue();

    editor.execute(new SetGeometryCommand(editor, object, new aTrapeZoidPGeometry(pDz, pTheta, pPhi, pDy1, pDx1, pDx2, pAlpha, pDy2, pDx3, pDx4, pAlpha2)));
  }

  return container;
}

export { GeometryParametersPanel };