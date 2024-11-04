import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateHyperboloid } from './libs/CSG/Hyperboloid.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// radius1

	const radius1Row = new UIRow();
	const radius1I = new UINumber( parameters.radiusOut ).setRange(0, Infinity).onChange( update );

	radius1Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/radiusout' ) ).setWidth( '90px' ) );
	radius1Row.add( radius1I );

    radius1Row.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( radius1Row );

	// radius2

	const radius2Row = new UIRow();
	const radius2I = new UINumber( parameters.radiusIn ).setRange(0, Infinity).onChange( update );

	radius2Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/radiusin' ) ).setWidth( '90px' ) );
	radius2Row.add( radius2I );

    radius2Row.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( radius2Row );

	
	// stereo1

	const stereo1Row = new UIRow();
	const stereo1I = new UINumber( parameters.stereo1 ).setRange(0, 180).onChange( update );

	stereo1Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/stereoout' ) ).setWidth( '90px' ) );
	stereo1Row.add( stereo1I );

	container.add( stereo1Row );

	// stereo2

	const stereo2Row = new UIRow();
	const stereo2I = new UINumber( parameters.stereo2 ).setRange(0, 180).onChange( update );

	stereo2Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/stereoin' ) ).setWidth( '90px' ) );
	stereo2Row.add( stereo2I );

	container.add( stereo2Row );

	// height
	
	const heightRow = new UIRow();
	const heightI = new UINumber( parameters.pDz ).setRange(0, Infinity).onChange( update );

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/height' ) ).setWidth( '90px' ) );
	heightRow.add( heightI );

    heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( heightRow );


	function update() {


        var radiusOut = radius1I.getValue(), radiusIn = radius2I.getValue(), stereo1 = stereo1I.getValue(), stereo2 = stereo2I.getValue(), pDz = heightI.getValue();
        const  finalMesh = CreateHyperboloid(radiusOut, radiusIn, stereo1, stereo2, pDz);


        finalMesh.geometry.name = object.geometry.name;
        
		editor.execute( new SetGeometryCommand( editor, object, finalMesh.geometry ) );

        radius1I.setRange(radiusIn + 0.001, Infinity);
        radius2I.setRange(0, radiusOut - 0.001);
        stereo1I.setRange(stereo2 + 0.001, Infinity);
        stereo2I.setRange(0, stereo1 - 0.001);

	}

	return container;

}

export { GeometryParametersPanel };
