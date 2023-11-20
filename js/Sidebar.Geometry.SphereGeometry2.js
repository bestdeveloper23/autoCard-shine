import * as THREE from 'three';

import { UIDiv, UIRow, UIText, UIInteger, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// radius

	const radiusRow = new UIRow();
	const radius = new UINumber(parameters.radius).setRange(0, Infinity).onChange(update);

	radiusRow.add(new UIText(strings.getKey('sidebar/geometry/sphere_geometry/radius')).setWidth('90px'));
	radiusRow.add(radius);

	container.add(radiusRow);

	//

	function update() {

		console.log(radius.getValue())
		let geometry = new THREE.SphereGeometry(radius.getValue(), 32, 16, 0, Math.PI * 2, 0, Math.PI);
		geometry.type = 'SphereGeometry2';

		editor.execute(new SetGeometryCommand(editor, object, geometry));

	}

	return container;

}

export { GeometryParametersPanel };
