import * as THREE from 'three';

import { UIDiv, UIRow, UIText, UIInteger, UINumber, UISelect } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';
import { CreateSphere } from './libs/CSG/Sphere.js';


function GeometryParametersPanel(editor, object) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// Unit selection 
	const unitRow = new UIRow();
	const unitSelect = new UISelect().setOptions({ 'cm': 'Centimeters', 'in': 'Inches' }).setValue('cm').onChange(update);
	unitRow.add(new UIText('Unit').setWidth('90px'));
	unitRow.add(unitSelect);
	container.add(unitRow);
	
	// radiusOut

	const radiusOutRow = new UIRow();
	const radiusOut = new UINumber(parameters.pRMax).setRange(0, Infinity).onChange(update);

	radiusOutRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radiusOut')).setWidth('90px'));
	radiusOutRow.add(radiusOut);

    // radiusOutRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add(radiusOutRow);


	// radiusIn

	const radiusInRow = new UIRow();
	const radiusIn = new UINumber(parameters.pRMin).setRange(0, Infinity).onChange(update);

	radiusInRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radiusIn')).setWidth('90px'));
	radiusInRow.add(radiusIn);

    // radiusInRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
    
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


	function update() {

		const unit = unitSelect.getValue();
        const factor = unit === 'in' ? 25.4 : 10; // Conversion factor: 1 inch = 25.4 mm, or use 10 for cm

		var pRmin = radiusIn.getValue()*factor;
		var pRmax = radiusOut.getValue()*factor;
		var pSPhi = startPhi.getValue()/180*Math.PI;
		var pDPhi = deltaPhi.getValue()/180*Math.PI;
		var pSTheta = startTheta.getValue()/180*Math.PI;
		var pDTheta = deltaTheta.getValue()/180*Math.PI;
		

        const mesh = CreateSphere( pRmin , pRmax , pSTheta , pDTheta , pSPhi , pDPhi )
		

        mesh.geometry.name = object.geometry.name;

		editor.execute(new SetGeometryCommand(editor, object, mesh.geometry));

		radiusIn.setRange(0, radiusOut.getValue()-0.01);  //radiusIn.setRange(0, radiusOut.getValue()-0.01);
		radiusOut.setRange(radiusIn.getValue() + 0.001, Infinity);

	}

	return container;

}

export { GeometryParametersPanel };


