import * as THREE from 'three';

import { UIPanel, UIRow, UIInput, UISelect, UIButton, UIColor, UICheckbox, UIInteger, UITextArea, UIText, UINumber } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

import { SetUuidCommand } from './commands/SetUuidCommand.js';
import { SetValueCommand } from './commands/SetValueCommand.js';
import { SetPositionCommand } from './commands/SetPositionCommand.js';
import { SetRotationCommand } from './commands/SetRotationCommand.js';
import { SetScaleCommand } from './commands/SetScaleCommand.js';
import { SetColorCommand } from './commands/SetColorCommand.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

import { CSG } from './libs/CSGMesh.js';

import { SOURCE } from './libs/nucleardata/radiation.js';


function SidebarSource( editor ) {

	const strings = editor.strings;

	const signals = editor.signals;

	const container = new UIPanel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	// container.setDisplay( 'none' );


	// type

	const sourceTypeRow = new UIRow();
	const sourceType = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const sourcetypeoption = [];
	SOURCE.type.forEach(element => {
		sourcetypeoption.push(element);
	});

	sourceType.setOptions(sourcetypeoption);
	sourceType.setValue(0);

	sourceTypeRow.add(new UIText(strings.getKey('sidebar/object/type')).setWidth('90px'));
	sourceTypeRow.add(sourceType);

	container.add(sourceTypeRow);

	// name

	const objectNameRow = new UIRow();
	const objectName = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetValueCommand( editor, editor.selected, 'name', objectName.getValue() ) );

	} );

	objectNameRow.add( new UIText( strings.getKey( 'sidebar/object/name' ) ).setWidth( '90px' ) );
	objectNameRow.add( objectName );

	container.add( objectNameRow );

	// Source Shape

	const planesourceShapeRow = new UIRow();
	const planesourceShape = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const planeshapeoption = [];
	SOURCE.shape.plane.forEach(element => {
		planeshapeoption.push(element);
	});

	planesourceShape.setOptions(planeshapeoption);

	planesourceShapeRow.add(new UIText(strings.getKey('sidebar/object/shape')).setWidth('90px'));
	planesourceShapeRow.add(planesourceShape);
	planesourceShapeRow.setDisplay( 'none' );

	container.add(planesourceShapeRow);

	// Source Shape

	const volumesourceShapeRow = new UIRow();
	const volumesourceShape = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const volumeshapeoption = [];
	SOURCE.shape.volume.forEach(element => {
		volumeshapeoption.push(element);
	});

	volumesourceShape.setOptions(volumeshapeoption);

	volumesourceShapeRow.add(new UIText(strings.getKey('sidebar/object/shape')).setWidth('90px'));
	volumesourceShapeRow.add(volumesourceShape);
	volumesourceShapeRow.setDisplay( 'none' );

	container.add(volumesourceShapeRow);
	

	// particle type

	const energyKindRow = new UIRow();
	const energykind = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const energyoptions = [];
	SOURCE.particle.forEach(element => {
		energyoptions.push(element);
	});

	energykind.setOptions(energyoptions);
	energykind.setValue(0);

	energyKindRow.add(new UIText(strings.getKey('sidebar/object/kind')).setWidth('90px'));
	energyKindRow.add(energykind);

	container.add(energyKindRow);

	// energy size

	const energyRow = new UIRow();
	energyRow.add(new UIText(strings.getKey('sidebar/object/size')).setWidth('120px'));

	const energysize = new UINumber().setPrecision( 5 ).setWidth('60px').onChange( update );
	energyRow.add(energysize);
	container.add(energyRow);

	// energy unit

	const energyunit = new UISelect().setWidth('60px').setFontSize('12px').onChange( update );
	const unitoptions = [];
	SOURCE.unit.forEach(element => {
		unitoptions.push(element);
	});

	energyunit.setOptions(unitoptions);
	energyunit.setValue(1);

	energyRow.add(energyunit);

	container.add(energyRow);

	
	// HalfX

	const sourceXRow = new UIRow();
	sourceXRow.add(new UIText(strings.getKey('sidebar/object/halfx')).setWidth('120px'));

	const sourceX = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	sourceXRow.add(sourceX);
	container.add(sourceXRow);


	// HalfY

	const sourceYRow = new UIRow();
	sourceYRow.add(new UIText(strings.getKey('sidebar/object/halfy')).setWidth('120px'));

	const sourceY = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	sourceYRow.add(sourceY);
	container.add(sourceYRow);


	// HalfZ

	const sourceZRow = new UIRow();
	sourceZRow.add(new UIText(strings.getKey('sidebar/object/halfz')).setWidth('120px'));

	const sourceZ = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	sourceZRow.add(sourceZ);
	container.add(sourceZRow);


	// InnerRadius

	const sourceInRadiusRow = new UIRow();
	sourceInRadiusRow.add(new UIText(strings.getKey('sidebar/object/inradius')).setWidth('120px'));

	const sourceInRadius = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	sourceInRadiusRow.add(sourceInRadius);
	container.add(sourceInRadiusRow);


	// OuterRadius

	const sourceOuterRadiusRow = new UIRow();
	sourceOuterRadiusRow.add(new UIText(strings.getKey('sidebar/object/outradius')).setWidth('120px'));

	const sourceOuterRadius = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	sourceOuterRadiusRow.add(sourceOuterRadius);
	container.add(sourceOuterRadiusRow);


	// Alpha

	const alphaRow = new UIRow();
	alphaRow.add(new UIText(strings.getKey('sidebar/object/alpha')).setWidth('120px'));

	const alphaI = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	alphaRow.add(alphaI);
	container.add(alphaRow);


	// theta

	const thetaRow = new UIRow();
	thetaRow.add(new UIText(strings.getKey('sidebar/object/theta')).setWidth('120px'));

	const thetaI = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	thetaRow.add(thetaI);
	container.add(thetaRow);


	// phi

	const phiRow = new UIRow();
	phiRow.add(new UIText(strings.getKey('sidebar/object/phi')).setWidth('120px'));

	const phiI = new UINumber().setPrecision( 5 ).setWidth('120px').onChange( update );
	phiRow.add(phiI);
	container.add(phiRow);

	// position

	const objectPositionRow = new UIRow();
	const objectPositionX = new UINumber().setPrecision( 5 ).setWidth( '50px' ).onChange( update );
	const objectPositionY = new UINumber().setPrecision( 5 ).setWidth( '50px' ).onChange( update );
	const objectPositionZ = new UINumber().setPrecision( 5 ).setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UIText( strings.getKey( 'sidebar/object/position' ) ).setWidth( '90px' ) );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

	container.add( objectPositionRow );

	// rotation

	const objectRotationRow = new UIRow();
	const objectRotationX = new UINumber().setStep( 10 ).setNudge( 0.1 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	const objectRotationY = new UINumber().setStep( 10 ).setNudge( 0.1 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	const objectRotationZ = new UINumber().setStep( 10 ).setNudge( 0.1 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );

	objectRotationRow.add( new UIText( strings.getKey( 'sidebar/object/rotation' ) ).setWidth( '90px' ) );
	objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	container.add( objectRotationRow );

	// fov

	const objectFovRow = new UIRow();
	const objectFov = new UINumber().onChange( update );

	objectFovRow.add( new UIText( strings.getKey( 'sidebar/object/fov' ) ).setWidth( '90px' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );


	// near

	const objectNearRow = new UIRow();
	const objectNear = new UINumber().onChange( update );

	objectNearRow.add( new UIText( strings.getKey( 'sidebar/object/near' ) ).setWidth( '90px' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	const objectFarRow = new UIRow();
	const objectFar = new UINumber().onChange( update );

	objectFarRow.add( new UIText( strings.getKey( 'sidebar/object/far' ) ).setWidth( '90px' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );


	// visible

	const objectVisibleRow = new UIRow();
	const objectVisible = new UICheckbox().onChange( update );

	objectVisibleRow.add( new UIText( strings.getKey( 'sidebar/object/visible' ) ).setWidth( '90px' ) );
	objectVisibleRow.add( objectVisible );

	container.add( objectVisibleRow );

	//

	function update() {

		const object = editor.selected;

		if ( object !== null ) {

			const newsourcename = sourceType.getValue();			
			if ( newsourcename == 1 ) {
				planesourceShapeRow.setDisplay( 'flex' );
				volumesourceShapeRow.setDisplay( 'none' );
			} else if ( newsourcename == 3 || newsourcename == 4 ) {
				planesourceShapeRow.setDisplay( 'none' );
				volumesourceShapeRow.setDisplay( 'flex' );
			} else {
				planesourceShapeRow.setDisplay( 'none' );
				volumesourceShapeRow.setDisplay( 'none' );
			}

			if( object.source !== undefined ) {

				object.source = SOURCE.type[Number(newsourcename)];
				// object.updateProjectionMatrix();

			}

			// if( object.planeshape !== undefined ) {

				const newplaneshape = planesourceShape.getValue();
				object.planeshape = SOURCE.shape.plane[Number(newplaneshape)];
				// object.updateProjectionMatrix();
				
			// }

			// if( object.volumeshape !== undefined ) {

				const newvolumeshape = volumesourceShape.getValue();
				object.volumeshape = SOURCE.shape.volume[Number(newvolumeshape)];
				
				// object.updateProjectionMatrix();
				
			// }

			if( object.energykind !== undefined ) {

				const newKind = energykind.getValue();
				object.energykind = SOURCE.particle[Number(newKind)];
				// object.updateProjectionMatrix();
				
			}

			
			if( object.energysize !== undefined ) {

				const newSize = energysize.getValue();
				object.energysize = newSize;
				// object.updateProjectionMatrix();
				
			}
			
			if( object.energyunit !== undefined ) {

				const newUnit = energyunit.getValue();
				object.energyunit = SOURCE.unit[Number(newUnit)];
				// object.updateProjectionMatrix();
				
			}

			const newHalfX = sourceX.getValue();
			if( object.halfX !== undefined ) {

				if(object.source === "Plane" && object.planeshape === "Ellipse") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = 0.01;

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Plane" && object.planeshape === "Square") {
					
					const sourceModelGeometry = new THREE.BoxGeometry(newHalfX * 10, newHalfX * 10, 0.01)
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if(object.source === "Plane" && object.planeshape === "Rectangle") {

					const sourceModelGeometry = new THREE.BoxGeometry(newHalfX * 10, sourceY.getValue() * 10, 0.01);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if(object.source === "Surface" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz*20, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz*20, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Surface" && object.volumeshape === "Para") {

					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 20;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape == "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 20;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );
					
				}

				object.halfX = newHalfX;
				
			}

			const newHalfY = sourceY.getValue();
			if( object.halfY !== undefined ) {

				if(object.source === "Plane" && object.planeshape === "Ellipse") {

					const xSemiAxis = newHalfX, semiAxisY = newHalfY, Dz = 0.01;

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Plane" && object.planeshape === "Rectangle") {

					const sourceModelGeometry = new THREE.BoxGeometry(newHalfX * 10, newHalfY * 10, 0.01);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
					
				} else if(object.source === "Surface" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = newHalfY, Dz = sourceZ.getValue();

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz*20, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz*20, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Surface" && object.volumeshape === "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape == "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );
					
				}

				object.halfY = newHalfY;
				
			}

			const newHalfZ = sourceZ.getValue();
			if( object.halfZ !== undefined ) {

				if ( object.source === "Surface" && object.volumeshape === "Cylinder") {

					const radius = sourceOuterRadius.getValue();
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius * 10, radius * 10, 20 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
					
				} else if ( object.source === "Volume" && object.volumeshape === "Cylinder") {

					const radius = sourceOuterRadius.getValue();
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius * 10, radius * 10, 20 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
					
				} else if(object.source === "Surface" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz * 10, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * 10, xSemiAxis * 10, Dz*20, 32, 1, false, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
					const ratioZ = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Surface" && object.volumeshape === "Ellipsoid") {

					const radius = sourceOuterRadius.getValue(); height = newHalfZ;

					const sourceModelGeometry = new THREE.CylinderGeometry(radius * 10, radius * 10, height * 10, 32, 32, false, 0, Math.PI * 2);
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
			
				} else if(object.source === "Surface" && object.volumeshape === "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape == "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );
					
				}

				object.halfZ = newHalfZ;
				
			}

			const newInRadius = sourceInRadius.getValue();
			if( object.innerradius !== undefined ) {

				if( object.source === "Plane" && object.planeshape === "Annulus") {

					const outerRadius = newInRadius;
					const innerRadius = sourceOuterRadius.getValue() * 10;
					
					const sourceModelGeometry = new THREE.CylinderGeometry(outerRadius * 10, outerRadius * 10, 0.01, 32, 32, false, 0, Math.PI * 2);
					const secondModelGeometry = new THREE.CylinderGeometry(innerRadius * 10, innerRadius * 10, 0.01, 32, 32, false, 0, Math.PI * 2);

					const sourceModelMaterial = new THREE.MeshBasicMaterial();
					const secondModelMaterial = new THREE.MeshBasicMaterial();

					const firstModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);
					const secondModel = new THREE.Mesh(secondModelGeometry, secondModelMaterial);

					let CSGMesh1 = CSG.fromMesh(firstModel);
					let secondMesh = CSG.fromMesh(secondModel);

					CSGMesh1 = CSGMesh1.subtract(secondMesh);

					const sourceModel = CSG.toMesh(CSGMesh1, new THREE.Matrix4());

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				}

				object.innerradius = newInRadius;
				sourceInRadius.setRange(0, sourceOuterRadius.getValue() - 0.00001);
				
			}

			const newOutRadius = sourceOuterRadius.getValue();
			if( object.outerradius !== undefined ) {

				if(object.source === "Plane" && object.planeshape === "Circle") {
					const sourceModelGeometry = new THREE.CylinderGeometry(newOutRadius * 10, newOutRadius * 10, 0.01, 32, 32, false, 0, Math.PI * 2);
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if( object.source === "Plane" && object.planeshape === "Annulus") {

					const outerRadius = newOutRadius;
					const innerRadius = sourceInRadius.getValue();
					
					const sourceModelGeometry = new THREE.CylinderGeometry(outerRadius * 10, outerRadius * 10, 0.01, 32, 32, false, 0, Math.PI * 2);
					const secondModelGeometry = new THREE.CylinderGeometry(innerRadius * 10, innerRadius * 10, 0.01, 32, 32, false, 0, Math.PI * 2);

					const sourceModelMaterial = new THREE.MeshBasicMaterial();
					const secondModelMaterial = new THREE.MeshBasicMaterial();

					const firstModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);
					const secondModel = new THREE.Mesh(secondModelGeometry, secondModelMaterial);

					let CSGMesh1 = CSG.fromMesh(firstModel);
					let secondMesh = CSG.fromMesh(secondModel);

					CSGMesh1 = CSGMesh1.subtract(secondMesh);

					const sourceModel = CSG.toMesh(CSGMesh1, new THREE.Matrix4());

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				} else if ( object.source === "Surface" && object.volumeshape === "Sphere") {

					const sourceModelGeometry = new THREE.SphereGeometry(newOutRadius * 10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
					
				} else if ( object.source === "Volume" && object.volumeshape === "Sphere") {

					const sourceModelGeometry = new THREE.SphereGeometry(newOutRadius * 10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if ( object.source === "Surface" && object.volumeshape === "Cylinder") {

					const radius = newOutRadius;
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius * 10, radius * 10, 20 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if ( object.source === "Volume" && object.volumeshape === "Cylinder") {

					const radius = newOutRadius;
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius * 10, radius * 10, 20 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				}

				object.outerradius = newOutRadius;
				
				sourceOuterRadius.setRange(sourceInRadius.getValue() + 0.00001, Infinity);

			}

			if( object.alpha !== undefined ) {
				if(object.source === "Surface" && object.volumeshape === "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape == "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );
					
				}

				object.alpha = alphaI.getValue();
			}

			if ( object.theta !== undefined ) {
				
				if(object.source === "Surface" && object.volumeshape === "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape == "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );
					
				}

				object.theta = thetaI.getValue();
			}

			if ( object.phi !== undefined ) {

				if(object.source === "Surface" && object.volumeshape == "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );
					
				} else if(object.source === "Volume" && object.volumeshape == "Para") {
					const dx = sourceX.getValue() * 10, dy = sourceY.getValue() * 10, dz = sourceZ.getValue() * 10, alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();

					const maxRadius = Math.max(dx, dy, dz) * 2;
					const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
					const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

					const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
					const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());

					let MeshCSG1 = CSG.fromMesh(mesh);
					let MeshCSG3 = CSG.fromMesh(boxmesh);

					boxmesh.geometry.translate(2 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 + dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					let aCSG = MeshCSG1.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0 - dx, 0, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 0, -4 * maxRadius);
					boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
					boxmesh.position.set(0, 0, -dz);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.rotation.set(0, 0, 0);
					boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
					boxmesh.position.set(0, dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					boxmesh.geometry.translate(0, -4 * maxRadius, 0);
					boxmesh.position.set(0, - dy, 0);
					boxmesh.updateMatrix();
					MeshCSG3 = CSG.fromMesh(boxmesh);
					aCSG = aCSG.subtract(MeshCSG3);

					let sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());        
					// sourceModel.rotateX(Math.PI / 2);
					// sourceModel.updateMatrix();
					// aCSG = CSG.fromMesh(sourceModel);
					// sourceModel = CSG.toMesh(aCSG, new THREE.Matrix4());

					const param = { 'dx': dx/10, 'dy': dy/10, 'dz': dz/10, 'alpha': alpha, 'theta': theta, 'phi': phi };
					sourceModel.geometry.parameters = param;
					sourceModel.geometry.type = 'aParallGeometry';
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );
					
				}

				object.phi = phiI.getValue();
			}

			const newPosition = new THREE.Vector3( objectPositionX.getValue() * 10, objectPositionY.getValue() * 10, objectPositionZ.getValue() * 10 );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

				editor.execute( new SetPositionCommand( editor, object, newPosition ) );

			}

			const newRotation = new THREE.Euler( objectRotationX.getValue() * THREE.MathUtils.DEG2RAD, objectRotationY.getValue() * THREE.MathUtils.DEG2RAD, objectRotationZ.getValue() * THREE.MathUtils.DEG2RAD );
			if ( new THREE.Vector3().setFromEuler( object.rotation ).distanceTo( new THREE.Vector3().setFromEuler( newRotation ) ) >= 0.01 ) {

				editor.execute( new SetRotationCommand( editor, object, newRotation ) );

			}

			if ( object.fov !== undefined && Math.abs( object.fov - objectFov.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'fov', objectFov.getValue() ) );
				// object.updateProjectionMatrix();

			}

			if ( object.near !== undefined && Math.abs( object.near - objectNear.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'near', objectNear.getValue() ) );
				if ( object.isOrthographicCamera ) {

					// object.updateProjectionMatrix();

				}

			}

			if ( object.far !== undefined && Math.abs( object.far - objectFar.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'far', objectFar.getValue() ) );
				if ( object.isOrthographicCamera ) {

					// object.updateProjectionMatrix();

				}

			}

		}

	}

	function updateRows( object ) {

		const properties = {
			'source': sourceTypeRow,
			'planeshape': planesourceShapeRow,
			'volumeshape': volumesourceShapeRow,
			'energykind': energyKindRow,
			'energysize': energyRow,
			'energyunit': energyRow,
			'halfX': sourceXRow,
			'halfY': sourceYRow,
			'halfZ': sourceZRow,
			'innerradius': sourceInRadiusRow,
			'outerradius': sourceOuterRadiusRow,
			'alpha': alphaRow,
			'theta': thetaRow,
			'phi': phiRow,
			'fov': objectFovRow,
			'near': objectNearRow,
			'far': objectFarRow,
		};

		for ( const property in properties ) {

			const uiElement = properties[ property ];

			if ( Array.isArray( uiElement ) === true ) {

				for ( let i = 0; i < uiElement.length; i ++ ) {

					uiElement[ i ].setDisplay( object[ property ] !== undefined ? '' : 'none' );

				}

			} else {

				uiElement.setDisplay( object[ property ] !== undefined ? '' : 'none' );

			}

		}

		//

		if ( object.source !== undefined ) {
			objectNameRow.setDisplay( 'none' );
		}


		if ( object.source === 'Plane' ) {
			planesourceShapeRow.setDisplay( 'flex' );
		} else if ( object.source === 'Surface' || object.source === 'Volume' ) {
			volumesourceShapeRow.setDisplay( 'flex' );
		} else if( object.source === 'Point' || object.source === 'Beam' ) {
			planesourceShapeRow.setDisplay( 'none' );
			volumesourceShapeRow.setDisplay( 'none' );
		} else {
		}

	}

	function updateTransformRows( object ) {

		if ( object.isLight ||
		   ( object.isObject3D && object.userData.targetInverse ) ) {

			objectRotationRow.setDisplay( 'none' );
			// objectScaleRow.setDisplay( 'none' );

		} else {

			objectRotationRow.setDisplay( '' );
			// objectScaleRow.setDisplay( '' );

		}

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null && object.source ) {

			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );
	// container.setDisplay('none');

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected ) return;

		updateUI( object );

	} );

	function updateUI( object ) {

		objectName.setValue( object.name );

		if( object.source !== undefined ) {
			sourceType.setValue( SOURCE.type.indexOf(object.source) );	
		}
		
		if( object.planeshape !== undefined ) {
			const index = SOURCE.shape.plane.indexOf(object.planeshape);
			planesourceShape.setValue( index );
		}

		if( object.volumeshape !== undefined ) {
			const index = SOURCE.shape.volume.indexOf(object.volumeshape);
			volumesourceShape.setValue( index );
		}

		if( object.energysize !== undefined ) {
			energysize.setValue( object.energysize );
		}

		if( object.energyunit !== undefined ) {
			energyunit.setValue( SOURCE.unit.indexOf(object.energyunit) );
		}
		
		if( object.energykind !== undefined ) {
			energykind.setValue( SOURCE.particle.indexOf(object.energykind) );
		}
		
		if( object.halfX !== undefined ) {
			sourceX.setValue( object.halfX);
		}
		
		if( object.halfY !== undefined ) {
			sourceY.setValue( object.halfY);
		}
			
		if( object.halfZ !== undefined ) {
			sourceZ.setValue( object.halfZ);
		}
			
		if( object.innerradius !== undefined ) {
			sourceInRadius.setValue( object.innerradius);
		}
			
		if( object.outerradius !== undefined ) {
			sourceOuterRadius.setValue( object.outerradius);
		}

		if( object.alpha !== undefined ) {
			alphaI.setValue( object.alpha );
		}

		if( object.theta !== undefined ) {
			thetaI.setValue( object.theta );
		}

		if( object.phi !== undefined ) {
			phiI.setValue( object.phi );
		}

		const newsourcename = sourceType.getValue();
		if( object.energy !== undefined ) {

			object.planeshape = SOURCE.type[newsourcename];
			
		}
		if ( newsourcename == 1 ) {
			planesourceShapeRow.setDisplay( 'flex' );
		} else if ( newsourcename == 3 || newsourcename == 4 ) {
			volumesourceShapeRow.setDisplay( 'flex' );
		} else {
			planesourceShapeRow.setDisplay( 'none' );
			volumesourceShapeRow.setDisplay( 'none' );
		}

		objectPositionX.setValue( object.position.x / 10);
		objectPositionY.setValue( object.position.y / 10);
		objectPositionZ.setValue( object.position.z / 10);

		objectRotationX.setValue( object.rotation.x * THREE.MathUtils.RAD2DEG );
		objectRotationY.setValue( object.rotation.y * THREE.MathUtils.RAD2DEG );
		objectRotationZ.setValue( object.rotation.z * THREE.MathUtils.RAD2DEG );

		if ( object.fov !== undefined ) {

			objectFov.setValue( object.fov );

		}

		if ( object.near !== undefined ) {

			objectNear.setValue( object.near );

		}

		if ( object.far !== undefined ) {

			objectFar.setValue( object.far );

		}

		updateTransformRows( object );

	}

	return container;

}

export { SidebarSource };
