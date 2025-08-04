import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTwistedTubeGeometry } from './libs/geometry/TwistedTube.js';

function GeometryParametersPanel(editor, object) {

  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // Define unit options and multipliers
  const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
  const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
  let baseDimensions = {
    pRMax: parameters.pRMax,
    pRMin: parameters.pRMin,
    pDz: parameters.pDz
  };
  let isUnitChange = false; // Prevents unnecessary updates during unit switching

  // Default Unit Selection
  const defaultUnitRow = new UIRow();
  const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
  defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
  container.add(defaultUnitRow);

  // maxRadius with unit select
  const maxRadiusRow = new UIRow();
  const maxRadius = new UINumber(parameters.pRMax).onChange(updateDimensions);
  const maxRadiusUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/maxradius')).setWidth('90px'), maxRadius, maxRadiusUnitSelect);
  container.add(maxRadiusRow);

  // minRadius with unit select
  const minRadiusRow = new UIRow();
  const minRadius = new UINumber(parameters.pRMin).onChange(updateDimensions);
  const minRadiusUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/minradius')).setWidth('90px'), minRadius, minRadiusUnitSelect);
  container.add(minRadiusRow);

  // height with unit select
  const heightRow = new UIRow();
  const height = new UINumber(parameters.pDz).onChange(updateDimensions);
  const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'), height, heightUnitSelect);
  container.add(heightRow);

  const pSPhiRow = new UIRow();
  const pSPhi = new UINumber(parameters.pSPhi).onChange(update);
  pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
  pSPhiRow.add(pSPhi);
  pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
  // container.add(pSPhiRow);

  const pDPhiRow = new UIRow();
  const pDPhi = new UINumber(parameters.pDPhi).setRange(0, Infinity).onChange(update);
  pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
  pDPhiRow.add(pDPhi);
  pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
  container.add(pDPhiRow);

  const twistedangleRow = new UIRow();
  const twistedangleI = new UINumber(parameters.twistedangle).setRange(0, 180).onChange(update);
  twistedangleRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/twistedangle')).setWidth('90px'));
  twistedangleRow.add(twistedangleI);
  twistedangleRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
  container.add(twistedangleRow);

  // Function to update dimensions when the default unit changes
  function updateDefaultUnit() {
    isUnitChange = true;
    const selectedUnit = defaultUnitSelect.getValue();

    maxRadius.setValue(baseDimensions.pRMax / unitMultiplier[selectedUnit]);
    minRadius.setValue(baseDimensions.pRMin / unitMultiplier[selectedUnit]);
    height.setValue(baseDimensions.pDz / unitMultiplier[selectedUnit]);

    maxRadiusUnitSelect.setValue(selectedUnit);
    minRadiusUnitSelect.setValue(selectedUnit);
    heightUnitSelect.setValue(selectedUnit);

    isUnitChange = false;
    update();
  }

  // Function to update base dimensions when values change
  function updateDimensions() {
    if (!isUnitChange) {
      const maxRadiusUnit = maxRadiusUnitSelect.getValue();
      const minRadiusUnit = minRadiusUnitSelect.getValue();
      const heightUnit = heightUnitSelect.getValue();

      // Update base dimensions with validation
      const newMaxRadius = maxRadius.getValue() * unitMultiplier[maxRadiusUnit];
      const newMinRadius = minRadius.getValue() * unitMultiplier[minRadiusUnit];
      const newHeight = height.getValue() * unitMultiplier[heightUnit];

      // Ensure minRadius >= 0.001 and maxRadius is always 0.001 more than minRadius
      baseDimensions.pRMin = Math.max(newMinRadius, 0.001);
      baseDimensions.pRMax = Math.max(newMaxRadius, baseDimensions.pRMin + 0.001);
      
      // Ensure minRadius doesn't exceed maxRadius
      if (baseDimensions.pRMin >= baseDimensions.pRMax) {
        baseDimensions.pRMin = baseDimensions.pRMax - 0.001;
      }

      baseDimensions.pDz = Math.max(newHeight, 0.001);

      // Update the UI values to reflect any corrections
      maxRadius.setValue(baseDimensions.pRMax / unitMultiplier[maxRadiusUnit]);
      minRadius.setValue(baseDimensions.pRMin / unitMultiplier[minRadiusUnit]);
      height.setValue(baseDimensions.pDz / unitMultiplier[heightUnit]);

      update();
    }
  }

  // Function to handle unit changes for specific dimensions
  function handleUnitChange() {
    isUnitChange = true;
    const selectedMaxRadiusUnit = maxRadiusUnitSelect.getValue();
    const selectedMinRadiusUnit = minRadiusUnitSelect.getValue();
    const selectedHeightUnit = heightUnitSelect.getValue();

    maxRadius.setValue(baseDimensions.pRMax / unitMultiplier[selectedMaxRadiusUnit]);
    minRadius.setValue(baseDimensions.pRMin / unitMultiplier[selectedMinRadiusUnit]);
    height.setValue(baseDimensions.pDz / unitMultiplier[selectedHeightUnit]);

    isUnitChange = false;
  }

  // Update function
  function update() {
    // we need to new each geometry module
    var pRMax = baseDimensions.pRMax;
    var pRMin = baseDimensions.pRMin;
    var pDz = baseDimensions.pDz;
    var SPhi = pSPhi.getValue();
    var DPhi = pDPhi.getValue();
    var twistedangle = twistedangleI.getValue();

    // const finalMesh = CreateTwistedTube ( pRMin, pRMax , pDz , SPhi , DPhi , twistedangle )

    editor.execute(new SetGeometryCommand(editor, object, new aTwistedTubeGeometry(pRMin, pRMax, pDz, 0, DPhi, twistedangle)));
  }

  return container;
}

export { GeometryParametersPanel };