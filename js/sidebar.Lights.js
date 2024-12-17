import * as THREE from 'three';

import { UIPanel, UIRow, UIInput, UISelect, UIButton, UIColor, UICheckbox, UIInteger, UITextArea, UIText, UINumber } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

import { SetUuidCommand } from './commands/SetUuidCommand.js';
import { SetValueCommand } from './commands/SetValueCommand.js';
import { SetPositionCommand } from './commands/SetPositionCommand.js';
import { SetRotationCommand } from './commands/SetRotationCommand.js';
import { SetScaleCommand } from './commands/SetScaleCommand.js';
import { SetColorCommand } from './commands/SetColorCommand.js';

import { SOURCE } from './libs/nucleardata/radiation.js';

function SidebarLight( editor ) {

	const strings = editor.strings;

	const signals = editor.signals;

	const container = new UIPanel();
	container.setBorderTop( '0' );
	container.setPaddingTop( '20px' );
	container.setDisplay( 'none' );

	// type

	// const sourceTypeRow = new UIRow();
	// const sourceType = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	// const sourcetypeoption = [];
	// SOURCE.type.forEach(element => {
	// 	sourcetypeoption.push(element);
	// });

	// sourceType.setOptions(sourcetypeoption);
	// sourceType.setValue(0);

	// sourceTypeRow.add(new UIText(strings.getKey('sidebar/object/type')).setWidth('90px'));
	// sourceTypeRow.add(sourceType);

	// container.add(sourceTypeRow);

	// name

	const objectNameRow = new UIRow();
	const objectName = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetValueCommand( editor, editor.selected, 'name', objectName.getValue() ) );

	} );

	objectNameRow.add( new UIText( strings.getKey( 'sidebar/object/name' ) ).setWidth( '90px' ) );
	objectNameRow.add( objectName );

	container.add( objectNameRow );


	// position

	const objectPositionRow = new UIRow();
	const objectPositionX = new UINumber().setPrecision( 5 ).setWidth( '50px' ).onChange( update );
	const objectPositionY = new UINumber().setPrecision( 5 ).setWidth( '50px' ).onChange( update );
	const objectPositionZ = new UINumber().setPrecision( 5 ).setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UIText( strings.getKey( 'sidebar/object/position' ) ).setWidth( '90px' ) );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

	objectPositionRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));
	container.add( objectPositionRow );

	// rotation

	// const objectRotationRow = new UIRow();
	// const objectRotationX = new UINumber().setStep( 10 ).setNudge( 0.1 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	// const objectRotationY = new UINumber().setStep( 10 ).setNudge( 0.1 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );
	// const objectRotationZ = new UINumber().setStep( 10 ).setNudge( 0.1 ).setUnit( '°' ).setWidth( '50px' ).onChange( update );

	// objectRotationRow.add( new UIText( strings.getKey( 'sidebar/object/rotation' ) ).setWidth( '90px' ) );
	// objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	// container.add( objectRotationRow );


	// fov

	// const objectFovRow = new UIRow();
	// const objectFov = new UINumber().onChange( update );

	// objectFovRow.add( new UIText( strings.getKey( 'sidebar/object/fov' ) ).setWidth( '90px' ) );
	// objectFovRow.add( objectFov );

	// container.add( objectFovRow );

	// left

	// const objectLeftRow = new UIRow();
	// const objectLeft = new UINumber().onChange( update );

	// objectLeftRow.add( new UIText( strings.getKey( 'sidebar/object/left' ) ).setWidth( '90px' ) );
	// objectLeftRow.add( objectLeft );

	// container.add( objectLeftRow );

	// right

	// const objectRightRow = new UIRow();
	// const objectRight = new UINumber().onChange( update );

	// objectRightRow.add( new UIText( strings.getKey( 'sidebar/object/right' ) ).setWidth( '90px' ) );
	// objectRightRow.add( objectRight );

	// container.add( objectRightRow );

	// top

	// const objectTopRow = new UIRow();
	// const objectTop = new UINumber().onChange( update );

	// objectTopRow.add( new UIText( strings.getKey( 'sidebar/object/top' ) ).setWidth( '90px' ) );
	// objectTopRow.add( objectTop );

	// container.add( objectTopRow );

	// bottom

	// const objectBottomRow = new UIRow();
	// const objectBottom = new UINumber().onChange( update );

	// objectBottomRow.add( new UIText( strings.getKey( 'sidebar/object/bottom' ) ).setWidth( '90px' ) );
	// objectBottomRow.add( objectBottom );

	// container.add( objectBottomRow );

	// near

	// const objectNearRow = new UIRow();
	// const objectNear = new UINumber().onChange( update );

	// objectNearRow.add( new UIText( strings.getKey( 'sidebar/object/near' ) ).setWidth( '90px' ) );
	// objectNearRow.add( objectNear );

	// container.add( objectNearRow );

	// far

	// const objectFarRow = new UIRow();
	// const objectFar = new UINumber().onChange( update );

	// objectFarRow.add( new UIText( strings.getKey( 'sidebar/object/far' ) ).setWidth( '90px' ) );
	// objectFarRow.add( objectFar );

	// container.add( objectFarRow );

	// intensity

	const objectIntensityRow = new UIRow();
	const objectIntensity = new UINumber().onChange( update );

	objectIntensityRow.add( new UIText( strings.getKey( 'sidebar/object/intensity' ) ).setWidth( '90px' ) );
	objectIntensityRow.add( objectIntensity );

	container.add( objectIntensityRow );

	// color

	const objectColorRow = new UIRow();
	const objectColor = new UIColor().onInput( update );

	objectColorRow.add( new UIText( strings.getKey( 'sidebar/object/color' ) ).setWidth( '90px' ) );
	objectColorRow.add( objectColor );

	container.add( objectColorRow );

	// ground color

	const objectGroundColorRow = new UIRow();
	const objectGroundColor = new UIColor().onInput( update );

	objectGroundColorRow.add( new UIText( strings.getKey( 'sidebar/object/groundcolor' ) ).setWidth( '90px' ) );
	objectGroundColorRow.add( objectGroundColor );

	container.add( objectGroundColorRow );

	// distance

	const objectDistanceRow = new UIRow();
	const objectDistance = new UINumber().setRange( 0, Infinity ).onChange( update );

	objectDistanceRow.add( new UIText( strings.getKey( 'sidebar/object/distance' ) ).setWidth( '90px' ) );
	objectDistanceRow.add( objectDistance );

	container.add( objectDistanceRow );

	// angle

	const objectAngleRow = new UIRow();
	const objectAngle = new UINumber().setPrecision( 5 ).setRange( 0, Math.PI / 2 ).onChange( update );

	objectAngleRow.add( new UIText( strings.getKey( 'sidebar/object/angle' ) ).setWidth( '90px' ) );
	objectAngleRow.add( objectAngle );

	container.add( objectAngleRow );

	// penumbra

	const objectPenumbraRow = new UIRow();
	const objectPenumbra = new UINumber().setRange( 0, 1 ).onChange( update );

	objectPenumbraRow.add( new UIText( strings.getKey( 'sidebar/object/penumbra' ) ).setWidth( '90px' ) );
	objectPenumbraRow.add( objectPenumbra );

	container.add( objectPenumbraRow );

	// decay

	const objectDecayRow = new UIRow();
	const objectDecay = new UINumber().setRange( 0, Infinity ).onChange( update );

	objectDecayRow.add( new UIText( strings.getKey( 'sidebar/object/decay' ) ).setWidth( '90px' ) );
	objectDecayRow.add( objectDecay );

	container.add( objectDecayRow );

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


			const newPosition = new THREE.Vector3( objectPositionX.getValue() * 10, objectPositionY.getValue() * 10, objectPositionZ.getValue() * 10 );
			if ( object.position.distanceTo( newPosition ) >= 0.01 ) {

				editor.execute( new SetPositionCommand( editor, object, newPosition ) );

			}

			// const newRotation = new THREE.Euler( - objectRotationX.getValue() * THREE.MathUtils.DEG2RAD, - objectRotationY.getValue() * THREE.MathUtils.DEG2RAD, - objectRotationZ.getValue() * THREE.MathUtils.DEG2RAD );
			// if ( new THREE.Vector3().setFromEuler( object.rotation ).distanceTo( new THREE.Vector3().setFromEuler( newRotation ) ) >= 0.01 ) {

			// 	editor.execute( new SetRotationCommand( editor, object, newRotation ) );

			// }


			// if ( object.fov !== undefined && Math.abs( object.fov - objectFov.getValue() ) >= 0.01 ) {

			// 	editor.execute( new SetValueCommand( editor, object, 'fov', objectFov.getValue() ) );
			// 	object.updateProjectionMatrix();

			// }

			// if ( object.left !== undefined && Math.abs( object.left - objectLeft.getValue() ) >= 0.01 ) {

			// 	editor.execute( new SetValueCommand( editor, object, 'left', objectLeft.getValue() ) );
			// 	object.updateProjectionMatrix();

			// }

			// if ( object.right !== undefined && Math.abs( object.right - objectRight.getValue() ) >= 0.01 ) {

			// 	editor.execute( new SetValueCommand( editor, object, 'right', objectRight.getValue() ) );
			// 	object.updateProjectionMatrix();

			// }

			// if ( object.top !== undefined && Math.abs( object.top - objectTop.getValue() ) >= 0.01 ) {

			// 	editor.execute( new SetValueCommand( editor, object, 'top', objectTop.getValue() ) );
			// 	object.updateProjectionMatrix();

			// }

			// if ( object.bottom !== undefined && Math.abs( object.bottom - objectBottom.getValue() ) >= 0.01 ) {

			// 	editor.execute( new SetValueCommand( editor, object, 'bottom', objectBottom.getValue() ) );
			// 	object.updateProjectionMatrix();

			// }

			// if ( object.near !== undefined && Math.abs( object.near - objectNear.getValue() ) >= 0.01 ) {

			// 	editor.execute( new SetValueCommand( editor, object, 'near', objectNear.getValue() ) );
			// 	if ( object.isOrthographicCamera ) {

			// 		object.updateProjectionMatrix();

			// 	}

			// }

			// if ( object.far !== undefined && Math.abs( object.far - objectFar.getValue() ) >= 0.01 ) {

			// 	editor.execute( new SetValueCommand( editor, object, 'far', objectFar.getValue() ) );
			// 	if ( object.isOrthographicCamera ) {

			// 		object.updateProjectionMatrix();

				// }

			// }

			if ( object.intensity !== undefined && Math.abs( object.intensity - objectIntensity.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'intensity', objectIntensity.getValue() ) );

			}

			if ( object.color !== undefined && object.color.getHex() !== objectColor.getHexValue() ) {

				editor.execute( new SetColorCommand( editor, object, 'color', objectColor.getHexValue() ) );

			}

			if ( object.groundColor !== undefined && object.groundColor.getHex() !== objectGroundColor.getHexValue() ) {

				editor.execute( new SetColorCommand( editor, object, 'groundColor', objectGroundColor.getHexValue() ) );

			}

			if ( object.distance !== undefined && Math.abs( object.distance - objectDistance.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'distance', objectDistance.getValue() ) );

			}

			if ( object.angle !== undefined && Math.abs( object.angle - objectAngle.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'angle', objectAngle.getValue() ) );

			}

			if ( object.penumbra !== undefined && Math.abs( object.penumbra - objectPenumbra.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'penumbra', objectPenumbra.getValue() ) );

			}

			if ( object.decay !== undefined && Math.abs( object.decay - objectDecay.getValue() ) >= 0.01 ) {

				editor.execute( new SetValueCommand( editor, object, 'decay', objectDecay.getValue() ) );

			}

			if ( object.visible !== objectVisible.getValue() ) {

				editor.execute( new SetValueCommand( editor, object, 'visible', objectVisible.getValue() ) );

			}

		}

	}

	function updateRows( object ) {

		const properties = {
			// 'fov': objectFovRow,
			// 'left': objectLeftRow,
			// 'right': objectRightRow,
			// 'top': objectTopRow,
			// 'bottom': objectBottomRow,
			// 'near': objectNearRow,
			// 'far': objectFarRow,
			'intensity': objectIntensityRow,
			'color': objectColorRow,
			'groundColor': objectGroundColorRow,
			'distance': objectDistanceRow,
			'angle': objectAngleRow,
			'penumbra': objectPenumbraRow,
			'decay': objectDecayRow,
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

	}

	// events

	signals.objectSelected.add( function ( object ) {

		if ( object !== null && object.isLight === true) {

			container.setDisplay( 'block' );

			updateRows( object );
			updateUI( object );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	signals.objectChanged.add( function ( object ) {

		if ( object !== editor.selected  && object.isLight !== true) return;

		updateUI( object );

	} );

	signals.refreshSidebarObject3D.add( function ( object ) {

		if ( object !== editor.selected && object.isLight !== true) return;

		updateUI( object );

	} );

	function updateUI( object ) {

		objectName.setValue( object.name );


		objectPositionX.setValue( object.position.x / 10 );
		objectPositionY.setValue( object.position.y / 10 );
		objectPositionZ.setValue( object.position.z / 10 );

		// objectRotationX.setValue( - object.rotation.x * THREE.MathUtils.RAD2DEG );
		// objectRotationY.setValue( - object.rotation.y * THREE.MathUtils.RAD2DEG );
		// objectRotationZ.setValue( - object.rotation.z * THREE.MathUtils.RAD2DEG );


		// if ( object.fov !== undefined ) {

		// 	objectFov.setValue( object.fov );

		// }

		// if ( object.left !== undefined ) {

		// 	objectLeft.setValue( object.left );

		// }

		// if ( object.right !== undefined ) {

		// 	objectRight.setValue( object.right );

		// }

		// if ( object.top !== undefined ) {

		// 	objectTop.setValue( object.top );

		// }

		// if ( object.bottom !== undefined ) {

		// 	objectBottom.setValue( object.bottom );

		// }

		// if ( object.near !== undefined ) {

		// 	objectNear.setValue( object.near );

		// }

		// if ( object.far !== undefined ) {

		// 	objectFar.setValue( object.far );

		// }

		if ( object.intensity !== undefined ) {

			objectIntensity.setValue( object.intensity );

		}

		if ( object.color !== undefined ) {

			objectColor.setHexValue( object.color.getHexString() );

		}

		if ( object.groundColor !== undefined ) {

			objectGroundColor.setHexValue( object.groundColor.getHexString() );

		}

		if ( object.distance !== undefined ) {

			objectDistance.setValue( object.distance );

		}

		if ( object.angle !== undefined ) {

			objectAngle.setValue( object.angle );

		}

		if ( object.penumbra !== undefined ) {

			objectPenumbra.setValue( object.penumbra );

		}

		if ( object.decay !== undefined ) {

			objectDecay.setValue( object.decay );

		}


		objectVisible.setValue( object.visible );

	}

	return container;

}

export { SidebarLight };
