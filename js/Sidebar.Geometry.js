import * as THREE from 'three';

import { UIPanel, UIRow, UIText, UIInput, UIButton, UISpan, UINumber } from './libs/ui.js';

import { SetGeometryValueCommand } from './commands/SetGeometryValueCommand.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

import { SidebarGeometryBufferGeometry } from './Sidebar.Geometry.BufferGeometry.js';
import { SidebarGeometryModifiers } from './Sidebar.Geometry.Modifiers.js';

import { SOURCE } from './libs/nucleardata/radiation.js';
import { SidebarSource } from './Sidebar.Source.Properties.js';
import { CSG } from './libs/CSGMesh.js';

function SidebarGeometry( editor ) {

	const strings = editor.strings;

	const signals = editor.signals;

	const container = new UIPanel();
	container.setBorderTop( '0' );
	container.setDisplay( 'none' );
	container.setPaddingTop( '20px' );

	let currentGeometryType = null;

	// Actions

	/*
	let objectActions = new UISelect().setPosition( 'absolute' ).setRight( '8px' ).setFontSize( '11px' );
	objectActions.setOptions( {

		'Actions': 'Actions',
		'Center': 'Center',
		'Convert': 'Convert',
		'Flatten': 'Flatten'

	} );
	objectActions.onClick( function ( event ) {

		event.stopPropagation(); // Avoid panel collapsing

	} );
	objectActions.onChange( function ( event ) {

		let action = this.getValue();

		let object = editor.selected;
		let geometry = object.geometry;

		if ( confirm( action + ' ' + object.name + '?' ) === false ) return;

		switch ( action ) {

			case 'Center':

				let offset = geometry.center();

				let newPosition = object.position.clone();
				newPosition.sub( offset );
				editor.execute( new SetPositionCommand( editor, object, newPosition ) );

				editor.signals.geometryChanged.dispatch( object );

				break;

			case 'Flatten':

				let newGeometry = geometry.clone();
				newGeometry.uuid = geometry.uuid;
				newGeometry.applyMatrix( object.matrix );

				let cmds = [ new SetGeometryCommand( editor, object, newGeometry ),
					new SetPositionCommand( editor, object, new THREE.Vector3( 0, 0, 0 ) ),
					new SetRotationCommand( editor, object, new THREE.Euler( 0, 0, 0 ) ),
					new SetScaleCommand( editor, object, new THREE.Vector3( 1, 1, 1 ) ) ];

				editor.execute( new MultiCmdsCommand( editor, cmds ), 'Flatten Geometry' );

				break;

		}

		this.setValue( 'Actions' );

	} );
	container.addStatic( objectActions );
	*/

	// type

	const geometryTypeRow = new UIRow();
	const geometryType = new UIText();

	geometryTypeRow.add( new UIText( strings.getKey( 'sidebar/geometry/type' ) ).setWidth( '90px' ) );
	geometryTypeRow.add( geometryType );

	container.add( geometryTypeRow );

	// uuid

	// const geometryUUIDRow = new UIRow();
	// const geometryUUID = new UIInput().setWidth( '102px' ).setFontSize( '12px' ).setDisabled( true );
	// const geometryUUIDRenew = new UIButton( strings.getKey( 'sidebar/geometry/new' ) ).setMarginLeft( '7px' ).onClick( function () {

	// 	geometryUUID.setValue( THREE.MathUtils.generateUUID() );

	// 	editor.execute( new SetGeometryValueCommand( editor, editor.selected, 'uuid', geometryUUID.getValue() ) );

	// } );

	// geometryUUIDRow.add( new UIText( strings.getKey( 'sidebar/geometry/uuid' ) ).setWidth( '90px' ) );
	// geometryUUIDRow.add( geometryUUID );
	// geometryUUIDRow.add( geometryUUIDRenew );

	// container.add( geometryUUIDRow );

	// name

	const geometryNameRow = new UIRow();
	const geometryName = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		const nameConstraint = (name) => {
		const regex = /^[a-zA-Z0-9]+$/;

		if(!regex.test(name)){
			alert('Warning: Name cannot contain spaces or symbols.');
			
			geometryName.setValue('');
			return false;
		}else {
			return true;
		}
			
		}
		

		if(editor.selected.geometry && nameConstraint(geometryName.getValue()) ){
			editor.execute( new SetGeometryValueCommand( editor, editor.selected, 'name', geometryName.getValue() ) );	
		} else if (editor.selected.children.length ===2 && editor.selected.source && nameConstraint(geometryName.getValue())) {
			editor.execute( new SetGeometryValueCommand( editor, editor.selected.children[1], 'name', geometryName.getValue() ) );	
		}
		

	} );

	geometryNameRow.add( new UIText( strings.getKey( 'sidebar/geometry/name' ) ).setWidth( '90px' ) );
	geometryNameRow.add( geometryName );

	container.add( geometryNameRow );


		
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


	// parameters

	const parameters = new UISpan();
	container.add( parameters );

	// buffergeometry

	// container.add( new SidebarGeometryBufferGeometry( editor ) );

	// // Size

	// const geometryBoundingBox = new UIText().setFontSize( '12px' );

	// const geometryBoundingBoxRow = new UIRow();
	// geometryBoundingBoxRow.add( new UIText( strings.getKey( 'sidebar/geometry/bounds' ) ).setWidth( '90px' ) );
	// geometryBoundingBoxRow.add( geometryBoundingBox );
	// container.add( geometryBoundingBoxRow );

	// // Helpers

	// const helpersRow = new UIRow().setPaddingLeft( '90px' );
	// container.add( helpersRow );

	// const vertexNormalsButton = new UIButton( strings.getKey( 'sidebar/geometry/show_vertex_normals' ) );
	// vertexNormalsButton.onClick( function () {

	// 	const object = editor.selected;

	// 	if ( editor.helpers[ object.id ] === undefined ) {

	// 		editor.addHelper( object, new VertexNormalsHelper( object ) );

	// 	} else {

	// 		editor.removeHelper( object );

	// 	}

	// 	signals.sceneGraphChanged.dispatch();

	// } );
	// helpersRow.add( vertexNormalsButton );

	async function build() {

		const object = editor.selected;

		if ( object && object.geometry) {

			const geometry = object.geometry;

			container.setDisplay( 'block' );

			if(geometry.type.includes('Geometry2')) {
				geometryType.setValue( geometry.type.slice(0, -9) );	
			} else if(geometry.type[0] === 'a') {
				geometryType.setValue( geometry.type.slice(1, -8) );
			}else if(geometry.type.includes('Geometry')){
				geometryType.setValue(geometry.type.slice(0,-8));
			}
			
			// geometryUUID.setValue( geometry.uuid );
			geometryName.setValue( geometry.name );

			//

			if ( currentGeometryType !== geometry.type ) {

				parameters.clear();

				if ( geometry.type === 'BufferGeometry' ) {

					parameters.add( new SidebarGeometryModifiers( editor, object ) );

				} else {
					// we need to new each geometry module
					const { GeometryParametersPanel } = await import( `./Sidebar.Geometry.${ geometry.type }.js` );

					parameters.add( new GeometryParametersPanel( editor, object ) );
					

				}

				currentGeometryType = geometry.type;

			}

			// if ( geometry.boundingBox === null ) geometry.computeBoundingBox();

			// const boundingBox = geometry.boundingBox;
			// const x = Math.floor( ( boundingBox.max.x - boundingBox.min.x ) * 1000 ) / 1000;
			// const y = Math.floor( ( boundingBox.max.y - boundingBox.min.y ) * 1000 ) / 1000;
			// const z = Math.floor( ( boundingBox.max.z - boundingBox.min.z ) * 1000 ) / 1000;

			// geometryBoundingBox.setInnerHTML( `${x}<br/>${y}<br/>${z}` );

			// helpersRow.setDisplay( geometry.hasAttribute( 'normal' ) ? '' : 'none' );

		}

	}

	signals.objectSelected.add( function () {

		currentGeometryType = null;

		build();
		const object = editor.selected;

		if ( object !== null && object.isLight !== true ) {

			container.setDisplay( 'block' );

			// if ( object.source ) {

				updateRows( object );
				updateUI( object );

			// }

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.geometryChanged.add( build );


	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected || object.isLight === true) return;

		// if ( object.source ) {

			updateRows( object );
			updateUI( object );

		// }

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected || object.isLight === true) return;

		// if ( object.source ) {
			
			updateUI( object );
			
		// }
		

	} );


	function update() {

		const object = editor.selected;

		if ( object !== null && object.source ) {

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

					const sphereGeometry = new THREE.SphereGeometry(xSemiAxis*10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
					const ratioZ = Dz / xSemiAxis;
					const ratioY = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.scale.y = ratioY;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const sphereGeometry = new THREE.SphereGeometry(xSemiAxis*10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
					const ratioZ = Dz / xSemiAxis;
					const ratioY = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.scale.y = ratioY;
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

					const sphereGeometry = new THREE.SphereGeometry(xSemiAxis*10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
					const ratioZ = Dz / xSemiAxis;
					const ratioY = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.scale.y = ratioY;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Volume" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const sphereGeometry = new THREE.SphereGeometry(xSemiAxis*10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
					const ratioZ = Dz / xSemiAxis;
					const ratioY = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.scale.y = ratioY;
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

					const sphereGeometry = new THREE.SphereGeometry(xSemiAxis*10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
					const ratioZ = Dz / xSemiAxis;
					const ratioY = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.scale.y = ratioY;
					cylindermesh.updateMatrix();
					const aCSG = CSG.fromMesh(cylindermesh);
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
					
					editor.execute( new SetGeometryCommand( editor, object.children[1], finalMesh.geometry ) );

				} else if(object.source === "Surface" && object.volumeshape === "Ellipsoid") {

					const xSemiAxis = newHalfX, semiAxisY = sourceY.getValue(), Dz = sourceZ.getValue();

					const sphereGeometry = new THREE.SphereGeometry(xSemiAxis*10, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
					let cylindermesh = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial());
					const ratioZ = Dz / xSemiAxis;
					const ratioY = semiAxisY / xSemiAxis;
					cylindermesh.scale.z = ratioZ;
					cylindermesh.scale.y = ratioY;
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

		}

	}

	function updateUI( object ) {

		if( object !== undefined && object.source ) {
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
	
		}

	}

	function updateRows( object ) {

		const properties = {
			'halfX': sourceXRow,
			'halfY': sourceYRow,
			'halfZ': sourceZRow,
			'innerradius': sourceInRadiusRow,
			'outerradius': sourceOuterRadiusRow,
			'alpha': alphaRow,
			'theta': thetaRow,
			'phi': phiRow
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

		if( object.source ) {

			geometryNameRow.setDisplay( 'none' );
			geometryTypeRow.setDisplay( 'none' );
			parameters.clear();

		} else {

			geometryNameRow.setDisplay( '' );
			geometryTypeRow.setDisplay( '' );

		}
		//

	}


	return container;

}

export { SidebarGeometry };
