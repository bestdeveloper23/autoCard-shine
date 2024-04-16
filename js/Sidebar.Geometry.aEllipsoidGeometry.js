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

	xSemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/xSemiAxis' ) ).setWidth( '90px' ) );
	xSemiAxisRow.add( xSemiAxisI );

	container.add( xSemiAxisRow );

	// ySemiAxis

	const ySemiAxisRow = new UIRow();
	const ySemiAxisI = new UINumber( parameters.ySemiAxis ).setRange(0, Infinity).onChange( update );

	ySemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/ySemiAxis' ) ).setWidth( '90px' ) );
	ySemiAxisRow.add( ySemiAxisI );

	container.add( ySemiAxisRow );

	
	// zSemiAxis

	const zSemiAxisRow = new UIRow();
	const zSemiAxisI = new UINumber( parameters.zSemiAxis ).setRange(0, Infinity).onChange( update );

	zSemiAxisRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/zSemiAxis' ) ).setWidth( '90px' ) );
	zSemiAxisRow.add( zSemiAxisI );

	container.add( zSemiAxisRow );

	// height

	const dzTopCutRow = new UIRow();
	const dzTopCutI = new UINumber( parameters.zTopCut ).setRange(0, Infinity).onChange( update );

	dzTopCutRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/ztopcut' ) ).setWidth( '90px' ) );
	dzTopCutRow.add( dzTopCutI );

	container.add( dzTopCutRow );

	// bottomcut
	
	const dzBottomCutRow = new UIRow();
	const dzBottomCutI = new UINumber( parameters.zBottomCut ).onChange( update );

	dzBottomCutRow.add( new UIText( strings.getKey( 'sidebar/geometry/aellipsoid_geometry/zbottomcut' ) ).setWidth( '90px' ) );
	dzBottomCutRow.add( dzBottomCutI );

	container.add( dzBottomCutRow );


	function update() {

  var xSemiAxis = xSemiAxisI.getValue(), ySemiAxis = ySemiAxisI.getValue(), zSemiAxis = zSemiAxisI.getValue(), zTopCut = dzTopCutI.getValue(), zBottomCut = dzBottomCutI.getValue();
		if(Math.max(Math.abs(zTopCut), Math.abs(zBottomCut))>= zSemiAxis || xSemiAxis < 0.2 || ySemiAxis < 0.2) return;

  dzBottomCutI.setRange(-Infinity, zTopCut);
  dzTopCutI.setRange(zBottomCut, Infinity)
  const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, zTopCut - zBottomCut, 32, 256, false, 0, Math.PI * 2);

  cylindergeometry1.translate(0, (zTopCut + zBottomCut)/2, 0);

  let positionAttribute = cylindergeometry1.getAttribute('position');

  let vertex = new THREE.Vector3();

  function calculate_normal_vector(x, y, z, a, b, c){
    // Calculate the components of the normal vector
    let nx = 2 * (x / a**2)
    let ny = 2 * (y / b**2)
    let nz = 2 * (z / c**2)
    
    // Normalize the normal vector
    let magnitude = Math.sqrt(nx**2 + ny**2 + nz**2)
    nx /= magnitude
    ny /= magnitude
    nz /= magnitude
    let normal={x: nx, y: ny, z: nz};
    return normal;
 }
  for (let i = 0; i < positionAttribute.count; i++) {

   vertex.fromBufferAttribute(positionAttribute, i);
   let x, y, z;
   x = vertex.x, y = vertex.y;
   let k = 0;
   do {
    x = vertex.x + k;
    if(Math.abs(x)<0){
      x = vertex.x;
      break;
    }
    if (vertex.z > 0) {
     z = ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
    } else {
     z = -ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
    }
    if(x>0){
     k-=0.01 
    } else {
     k += 0.01;
    }
    
   } while (!z);


   cylindergeometry1.attributes.position.array[i * 3] = x;
   cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
   cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;
 
   let normal = calculate_normal_vector(x,y,z, xSemiAxis, zSemiAxis, ySemiAxis)
   cylindergeometry1.attributes.normal.array[i * 3] = normal.x;
   cylindergeometry1.attributes.normal.array[i * 3 + 1] = normal.y;
   cylindergeometry1.attributes.normal.array[i * 3 + 2] = normal.z;
 
  }
  cylindergeometry1.attributes.position.needsUpdate = true;

  const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

  const finalMesh = cylindermesh;
  const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'zSemiAxis': zSemiAxis, 'zTopCut': zTopCut, 'zBottomCut': zBottomCut };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aEllipsoidGeometry';
  finalMesh.rotateX(Math.PI / 2);
  finalMesh.updateMatrix();
  finalMesh.name = 'Ellipsoid';

		editor.execute( new SetGeometryCommand( editor, object, finalMesh.geometry ) );

	}

	return container;

}

export { GeometryParametersPanel };
