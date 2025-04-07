import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTwistedTrdGeometry } from './libs/geometry/TrapeZoid3.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();
    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // Unit system
    const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
    const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 };
    let isUnitChange = false;

    // Base values in cm
    let baseDimensions = {
        dx1: parameters.dx1,
        dx2: parameters.dx2,
        dy1: parameters.dy1,
        dy2: parameters.dy2,
        dz: parameters.dz
    };

    // Default Unit Selection
    const defaultUnitRow = new UIRow();
    const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
    container.add(defaultUnitRow);

    // dx1
    const widthRow1 = new UIRow();
    const width1 = new UINumber(baseDimensions.dx1).setRange(0.001, Infinity).onChange(updateDimensions);
    const width1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    widthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx1')).setWidth('90px'), width1, width1UnitSelect);
    container.add(widthRow1);

    // dx2
    const widthRow2 = new UIRow();
    const width2 = new UINumber(baseDimensions.dx2).setRange(0.001, Infinity).onChange(updateDimensions);
    const width2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx2')).setWidth('90px'), width2, width2UnitSelect);
    container.add(widthRow2);

    // dy1
    const depthRow1 = new UIRow();
    const depth1 = new UINumber(baseDimensions.dy1).setRange(0.001, Infinity).onChange(updateDimensions);
    const depth1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy1')).setWidth('90px'), depth1, depth1UnitSelect);
    container.add(depthRow1);

    // dy2
    const depthRow2 = new UIRow();
    const depth2 = new UINumber(baseDimensions.dy2).setRange(0.001, Infinity).onChange(updateDimensions);
    const depth2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    depthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy2')).setWidth('90px'), depth2, depth2UnitSelect);
    container.add(depthRow2);

    // dz (height)
    const heightRow = new UIRow();
    const height = new UINumber(baseDimensions.dz).setRange(0.001, Infinity).onChange(updateDimensions);
    const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    heightRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dz')).setWidth('90px'), height, heightUnitSelect);
    container.add(heightRow);

    // twistedangle (no unit needed)
    const twistedAngleRow = new UIRow();
    const angleI = new UINumber(parameters.twistedangle).setRange(0, Infinity).onChange(update);
    twistedAngleRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/twistedangle')).setWidth('90px'), angleI);
    twistedAngleRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(twistedAngleRow);

    function updateDefaultUnit() {
        isUnitChange = true;
        const unit = defaultUnitSelect.getValue();

        width1.setValue(baseDimensions.dx1 / unitMultiplier[unit]);
        width2.setValue(baseDimensions.dx2 / unitMultiplier[unit]);
        depth1.setValue(baseDimensions.dy1 / unitMultiplier[unit]);
        depth2.setValue(baseDimensions.dy2 / unitMultiplier[unit]);
        height.setValue(baseDimensions.dz / unitMultiplier[unit]);

        width1UnitSelect.setValue(unit);
        width2UnitSelect.setValue(unit);
        depth1UnitSelect.setValue(unit);
        depth2UnitSelect.setValue(unit);
        heightUnitSelect.setValue(unit);

        isUnitChange = false;
        update();
    }

    function handleUnitChange() {
        isUnitChange = true;

        const w1u = width1UnitSelect.getValue();
        const w2u = width2UnitSelect.getValue();
        const d1u = depth1UnitSelect.getValue();
        const d2u = depth2UnitSelect.getValue();
        const hUnit = heightUnitSelect.getValue();

        width1.setValue(baseDimensions.dx1 / unitMultiplier[w1u]);
        width2.setValue(baseDimensions.dx2 / unitMultiplier[w2u]);
        depth1.setValue(baseDimensions.dy1 / unitMultiplier[d1u]);
        depth2.setValue(baseDimensions.dy2 / unitMultiplier[d2u]);
        height.setValue(baseDimensions.dz / unitMultiplier[hUnit]);

        isUnitChange = false;
    }

    function updateDimensions() {
        if (!isUnitChange) {
            const w1u = width1UnitSelect.getValue();
            const w2u = width2UnitSelect.getValue();
            const d1u = depth1UnitSelect.getValue();
            const d2u = depth2UnitSelect.getValue();
            const hUnit = heightUnitSelect.getValue();

            baseDimensions.dx1 = width1.getValue() * unitMultiplier[w1u];
            baseDimensions.dx2 = width2.getValue() * unitMultiplier[w2u];
            baseDimensions.dy1 = depth1.getValue() * unitMultiplier[d1u];
            baseDimensions.dy2 = depth2.getValue() * unitMultiplier[d2u];
            baseDimensions.dz = height.getValue() * unitMultiplier[hUnit];

            update();
        }
    }

    function update() {
        const dx1 = baseDimensions.dx1;
        const dx2 = baseDimensions.dx2;
        const dy1 = baseDimensions.dy1;
        const dy2 = baseDimensions.dy2;
        const dz = baseDimensions.dz;
        const twistedangle = angleI.getValue();

        editor.execute(new SetGeometryCommand(editor, object, new aTwistedTrdGeometry(dx1, dy1, dz, dx2, dy2, twistedangle)));
    }

    return container;
}

export { GeometryParametersPanel };
