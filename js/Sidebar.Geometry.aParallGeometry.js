import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// width

	const widthRow = new UIRow();
	const width = new UINumber( parameters.dx ).setRange(0, Infinity).onChange( update );

	widthRow.add( new UIText( strings.getKey( 'sidebar/geometry/aparall_geometry/dx' ) ).setWidth( '90px' ) );
	widthRow.add( width );

  widthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( widthRow );

	// height

	const heightRow = new UIRow();
	const height = new UINumber( parameters.dy ).setRange(0, Infinity).onChange( update );

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/aparall_geometry/dy' ) ).setWidth( '90px' ) );
	heightRow.add( height );

  heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( heightRow );

	// depth

	const depthRow = new UIRow();
	const depth = new UINumber( parameters.dz ).setRange(0, Infinity).onChange( update );

	depthRow.add( new UIText( strings.getKey( 'sidebar/geometry/aparall_geometry/dz' ) ).setWidth( '90px' ) );
	depthRow.add( depth );

  depthRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

	container.add( depthRow );

	// alpha

	const alphaRow = new UIRow();
	const alphaI = new UINumber( parameters.alpha ).setRange( -90, 90 ).onChange( update );

	alphaRow.add( new UIText( strings.getKey( 'sidebar/geometry/aparall_geometry/alpha' ) ).setWidth( '90px' ) );
	alphaRow.add( alphaI );

	container.add( alphaRow );

	// theta

	const thetaRow = new UIRow();
	const thetaI = new UINumber( parameters.theta ).setRange( -90, 90 ).onChange( update );

	thetaRow.add( new UIText( strings.getKey( 'sidebar/geometry/aparall_geometry/theta' ) ).setWidth( '90px' ) );
	thetaRow.add( thetaI );

	container.add( thetaRow );

	// phi

	const phiRow = new UIRow();
	const phiI = new UINumber( parameters.phi ).setRange( -90, 90 ).onChange( update );

	phiRow.add( new UIText( strings.getKey( 'sidebar/geometry/aparall_geometry/phi' ) ).setWidth( '90px' ) );
	phiRow.add( phiI );

	container.add( phiRow );

	//

	function update() {

		// we need to new each geometry module

		const dx = width.getValue(), dy = height.getValue(), dz = depth.getValue(), alpha = alphaI.getValue(), theta = thetaI.getValue(), phi = phiI.getValue();
  const maxRadius = Math.max(dx, dy, dz);
  const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

  const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
  const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

  let MeshCSG1 = CSG.fromMesh(mesh);
  let MeshCSG3 = CSG.fromMesh(boxmesh);

  boxmesh.geometry.translate(2 * maxRadius, 0, 0);
  boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
  boxmesh.position.set(0 + dx / 2, 0, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  let aCSG = MeshCSG1.subtract(MeshCSG3);

  boxmesh.rotation.set(0, 0, 0);
  boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
  boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
  boxmesh.position.set(0 - dx / 2, 0, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  boxmesh.rotation.set(0, 0, 0);
  boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
  boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
  boxmesh.position.set(0, 0, dz / 2);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  boxmesh.rotation.set(0, 0, 0);
  boxmesh.geometry.translate(0, 0, -4 * maxRadius);
  boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
  boxmesh.position.set(0, 0, -dz / 2);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  boxmesh.rotation.set(0, 0, 0);
  boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
  boxmesh.position.set(0, dy / 2, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);

  boxmesh.geometry.translate(0, -4 * maxRadius, 0);
  boxmesh.position.set(0, - dy / 2, 0);
  boxmesh.updateMatrix();
  MeshCSG3 = CSG.fromMesh(boxmesh);
  aCSG = aCSG.subtract(MeshCSG3);
  
  const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
  const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': alpha, 'theta': theta, 'phi': phi };
  finalMesh.geometry.parameters = param;
  finalMesh.geometry.type = 'aParallGeometry';
  finalMesh.rotateX(Math.PI / 2);
  finalMesh.name = 'Parallelepiped';
  
  finalMesh.geometry.name = object.geometry.name;
  
  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));
	}

	return container;

}

export { GeometryParametersPanel };
