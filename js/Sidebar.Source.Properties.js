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
	container.setDisplay( 'none' );


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

			if( object.planeshape !== undefined ) {

				const newplaneshape = planesourceShape.getValue();
				object.planeshape = SOURCE.shape.plane[Number(newplaneshape)];
				// object.updateProjectionMatrix();
				
			}

			if( object.volumeshape !== undefined ) {

				const newvolumeshape = volumesourceShape.getValue();
				object.volumeshape = SOURCE.shape.volume[Number(newvolumeshape)];
				// object.updateProjectionMatrix();
				
			}

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

				if(object.source === "Plane" && object.planeshape === "Circle") {
					const sourceModelGeometry = new THREE.CylinderGeometry(1, 1, 0.01, 32, 32, false, 0, Math.PI * 2);
				}

				object.halfX = newHalfX;
				
			}

			const newHalfY = sourceY.getValue();
			if( object.halfY !== undefined ) {

				object.halfY = newHalfY;
				
			}

			const newHalfZ = sourceX.getValue();
			if( object.halfZ !== undefined ) {

				if ( object.source === "Surface" && object.volumeshape === "Cylinder") {

					const radius = sourceOuterRadius.getValue();
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius, radius, 2 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
					
				} else if ( object.source === "Volume" && object.volumeshape === "Cylinder") {

					const radius = sourceOuterRadius.getValue();
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius, radius, 2 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
					
				} else if ( object.source === "Surface" && object.volumeshape === "Ellipsoid") {
					console.log("Here");
				}

				object.halfZ = newHalfZ;
				
			}

			const newInRadius = sourceInRadius.getValue();
			if( object.innerradius !== undefined ) {

				if( object.source === "Plane" && object.planeshape === "Annulus") {

					const outerRadius = newInRadius;
					const innerRadius = sourceOuterRadius.getValue();
					
					const sourceModelGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, 0.01, 32, 32, false, 0, Math.PI * 2);
					const secondModelGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, 0.01, 32, 32, false, 0, Math.PI * 2);

					const sourceModelMaterial = new THREE.MeshStandardMaterial();
					const secondModelMaterial = new THREE.MeshStandardMaterial();

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
					const sourceModelGeometry = new THREE.CylinderGeometry(newOutRadius, newOutRadius, 0.01, 32, 32, false, 0, Math.PI * 2);
					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if( object.source === "Plane" && object.planeshape === "Annulus") {

					const outerRadius = newOutRadius;
					const innerRadius = sourceInRadius.getValue();
					
					const sourceModelGeometry = new THREE.CylinderGeometry(outerRadius, outerRadius, 0.01, 32, 32, false, 0, Math.PI * 2);
					const secondModelGeometry = new THREE.CylinderGeometry(innerRadius, innerRadius, 0.01, 32, 32, false, 0, Math.PI * 2);

					const sourceModelMaterial = new THREE.MeshStandardMaterial();
					const secondModelMaterial = new THREE.MeshStandardMaterial();

					const firstModel = new THREE.Mesh(sourceModelGeometry, sourceModelMaterial);
					const secondModel = new THREE.Mesh(secondModelGeometry, secondModelMaterial);

					let CSGMesh1 = CSG.fromMesh(firstModel);
					let secondMesh = CSG.fromMesh(secondModel);

					CSGMesh1 = CSGMesh1.subtract(secondMesh);

					const sourceModel = CSG.toMesh(CSGMesh1, new THREE.Matrix4());

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModel.geometry ) );

				} else if ( object.source === "Surface" && object.volumeshapes === "Sphere") {

					const sourceModelGeometry = new THREE.SphereGeometry(newOutRadius, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );
					
				} else if ( object.source === "Volume" && object.volumeshape === "Sphere") {

					const sourceModelGeometry = new THREE.SphereGeometry(newOutRadius, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if ( object.source === "Surface" && object.volumeshape === "Cylinder") {

					const radius = newOutRadius;
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius, radius, 2 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				} else if ( object.source === "Volume" && object.volumeshape === "Cylinder") {

					const radius = newOutRadius;
					const halfZ = newHalfZ;
					const sourceModelGeometry = new THREE.CylinderGeometry(radius, radius, 2 * halfZ, 32, 32, false, 0, Math.PI * 2);

					editor.execute( new SetGeometryCommand( editor, object.children[1], sourceModelGeometry ) );

				}

				object.outerradius = newOutRadius;
				
				sourceInRadius.setRange(sourceInRadius.getValue() + 0.00001, Infinity);

			}

			const newPosition = new THREE.Vector3( objectPositionX.getValue(), objectPositionY.getValue(), objectPositionZ.getValue() );
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

		if ( object !== null && object.name === 'RadiationSource' ) {

			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

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
			sourceX.setValue( object.halfX );
		}
		
		if( object.halfY !== undefined ) {
			sourceY.setValue( object.halfY );
		}
			
		if( object.halfZ !== undefined ) {
			sourceZ.setValue( object.halfZ );
		}
			
		if( object.innerradius !== undefined ) {
			sourceInRadius.setValue( object.innerradius );
		}
			
		if( object.outerradius !== undefined ) {
			sourceOuterRadius.setValue( object.outerradius );
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

		objectPositionX.setValue( object.position.x );
		objectPositionY.setValue( object.position.y );
		objectPositionZ.setValue( object.position.z );

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
