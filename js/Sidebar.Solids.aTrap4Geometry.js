import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTrap4Geometry } from './libs/geometry/Trap4.js';

function GeometryParametersPanel(editor, object) {
  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // heightZ (dz)
  const heightRowZ = new UIRow();
  const heightZ = new UINumber(parameters.pZ).setRange(0, Infinity).onChange(update);
  heightRowZ.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dZ')).setWidth('90px'));
  heightRowZ.add(heightZ);
  heightRowZ.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
  container.add(heightRowZ);

  // depth (dy1)
  const depthRowY = new UIRow();
  const depth = new UINumber(parameters.pY).setRange(0, Infinity).onChange(update);

  depthRowY.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dY')).setWidth('90px'));
  depthRowY.add(depth);
  depthRowY.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(depthRowY);

  // widthX (dx1)
  const widthRowX = new UIRow();
  const widthX = new UINumber(parameters.pX).setRange(0, Infinity).onChange(update);

  widthRowX.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dX')).setWidth('90px'));
  widthRowX.add(widthX);
  widthRowX.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(widthRowX);

  // LTX (dx3)
  const LTXRow = new UIRow();
  const SWidth = new UINumber(parameters.pLTX).setRange(0, Infinity).onChange(update);

  LTXRow.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dLTX')).setWidth('90px'));
  LTXRow.add(SWidth);
  LTXRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(LTXRow);

  // Update function
  function update() {
    const pDz = heightZ.getValue();
    const pDY = depth.getValue();
    const pX = widthX.getValue();
    const pLTX = SWidth.getValue();
    editor.execute(new SetGeometryCommand(editor, object, new aTrap4Geometry(pDz, pDY, pX, pLTX)));

  }

  return container;
}

export { GeometryParametersPanel };
