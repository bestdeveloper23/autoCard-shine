import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

 const strings = editor.strings;

 const container = new UIDiv();

 const geometry = object.geometry;
 const parameters = geometry.parameters;

 // anchor

 const anchorRow = new UIRow();
 anchorRow.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/anchor')).setWidth('90px'));
 const anchorX = new UINumber(parameters.anchor[0]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const anchorY = new UINumber(parameters.anchor[1]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const anchorZ = new UINumber(parameters.anchor[2]).setPrecision( 5 ).setWidth('50px').onChange(update);

 anchorRow.add(anchorX);
 anchorRow.add(anchorY);
 anchorRow.add(anchorZ);

 container.add(anchorRow);

 // point2

 const point2Row = new UIRow();
 point2Row.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/point2')).setWidth('90px'));
 const point2X = new UINumber(parameters.p2[0]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const point2Y = new UINumber(parameters.p2[1]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const point2Z = new UINumber(parameters.p2[2]).setPrecision( 5 ).setWidth('50px').onChange(update);

 point2Row.add(point2X);
 point2Row.add(point2Y);
 point2Row.add(point2Z);

 container.add(point2Row);

 // point3

 const point3Row = new UIRow();
 point3Row.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/point3')).setWidth('90px'));
 const point3X = new UINumber(parameters.p3[0]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const point3Y = new UINumber(parameters.p3[1]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const point3Z = new UINumber(parameters.p3[2]).setPrecision( 5 ).setWidth('50px').onChange(update);

 point3Row.add(point3X);
 point3Row.add(point3Y);
 point3Row.add(point3Z);

 container.add(point3Row);

 // point4

 const point4Row = new UIRow();
 point4Row.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/point4')).setWidth('90px'));
 const point4X = new UINumber(parameters.p4[0]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const point4Y = new UINumber(parameters.p4[1]).setPrecision( 5 ).setWidth('50px').onChange(update);
 const point4Z = new UINumber(parameters.p4[2]).setPrecision( 5 ).setWidth('50px').onChange(update);

 point4Row.add(point4X);
 point4Row.add(point4Y);
 point4Row.add(point4Z);

 container.add(point4Row);

 //

 function update() {

  // we need to new each geometry module
  const anchor = [anchorX.getValue(), anchorY.getValue(), anchorZ.getValue()], p2 = [point2X.getValue(), point2Y.getValue(), point2Z.getValue()],
   p3 = [point3X.getValue(), point3Y.getValue(), point3Z.getValue()], p4 = [point4X.getValue(), point4Y.getValue(), point4Z.getValue()];

  const vertices = [], indices = [];
  vertices.push(...anchor, ...p2, ...p3, ...p4);
  indices.push(0, 1, 2, 0, 2, 1, 0, 2, 3, 0, 3, 2, 0, 1, 3, 0, 3, 1, 1, 2, 3, 1, 3, 2);
  const geometry = new PolyhedronGeometry(vertices, indices);
  const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
  geometry.parameters = param;
  geometry.type = 'aTetrahedraGeometry';

  editor.execute(new SetGeometryCommand(editor, object, geometry));

 }

 return container;

}

export { GeometryParametersPanel };
