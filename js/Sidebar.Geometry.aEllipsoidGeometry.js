import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UIInteger, UICheckbox, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateEllipsoid } from './libs/CSG/Ellipsoid.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// xSemiAxis

	const xSemiAxisRow = new UIRow();
	const xSemiAxisI = new UINumber( parameters.xSemiAxis ).setRange(0, Infinity).onChange( update );

	xSemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/xSemiAxis' ) ).setWidth( '90px' ) );
	xSemiAxisRow.add( xSemiAxisI );

  xSemiAxisRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( xSemiAxisRow );

	// ySemiAxis

	const ySemiAxisRow = new UIRow();
	const ySemiAxisI = new UINumber( parameters.ySemiAxis ).setRange(0, Infinity).onChange( update );

	ySemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/ySemiAxis' ) ).setWidth( '90px' ) );
	ySemiAxisRow.add( ySemiAxisI );

  ySemiAxisRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( ySemiAxisRow );

	
	// zSemiAxis

	const zSemiAxisRow = new UIRow();
	const zSemiAxisI = new UINumber( parameters.zSemiAxis ).setRange(0, Infinity).onChange( update );

	zSemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/zSemiAxis' ) ).setWidth( '90px' ) );
	zSemiAxisRow.add( zSemiAxisI );

  zSemiAxisRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( zSemiAxisRow );

	// height

	const dzTopCutRow = new UIRow();
	const dzTopCutI = new UINumber( parameters.zTopCut ).setRange(0, Infinity).onChange( update );

	dzTopCutRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/ztopcut' ) ).setWidth( '90px' ) );
	dzTopCutRow.add( dzTopCutI );

  dzTopCutRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( dzTopCutRow );

	// bottomcut
	
	const dzBottomCutRow = new UIRow();
	const dzBottomCutI = new UINumber( parameters.zBottomCut ).onChange( update );

	dzBottomCutRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/zbottomcut' ) ).setWidth( '90px' ) );
	dzBottomCutRow.add( dzBottomCutI );

  dzBottomCutRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( dzBottomCutRow );


	function update() {

    var xSemiAxis = xSemiAxisI.getValue(), ySemiAxis = ySemiAxisI.getValue(), zSemiAxis = zSemiAxisI.getValue(), zTopCut = dzTopCutI.getValue(), zBottomCut = dzBottomCutI.getValue();
		if(Math.max(Math.abs(zTopCut), Math.abs(zBottomCut))>= zSemiAxis || xSemiAxis < 0.2 || ySemiAxis < 0.2) return;

    dzBottomCutI.setRange(-Infinity, zTopCut);
    dzTopCutI.setRange(zBottomCut, Infinity)
    const finalMesh = CreateEllipsoid( xSemiAxis , ySemiAxis , zSemiAxis , zTopCut , zBottomCut )

   finalMesh.geometry.name = object.geometry.name;
  
		editor.execute( new SetGeometryCommand( editor, object, finalMesh.geometry ) );

	}

	return container;

}

export { GeometryParametersPanel };
