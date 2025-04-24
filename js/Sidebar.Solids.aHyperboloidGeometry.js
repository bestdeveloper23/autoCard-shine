import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aHyperboloidGeometry } from './libs/geometry/Hyperboloid.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// radiusIn

	const radiusInRow = new UIRow();
	const radiusInInput = new UINumber( parameters.radiusIn ).setRange(0, Infinity).onChange( update );

	radiusInRow.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/radiusin' ) ).setWidth( '90px' ) );
	radiusInRow.add( radiusInInput );

	radiusInRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( radiusInRow );

	// radiusOut

	const radiusOutRow = new UIRow();
	const radiusOutInput = new UINumber( parameters.radiusOut ).setRange(0, Infinity).onChange( update );

	radiusOutRow.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/radiusout' ) ).setWidth( '90px' ) );
	radiusOutRow.add( radiusOutInput );

    radiusOutRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( radiusOutRow );

	// innerStereo (maps to stereo2 in parameters)

	const innerStereoRow = new UIRow();
	const innerStereoInput = new UINumber( parameters.stereo2 ).setRange(0, 180).onChange( update );

	innerStereoRow.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/stereoin' ) ).setWidth( '90px' ) );
	innerStereoRow.add( innerStereoInput );

	container.add( innerStereoRow );

	// outerStereo (maps to stereo1 in parameters)

	const outerStereoRow = new UIRow();
	const outerStereoInput = new UINumber( parameters.stereo1 ).setRange(0, 180).onChange( update );

	outerStereoRow.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/stereoout' ) ).setWidth( '90px' ) );
	outerStereoRow.add( outerStereoInput );

	container.add( outerStereoRow );

	// height (pDz)
	
	const heightRow = new UIRow();
	const heightInput = new UINumber( parameters.pDz ).setRange(0, Infinity).onChange( update );

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/height' ) ).setWidth( '90px' ) );
	heightRow.add( heightInput );

    heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( heightRow );


	function update() {
        // Get values from the UI inputs
        const radiusIn = radiusInInput.getValue();
        const radiusOut = radiusOutInput.getValue();
        const innerStereo = innerStereoInput.getValue();
        const outerStereo = outerStereoInput.getValue();
        const pdz = heightInput.getValue();
        
        // Create new geometry with the correct parameter order
		editor.execute( new SetGeometryCommand( editor, object, new aHyperboloidGeometry(
            radiusIn, 
            radiusOut, 
            innerStereo, 
            outerStereo, 
            pdz
        )));
	}

	return container;
}

export { GeometryParametersPanel };