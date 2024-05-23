import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UIInteger, UICheckbox, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// xSemiAxis

	const xSemiAxisRow = new UIRow();
	const xSemiAxisI = new UINumber( parameters.xSemiAxis ).setRange(0, Infinity).onChange( update );

	xSemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/xSemiAxis' ) ).setWidth( '90px' ) );
	xSemiAxisRow.add( xSemiAxisI );

	xSemiAxisRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( xSemiAxisRow );

	// ySemiAxis

	const ySemiAxisRow = new UIRow();
	const ySemiAxisI = new UINumber( parameters.semiAxisY ).setRange(0, Infinity).onChange( update );

	ySemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/ySemiAxis' ) ).setWidth( '90px' ) );
	ySemiAxisRow.add( ySemiAxisI );

	ySemiAxisRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( ySemiAxisRow );

	// height

	const dzRow = new UIRow();
	const dzI = new UINumber( parameters.Dz ).setRange(0, Infinity).onChange( update );

	dzRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/dz' ) ).setWidth( '90px' ) );
	dzRow.add( dzI );

	dzRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( dzRow );
	//

	function update() {

		var xSemiAxis = xSemiAxisI.getValue(), semiAxisY = ySemiAxisI.getValue(), Dz = dzI.getValue();
		const ratioZ = semiAxisY / xSemiAxis;
		const cylindergeometry = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz * 2, 32, 1, false, 0, Math.PI * 2);
		const cylindermesh = new THREE.Mesh(cylindergeometry, new THREE.MeshBasicMaterial());
		
		cylindermesh.scale.z = ratioZ;
		cylindermesh.rotateX(Math.PI / 2);
        cylindermesh.updateMatrix();
		const aCSG = CSG.fromMesh(cylindermesh);
		const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

		const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
		finalMesh.geometry.parameters = param;
		finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
		finalMesh.name = 'EllipeCylnder';

		finalMesh.geometry.name = object.geometry.name;

		editor.execute( new SetGeometryCommand( editor, object, finalMesh.geometry ) );

	}

	return container;

}

export { GeometryParametersPanel };
