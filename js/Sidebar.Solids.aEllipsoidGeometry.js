import * as THREE from 'three';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aEllipsoidGeometry } from './libs/geometry/Ellipsoid.js';

function GeometryParametersPanel(editor, object) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

    // Define unit options
    const unitOptions = { cm: 'cm', inch: 'inch', mm: 'mm' };
    const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 }; // Conversion factors relative to cm
    let baseDimensions = {
        xSemiAxis: parameters.xSemiAxis,
        ySemiAxis: parameters.ySemiAxis,
        zSemiAxis: parameters.zSemiAxis,
        zTopCut: parameters.zTopCut,
        zBottomCut: parameters.zBottomCut,
    };
    let isUnitChange = false;

    // Default Unit Selection
    const defaultUnitRow = new UIRow();
    const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
    container.add(defaultUnitRow);

    // xSemiAxis with unit select
    const xSemiAxisRow = new UIRow();
    const xSemiAxis = new UINumber(baseDimensions.xSemiAxis).setRange(0.1, Infinity).onChange(updateDimensions);
    const xSemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    xSemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aellipsoid_geometry/xSemiAxis')).setWidth('90px'), xSemiAxis, xSemiAxisUnitSelect);
    container.add(xSemiAxisRow);

    // ySemiAxis with unit select
    const ySemiAxisRow = new UIRow();
    const ySemiAxis = new UINumber(baseDimensions.ySemiAxis).setRange(0.1, Infinity).onChange(updateDimensions);
    const ySemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    ySemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aellipsoid_geometry/ySemiAxis')).setWidth('90px'), ySemiAxis, ySemiAxisUnitSelect);
    container.add(ySemiAxisRow);

    // zSemiAxis with unit select
    const zSemiAxisRow = new UIRow();
    const zSemiAxis = new UINumber(baseDimensions.zSemiAxis).setRange(0.1, Infinity).onChange(updateDimensions);
    const zSemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    zSemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aellipsoid_geometry/zSemiAxis')).setWidth('90px'), zSemiAxis, zSemiAxisUnitSelect);
    container.add(zSemiAxisRow);

    // zTopCut with unit select
    const zTopCutRow = new UIRow();
    const zTopCut = new UINumber(baseDimensions.zTopCut).setRange(0,Infinity).onChange(updateDimensions);
    const zTopCutUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    zTopCutRow.add(new UIText(strings.getKey('sidebar/geometry/aellipsoid_geometry/ztopcut')).setWidth('90px'), zTopCut, zTopCutUnitSelect);
    container.add(zTopCutRow);

    // zBottomCut with unit select
    const zBottomCutRow = new UIRow();
    const zBottomCut = new UINumber(baseDimensions.zBottomCut).setRange(0,Infinity).onChange(updateDimensions);
    const zBottomCutUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    zBottomCutRow.add(new UIText(strings.getKey('sidebar/geometry/aellipsoid_geometry/zbottomcut')).setWidth('90px'), zBottomCut, zBottomCutUnitSelect);
    container.add(zBottomCutRow);

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = defaultUnitSelect.getValue();
        xSemiAxis.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedUnit]);
        ySemiAxis.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedUnit]);
        zSemiAxis.setValue(baseDimensions.zSemiAxis / unitMultiplier[selectedUnit]);
        zTopCut.setValue(baseDimensions.zTopCut / unitMultiplier[selectedUnit]);
        zBottomCut.setValue(baseDimensions.zBottomCut / unitMultiplier[selectedUnit]);
        xSemiAxisUnitSelect.setValue(selectedUnit);
        ySemiAxisUnitSelect.setValue(selectedUnit);
        zSemiAxisUnitSelect.setValue(selectedUnit);
        zTopCutUnitSelect.setValue(selectedUnit);
        zBottomCutUnitSelect.setValue(selectedUnit);
        update();
        isUnitChange = false;
    }

	// Function to update base dimensions and geometry when values change
	function updateDimensions() {
		if (!isUnitChange) {
			const xSemiAxisUnit = xSemiAxisUnitSelect.getValue();
			const ySemiAxisUnit = ySemiAxisUnitSelect.getValue();
			const zSemiAxisUnit = zSemiAxisUnitSelect.getValue();
			const zTopCutUnit = zTopCutUnitSelect.getValue();
			const zBottomCutUnit = zBottomCutUnitSelect.getValue();

			baseDimensions.xSemiAxis = xSemiAxis.getValue() * unitMultiplier[xSemiAxisUnit];
			baseDimensions.ySemiAxis = ySemiAxis.getValue() * unitMultiplier[ySemiAxisUnit];
			baseDimensions.zSemiAxis = zSemiAxis.getValue() * unitMultiplier[zSemiAxisUnit];
			baseDimensions.zTopCut = zTopCut.getValue() * unitMultiplier[zTopCutUnit];
			baseDimensions.zBottomCut = zBottomCut.getValue() * unitMultiplier[zBottomCutUnit];

			// Validate and adjust zTopCut and zBottomCut
			const maxCutLimit = baseDimensions.zSemiAxis * 2 - 0.1;
			if (baseDimensions.zTopCut + baseDimensions.zBottomCut >= maxCutLimit) {
				baseDimensions.zTopCut = Math.min(baseDimensions.zTopCut, maxCutLimit - baseDimensions.zBottomCut, maxCutLimit);
				baseDimensions.zBottomCut = Math.min(baseDimensions.zBottomCut, maxCutLimit - baseDimensions.zTopCut, maxCutLimit);
			}

			// Update UI values after adjustment
			zTopCut.setValue(baseDimensions.zTopCut / unitMultiplier[zTopCutUnit]);
			zBottomCut.setValue(baseDimensions.zBottomCut / unitMultiplier[zBottomCutUnit]);

			update();
		}
	}

    // Function to handle unit changes for specific dimensions
    function handleUnitChange() {
        isUnitChange = true;
        const selectedXUnit = xSemiAxisUnitSelect.getValue();
        const selectedYUnit = ySemiAxisUnitSelect.getValue();
        const selectedZUnit = zSemiAxisUnitSelect.getValue();
        const selectedTopCutUnit = zTopCutUnitSelect.getValue();
        const selectedBottomCutUnit = zBottomCutUnitSelect.getValue();

        xSemiAxis.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedXUnit]);
        ySemiAxis.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedYUnit]);
        zSemiAxis.setValue(baseDimensions.zSemiAxis / unitMultiplier[selectedZUnit]);
        zTopCut.setValue(baseDimensions.zTopCut / unitMultiplier[selectedTopCutUnit]);
        zBottomCut.setValue(baseDimensions.zBottomCut / unitMultiplier[selectedBottomCutUnit]);
        isUnitChange = false;
    }

    // Function to update geometry
    function update() {
        const xSemiAxisVal = baseDimensions.xSemiAxis;
        const ySemiAxisVal = baseDimensions.ySemiAxis;
        const zSemiAxisVal = baseDimensions.zSemiAxis;
        const zTopCutVal = baseDimensions.zTopCut;
        const zBottomCutVal = baseDimensions.zBottomCut;

        editor.execute(new SetGeometryCommand(editor, object, new aEllipsoidGeometry(xSemiAxisVal, ySemiAxisVal, zSemiAxisVal, zTopCutVal, zBottomCutVal)));
    }

    return container;
}

export { GeometryParametersPanel };


// dzBottomCutI.setRange(0, zSemiAxis * 2 - zTopCut - 0.1); 
// dzTopCutI.setRange(0, zSemiAxis * 2 - zBottomCut-0.1);  