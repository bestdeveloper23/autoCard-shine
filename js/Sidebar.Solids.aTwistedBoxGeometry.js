import * as THREE from 'three';
import tippy from 'tippy.js';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTwistedBoxGeometry } from './libs/geometry/TwistedBox.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

    // Define unit options and multipliers
    const unitOptions = { cm: 'cm', inch: 'in', mm: 'mm' };
    const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 }; // Conversion factors relative to mm
    let baseDimensions = { width: parameters.width, height: parameters.height, depth: parameters.depth };
    let isUnitChange = false;

    // Unit selection 
    const unitRow = new UIRow();
    const unitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    unitRow.add(new UIText('Unit').setWidth('90px'));
    unitRow.add(unitSelect);

    // Grid space
    const gridSpace = new UIText(strings.getKey('sidebar/geometry/grid_Space')).setClass('grid_Space');
    unitRow.add(gridSpace);
    container.add(unitRow);
        
    tippy(gridSpace.dom, { 
        content: 'The grid is 10x10, with each square and the space between lines measuring 1 cm.',
        placement: 'top', 
    });

    // Width
    const widthRow = new UIRow();
    const width = new UINumber(baseDimensions.width).setRange(0, Infinity).onChange(updateDimensions);
    const widthUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    widthRow.add(new UIText(strings.getKey('sidebar/geometry/atwistedbox_geometry/width')).setWidth('90px'), width, widthUnitSelect);
    container.add(widthRow);

    // Height
    const heightRow = new UIRow();
    const height = new UINumber(baseDimensions.height).setRange(0, Infinity).onChange(updateDimensions);
    const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    heightRow.add(new UIText(strings.getKey('sidebar/geometry/atwistedbox_geometry/height')).setWidth('90px'), height, heightUnitSelect);
    container.add(heightRow);

    // Depth
    const depthRow = new UIRow();
    const depth = new UINumber(baseDimensions.depth).setRange(0, Infinity).onChange(updateDimensions);
    const depthUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    depthRow.add(new UIText(strings.getKey('sidebar/geometry/atwistedbox_geometry/depth')).setWidth('90px'), depth, depthUnitSelect);
    container.add(depthRow);

    // Twisted Angle
    const twistedangleRow = new UIRow();
    const twistedangleI = new UINumber(parameters.angle).setRange(0, 89.99).onChange(updateGeometry);
    twistedangleRow.add(new UIText(strings.getKey('sidebar/geometry/atwistedbox_geometry/angle')).setWidth('90px'));
    twistedangleRow.add(twistedangleI);
    twistedangleRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(twistedangleRow);

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = unitSelect.getValue();
        width.setValue(baseDimensions.width / unitMultiplier[selectedUnit]);
        height.setValue(baseDimensions.height / unitMultiplier[selectedUnit]);
        depth.setValue(baseDimensions.depth / unitMultiplier[selectedUnit]);
        widthUnitSelect.setValue(selectedUnit);
        heightUnitSelect.setValue(selectedUnit);
        depthUnitSelect.setValue(selectedUnit);
        updateGeometry();
        isUnitChange = false;
    }

    // Function to update base dimensions and geometry when values change
    function updateDimensions() {
        if (!isUnitChange) {
            const widthUnit = widthUnitSelect.getValue();
            const heightUnit = heightUnitSelect.getValue();
            const depthUnit = depthUnitSelect.getValue();

            baseDimensions.width = width.getValue() * unitMultiplier[widthUnit];
            baseDimensions.height = height.getValue() * unitMultiplier[heightUnit];
            baseDimensions.depth = depth.getValue() * unitMultiplier[depthUnit];

            width.setValue(baseDimensions.width / unitMultiplier[widthUnit]);
            height.setValue(baseDimensions.height / unitMultiplier[heightUnit]);
            depth.setValue(baseDimensions.depth / unitMultiplier[depthUnit]);

            updateGeometry();
        }
    }

    // Function to handle unit changes for width, height, and depth
    function handleUnitChange() {
        isUnitChange = true;
        const selectedWidthUnit = widthUnitSelect.getValue();
        const selectedHeightUnit = heightUnitSelect.getValue();
        const selectedDepthUnit = depthUnitSelect.getValue();

        width.setValue(baseDimensions.width / unitMultiplier[selectedWidthUnit]);
        height.setValue(baseDimensions.height / unitMultiplier[selectedHeightUnit]);
        depth.setValue(baseDimensions.depth / unitMultiplier[selectedDepthUnit]);
        isUnitChange = false;
    }

    // Function to update geometry
    function updateGeometry() {
        const pDx = baseDimensions.width;
        const pDy = baseDimensions.height;
        const pDz = baseDimensions.depth;
        const twistedangle = twistedangleI.getValue();

        editor.execute(new SetGeometryCommand(editor, object, new aTwistedBoxGeometry(twistedangle, pDx, pDy, pDz)));
    }

	return container;

}

export { GeometryParametersPanel };
