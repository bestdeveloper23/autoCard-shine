import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import tippy from 'tippy.js';
import { UIDiv, UIRow, UIText, UIInteger, UICheckbox, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aEllipticalCylinderGeometry } from './libs/geometry/EllipticalCylinderGeometry.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// Define unit options and multipliers
	const unitOptions = { cm: 'cm', inch: 'in', mm: 'mm' };
	const unitMultiplier = { cm: 10, inch: 25.4, mm: 1 }; // Conversion factors relative to mm
	let baseDimensions = { xSemiAxis: parameters.xSemiAxis, ySemiAxis: parameters.semiAxisY, height: parameters.Dz };
	let isUnitChange = false; // Prevent unnecessary updates during unit change

	// Unit selection
	const unitRow = new UIRow();
	const unitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
	unitRow.add(new UIText('Unit').setWidth('90px'));
	unitRow.add(unitSelect);
	setTimeout(updateDefaultUnit, 300); //shows the default units in cm

	//grid space
	const gridSpace = new UIText(strings.getKey('sidebar/geometry/grid_Space')).setClass('grid_Space');
	unitRow.add(gridSpace);
	container.add( unitRow );
	
	tippy(gridSpace.dom, { //For comment
		content: 'The grid is 10x10, with each square and the space between lines measuring 1 cm.',
		placement: 'top', 
	});

	// xSemiAxis
	const xSemiAxisRow = new UIRow();
	const xSemiAxisI = new UINumber( baseDimensions.xSemiAxis *2).setRange(0, Infinity).onChange( updateDimensions );
	const xSemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	xSemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/xSemiAxis' ) ).setWidth( '90px' ) );
	xSemiAxisRow.add( xSemiAxisI, xSemiAxisUnitSelect );

	container.add( xSemiAxisRow );

	// ySemiAxis
	const ySemiAxisRow = new UIRow();
	const ySemiAxisI = new UINumber( baseDimensions.ySemiAxis *2).setRange(0, Infinity).onChange( updateDimensions );
	const ySemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	ySemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/ySemiAxis' ) ).setWidth( '90px' ) );
	ySemiAxisRow.add( ySemiAxisI, ySemiAxisUnitSelect );

	container.add( ySemiAxisRow );

	// height

	const dzRow = new UIRow();
	const dzI = new UINumber( baseDimensions.height *2).setRange(0, Infinity).onChange( updateDimensions );
	const dzUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	dzRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/dz' ) ).setWidth( '90px' ) );
	dzRow.add( dzI, dzUnitSelect );

	container.add( dzRow );

	// Function to update dimensions when the default unit changes
	function updateDefaultUnit() {
		isUnitChange = true;
		const selectedUnit = unitSelect.getValue();

		xSemiAxisI.setValue( (baseDimensions.xSemiAxis / unitMultiplier[selectedUnit]) *2);
		ySemiAxisI.setValue( (baseDimensions.ySemiAxis / unitMultiplier[selectedUnit]) *2);
		dzI.setValue((baseDimensions.height / unitMultiplier[selectedUnit]) *2);

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

			baseDimensions.xSemiAxis = (xSemiAxisI.getValue() /2) * unitMultiplier[xSemiAxisUnit];
			baseDimensions.ySemiAxis = (ySemiAxisI.getValue() /2) * unitMultiplier[ySemiAxisUnit];
			baseDimensions.height = (dzI.getValue() /2) * unitMultiplier[dzUnit];

			updateGeometry();
		}
	}

	// Function to handle unit changes
	function handleUnitChange() {
		isUnitChange = true;
		const selectedXUnit = xSemiAxisUnitSelect.getValue();
		const selectedYUnit = ySemiAxisUnitSelect.getValue();
		const selectedHeightUnit = dzUnitSelect.getValue();

		xSemiAxisI.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedXUnit] * 2);
		ySemiAxisI.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedYUnit] * 2);
		dzI.setValue(baseDimensions.height / unitMultiplier[selectedHeightUnit] * 2);

		isUnitChange = false;
	}

	// Function to update geometry
	function updateGeometry() {
		const xSemiAxisValue = baseDimensions.xSemiAxis;
		const ySemiAxisValue = baseDimensions.ySemiAxis;
		const heightValue = baseDimensions.height;

		editor.execute( new SetGeometryCommand( editor, object, new aEllipticalCylinderGeometry(xSemiAxisValue, ySemiAxisValue, heightValue)) );

	}

	return container;

}

export { GeometryParametersPanel };