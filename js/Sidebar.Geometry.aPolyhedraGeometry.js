import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { PolyconeGeometry } from './libs/geometry/PolyconeGeometry.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger, UIInput } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aPolyhedraGeometry } from './libs/geometry/PolyHedra.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // sphi

    const sphiRow = new UIRow();
    const sphiI = new UINumber(parameters.SPhi).setStep(5).setRange(0, Infinity).onChange(update);

    sphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/sphi')).setWidth('90px'));
    sphiRow.add(sphiI);
    sphiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(sphiRow);

    // dphi

    const dphiRow = new UIRow();
    const dphiI = new UINumber(parameters.DPhi).setStep(5).setRange(0, Infinity).onChange(update);

    dphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/dphi')).setWidth('90px'));
    dphiRow.add(dphiI);
    dphiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(dphiRow);

    // z-count

    const numsideRow = new UIRow();
    const numsideI = new UIInteger(parameters.numSide).setRange(2, Infinity).onChange(update);

    numsideRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/numside')).setWidth('90px'));
    numsideRow.add(numsideI);

    container.add(numsideRow);

    // z-count

    const znumberRow = new UIRow();
    const znumberI = new UIInteger(parameters.numZPlanes).setRange(2, Infinity).onChange(update);

    znumberRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/znumber')).setWidth('90px'));
    znumberRow.add(znumberI);

    container.add(znumberRow);


    // radius

    const radiusRow = new UIRow();
    const radius = new UIInput(parameters.rOuter).setWidth('150px').setFontSize('12px').onChange(update);

    radiusRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/radius')).setWidth('90px'));
    radiusRow.add(radius);

    radiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(radiusRow);

    // z

    const zpositionRow = new UIRow();
    const zposition = new UIInput(parameters.z).setWidth('150px').setFontSize('12px').onChange(update);

    zpositionRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/z')).setWidth('90px'));
    zpositionRow.add(zposition);

    zpositionRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
    
    container.add(zpositionRow);


    function update() {

        const SPhi = sphiI.getValue();
        const DPhi = dphiI.getValue();
        const numSide = numsideI.getValue();
        const numZPlanes = znumberI.getValue(); 
        const rOuter_string = radius.getValue().split(',');
        const z_string = zposition.getValue().split(',');
        const rOuter = rOuter_string.map(item => parseFloat(item));
        const z = z_string.map(item => parseFloat(item));

        
        editor.execute(new SetGeometryCommand(editor, object, new aPolyhedraGeometry(SPhi, DPhi, numSide, numZPlanes, rInner, rOuter, z)));

    }

    return container;

}

export { GeometryParametersPanel };

