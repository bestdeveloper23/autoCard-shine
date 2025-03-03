import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger, UISelect } from './libs/ui.js';
import tippy from 'tippy.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTrapeZoidGeometry } from './libs/geometry/TrapeZoid.js';

function GeometryParametersPanel(editor, object) {

  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // Define unit options
  const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
  const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
  let baseDimensions = {
    dx1: parameters.dx1,
    dy1: parameters.dy1,
    dz: parameters.dz,
    dx2: parameters.dx2,
    dy2: parameters.dy2,
  };
  let isUnitChange = false; // Prevents unnecessary updates during unit switching

  // Default Unit Selection
  const defaultUnitRow = new UIRow();
  const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
  defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
  // container.add(defaultUnitRow);

  // Grid space
  const gridSpace = new UIText(strings.getKey('sidebar/geometry/grid_Space')).setClass('grid_Space');
  defaultUnitRow.add(gridSpace);
  container.add(defaultUnitRow);
      
  tippy(gridSpace.dom, { 
      content: 'The grid is 10x10, with each square and the space between lines measuring 1 cm.',
      placement: 'top', 
  });

  // width1 with unit select
  const widthRow1 = new UIRow();
  const width1 = new UINumber(baseDimensions.dx1).setRange(0.001, Infinity).onChange(updateDimensions);
  const width1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  widthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx1')).setWidth('90px'), width1, width1UnitSelect);
  container.add(widthRow1);

  // width2 with unit select
  const widthRow2 = new UIRow();
  const width2 = new UINumber(baseDimensions.dx2).setRange(0.001, Infinity).onChange(updateDimensions);
  const width2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dx2')).setWidth('90px'), width2, width2UnitSelect);
  container.add(widthRow2);

  // depth1 with unit select
  const depthRow1 = new UIRow();
  const depth1 = new UINumber(baseDimensions.dy1).setRange(0.001, Infinity).onChange(updateDimensions);
  const depth1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy1')).setWidth('90px'), depth1, depth1UnitSelect);
  container.add(depthRow1);

  // depth2 with unit select
  const depthRow2 = new UIRow();
  const depth2 = new UINumber(baseDimensions.dy2).setRange(0.001, Infinity).onChange(updateDimensions);
  const depth2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  depthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dy2')).setWidth('90px'), depth2, depth2UnitSelect);
  container.add(depthRow2);

  // height with unit select
  const heightRow = new UIRow();
  const height = new UINumber(baseDimensions.dz).setRange(0.001, Infinity).onChange(updateDimensions);
  const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoid_geometry/dz')).setWidth('90px'), height, heightUnitSelect);
  container.add(heightRow);

  // Function to update dimensions when the default unit changes
  function updateDefaultUnit() {
    isUnitChange = true;
    const selectedUnit = defaultUnitSelect.getValue();

    width1.setValue(baseDimensions.dx1 / unitMultiplier[selectedUnit]);
    depth1.setValue(baseDimensions.dy1 / unitMultiplier[selectedUnit]);
    width2.setValue(baseDimensions.dx2 / unitMultiplier[selectedUnit]);
    depth2.setValue(baseDimensions.dy2 / unitMultiplier[selectedUnit]);
    height.setValue(baseDimensions.dz / unitMultiplier[selectedUnit]);

    width1UnitSelect.setValue(selectedUnit);
    depth1UnitSelect.setValue(selectedUnit);
    width2UnitSelect.setValue(selectedUnit);
    depth2UnitSelect.setValue(selectedUnit);
    heightUnitSelect.setValue(selectedUnit);

    isUnitChange = false;
    update();
  }

  // Function to update base dimensions when values change
  function updateDimensions() {
    if (!isUnitChange) {
      const width1Unit = width1UnitSelect.getValue();
      const depth1Unit = depth1UnitSelect.getValue();
      const width2Unit = width2UnitSelect.getValue();
      const depth2Unit = depth2UnitSelect.getValue();
      const heightUnit = heightUnitSelect.getValue();

      baseDimensions.dx1 = width1.getValue() * unitMultiplier[width1Unit];
      baseDimensions.dy1 = depth1.getValue() * unitMultiplier[depth1Unit];
      baseDimensions.dx2 = width2.getValue() * unitMultiplier[width2Unit];
      baseDimensions.dy2 = depth2.getValue() * unitMultiplier[depth2Unit];
      baseDimensions.dz = height.getValue() * unitMultiplier[heightUnit];

      update();
    }
  }

  // Function to handle unit changes for specific dimensions
  function handleUnitChange() {
    isUnitChange = true;
    const selectedWidth1Unit = width1UnitSelect.getValue();
    const selectedDepth1Unit = depth1UnitSelect.getValue();
    const selectedWidth2Unit = width2UnitSelect.getValue();
    const selectedDepth2Unit = depth2UnitSelect.getValue();
    const selectedHeightUnit = heightUnitSelect.getValue();

    width1.setValue(baseDimensions.dx1 / unitMultiplier[selectedWidth1Unit]);
    depth1.setValue(baseDimensions.dy1 / unitMultiplier[selectedDepth1Unit]);
    width2.setValue(baseDimensions.dx2 / unitMultiplier[selectedWidth2Unit]);
    depth2.setValue(baseDimensions.dy2 / unitMultiplier[selectedDepth2Unit]);
    height.setValue(baseDimensions.dz / unitMultiplier[selectedHeightUnit]);

    isUnitChange = false;
  }

  // Function to update geometry
  function update() {
    const dx1 = baseDimensions.dx1;
    const dy1 = baseDimensions.dy1;
    const dz = baseDimensions.dz;
    const dx2 = baseDimensions.dx2;
    const dy2 = baseDimensions.dy2;

    editor.execute(new SetGeometryCommand(editor, object, new aTrapeZoidGeometry(dx1, dy1, dz, dx2, dy2)));
  }

  return container;
}

export { GeometryParametersPanel };
