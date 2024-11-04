import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UISelect, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateTorus } from './libs/CSG/Torus.js'; 

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // Unit selection 
    const unitRow = new UIRow();
    const unitSelect = new UISelect().setOptions({ 'cm': 'Centimeters', 'in': 'Inches' }).setValue('cm').onChange(update);
    unitRow.add(new UIText('Unit').setWidth('90px'));
    unitRow.add(unitSelect);
    container.add(unitRow);
    
    // maxRadius

    const maxRadiusRow = new UIRow();
    const maxRadius = new UINumber(parameters.pRMax).setRange(parameters.pRMin + 0.001, Infinity).onChange(update);

    maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/maxradius')).setWidth('90px'));
    maxRadiusRow.add(maxRadius);

    // maxRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(maxRadiusRow);

    // minRadius

    const minRadiusRow = new UIRow();
    const minRadius = new UINumber(parameters.pRMin).setRange(0, parameters.pRMax - 0.001).onChange(update);

    minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/minradius')).setWidth('90px'));
    minRadiusRow.add(minRadius);

    // minRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(minRadiusRow);

    // torRadius

    const torRadiusRow = new UIRow();
    const torRadius = new UINumber(parameters.pRTor).setRange(0.001, Infinity).onChange(update);

    torRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/torusradius')).setWidth('90px'));
    torRadiusRow.add(torRadius);

    // torRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(torRadiusRow);

    // sphi

    const pSPhiRow = new UIRow();
    const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
    pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/pSPhi')).setWidth('90px'));
    pSPhiRow.add(pSPhi);
    pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(pSPhiRow);

    // dphi

    const pDPhiRow = new UIRow();
    const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(update);
    pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/pDPhi')).setWidth('90px'));
    pDPhiRow.add(pDPhi);
    pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(pDPhiRow);

    function update() {
        const unit = unitSelect.getValue();
        const factor = unit === 'in' ? 25.4 : 10; // Conversion factor: 1 inch = 25.4 mm, or use 10 for cm

        const pRMax = maxRadius.getValue()*factor;
        const pRMin = minRadius.getValue()*factor;
        const pRtor = torRadius.getValue()*factor;
        const SPhi = pSPhi.getValue()/180*Math.PI;
        const DPhi = pDPhi.getValue()/180*Math.PI;

        const finalMesh = CreateTorus(pRMin, pRMax, pRtor, SPhi, DPhi);

        // set Range 
        maxRadius.setRange(pRMin + 0.001, pRtor - 0.001);
        minRadius.setRange(0, pRMax - 0.001);
        torRadius.setRange(pRMax + 0.001, Infinity);
        
        finalMesh.geometry.name = object.geometry.name;
        
        editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

    }

    return container;

}

export { GeometryParametersPanel };
