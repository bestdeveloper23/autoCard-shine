import * as THREE from 'three';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';
import { aTwistedBoxGeometry } from './libs/geometry/TwistedBox.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// width

	const widthRow = new UIRow();
	const width = new UINumber( parameters.width ).onChange( update );

	widthRow.add( new UIText( strings.getKey( 'sidebar/geometry/atwistedbox_geometry/width' ) ).setWidth( '90px' ) );
	widthRow.add( width );

	widthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( widthRow );

	// height

	const heightRow = new UIRow();
	const height = new UINumber( parameters.height ).onChange( update );

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/atwistedbox_geometry/height' ) ).setWidth( '90px' ) );
	heightRow.add( height );

	heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( heightRow );

	// depth

	const depthRow = new UIRow();
	const depth = new UINumber( parameters.depth ).onChange( update );

	depthRow.add( new UIText( strings.getKey( 'sidebar/geometry/atwistedbox_geometry/depth' ) ).setWidth( '90px' ) );
	depthRow.add( depth );

	depthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( depthRow );

	// twistedangle

	const twistedangleRow = new UIRow();
	const twistedangleI = new UINumber( parameters.angle ).onChange( update );

	twistedangleRow.add( new UIText( strings.getKey( 'sidebar/geometry/atwistedbox_geometry/angle' ) ).setWidth( '90px' ) );
	twistedangleRow.add( twistedangleI );
	twistedangleRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

	container.add( twistedangleRow );


	//

	function update() {

		// we need to new each geometry module

		const pDx = width.getValue(), pDy = height.getValue(), pDz = depth.getValue(), twistedangle = twistedangleI.getValue();
		editor.execute( new SetGeometryCommand( editor, object, new aTwistedBoxGeometry(pDx, pDy, pDz, twistedangle)));

	}

	return container;

}

export { GeometryParametersPanel };
