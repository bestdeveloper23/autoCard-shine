import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aParaboloidGeometry } from './libs/geometry/Paraboloid.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // radius1

    const radius1Row = new UIRow();
    const radius1I = new UINumber(parameters.R1).setRange(0, Infinity).onChange(update);

    radius1Row.add(new UIText(strings.getKey('sidebar/geometry/aparaboloid_geometry/r1')).setWidth('90px'));
    radius1Row.add(radius1I);

    radius1Row.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(radius1Row);

    // radius2

    const radius2Row = new UIRow();
    const radius2I = new UINumber(parameters.R2).setRange(0, Infinity).onChange(update);

    radius2Row.add(new UIText(strings.getKey('sidebar/geometry/aparaboloid_geometry/r2')).setWidth('90px'));
    radius2Row.add(radius2I);

    radius2Row.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(radius2Row);

    // height

    const dzRow = new UIRow();
    const dzI = new UINumber(parameters.pDz).setRange(0, Infinity).onChange(update);

    dzRow.add(new UIText(strings.getKey('sidebar/geometry/aparaboloid_geometry/height')).setWidth('90px'));
    dzRow.add(dzI);

    dzRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(dzRow);
    //

    function update() {


        var radius1 = radius1I.getValue(), radius2 = radius2I.getValue(), pDz = dzI.getValue();
        
        editor.execute(new SetGeometryCommand(editor, object, new aParaboloidGeometry(radius1 , radius2 , pDz)));

    }

    return container;

}

export { GeometryParametersPanel };
