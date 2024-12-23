import * as THREE from 'three';
import tippy from 'tippy.js';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aConeGeometry } from './libs/geometry/aConeGeometry.js';

function GeometryParametersPanel(editor, object) {

     const strings = editor.strings;

     const container = new UIDiv();

     const geometry = object.geometry;
     const parameters = geometry.parameters;

     // Define unit options
     const unitOptions = { cm: 'cm', inch: 'inch', mm: 'mm' };
     const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 }; // Conversion factors relative to cm
     let baseDimensions = {
          minRadius1: parameters.pRMin1,
          maxRadius1: parameters.pRMax1,
          minRadius2: parameters.pRMin2,
          maxRadius2: parameters.pRMax2,
          height: parameters.pDz,
     };
     let isUnitChange = false; // Prevent unnecessary updates during unit change

     // Default Unit Selection
     const defaultUnitRow = new UIRow();
     const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
     defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);

       //grid space
     const gridSpace = new UIText(strings.getKey('sidebar/geometry/grid_Space')).setClass('grid_Space');
     defaultUnitRow.add(gridSpace);
     container.add( defaultUnitRow );
      
     tippy(gridSpace.dom, { //For comment
       content: 'The grid is 10x10, with each square and the space between lines measuring 1 cm.',
       placement: 'top', 
     });

     // minRadius2 with unit select
     const minRadiusRow2 = new UIRow();
     const minRadius2 = new UINumber(baseDimensions.minRadius2).setRange(0, Infinity).onChange(updateDimensions);
     const minRadius2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
     minRadiusRow2.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/minradius2')).setWidth('90px'), minRadius2, minRadius2UnitSelect);
     container.add(minRadiusRow2);

     // maxRadius2 with unit select
     const maxRadiusRow2 = new UIRow();
     const maxRadius2 = new UINumber(baseDimensions.maxRadius2).setRange(0, Infinity).onChange(updateDimensions);
     const maxRadius2UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
     maxRadiusRow2.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/maxradius2')).setWidth('90px'), maxRadius2, maxRadius2UnitSelect);
     container.add(maxRadiusRow2);

     // minRadius1 with unit select
     const minRadiusRow1 = new UIRow();
     const minRadius1 = new UINumber(baseDimensions.minRadius1).setRange(0, Infinity).onChange(updateDimensions);
     const minRadius1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
     minRadiusRow1.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/minradius1')).setWidth('90px'), minRadius1, minRadius1UnitSelect);
     container.add(minRadiusRow1);

     // maxRadius1 with unit select
     const maxRadiusRow1 = new UIRow();
     const maxRadius1 = new UINumber(baseDimensions.maxRadius1).setRange(0, Infinity).onChange(updateDimensions);
     const maxRadius1UnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
     maxRadiusRow1.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/maxradius1')).setWidth('90px'), maxRadius1, maxRadius1UnitSelect);
     container.add(maxRadiusRow1);

     // height (pDz) with unit select
     const heightRow = new UIRow();
     const height = new UINumber(baseDimensions.height).setRange(0.001, Infinity).onChange(updateDimensions);
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

     // deltaphi

     const pDPhiRow = new UIRow();
     const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(updateGeometry);
     pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
     pDPhiRow.add(pDPhi);
     pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

     container.add(pDPhiRow);

     // Function to update dimensions when the default unit changes
     function updateDefaultUnit() {
          isUnitChange = true;
          const selectedUnit = defaultUnitSelect.getValue();

          // Convert dimensions to the selected unit
          minRadius1.setValue(baseDimensions.minRadius1 / unitMultiplier[selectedUnit]);
          maxRadius1.setValue(baseDimensions.maxRadius1 / unitMultiplier[selectedUnit]);
          minRadius2.setValue(baseDimensions.minRadius2 / unitMultiplier[selectedUnit]);
          maxRadius2.setValue(baseDimensions.maxRadius2 / unitMultiplier[selectedUnit]);
          height.setValue(baseDimensions.height / unitMultiplier[selectedUnit]);

          // Update unit selectors
          minRadius1UnitSelect.setValue(selectedUnit);
          maxRadius1UnitSelect.setValue(selectedUnit);
          minRadius2UnitSelect.setValue(selectedUnit);
          maxRadius2UnitSelect.setValue(selectedUnit);
          heightUnitSelect.setValue(selectedUnit);

          isUnitChange = false;
     }

     // Function to update base dimensions and geometry when values change
     function updateDimensions() {
          if (!isUnitChange) {
          const minRadius1Unit = minRadius1UnitSelect.getValue();
          const maxRadius1Unit = maxRadius1UnitSelect.getValue();
          const minRadius2Unit = minRadius2UnitSelect.getValue();
          const maxRadius2Unit = maxRadius2UnitSelect.getValue();
          const heightUnit = heightUnitSelect.getValue();
     
          // Ensure constraints between minRadius1 and maxRadius1
          baseDimensions.maxRadius1 = Math.max(
               maxRadius1.getValue() * unitMultiplier[maxRadius1Unit],
               baseDimensions.minRadius1+0.01
          ); // Ensure maxRadius1 is not less than minRadius1
          baseDimensions.minRadius1 = Math.min(
               minRadius1.getValue() * unitMultiplier[minRadius1Unit],
               baseDimensions.maxRadius1-0.01
          ); // Ensure minRadius1 is not greater than maxRadius1
     
          // Ensure constraints between minRadius2 and maxRadius2
          baseDimensions.maxRadius2 = Math.max(
               maxRadius2.getValue() * unitMultiplier[maxRadius2Unit],
               baseDimensions.minRadius2+0.01
          ); // Ensure maxRadius2 is not less than minRadius2
          baseDimensions.minRadius2 = Math.min(
               minRadius2.getValue() * unitMultiplier[minRadius2Unit],
               baseDimensions.maxRadius2-0.01
          ); // Ensure minRadius2 is not greater than maxRadius2
     

          baseDimensions.height = height.getValue() * unitMultiplier[heightUnit];
     
          minRadius1.setValue(baseDimensions.minRadius1 / unitMultiplier[minRadius1Unit]);
          maxRadius1.setValue(baseDimensions.maxRadius1 / unitMultiplier[maxRadius1Unit]);
          minRadius2.setValue(baseDimensions.minRadius2 / unitMultiplier[minRadius2Unit]);
          maxRadius2.setValue(baseDimensions.maxRadius2 / unitMultiplier[maxRadius2Unit]);
     
          updateGeometry();
          }
     }

     // Function to handle unit changes for all dimensions
     function handleUnitChange() {
          isUnitChange = true;
          const selectedMinRadius1Unit = minRadius1UnitSelect.getValue();
          const selectedMaxRadius1Unit = maxRadius1UnitSelect.getValue();
          const selectedMinRadius2Unit = minRadius2UnitSelect.getValue();
          const selectedMaxRadius2Unit = maxRadius2UnitSelect.getValue();
          const selectedHeightUnit = heightUnitSelect.getValue();

          // Convert base dimensions to the selected units
          minRadius1.setValue(baseDimensions.minRadius1 / unitMultiplier[selectedMinRadius1Unit]);
          maxRadius1.setValue(baseDimensions.maxRadius1 / unitMultiplier[selectedMaxRadius1Unit]);
          minRadius2.setValue(baseDimensions.minRadius2 / unitMultiplier[selectedMinRadius2Unit]);
          maxRadius2.setValue(baseDimensions.maxRadius2 / unitMultiplier[selectedMaxRadius2Unit]);
          height.setValue(baseDimensions.height / unitMultiplier[selectedHeightUnit]);

          isUnitChange = false;
     }

     // Function to update geometry
     function updateGeometry() {
          const pRMin1 = baseDimensions.minRadius1;
          const pRMax1 = baseDimensions.maxRadius1;
          const pRMin2 = baseDimensions.minRadius2;
          const pRMax2 = baseDimensions.maxRadius2;
          const pDz = baseDimensions.height;

          const SPhi = pSPhi.getValue();
          const DPhi = pDPhi.getValue();

          editor.execute(new SetGeometryCommand(editor, object, new aConeGeometry(pRMin1, pRMax1, pRMin2, pRMax2, pDz, SPhi, DPhi)));
     }

     return container;
}

export { GeometryParametersPanel };

// minRadius1.setRange(0, pRmax1 - 0.001);
// maxRadius2.setRange(pRmin2 + 0.001, Infinity);
// minRadius2.setRange(0, pRmax2 - 0.001);
