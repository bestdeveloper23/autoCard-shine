
import * as THREE from 'three';
import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';
import { CreateBox } from './libs/CSG/Box.js'; 
import { createUnitRow, createDimensionRow, getConversionFactor } from './libs/UnitConverter.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;
	const container = new UIDiv();
	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// Unit Row
	const { unitRow, unitSelect } = createUnitRow('cm', updateUnits);
	container.add(unitRow);

	// Width
	const { row: widthRow, input: width, unitSelect: widthUnit } = createDimensionRow('Width', parameters.width, 'cm', update);
	container.add(widthRow);

	// Height
	const { row: heightRow, input: height, unitSelect: heightUnit } = createDimensionRow('Height', parameters.height, 'cm', update);
	container.add(heightRow);

	// Depth
	const { row: depthRow, input: depth, unitSelect: depthUnit } = createDimensionRow('Depth', parameters.depth, 'cm', update);
	container.add(depthRow);

	function updateUnits() {
		const defaultUnit = unitSelect.getValue();
		widthUnit.setValue(defaultUnit);
		heightUnit.setValue(defaultUnit);
		depthUnit.setValue(defaultUnit);
		update();
	}

	function update() {
		const widthFactor = getConversionFactor(widthUnit.getValue());
		const heightFactor = getConversionFactor(heightUnit.getValue());
		const depthFactor = getConversionFactor(depthUnit.getValue());

        const mesh = CreateBox( 
            width.getValue() * widthFactor, 
            height.getValue() * heightFactor, 
            depth.getValue() * depthFactor 
        );

        editor.execute( new SetGeometryCommand( editor, object, mesh.geometry ) );
    }

    return container;
}

export { GeometryParametersPanel };
