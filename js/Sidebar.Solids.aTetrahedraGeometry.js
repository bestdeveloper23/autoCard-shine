import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger, UISelect } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';
import { aTetrahedraGeometry } from './libs/geometry/Tetrahedra.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // Define unit options and multipliers
    const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
    const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
    let baseDimensions = {
        anchor: [...parameters.anchor],
        p2: [...parameters.p2],
        p3: [...parameters.p3],
        p4: [...parameters.p4]
    };
    let isUnitChange = false; // Prevents unnecessary updates during unit switching

    // Default Unit Selection
    const defaultUnitRow = new UIRow();
    const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
    container.add(defaultUnitRow);

    // anchor
    const anchorRow = new UIRow();
    anchorRow.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/anchor')).setWidth('90px'));
    const anchorX = new UINumber(parameters.anchor[0]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const anchorY = new UINumber(parameters.anchor[1]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const anchorZ = new UINumber(parameters.anchor[2]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const anchorUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);

    anchorRow.add(anchorX);
    anchorRow.add(anchorY);
    anchorRow.add(anchorZ);
    anchorRow.add(anchorUnitSelect);

    container.add(anchorRow);

    // point2
    const point2Row = new UIRow();
    point2Row.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/point2')).setWidth('90px'));
    const point2X = new UINumber(parameters.p2[0]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point2Y = new UINumber(parameters.p2[1]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point2Z = new UINumber(parameters.p2[2]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);

    point2Row.add(point2X);
    point2Row.add(point2Y);
    point2Row.add(point2Z);
    point2Row.add(point2UnitSelect);

    container.add(point2Row);

    // point3
    const point3Row = new UIRow();
    point3Row.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/point3')).setWidth('90px'));
    const point3X = new UINumber(parameters.p3[0]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point3Y = new UINumber(parameters.p3[1]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point3Z = new UINumber(parameters.p3[2]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point3UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);

    point3Row.add(point3X);
    point3Row.add(point3Y);
    point3Row.add(point3Z);
    point3Row.add(point3UnitSelect);

    container.add(point3Row);

    // point4
    const point4Row = new UIRow();
    point4Row.add(new UIText(strings.getKey('sidebar/geometry/atetrahedra_geometry/point4')).setWidth('90px'));
    const point4X = new UINumber(parameters.p4[0]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point4Y = new UINumber(parameters.p4[1]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point4Z = new UINumber(parameters.p4[2]).setPrecision(5).setWidth('50px').onChange(updateDimensions);
    const point4UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);

    point4Row.add(point4X);
    point4Row.add(point4Y);
    point4Row.add(point4Z);
    point4Row.add(point4UnitSelect);

    container.add(point4Row);

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = defaultUnitSelect.getValue();

        anchorX.setValue(baseDimensions.anchor[0] / unitMultiplier[selectedUnit]);
        anchorY.setValue(baseDimensions.anchor[1] / unitMultiplier[selectedUnit]);
        anchorZ.setValue(baseDimensions.anchor[2] / unitMultiplier[selectedUnit]);

        point2X.setValue(baseDimensions.p2[0] / unitMultiplier[selectedUnit]);
        point2Y.setValue(baseDimensions.p2[1] / unitMultiplier[selectedUnit]);
        point2Z.setValue(baseDimensions.p2[2] / unitMultiplier[selectedUnit]);

        point3X.setValue(baseDimensions.p3[0] / unitMultiplier[selectedUnit]);
        point3Y.setValue(baseDimensions.p3[1] / unitMultiplier[selectedUnit]);
        point3Z.setValue(baseDimensions.p3[2] / unitMultiplier[selectedUnit]);

        point4X.setValue(baseDimensions.p4[0] / unitMultiplier[selectedUnit]);
        point4Y.setValue(baseDimensions.p4[1] / unitMultiplier[selectedUnit]);
        point4Z.setValue(baseDimensions.p4[2] / unitMultiplier[selectedUnit]);

        anchorUnitSelect.setValue(selectedUnit);
        point2UnitSelect.setValue(selectedUnit);
        point3UnitSelect.setValue(selectedUnit);
        point4UnitSelect.setValue(selectedUnit);

        isUnitChange = false;
        update();
    }

    // Function to update base dimensions when values change
    function updateDimensions() {
        if (!isUnitChange) {
            const anchorUnit = anchorUnitSelect.getValue();
            const point2Unit = point2UnitSelect.getValue();
            const point3Unit = point3UnitSelect.getValue();
            const point4Unit = point4UnitSelect.getValue();

            baseDimensions.anchor = [
                anchorX.getValue() * unitMultiplier[anchorUnit],
                anchorY.getValue() * unitMultiplier[anchorUnit],
                anchorZ.getValue() * unitMultiplier[anchorUnit]
            ];

            baseDimensions.p2 = [
                point2X.getValue() * unitMultiplier[point2Unit],
                point2Y.getValue() * unitMultiplier[point2Unit],
                point2Z.getValue() * unitMultiplier[point2Unit]
            ];

            baseDimensions.p3 = [
                point3X.getValue() * unitMultiplier[point3Unit],
                point3Y.getValue() * unitMultiplier[point3Unit],
                point3Z.getValue() * unitMultiplier[point3Unit]
            ];

            baseDimensions.p4 = [
                point4X.getValue() * unitMultiplier[point4Unit],
                point4Y.getValue() * unitMultiplier[point4Unit],
                point4Z.getValue() * unitMultiplier[point4Unit]
            ];

            update();
        }
    }

    // Function to handle unit changes for specific dimensions
    function handleUnitChange() {
        isUnitChange = true;
        const selectedAnchorUnit = anchorUnitSelect.getValue();
        const selectedPoint2Unit = point2UnitSelect.getValue();
        const selectedPoint3Unit = point3UnitSelect.getValue();
        const selectedPoint4Unit = point4UnitSelect.getValue();

        anchorX.setValue(baseDimensions.anchor[0] / unitMultiplier[selectedAnchorUnit]);
        anchorY.setValue(baseDimensions.anchor[1] / unitMultiplier[selectedAnchorUnit]);
        anchorZ.setValue(baseDimensions.anchor[2] / unitMultiplier[selectedAnchorUnit]);

        point2X.setValue(baseDimensions.p2[0] / unitMultiplier[selectedPoint2Unit]);
        point2Y.setValue(baseDimensions.p2[1] / unitMultiplier[selectedPoint2Unit]);
        point2Z.setValue(baseDimensions.p2[2] / unitMultiplier[selectedPoint2Unit]);

        point3X.setValue(baseDimensions.p3[0] / unitMultiplier[selectedPoint3Unit]);
        point3Y.setValue(baseDimensions.p3[1] / unitMultiplier[selectedPoint3Unit]);
        point3Z.setValue(baseDimensions.p3[2] / unitMultiplier[selectedPoint3Unit]);

        point4X.setValue(baseDimensions.p4[0] / unitMultiplier[selectedPoint4Unit]);
        point4Y.setValue(baseDimensions.p4[1] / unitMultiplier[selectedPoint4Unit]);
        point4Z.setValue(baseDimensions.p4[2] / unitMultiplier[selectedPoint4Unit]);

        isUnitChange = false;
    }

    function update() {
        // we need to new each geometry module
        const anchor = [...baseDimensions.anchor];
        const p2 = [...baseDimensions.p2];
        const p3 = [...baseDimensions.p3];
        const p4 = [...baseDimensions.p4];

        editor.execute(new SetGeometryCommand(editor, object, new aTetrahedraGeometry(anchor, p2, p3, p4)));
    }

    return container;

}

export { GeometryParametersPanel };