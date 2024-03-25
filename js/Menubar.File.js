import * as  THREE from 'three';

import { zipSync, strToU8 } from 'three/addons/libs/fflate.module.js';

import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

import { GDMLLoader } from './libs/GDMLLoader.js';

function MenubarFile( editor ) {

	const config = editor.config;
	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu' );

	const title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/file' ) );
	container.add( title );

	const options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// New

	let option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/new' ) );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();

		}

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Import

	const form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	const fileInput = document.createElement( 'input' );
	fileInput.multiple = false;
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function () {
		let file = fileInput.files[0];
		let fileName = file.name;
		let fileExtension = fileName.split('.').pop().toLowerCase(); // Extract file extension
		let url = URL.createObjectURL(file);
		if (fileExtension === 'gdml') {
			var gdmlLoader = new GDMLLoader();
			gdmlLoader.load(url, function(objects) {
				const bbox = new THREE.Box3().setFromObject(objects);

				// Determine the size you want the model to fit in
				const desiredSize = 5; // Example: Make the longest side 5 units long
			
				// Calculate the model's current size
				const size = new THREE.Vector3();
				bbox.getSize(size);
			
				// Determine the scale factor
				const maxDimension = Math.max(size.x, size.y, size.z);
				const scaleFactor = desiredSize / maxDimension;
			
				// Scale the model
				objects.scale.set(scaleFactor, scaleFactor, scaleFactor);
				editor.scene.add( objects );
			});
			// Handle GDML file specifically
		} else {
			editor.loader.loadFiles(fileInput.files);
		}
		form.reset(); // Make sure 'form' is defined and accessible

	} );
	form.appendChild( fileInput );

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/import' ) );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Export GT

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geant4' ) );
	option.onClick( async function () {

		const object = editor.selected;

		console.log(object)
		var txt = `:volu world BOX 10. 10. 10. G4_AIR\n\n`;
		const rotated = object.rotation;
		const rotateX = rotated.x * 180 / Math.PI;
		const rotateY = rotated.y * 180 / Math.PI;
		const rotateZ = rotated.z * 180 / Math.PI;

		txt += `:rotm r000 ${rotateX.toFixed(2)} ${rotateY.toFixed(2)} ${rotateZ.toFixed(2)}\n\n`;

		if ( object !== null && object.isMesh != undefined ) {
			switch (object.name) {
				case "Box":

					txt += `:solid box BOX ${object.geometry.parameters.width} ${object.geometry.parameters.depth} ${object.geometry.parameters.height}\n\n`
					txt += `:volu mybox box ${object.material.name.elementType}\n\n`
					txt += `:place mybox 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;

				case "Sphere":

					txt += `:solid mysphere SPHERE ${object.geometry.parameters.radius} ${object.geometry.parameters.phiStart} ${object.geometry.parameters.phiLength} ${object.geometry.parameters.thetaStart} ${object.geometry.parameters.thetaLength}\n\n`
					txt += `:volu mysphere mysphere ${object.material.name.elementType}\n\n`
					txt += `:place mysphere 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;

				case "Tubs":
					
					txt += `:solid mytub TUBS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
					txt += `:volu mytub mytub ${object.material.name.elementType}\n\n`
					txt += `:place mytub 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;

				case "CTubs":

					txt += `:solid mytub TUBS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.parameters.geometry.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
					txt += `:volu mytub mytub ${object.geometry.parameters.pRMin}\n\n`
					txt += `:place mytub 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;

				case "Cone":

					txt += `:solid mycone CONS ${object.geometry.parameters.pRMin1} ${object.geometry.parameters.pRMin2} ${object.geometry.parameters.pRMax1} ${object.geometry.parameters.pRMax2} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
					txt += `:volu mycone mycone ${object.material.name.elementType}\n\n`
					txt += `:place mycone 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;

				case "Parallelepiped":

					txt += `:solid mypara PARA ${object.geometry.parameters.dx} ${object.geometry.parameters.dy} ${object.geometry.parameters.dz} ${object.geometry.parameters.alpha} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi}\n\n`
					txt += `:volu mypara mypara ${object.material.name.elementType}\n\n`
					txt += `:place mypara 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;

				case "TrapeZoid":
					
					txt += `:solid mytrd TRD ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dz}\n\n`
					txt += `:volu mytrd mytrd ${object.material.name.elementType}\n\n`
					txt += `:place mytrd 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n\n`
					break;

				case "aTrapeZoidP": 

					txt += `:solid mytrdp TRAP ${object.geometry.parameters.dz} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.alpha} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dx3} ${object.geometry.parameters.dx4}\n\n`
					txt += `:volu mytrdp mytrdp ${object.material.name.elementType}\n\n`
					txt += `:place mytrdp 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;

				case "aTorus":

					txt += `:solid mytorus TORUS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pRTor} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.sDPhi}\n\n`
					txt += `:volu mytorus mytorus ${object.material.name.elementType}\n\n`
					txt += `:place mytorus 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;
				
				case "EllipeCylnder":

					txt += `:solid myellipT ELLIPTICAL_TUBE ${object.geometry.parameters.xSemiAxis} ${object.geometry.parameters.semiAxisY} ${object.geometry.parameters.Dz}\n\n`
					txt += `:volu myellipT myellipT ${object.manager.name.elementType}\n\n`
					txt += `:place myellipT 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					break;
				
				default:

					break;
			}
		}

		// TODO: Change to DRACOExporter's parse( geometry, onParse )?
		downloadGeant4File( txt, 'box.gt')

	} );
	options.add( option );

	// Export GDML
	
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/gdml' ) );
	option.onClick( async function () {

		const object = editor.selected;
		
		const rotated = object.rotation;
		const rotateX = rotated.x * 180 / Math.PI;
		const rotateY = rotated.y * 180 / Math.PI;
		const rotateZ = rotated.z * 180 / Math.PI;

		let gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
		gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
		gdml += `  <define>\n`;
		gdml += `    <materials>\n`;
		gdml += `      <material name="Air" state="gas">\n`;
		gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
		gdml += `        <composite n="1">\n`;
		gdml += `          <fraction ref="N" n="0.7"/>\n`;
		gdml += `          <fraction ref="O" n="0.3"/>\n`;
		gdml += `        </composite>\n`;
		gdml += `        <T value="293.15" unit="K"/>\n`;
		gdml += `      </material>\n`;
		gdml += `    </materials>\n`;
		gdml += `    <solids>\n`;
		gdml += `      <box name="boxSolid" x="${object.geometry.parameters.width}" y="${object.geometry.parameters.depth}" z="${object.geometry.parameters.height}" lunit="m"/>\n`; // Adjust size as needed
		gdml += `    </solids>\n`;
		gdml += `  </define>\n`;
		gdml += `  <structure>\n`;
		gdml += `    <volume name="world">\n`;
		gdml += `      <materialref ref="Air"/>\n`;
		gdml += `      <solidref ref="boxSolid"/>\n`;
		gdml += `      <physvol>\n`;
		gdml += `        <volumeref ref="boxVolume"/>\n`;
		gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
		gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
		gdml += `      </physvol>\n`;
		gdml += `    </volume>\n`;
		gdml += `    <volume name="boxVolume">\n`;
		gdml += `      <materialref ref="Air"/>\n`;
		gdml += `      <solidref ref="boxSolid"/>\n`;
		gdml += `    </volume>\n`;
		gdml += `  </structure>\n`;
		gdml += `  <setup>\n`;
		gdml += `    <world ref="world"/>\n`;
		gdml += `  </setup>\n`;
		gdml += `</gdml>\n`;
		
		downloadGeant4File( gdml, 'box.gdml')

	} );
	options.add( option );
	

	// Export Macro
	
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/mac' ) );
	option.onClick( async function () {

		console.log(editor.scene)
		var object = null;
		editor.scene.traverse( function ( node ) {
			if(node.name === 'RadiationSource'){
				object = node;
			}
		})
		
		// const object = editor.selected;

		if(object) {
			const position = object.position
			var sourceShape;
	
			switch (object.source) {
				case 'Point':
					
					sourceShape = null;
					break;
	
				case "Plane":
	
					sourceShape = object.planeshape;
					break;
	
				case "Beam":
	
					sourceShape = null;
					break;
	
				case "Surface":
	
					sourceShape = object.volumeshape;
					break;
	
				case "Volume":
	
					sourceShape = object.volumeshape;
					break;
	
				default:
					break;
			}
	
			let macro = `# Macro test2.g4mac`;
			macro += `/gps/particle ${object.energykind}\n`
			macro += `/gps/energy ${object.energysize}\n`
			macro += `/gps/pos/centre ${position.x} ${position.y} ${position.z} m\n`
			macro += `/gps/pos/type ${object.source}\n`
			if(sourceShape) macro += `/gps/pos/shape ${sourceShape}\n`
			macro += `/gps/pos/halfx ${object.halfX}\n`
			macro += `/gps/pos/halfy ${object.halfY}\n`
			macro += `/gps/pos/halfz ${object.halfZ}\n`
			macro += `/gps/pos/inner_radius ${object.innerradius}\n`
			macro += `/gps/pos/outer_radius ${object.outerradius}\n`
	
			downloadGeant4File( macro, 'box.mac')
	
		} else {
			alert( 'The added source could not be found.');
		}
		
	} );
	options.add( option );


	// Export Geometry	

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geometry' ) );
	option.onClick( function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		const geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		let output = geometry.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'geometry.json' );

	} );
	options.add( option );

	// Export Object

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/object' ) );
	option.onClick( function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		let output = object.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'model.json' );

	} );
	options.add( option );

	// Export Scene

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/scene' ) );
	option.onClick( function () {

		let output = editor.scene.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'scene.json' );

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Export DRC

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/drc' ) );
	option.onClick( async function () {

		const object = editor.selected;

		if ( object === null || object.isMesh === undefined ) {

			alert( 'No mesh selected' );
			return;

		}

		const { DRACOExporter } = await import( 'three/addons/exporters/DRACOExporter.js' );

		const exporter = new DRACOExporter();

		const options = {
			decodeSpeed: 5,
			encodeSpeed: 5,
			encoderMethod: DRACOExporter.MESH_EDGEBREAKER_ENCODING,
			quantization: [ 16, 8, 8, 8, 8 ],
			exportUvs: true,
			exportNormals: true,
			exportColor: object.geometry.hasAttribute( 'color' )
		};

		// TODO: Change to DRACOExporter's parse( geometry, onParse )?
		const result = exporter.parse( object, options );
		saveArrayBuffer( result, 'model.drc' );

	} );
	options.add( option );

	// Export GLB

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/glb' ) );
	option.onClick( async function () {

		const scene = editor.scene;
		const animations = getAnimations( scene );

		const { GLTFExporter } = await import( 'three/addons/exporters/GLTFExporter.js' );

		const exporter = new GLTFExporter();

		exporter.parse( scene, function ( result ) {

			saveArrayBuffer( result, 'scene.glb' );

		}, undefined, { binary: true, animations: animations } );

	} );
	options.add( option );

	// Export GLTF

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/gltf' ) );
	option.onClick( async function () {

		const scene = editor.scene;
		const animations = getAnimations( scene );

		const { GLTFExporter } = await import( 'three/addons/exporters/GLTFExporter.js' );

		const exporter = new GLTFExporter();

		exporter.parse( scene, function ( result ) {

			saveString( JSON.stringify( result, null, 2 ), 'scene.gltf' );

		}, undefined, { animations: animations } );


	} );
	options.add( option );

	// Export OBJ

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/obj' ) );
	option.onClick( async function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		const { OBJExporter } = await import( 'three/addons/exporters/OBJExporter.js' );

		const exporter = new OBJExporter();

		saveString( exporter.parse( object ), 'model.obj' );

	} );
	options.add( option );

	// Export PLY (ASCII)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/ply' ) );
	option.onClick( async function () {

		const { PLYExporter } = await import( 'three/addons/exporters/PLYExporter.js' );

		const exporter = new PLYExporter();

		exporter.parse( editor.scene, function ( result ) {

			saveArrayBuffer( result, 'model.ply' );

		} );

	} );
	options.add( option );

	// Export PLY (Binary)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/ply_binary' ) );
	option.onClick( async function () {

		const { PLYExporter } = await import( 'three/addons/exporters/PLYExporter.js' );

		const exporter = new PLYExporter();

		exporter.parse( editor.scene, function ( result ) {

			saveArrayBuffer( result, 'model-binary.ply' );

		}, { binary: true } );

	} );
	options.add( option );

	// Export STL (ASCII)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/stl' ) );
	option.onClick( async function () {

		const { STLExporter } = await import( 'three/addons/exporters/STLExporter.js' );

		const exporter = new STLExporter();

		saveString( exporter.parse( editor.scene ), 'model.stl' );

	} );
	options.add( option );

	// Export STL (Binary)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/stl_binary' ) );
	option.onClick( async function () {

		const { STLExporter } = await import( 'three/addons/exporters/STLExporter.js' );

		const exporter = new STLExporter();

		saveArrayBuffer( exporter.parse( editor.scene, { binary: true } ), 'model-binary.stl' );

	} );
	options.add( option );

	// Export USDZ

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/usdz' ) );
	option.onClick( async function () {

		const { USDZExporter } = await import( 'three/addons/exporters/USDZExporter.js' );

		const exporter = new USDZExporter();

		saveArrayBuffer( await exporter.parse( editor.scene ), 'model.usdz' );

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Publish

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/publish' ) );
	option.onClick( function () {

		const toZip = {};

		//

		let output = editor.toJSON();
		output.metadata.type = 'App';
		delete output.history;

		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		toZip[ 'app.json' ] = strToU8( output );

		//

		const title = config.getKey( 'project/title' );

		const manager = new  THREE.LoadingManager( function () {

			const zipped = zipSync( toZip, { level: 9 } );

			const blob = new Blob( [ zipped.buffer ], { type: 'application/zip' } );

			save( blob, ( title !== '' ? title : 'untitled' ) + '.zip' );

		} );

		const loader = new  THREE.FileLoader( manager );
		loader.load( 'js/libs/app/index.html', function ( content ) {

			content = content.replace( '<!-- title -->', title );

			const includes = [];

			content = content.replace( '<!-- includes -->', includes.join( '\n\t\t' ) );

			let editButton = '';

			if ( config.getKey( 'project/editable' ) ) {

				editButton = [
					'			let button = document.createElement( \'a\' );',
					'			button.href = \'https://threejs.org/editor/#file=\' + location.href.split( \'/\' ).slice( 0, - 1 ).join( \'/\' ) + \'/app.json\';',
					'			button.style.cssText = \'position: absolute; bottom: 20px; right: 20px; padding: 10px 16px; color: #fff; border: 1px solid #fff; border-radius: 20px; text-decoration: none;\';',
					'			button.target = \'_blank\';',
					'			button.textContent = \'EDIT\';',
					'			document.body.appendChild( button );',
				].join( '\n' );

			}

			content = content.replace( '\t\t\t/* edit button */', editButton );

			toZip[ 'index.html' ] = strToU8( content );

		} );
		loader.load( 'js/libs/app.js', function ( content ) {

			toZip[ 'js/app.js' ] = strToU8( content );

		} );
		loader.load( '../build/three.module.js', function ( content ) {

			toZip[ 'js/three.module.js' ] = strToU8( content );

		} );
		loader.load( '../examples/jsm/webxr/VRButton.js', function ( content ) {

			toZip[ 'js/VRButton.js' ] = strToU8( content );

		} );

	} );
	options.add( option );

	//

	const link = document.createElement( 'a' );
	function save( blob, filename ) {

		if ( link.href ) {

			URL.revokeObjectURL( link.href );

		}

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.dispatchEvent( new MouseEvent( 'click' ) );

	}

	function saveArrayBuffer( buffer, filename ) {

		save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

	}

	function downloadGeant4File(text, filename) {
		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
	
		URL.revokeObjectURL(url); // release the Blob URL
	}

	function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

	function getAnimations( scene ) {

		const animations = [];

		scene.traverse( function ( object ) {

			animations.push( ... object.animations );

		} );

		return animations;

	}

	return container;

}

export { MenubarFile };
