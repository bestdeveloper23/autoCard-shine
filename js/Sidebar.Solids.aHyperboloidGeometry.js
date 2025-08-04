import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aHyperboloidGeometry } from './libs/geometry/Hyperboloid.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // Define unit options and multipliers
    const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
    const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
    let baseDimensions = {
        radiusIn: parameters.radiusIn,
        radiusOut: parameters.radiusOut,
        pDz: parameters.pDz
    };
    let isUnitChange = false; // Prevents unnecessary updates during unit switching

    // Default Unit Selection
    const defaultUnitRow = new UIRow();
    const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
    container.add(defaultUnitRow);

    // radiusIn with unit select
    const radiusInRow = new UIRow();
    const radiusInInput = new UINumber(parameters.radiusIn).onChange(updateDimensions);
    const radiusInUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    radiusInRow.add(new UIText(strings.getKey('sidebar/geometry/ahyperboloid_geometry/radiusin')).setWidth('90px'), radiusInInput, radiusInUnitSelect);
    container.add(radiusInRow);

    // radiusOut with unit select
    const radiusOutRow = new UIRow();
    const radiusOutInput = new UINumber(parameters.radiusOut).onChange(updateDimensions);
    const radiusOutUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    radiusOutRow.add(new UIText(strings.getKey('sidebar/geometry/ahyperboloid_geometry/radiusout')).setWidth('90px'), radiusOutInput, radiusOutUnitSelect);
    container.add(radiusOutRow);

    // innerStereo (maps to stereo2 in parameters) - no unit conversion needed
    const innerStereoRow = new UIRow();
    const innerStereoInput = new UINumber(parameters.stereo2).setRange(0, Infinity).onChange(update);
    innerStereoRow.add(new UIText(strings.getKey('sidebar/geometry/ahyperboloid_geometry/stereoin')).setWidth('90px'));
    innerStereoRow.add(innerStereoInput);
    innerStereoRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(innerStereoRow);

    // outerStereo (maps to stereo1 in parameters) - no unit conversion needed
    const outerStereoRow = new UIRow();
    const outerStereoInput = new UINumber(parameters.stereo1).setRange(0, Infinity).onChange(update);
    outerStereoRow.add(new UIText(strings.getKey('sidebar/geometry/ahyperboloid_geometry/stereoout')).setWidth('90px'));
    outerStereoRow.add(outerStereoInput);
    outerStereoRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(outerStereoRow);

    // height (pDz) with unit select
    const heightRow = new UIRow();
    const heightInput = new UINumber(parameters.pDz).onChange(updateDimensions);
    const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    heightRow.add(new UIText(strings.getKey('sidebar/geometry/ahyperboloid_geometry/height')).setWidth('90px'), heightInput, heightUnitSelect);
    container.add(heightRow);

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = defaultUnitSelect.getValue();

        radiusInInput.setValue(baseDimensions.radiusIn / unitMultiplier[selectedUnit]);
        radiusOutInput.setValue(baseDimensions.radiusOut / unitMultiplier[selectedUnit]);
        heightInput.setValue(baseDimensions.pDz / unitMultiplier[selectedUnit]);

        radiusInUnitSelect.setValue(selectedUnit);
        radiusOutUnitSelect.setValue(selectedUnit);
        heightUnitSelect.setValue(selectedUnit);

        isUnitChange = false;
        update();
    }

    // Function to update base dimensions when values change
    function updateDimensions() {
        if (!isUnitChange) {
            const radiusInUnit = radiusInUnitSelect.getValue();
            const radiusOutUnit = radiusOutUnitSelect.getValue();
            const heightUnit = heightUnitSelect.getValue();

            baseDimensions.radiusIn = radiusInInput.getValue() * unitMultiplier[radiusInUnit];
            baseDimensions.radiusOut = Math.max(radiusOutInput.getValue() * unitMultiplier[radiusOutUnit], 0.01);
            baseDimensions.pDz = Math.max(heightInput.getValue() * unitMultiplier[heightUnit], 0.01);

            // Update UI to reflect any corrections
            radiusOutInput.setValue(baseDimensions.radiusOut / unitMultiplier[radiusOutUnit]);
            heightInput.setValue(baseDimensions.pDz / unitMultiplier[heightUnit]);

            update();
        }
    }

    // Function to handle unit changes for specific dimensions
    function handleUnitChange() {
        isUnitChange = true;
        const selectedRadiusInUnit = radiusInUnitSelect.getValue();
        const selectedRadiusOutUnit = radiusOutUnitSelect.getValue();
        const selectedHeightUnit = heightUnitSelect.getValue();

        radiusInInput.setValue(baseDimensions.radiusIn / unitMultiplier[selectedRadiusInUnit]);
        radiusOutInput.setValue(baseDimensions.radiusOut / unitMultiplier[selectedRadiusOutUnit]);
        heightInput.setValue(baseDimensions.pDz / unitMultiplier[selectedHeightUnit]);

        isUnitChange = false;
    }

    function update() {
        // Get values from the UI inputs or base dimensions
        const radiusIn = baseDimensions.radiusIn;
        const radiusOut = baseDimensions.radiusOut;
        const innerStereo = innerStereoInput.getValue();
        const outerStereo = outerStereoInput.getValue();
        const pdz = baseDimensions.pDz;

        // Create new geometry with the correct parameter order 
        editor.execute(new SetGeometryCommand(editor, object, new aHyperboloidGeometry(
            radiusIn,
            radiusOut,
            innerStereo,
            outerStereo,
            pdz
        )));
    }

    return container;
}

export { GeometryParametersPanel };