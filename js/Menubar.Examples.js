import * as THREE from 'three';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { UIPanel, UIRow } from './libs/ui.js';

function MenubarExamples( editor ) {

	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu' );

	const title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/examples' ) );
	container.add( title );

	const options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// Examples

	const items = [
		{ title: 'menubar/examples/kidney', file: 'kidney.stl' },
		{ title: 'menubar/examples/monkey', file: 'monkey.stl' },
		{ title: 'menubar/examples/brain', file: 'brain.glb' },
		{ title: 'menubar/examples/skull', file: 'skull.glb' },
	];

	const objLoader = new THREE.FileLoader
	const stlLoader = new STLLoader();
	const gltfLoader = new GLTFLoader();

	for ( let i = 0; i < items.length; i ++ ) {

		( function ( i ) {

			const item = items[ i ];
			const fileFormat = item.file.split('.').pop();
			console.log(fileFormat);
			const option = new UIRow();
			option.setClass( 'option' );
			option.setTextContent( strings.getKey( item.title ) );

			const itemName = strings.getKey( item.title );

			option.onClick( function () {


					if(fileFormat === 'obj') {
						objLoader.load('examples/' + item.file, function (object) {
							const bbox = new THREE.Box3().setFromObject(object);

							// Determine the size you want the model to fit in
							const desiredSize = 5; // Example: Make the longest side 5 units long
						
							// Calculate the model's current size
							const size = new THREE.Vector3();
							bbox.getSize(size);
						
							// Determine the scale factor
							const maxDimension = Math.max(size.x, size.y, size.z);
							const scaleFactor = desiredSize / maxDimension;
						
							// Scale the model
							object.scale.set(scaleFactor, scaleFactor, scaleFactor);
							object.name = itemName;
							editor.scene.add( object );
							console.log("Obj Model added to scene", object, editor.scene)
						});
						
					} else if (fileFormat === 'stl') {
						stlLoader.load('examples/' + item.file, function (geometry) {
							const material = new THREE.MeshNormalMaterial();
							const mesh = new THREE.Mesh(geometry, material);
							
							mesh.position.set(0, 0, 0); // Set to (0, 0, 0) for center anchor
							mesh.updateMatrixWorld(); // Ensure the scene's matrix is up-to-date
							const bbox = new THREE.Box3().setFromObject(mesh);

							const center = bbox.getCenter(new THREE.Vector3());
							mesh.geometry.center(); // Set the geometry's center

							// Determine the size you want the model to fit in
							const desiredSize = 5; // Example: Make the longest side 5 units long
						
							// Calculate the model's current size
							const size = new THREE.Vector3();
							bbox.getSize(size);
						
							// Determine the scale factor
							const maxDimension = Math.max(size.x, size.y, size.z);
							const scaleFactor = desiredSize / maxDimension;
						
							// Scale the model
							mesh.scale.set(scaleFactor, scaleFactor, scaleFactor);
							mesh.name = itemName;
							editor.scene.add( mesh );
							console.log("STL Model added to scene", mesh, editor.scene)
						});
					} else if (fileFormat === 'glb' || fileFormat === 'gltf') {
						gltfLoader.load('examples/' + item.file, function (gltf) {
							const bbox = new THREE.Box3().setFromObject(gltf.scene);

							// Determine the size you want the model to fit in
							const desiredSize = 5; // Example: Make the longest side 5 units long
						
							// Calculate the model's current size
							const size = new THREE.Vector3();
							bbox.getSize(size);
						
							// Determine the scale factor
							const maxDimension = Math.max(size.x, size.y, size.z);
							const scaleFactor = desiredSize / maxDimension;
						
							// Scale the model
							gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor);
							gltf.scene.name = itemName;
							editor.scene.add( gltf.scene );
							console.log("GLB Model added to scene", gltf.scene, editor.scene)
						});
					}
					// loader.load( 'examples/' + item.file, function ( text ) {

					// 	editor.clear();
					// 	editor.fromJSON( JSON.parse( text ) );

					// } );


			} );
			options.add( option );

		} )( i );

	}

	return container;

}

export { MenubarExamples };
