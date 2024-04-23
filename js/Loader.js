import * as THREE from 'three';

import { TGALoader } from 'three/addons/loaders/TGALoader.js';

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import { SetSceneCommand } from './commands/SetSceneCommand.js';

import { LoaderUtils } from './LoaderUtils.js';

import { unzipSync, strFromU8 } from 'three/addons/libs/fflate.module.js';

function Loader( editor ) {

	const scope = this;

	this.texturePath = '';

	this.loadItemList = function ( items ) {

		LoaderUtils.getFilesFromItemList( items, function ( files, filesMap ) {

			scope.loadFiles( files, filesMap );

		} );

	};

	this.loadFiles = function ( files, filesMap ) {

		if ( files.length > 0 ) {

			filesMap = filesMap || LoaderUtils.createFilesMap( files );

			const manager = new THREE.LoadingManager();
			manager.setURLModifier( function ( url ) {

				url = url.replace( /^(\.?\/)/, '' ); // remove './'

				const file = filesMap[ url ];

				if ( file ) {

					console.log( 'Loading', url );

					return URL.createObjectURL( file );

				}

				return url;

			} );

			manager.addHandler( /\.tga$/i, new TGALoader() );

			for ( let i = 0; i < files.length; i ++ ) {

				scope.loadFile( files[ i ], manager );

			}

		}

	};

	this.loadFile = function ( file, manager ) {

		const filename = file.name;
		const extension = filename.split( '.' ).pop().toLowerCase();

		const reader = new FileReader();
		reader.addEventListener( 'progress', function ( event ) {

			const size = '(' + Math.floor( event.total / 1000 ).format() + ' KB)';
			const progress = Math.floor( ( event.loaded / event.total ) * 100 ) + '%';

			console.log( 'Loading', filename, size, progress );

		} );

		switch ( extension ) {

			case '3dm':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { Rhino3dmLoader } = await import( 'three/addons/loaders/3DMLoader.js' );

					const loader = new Rhino3dmLoader();
					loader.setLibraryPath( 'three/examples/jsm/libs/rhino3dm/' );
					loader.parse( contents, function ( object ) {

						object.name = filename;

						editor.execute( new AddObjectCommand( editor, object ) );

					}, function ( error ) {

						console.error( error )

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case '3ds':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { TDSLoader } = await import( 'three/addons/loaders/TDSLoader.js' );

					const loader = new TDSLoader();
					const object = loader.parse( event.target.result );

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case '3mf':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { ThreeMFLoader } = await import( 'three/addons/loaders/3MFLoader.js' );

					const loader = new ThreeMFLoader();
					const object = loader.parse( event.target.result );

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'amf':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { AMFLoader } = await import( 'three/addons/loaders/AMFLoader.js' );

					const loader = new AMFLoader();
					const amfobject = loader.parse( event.target.result );

					editor.execute( new AddObjectCommand( editor, amfobject ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'dae':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { ColladaLoader } = await import( 'three/addons/loaders/ColladaLoader.js' );

					const loader = new ColladaLoader( manager );
					const collada = loader.parse( contents );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( editor, collada.scene ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'drc':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );

					const loader = new DRACOLoader();
					loader.setDecoderPath( 'three/examples/jsm/libs/draco/' );
					loader.parse( contents, function ( geometry ) {

						let object;

						if ( geometry.index !== null ) {

							const material = new THREE.MeshStandardMaterial();

							object = new THREE.Mesh( geometry, material );
							object.name = filename;

						} else {

							const material = new THREE.PointsMaterial( { size: 0.01 } );
							material.vertexColors = geometry.hasAttribute( 'color' );

							object = new THREE.Points( geometry, material );
							object.name = filename;

						}

						loader.dispose();
						editor.execute( new AddObjectCommand( editor, object ) );

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'fbx':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { FBXLoader } = await import( 'three/addons/loaders/FBXLoader.js' );

					const loader = new FBXLoader( manager );
					const object = loader.parse( contents );

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'glb':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );
					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
					const { KTX2Loader } = await import( 'three/addons/loaders/KTX2Loader.js' );
					const { MeshoptDecoder } = await import( 'three/addons/libs/meshopt_decoder.module.js' );

					const dracoLoader = new DRACOLoader();
					dracoLoader.setDecoderPath( 'three/examples/jsm/libs/draco/gltf/' );

					const ktx2Loader = new KTX2Loader();
					ktx2Loader.setTranscoderPath( 'three/examples/jsm/libs/basis/' );

					const loader = new GLTFLoader();
					loader.setDRACOLoader( dracoLoader );
					loader.setKTX2Loader( ktx2Loader );
					loader.setMeshoptDecoder( MeshoptDecoder );
					loader.parse( contents, '', function ( result ) {

						const scene = result.scene;
						scene.name = filename;

						scene.animations.push( ...result.animations );
						editor.execute( new AddObjectCommand( editor, scene ) );

						dracoLoader.dispose();

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'gltf':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
					const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );
					const { KTX2Loader } = await import( 'three/addons/loaders/KTX2Loader.js' );
					const { MeshoptDecoder } = await import( 'three/addons/libs/meshopt_decoder.module.js' );

					const dracoLoader = new DRACOLoader();
					dracoLoader.setDecoderPath( 'three/examples/jsm/libs/draco/gltf/' );

					const ktx2Loader = new KTX2Loader();
					ktx2Loader.setTranscoderPath( 'three/examples/jsm/libs/basis/' );

					const loader = new GLTFLoader( manager );
					loader.setDRACOLoader( dracoLoader );
					loader.setKTX2Loader( ktx2Loader );
					loader.setMeshoptDecoder( MeshoptDecoder );

					loader.parse( contents, '', function ( result ) {

						const scene = result.scene;
						scene.name = filename;

						scene.animations.push( ...result.animations );
						editor.execute( new AddObjectCommand( editor, scene ) );

						dracoLoader.dispose();

					} );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'js':
			case 'json':

			{

				reader.addEventListener( 'load', function ( event ) {

					const contents = event.target.result;

					// 2.0

					if ( contents.indexOf( 'postMessage' ) !== - 1 ) {

						const blob = new Blob( [ contents ], { type: 'text/javascript' } );
						const url = URL.createObjectURL( blob );

						const worker = new Worker( url );

						worker.onmessage = function ( event ) {

							event.data.metadata = { version: 2 };
							handleJSON( event.data );

						};

						worker.postMessage( Date.now() );

						return;

					}

					// >= 3.0

					let data;

					try {

						data = JSON.parse( contents );

					} catch ( error ) {

						alert( error );
						return;

					}

					handleJSON( data );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'kmz':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { KMZLoader } = await import( 'three/addons/loaders/KMZLoader.js' );

					const loader = new KMZLoader();
					const collada = loader.parse( event.target.result );

					collada.scene.name = filename;

					editor.execute( new AddObjectCommand( editor, collada.scene ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'ldr':
			case 'mpd':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const { LDrawLoader } = await import( 'three/addons/loaders/LDrawLoader.js' );

					const loader = new LDrawLoader();
					loader.setPath( 'three/examples/models/ldraw/officialLibrary/' );
					loader.parse( event.target.result, function ( group ) {

						group.name = filename;
						// Convert from LDraw coordinates: rotate 180 degrees around OX
						group.rotation.x = Math.PI;

						editor.execute( new AddObjectCommand( editor, group ) );

					} );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'md2':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { MD2Loader } = await import( 'three/addons/loaders/MD2Loader.js' );

					const geometry = new MD2Loader().parse( contents );
					const material = new THREE.MeshStandardMaterial();

					const mesh = new THREE.Mesh( geometry, material );
					mesh.mixer = new THREE.AnimationMixer( mesh );
					mesh.name = filename;

					mesh.animations.push( ...geometry.animations );
					editor.execute( new AddObjectCommand( editor, mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'obj':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { OBJLoader } = await import( 'three/addons/loaders/OBJLoader.js' );

					const object = new OBJLoader().parse( contents );
					object.name = filename;

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'pcd':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { PCDLoader } = await import( 'three/examples/jsm/loaders/PCDLoader.js' );

					const points = new PCDLoader().parse( contents );
					points.name = filename;

					editor.execute( new AddObjectCommand( editor, points ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'ply':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { PLYLoader } = await import( 'three/addons/loaders/PLYLoader.js' );

					const geometry = new PLYLoader().parse( contents );
					let object;

					if ( geometry.index !== null ) {

						const material = new THREE.MeshStandardMaterial();

						object = new THREE.Mesh( geometry, material );
						object.name = filename;

					} else {

						const material = new THREE.PointsMaterial( { size: 0.01 } );
						material.vertexColors = geometry.hasAttribute( 'color' );

						object = new THREE.Points( geometry, material );
						object.name = filename;

					}

					editor.execute( new AddObjectCommand( editor, object ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'stl':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { STLLoader } = await import( 'three/addons/loaders/STLLoader.js' );

					const geometry = new STLLoader().parse( contents );
					const material = new THREE.MeshStandardMaterial();

					const mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( editor, mesh ) );

				}, false );

				if ( reader.readAsBinaryString !== undefined ) {

					reader.readAsBinaryString( file );

				} else {

					reader.readAsArrayBuffer( file );

				}

				break;

			}

			case 'svg':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { SVGLoader } = await import( 'three/addons/loaders/SVGLoader.js' );

					const loader = new SVGLoader();
					const paths = loader.parse( contents ).paths;

					//

					const group = new THREE.Group();
					group.scale.multiplyScalar( 0.1 );
					group.scale.y *= - 1;

					for ( let i = 0; i < paths.length; i ++ ) {

						const path = paths[ i ];

						const material = new THREE.MeshBasicMaterial( {
							color: path.color,
							depthWrite: false
						} );

						const shapes = SVGLoader.createShapes( path );

						for ( let j = 0; j < shapes.length; j ++ ) {

							const shape = shapes[ j ];

							const geometry = new THREE.ShapeGeometry( shape );
							const mesh = new THREE.Mesh( geometry, material );

							group.add( mesh );

						}

					}

					editor.execute( new AddObjectCommand( editor, group ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'usdz':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { USDZLoader } = await import( 'three/examples/jsm/loaders/USDZLoader.js' );

					const group = new USDZLoader().parse( contents );
					group.name = filename;

					editor.execute( new AddObjectCommand( editor, group ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'vox':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { VOXLoader, VOXMesh } = await import( 'three/addons/loaders/VOXLoader.js' );

					const chunks = new VOXLoader().parse( contents );

					const group = new THREE.Group();
					group.name = filename;

					for ( let i = 0; i < chunks.length; i ++ ) {

						const chunk = chunks[ i ];

						const mesh = new VOXMesh( chunk );
						group.add( mesh );

					}

					editor.execute( new AddObjectCommand( editor, group ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'vtk':
			case 'vtp':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { VTKLoader } = await import( 'three/addons/loaders/VTKLoader.js' );

					const geometry = new VTKLoader().parse( contents );
					const material = new THREE.MeshStandardMaterial();

					const mesh = new THREE.Mesh( geometry, material );
					mesh.name = filename;

					editor.execute( new AddObjectCommand( editor, mesh ) );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'wrl':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { VRMLLoader } = await import( 'three/addons/loaders/VRMLLoader.js' );

					const result = new VRMLLoader().parse( contents );

					editor.execute( new SetSceneCommand( editor, result ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'xyz':

			{

				reader.addEventListener( 'load', async function ( event ) {

					const contents = event.target.result;

					const { XYZLoader } = await import( 'three/addons/loaders/XYZLoader.js' );

					const geometry = new XYZLoader().parse( contents );

					const material = new THREE.PointsMaterial();
					material.vertexColors = geometry.hasAttribute( 'color' );

					const points = new THREE.Points( geometry, material );
					points.name = filename;

					editor.execute( new AddObjectCommand( editor, points ) );

				}, false );
				reader.readAsText( file );

				break;

			}

			case 'zip':

			{

				reader.addEventListener( 'load', function ( event ) {

					handleZIP( event.target.result );

				}, false );
				reader.readAsArrayBuffer( file );

				break;

			}

			case 'tg': 

			{

				reader.addEventListener( 'load', function ( event ) {

					handleTG( event.target.result );

				}, false);
				reader.readAsText(file);

				break;

			}

			default:

				console.error( 'Unsupported file format (' + extension + ').' );

				break;

		}

	};

	function handleJSON( data ) {

		if ( data.metadata === undefined ) { // 2.0

			data.metadata = { type: 'Geometry' };

		}

		if ( data.metadata.type === undefined ) { // 3.0

			data.metadata.type = 'Geometry';

		}

		if ( data.metadata.formatVersion !== undefined ) {

			data.metadata.version = data.metadata.formatVersion;

		}

		switch ( data.metadata.type.toLowerCase() ) {

			case 'buffergeometry':

			{

				const loader = new THREE.BufferGeometryLoader();
				const result = loader.parse( data );

				const mesh = new THREE.Mesh( result );

				editor.execute( new AddObjectCommand( editor, mesh ) );

				break;

			}

			case 'geometry':

				console.error( 'Loader: "Geometry" is no longer supported.' );

				break;

			case 'object':

			{

				const loader = new THREE.ObjectLoader();
				loader.setResourcePath( scope.texturePath );

				loader.parse( data, function ( result ) {

					if ( result.isScene ) {

						editor.execute( new SetSceneCommand( editor, result ) );

					} else {

						editor.execute( new AddObjectCommand( editor, result ) );

					}

				} );

				break;

			}

			case 'app':

				editor.fromJSON( data );

				break;

		}

	}

	async function handleZIP( contents ) {

		const zip = unzipSync( new Uint8Array( contents ) );

		// Poly

		if ( zip[ 'model.obj' ] && zip[ 'materials.mtl' ] ) {

			const { MTLLoader } = await import( 'three/addons/loaders/MTLLoader.js' );
			const { OBJLoader } = await import( 'three/addons/loaders/OBJLoader.js' );

			const materials = new MTLLoader().parse( strFromU8( zip[ 'materials.mtl' ] ) );
			const object = new OBJLoader().setMaterials( materials ).parse( strFromU8( zip[ 'model.obj' ] ) );
			editor.execute( new AddObjectCommand( editor, object ) );

		}

		//

		for ( const path in zip ) {

			const file = zip[ path ];

			const manager = new THREE.LoadingManager();
			manager.setURLModifier( function ( url ) {

				const file = zip[ url ];

				if ( file ) {

					console.log( 'Loading', url );

					const blob = new Blob( [ file.buffer ], { type: 'application/octet-stream' } );
					return URL.createObjectURL( blob );

				}

				return url;

			} );

			const extension = path.split( '.' ).pop().toLowerCase();

			switch ( extension ) {

				case 'fbx':

				{

					const { FBXLoader } = await import( 'three/addons/loaders/FBXLoader.js' );

					const loader = new FBXLoader( manager );
					const object = loader.parse( file.buffer );

					editor.execute( new AddObjectCommand( editor, object ) );

					break;

				}

				case 'glb':

				{

					const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );
					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
					const { KTX2Loader } = await import( 'three/addons/loaders/KTX2Loader.js' );
					const { MeshoptDecoder } = await import( 'three/addons/libs/meshopt_decoder.module.js' );

					const dracoLoader = new DRACOLoader();
					dracoLoader.setDecoderPath( 'three/examples/jsm/libs/draco/gltf/' );

					const ktx2Loader = new KTX2Loader();
					ktx2Loader.setTranscoderPath( 'three/examples/jsm/libs/basis/' );

					const loader = new GLTFLoader();
					loader.setDRACOLoader( dracoLoader );
					loader.setKTX2Loader( ktx2Loader );
					loader.setMeshoptDecoder( MeshoptDecoder );

					loader.parse( file.buffer, '', function ( result ) {

						const scene = result.scene;

						scene.animations.push( ...result.animations );
						editor.execute( new AddObjectCommand( editor, scene ) );

						dracoLoader.dispose();

					} );

					break;

				}

				case 'gltf':

				{

					const { GLTFLoader } = await import( 'three/addons/loaders/GLTFLoader.js' );
					const { DRACOLoader } = await import( 'three/addons/loaders/DRACOLoader.js' );
					const { KTX2Loader } = await import( 'three/addons/loaders/KTX2Loader.js' );
					const { MeshoptDecoder } = await import( 'three/addons/libs/meshopt_decoder.module.js' );

					const dracoLoader = new DRACOLoader();
					dracoLoader.setDecoderPath( 'three/examples/jsm/libs/draco/gltf/' );

					const ktx2Loader = new KTX2Loader();
					ktx2Loader.setTranscoderPath( 'three/examples/jsm/libs/basis/' );

					const loader = new GLTFLoader();
					loader.setDRACOLoader( dracoLoader );
					loader.setKTX2Loader( ktx2Loader );
					loader.setMeshoptDecoder( MeshoptDecoder );
					
					loader.parse( strFromU8( file ), '', function ( result ) {

						const scene = result.scene;

						scene.animations.push( ...result.animations );
						editor.execute( new AddObjectCommand( editor, scene ) );

						dracoLoader.dispose();

					} );

					break;

				}

			}

		}

	}

	async function handleTG( contents ){
		console.log( contents.split("\n") );
		const tgText = contents.split("\n");

		let solidText = {};
		let rotationText = {};
		let volumeText = {};
		let placementText = {};

		tgText.forEach(rowtext => {
			
			const wordArray = rowtext.split(' ');
			const identify = wordArray[0];
			
			switch ( identify ){

				case ':rotm':

					{
						const rotmName = wordArray[1];

						let newRotation = new THREE.Vector3(0, 0, 0);

						const x = Number(wordArray[2]);
						const y = Number(wordArray[3]);
						const z = Number(wordArray[4]);

						newRotation.set(x, y, z);

						rotationText[rotmName] = newRotation;

						console.log(rotationText[rotmName]);
					}

					break;

				case ':solid':

					{
						const solidName = wordArray[1];
						const solidType = wordArray[2];

						// set the new mesh 

						switch (object.name) {
							case "BOX":
			
								solidText1 += `:solid ${object.name}_${object.uuid} BOX ${object.geometry.parameters.width} ${object.geometry.parameters.depth} ${object.geometry.parameters.height}\n`
								
								break;
			
							case "SPHERE":
			
								solidText1 += `:solid ${object.name}_${object.uuid} SPHERE ${object.geometry.parameters.radius} ${object.geometry.parameters.phiStart} ${object.geometry.parameters.phiLength} ${object.geometry.parameters.thetaStart} ${object.geometry.parameters.thetaLength}\n`
								
								break;
			
							case "TUBS":
								
								solidText1 += `:solid ${object.name}_${object.uuid} TUBS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
								
								break;
			
							case "TUBS":
			
								solidText1 += `:solid ${object.name}_${object.uuid} TUBS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
								
								break;
			
							case "CONS":
			
								solidText1 += `:solid ${object.name}_${object.uuid} CONS ${object.geometry.parameters.pRMin1} ${object.geometry.parameters.pRMin2} ${object.geometry.parameters.pRMax1} ${object.geometry.parameters.pRMax2} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
								
								break;
			
							case "PARA":
			
								solidText1 += `:solid ${object.name}_${object.uuid} PARA ${object.geometry.parameters.dx} ${object.geometry.parameters.dy} ${object.geometry.parameters.dz} ${object.geometry.parameters.alpha} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi}\n`
								
								break;
			
							case "TRD":
								
								solidText1 += `:solid ${object.name}_${object.uuid} TRD ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dz}\n`
								
								break;
			
							case "TRAP": 
			
								solidText1 += `:solid ${object.name}_${object.uuid} TRAP ${object.geometry.parameters.dz} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.alpha} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dx3} ${object.geometry.parameters.dx4} ${object.geometry.parameters.phi}\n`
								
								break;
			
							case "TORUS":
			
								solidText1 += `:solid ${object.name}_${object.uuid} TORUS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pRTor} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.sDPhi}\n`
								
								break;
							
							case "ELLIPTICAL_TUBE":
			
								solidText1 += `:solid ${object.name}_${object.uuid} ELLIPTICAL_TUBE ${object.geometry.parameters.xSemiAxis} ${object.geometry.parameters.semiAxisY} ${object.geometry.parameters.Dz}\n`
								
								break;
							
							case "ELLIPSOID":
			
								solidText1 += `:solid ${object.name}_${object.uuid} ELLIPSOID ${object.geometry.parameters.xSemiAxis} ${object.geometry.parameters.ySemiAxis} ${object.geometry.parameters.zSemiAxis} ${object.geometry.parameters.zBottomCut} ${object.geometry.parameters.zTopCut}\n`
								
								break;
			
							case "ELLIPTICAL_CONE":
			
								solidText1 += `:solid ${object.name}_${object.uuid} ELLIPTICAL_CONE ${object.geometry.parameters.xSemiAxis} ${object.geometry.parameters.ySemiAxis} ${object.geometry.parameters.height} ${object.geometry.parameters.zTopCut}\n`
								
								break;
			
							case "TWISTED_BOX":
			
								solidText1 += `:solid ${object.name}_${object.uuid} TWISTED_BOX ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.width} ${object.geometry.parameters.height} ${object.geometry.parameters.depth}\n`
								
								break;
			
							case "TWISTED_TRD":
			
								solidText1 += `:solid ${object.name}_${object.uuid} TWISTED_TRD ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dz} ${object.geometry.parameters.twistedangle}\n`
								
								break;
			
							case "TWISTED_TRAP":
			
								solidText1 += `:solid ${object.name}_${object.uuid} TWISTED_TRAP ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dz} ${object.geometry.parameters.theta} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dx3} ${object.geometry.parameters.dx4}\n`
								
								break;
			
							case "TWISTED_TUBS":
			
								solidText1 += `:solid ${object.name}_${object.uuid} TWISTED_TUBS ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pDPhi}\n`
								
								break;
			
							case "TET":
			
								solidText1 += `:solid ${object.name}_${object.uuid} TET ${object.geometry.parameters.anchor} ${object.geometry.parameters.p2} ${object.geometry.parameters.p3} ${object.geometry.parameters.p4}\n`
								
								break;
			
							case "HYPE":
			
								solidText1 += `:solid ${object.name}_${object.uuid} HYPE ${object.geometry.parameters.radiusIn} ${object.geometry.parameters.radiusOut} ${object.geometry.parameters.stereo1} ${object.geometry.parameters.stereo2} ${object.geometry.parameters.pDz}\n`
								
								break;
			
							case "POLYCONE":
			
								solidText1 += `:solid ${object.name}_${object.uuid} POLYCONE ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n`
								
								break;
			
							case "POLYHEDRA":
								
								solidText1 += `:solid ${object.name}_${object.uuid} POLYHEDRA ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numSide} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n`
								
								break;
							
							case "UNION":
			
								solidText1 += `:solid ${object.name}_${object.uuid} UNION ${object.childrenObject[0].name}_${object.childrenObject[1].uuid} ${object.childrenObject[1].name}_${object.childrenObject[1].uuid} ${object.name}_${object.uuid}_rot ${object.position.x} ${object.position.y} ${object.position.z}\n`
								break;
			
							case "SUBTRACTION":
			
								solidText1 += `:solid ${object.name}_${object.uuid} SUBTRACTION ${object.childrenObject[0].name}_${object.childrenObject[1].uuid} ${object.childrenObject[1].name}_${object.childrenObject[1].uuid} ${object.name}_${object.uuid}_rot ${object.position.x} ${object.position.y} ${object.position.z}\n`
								break;
								
							case "INTERSECTION":
			
								solidText1 += `:solid ${object.name}_${object.uuid} INTERSECTION ${object.childrenObject[0].name}_${object.childrenObject[1].uuid} ${object.childrenObject[1].name}_${object.childrenObject[1].uuid} ${object.name}_${object.uuid}_rot ${object.position.x} ${object.position.y} ${object.position.z}\n`
								break;
								
							default:
			
								break;
						}

					}

					break;

				case ':volu':

					{
						const voluName = wordArray[1];
						const solidName = wordArray[2];
						const materialName = wordArray[2];

						// set material of mesh


					}

					break;

				case ':place':

					{
						const voluName = wordArray[1];

						const worldName = wordArray[3];

						if ( worldName === 'world' ) {

							// rotationName 
							const rotmName = wordArray[4];

							// the Position of mesh

							const x = Number(wordArray[5]);
							const y = Number(wordArray[6]);
							const z = Number(wordArray[7]);

							const meshPosition = new THREE.Vector3(0, 0, 0);

							meshPosition.set(x, y, z);

							// setting the rotation and position of mesh


						}
					}

					break;

				default :

					break;
			}
		});
	}

}

export { Loader };
