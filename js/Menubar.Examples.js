import * as THREE from 'three';

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { UIPanel, UIRow } from './libs/ui.js';

import monkeyUrl from '/examples/monkey.stl';
import kidneyUrl from '/examples/kidney.stl';
import skullUrl from '/examples/skull.glb';
import brainUrl from '/examples/brain.glb';

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
		{ title: 'menubar/examples/Arkanoid', file: 'arkanoid.app.json' },
		{ title: 'menubar/examples/Camera', file: 'camera.app.json' },
		{ title: 'menubar/examples/Particles', file: 'particles.app.json' },
		{ title: 'menubar/examples/Pong', file: 'pong.app.json' },
		{ title: 'menubar/examples/Shaders', file: 'shaders.app.json' }
	];

	const loader = new THREE.FileLoader
	const stlLoader = new STLLoader();
	const gltfLoader = new GLTFLoader();

	const optionKidney = new UIRow();
	optionKidney.setClass( 'option' );
	optionKidney.setTextContent( strings.getKey( items[0].title ) );
	optionKidney.onClick( function () {
		stlLoader.load(kidneyUrl, function (geometry) {
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
			mesh.name = strings.getKey( items[0].title );
			editor.scene.add( mesh );
			console.log("Kidney Model added to scene", mesh, editor.scene)
		});
	})
	
	options.add( optionKidney );

	
	const optionMonkey = new UIRow();
	optionMonkey.setClass( 'option' );
	optionMonkey.setTextContent( strings.getKey( items[1].title ) );
	optionMonkey.onClick( function () {
		stlLoader.load(monkeyUrl, function (geometry) {
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
			mesh.name = strings.getKey( items[1].title);
			editor.scene.add( mesh );
			console.log("Monkey Model added to scene", mesh, editor.scene)
		});
	})
	
	options.add( optionMonkey );

	
	const optionBrain = new UIRow();
	optionBrain.setClass( 'option' );
	optionBrain.setTextContent( strings.getKey( items[2].title ) );
	optionBrain.onClick( function () {
		gltfLoader.load(brainUrl, function (gltf) {
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
			gltf.scene.name = strings.getKey( items[2].title );
			editor.scene.add( gltf.scene );
			console.log("Brain Model added to scene", gltf.scene, editor.scene)
		});
	})
	
	options.add( optionBrain );

		
	const optionSkull = new UIRow();
	optionSkull.setClass( 'option' );
	optionSkull.setTextContent( strings.getKey( items[3].title ) );
	optionSkull.onClick( function () {
		gltfLoader.load(brainUrl, function (gltf) {
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
			gltf.scene.name = strings.getKey( items[3].title );
			editor.scene.add( gltf.scene );
			console.log("Skull Model added to scene", gltf.scene, editor.scene)
		});
	})
	
	options.add( optionSkull );

	return container;

}

export { MenubarExamples };
