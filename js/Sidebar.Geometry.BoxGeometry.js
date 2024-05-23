import * as THREE from 'three';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// width

	const widthRow = new UIRow();
	const width = new UINumber( parameters.width ).onChange( update );

	widthRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/width' ) ).setWidth( '90px' ) );
	widthRow.add( width );

	widthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( widthRow );

	// height

	const heightRow = new UIRow();
	const height = new UINumber( parameters.height ).onChange( update );

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/height' ) ).setWidth( '90px' ) );
	heightRow.add( height );

	heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( heightRow );

	// depth

	const depthRow = new UIRow();
	const depth = new UINumber( parameters.depth ).onChange( update );

	depthRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/depth' ) ).setWidth( '90px' ) );
	depthRow.add( depth );

	depthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( depthRow );

	// widthSegments

	// const widthSegmentsRow = new UIRow();
	// const widthSegments = new UIInteger( parameters.widthSegments ).setRange( 1, Infinity ).onChange( update );

	// widthSegmentsRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/widthseg' ) ).setWidth( '90px' ) );
	// widthSegmentsRow.add( widthSegments );

	// container.add( widthSegmentsRow );

	// // heightSegments

	// const heightSegmentsRow = new UIRow();
	// const heightSegments = new UIInteger( parameters.heightSegments ).setRange( 1, Infinity ).onChange( update );

	// heightSegmentsRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/heightseg' ) ).setWidth( '90px' ) );
	// heightSegmentsRow.add( heightSegments );

	// container.add( heightSegmentsRow );

	// // depthSegments

	// const depthSegmentsRow = new UIRow();
	// const depthSegments = new UIInteger( parameters.depthSegments ).setRange( 1, Infinity ).onChange( update );

	// depthSegmentsRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/depthseg' ) ).setWidth( '90px' ) );
	// depthSegmentsRow.add( depthSegments );

	// container.add( depthSegmentsRow );

	//

	function update() {

		// we need to new each geometry module

		const geometry = new THREE.BoxGeometry(width.getValue() * 2, height.getValue() * 2, depth.getValue() * 2, 1, 1, 1);

		geometry.name = object.geometry.name;
        
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        mesh.rotateX(Math.PI/2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        
        mesh.geometry.type = "BoxGeometry";
        const param = {depth: depth.getValue(), depthSegments: 1, height: height.getValue(), heightSegments: 1, width: width.getValue(), widthSegments: 1};
        mesh.geometry.parameters = param;

		editor.execute( new SetGeometryCommand( editor, object, geometry ) );

	}

	return container;

}

export { GeometryParametersPanel };
