import * as THREE from 'three';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';
import { CreateSphere } from './libs/CSG/Sphere.js';


function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // Define unit options
    const unitOptions = { cm: 'cm', inch: 'inch', mm: 'mm' };
    const unitMultiplier = { cm: 1, inch: 2.54, mm: 0.1 }; // Conversion factors relative to cm
    let baseDimensions = { radiusOut: parameters.pRMax, radiusIn: parameters.pRMin };
    let isUnitChange = false; // Prevent unnecessary updates during unit change

    // Default Unit Selection
    const defaultUnitRow = new UIRow();
    const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
    container.add(defaultUnitRow);

    // radiusOut with unit select
    const radiusOutRow = new UIRow();
    const radiusOut = new UINumber(baseDimensions.radiusOut).setRange(0, Infinity).onChange(updateDimensions);
    const radiusOutUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    radiusOutRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radiusOut')).setWidth('90px'), radiusOut, radiusOutUnitSelect);
    container.add(radiusOutRow);

    // radiusIn with unit select
    const radiusInRow = new UIRow();
    const radiusIn = new UINumber(baseDimensions.radiusIn).setRange(0, Infinity).onChange(updateDimensions);
    const radiusInUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
    radiusInRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radiusIn')).setWidth('90px'), radiusIn, radiusInUnitSelect);
    container.add(radiusInRow);

	// startPhi

    const startPhiRow = new UIRow();
    const startPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
	startPhiRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/startPhi')).setWidth('90px'));
	startPhiRow.add(startPhi);
    startPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(startPhiRow);

	// deltaPhi

    const deltaPhiRow = new UIRow();
    const deltaPhi = new UINumber(parameters.pDPhi).setRange(0, 360).onChange(update);
	
	deltaPhiRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/deltaPhi')).setWidth('90px'));
	deltaPhiRow.add(deltaPhi);
    deltaPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(deltaPhiRow);


	// startTheta

    const startThetaRow = new UIRow();
    const startTheta = new UINumber(parameters.pSTheta).setRange(0, 180).onChange(update);
	
	startThetaRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/startTheta')).setWidth('90px'));
	startThetaRow.add(startTheta);
    startThetaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(startThetaRow);

    //sync test 
	// deltaTheta

    const deltaThetaRow = new UIRow();
    const deltaTheta = new UINumber(parameters.pDTheta).setRange(0, 180).onChange(update);
	
	deltaThetaRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/deltaTheta')).setWidth('90px'));
	deltaThetaRow.add(deltaTheta);
    deltaThetaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

    container.add(deltaThetaRow);

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = defaultUnitSelect.getValue();
        radiusOut.setValue(baseDimensions.radiusOut / unitMultiplier[selectedUnit]);
        radiusIn.setValue(baseDimensions.radiusIn / unitMultiplier[selectedUnit]);
        radiusOutUnitSelect.setValue(selectedUnit);
        radiusInUnitSelect.setValue(selectedUnit);
        update();
        isUnitChange = false;
    }

    // Function to update base dimensions and geometry when values change
    function updateDimensions() {
        if (!isUnitChange) {
            const radiusOutUnit = radiusOutUnitSelect.getValue();
            const radiusInUnit = radiusInUnitSelect.getValue();
    
            // Update radiusOut and radiusIn values with constraints
            baseDimensions.radiusOut = Math.max(
                radiusOut.getValue() * unitMultiplier[radiusOutUnit],
                baseDimensions.radiusIn+0.01
            ); 
    
            baseDimensions.radiusIn = Math.min(
                radiusIn.getValue() * unitMultiplier[radiusInUnit],
                baseDimensions.radiusOut-0.01
            ); 
    
            // Update UI values if adjustments were made
            radiusOut.setValue(baseDimensions.radiusOut / unitMultiplier[radiusOutUnit]);
            radiusIn.setValue(baseDimensions.radiusIn / unitMultiplier[radiusInUnit]);
    
            update();
        }
    }

    // Function to handle unit changes for radiusOut and radiusIn
    function handleUnitChange() {
        isUnitChange = true;
        const selectedRadiusOutUnit = radiusOutUnitSelect.getValue();
        const selectedRadiusInUnit = radiusInUnitSelect.getValue();
        radiusOut.setValue(baseDimensions.radiusOut / unitMultiplier[selectedRadiusOutUnit]);
        radiusIn.setValue(baseDimensions.radiusIn / unitMultiplier[selectedRadiusInUnit]);
        isUnitChange = false;
    }

	
    // Function to update geometry
    function update() {
        const pRmin = baseDimensions.radiusIn;
        const pRmax = baseDimensions.radiusOut;
        const pSPhi = startPhi.getValue();
        const pDPhi = deltaPhi.getValue();
        const pSTheta = startTheta.getValue();
        const pDTheta = deltaTheta.getValue();

        const mesh = CreateSphere( pRmin , pRmax , pSTheta , pDTheta , pSPhi , pDPhi )
		

        mesh.geometry.name = object.geometry.name;

        editor.execute(new SetGeometryCommand(editor, object, mesh.geometry));

		// radiusIn.setRange(0, radiusOut.getValue()-0.01);  //radiusIn.setRange(0, radiusOut.getValue()-0.01);
        // radiusOut.setRange(radiusIn.getValue() + 0.001, Infinity);

    }

    return container;

}

export { GeometryParametersPanel };