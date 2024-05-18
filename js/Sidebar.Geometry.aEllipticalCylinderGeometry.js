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

	container.add( xSemiAxisRow );

	// ySemiAxis

	const ySemiAxisRow = new UIRow();
	const ySemiAxisI = new UINumber( parameters.semiAxisY ).setRange(0, Infinity).onChange( update );

	ySemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/ySemiAxis' ) ).setWidth( '90px' ) );
	ySemiAxisRow.add( ySemiAxisI );

	container.add( ySemiAxisRow );

	// height

	const dzRow = new UIRow();
	const dzI = new UINumber( parameters.Dz ).setRange(0, Infinity).onChange( update );

	dzRow.add( new UIText( strings.getKey( 'sidebar/geometry/aecylinder_geometry/dz' ) ).setWidth( '90px' ) );
	dzRow.add( dzI );

	container.add( dzRow );
	//

	function update() {

		var xSemiAxis = xSemiAxisI.getValue(), semiAxisY = ySemiAxisI.getValue(), Dz = dzI.getValue();
		const ratioZ = semiAxisY / xSemiAxis;
		const cylindergeometry = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz, 32, 1, false, 0, Math.PI * 2);
		const cylindermesh = new THREE.Mesh(cylindergeometry, new THREE.MeshStandardMaterial());
		
		cylindermesh.scale.z = ratioZ;
		cylindermesh.updateMatrix();
		const aCSG = CSG.fromMesh(cylindermesh);
		const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

		const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
		finalMesh.geometry.parameters = param;
		finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
        finalMesh.rotateX(Math.PI / 2);
		finalMesh.name = 'EllipeCylnder';
		finalMesh.updateMatrix();

		editor.execute( new SetGeometryCommand( editor, object, finalMesh.geometry ) );

	}

	return container;

}

export { GeometryParametersPanel };
