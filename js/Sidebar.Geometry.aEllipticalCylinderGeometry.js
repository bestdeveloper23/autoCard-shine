import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UIInteger, UICheckbox, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateElipticalCylinder } from './libs/CSG/EllipticalCylinder.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// Define unit options and multipliers
	const unitOptions = { cm: 'cm', inch: 'in', mm: 'mm' };
	const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 }; // Conversion factors relative to cm
	let baseDimensions = { xSemiAxis: parameters.xSemiAxis, ySemiAxis: parameters.semiAxisY, height: parameters.Dz };
	let isUnitChange = false; // Prevent unnecessary updates during unit change

	// Unit selection
	const unitRow = new UIRow();
	const unitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
	unitRow.add(new UIText('Unit').setWidth('90px'));
	unitRow.add(unitSelect);
	container.add(unitRow);

	// xSemiAxis
	const xSemiAxisRow = new UIRow();
	const xSemiAxisI = new UINumber( baseDimensions.xSemiAxis ).setRange(0, Infinity).onChange( updateDimensions );
	const xSemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	xSemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/xSemiAxis' ) ).setWidth( '90px' ) );
	xSemiAxisRow.add( xSemiAxisI, xSemiAxisUnitSelect );

	container.add( xSemiAxisRow );

	// ySemiAxis
	const ySemiAxisRow = new UIRow();
	const ySemiAxisI = new UINumber( baseDimensions.ySemiAxis ).setRange(0, Infinity).onChange( updateDimensions );
	const ySemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	ySemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/ySemiAxis' ) ).setWidth( '90px' ) );
	ySemiAxisRow.add( ySemiAxisI, ySemiAxisUnitSelect );

	container.add( ySemiAxisRow );

	// height

	const dzRow = new UIRow();
	const dzI = new UINumber( baseDimensions.height ).setRange(0, Infinity).onChange( updateDimensions );
	const dzUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	dzRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/dz' ) ).setWidth( '90px' ) );
	dzRow.add( dzI, dzUnitSelect );

	container.add( dzRow );

	// Function to update dimensions when the default unit changes
	function updateDefaultUnit() {
		isUnitChange = true;
		const selectedUnit = unitSelect.getValue();

		xSemiAxisI.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedUnit]);
		ySemiAxisI.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedUnit]);
		dzI.setValue(baseDimensions.height / unitMultiplier[selectedUnit]);

		xSemiAxisUnitSelect.setValue(selectedUnit);
		ySemiAxisUnitSelect.setValue(selectedUnit);
		dzUnitSelect.setValue(selectedUnit);

		updateGeometry();
		isUnitChange = false;
	}

	// Function to update base dimensions and geometry when values change
	function updateDimensions() {
		if (!isUnitChange) {
			const xSemiAxisUnit = xSemiAxisUnitSelect.getValue();
			const ySemiAxisUnit = ySemiAxisUnitSelect.getValue();
			const dzUnit = dzUnitSelect.getValue();

			baseDimensions.xSemiAxis = xSemiAxisI.getValue() * unitMultiplier[xSemiAxisUnit];
			baseDimensions.ySemiAxis = ySemiAxisI.getValue() * unitMultiplier[ySemiAxisUnit];
			baseDimensions.height = dzI.getValue() * unitMultiplier[dzUnit];

			updateGeometry();
		}
	}

	// Function to handle unit changes
	function handleUnitChange() {
		isUnitChange = true;
		const selectedXUnit = xSemiAxisUnitSelect.getValue();
		const selectedYUnit = ySemiAxisUnitSelect.getValue();
		const selectedHeightUnit = dzUnitSelect.getValue();

		xSemiAxisI.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedXUnit]);
		ySemiAxisI.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedYUnit]);
		dzI.setValue(baseDimensions.height / unitMultiplier[selectedHeightUnit]);

		isUnitChange = false;
	}

	// Function to update geometry
	function updateGeometry() {
		const xSemiAxisValue = baseDimensions.xSemiAxis;
		const ySemiAxisValue = baseDimensions.ySemiAxis;
		const heightValue = baseDimensions.height;

		const finalMesh = CreateElipticalCylinder( xSemiAxisValue, ySemiAxisValue, heightValue );

		finalMesh.geometry.name = object.geometry.name;

		editor.execute( new SetGeometryCommand( editor, object, finalMesh.geometry ) );

	}

	return container;

}

export { GeometryParametersPanel };
