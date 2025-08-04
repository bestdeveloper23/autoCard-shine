import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTrap4Geometry } from './libs/geometry/Trap4.js';

function GeometryParametersPanel(editor, object) {
  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // Define unit options and multipliers
  const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
  const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
  let baseDimensions = {
    pZ: parameters.pZ,
    pY: parameters.pY,
    pX: parameters.pX,
    pLTX: parameters.pLTX
  };
  let isUnitChange = false; // Prevents unnecessary updates during unit switching

  // Default Unit Selection
  const defaultUnitRow = new UIRow();
  const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
  defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
  container.add(defaultUnitRow);

  // heightZ (dz) with unit select
  const heightRowZ = new UIRow();
  const heightZ = new UINumber(baseDimensions.pZ).setRange(0, Infinity).onChange(updateDimensions);
  const heightZUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  heightRowZ.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dZ')).setWidth('90px'), heightZ, heightZUnitSelect);
  container.add(heightRowZ);

  // depth (dy) with unit select
  const depthRowY = new UIRow();
  const depth = new UINumber(baseDimensions.pY).setRange(0, Infinity).onChange(updateDimensions);
  const depthUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  depthRowY.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dY')).setWidth('90px'), depth, depthUnitSelect);
  container.add(depthRowY);

  // widthX (dx) with unit select
  const widthRowX = new UIRow();
  const widthX = new UINumber(baseDimensions.pX).setRange(0, Infinity).onChange(updateDimensions);
  const widthXUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  widthRowX.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dX')).setWidth('90px'), widthX, widthXUnitSelect);
  container.add(widthRowX);

  // LTX (dx3) with unit select
  const LTXRow = new UIRow();
  const SWidth = new UINumber(baseDimensions.pLTX).setRange(0, Infinity).onChange(updateDimensions);
  const SWidthUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  LTXRow.add(new UIText(strings.getKey('sidebar/geometry/Trapezoid4/dLTX')).setWidth('90px'), SWidth, SWidthUnitSelect);
  container.add(LTXRow);

  // Function to update dimensions when the default unit changes
  function updateDefaultUnit() {
    isUnitChange = true;
    const selectedUnit = defaultUnitSelect.getValue();

    heightZ.setValue(baseDimensions.pZ / unitMultiplier[selectedUnit]);
    depth.setValue(baseDimensions.pY / unitMultiplier[selectedUnit]);
    widthX.setValue(baseDimensions.pX / unitMultiplier[selectedUnit]);
    SWidth.setValue(baseDimensions.pLTX / unitMultiplier[selectedUnit]);

    heightZUnitSelect.setValue(selectedUnit);
    depthUnitSelect.setValue(selectedUnit);
    widthXUnitSelect.setValue(selectedUnit);
    SWidthUnitSelect.setValue(selectedUnit);

    isUnitChange = false;
    update();
  }

  // Function to update base dimensions when values change
  function updateDimensions() {
    if (!isUnitChange) {
      const heightZUnit = heightZUnitSelect.getValue();
      const depthUnit = depthUnitSelect.getValue();
      const widthXUnit = widthXUnitSelect.getValue();
      const SWidthUnit = SWidthUnitSelect.getValue();

      baseDimensions.pZ = heightZ.getValue() * unitMultiplier[heightZUnit];
      baseDimensions.pY = depth.getValue() * unitMultiplier[depthUnit];
      baseDimensions.pX = widthX.getValue() * unitMultiplier[widthXUnit];
      baseDimensions.pLTX = SWidth.getValue() * unitMultiplier[SWidthUnit];

      update();
    }
  }

  // Function to handle unit changes for specific dimensions
  function handleUnitChange() {
    isUnitChange = true;
    const selectedHeightZUnit = heightZUnitSelect.getValue();
    const selectedDepthUnit = depthUnitSelect.getValue();
    const selectedWidthXUnit = widthXUnitSelect.getValue();
    const selectedSWidthUnit = SWidthUnitSelect.getValue();

    heightZ.setValue(baseDimensions.pZ / unitMultiplier[selectedHeightZUnit]);
    depth.setValue(baseDimensions.pY / unitMultiplier[selectedDepthUnit]);
    widthX.setValue(baseDimensions.pX / unitMultiplier[selectedWidthXUnit]);
    SWidth.setValue(baseDimensions.pLTX / unitMultiplier[selectedSWidthUnit]);

    isUnitChange = false;
  }

  // Update function
  function update() {
    const pDz = baseDimensions.pZ;
    const pDY = baseDimensions.pY;
    const pX = baseDimensions.pX;
    const pLTX = baseDimensions.pLTX;
    
    editor.execute(new SetGeometryCommand(editor, object, new aTrap4Geometry(pDz, pDY, pX, pLTX)));
  }

  return container;
}

export { GeometryParametersPanel };