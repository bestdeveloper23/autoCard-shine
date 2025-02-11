import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import tippy from 'tippy.js';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTorusGeometry } from './libs/geometry/Torus.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // Define unit options and multipliers
    const unitOptions = { cm: 'cm', inch: 'in', mm: 'mm' };
    const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 }; // Conversion factors relative to mm
    let baseDimensions = { maxRadius: parameters.pRMax, minRadius: parameters.pRMin, torRadius: parameters.pRTor };
    let isUnitChange = false; // Prevent unnecessary updates during unit change

    // Unit selection 
    const unitRow = new UIRow();
    const unitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    unitRow.add(new UIText('Unit').setWidth('90px'));
    unitRow.add(unitSelect);
    setTimeout(updateDefaultUnit, 300);

    //grid space
    const gridSpace = new UIText(strings.getKey('sidebar/geometry/grid_Space')).setClass('grid_Space');
    unitRow.add(gridSpace);
    container.add(unitRow);
        
    tippy(gridSpace.dom, { //For comment
        content: 'The grid is 10x10, with each square and the space between lines measuring 1 cm.',
        placement: 'top', 
    });
    
    // maxRadius
    const maxRadiusRow = new UIRow();
    const maxRadius = new UINumber(baseDimensions.maxRadius).setRange(0, Infinity).onChange(updateDimensions);
    const maxRadiusUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/maxradius')).setWidth('90px'), maxRadius, maxRadiusUnitSelect);
    container.add(maxRadiusRow);

    // minRadius
    const minRadiusRow = new UIRow();
    const minRadius = new UINumber(baseDimensions.minRadius).setRange(0, Infinity).onChange(updateDimensions);
    const minRadiusUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/minradius')).setWidth('90px'), minRadius, minRadiusUnitSelect);
    container.add(minRadiusRow);

    // torRadius
    const torRadiusRow = new UIRow();
    const torRadius = new UINumber(baseDimensions.torRadius).setRange(0, Infinity).onChange(updateDimensions);
    const torRadiusUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    torRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/torusradius')).setWidth('90px'), torRadius, torRadiusUnitSelect);
    container.add(torRadiusRow);

    // sphi

    const pSPhiRow = new UIRow();
    const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(updateGeometry);
    pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/pSPhi')).setWidth('90px'));
    pSPhiRow.add(pSPhi);
    pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(pSPhiRow);

    // dphi
    const pDPhiRow = new UIRow();
    const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(updateGeometry);
    pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atorus_geometry/pDPhi')).setWidth('90px'));
    pDPhiRow.add(pDPhi);
    pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(pDPhiRow);

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = unitSelect.getValue();
        maxRadius.setValue(baseDimensions.maxRadius / unitMultiplier[selectedUnit]);
        minRadius.setValue(baseDimensions.minRadius / unitMultiplier[selectedUnit]);
        torRadius.setValue(baseDimensions.torRadius / unitMultiplier[selectedUnit]);
        maxRadiusUnitSelect.setValue(selectedUnit);
        minRadiusUnitSelect.setValue(selectedUnit);
        torRadiusUnitSelect.setValue(selectedUnit);
        updateGeometry();
        isUnitChange = false;
    }

    // Function to update base dimensions and geometry when values change
    function updateDimensions() {
        if (!isUnitChange) {
            const maxRadiusUnit = maxRadiusUnitSelect.getValue();
            const minRadiusUnit = minRadiusUnitSelect.getValue();
            const torRadiusUnit = torRadiusUnitSelect.getValue();

            baseDimensions.maxRadius = Math.max(
                maxRadius.getValue() * unitMultiplier[maxRadiusUnit],
                baseDimensions.minRadius + 0.01
            );

            baseDimensions.minRadius = Math.min(
                minRadius.getValue() * unitMultiplier[minRadiusUnit],
                baseDimensions.maxRadius - 0.01
            );

            baseDimensions.torRadius = Math.max(
                torRadius.getValue() * unitMultiplier[torRadiusUnit],
                baseDimensions.maxRadius + 0.01
            );

            maxRadius.setValue(baseDimensions.maxRadius / unitMultiplier[maxRadiusUnit]);
            minRadius.setValue(baseDimensions.minRadius / unitMultiplier[minRadiusUnit]);
            torRadius.setValue(baseDimensions.torRadius / unitMultiplier[torRadiusUnit]);

            updateGeometry();
        }
    }

    // Function to handle unit changes for radius values
    function handleUnitChange() {
        isUnitChange = true;
        const selectedMaxRadiusUnit = maxRadiusUnitSelect.getValue();
        const selectedMinRadiusUnit = minRadiusUnitSelect.getValue();
        const selectedTorRadiusUnit = torRadiusUnitSelect.getValue();

        maxRadius.setValue(baseDimensions.maxRadius / unitMultiplier[selectedMaxRadiusUnit]);
        minRadius.setValue(baseDimensions.minRadius / unitMultiplier[selectedMinRadiusUnit]);
        torRadius.setValue(baseDimensions.torRadius / unitMultiplier[selectedTorRadiusUnit]);
        isUnitChange = false;
    }

    // Function to update geometry
    function updateGeometry() {
        const pRmax = baseDimensions.maxRadius;
        const pRmin = baseDimensions.minRadius;
        const pRtor = baseDimensions.torRadius;
        const SPhi = pSPhi.getValue();
        const DPhi = pDPhi.getValue();


        // maxRadius.setRange(pRmin + 0.001, pRtor - 0.001);
        // minRadius.setRange(0, pRmax - 0.001);
        // torRadius.setRange(pRmax + 0.001, Infinity);
        
        editor.execute(new SetGeometryCommand(editor, object, new aTorusGeometry(pRmin, pRmax, pRtor, SPhi, DPhi)));

    }

    return container;

}

export { GeometryParametersPanel };
