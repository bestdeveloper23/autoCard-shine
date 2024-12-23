import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTubeGeometry } from './libs/geometry/aTubeGeometry.js';

function GeometryParametersPanel(editor, object) {

  const strings = editor.strings;

  const container = new UIDiv();

  const geometry = object.geometry;
  const parameters = geometry.parameters;

  // Define unit options
  const unitOptions = { cm: 'cm', inch: 'inch', mm: 'mm' };
  const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 }; // Conversion factors relative to cm
  let baseDimensions = { 
    maxRadius: parameters.pRMax, 
    minRadius: parameters.pRMin, 
    height: parameters.pDz 
  };
  let isUnitChange = false; // Prevent unnecessary updates during unit change

  // Default Unit Selection
  const defaultUnitRow = new UIRow();
  const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
  defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
  container.add(defaultUnitRow);

  // maxRadius with unit select
  const maxRadiusRow = new UIRow();
  const maxRadius = new UINumber(baseDimensions.maxRadius).setRange(0, Infinity).onChange(updateDimensions);
  const maxRadiusUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/maxradius')).setWidth('90px'), maxRadius, maxRadiusUnitSelect);
  container.add(maxRadiusRow);

  // minRadius with unit select
  const minRadiusRow = new UIRow();
  const minRadius = new UINumber(baseDimensions.minRadius).setRange(0, Infinity).onChange(updateDimensions);
  const minRadiusUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/minradius')).setWidth('90px'), minRadius, minRadiusUnitSelect);
  container.add(minRadiusRow);

  // height (pDz) with unit select
  const heightRow = new UIRow();
  const height = new UINumber(baseDimensions.height).setRange(0, Infinity).onChange(updateDimensions);
  const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'), height, heightUnitSelect);
  container.add(heightRow);


  // startphi

  const pSPhiRow = new UIRow();
  const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(updateGeometry);
  pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
  pSPhiRow.add(pSPhi);
  pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

  container.add(pSPhiRow);

  // // deltaphi

  const pDPhiRow = new UIRow();
  const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0, 360).onChange(updateGeometry);
  pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
  pDPhiRow.add(pDPhi);
  pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

  container.add(pDPhiRow);

  // Function to update dimensions when the default unit changes
  function updateDefaultUnit() {
    isUnitChange = true;
    const selectedUnit = defaultUnitSelect.getValue();

    // Convert dimensions to the selected unit
    maxRadius.setValue(baseDimensions.maxRadius / unitMultiplier[selectedUnit]);
    minRadius.setValue(baseDimensions.minRadius / unitMultiplier[selectedUnit]);
    height.setValue(baseDimensions.height / unitMultiplier[selectedUnit]);

    // Update unit selectors
    maxRadiusUnitSelect.setValue(selectedUnit);
    minRadiusUnitSelect.setValue(selectedUnit);
    heightUnitSelect.setValue(selectedUnit);

    isUnitChange = false;
  }

  // Function to update base dimensions and geometry when values change
  function updateDimensions() {
    if (!isUnitChange) {
      const maxRadiusUnit = maxRadiusUnitSelect.getValue();
      const minRadiusUnit = minRadiusUnitSelect.getValue();
      const heightUnit = heightUnitSelect.getValue();

      baseDimensions.maxRadius = Math.max(
          maxRadius.getValue() * unitMultiplier[maxRadiusUnit],
          baseDimensions.minRadius+0.01
      ); 

      baseDimensions.minRadius = Math.min(
          minRadius.getValue() * unitMultiplier[minRadiusUnit],
          baseDimensions.maxRadius-0.01
      ); // Ensure minRadius is not greater than maxRadius

      baseDimensions.height = height.getValue() * unitMultiplier[heightUnit];

      // Update UI values if adjustments were made
      maxRadius.setValue(baseDimensions.maxRadius / unitMultiplier[maxRadiusUnit]);
      minRadius.setValue(baseDimensions.minRadius / unitMultiplier[minRadiusUnit]);
      updateGeometry();
    }
  }

  // Function to handle unit changes for maxRadius, minRadius, and height
  function handleUnitChange() {
    isUnitChange = true;
    const selectedMaxRadiusUnit = maxRadiusUnitSelect.getValue();
    const selectedMinRadiusUnit = minRadiusUnitSelect.getValue();
    const selectedHeightUnit = heightUnitSelect.getValue();

    // Convert base dimensions to the selected units
    maxRadius.setValue(baseDimensions.maxRadius / unitMultiplier[selectedMaxRadiusUnit]);
    minRadius.setValue(baseDimensions.minRadius / unitMultiplier[selectedMinRadiusUnit]);
    height.setValue(baseDimensions.height / unitMultiplier[selectedHeightUnit]);

    isUnitChange = false;
  }

  // Function to update geometry
  function updateGeometry() {
    const pRMax = baseDimensions.maxRadius;
    const pRMin = baseDimensions.minRadius;
    const pDz = baseDimensions.height;

    const SPhi = pSPhi.getValue();
    const DPhi = pDPhi.getValue();

    // maxRadius.setRange(pRMin / cm + 0.0001, Infinity);
    // minRadius.setRange(0.00, pRMax / cm - 0.0001);
    editor.execute(new SetGeometryCommand(editor, object, new aTubeGeometry(pRMin , pRMax , pDz, SPhi , DPhi)));
  }

  return container;
}

export { GeometryParametersPanel };
