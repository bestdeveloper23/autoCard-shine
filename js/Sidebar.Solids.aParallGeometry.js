import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aParallGeometry } from './libs/geometry/Parallelepiped.js';

function GeometryParametersPanel(editor, object) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// Define unit options
	const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
	const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
	let baseDimensions = {
		dx: parameters.dx,
		dy: parameters.dy,
		dz: parameters.dz,
	};
	let isUnitChange = false; // Prevents unnecessary updates during unit switching

	// Default Unit Selection
	const defaultUnitRow = new UIRow();
	const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
	defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
	container.add(defaultUnitRow);

	// Width with unit select
	const widthRow = new UIRow();
	const width = new UINumber(baseDimensions.dx).setRange(0, Infinity).onChange(updateDimensions);
	const widthUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	widthRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/dx')).setWidth('90px'), width, widthUnitSelect);
	container.add(widthRow);

	// Height with unit select
	const heightRow = new UIRow();
	const height = new UINumber(baseDimensions.dy).setRange(0, Infinity).onChange(updateDimensions);
	const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	heightRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/dy')).setWidth('90px'), height, heightUnitSelect);
	container.add(heightRow);

	// Depth with unit select
	const depthRow = new UIRow();
	const depth = new UINumber(baseDimensions.dz).setRange(0, Infinity).onChange(updateDimensions);
	const depthUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
	depthRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/dz')).setWidth('90px'), depth, depthUnitSelect);
	container.add(depthRow);

	// Alpha
	const alphaRow = new UIRow();
	const alphaI = new UINumber(parameters.alpha).setRange(-90, 90).onChange(update);
	alphaRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/alpha')).setWidth('90px'), alphaI);
	alphaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
	container.add(alphaRow);

	// Theta
	const thetaRow = new UIRow();
	const thetaI = new UINumber(parameters.theta).setRange(-90, 90).onChange(update);
	thetaRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/theta')).setWidth('90px'), thetaI);
	thetaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
	container.add(thetaRow);

	// Phi
	const phiRow = new UIRow();
	const phiI = new UINumber(parameters.phi).setRange(-90, 90).onChange(update);
	phiRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/phi')).setWidth('90px'), phiI);
	phiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
	container.add(phiRow);

	// Function to update dimensions when the default unit changes
	function updateDefaultUnit() {
		isUnitChange = true;
		const selectedUnit = defaultUnitSelect.getValue();

		width.setValue(baseDimensions.dx / unitMultiplier[selectedUnit]);
		height.setValue(baseDimensions.dy / unitMultiplier[selectedUnit]);
		depth.setValue(baseDimensions.dz / unitMultiplier[selectedUnit]);

		widthUnitSelect.setValue(selectedUnit);
		heightUnitSelect.setValue(selectedUnit);
		depthUnitSelect.setValue(selectedUnit);

		isUnitChange = false;
		update();
	}

	// Function to update base dimensions when values change
	function updateDimensions() {
		if (!isUnitChange) {
			const widthUnit = widthUnitSelect.getValue();
			const heightUnit = heightUnitSelect.getValue();
			const depthUnit = depthUnitSelect.getValue();

			baseDimensions.dx = width.getValue() * unitMultiplier[widthUnit];
			baseDimensions.dy = height.getValue() * unitMultiplier[heightUnit];
			baseDimensions.dz = depth.getValue() * unitMultiplier[depthUnit];

			update();
		}
	}

	// Function to handle unit changes for specific dimensions
	function handleUnitChange() {
		isUnitChange = true;
		const selectedWidthUnit = widthUnitSelect.getValue();
		const selectedHeightUnit = heightUnitSelect.getValue();
		const selectedDepthUnit = depthUnitSelect.getValue();

		width.setValue(baseDimensions.dx / unitMultiplier[selectedWidthUnit]);
		height.setValue(baseDimensions.dy / unitMultiplier[selectedHeightUnit]);
		depth.setValue(baseDimensions.dz / unitMultiplier[selectedDepthUnit]);

		isUnitChange = false;
	}

	// Function to update geometry
	function update() {
		const dx = baseDimensions.dx;
		const dy = baseDimensions.dy;
		const dz = baseDimensions.dz;
		const alpha = -alphaI.getValue();
		const theta = -thetaI.getValue();
		const phi = -phiI.getValue();

		editor.execute(new SetGeometryCommand(editor, object, new aParallGeometry(dx, dy, dz, alpha, theta, phi)));
	}

	return container;
}

export { GeometryParametersPanel };
