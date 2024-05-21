import * as THREE from 'three';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

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

	widthRow.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

	container.add( widthRow );

	// height

	const heightRow = new UIRow();
	const height = new UINumber( parameters.height ).onChange( update );

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/atwistedbox_geometry/height' ) ).setWidth( '90px' ) );
	heightRow.add( height );

	heightRow.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

	container.add( heightRow );

	// depth

	const depthRow = new UIRow();
	const depth = new UINumber( parameters.depth ).onChange( update );

	depthRow.add( new UIText( strings.getKey( 'sidebar/geometry/atwistedbox_geometry/depth' ) ).setWidth( '90px' ) );
	depthRow.add( depth );

	depthRow.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

	container.add( depthRow );

	// twistedangle

	const twistedangleRow = new UIRow();
	const twistedangleI = new UINumber( parameters.angle ).onChange( update );

	twistedangleRow.add( new UIText( strings.getKey( 'sidebar/geometry/atwistedbox_geometry/angle' ) ).setWidth( '90px' ) );
	twistedangleRow.add( twistedangleI );

	container.add( twistedangleRow );


	//

	function update() {

		// we need to new each geometry module

		const twistedangle = twistedangleI.getValue(), pDx = width.getValue(), pDy = height.getValue(), pDz = depth.getValue();

		
		const geometry = new THREE.BoxGeometry(pDx, pDy, pDz, 32, 32, 32);
		geometry.type = 'aTwistedBoxGeometry';
		const positionAttribute = geometry.getAttribute('position');

		let vec3 = new THREE.Vector3();
		let axis_vector = new THREE.Vector3(0, 1, 0);
		for (let i = 0; i < positionAttribute.count; i++) {
		vec3.fromBufferAttribute(positionAttribute, i);
		vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle / 180 * Math.PI);
		geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
		
		}
		
		const param = { 'width': pDx, 'height': pDy, 'depth': pDz, 'angle': twistedangle };
		geometry.parameters = param;
		geometry.name = object.geometry.name;

		editor.execute( new SetGeometryCommand( editor, object, geometry));

	}

	return container;

}

export { GeometryParametersPanel };
