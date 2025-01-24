import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateTrapezoid } from './libs/CSG/TrapeZoid.js';
import { aTrapezoidGeometry } from './libs/geometry/aTrapezoidGeometry.js';

function GeometryParametersPanel(editor, object) {

  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // width1

  const widthRow1 = new UIRow();
  const width1 = new UINumber(parameters.dx1).setRange(0.001, Infinity).onChange(update);

  widthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx1')).setWidth('90px'));
  widthRow1.add(width1);

  widthRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(widthRow1);

  // depth1

  const depthRow1 = new UIRow();
  const depth1 = new UINumber(parameters.dy1).setRange(0.001, Infinity).onChange(update);

  depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy1')).setWidth('90px'));
  depthRow1.add(depth1);

  depthRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(depthRow1);

  // width2

  const widthRow2 = new UIRow();
  const width2 = new UINumber(parameters.dx2).setRange(0.001, Infinity).onChange(update);

  widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx2')).setWidth('90px'));
  widthRow2.add(width2);

  widthRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(widthRow2);

  // depth2

  const depthRow2 = new UIRow();
  const depth2 = new UINumber(parameters.dy2).setRange(0.001, Infinity).onChange(update);

  depthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy2')).setWidth('90px'));
  depthRow2.add(depth2);

  depthRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

  container.add(depthRow2);

  // height

  const heightRow = new UIRow();
  const height = new UINumber(parameters.dz).setRange(0.001, Infinity).onChange(update);

  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dz')).setWidth('90px'));
  heightRow.add(height);

  heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
  
  container.add(heightRow);

  //

  function update() {

    const dx1 = width1.getValue(), dy1 = depth1.getValue(), dz = height.getValue(), dx2 = width2.getValue(), dy2 = depth2.getValue();
    // const finalMesh = CreateTrapezoid( dx1 , dy1 , dz , dx2 , dy2 )

    // finalMesh.geometry.name = object.geometry.name;
    
    editor.execute(new SetGeometryCommand(editor, object, aTrapezoidGeometry(dx1 , dy1 , dz , dx2 , dy2)));
  }

  return container;

}

export { GeometryParametersPanel };
