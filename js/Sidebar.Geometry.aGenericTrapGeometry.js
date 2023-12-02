import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();


    // height

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    const heightRow = new UIRow();
    const heightI = new UINumber(parameters.pDz).setRange(0, Infinity).onChange(update);

    heightRow.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/pdz')).setWidth('90px'));
    heightRow.add(heightI);

    container.add(heightRow);

    // point1

    const point1Row = new UIRow();
    point1Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point1')).setWidth('90px'));
    const point1X = new UINumber(parameters.px[0]).setPrecision(3).setWidth('75px').onChange(update);
    const point1Z = new UINumber(parameters.py[0]).setPrecision(3).setWidth('75px').onChange(update);

    point1Row.add(point1X);
    point1Row.add(point1Z);

    container.add(point1Row);

    // point2

    const point2Row = new UIRow();
    point2Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point2')).setWidth('90px'));
    const point2X = new UINumber(parameters.px[1]).setPrecision(3).setWidth('75px').onChange(update);
    const point2Z = new UINumber(parameters.py[1]).setPrecision(3).setWidth('75px').onChange(update);

    point2Row.add(point2X);
    point2Row.add(point2Z);

    container.add(point2Row);

    // point3

    const point3Row = new UIRow();
    point3Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point3')).setWidth('90px'));
    const point3X = new UINumber(parameters.px[2]).setPrecision(3).setWidth('75px').onChange(update);
    const point3Z = new UINumber(parameters.py[2]).setPrecision(3).setWidth('75px').onChange(update);

    point3Row.add(point3X);
    point3Row.add(point3Z);

    container.add(point3Row);

    // point4

    const point4Row = new UIRow();
    point4Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point4')).setWidth('90px'));
    const point4X = new UINumber(parameters.px[3]).setPrecision(3).setWidth('75px').onChange(update);
    const point4Z = new UINumber(parameters.py[3]).setPrecision(3).setWidth('75px').onChange(update);

    point4Row.add(point4X);
    point4Row.add(point4Z);

    container.add(point4Row);


    // point5

    const point5Row = new UIRow();
    point5Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point5')).setWidth('90px'));
    const point5X = new UINumber(parameters.px[4]).setPrecision(3).setWidth('75px').onChange(update);
    const point5Z = new UINumber(parameters.py[4]).setPrecision(3).setWidth('75px').onChange(update);

    point5Row.add(point5X);
    point5Row.add(point5Z);

    container.add(point5Row);

    // point6

    const point6Row = new UIRow();
    point6Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point6')).setWidth('90px'));
    const point6X = new UINumber(parameters.px[5]).setPrecision(3).setWidth('75px').onChange(update);
    const point6Z = new UINumber(parameters.py[5]).setPrecision(3).setWidth('75px').onChange(update);

    point6Row.add(point6X);
    point6Row.add(point6Z);

    container.add(point6Row);

    // point7

    const point7Row = new UIRow();
    point7Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point7')).setWidth('90px'));
    const point7X = new UINumber(parameters.px[6]).setPrecision(3).setWidth('75px').onChange(update);
    const point7Z = new UINumber(parameters.py[6]).setPrecision(3).setWidth('75px').onChange(update);

    point7Row.add(point7X);
    point7Row.add(point7Z);

    container.add(point7Row);

    // point8

    const point8Row = new UIRow();
    point8Row.add(new UIText(strings.getKey('sidebar/geometry/agenerictrap_geometry/point8')).setWidth('90px'));
    const point8X = new UINumber(parameters.px[7]).setPrecision(3).setWidth('75px').onChange(update);
    const point8Z = new UINumber(parameters.py[7]).setPrecision(3).setWidth('75px').onChange(update);

    point8Row.add(point8X);
    point8Row.add(point8Z);

    container.add(point8Row);

    //

    function update() {

        // we need to new each geometry module

        const pDz = heightI.getValue(), px = [], py = [];

        px.push(point1X.getValue(), point2X.getValue(), point3X.getValue(), point4X.getValue(), point5X.getValue(), point6X.getValue(), point7X.getValue(), point8X.getValue(),);
        py.push(point1Z.getValue(), point2Z.getValue(), point3Z.getValue(), point4Z.getValue(), point5Z.getValue(), point6Z.getValue(), point7Z.getValue(), point8Z.getValue(),);

        const vertices = [], indices = [];
        for (let i = 0; i < 8; i++) {
            if (i > 3) {
                vertices.push(px[i], 1 * pDz, py[i]);
            } else {
                vertices.push(px[i], -1 * pDz, py[i]);
            }
        }

        indices.push(0, 2, 1, 0, 3, 2, 0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7, 4, 5, 6, 4, 6, 7, 0, 3, 1, 1, 3, 2, 0, 1, 4, 4, 1, 5, 1, 2, 5, 5, 2, 6, 6, 2, 3, 6, 3, 7, 3, 0, 7, 4, 7, 0, 4, 5, 7, 5, 6, 7);
        const geometry = new PolyhedronGeometry(vertices, indices);
        const param = { 'pDz': pDz, 'px': px, 'py': py };
        geometry.parameters = param;
        geometry.type = 'aGenericTrapGeometry';
        editor.execute(new SetGeometryCommand(editor, object, geometry));

    }

    return container;

}

export { GeometryParametersPanel };
