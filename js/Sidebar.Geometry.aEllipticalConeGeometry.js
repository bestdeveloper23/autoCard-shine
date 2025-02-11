import * as THREE from 'three';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aEllipticalConeGeometry } from './libs/geometry/EllipticalCone.js';

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
        height: parameters.height,
        zTopCut: parameters.zTopCut,
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
    xSemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/xSemiAxis')).setWidth('90px'), xSemiAxis, xSemiAxisUnitSelect);
    container.add(xSemiAxisRow);

    // ySemiAxis with unit select
    const ySemiAxisRow = new UIRow();
    const ySemiAxis = new UINumber(baseDimensions.ySemiAxis).setRange(0.1, Infinity).onChange(updateDimensions);
    const ySemiAxisUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    ySemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/ySemiAxis')).setWidth('90px'), ySemiAxis, ySemiAxisUnitSelect);
    container.add(ySemiAxisRow);

    // height with unit select
    const dzRow = new UIRow();
    const dz = new UINumber(baseDimensions.height).setRange(0.1, Infinity).onChange(updateDimensions);
    const dzUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    dzRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/height')).setWidth('90px'), dz, dzUnitSelect);
    container.add(dzRow);

    // zTopCut with unit select
    const zTopCutRow = new UIRow();
    const zTopCut = new UINumber(baseDimensions.zTopCut).onChange(updateDimensions);
    const zTopCutUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    zTopCutRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/topcut')).setWidth('90px'), zTopCut, zTopCutUnitSelect);
    container.add(zTopCutRow);

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = defaultUnitSelect.getValue();

        xSemiAxis.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedUnit]);
        ySemiAxis.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedUnit]);
        dz.setValue(baseDimensions.height / unitMultiplier[selectedUnit]);
        zTopCut.setValue(baseDimensions.zTopCut / unitMultiplier[selectedUnit]);

        xSemiAxisUnitSelect.setValue(selectedUnit);
        ySemiAxisUnitSelect.setValue(selectedUnit);
        dzUnitSelect.setValue(selectedUnit);
        zTopCutUnitSelect.setValue(selectedUnit);

        update();
        isUnitChange = false;
    }

    // Function to update base dimensions and geometry when values change
    function updateDimensions() {
        if (!isUnitChange) {
            const xSemiAxisUnit = xSemiAxisUnitSelect.getValue();
            const ySemiAxisUnit = ySemiAxisUnitSelect.getValue();
            const dzUnit = dzUnitSelect.getValue();
            const zTopCutUnit = zTopCutUnitSelect.getValue();

            baseDimensions.xSemiAxis = xSemiAxis.getValue() * unitMultiplier[xSemiAxisUnit];
            baseDimensions.ySemiAxis = ySemiAxis.getValue() * unitMultiplier[ySemiAxisUnit];
            baseDimensions.height = dz.getValue() * unitMultiplier[dzUnit];
            baseDimensions.zTopCut = zTopCut.getValue() * unitMultiplier[zTopCutUnit];

            update();
        }
    }

    // Function to handle unit changes for specific inputs
    function handleUnitChange() {
        isUnitChange = true;
        const selectedXUnit = xSemiAxisUnitSelect.getValue();
        const selectedYUnit = ySemiAxisUnitSelect.getValue();
        const selectedHeightUnit = dzUnitSelect.getValue();
        const selectedTopCutUnit = zTopCutUnitSelect.getValue();

        xSemiAxis.setValue(baseDimensions.xSemiAxis / unitMultiplier[selectedXUnit]);
        ySemiAxis.setValue(baseDimensions.ySemiAxis / unitMultiplier[selectedYUnit]);
        dz.setValue(baseDimensions.height / unitMultiplier[selectedHeightUnit]);
        zTopCut.setValue(baseDimensions.zTopCut / unitMultiplier[selectedTopCutUnit]);

        isUnitChange = false;
    }

    // Function to update geometry
    function update() {
        const xSemiAxisVal = baseDimensions.xSemiAxis;
        const ySemiAxisVal = baseDimensions.ySemiAxis;
        const heightVal = baseDimensions.height;
        const zTopCutVal = baseDimensions.zTopCut;

        editor.execute(new SetGeometryCommand(editor, object, new aEllipticalConeGeometry(xSemiAxisVal, ySemiAxisVal, zTopCutVal, heightVal)));
    }

    return container;
}

export { GeometryParametersPanel };

//   dzI.setRange(zTopCut + 0.01, Infinity);
//   zTopCutI.setRange(0, height - 0.01);