import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aEllipticalCylinderGeometry } from './libs/geometry/EllipticalCylinder.js';

function GeometryParametersPanel(editor, object) {

	const strings = editor.strings;
	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// Base dimensions stored in mm
	let baseDimensions = {
		xSemiAxis: parameters.xSemiAxis,
		ySemiAxis: parameters.semiAxisY,
		height: parameters.Dz
	};

	// Unit conversion
	const unitOptions = { cm: 'cm', inch: 'inch', mm: 'mm' };
	const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 };
	let isUnitChange = false;

	// Default Unit Row
	const defaultUnitRow = new UIRow();
	const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
	defaultUnitRow.add(new UIText('Unit').setWidth('90px'), defaultUnitSelect);
	container.add(defaultUnitRow);

	// xSemiAxis
	const xSemiAxisRow = new UIRow();
	const xSemiAxis = new UINumber(baseDimensions.xSemiAxis).setRange(0.01, Infinity).onChange(updateDimensions);
	const xSemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	xSemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aecylinder_geometry/xSemiAxis')).setWidth('90px'), xSemiAxis, xSemiAxisUnitSelect);
	container.add(xSemiAxisRow);

	// ySemiAxis
	const ySemiAxisRow = new UIRow();
	const ySemiAxis = new UINumber(baseDimensions.ySemiAxis).setRange(0.01, Infinity).onChange(updateDimensions);
	const ySemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	ySemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aecylinder_geometry/ySemiAxis')).setWidth('90px'), ySemiAxis, ySemiAxisUnitSelect);
	container.add(ySemiAxisRow);

	// Height (Dz)
	const dzRow = new UIRow();
	const dz = new UINumber(baseDimensions.height).setRange(0.01, Infinity).onChange(updateDimensions);
	const dzUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	dzRow.add(new UIText(strings.getKey('sidebar/geometry/aecylinder_geometry/dz')).setWidth('90px'), dz, dzUnitSelect);
	container.add(dzRow);

	// ------------------ Core Update Functions ------------------

	function updateDefaultUnit() {
		isUnitChange = true;
		const selectedUnit = defaultUnitSelect.getValue();

		xSemiAxis.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedUnit]);
		ySemiAxis.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedUnit]);
		dz.setValue(baseDimensions.height / unitMultiplier[selectedUnit]);

		xSemiAxisUnitSelect.setValue(selectedUnit);
		ySemiAxisUnitSelect.setValue(selectedUnit);
		dzUnitSelect.setValue(selectedUnit);

		updateGeometry();
		isUnitChange = false;
	}

	function updateDimensions() {
		if (!isUnitChange) {
			const xUnit = xSemiAxisUnitSelect.getValue();
			const yUnit = ySemiAxisUnitSelect.getValue();
			const dzUnit = dzUnitSelect.getValue();

			baseDimensions.xSemiAxis = xSemiAxis.getValue() * unitMultiplier[xUnit];
			baseDimensions.ySemiAxis = ySemiAxis.getValue() * unitMultiplier[yUnit];
			baseDimensions.height = dz.getValue() * unitMultiplier[dzUnit];

			updateGeometry();
		}
	}

	function handleUnitChange() {
		isUnitChange = true;

		const xUnit = xSemiAxisUnitSelect.getValue();
		const yUnit = ySemiAxisUnitSelect.getValue();
		const dzUnit = dzUnitSelect.getValue();

		xSemiAxis.setValue(baseDimensions.xSemiAxis / unitMultiplier[xUnit]);
		ySemiAxis.setValue(baseDimensions.ySemiAxis / unitMultiplier[yUnit]);
		dz.setValue(baseDimensions.height / unitMultiplier[dzUnit]);

		updateGeometry();
		isUnitChange = false;
	}

	function updateGeometry() {
		const xSemiAxisValue = baseDimensions.xSemiAxis;
		const ySemiAxisValue = baseDimensions.ySemiAxis;
		const heightValue = baseDimensions.height;

		editor.execute( new SetGeometryCommand( editor, object, new aEllipticalCylinderGeometry(xSemiAxisValue, ySemiAxisValue, heightValue)) );
	}

	return container;
}

export { GeometryParametersPanel };
