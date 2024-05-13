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

	container.add(radiusOutRow);


	// radiusIn

	const radiusInRow = new UIRow();
	const radiusIn = new UINumber(parameters.pRMin).setRange(0, Infinity).onChange(update);

	radiusInRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radiusIn')).setWidth('90px'));
	radiusInRow.add(radiusIn);

	container.add(radiusInRow);

	// startPhi

	const startPhiRow = new UIRow();
	const startPhi = new UINumber(parameters.pSPhi).setRange(0, Infinity).onChange(update);
	
	startPhiRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/startPhi')).setWidth('90px'));
	startPhiRow.add(startPhi);

	container.add(startPhiRow);

	// deltaPhi

	const deltaPhiRow = new UIRow();
	const deltaPhi = new UINumber(parameters.pDPhi).setRange(0, 360).onChange(update);
	
	deltaPhiRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/deltaPhi')).setWidth('90px'));
	deltaPhiRow.add(deltaPhi);

	container.add(deltaPhiRow);


	// startTheta

	const startThetaRow = new UIRow();
	const startTheta = new UINumber(parameters.pSTheta).setRange(0, Infinity).onChange(update);
	
	startThetaRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/startTheta')).setWidth('90px'));
	startThetaRow.add(startTheta);

	container.add(startThetaRow);


	// deltaTheta

	const deltaThetaRow = new UIRow();
	const deltaTheta = new UINumber(parameters.pDTheta).setRange(0, 180).onChange(update);
	
	deltaThetaRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/deltaTheta')).setWidth('90px'));
	deltaThetaRow.add(deltaTheta);

	container.add(deltaThetaRow);


	function update() {

		const pRMin = radiusIn.getValue();
		const pRMax = radiusOut.getValue();
		const pSPhi = startPhi.getValue();
		const pDPhi = deltaPhi.getValue();
		const pSTheta = startTheta.getValue();
		const pDTheta = deltaTheta.getValue();

        const geometryOut = new THREE.SphereGeometry(pRMax, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const geometryIn = new THREE.SphereGeometry(pRMin, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const geometryBox = new THREE.BoxGeometry(pRMax * 4, pRMax * 4, pRMax * 4);
        const geometryBox2 = new THREE.BoxGeometry(pRMax * 4, pRMax * 4, pRMax * 4);

        let meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());
        let meshIn = new THREE.Mesh(geometryIn, new THREE.MeshStandardMaterial());
        let boxmesh = new THREE.Mesh(geometryBox, new THREE.MeshStandardMaterial());
        let boxmesh2 = new THREE.Mesh(geometryBox2, new THREE.MeshStandardMaterial());

        boxmesh.geometry.translate(pRMax * 2, pRMax * 2, 0);
        boxmesh2.geometry.translate(0, -pRMax * 2 - pRMax, 0);
        boxmesh2.updateMatrix();
    

        const MeshCSG1 = CSG.fromMesh(meshOut);
        const MeshCSG2 = CSG.fromMesh(meshIn);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let aCSG;
		if(pRMin !== 0) {
			aCSG = MeshCSG1.subtract(MeshCSG2);
		} else {
			aCSG = MeshCSG1;
		}
        

        let bCSG;
        bCSG = MeshCSG1.subtract(MeshCSG2);

        let cCSG;
        cCSG = MeshCSG1.subtract(MeshCSG2);

        const DPhi = pDPhi, SPhi = pSPhi, STheta = pSTheta, DTheta = pDTheta;
        if (DPhi > 270 && DPhi < 360) {
            let v_DPhi = 360 - DPhi;

            boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - v_DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / 2;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
            aCSG = aCSG.subtract(bCSG);

        } else if(DPhi <= 270) {

            boxmesh.rotateZ(SPhi / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

            let repeatCount = Math.floor((270 - DPhi) / 90);

            for (let i = 0; i < repeatCount; i++) {
                let rotateVaule = Math.PI / (-2);
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);
            }
            let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
            boxmesh.rotateZ(rotateVaule);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            aCSG = aCSG.subtract(MeshCSG3);

        }

        var deltaphi = pSTheta / 180 * 2 * pRMax;

		console.log(deltaphi);
        boxmesh2.translateY(deltaphi);
        boxmesh2.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh2);
        aCSG = aCSG.subtract(MeshCSG3);

        deltaphi = pDTheta / 180 * 2 * pRMax;
        boxmesh2.translateY(deltaphi + 4 * pRMax);
        boxmesh2.updateMatrix();
        MeshCSG3 = CSG.fromMesh(boxmesh2);
        aCSG = aCSG.subtract(MeshCSG3);
		console.log(deltaphi, pDTheta, pRMax)
        
        const mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        mesh.rotateX(Math.PI/2);
        
		const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pSPhi': SPhi, 'pDPhi': DPhi, 'pSTheta': pSTheta, 'pDTheta': pDTheta };
        mesh.geometry.parameters = param;
        mesh.geometry.type = 'SphereGeometry2';
		mesh.updateMatrix();

		editor.execute(new SetGeometryCommand(editor, object, mesh.geometry));

		radiusIn.setRange(0, radiusOut.getValue());
		radiusOut.setRange(radiusIn.getValue() + 0.001, Infinity);

	}

	return container;

}

export { GeometryParametersPanel };
