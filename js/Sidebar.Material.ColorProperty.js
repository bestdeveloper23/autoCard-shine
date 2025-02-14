import { UIColor, UINumber, UIRow, UIText } from './libs/ui.js';
import { SetMaterialColorCommand } from './commands/SetMaterialColorCommand.js';
import { SetMaterialValueCommand } from './commands/SetMaterialValueCommand.js';

function SidebarMaterialColorProperty( editor, property, name ) {

	const signals = editor.signals;
	const DEFAULT_COLOR = 0xff5c5c; 

	const container = new UIRow();
	container.add( new UIText( name ).setWidth( '90px' ) );

	const color = new UIColor().setHexValue(DEFAULT_COLOR.toString(16)).onInput( onChange ); // Use default color
	container.add( color );

	let intensity;

	if ( property === 'emissive' ) {

		intensity = new UINumber( 1 ).setWidth( '30px' ).setRange( 0, Infinity ).onChange( onChange );
		container.add( intensity );

	}

	let object = null;
	let material = null;

	function onChange() {

		if ( material[ property ].getHex() !== color.getHexValue() ) {

			editor.execute( new SetMaterialColorCommand( editor, object, property, color.getHexValue(), 0 /* TODO: currentMaterialSlot */ ) );

		}

		if ( intensity !== undefined ) {

			if ( material[ `${ property }Intensity` ] !== intensity.getValue() ) {

				editor.execute( new SetMaterialValueCommand( editor, object, `${ property }Intensity`, intensity.getValue(), /* TODO: currentMaterialSlot*/ 0 ) );

			}

		}

	}

	function update() {

		if ( object === null ) return;
		if ( object.material === undefined ) return;

		material = object.material;

		if ( property in material ) {
			// Ensure the material has a color, set default if it's white
			if (!material[property] || material[property].getHexString() === 'ffffff') {
				material[property] = new THREE.Color(DEFAULT_COLOR);
			}
		
			color.setHexValue( material[ property ].getHexString());

			if ( intensity !== undefined ) {

				intensity.setValue( material[ `${ property }Intensity` ] );

			}

			container.setDisplay( '' );

		} else {

			container.setDisplay( 'none' );

		}

	}

	//

	signals.objectSelected.add( function ( selected ) {

		object = selected;

		if (object && object.material && property in object.material) {
			if (!object.material[property] || object.material[property].getHexString() === 'ffffff') {
				object.material[property] = new THREE.Color(DEFAULT_COLOR);
	
				editor.execute(new SetMaterialColorCommand(editor, object, property, DEFAULT_COLOR, 0));
			}
		}
	
		update();
	} );

	signals.materialChanged.add( update );

	return container;

}

export { SidebarMaterialColorProperty };
