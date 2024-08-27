import * as THREE from 'three';

import { UIDiv, UIRow, UIText, UIInteger, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';

function GeometryParametersPanel(editor, object) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// radiusOut

	const radiusOutRow = new UIRow();
	const radiusOut = new UINumber(parameters.pRMax).setRange(0, Infinity).onChange(update);

	radiusOutRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radiusOut')).setWidth('90px'));
	radiusOutRow.add(radiusOut);

    radiusOutRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add(radiusOutRow);


	// radiusIn

	const radiusInRow = new UIRow();
	const radiusIn = new UINumber(parameters.pRMin).setRange(0, Infinity).onChange(update);

	radiusInRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radiusIn')).setWidth('90px'));
	radiusInRow.add(radiusIn);

    radiusInRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
    
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
	const startTheta = new UINumber(parameters.pSTheta).setRange(0, Infinity).onChange(update);
	
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

		var pRMin = radiusIn.getValue();
		var pRMax = radiusOut.getValue();
		var SPhi = startPhi.getValue();
		var DPhi = deltaPhi.getValue();
		var STheta = startTheta.getValue();
		var DTheta = deltaTheta.getValue();
		

        const geometryOut = new THREE.SphereGeometry(pRMax, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const geometryIn = new THREE.SphereGeometry(pRMin, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
		const geometryTest = new THREE.SphereGeometry(pRMax, 16, 16, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI, STheta / 180 * Math.PI, DTheta / 180 * Math.PI);
        const geometryBox = new THREE.BoxGeometry(pRMax * 2, pRMax * 2, pRMax * 2);
        const geometryBox2 = new THREE.BoxGeometry(pRMax * 4, pRMax * 4, pRMax * 4);
		
		let meshTest = new THREE.Mesh(geometryTest, new THREE.MeshBasicMaterial());
        let meshOut = new THREE.Mesh(geometryOut, new THREE.MeshBasicMaterial());
        let meshIn = new THREE.Mesh(geometryIn, new THREE.MeshBasicMaterial());
        let boxmesh = new THREE.Mesh(geometryBox, new THREE.MeshBasicMaterial());
        let boxmesh2 = new THREE.Mesh(geometryBox2, new THREE.MeshBasicMaterial());

        boxmesh.geometry.translate(pRMax, -pRMax, 0);
        boxmesh2.geometry.translate(0, -pRMax * 2 - pRMax, 0);
        boxmesh2.updateMatrix();
    
		const TestCSG = CSG.fromMesh(meshTest);	
        const MeshCSG1 = CSG.fromMesh(meshOut);
        const MeshCSG2 = CSG.fromMesh(meshIn);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let aCSG;
        
        let bCSG;
		
		if(pRMin !== 0) {
			aCSG = MeshCSG1.subtract(MeshCSG2);
            bCSG = MeshCSG1.subtract(MeshCSG2);
		} else {
			aCSG = MeshCSG1;
            bCSG = MeshCSG1;
		}

		const oDPhi = deltaPhi.getValue();
			
		if (DPhi > 270 && DPhi <= 360) {
			DPhi = 360 - DPhi;
			SPhi = SPhi - DPhi;
		}

		
		boxmesh.rotateZ((SPhi) / 180 * Math.PI);
		boxmesh.updateMatrix();		
		
		let n = Math.floor((360 - DPhi) / 90);

		for(let i = 0; i < n; i++) {
			MeshCSG3 = CSG.fromMesh(boxmesh);
			aCSG = aCSG.subtract(MeshCSG3);
			if( i < (n-1)){
			  let turn = - Math.PI / (2);
			  boxmesh.rotateZ(turn);
			  boxmesh.updateMatrix();
			}
		  }
		
		  let rotateValue = -(360 - DPhi - n * 90) / 180 * Math.PI;
		  boxmesh.rotateZ(rotateValue);
		  boxmesh.updateMatrix();
		  MeshCSG3 = CSG.fromMesh(boxmesh);
		  aCSG = aCSG.subtract(MeshCSG3);
		  
		  if(oDPhi > 270 && oDPhi <= 360){
			aCSG = bCSG.subtract(aCSG);
			if(oDPhi == 360){
			  aCSG = MeshCSG1;
			}
		  }
		  
        const mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
		const param = { 'pRMax': radiusOut.getValue(), 'pRMin': radiusIn.getValue(), 'pSPhi': startPhi.getValue(), 'pDPhi': deltaPhi.getValue(), 'pSTheta': startTheta.getValue(), 'pDTheta': deltaTheta.getValue() };
        mesh.geometry.parameters = param;
        mesh.geometry.type = 'SphereGeometry2';
		

        mesh.geometry.name = object.geometry.name;

		editor.execute(new SetGeometryCommand(editor, object, mesh.geometry));

		radiusIn.setRange(0, radiusOut.getValue());
		radiusOut.setRange(radiusIn.getValue() + 0.001, Infinity);

	}

	return container;

}

export { GeometryParametersPanel };
