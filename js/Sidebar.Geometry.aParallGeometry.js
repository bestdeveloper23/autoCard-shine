import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
// import { CreateParallelepiped } from './libs/CSG/Parallelepiped.js';
// import { aParallelepipedGeometry } from './libs/geometry/aParallelepipedGeometry.js';
import { aParallGeometry } from './libs/geometry/aParallGeometry.js';

function GeometryParametersPanel(editor, object) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// width

	const widthRow = new UIRow();
	const width = new UINumber(parameters.dx).setRange(0, Infinity).onChange(update);

	widthRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/dx')).setWidth('90px'));
	widthRow.add(width);

	widthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add(widthRow);

	// height

	const heightRow = new UIRow();
	const height = new UINumber(parameters.dy).setRange(0, Infinity).onChange(update);

	heightRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/dy')).setWidth('90px'));
	heightRow.add(height);

	heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add(heightRow);

	// depth

	const depthRow = new UIRow();
	const depth = new UINumber(parameters.dz).setRange(0, Infinity).onChange(update);

	depthRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/dz')).setWidth('90px'));
	depthRow.add(depth);

	depthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add(depthRow);

	// alpha

	const alphaRow = new UIRow();
	const alphaI = new UINumber(parameters.alpha).setRange(-90, 90).onChange(update);

	alphaRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/alpha')).setWidth('90px'));
	alphaRow.add(alphaI);
	alphaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

	container.add(alphaRow);

	// theta

	const thetaRow = new UIRow();
	const thetaI = new UINumber(parameters.theta).setRange(-90, 90).onChange(update);

	thetaRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/theta')).setWidth('90px'));
	thetaRow.add(thetaI);
	thetaRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

	container.add(thetaRow);

	// phi

	const phiRow = new UIRow();
	const phiI = new UINumber(parameters.phi).setRange(-90, 90).onChange(update);

	phiRow.add(new UIText(strings.getKey('sidebar/geometry/aparall_geometry/phi')).setWidth('90px'));
	phiRow.add(phiI);
	phiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

	container.add(phiRow);

	//

	function update() {

		const dx = width.getValue(), dy = height.getValue(), dz = depth.getValue(), alpha = - alphaI.getValue(), theta = - thetaI.getValue(), phi = - phiI.getValue();
		editor.execute(new SetGeometryCommand(editor, object, new aParallGeometry(dx, dy, dz, alpha, theta, phi)));

	}

	return container;

}

export { GeometryParametersPanel };
