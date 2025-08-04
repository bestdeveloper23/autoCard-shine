import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTrapeZoidPGeometry } from './libs/geometry/TrapeZoid2P.js';

function GeometryParametersPanel(editor, object) {

  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // Define unit options and multipliers
  const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
  const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
  let baseDimensions = {
    dz: parameters.dz,
    dy1: parameters.dy1,
    dx1: parameters.dx1,
    dx2: parameters.dx2,
    dy2: parameters.dy2,
    dx3: parameters.dx3,
    dx4: parameters.dx4
  };
  let isUnitChange = false;
  const EPSILON = 0.0001;

  // For validation error messages
  const errorMessageDiv = new UIDiv().setClass('error-message');
  
  // Show permanent instruction message
  displayMessage("Valid shapes: dx1 must equal dx2 and dx3 must equal dx4 (both ends rectangular only)", "info");

  // Default Unit Selection
  const defaultUnitRow = new UIRow();
  const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
  defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
  container.add(defaultUnitRow);
  container.add(errorMessageDiv);

  // height with unit select
  const heightRow = new UIRow();
  const height = new UINumber(parameters.dz).onChange(updateDimensions);
  const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dz')).setWidth('90px'), height, heightUnitSelect);
  container.add(heightRow);

  // theta (angle - no unit conversion)
  const thetaRow = new UIRow();
  const thetaI = new UINumber(parameters.theta).setRange(-90, 90).onChange(update);
  thetaRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/theta')).setWidth('90px'));
  thetaRow.add(thetaI);
  thetaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
  container.add(thetaRow);

  // phi (angle - no unit conversion)
  const phiRow = new UIRow();
  const phiI = new UINumber(parameters.phi).setRange(-90, 90).onChange(update);
  phiRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/phi')).setWidth('90px'));
  phiRow.add(phiI);
  phiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
  container.add(phiRow);

  // depth1 with unit select
  const depthRow1 = new UIRow();
  const depth1 = new UINumber(parameters.dy1).onChange(updateDimensions);
  const depth1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  depthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dy1')).setWidth('90px'), depth1, depth1UnitSelect);
  container.add(depthRow1);

  // width1 with unit select
  const widthRow1 = new UIRow();
  const width1 = new UINumber(parameters.dx1).onChange(() => {
    enforceRectangularConstraint('dx1');
    updateDimensions();
  });
  const width1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  widthRow1.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx1')).setWidth('90px'), width1, width1UnitSelect);
  container.add(widthRow1);

  // width2 with unit select
  const widthRow2 = new UIRow();
  const width2 = new UINumber(parameters.dx2).onChange(() => {
    enforceRectangularConstraint('dx2');
    updateDimensions();
  });
  const width2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  widthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx2')).setWidth('90px'), width2, width2UnitSelect);
  container.add(widthRow2);

  // alpha1 (angle - no unit conversion)
  const alphaRow = new UIRow();
  const alphaI = new UINumber(parameters.alpha1).setRange(-90, 90).onChange(update);
  alphaRow.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/alpha1')).setWidth('90px'));
  alphaRow.add(alphaI);
  alphaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
  container.add(alphaRow);

  // depth2 with unit select
  const depthRow2 = new UIRow();
  const depth2 = new UINumber(parameters.dy2).onChange(updateDimensions);
  const depth2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  depthRow2.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dy2')).setWidth('90px'), depth2, depth2UnitSelect);
  container.add(depthRow2);

  //width3 with unit select
  const widthRow3 = new UIRow();
  const width3 = new UINumber(parameters.dx3).onChange(() => {
    enforceRectangularConstraint('dx3');
    updateDimensions();
  });
  const width3UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  widthRow3.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx3')).setWidth('90px'), width3, width3UnitSelect);
  container.add(widthRow3);

  // width4 with unit select
  const widthRow4 = new UIRow();
  const width4 = new UINumber(parameters.dx4).onChange(() => {
    enforceRectangularConstraint('dx4');
    updateDimensions();
  });
  const width4UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  widthRow4.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/dx4')).setWidth('90px'), width4, width4UnitSelect);
  container.add(widthRow4);

  // alpha2 (angle - no unit conversion)
  const alpha2Row = new UIRow();
  const alpha2 = new UINumber(parameters.alpha2).setRange(-90, 90).onChange(update);
  alpha2Row.add(new UIText(strings.getKey('sidebar/geometry/atrapezoidp_geometry/alpha2')).setWidth('90px'));
  alpha2Row.add(alpha2);
  alpha2Row.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
  container.add(alpha2Row);

  // Function to update dimensions when the default unit changes
  function updateDefaultUnit() {
    isUnitChange = true;
    const selectedUnit = defaultUnitSelect.getValue();

    height.setValue(baseDimensions.dz / unitMultiplier[selectedUnit]);
    depth1.setValue(baseDimensions.dy1 / unitMultiplier[selectedUnit]);
    width1.setValue(baseDimensions.dx1 / unitMultiplier[selectedUnit]);
    width2.setValue(baseDimensions.dx2 / unitMultiplier[selectedUnit]);
    depth2.setValue(baseDimensions.dy2 / unitMultiplier[selectedUnit]);
    width3.setValue(baseDimensions.dx3 / unitMultiplier[selectedUnit]);
    width4.setValue(baseDimensions.dx4 / unitMultiplier[selectedUnit]);

    heightUnitSelect.setValue(selectedUnit);
    depth1UnitSelect.setValue(selectedUnit);
    width1UnitSelect.setValue(selectedUnit);
    width2UnitSelect.setValue(selectedUnit);
    depth2UnitSelect.setValue(selectedUnit);
    width3UnitSelect.setValue(selectedUnit);
    width4UnitSelect.setValue(selectedUnit);

    isUnitChange = false;
    update();
  }

  // Function to update base dimensions when values change
  function updateDimensions() {
    if (!isUnitChange) {
      const heightUnit = heightUnitSelect.getValue();
      const depth1Unit = depth1UnitSelect.getValue();
      const width1Unit = width1UnitSelect.getValue();
      const width2Unit = width2UnitSelect.getValue();
      const depth2Unit = depth2UnitSelect.getValue();
      const width3Unit = width3UnitSelect.getValue();
      const width4Unit = width4UnitSelect.getValue();

      baseDimensions.dz = height.getValue() * unitMultiplier[heightUnit];
      baseDimensions.dy1 = depth1.getValue() * unitMultiplier[depth1Unit];
      baseDimensions.dx1 = width1.getValue() * unitMultiplier[width1Unit];
      baseDimensions.dx2 = width2.getValue() * unitMultiplier[width2Unit];
      baseDimensions.dy2 = depth2.getValue() * unitMultiplier[depth2Unit];
      baseDimensions.dx3 = width3.getValue() * unitMultiplier[width3Unit];
      baseDimensions.dx4 = width4.getValue() * unitMultiplier[width4Unit];

      update();
    }
  }

  // Function to handle unit changes for specific dimensions
  function handleUnitChange() {
    isUnitChange = true;
    const selectedHeightUnit = heightUnitSelect.getValue();
    const selectedDepth1Unit = depth1UnitSelect.getValue();
    const selectedWidth1Unit = width1UnitSelect.getValue();
    const selectedWidth2Unit = width2UnitSelect.getValue();
    const selectedDepth2Unit = depth2UnitSelect.getValue();
    const selectedWidth3Unit = width3UnitSelect.getValue();
    const selectedWidth4Unit = width4UnitSelect.getValue();

    height.setValue(baseDimensions.dz / unitMultiplier[selectedHeightUnit]);
    depth1.setValue(baseDimensions.dy1 / unitMultiplier[selectedDepth1Unit]);
    width1.setValue(baseDimensions.dx1 / unitMultiplier[selectedWidth1Unit]);
    width2.setValue(baseDimensions.dx2 / unitMultiplier[selectedWidth2Unit]);
    depth2.setValue(baseDimensions.dy2 / unitMultiplier[selectedDepth2Unit]);
    width3.setValue(baseDimensions.dx3 / unitMultiplier[selectedWidth3Unit]);
    width4.setValue(baseDimensions.dx4 / unitMultiplier[selectedWidth4Unit]);

    isUnitChange = false;
  }

  // Function to enforce rectangular constraint (dx1=dx2, dx3=dx4)
  function enforceRectangularConstraint(changedParam, targetParam) {
    if (changedParam === 'dx1') {
      const dx1Value = width1.getValue();
      width2.setValue(dx1Value);
      baseDimensions.dx1 = dx1Value * unitMultiplier[width1UnitSelect.getValue()];
      baseDimensions.dx2 = dx1Value * unitMultiplier[width2UnitSelect.getValue()];
    } else if (changedParam === 'dx2') {
      const dx2Value = width2.getValue();
      width1.setValue(dx2Value);
      baseDimensions.dx1 = dx2Value * unitMultiplier[width1UnitSelect.getValue()];
      baseDimensions.dx2 = dx2Value * unitMultiplier[width2UnitSelect.getValue()];
    } else if (changedParam === 'dx3') {
      const dx3Value = width3.getValue();
      width4.setValue(dx3Value);
      baseDimensions.dx3 = dx3Value * unitMultiplier[width3UnitSelect.getValue()];
      baseDimensions.dx4 = dx3Value * unitMultiplier[width4UnitSelect.getValue()];
    } else if (changedParam === 'dx4') {
      const dx4Value = width4.getValue();
      width3.setValue(dx4Value);
      baseDimensions.dx3 = dx4Value * unitMultiplier[width3UnitSelect.getValue()];
      baseDimensions.dx4 = dx4Value * unitMultiplier[width4UnitSelect.getValue()];
    }
  }

  function handleGeometryValidation() {
    return { valid: true };
  }

  function displayMessage(text, type) {
    errorMessageDiv.dom.textContent = text;
    errorMessageDiv.dom.className = `error-message message-${type}`;
    errorMessageDiv.dom.style.display = 'block';
  }

  function update() {
    // Get all parameters in the correct order for the constructor
    const pDz = baseDimensions.dz;
    const pTheta = thetaI.getValue();
    const pPhi = phiI.getValue();
    const pDy1 = baseDimensions.dy1;
    const pDx1 = baseDimensions.dx1;
    const pDx2 = baseDimensions.dx2;
    const pAlpha = alphaI.getValue();
    const pDy2 = baseDimensions.dy2;
    const pDx3 = baseDimensions.dx3;
    const pDx4 = baseDimensions.dx4;
    const pAlpha2 = alpha2.getValue();

    editor.execute(new SetGeometryCommand(editor, object, new aTrapeZoidPGeometry(pDz, pTheta, pPhi, pDy1, pDx1, pDx2, pAlpha, pDy2, pDx3, pDx4, pAlpha2)));
  }

  return container;
}

export { GeometryParametersPanel };