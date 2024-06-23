import * as THREE from 'three';
import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';
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

	// Fixme: units should be selected by user from (cm, inch)
	const wunit = 10; // unit for width: cm (10 mm)
	const hunit = 10; // unit for height: cm (10 mm)
	const dunit = 10; // unit for depth: cm (10 mm)

	function update() {
		// we need to new each geometry module
		console.log(width.getValue())
		const geometry = new THREE.BoxGeometry(width.getValue() * 2 * wunit, height.getValue() * 2 * hunit, depth.getValue() * 2 * dunit);

		geometry.name = object.geometry.name;
        
        let mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
        mesh.rotateX(Math.PI/2);
        mesh.updateMatrix();
        let aCSG = CSG.fromMesh(mesh);
        mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        
        mesh.geometry.type = "BoxGeometry";
        const param = {width: width.getValue(), height: height.getValue(), depth: depth.getValue()};
        mesh.geometry.parameters = param;

		editor.execute( new SetGeometryCommand( editor, object, mesh.geometry ) );
	}

	return container;
}

export { GeometryParametersPanel };
