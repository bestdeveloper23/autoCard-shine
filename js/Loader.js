import * as THREE from 'three';

import { TGALoader } from 'three/addons/loaders/TGALoader.js';

import { AddObjectCommand } from './commands/AddObjectCommand.js';
import { SetSceneCommand } from './commands/SetSceneCommand.js';

import { LoaderUtils } from './LoaderUtils.js';

import { unzipSync, strFromU8 } from 'three/addons/libs/fflate.module.js';
import { CSG } from './libs/CSGMesh.js';
import { PolyconeGeometry } from './libs/geometry/PolyconeGeometry.js';
import { PolyhedronGeometry } from './libs/geometry/PolyhedronGeometry.js';

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

		const tgText = contents.split("\n");

		let solidText = {};
		let rotationText = {};
		let volumeText = {};
		let placementText = {};
		let meshs = {};

    let solids = [];
    let rotations = [];
    let volumes = [];
    let places = [];

    tgText.forEach(rowtext => {
      const wordArray = rowtext.split(' ');
      const identify = wordArray[0];
      
      if( identify === ':solid' ) {
        solids.push(rowtext);
      }
    });

    solids.forEach( rowtext => {
      {
        const wordArray = rowtext.split(' ');
        const solidName = wordArray[1];
        const solidType = wordArray[2];

        solidText[solidName] = rowtext;
        // set the new mesh 
        console.log(solidName, solidType)

        switch (solidType) {
          case "BOX":
  
            {
              let x = Number(wordArray[3]);
              let y = Number(wordArray[4]);
              let z = Number(wordArray[5]);

              var geometry = new THREE.BoxGeometry(x, y, z);
              var material = new THREE.MeshNormalMaterial();

              var mesh = new THREE.Mesh(geometry, material);

              
              // set the name of mesh

              const meshName = solidName.split('_')[0];
              
              mesh.name = meshName;

              meshs[solidName] = mesh;

            }

            break;
  
          case "SPHERE":
  
            {
              const radius = Number(wordArray[3]);
              const startPhi = Number(wordArray[4]);
              const deltaPhi = Number(wordArray[5]);

              const geometry = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI);
              geometry.type = 'SphereGeometry2';
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const meshName = solidName.split('_')[0];
              
              mesh.name = meshName;	

              meshs[solidName] = mesh;

            }
            
            break;
  
          case "TUBS":
            
            {
              const pRMin = Number(wordArray[3]);
              const pRMax = Number(wordArray[4]);
              const pDz = Number(wordArray[5]);
              const SPhi = Number(wordArray[6]);
              const DPhi = Number(wordArray[7]);

              const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              cylindermesh1.rotateX(Math.PI / 2);
              cylindermesh1.updateMatrix();

              const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
              cylindermesh2.rotateX(Math.PI / 2);
              cylindermesh2.updateMatrix();

              const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, pDz);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
              const MeshCSG1 = CSG.fromMesh(cylindermesh1);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;
              aCSG = MeshCSG1.subtract(MeshCSG2);

              let bCSG;
              bCSG = MeshCSG1.subtract(MeshCSG2);

              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateZ(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aTubeGeometry';
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              
              finalMesh.name = meshName;	

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "CONS":

            {
              const pRmin1 = Number(wordArray[3]);
              const pRmin2 = Number(wordArray[4]);
              const pRmax1 = Number(wordArray[5]);
              const pRmax2 = Number(wordArray[6]);
              const pDz = Number(wordArray[7]);
              const SPhi = Number(wordArray[8]);
              const DPhi = Number(wordArray[9]);

              const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              cylindermesh1.rotateX(Math.PI / 2);
              cylindermesh1.updateMatrix();

              const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
              cylindermesh2.rotateX(Math.PI / 2);
              cylindermesh2.updateMatrix();

              const maxRadius = Math.max(pRmax1, pRmax2);
              const boxgeometry = new THREE.BoxGeometry(maxRadius, maxRadius, pDz);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate(maxRadius / 2, maxRadius / 2, 0);
              const MeshCSG1 = CSG.fromMesh(cylindermesh1);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;

              aCSG = MeshCSG2.subtract(MeshCSG1);

              let bCSG;

              bCSG = MeshCSG2.subtract(MeshCSG1);


              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateZ(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax1': pRmax1, 'pRMin1': pRmin1, 'pRMax2': pRmax2, 'pRMin2': pRmin2, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aConeGeometry';
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "PARA":
  
            {
              const dx = Number(wordArray[3]);
              const dy = Number(wordArray[4]);
              const dz = Number(wordArray[5]);
              const alpha = Number(wordArray[6]);
              const theta = Number(wordArray[7]);
              const phi = Number(wordArray[8]);

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
              finalMesh.rotateX(Math.PI/2);
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "TRD":
            
            {
              const x1 = Number(wordArray[3]);
              const x2 = Number(wordArray[4]);
              const y1 = Number(wordArray[5]);
              const y2 = Number(wordArray[6]);
              const z = Number(wordArray[7]);
              
              var trd = new THREE.BufferGeometry();

              const points = [
                new THREE.Vector3(-x2, -y2, z),//2
                new THREE.Vector3(-x2, y2, z),//1
                new THREE.Vector3(x2, y2, z),//0

                new THREE.Vector3(x2, y2, z),//0
                new THREE.Vector3(x2, -y2, z),//3
                new THREE.Vector3(-x2, -y2, z),//2

                new THREE.Vector3(x1, y1, -z),//4
                new THREE.Vector3(-x1, y1, -z),//5
                new THREE.Vector3(-x1, -y1, -z),//6

                new THREE.Vector3(-x1, -y1, -z),//6
                new THREE.Vector3(x1, -y1, -z),//7
                new THREE.Vector3(x1, y1, -z),//4

                new THREE.Vector3(x2, y2, z),//0
                new THREE.Vector3(x1, y1, -z),//4
                new THREE.Vector3(x1, -y1, -z),//7

                new THREE.Vector3(x1, -y1, -z),//7
                new THREE.Vector3(x2, -y2, z),//3
                new THREE.Vector3(x2, y2, z),//0

                new THREE.Vector3(-x2, y2, z),//1
                new THREE.Vector3(-x2, -y2, z),//2
                new THREE.Vector3(-x1, -y1, -z),//6

                new THREE.Vector3(-x1, -y1, -z),//6
                new THREE.Vector3(-x1, y1, -z),//5
                new THREE.Vector3(-x2, y2, z),//1

                new THREE.Vector3(-x2, y2, z),//1
                new THREE.Vector3(-x1, y1, -z),//5
                new THREE.Vector3(x1, y1, -z),//4

                new THREE.Vector3(x1, y1, -z),//4
                new THREE.Vector3(x2, y2, z),//0
                new THREE.Vector3(-x2, y2, z),//1

                new THREE.Vector3(-x2, -y2, z),//2
                new THREE.Vector3(x2, -y2, z),//3
                new THREE.Vector3(x1, -y1, -z),//7

                new THREE.Vector3(x1, -y1, -z),//7
                new THREE.Vector3(-x1, -y1, -z),//6
                new THREE.Vector3(-x2, -y2, z),//2
              ]

              trd.setFromPoints(points);

              const param = { 'dx1': x1, 'dy1': y1, 'dz': z, 'dx2': x2, 'dy2': y2 };
              trd.parameters = param;
              trd.type = 'aTrapeZoidGeometry';
              const finalMesh = new THREE.Mesh(trd, new THREE.MeshStandardMaterial())
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "TRAP": 
            
            {
              const pDz = Number(wordArray[3]);
              const pTheta = Number(wordArray[4]);
              const pPhi = Number(wordArray[5]);
              const pDy1 = Number(wordArray[6]);
              const pDx1 = Number(wordArray[7]);
              const pDx2 = Number(wordArray[8]);
              const pAlpha = Number(wordArray[9]);
              const pDy2 = Number(wordArray[10]);
              const pDx3 = Number(wordArray[11]);
              const pDx4 = Number(wordArray[12]);


              const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4,
               dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
              const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
              const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(mesh);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              boxmesh.geometry.translate(2 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 + dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              let aCSG = MeshCSG1.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 - dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
              boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
              boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, -dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);


              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aTrapeZoidPGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "TORUS":
  
            {
              const pRMin = Number(wordArray[3]);
              const pRMax = Number(wordArray[4]);
              const pRtor = Number(wordArray[5]);
              const SPhi = Number(wordArray[6]);
              const DPhi = Number(wordArray[7]);


              const torgeometry1 = new THREE.TorusGeometry(pRtor, pRMax, 16, 48);
              const tormesh1 = new THREE.Mesh(torgeometry1, new THREE.MeshStandardMaterial());
              tormesh1.rotateX(Math.PI / 2);
              tormesh1.updateMatrix();

              const torgeometry2 = new THREE.TorusGeometry(pRtor, pRMin, 16, 48);
              const tormesh2 = new THREE.Mesh(torgeometry2, new THREE.MeshStandardMaterial());
              tormesh2.rotateX(Math.PI / 2);
              tormesh2.updateMatrix();

              const boxgeometry = new THREE.BoxGeometry(pRtor + pRMax, pRtor + pRMax, pRtor + pRMax);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate((pRtor + pRMax) / 2, 0, (pRtor + pRMax) / 2);
              const MeshCSG1 = CSG.fromMesh(tormesh1);
              const MeshCSG2 = CSG.fromMesh(tormesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;
              aCSG = MeshCSG1.subtract(MeshCSG2);

              let bCSG;
              bCSG = MeshCSG1.subtract(MeshCSG2);

              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateY(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pRTor': pRtor, 'pSPhi': SPhi, 'pDPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aTorusGeometry';
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
          
          case "ELLIPTICAL_TUBE":
  
            {
              const xSemiAxis = Number(wordArray[3]);
              const semiAxisY = Number(wordArray[4]);
              const Dz = Number(wordArray[5]);

              const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz, 32, 1, false, 0, Math.PI * 2);
              const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              const ratioZ = semiAxisY / xSemiAxis;
              cylindermesh.scale.z = ratioZ;
              cylindermesh.updateMatrix();
              const aCSG = CSG.fromMesh(cylindermesh);
              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

              const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
          
          case "ELLIPSOID":
  
            {
              const xSemiAxis = Number(wordArray[3]);
              const ySemiAxis = Number(wordArray[4]);
              const zSemiAxis = Number(wordArray[5]);
              const zBottomCut = Number(wordArray[6]);
              const zTopCut = Number(wordArray[7]);


              const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, zTopCut - zBottomCut, 32, 256, false, 0, Math.PI * 2);

              cylindergeometry1.translate(0, (zTopCut + zBottomCut)/2, 0);

              let positionAttribute = cylindergeometry1.getAttribute('position');

              let vertex = new THREE.Vector3();

              function calculate_normal_vector(x, y, z, a, b, c) {
                // Calculate the components of the normal vector
                let nx = 2 * (x / a ** 2)
                let ny = 2 * (y / b ** 2)
                let nz = 2 * (z / c ** 2)

                // Normalize the normal vector
                let magnitude = Math.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
                nx /= magnitude
                ny /= magnitude
                nz /= magnitude
                let normal = { x: nx, y: ny, z: nz };
                return normal;
              }
              for (let i = 0; i < positionAttribute.count; i++) {

                vertex.fromBufferAttribute(positionAttribute, i);
                let x, y, z;
                x = vertex.x, y = vertex.y;
                let k = 0;
                do {
                  x = vertex.x + k;
                  if (Math.abs(x) < 0) {
                    x = vertex.x;
                    break;
                  }
                  if (vertex.z > 0) {
                    z = ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                  } else {
                    z = -ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                  }
                  if (x > 0) {
                    k -= 0.01
                  } else {
                    k += 0.01;
                  }

                } while (!z);


                cylindergeometry1.attributes.position.array[i * 3] = x;
                cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
                cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

                let normal = calculate_normal_vector(x, y, z, xSemiAxis, zSemiAxis, ySemiAxis)
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

              const meshName = solidName.split('_')[0];

              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "ELLIPTICAL_CONE":
  
            {
              const xSemiAxis = Number(wordArray[3]);
              const ySemiAxis = Number(wordArray[4]);
              const height = Number(wordArray[5]);
              const zTopCut = Number(wordArray[6]);


              const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * ((height - zTopCut) / height), xSemiAxis, zTopCut, 32, 32, false, 0, Math.PI * 2);
              cylindergeometry1.translate(0, zTopCut / 2, 0)
              const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              const ratioZ = ySemiAxis / xSemiAxis;

              cylindermesh.scale.z = ratioZ;
              cylindermesh.updateMatrix();
              const aCSG = CSG.fromMesh(cylindermesh);
              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

              const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'height': height, 'zTopCut': zTopCut };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aEllipticalConeGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];

              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "TWISTED_BOX":
  
            {
              const twistedangle = Number(wordArray[3]);
              const pDx = Number(wordArray[4]);
              const pDy = Number(wordArray[5]);
              const pDz = Number(wordArray[6]);

              const geometry = new THREE.BoxGeometry(pDx, pDy, pDz, 32, 32, 32);
              geometry.type = 'aTwistedBoxGeometry';
              const positionAttribute = geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle / 180 * Math.PI);
                geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              const param = { 'width': pDx, 'height': pDy, 'depth': pDz, 'angle': twistedangle };
              geometry.parameters = param;
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
              mesh.rotateX(Math.PI / 2);
              mesh.updateMatrix();

              const meshName = solidName.split('_')[0];

              mesh.name = meshName;

              meshs[solidName] = mesh;

            }
            
            break;
  
          case "TWISTED_TRD":
  
            {
              const dx1 = Number(wordArray[3]);
              const dx2 = Number(wordArray[4]);
              const dy1 = Number(wordArray[5]);
              const dy2 = Number(wordArray[6]);
              const dz = Number(wordArray[7]);
              const twistedangle = Number(wordArray[8]);


              const maxdis = Math.max(dx1, dy1, dx2, dy2, dz);
              const maxwidth = Math.max(dx1, dy1, dx2, dy2);
              const geometry = new THREE.BoxGeometry(maxwidth, dz, maxwidth, 32, 32, 32);
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(mesh);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let alpha = Math.atan((dx1 - dx2) / 2 / dz);
              let phi = Math.atan((dy1 - dy2) / 2 / dz);

              boxmesh.geometry.translate(maxdis, maxdis, 0);
              boxmesh.rotation.set(0, 0, phi);
              boxmesh.position.set(0 + dx1 / 2, -dz / 2, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              let aCSG = MeshCSG1.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(-2 * maxdis, 0, 0);
              boxmesh.rotation.set(0, 0, -phi);
              boxmesh.position.set(0 - dx1 / 2, -dz / 2, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(maxdis, 0, maxdis);
              boxmesh.rotation.set(-alpha, 0, 0);
              boxmesh.position.set(0, -dz / 2, dy1 / 2);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(0, 0, -2 * maxdis);
              boxmesh.rotation.set(alpha, 0, 0);
              boxmesh.position.set(0, -dz / 2, -dy1 / 2);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': twistedangle };
              finalMesh.geometry.parameters = param;

              const positionAttribute = finalMesh.geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
                finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              finalMesh.geometry.type = 'aTwistedTrdGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "TWISTED_TRAP":
            
            {
              const twistedangle = Number(wordArray[3]);
              const pDx1 = Number(wordArray[4]);
              const pDx2 = Number(wordArray[5]);
              const pDy1 = Number(wordArray[6]);
              const pDz = Number(wordArray[7]);

              ///////////////////////////////////////////////////// Please double check this angles ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

              const theta = Number(wordArray[8]);
              const pDy2 = Number(wordArray[9]);
              const pDx3 = Number(wordArray[10]);
              const pDx4 = Number(wordArray[11]);


              const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = theta, phi = theta;
              const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
              const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth, 32, 32, 32);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(mesh);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              boxmesh.geometry.translate(2 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 + dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              let aCSG = MeshCSG1.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 - dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
              boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
              boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, -dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);


              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi, 'twistedangle': twistedangle };
              finalMesh.geometry.parameters = param;

              const positionAttribute = finalMesh.geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
                finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              finalMesh.geometry.type = 'aTwistedTrapGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "TWISTED_TUBS":
  
            {
              const twistedangle = Number(wordArray[3])
              const pRMin = Number(wordArray[4]);
              const pRMax = Number(wordArray[5]);
              const pDz = Number(wordArray[6]);
              const DPhi = Number(wordArray[7]);
              const SPhi = 0;
              

              const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

              const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(pRMax, pDz, pRMax, 32, 32, 32);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
              const MeshCSG1 = CSG.fromMesh(cylindermesh1);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;
              aCSG = MeshCSG1.subtract(MeshCSG2);

              let bCSG;
              bCSG = MeshCSG1.subtract(MeshCSG2);

              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateY(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };
              finalMesh.geometry.parameters = param;

              const positionAttribute = finalMesh.geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
                finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              finalMesh.geometry.type = 'aTwistedTubeGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "TET":
  
            {
              let anchor = wordArray[3];
              let p2 = wordArray[4];
              let p3 = wordArray[5];
              let p4 = wordArray[6];


              function getArray(string) {
                return string.split(",").map(Number);
              }
    
              anchor = getArray(anchor);
              p2 = getArray(p2);
              p3 = getArray(p3);
              p4 = getArray(p4);
    
              var vertices = [], indices = [];
              vertices.push(...anchor, ...p2, ...p3, ...p4);
              indices.push(0, 1, 2, 0, 2, 1, 0, 2, 3, 0, 3, 2, 0, 1, 3, 0, 3, 1, 1, 2, 3, 1, 3, 2);
    
              // vertices = vertices.join("").match(/-?(?:\d+\.\d*|\.\d+|\d+)/g);
              console.log(vertices)
              const geometry = new THREE.PolyhedronGeometry(vertices, indices);
              const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
              geometry.parameters = param;
              geometry.type = 'aTetrahedraGeometry';
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
              mesh.name = 'Tetrahedra';
              mesh.rotateX(Math.PI / 2);
              mesh.updateMatrix();

              const meshName = solidName.split('_')[0];

              mesh.name = meshName;

              meshs[solidName] = mesh;

            }

            break;
  
          case "HYPE":
  
            {
              const radiusIn = Number(wordArray[3]);
              const radiusOut = Number(wordArray[4]);
              const stereo1 = Number(wordArray[5]);
              const stereo2 = Number(wordArray[6]);
              const pDz = Number(wordArray[7]);


              const c_z1 = Math.tan(stereo1 * Math.PI / 180 / 2);
              const c_z2 = Math.tan(stereo2 * Math.PI / 180 / 2);
              const cylindergeometry1 = new THREE.CylinderGeometry(radiusOut, radiusOut, pDz, 32, 16, false, 0, Math.PI * 2);
              const cylindergeometry2 = new THREE.CylinderGeometry(radiusIn, radiusIn, pDz, 32, 16, false, 0, Math.PI * 2);

              let positionAttribute = cylindergeometry1.getAttribute('position');
              let positionAttribute2 = cylindergeometry2.getAttribute('position');
              let vertex = new THREE.Vector3();
              let vertex2 = new THREE.Vector3();

              for (let i = 0; i < positionAttribute.count; i++) {

                vertex.fromBufferAttribute(positionAttribute, i);
                vertex2.fromBufferAttribute(positionAttribute2, i);
                let x, y, z, x2, y2, z2;
                x = vertex.x;
                y = vertex.y;
                z = vertex.z;
                x2 = vertex2.x;
                y2 = vertex2.y;
                z2 = vertex2.z;
                let r = radiusOut * Math.sqrt((1 + Math.pow((y / c_z1), 2)));
                let r2 = radiusIn * Math.sqrt((1 + Math.pow((y2 / c_z2), 2)));

                let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

                if (vertex.z >= 0) {
                  z = Math.abs(r * Math.sin(alpha));
                  z2 = Math.abs(r2 * Math.sin(alpha));
                } else {
                  z = - Math.abs(r * Math.sin(alpha));
                  z2 = - Math.abs(r2 * Math.sin(alpha));
                }
                if (vertex.x >= 0) {
                  x = r * Math.cos(alpha);
                  x2 = r2 * Math.cos(alpha);
                } else {
                  x = -r * Math.cos(alpha);
                  x2 = -r2 * Math.cos(alpha);
                }

                cylindergeometry1.attributes.position.array[i * 3] = x;
                cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
                cylindergeometry1.attributes.position.array[i * 3 + 2] = z;


                cylindergeometry2.attributes.position.array[i * 3] = x2;
                cylindergeometry2.attributes.position.array[i * 3 + 1] = y2;
                cylindergeometry2.attributes.position.array[i * 3 + 2] = z2;

              }
              cylindergeometry1.attributes.position.needsUpdate = true;
              cylindergeometry2.attributes.position.needsUpdate = true;

              const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

              const MeshCSG1 = CSG.fromMesh(cylindermesh);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);

              let aCSG = MeshCSG1.subtract(MeshCSG2);

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

              const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pDz };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aHyperboloidGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "POLYCONE":
  
            {

              let SPhi = Number(wordArray[3]);
              let DPhi = Number(wordArray[4]);
              let numZPlanes = Number(wordArray[5]);
              let z = wordArray[6];
              let rOuter = wordArray[7];
              let rInner = [];

              
              function getArray(string) {
                return string.split(",").map(Number);
              }
    
              rOuter = getArray(rOuter);
              z = getArray(z);
              
              const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, SPhi/180*Math.PI, DPhi/180*Math.PI);

              for (let i = 0; i < numZPlanes; i++) {
                rInner.push(0.000001);
              }

              const meshOut = new THREE.Mesh(geometryOut, material);
              let maxWidth = Math.max(...rOuter);
              let maxHeight = Math.max(...z);

              const boxgeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);

              const boxmesh = new THREE.Mesh(boxgeometry, material);
              boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

              let MeshCSG1 = CSG.fromMesh(meshOut);

              const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
              const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.computeVertexNormals();
              finalMesh.geometry.type = 'aPolyconeGeometry';
              finalMesh.updateMatrix();

              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }

            break;
  
          case "POLYHEDRA":
            
            {
              let SPhi = Number(wordArray[3]);
              let DPhi = Number(wordArray[4]);
              let numSide = Number(wordArray[5]);
              let numZPlanes = Number(wordArray[6]);
              let z = wordArray[7];
              let rOuter = wordArray[8];
              let rInner = [];
              
              
              function getArray(string) {
                return string.split(",").map(Number);
              }
    
              rOuter = getArray(rOuter);
              z = getArray(z);

              for (let i = 0; i < numZPlanes; i++) {
                rInner.push(0.000001);
              }

              const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI);

              const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(meshOut);

              const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
              const param = { 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.computeVertexNormals();
              finalMesh.geometry.type = 'aPolyhedraGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
          
          default:
  
            break;
        }

      }
    })

    function getBooleanMesh (rowtext) {
      const wordArray = rowtext.split(' ');
        const solidName = wordArray[1];
        const solidType = wordArray[2];

        solidText[solidName] = rowtext;
        // set the new mesh 
        console.log(solidName, solidType)

        switch (solidType) {
          case "BOX":
  
            {
              let x = Number(wordArray[3]);
              let y = Number(wordArray[4]);
              let z = Number(wordArray[5]);

              var geometry = new THREE.BoxGeometry(x, y, z);
              var material = new THREE.MeshNormalMaterial();

              var mesh = new THREE.Mesh(geometry, material);

              
              // set the name of mesh

              const meshName = solidName.split('_')[0];
              
              mesh.name = meshName;

              meshs[solidName] = mesh;
              return mesh;

            }

            break;
  
          case "SPHERE":
  
            {
              const radius = Number(wordArray[3]);
              const startPhi = Number(wordArray[4]);
              const deltaPhi = Number(wordArray[5]);

              const geometry = new THREE.SphereGeometry(radius, 32, 16, 0, Math.PI * 2, 0, Math.PI);
              geometry.type = 'SphereGeometry2';
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const meshName = solidName.split('_')[0];
              
              mesh.name = meshName;	

              meshs[solidName] = mesh;

              return mesh;

            }
            
            break;
  
          case "TUBS":
            
            {
              const pRMin = Number(wordArray[3]);
              const pRMax = Number(wordArray[4]);
              const pDz = Number(wordArray[5]);
              const SPhi = Number(wordArray[6]);
              const DPhi = Number(wordArray[7]);

              const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              cylindermesh1.rotateX(Math.PI / 2);
              cylindermesh1.updateMatrix();

              const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
              cylindermesh2.rotateX(Math.PI / 2);
              cylindermesh2.updateMatrix();

              const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, pDz);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
              const MeshCSG1 = CSG.fromMesh(cylindermesh1);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;
              aCSG = MeshCSG1.subtract(MeshCSG2);

              let bCSG;
              bCSG = MeshCSG1.subtract(MeshCSG2);

              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateZ(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aTubeGeometry';
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              
              finalMesh.name = meshName;	

              meshs[solidName] = finalMesh;

              return finalMesh;
            }
            
            break;
  
          case "CONS":

            {
              const pRmin1 = Number(wordArray[3]);
              const pRmin2 = Number(wordArray[4]);
              const pRmax1 = Number(wordArray[5]);
              const pRmax2 = Number(wordArray[6]);
              const pDz = Number(wordArray[7]);
              const SPhi = Number(wordArray[8]);
              const DPhi = Number(wordArray[9]);

              const cylindergeometry1 = new THREE.CylinderGeometry(pRmin1, pRmin2, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              cylindermesh1.rotateX(Math.PI / 2);
              cylindermesh1.updateMatrix();

              const cylindergeometry2 = new THREE.CylinderGeometry(pRmax1, pRmax2, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());
              cylindermesh2.rotateX(Math.PI / 2);
              cylindermesh2.updateMatrix();

              const maxRadius = Math.max(pRmax1, pRmax2);
              const boxgeometry = new THREE.BoxGeometry(maxRadius, maxRadius, pDz);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate(maxRadius / 2, maxRadius / 2, 0);
              const MeshCSG1 = CSG.fromMesh(cylindermesh1);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;

              aCSG = MeshCSG2.subtract(MeshCSG1);

              let bCSG;

              bCSG = MeshCSG2.subtract(MeshCSG1);


              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateZ(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateZ(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateZ(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax1': pRmax1, 'pRMin1': pRmin1, 'pRMax2': pRmax2, 'pRMin2': pRmin2, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aConeGeometry';
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
  
          case "PARA":
  
            {
              const dx = Number(wordArray[3]);
              const dy = Number(wordArray[4]);
              const dz = Number(wordArray[5]);
              const alpha = Number(wordArray[6]);
              const theta = Number(wordArray[7]);
              const phi = Number(wordArray[8]);

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
              finalMesh.rotateX(Math.PI/2);
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
  
          case "TRD":
            
            {
              const x1 = Number(wordArray[3]);
              const x2 = Number(wordArray[4]);
              const y1 = Number(wordArray[5]);
              const y2 = Number(wordArray[6]);
              const z = Number(wordArray[7]);
              
              var trd = new THREE.BufferGeometry();

              const points = [
                new THREE.Vector3(-x2, -y2, z),//2
                new THREE.Vector3(-x2, y2, z),//1
                new THREE.Vector3(x2, y2, z),//0

                new THREE.Vector3(x2, y2, z),//0
                new THREE.Vector3(x2, -y2, z),//3
                new THREE.Vector3(-x2, -y2, z),//2

                new THREE.Vector3(x1, y1, -z),//4
                new THREE.Vector3(-x1, y1, -z),//5
                new THREE.Vector3(-x1, -y1, -z),//6

                new THREE.Vector3(-x1, -y1, -z),//6
                new THREE.Vector3(x1, -y1, -z),//7
                new THREE.Vector3(x1, y1, -z),//4

                new THREE.Vector3(x2, y2, z),//0
                new THREE.Vector3(x1, y1, -z),//4
                new THREE.Vector3(x1, -y1, -z),//7

                new THREE.Vector3(x1, -y1, -z),//7
                new THREE.Vector3(x2, -y2, z),//3
                new THREE.Vector3(x2, y2, z),//0

                new THREE.Vector3(-x2, y2, z),//1
                new THREE.Vector3(-x2, -y2, z),//2
                new THREE.Vector3(-x1, -y1, -z),//6

                new THREE.Vector3(-x1, -y1, -z),//6
                new THREE.Vector3(-x1, y1, -z),//5
                new THREE.Vector3(-x2, y2, z),//1

                new THREE.Vector3(-x2, y2, z),//1
                new THREE.Vector3(-x1, y1, -z),//5
                new THREE.Vector3(x1, y1, -z),//4

                new THREE.Vector3(x1, y1, -z),//4
                new THREE.Vector3(x2, y2, z),//0
                new THREE.Vector3(-x2, y2, z),//1

                new THREE.Vector3(-x2, -y2, z),//2
                new THREE.Vector3(x2, -y2, z),//3
                new THREE.Vector3(x1, -y1, -z),//7

                new THREE.Vector3(x1, -y1, -z),//7
                new THREE.Vector3(-x1, -y1, -z),//6
                new THREE.Vector3(-x2, -y2, z),//2
              ]

              trd.setFromPoints(points);

              const param = { 'dx1': x1, 'dy1': y1, 'dz': z, 'dx2': x2, 'dy2': y2 };
              trd.parameters = param;
              trd.type = 'aTrapeZoidGeometry';
              const finalMesh = new THREE.Mesh(trd, new THREE.MeshStandardMaterial())
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
  
          case "TRAP": 
            
            {
              const pDz = Number(wordArray[3]);
              const pTheta = Number(wordArray[4]);
              const pPhi = Number(wordArray[5]);
              const pDy1 = Number(wordArray[6]);
              const pDx1 = Number(wordArray[7]);
              const pDx2 = Number(wordArray[8]);
              const pAlpha = Number(wordArray[9]);
              const pDy2 = Number(wordArray[10]);
              const pDx3 = Number(wordArray[11]);
              const pDx4 = Number(wordArray[12]);


              const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4,
               dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
              const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
              const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(mesh);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              boxmesh.geometry.translate(2 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 + dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              let aCSG = MeshCSG1.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 - dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
              boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
              boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, -dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);


              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aTrapeZoidPGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
  
          case "TORUS":
  
            {
              const pRMin = Number(wordArray[3]);
              const pRMax = Number(wordArray[4]);
              const pRtor = Number(wordArray[5]);
              const SPhi = Number(wordArray[6]);
              const DPhi = Number(wordArray[7]);


              const torgeometry1 = new THREE.TorusGeometry(pRtor, pRMax, 16, 48);
              const tormesh1 = new THREE.Mesh(torgeometry1, new THREE.MeshStandardMaterial());
              tormesh1.rotateX(Math.PI / 2);
              tormesh1.updateMatrix();

              const torgeometry2 = new THREE.TorusGeometry(pRtor, pRMin, 16, 48);
              const tormesh2 = new THREE.Mesh(torgeometry2, new THREE.MeshStandardMaterial());
              tormesh2.rotateX(Math.PI / 2);
              tormesh2.updateMatrix();

              const boxgeometry = new THREE.BoxGeometry(pRtor + pRMax, pRtor + pRMax, pRtor + pRMax);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate((pRtor + pRMax) / 2, 0, (pRtor + pRMax) / 2);
              const MeshCSG1 = CSG.fromMesh(tormesh1);
              const MeshCSG2 = CSG.fromMesh(tormesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;
              aCSG = MeshCSG1.subtract(MeshCSG2);

              let bCSG;
              bCSG = MeshCSG1.subtract(MeshCSG2);

              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateY(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pRTor': pRtor, 'pSPhi': SPhi, 'pDPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aTorusGeometry';
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
          
          case "ELLIPTICAL_TUBE":
  
            {
              const xSemiAxis = Number(wordArray[3]);
              const semiAxisY = Number(wordArray[4]);
              const Dz = Number(wordArray[5]);

              const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, Dz, 32, 1, false, 0, Math.PI * 2);
              const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              const ratioZ = semiAxisY / xSemiAxis;
              cylindermesh.scale.z = ratioZ;
              cylindermesh.updateMatrix();
              const aCSG = CSG.fromMesh(cylindermesh);
              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

              const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
          
          case "ELLIPSOID":
  
            {
              const xSemiAxis = Number(wordArray[3]);
              const ySemiAxis = Number(wordArray[4]);
              const zSemiAxis = Number(wordArray[5]);
              const zBottomCut = Number(wordArray[6]);
              const zTopCut = Number(wordArray[7]);


              const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, zTopCut - zBottomCut, 32, 256, false, 0, Math.PI * 2);

              cylindergeometry1.translate(0, (zTopCut + zBottomCut)/2, 0);

              let positionAttribute = cylindergeometry1.getAttribute('position');

              let vertex = new THREE.Vector3();

              function calculate_normal_vector(x, y, z, a, b, c) {
                // Calculate the components of the normal vector
                let nx = 2 * (x / a ** 2)
                let ny = 2 * (y / b ** 2)
                let nz = 2 * (z / c ** 2)

                // Normalize the normal vector
                let magnitude = Math.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
                nx /= magnitude
                ny /= magnitude
                nz /= magnitude
                let normal = { x: nx, y: ny, z: nz };
                return normal;
              }
              for (let i = 0; i < positionAttribute.count; i++) {

                vertex.fromBufferAttribute(positionAttribute, i);
                let x, y, z;
                x = vertex.x, y = vertex.y;
                let k = 0;
                do {
                  x = vertex.x + k;
                  if (Math.abs(x) < 0) {
                    x = vertex.x;
                    break;
                  }
                  if (vertex.z > 0) {
                    z = ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                  } else {
                    z = -ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                  }
                  if (x > 0) {
                    k -= 0.01
                  } else {
                    k += 0.01;
                  }

                } while (!z);


                cylindergeometry1.attributes.position.array[i * 3] = x;
                cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
                cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

                let normal = calculate_normal_vector(x, y, z, xSemiAxis, zSemiAxis, ySemiAxis)
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

              const meshName = solidName.split('_')[0];

              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

            }
            
            break;
  
          case "ELLIPTICAL_CONE":
  
            {
              const xSemiAxis = Number(wordArray[3]);
              const ySemiAxis = Number(wordArray[4]);
              const height = Number(wordArray[5]);
              const zTopCut = Number(wordArray[6]);


              const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * ((height - zTopCut) / height), xSemiAxis, zTopCut, 32, 32, false, 0, Math.PI * 2);
              cylindergeometry1.translate(0, zTopCut / 2, 0)
              const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              const ratioZ = ySemiAxis / xSemiAxis;

              cylindermesh.scale.z = ratioZ;
              cylindermesh.updateMatrix();
              const aCSG = CSG.fromMesh(cylindermesh);
              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

              const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'height': height, 'zTopCut': zTopCut };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aEllipticalConeGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];

              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
  
          case "TWISTED_BOX":
  
            {
              const twistedangle = Number(wordArray[3]);
              const pDx = Number(wordArray[4]);
              const pDy = Number(wordArray[5]);
              const pDz = Number(wordArray[6]);

              const geometry = new THREE.BoxGeometry(pDx, pDy, pDz, 32, 32, 32);
              geometry.type = 'aTwistedBoxGeometry';
              const positionAttribute = geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle / 180 * Math.PI);
                geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              const param = { 'width': pDx, 'height': pDy, 'depth': pDz, 'angle': twistedangle };
              geometry.parameters = param;
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
              mesh.rotateX(Math.PI / 2);
              mesh.updateMatrix();

              const meshName = solidName.split('_')[0];

              mesh.name = meshName;

              meshs[solidName] = mesh;
              return mesh;

            }
            
            break;
  
          case "TWISTED_TRD":
  
            {
              const dx1 = Number(wordArray[3]);
              const dx2 = Number(wordArray[4]);
              const dy1 = Number(wordArray[5]);
              const dy2 = Number(wordArray[6]);
              const dz = Number(wordArray[7]);
              const twistedangle = Number(wordArray[8]);


              const maxdis = Math.max(dx1, dy1, dx2, dy2, dz);
              const maxwidth = Math.max(dx1, dy1, dx2, dy2);
              const geometry = new THREE.BoxGeometry(maxwidth, dz, maxwidth, 32, 32, 32);
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(mesh);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let alpha = Math.atan((dx1 - dx2) / 2 / dz);
              let phi = Math.atan((dy1 - dy2) / 2 / dz);

              boxmesh.geometry.translate(maxdis, maxdis, 0);
              boxmesh.rotation.set(0, 0, phi);
              boxmesh.position.set(0 + dx1 / 2, -dz / 2, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              let aCSG = MeshCSG1.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(-2 * maxdis, 0, 0);
              boxmesh.rotation.set(0, 0, -phi);
              boxmesh.position.set(0 - dx1 / 2, -dz / 2, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(maxdis, 0, maxdis);
              boxmesh.rotation.set(-alpha, 0, 0);
              boxmesh.position.set(0, -dz / 2, dy1 / 2);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(0, 0, -2 * maxdis);
              boxmesh.rotation.set(alpha, 0, 0);
              boxmesh.position.set(0, -dz / 2, -dy1 / 2);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': twistedangle };
              finalMesh.geometry.parameters = param;

              const positionAttribute = finalMesh.geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
                finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              finalMesh.geometry.type = 'aTwistedTrdGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;
              
            }
            
            break;
  
          case "TWISTED_TRAP":
            
            {
              const twistedangle = Number(wordArray[3]);
              const pDx1 = Number(wordArray[4]);
              const pDx2 = Number(wordArray[5]);
              const pDy1 = Number(wordArray[6]);
              const pDz = Number(wordArray[7]);

              ///////////////////////////////////////////////////// Please double check this angles ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

              const theta = Number(wordArray[8]);
              const pDy2 = Number(wordArray[9]);
              const pDx3 = Number(wordArray[10]);
              const pDx4 = Number(wordArray[11]);


              const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = theta, phi = theta;
              const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);
              const geometry = new THREE.BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth, 32, 32, 32);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(mesh);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              boxmesh.geometry.translate(2 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 + dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              let aCSG = MeshCSG1.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
              boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
              boxmesh.position.set(0 - dx / 2, 0, 0);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
              boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);

              boxmesh.rotation.set(0, 0, 0);
              boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
              boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
              boxmesh.position.set(0, 0, -dy);
              boxmesh.updateMatrix();
              MeshCSG3 = CSG.fromMesh(boxmesh);
              aCSG = aCSG.subtract(MeshCSG3);


              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi, 'twistedangle': twistedangle };
              finalMesh.geometry.parameters = param;

              const positionAttribute = finalMesh.geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
                finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              finalMesh.geometry.type = 'aTwistedTrapGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;

            }
            
            break;
  
          case "TWISTED_TUBS":
  
            {
              const twistedangle = Number(wordArray[3])
              const pRMin = Number(wordArray[4]);
              const pRMax = Number(wordArray[5]);
              const pDz = Number(wordArray[6]);
              const DPhi = Number(wordArray[7]);
              const SPhi = 0;
              

              const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

              const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

              const boxgeometry = new THREE.BoxGeometry(pRMax, pDz, pRMax, 32, 32, 32);
              const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

              boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
              const MeshCSG1 = CSG.fromMesh(cylindermesh1);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);
              let MeshCSG3 = CSG.fromMesh(boxmesh);

              let aCSG;
              aCSG = MeshCSG1.subtract(MeshCSG2);

              let bCSG;
              bCSG = MeshCSG1.subtract(MeshCSG2);

              if (DPhi > 270) {
                let v_DPhi = 360 - DPhi;

                boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - v_DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / 2;
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  bCSG = bCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                bCSG = bCSG.subtract(MeshCSG3);
                aCSG = aCSG.subtract(bCSG);

              } else {

                boxmesh.rotateY(SPhi / 180 * Math.PI);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

                let repeatCount = Math.floor((270 - DPhi) / 90);

                for (let i = 0; i < repeatCount; i++) {
                  let rotateVaule = Math.PI / (-2);
                  boxmesh.rotateY(rotateVaule);
                  boxmesh.updateMatrix();
                  MeshCSG3 = CSG.fromMesh(boxmesh);
                  aCSG = aCSG.subtract(MeshCSG3);
                }
                let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                boxmesh.rotateY(rotateVaule);
                boxmesh.updateMatrix();
                MeshCSG3 = CSG.fromMesh(boxmesh);
                aCSG = aCSG.subtract(MeshCSG3);

              }

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };
              finalMesh.geometry.parameters = param;

              const positionAttribute = finalMesh.geometry.getAttribute('position');

              let vec3 = new THREE.Vector3();
              let axis_vector = new THREE.Vector3(0, 1, 0);
              for (let i = 0; i < positionAttribute.count; i++) {
                vec3.fromBufferAttribute(positionAttribute, i);
                vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
                finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
              }

              finalMesh.geometry.type = 'aTwistedTubeGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return mesh;
            }
            
            break;
  
          case "TET":
  
            {
              let anchor = wordArray[3];
              let p2 = wordArray[4];
              let p3 = wordArray[5];
              let p4 = wordArray[6];


              function getArray(string) {
                return string.split(",").map(Number);
              }
    
              anchor = getArray(anchor);
              p2 = getArray(p2);
              p3 = getArray(p3);
              p4 = getArray(p4);
    
              var vertices = [], indices = [];
              vertices.push(...anchor, ...p2, ...p3, ...p4);
              indices.push(0, 1, 2, 0, 2, 1, 0, 2, 3, 0, 3, 2, 0, 1, 3, 0, 3, 1, 1, 2, 3, 1, 3, 2);
    
              // vertices = vertices.join("").match(/-?(?:\d+\.\d*|\.\d+|\d+)/g);
              console.log(vertices)
              const geometry = new THREE.PolyhedronGeometry(vertices, indices);
              const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
              geometry.parameters = param;
              geometry.type = 'aTetrahedraGeometry';
              const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
              mesh.name = 'Tetrahedra';
              mesh.rotateX(Math.PI / 2);
              mesh.updateMatrix();

              const meshName = solidName.split('_')[0];

              mesh.name = meshName;

              meshs[solidName] = mesh;

              return mesh;

            }

            break;
  
          case "HYPE":
  
            {
              const radiusIn = Number(wordArray[3]);
              const radiusOut = Number(wordArray[4]);
              const stereo1 = Number(wordArray[5]);
              const stereo2 = Number(wordArray[6]);
              const pDz = Number(wordArray[7]);


              const c_z1 = Math.tan(stereo1 * Math.PI / 180 / 2);
              const c_z2 = Math.tan(stereo2 * Math.PI / 180 / 2);
              const cylindergeometry1 = new THREE.CylinderGeometry(radiusOut, radiusOut, pDz, 32, 16, false, 0, Math.PI * 2);
              const cylindergeometry2 = new THREE.CylinderGeometry(radiusIn, radiusIn, pDz, 32, 16, false, 0, Math.PI * 2);

              let positionAttribute = cylindergeometry1.getAttribute('position');
              let positionAttribute2 = cylindergeometry2.getAttribute('position');
              let vertex = new THREE.Vector3();
              let vertex2 = new THREE.Vector3();

              for (let i = 0; i < positionAttribute.count; i++) {

                vertex.fromBufferAttribute(positionAttribute, i);
                vertex2.fromBufferAttribute(positionAttribute2, i);
                let x, y, z, x2, y2, z2;
                x = vertex.x;
                y = vertex.y;
                z = vertex.z;
                x2 = vertex2.x;
                y2 = vertex2.y;
                z2 = vertex2.z;
                let r = radiusOut * Math.sqrt((1 + Math.pow((y / c_z1), 2)));
                let r2 = radiusIn * Math.sqrt((1 + Math.pow((y2 / c_z2), 2)));

                let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

                if (vertex.z >= 0) {
                  z = Math.abs(r * Math.sin(alpha));
                  z2 = Math.abs(r2 * Math.sin(alpha));
                } else {
                  z = - Math.abs(r * Math.sin(alpha));
                  z2 = - Math.abs(r2 * Math.sin(alpha));
                }
                if (vertex.x >= 0) {
                  x = r * Math.cos(alpha);
                  x2 = r2 * Math.cos(alpha);
                } else {
                  x = -r * Math.cos(alpha);
                  x2 = -r2 * Math.cos(alpha);
                }

                cylindergeometry1.attributes.position.array[i * 3] = x;
                cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
                cylindergeometry1.attributes.position.array[i * 3 + 2] = z;


                cylindergeometry2.attributes.position.array[i * 3] = x2;
                cylindergeometry2.attributes.position.array[i * 3 + 1] = y2;
                cylindergeometry2.attributes.position.array[i * 3 + 2] = z2;

              }
              cylindergeometry1.attributes.position.needsUpdate = true;
              cylindergeometry2.attributes.position.needsUpdate = true;

              const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
              const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

              const MeshCSG1 = CSG.fromMesh(cylindermesh);
              const MeshCSG2 = CSG.fromMesh(cylindermesh2);

              let aCSG = MeshCSG1.subtract(MeshCSG2);

              const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

              const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pDz };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.type = 'aHyperboloidGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();

              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;
              return finalMesh;

            }
            
            break;
  
          case "POLYCONE":
  
            {

              let SPhi = Number(wordArray[3]);
              let DPhi = Number(wordArray[4]);
              let numZPlanes = Number(wordArray[5]);
              let z = wordArray[6];
              let rOuter = wordArray[7];
              let rInner = [];

              
              function getArray(string) {
                return string.split(",").map(Number);
              }
    
              rOuter = getArray(rOuter);
              z = getArray(z);
              
              const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, SPhi/180*Math.PI, DPhi/180*Math.PI);

              for (let i = 0; i < numZPlanes; i++) {
                rInner.push(0.000001);
              }

              const meshOut = new THREE.Mesh(geometryOut, material);
              let maxWidth = Math.max(...rOuter);
              let maxHeight = Math.max(...z);

              const boxgeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);

              const boxmesh = new THREE.Mesh(boxgeometry, material);
              boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

              let MeshCSG1 = CSG.fromMesh(meshOut);

              const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
              const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.computeVertexNormals();
              finalMesh.geometry.type = 'aPolyconeGeometry';
              finalMesh.updateMatrix();

              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;

              return finalMesh;
            }

            break;
  
          case "POLYHEDRA":
            
            {
              let SPhi = Number(wordArray[3]);
              let DPhi = Number(wordArray[4]);
              let numSide = Number(wordArray[5]);
              let numZPlanes = Number(wordArray[6]);
              let z = wordArray[7];
              let rOuter = wordArray[8];
              let rInner = [];
              
              
              function getArray(string) {
                return string.split(",").map(Number);
              }
    
              rOuter = getArray(rOuter);
              z = getArray(z);

              for (let i = 0; i < numZPlanes; i++) {
                rInner.push(0.000001);
              }

              const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI);

              const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());

              let MeshCSG1 = CSG.fromMesh(meshOut);

              const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
              const param = { 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide, 'rInner': rInner };
              finalMesh.geometry.parameters = param;
              finalMesh.geometry.computeVertexNormals();
              finalMesh.geometry.type = 'aPolyhedraGeometry';
              finalMesh.rotateX(Math.PI / 2);
              finalMesh.updateMatrix();
              
              const meshName = solidName.split('_')[0];
              finalMesh.name = meshName;

              meshs[solidName] = finalMesh;
              return finalMesh;

            }
            
            break;
							
          case "UNION":
			
            {
              let firstchildName = wordArray[3];
              let secondchildName = wordArray[4];
              let rotationName = wordArray[5];
              let positionX = Number(wordArray[6]);
              let positionY = Number(wordArray[7]);
              let positionZ = Number(wordArray[8]);

              let firstchild = meshs[firstchildName];
              let secondchild = meshs[secondchildName];

              if(!firstchild) {
                firstchild = getBooleanMesh(solidText[firstchildName]);
              } 

              if(!secondchild) {
                secondchild = getBooleanMesh(solidText[secondchildName]);
              }

              let rotation = rotationText[rotationName];
              let rotationX = rotation.x / 180 * Math.PI;
              let rotationY = rotation.y / 180 * Math.PI;
              let rotationZ = rotation.z / 180 * Math.PI;

              console.log(rotationX, rotationY, rotationZ, rotation)
              secondchild.position.set(positionX, positionY, positionZ);
              secondchild.rotation.set(rotationX, rotationY, rotationZ);
              secondchild.updateMatrix();

              var mesh;
                        
              console.log(firstchild);
              let aCSG = CSG.fromMesh(firstchild);
              let bCSG = CSG.fromMesh(secondchild);

              aCSG = aCSG.union(bCSG);

              mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              
              let meshRotationName = rotationName.replace('_rel', '');
              const meshRotation = rotationText[meshRotationName];

              if(meshRotation) {
                mesh.rotation.copy(meshRotation);
                console.log(meshRotation);
              }

              const meshName = solidName.split('_')[0];

              mesh.name = meshName;
              meshs[solidName] = mesh;

              return mesh;

            }
            
            break;
  
          case "SUBTRACTION":
  
            {
              let firstchildName = wordArray[3];
              let secondchildName = wordArray[4];
              let rotationName = wordArray[5];
              let positionX = Number(wordArray[6]);
              let positionY = Number(wordArray[7]);
              let positionZ = Number(wordArray[8]);

              let firstchild = meshs[firstchildName];
              let secondchild = meshs[secondchildName];
              
              if(!firstchild) {
                firstchild = getBooleanMesh(solidText[firstchildName]);
              } 

              if(!secondchild) {
                secondchild = getBooleanMesh(solidText[secondchildName]);
              }

              let rotation = rotationText[rotationName];
              let rotationX = rotation.x / 180 * Math.PI;
              let rotationY = rotation.y / 180 * Math.PI;
              let rotationZ = rotation.z / 180 * Math.PI;

              secondchild.rotation.set(rotationX, rotationY, rotationZ);
              secondchild.position.set(positionX, positionY, positionZ);

              var mesh;
                        
              let aCSG = CSG.fromMesh(firstchild);
              let bCSG = CSG.fromMesh(secondchild);

              aCSG = aCSG.subtract(bCSG);

              mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              
              let meshRotationName = rotationName.replace('_rel', '');
              const meshRotation = rotationText[meshRotationName];

              if(meshRotation) {
                mesh.rotation.copy(meshRotation);
                console.log(meshRotation);
              }

              const meshName = solidName.split('_')[0];

              mesh.name = meshName;
              meshs[solidName] = mesh;

              return mesh;

            }
            
            break;
            
          case "INTERSECTION":
  
            {
              let firstchildName = wordArray[3];
              let secondchildName = wordArray[4];
              let rotationName = wordArray[5];
              let positionX = Number(wordArray[6]);
              let positionY = Number(wordArray[7]);
              let positionZ = Number(wordArray[8]);


              let firstchild = meshs[firstchildName];
              let secondchild = meshs[secondchildName];

              if(!firstchild) {
                firstchild = getBooleanMesh(solidText[firstchildName]);
              } 

              if(!secondchild) {
                secondchild = getBooleanMesh(solidText[secondchildName]);
              }

              let rotation = rotationText[rotationName];
              let rotationX = rotation.x / 180 * Math.PI;
              let rotationY = rotation.y / 180 * Math.PI;
              let rotationZ = rotation.z / 180 * Math.PI;

              secondchild.rotation.set(rotationX, rotationY, rotationZ);
              secondchild.position.set(positionX, positionY, positionZ);

              var mesh;
                        
              let aCSG = CSG.fromMesh(firstchild);
              let bCSG = CSG.fromMesh(secondchild);

              aCSG = aCSG.intersect(bCSG);

              mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
              
              let meshRotationName = rotationName.replace('_rel', '');
              const meshRotation = rotationText[meshRotationName];

              if(meshRotation) {
                mesh.rotation.copy(meshRotation);
                console.log(meshRotation);
              }
              
              const meshName = solidName.split('_')[0];

              mesh.name = meshName;
              meshs[solidName] = mesh;

              return mesh;

            }

            break;          

          default:
  
            break;
        }

    }
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

					}

					break;

				case ':solid':

					{
						const solidName = wordArray[1];
						const solidType = wordArray[2];

						// set the new mesh 

						switch (solidType) {
							
							case "UNION":
			
                {
                  let firstchildName = wordArray[3];
                  let secondchildName = wordArray[4];
                  let rotationName = wordArray[5];
                  let positionX = Number(wordArray[6]);
                  let positionY = Number(wordArray[7]);
                  let positionZ = Number(wordArray[8]);

                  let firstchild = meshs[firstchildName];
                  let secondchild = meshs[secondchildName];

                  if(!firstchild) {
                    firstchild = getBooleanMesh(solidText[firstchildName]);
                  } 

                  if(!secondchild) {
                    secondchild = getBooleanMesh(solidText[secondchildName]);
                  }

                  let rotation = rotationText[rotationName];
                  let rotationX = rotation.x / 180 * Math.PI;
                  let rotationY = rotation.y / 180 * Math.PI;
                  let rotationZ = rotation.z / 180 * Math.PI;

                  console.log(rotationX, rotationY, rotationZ, rotation)
                  secondchild.position.set(positionX, positionY, positionZ);
                  secondchild.rotation.set(rotationX, rotationY, rotationZ);
                  secondchild.updateMatrix();

                  var mesh;
                            
                  console.log(firstchild);
                  let aCSG = CSG.fromMesh(firstchild);
                  let bCSG = CSG.fromMesh(secondchild);

                  aCSG = aCSG.union(bCSG);

                  mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
                  
                  const meshName = solidName.split('_')[0];

                  mesh.name = meshName;
                  meshs[solidName] = mesh;

                }
								
								break;
			
							case "SUBTRACTION":
			
                {
                  let firstchildName = wordArray[3];
                  let secondchildName = wordArray[4];
                  let rotationName = wordArray[5];
                  let positionX = Number(wordArray[6]);
                  let positionY = Number(wordArray[7]);
                  let positionZ = Number(wordArray[8]);

                  let firstchild = meshs[firstchildName];
                  let secondchild = meshs[secondchildName];
                  
                  if(!firstchild) {
                    firstchild = getBooleanMesh(solidText[firstchildName]);
                  } 

                  if(!secondchild) {
                    secondchild = getBooleanMesh(solidText[secondchildName]);
                  }

                  let rotation = rotationText[rotationName];
                  let rotationX = rotation.x / 180 * Math.PI;
                  let rotationY = rotation.y / 180 * Math.PI;
                  let rotationZ = rotation.z / 180 * Math.PI;

                  secondchild.rotation.set(rotationX, rotationY, rotationZ);
                  secondchild.position.set(positionX, positionY, positionZ);

                  var mesh;
                            
                  let aCSG = CSG.fromMesh(firstchild);
                  let bCSG = CSG.fromMesh(secondchild);

                  aCSG = aCSG.subtract(bCSG);

                  mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
                  
                  const meshName = solidName.split('_')[0];

                  mesh.name = meshName;
                  meshs[solidName] = mesh;

                }
								
								break;
								
							case "INTERSECTION":
			
                {
                  let firstchildName = wordArray[3];
                  let secondchildName = wordArray[4];
                  let rotationName = wordArray[5];
                  let positionX = Number(wordArray[6]);
                  let positionY = Number(wordArray[7]);
                  let positionZ = Number(wordArray[8]);


                  let firstchild = meshs[firstchildName];
                  let secondchild = meshs[secondchildName];

                  if(!firstchild) {
                    firstchild = getBooleanMesh(solidText[firstchildName]);
                  } 

                  if(!secondchild) {
                    secondchild = getBooleanMesh(solidText[secondchildName]);
                  }

                  let rotation = rotationText[rotationName];
                  let rotationX = rotation.x / 180 * Math.PI;
                  let rotationY = rotation.y / 180 * Math.PI;
                  let rotationZ = rotation.z / 180 * Math.PI;

                  secondchild.rotation.set(rotationX, rotationY, rotationZ);
                  secondchild.position.set(positionX, positionY, positionZ);

                  var mesh;
                            
                  let aCSG = CSG.fromMesh(firstchild);
                  let bCSG = CSG.fromMesh(secondchild);

                  aCSG = aCSG.intersect(bCSG);

                  mesh = CSG.toMesh(aCSG, new THREE.Matrix4());
                  
                  const meshName = solidName.split('_')[0];

                  mesh.name = meshName;
                  meshs[solidName] = mesh;

                }

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
						const materialName = wordArray[3];

						// set material of mesh
						volumeText[voluName] = solidName;

						var newMesh = meshs[solidName];

						if(newMesh && materialName && materialName !== 'undefined') {
							const materialElement = materialTypeOptions[materialName];
							newMesh.material.newmaterial = materialElement;

							meshs[solidName] = newMesh;
	
						}

					}

					break;

				case ':place':

					{
						const voluName = wordArray[1];
						const solidName = volumeText[voluName];

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

							let newMesh = meshs[solidName];

							if ( newMesh ) {
	
								
								// setting the rotation and position of mesh

								const newRotation = rotationText[rotmName];

								newMesh.position.copy(meshPosition);
                
                const rotateX = newRotation.x / 180 * Math.PI;
                const rotateY = newRotation.y / 180 * Math.PI;
                const rotateZ = newRotation.z / 180 * Math.PI;

								newMesh.rotation.set(rotateX, rotateY, rotateZ);

								newMesh.updateMatrixWorld();

								meshs[solidName] = newMesh;
								
								editor.execute(new AddObjectCommand(editor, newMesh));

							}

							
						}
					}

					break;

				default :

					break;
			}
		});
	}

	const materialTypeOptions = {
    G4_H: {
      id: 1,
      elementType: "G4_H",
      density: 8.3748e-5,
      energy: 19.2,
    },

    G4_He: {
      id: 2,
      elementType: "G4_He",
      density: 0.000166322,
      energy: 41.8,
    },

    G4_Li: {
      id: 3,
      elementType: "G4_Li",
      density: 0.534,
      energy: 40,
    },

    G4_Be: {
      id: 4,
      elementType: "G4_Be",
      density: 1.848,
      energy: 63.7,
    },

    G4_B: {
      id: 5,
      elementType: "G4_B",
      density: 2.37,
      energy: 76,
    },

    G4_C: {
      id: 6,
      elementType: "G4_C",
      density: 2,
      energy: 81,
    },

    G4_N: {
      id: 7,
      elementType: "G4_N",
      density: 0.0011652,
      energy: 82,
    },

    G4_O: {
      id: 8,
      elementType: "G4_O",
      density: 0.00133151,
      energy: 95,
    },

    G4_F: {
      id: 9,
      elementType: "G4_F",
      density: 0.00158029,
      energy: 115,
    },

    G4_Ne: {
      id: 10,
      elementType: "G4_Ne",
      density: 0.000838505,
      energy: 137,
    },

    G4_Na: {
      id: 11,
      elementType: "G4_Na",
      density: 0.971,
      energy: 149,
    },

    G4_Mg: {
      id: 12,
      elementType: "G4_Mg",
      density: 1.74,
      energy: 156,
    },

    G4_Al: {
      id: 13,
      elementType: "G4_Al",
      density: 2.699,
      energy: 166,
    },

    G4_Si: {
      id: 14,
      elementType: "G4_Si",
      density: 2.33,
      energy: 173,
    },

    G4_P: {
      id: 15,
      elementType: "G4_P",
      density: 2.2,
      energy: 173,
    },

    G4_S: {
      id: 16,
      elementType: "G4_S",
      density: 2,
      energy: 180,
    },

    G4_Cl: {
      id: 17,
      elementType: "G4_Cl",
      density: 0.00299473,
      energy: 174,
    },

    G4_Ar: {
      id: 18,
      elementType: "G4_Ar",
      density: 0.00166201,
      energy: 188,
    },

    G4_K: {
      id: 19,
      elementType: "G4_K",
      density: 0.862,
      energy: 190,
    },

    G4_Ca: {
      id: 20,
      elementType: "G4_Ca",
      density: 1.55,
      energy: 191,
    },

    G4_Sc: {
      id: 21,
      elementType: "G4_Sc",
      density: 2.989,
      energy: 216,
    },

    G4_Ti: {
      id: 22,
      elementType: "G4_Ti",
      density: 4.54,
      energy: 233,
    },

    G4_V: {
      id: 23,
      elementType: "G4_V",
      density: 6.11,
      energy: 245,
    },

    G4_Cr: {
      id: 24,
      elementType: "G4_Cr",
      density: 7.18,
      energy: 257,
    },

    G4_Mn: {
      id: 25,
      elementType: "G4_Mn",
      density: 7.44,
      energy: 272,
    },

    G4_Fe: {
      id: 26,
      elementType: "G4_Fe",
      density: 7.874,
      energy: 286,
    },

    G4_Co: {
      id: 27,
      elementType: "G4_Co",
      density: 8.9,
      energy: 297,
    },

    G4_Ni: {
      id: 28,
      elementType: "G4_Ni",
      density: 8.902,
      energy: 311,
    },

    G4_Cu: {
      id: 29,
      elementType: "G4_Cu",
      density: 8.96,
      energy: 322,
    },

    G4_Zn: {
      id: 30,
      elementType: "G4_Zn",
      density: 7.133,
      energy: 330,
    },

    G4_Ga: {
      id: 31,
      elementType: "G4_Ga",
      density: 5.904,
      energy: 334,
    },

    G4_Ge: {
      id: 32,
      elementType: "G4_Ge",
      density: 5.323,
      energy: 350,
    },

    G4_As: {
      id: 33,
      elementType: "G4_As",
      density: 5.73,
      energy: 347,
    },

    G4_Se: {
      id: 34,
      elementType: "G4_Se",
      density: 4.5,
      energy: 348,
    },

    G4_Br: {
      id: 35,
      elementType: "G4_Br",
      density: 0.0070721,
      energy: 343,
    },

    G4_Kr: {
      id: 36,
      elementType: "G4_Kr",
      density: 0.00347832,
      energy: 352,
    },

    G4_Rb: {
      id: 37,
      elementType: "G4_Rb",
      density: 1.532,
      energy: 363,
    },

    G4_Sr: {
      id: 38,
      elementType: "G4_Sr",
      density: 2.54,
      energy: 366,
    },

    G4_Y: {
      id: 39,
      elementType: "G4_Y",
      density: 4.469,
      energy: 379,
    },

    G4_Zr: {
      id: 40,
      elementType: "G4_Zr",
      density: 6.506,
      energy: 393,
    },

    G4_Nb: {
      id: 41,
      elementType: "G4_Nb",
      density: 8.57,
      energy: 417,
    },

    G4_Mo: {
      id: 42,
      elementType: "G4_Mo",
      density: 10.22,
      energy: 424,
    },

    G4_Tc: {
      id: 43,
      elementType: "G4_Tc",
      density: 11.5,
      energy: 428,
    },

    G4_Ru: {
      id: 44,
      elementType: "G4_Ru",
      density: 12.41,
      energy: 441,
    },

    G4_Rh: {
      id: 45,
      elementType: "G4_Rh",
      density: 12.41,
      energy: 449,
    },

    G4_Pd: {
      id: 46,
      elementType: "G4_Pd",
      density: 12.02,
      energy: 470,
    },

    G4_Ag: {
      id: 47,
      elementType: "G4_Ag",
      density: 10.5,
      energy: 470,
    },

    G4_Cd: {
      id: 48,
      elementType: "G4_Cd",
      density: 8.65,
      energy: 469,
    },

    G4_In: {
      id: 49,
      elementType: "G4_In",
      density: 7.31,
      energy: 488,
    },

    G4_Sn: {
      id: 50,
      elementType: "G4_Sn",
      density: 7.31,
      energy: 488,
    },

    G4_Sb: {
      id: 51,
      elementType: "G4_Sb",
      density: 6.691,
      energy: 487,
    },

    G4_Te: {
      id: 52,
      elementType: "G4_Te",
      density: 6.24,
      energy: 485,
    },

    G4_I: {
      id: 53,
      elementType: "G4_I",
      density: 4.93,
      energy: 491,
    },

    G4_Xe: {
      id: 54,
      elementType: "G4_Xe",
      density: 0.00548536,
      energy: 482,
    },

    G4_Cs: {
      id: 55,
      elementType: "G4_Cs",
      density: 1.873,
      energy: 488,
    },

    G4_Ba: {
      id: 56,
      elementType: "G4_Ba",
      density: 3.5,
      energy: 491,
    },

    G4_La: {
      id: 57,
      elementType: "G4_La",
      density: 6.154,
      energy: 501,
    },

    G4_Ce: {
      id: 58,
      elementType: "G4_Ce",
      density: 6.657,
      energy: 523,
    },

    G4_Pr: {
      id: 59,
      elementType: "G4_Pr",
      density: 6.71,
      energy: 535,
    },

    G4_Nd: {
      id: 60,
      elementType: "G4_Nd",
      density: 6.9,
      energy: 546,
    },

    G4_Pm: {
      id: 61,
      elementType: "G4_Pm",
      density: 7.22,
      energy: 560,
    },

    G4_Sm: {
      id: 62,
      elementType: "G4_Sm",
      density: 7.46,
      energy: 574,
    },

    G4_Eu: {
      id: 63,
      elementType: "G4_Eu",
      density: 5.243,
      energy: 580,
    },

    G4_Gd: {
      id: 64,
      elementType: "G4_Gd",
      density: 7.9004,
      energy: 591,
    },

    G4_Tb: {
      id: 65,
      elementType: "G4_Tb",
      density: 8.229,
      energy: 614,
    },

    G4_Dy: {
      id: 66,
      elementType: "G4_Dy",
      density: 8.55,
      energy: 628,
    },

    G4_Ho: {
      id: 67,
      elementType: "G4_Ho",
      density: 8.795,
      energy: 650,
    },

    G4_Er: {
      id: 68,
      elementType: "G4_Er",
      density: 9.066,
      energy: 658,
    },

    G4_Tm: {
      id: 69,
      elementType: "G4_Tm",
      density: 9.321,
      energy: 674,
    },

    G4_Yb: {
      id: 70,
      elementType: "G4_Yb",
      density: 6.73,
      energy: 684,
    },

    G4_Lu: {
      id: 71,
      elementType: "G4_Lu",
      density: 9.84,
      energy: 694,
    },

    G4_Hf: {
      id: 72,
      elementType: "G4_Hf",
      density: 13.31,
      energy: 705,
    },

    G4_Ta: {
      id: 73,
      elementType: "G4_Ta",
      density: 16.654,
      energy: 718,
    },

    G4_W: {
      id: 74,
      elementType: "G4_W",
      density: 19.3,
      energy: 727,
    },

    G4_Re: {
      id: 75,
      elementType: "G4_Re",
      density: 21.02,
      energy: 736,
    },

    G4_Os: {
      id: 76,
      elementType: "G4_Os",
      density: 22.57,
      energy: 746,
    },

    G4_Ir: {
      id: 77,
      elementType: "G4_Ir",
      density: 22.42,
      energy: 757,
    },

    G4_Pt: {
      id: 78,
      elementType: "G4_Pt",
      density: 21.45,
      energy: 790,
    },

    G4_Au: {
      id: 79,
      elementType: "G4_Au",
      density: 19.32,
      energy: 790,
    },

    G4_Hg: {
      id: 80,
      elementType: "G4_Hg",
      density: 13.546,
      energy: 800,
    },

    G4_Tl: {
      id: 81,
      elementType: "G4_Tl",
      density: 11.72,
      energy: 810,
    },

    G4_Pb: {
      id: 82,
      elementType: "G4_Pb",
      density: 11.35,
      energy: 823,
    },

    G4_Bi: {
      id: 83,
      elementType: "G4_Bi",
      density: 9.747,
      energy: 823,
    },

    G4_Po: {
      id: 84,
      elementType: "G4_Po",
      density: 9.32,
      energy: 830,
    },

    G4_At: {
      id: 85,
      elementType: "G4_At",
      density: 9.32,
      energy: 830,
    },

    G4_Rn: {
      id: 86,
      elementType: "G4_Rn",
      density: 0.00900662,
      energy: 794,
    },

    G4_Fr: {
      id: 87,
      elementType: "G4_Fr",
      density: 1,
      energy: 827,
    },

    G4_Ra: {
      id: 88,
      elementType: "G4_Ra",
      density: 5,
      energy: 826,
    },

    G4_Ac: {
      id: 89,
      elementType: "G4_Ac",
      density: 10.07,
      energy: 841,
    },

    G4_Th: {
      id: 90,
      elementType: "G4_Th",
      density: 11.72,
      energy: 847,
    },

    G4_Pa: {
      id: 91,
      elementType: "G4_Pa",
      density: 15.37,
      energy: 878,
    },

    G4_U: {
      id: 92,
      elementType: "G4_U",
      density: 18.95,
      energy: 890,
    },

    G4_Np: {
      id: 93,
      elementType: "G4_Np",
      density: 20.25,
      energy: 902,
    },

    G4_Pu: {
      id: 94,
      elementType: "G4_Pu",
      density: 19.84,
      energy: 921,
    },

    G4_Am: {
      id: 95,
      elementType: "G4_Am",
      density: 13.67,
      energy: 934,
    },

    G4_Cm: {
      id: 96,
      elementType: "G4_Cm",
      density: 13.51,
      energy: 939,
    },

    G4_Bk: {
      id: 97,
      elementType: "G4_Bk",
      density: 14,
      energy: 952,
    },

    G4_Cf: {
      id: 98,
      elementType: "G4_Cf",
      density: 10,
      energy: 966,
    },

    //NIST Compounds

    "G4_A-150_TISSUE": {
      id: 99,
      elementType: "G4_A-150_TISSUE",
      density: 1.127,
      energy: 65.1,
    },

    G4_ACETONE: {
      id: 100,
      elementType: "G4_ACETONE",
      density: 0.7899,
      energy: 64.2,
    },

    G4_ACETYLENE: {
      id: 101,
      elementType: "G4_ACETYLENE",
      density: 0.0010967,
      energy: 58.2,
    },

    G4_ADENINE: {
      id: 102,
      elementType: "G4_ADENINE",
      density: 1.6,
      energy: 71.4,
    },

    G4_ADIPOSE_TISSUE_ICRP: {
      id: 103,
      elementType: "G4_ADIPOSE_TISSUE_ICRP",
      density: 0.95,
      energy: 63.2,
    },

    G4_AIR: {
      id: 104,
      elementType: "G4_AIR",
      density: 0.00120479,
      energy: 85.7,
    },

    G4_ALANINE: {
      id: 105,
      elementType: "G4_ALANINE",
      density: 1.42,
      energy: 71.9,
    },

    G4_ALUMIUM_OXIDE: {
      id: 106,
      elementType: "G4_ALUMIUM_OXIDE",
      density: 3.97,
      energy: 145.2,
    },

    G4_AMBER: {
      id: 107,
      elementType: "G4_AMBER",
      density: 1.1,
      energy: 63.2,
    },

    G4_AMMONIA: {
      id: 108,
      elementType: "G4_AMMONIA",
      density: 0.000826019,
      energy: 53.7,
    },

    G4_ANILINE: {
      id: 109,
      elementType: "G4_ANILINE",
      density: 1.0235,
      energy: 66.2,
    },

    G4_ANTHRACENE: {
      id: 110,
      elementType: "G4_ANTHRACENE",
      density: 1.283,
      energy: 69.5,
    },

    "G4_B-100_BONE": {
      id: 111,
      elementType: "G4_B-100_BONE",
      density: 1.45,
      energy: 85.9,
    },

    G4_BAKELITE: {
      id: 112,
      elementType: "G4_BAKELITE",
      density: 1.25,
      energy: 72.4,
    },

    G4_BARIUM_FLUORIDE: {
      id: 113,
      elementType: "G4_BARIUM_FLUORIDE",
      density: 4.89,
      energy: 375.9,
    },

    G4_BARIUM_SULFATE: {
      id: 114,
      elementType: "G4_BARIUM_SULFATE",
      density: 4.5,
      energy: 285.7,
    },

    G4_BENZENE: {
      id: 115,
      elementType: "G4_BENZENE",
      density: 0.87865,
      energy: 63.4,
    },

    G4_BERYLLIUM_OXIDE: {
      id: 116,
      elementType: "G4_BERYLLIUM_OXIDE",
      density: 3.01,
      energy: 93.2,
    },

    G4_BGO: {
      id: 117,
      elementType: "G4_BGO",
      density: 7.13,
      energy: 534.1,
    },

    G4_BLOOD_ICRP: {
      id: 118,
      elementType: "G4_BLOOD_ICRP",
      density: 1.06,
      energy: 75.2,
    },

    G4_BONE_COMPACT_ICRU: {
      id: 119,
      elementType: "G4_BONE_COMPACT_ICRU",
      density: 1.85,
      energy: 91.9,
    },

    G4_BONE_CORTICAL_ICRP: {
      id: 120,
      elementType: "G4_BONE_CORTICAL_ICRP",
      density: 1.92,
      energy: 110,
    },

    G4_BORON_CARBIDE: {
      id: 121,
      elementType: "G4_BORON_CARBIDE",
      density: 2.52,
      energy: 84.7,
    },

    G4_BORON_OXIDE: {
      id: 122,
      elementType: "G4_BORON_OXIDE",
      density: 1.812,
      energy: 99.6,
    },

    G4_BRAIN_ICRP: {
      id: 123,
      elementType: "G4_BRAIN_ICRP",
      density: 1.04,
      energy: 73.3,
    },

    G4_BUTANE: {
      id: 124,
      elementType: "G4_BUTANE",
      density: 0.00249343,
      energy: 48.3,
    },

    "G4_N-BUTYL_ALCOHOL": {
      id: 125,
      elementType: "G4_N-BUTYL_ALCOHOL",
      density: 0.8098,
      energy: 59.9,
    },

    "G4_C-552": {
      id: 126,
      elementType: "G4_C-552",
      density: 1.76,
      energy: 86.8,
    },

    G4_CADMIUM_TELLURIDE: {
      id: 127,
      elementType: "G4_CADMIUM_TELLURIDE",
      density: 6.2,
      energy: 539.3,
    },

    G4_CADMIUM_TUNGSTATE: {
      id: 128,
      elementType: "G4_CADMIUM_TUNGSTATE",
      density: 7.9,
      energy: 468.3,
    },

    G4_CALCIUM_CARBONATE: {
      id: 129,
      elementType: "G4_CALCIUM_CARBONATE",
      density: 2.8,
      energy: 136.4,
    },

    G4_CALCIUM_FLUORIDE: {
      id: 130,
      elementType: "G4_CALCIUM_FLUORIDE",
      density: 3.18,
      energy: 166,
    },

    G4_CALCIUM_OXIDE: {
      id: 131,
      elementType: "G4_CALCIUM_OXIDE",
      density: 3.3,
      energy: 176.1,
    },

    G4_CALCIUM_OXIDE: {
      id: 132,
      elementType: "G4_CALCIUM_OXIDE",
      density: 3.3,
      energy: 176.1,
    },

    G4_CALCIUM_SULFATE: {
      id: 133,
      elementType: "G4_CALCIUM_SULFATE",
      density: 2.96,
      energy: 152.3,
    },

    G4_CALCIUM_TUNGSTATE: {
      id: 134,
      elementType: "G4_CALCIUM_TUNGSTATE",
      density: 6.062,
      energy: 395,
    },

    G4_CARBON_DIOXIDE: {
      id: 135,
      elementType: "G4_CARBON_DIOXIDE",
      density: 0.00184212,
      energy: 85,
    },

    G4_CARBON_TETRACHLORIDE: {
      id: 136,
      elementType: "G4_CARBON_TETRACHLORIDE",
      density: 1.594,
      energy: 166.3,
    },

    G4_CELLULOSE_CELLOPHANE: {
      id: 137,
      elementType: "G4_CELLULOSE_CELLOPHANE",
      density: 1.42,
      energy: 77.6,
    },

    G4_CELLULOSE_BUTRATE: {
      id: 138,
      elementType: "G4_CELLULOSE_BUTRATE",
      density: 1.2,
      energy: 74.6,
    },

    G4_CELLULOSE_NITRATE: {
      id: 139,
      elementType: "G4_CELLULOSE_NITRATE",
      density: 1.49,
      energy: 87,
    },

    G4_CERIC_SULFATE: {
      id: 140,
      elementType: "G4_CERIC_SULFATE",
      density: 1.03,
      energy: 76.7,
    },

    G4_CESIUM_FLUORIDE: {
      id: 141,
      elementType: "G4_CESIUM_FLUORIDE",
      density: 4.115,
      energy: 440.7,
    },

    G4_CESIUM_IODIDE: {
      id: 142,
      elementType: "G4_CESIUM_IODIDE",
      density: 4.51,
      energy: 553.1,
    },

    G4_CHLOROBENZENE: {
      id: 143,
      elementType: "G4_CHLOROBENZENE",
      density: 1.1058,
      energy: 89.1,
    },

    G4_CHLOROFORM: {
      id: 144,
      elementType: "G4_CHLOROFORM",
      density: 1.4832,
      energy: 156,
    },

    G4_CONCRETE: {
      id: 145,
      elementType: "G4_CONCRETE",
      density: 2.3,
      energy: 135.2,
    },

    G4_CYCLOHEXANE: {
      id: 146,
      elementType: "G4_CYCLOHEXANE",
      density: 0.779,
      energy: 56.4,
    },

    "G4_l,2-DICHLOROBENZENE": {
      id: 147,
      elementType: "G4_l,2-DICHLOROBENZENE",
      density: 1.3048,
      energy: 106.5,
    },

    G4_DICHLORODIETHYL_ETHER: {
      id: 148,
      elementType: "G4_DICHLORODIETHYL_ETHER",
      density: 1.2199,
      energy: 103.3,
    },

    "G4_l,2-DICHLOROETHANE": {
      id: 149,
      elementType: "G4_l,2-DICHLOROETHANE",
      density: 1.2351,
      energy: 111.9,
    },

    G4_DIETHYL_ETHER: {
      id: 150,
      elementType: "G4_DIETHYL_ETHER",
      density: 0.71378,
      energy: 60,
    },

    "G4_N,N-DIMETHYL_FORMAMIDE": {
      id: 151,
      elementType: "G4_N,N-DIMETHYL_FORMAMIDE",
      density: 0.9487,
      energy: 66.6,
    },

    G4_DIMETHYL_SULFOXIDE: {
      id: 152,
      elementType: "G4_DIMETHYL_SULFOXIDE",
      density: 1.1014,
      energy: 98.6,
    },

    G4_ETHANE: {
      id: 153,
      elementType: "G4_ETHANE",
      density: 0.00125324,
      energy: 45.4,
    },

    G4_ETHYL_ALCOHOL: {
      id: 154,
      elementType: "G4_ETHYL_ALCOHOL",
      density: 0.7893,
      energy: 62.9,
    },

    G4_ETHYL_CELLULOSE: {
      id: 155,
      elementType: "G4_ETHYL_CELLULOSE",
      density: 1.13,
      energy: 69.3,
    },

    G4_ETHYLENE: {
      id: 156,
      elementType: "G4_ETHYLENE",
      density: 0.00117497,
      energy: 50.7,
    },

    G4_EYE_LENS_ICRP: {
      id: 157,
      elementType: "G4_EYE_LENS_ICRP",
      density: 1.07,
      energy: 73.3,
    },

    G4_FERRIC_OXIDE: {
      id: 158,
      elementType: "G4_FERRIC_OXIDE",
      density: 5.2,
      energy: 227.3,
    },

    G4_FERROBORIDE: {
      id: 159,
      elementType: "G4_FERROBORIDE",
      density: 7.15,
      energy: 261,
    },

    G4_FERROUS_OXIDE: {
      id: 160,
      elementType: "G4_FERROUS_OXIDE",
      density: 5.7,
      energy: 248.6,
    },

    G4_FERROUS_SULFATE: {
      id: 161,
      elementType: "G4_FERROUS_SULFATE",
      density: 1.024,
      energy: 76.4,
    },

    "G4_FREON-12": {
      id: 162,
      elementType: "G4_FREON-12",
      density: 1.12,
      energy: 143,
    },

    "G4_FREON-12B2": {
      id: 163,
      elementType: "G4_FREON-12B2",
      density: 1.8,
      energy: 284.9,
    },

    "G4_FREON-13": {
      id: 164,
      elementType: "G4_FREON-13",
      density: 0.95,
      energy: 126.6,
    },

    "G4_FREON-13B1": {
      id: 165,
      elementType: "G4_FREON-13B1",
      density: 1.5,
      energy: 210.5,
    },

    "G4_FREON-13I1": {
      id: 166,
      elementType: "G4_FREON-13I1",
      density: 1.8,
      energy: 293.5,
    },

    G4_GADOLINIUM_OXYSULFIDE: {
      id: 167,
      elementType: "G4_GADOLINIUM_OXYSULFIDE",
      density: 7.44,
      energy: 493.3,
    },

    G4_GALLIUM_ARSENIDE: {
      id: 168,
      elementType: "G4_GALLIUM_ARSENIDE",
      density: 5.31,
      energy: 384.9,
    },

    G4_GEL_PHOTO_EMULSION: {
      id: 169,
      elementType: "G4_GEL_PHOTO_EMULSION",
      density: 1.2914,
      energy: 74.8,
    },

    G4_Pyrex_Glass: {
      id: 170,
      elementType: "G4_Pyrex_Glass",
      density: 2.23,
      energy: 134,
    },

    G4_GLASS_LEAD: {
      id: 171,
      elementType: "G4_GLASS_LEAD",
      density: 6.22,
      energy: 526.4,
    },

    G4_GLASS_PLATE: {
      id: 172,
      elementType: "G4_GLASS_PLATE",
      density: 2.4,
      energy: 145.4,
    },

    G4_GLUTAMINE: {
      id: 173,
      elementType: "G4_GLUTAMINE",
      density: 1.46,
      energy: 73.3,
    },

    G4_GLYCEROL: {
      id: 174,
      elementType: "G4_GLYCEROL",
      density: 1.2613,
      energy: 72.6,
    },

    G4_GUANINE: {
      id: 175,
      elementType: "G4_GUANINE",
      density: 2.2,
      energy: 75,
    },

    G4_GUPSUM: {
      id: 176,
      elementType: "G4_GUPSUM",
      density: 2.32,
      energy: 129.7,
    },

    "G4_N-HEPTANE": {
      id: 177,
      elementType: "G4_N-HEPTANE",
      density: 0.68376,
      energy: 54.4,
    },

    "G4_N-HEXANE": {
      id: 178,
      elementType: "G4_N-HEXANE",
      density: 0.6603,
      energy: 54,
    },

    G4_KAPTON: {
      id: 179,
      elementType: "G4_KAPTON",
      density: 1.42,
      energy: 79.6,
    },

    G4_LANTHANUM_OXYBROMIDE: {
      id: 180,
      elementType: "G4_LANTHANUM_OXYBROMIDE",
      density: 6.28,
      energy: 439.7,
    },

    G4_LANTHANUM_OXYSULFIDE: {
      id: 181,
      elementType: "G4_LANTHANUM_OXYSULFIDE",
      density: 5.86,
      energy: 421.2,
    },

    G4_LEAD_OXIDE: {
      id: 182,
      elementType: "G4_LEAD_OXIDE",
      density: 9.53,
      energy: 766.7,
    },

    G4_LITHIUM_AMIDE: {
      id: 183,
      elementType: "G4_LITHIUM_AMIDE",
      density: 1.178,
      energy: 55.5,
    },

    G4_LITHIUM_CARBONATE: {
      id: 184,
      elementType: "G4_LITHIUM_CARBONATE",
      density: 2.11,
      energy: 87.9,
    },

    G4_LITHIUM_FLUORIDE: {
      id: 185,
      elementType: "G4_LITHIUM_FLUORIDE",
      density: 2.635,
      energy: 94,
    },

    G4_LITHIUM_HYDRIDE: {
      id: 186,
      elementType: "G4_LITHIUM_HYDRIDE",
      density: 0.82,
      energy: 36.5,
    },

    G4_LITHIUM_IODIDE: {
      id: 187,
      elementType: "G4_LITHIUM_IODIDE",
      density: 3.494,
      energy: 485.1,
    },

    G4_LITHIUM_OXIDE: {
      id: 188,
      elementType: "G4_LITHIUM_OXIDE",
      density: 2.013,
      energy: 73.6,
    },

    G4_LITHIUM_TETRABORATE: {
      id: 189,
      elementType: "G4_LITHIUM_TETRABORATE",
      density: 2.44,
      energy: 94.6,
    },

    G4_LUNG_ICRP: {
      id: 190,
      elementType: "G4_LUNG_ICRP",
      density: 1.04,
      energy: 75.3,
    },

    G4_M3_WAX: {
      id: 191,
      elementType: "G4_M3_WAX",
      density: 1.05,
      energy: 67.9,
    },

    G4_MAGNESIUM_CARBONATE: {
      id: 192,
      elementType: "G4_MAGNESIUM_CARBONATE",
      density: 2.958,
      energy: 118,
    },

    G4_MAGNESIUM_FLUORIDE: {
      id: 193,
      elementType: "G4_MAGNESIUM_FLUORIDE",
      density: 3,
      energy: 134.3,
    },

    G4_MAGNESIUM_OXIDE: {
      id: 194,
      elementType: "G4_MAGNESIUM_OXIDE",
      density: 3.58,
      energy: 143.8,
    },

    G4_MAGNESIUM_TETRABORATE: {
      id: 195,
      elementType: "G4_MAGNESIUM_TETRABORATE",
      density: 2.53,
      energy: 108.3,
    },

    G4_MERCURIC_IODIDE: {
      id: 196,
      elementType: "G4_MERCURIC_IODIDE",
      density: 6.36,
      energy: 684.5,
    },

    G4_METHANE: {
      id: 197,
      elementType: "G4_METHANE",
      density: 0.000667151,
      energy: 41.7,
    },

    G4_METHANOL: {
      id: 198,
      elementType: "G4_METHANOL",
      density: 0.7914,
      energy: 67.6,
    },

    G4_MIX_D_WAX: {
      id: 199,
      elementType: "G4_MIX_D_WAX",
      density: 0.99,
      energy: 60.9,
    },

    G4_MS20_TISSUE: {
      id: 200,
      elementType: "G4_MS20_TISSUE",
      density: 1,
      energy: 75.1,
    },

    G4_MUSCLE_SKELETAL_ICRP: {
      id: 201,
      elementType: "G4_MUSCLE_SKELETAL_ICRP",
      density: 1.05,
      energy: 75.3,
    },

    G4_MUSCLE_STRIATED_ICRU: {
      id: 202,
      elementType: "G4_MUSCLE_STRIATED_ICRU",
      density: 1.04,
      energy: 74.7,
    },

    G4_MUSCLE_WITHOUT_SUCROSE: {
      id: 203,
      elementType: "G4_MUSCLE_WITHOUT_SUCROSE",
      density: 10.7,
      energy: 74.2,
    },

    G4_NAPHTHALENE: {
      id: 204,
      elementType: "G4_NAPHTHALENE",
      density: 1.145,
      energy: 68.4,
    },

    G4_NITROBENZENE: {
      id: 205,
      elementType: "G4_NITROBENZENE",
      density: 1.19867,
      energy: 75.8,
    },

    G4_NITROUS_OXIDE: {
      id: 206,
      elementType: "G4_NITROUS_OXIDE",
      density: 0.00183094,
      energy: 84.9,
    },

    "G4_NYLON-8062": {
      id: 207,
      elementType: "G4_NYLON-8062",
      density: 1.08,
      energy: 64.3,
    },

    "G4_NYLON-6-6": {
      id: 208,
      elementType: "G4_NYLON-6-6",
      density: 1.14,
      energy: 63.9,
    },

    "G4_NYLON-6-10": {
      id: 209,
      elementType: "G4_NYLON-6-10",
      density: 1.14,
      energy: 63.2,
    },

    "G4_NYLON-11_RILSAN": {
      id: 210,
      elementType: "G4_NYLON-11_RILSAN",
      density: 1.425,
      energy: 61.6,
    },

    G4_OCTANE: {
      id: 211,
      elementType: "G4_OCTANE",
      density: 0.7026,
      energy: 54.7,
    },

    G4_PARAFFIN: {
      id: 212,
      elementType: "G4_PARAFFIN",
      density: 0.93,
      energy: 55.9,
    },

    "G4_N-PENTANE": {
      id: 213,
      elementType: "G4_N-PENTANE",
      density: 0.6262,
      energy: 53.6,
    },

    G4_PHOTO_EMULSION: {
      id: 214,
      elementType: "G4_PHOTO_EMULSION",
      density: 3.815,
      energy: 331,
    },

    G4_PLASTIC_SC_VINYLTOLUENE: {
      id: 215,
      elementType: "G4_PLASTIC_SC_VINYLTOLUENE",
      density: 1.032,
      energy: 64.7,
    },

    G4_PLUTONIUM_DIOXIDE: {
      id: 216,
      elementType: "G4_PLUTONIUM_DIOXIDE",
      density: 11.46,
      energy: 746.5,
    },

    G4_POLYACRYLONITRILE: {
      id: 217,
      elementType: "G4_POLYACRYLONITRILE",
      density: 1.17,
      energy: 69.6,
    },

    G4_POLYCARBONATE: {
      id: 218,
      elementType: "G4_POLYCARBONATE",
      density: 1.2,
      energy: 73.1,
    },

    G4_POLYCHLOROSTYRENE: {
      id: 219,
      elementType: "G4_POLYCHLOROSTYRENE",
      density: 1.3,
      energy: 81.7,
    },

    G4_POLYETHYLENE: {
      id: 220,
      elementType: "G4_POLYETHYLENE",
      density: 0.94,
      energy: 57.4,
    },

    G4_MYLAR: {
      id: 221,
      elementType: "G4_MYLAR",
      density: 1.4,
      energy: 78.7,
    },

    G4_PLEXIGLASS: {
      id: 222,
      elementType: "G4_PLEXIGLASS",
      density: 1.19,
      energy: 74,
    },

    G4_MYLAR: {
      id: 223,
      elementType: "G4_MYLAR",
      density: 1.4,
      energy: 78.7,
    },

    G4_PLEXIGLASS: {
      id: 224,
      elementType: "G4_PLEXIGLASS",
      density: 1.19,
      energy: 74,
    },

    G4_POLYXYMETHYLENE: {
      id: 225,
      elementType: "G4_POLYXYMETHYLENE",
      density: 1.425,
      energy: 77.4,
    },

    G4_POLYPROPYLENE: {
      id: 226,
      elementType: "G4_POLYPROPYLENE",
      density: 0.9,
      energy: 56.5,
    },

    G4_POLYSTYRENE: {
      id: 227,
      elementType: "G4_POLYSTYRENE",
      density: 1.06,
      energy: 68.7,
    },

    G4_TEFLON: {
      id: 228,
      elementType: "G4_TEFLON",
      density: 2.2,
      energy: 99.1,
    },

    G4_POLYTRIFLUOROCHLOROETHYLENE: {
      id: 229,
      elementType: "G4_POLYTRIFLUOROCHLOROETHYLENE",
      density: 2.1,
      energy: 120.7,
    },

    G4_POLYVINYL_ACETATE: {
      id: 230,
      elementType: "G4_POLYVINYL_ACETATE",
      density: 1.19,
      energy: 73.7,
    },

    G4_POLYVINYL_ALCOHOL: {
      id: 231,
      elementType: "G4_POLYVINYL_ALCOHOL",
      density: 1.3,
      energy: 69.7,
    },

    G4_POLYVINYL_BUTYRAL: {
      id: 232,
      elementType: "G4_POLYVINYL_BUTYRAL",
      density: 1.12,
      energy: 67.2,
    },

    G4_POLYVINYL_CHLORIDE: {
      id: 233,
      elementType: "G4_POLYVINYL_CHLORIDE",
      density: 1.3,
      energy: 108.2,
    },

    G4_POLYVINYLIDENE_CHLORIDE: {
      id: 234,
      elementType: "G4_POLYVINYLIDENE_CHLORIDE",
      density: 1.7,
      energy: 134.3,
    },

    G4_POLYVINYLIDENE_FLUORIDE: {
      id: 235,
      elementType: "G4_POLYVINYLIDENE_FLUORIDE",
      density: 1.76,
      energy: 88.8,
    },

    G4_POLYVINYL_PYRROLIDONE: {
      id: 236,
      elementType: "G4_POLYVINYL_PYRROLIDONE",
      density: 1.25,
      energy: 67.7,
    },

    G4_POTASSIUM_IODIDE: {
      id: 237,
      elementType: "G4_POTASSIUM_IODIDE",
      density: 3.13,
      energy: 431.9,
    },

    G4_POTASSIUM_OXIDE: {
      id: 238,
      elementType: "G4_POTASSIUM_OXIDE",
      density: 2.32,
      energy: 189.9,
    },

    G4_PROPANE: {
      id: 239,
      elementType: "G4_PROPANE",
      density: 0.00187939,
      energy: 47.1,
    },

    G4_lPROPANE: {
      id: 240,
      elementType: "G4_lPROPANE",
      density: 0.43,
      energy: 52,
    },

    "G4_N-PROPYL_ALCOHOL": {
      id: 241,
      elementType: "G4_N-PROPYL_ALCOHOL",
      density: 0.8035,
      energy: 61.1,
    },

    G4_PYRIDINE: {
      id: 242,
      elementType: "G4_PYRIDINE",
      density: 0.9819,
      energy: 66.2,
    },

    G4_RUBBER_BUTYL: {
      id: 243,
      elementType: "G4_RUBBER_BUTYL",
      density: 0.92,
      energy: 59.8,
    },

    G4_RUBBER_NEOPRENE: {
      id: 244,
      elementType: "G4_RUBBER_NEOPRENE",
      density: 1.23,
      energy: 93,
    },

    G4_SILICON_DIOXIDE: {
      id: 245,
      elementType: "G4_SILICON_DIOXIDE",
      density: 2.32,
      energy: 139.2,
    },

    G4_SILVER_BROMIDE: {
      id: 246,
      elementType: "G4_SILVER_BROMIDE",
      density: 6.473,
      energy: 486.6,
    },

    G4_SILVER_CHLORIDE: {
      id: 247,
      elementType: "G4_SILVER_CHLORIDE",
      density: 5.56,
      energy: 398.4,
    },

    G4_SILVER_HALIDES: {
      id: 248,
      elementType: "G4_SILVER_HALIDES",
      density: 6.47,
      energy: 487.1,
    },

    G4_SILVER_IODIDE: {
      id: 249,
      elementType: "G4_SILVER_IODIDE",
      density: 6.01,
      energy: 543.5,
    },

    G4_SKIN_ICRP: {
      id: 250,
      elementType: "G4_SKIN_ICRP",
      density: 1.09,
      energy: 72.7,
    },

    G4_SODIUM_CARBONATE: {
      id: 251,
      elementType: "G4_SODIUM_CARBONATE",
      density: 2.532,
      energy: 125,
    },

    G4_SODIUM_IODIDE: {
      id: 252,
      elementType: "G4_SODIUM_IODIDE",
      density: 3.667,
      energy: 452,
    },

    G4_SODIUM_MONOXIDE: {
      id: 253,
      elementType: "G4_SODIUM_MONOXIDE",
      density: 2.27,
      energy: 148.8,
    },

    G4_SODIUM_NITRATE: {
      id: 254,
      elementType: "G4_SODIUM_NITRATE",
      density: 2.261,
      energy: 114.6,
    },

    G4_STILBENE: {
      id: 255,
      elementType: "G4_STILBENE",
      density: 0.9707,
      energy: 67.7,
    },

    G4_SUCROSE: {
      id: 256,
      elementType: "G4_SUCROSE",
      density: 1.5805,
      energy: 77.5,
    },

    G4_TERPHENYL: {
      id: 257,
      elementType: "G4_TERPHENYL",
      density: 1.24,
      energy: 71.7,
    },

    G4_TESTIS_ICRP: {
      id: 258,
      elementType: "G4_TESTIS_ICRP",
      density: 1.04,
      energy: 75,
    },

    G4_TETRACHLOROETHYLENE: {
      id: 259,
      elementType: "G4_TETRACHLOROETHYLENE",
      density: 1.625,
      energy: 159.2,
    },

    G4_THALLIUM_CHLORIDE: {
      id: 260,
      elementType: "G4_THALLIUM_CHLORIDE",
      density: 7.004,
      energy: 690.3,
    },

    G4_TISSUE_SOFT_ICRP: {
      id: 261,
      elementType: "G4_TISSUE_SOFT_ICRP",
      density: 1.03,
      energy: 72.3,
    },

    "G4_TISSUE_SOFT_ICRU-4": {
      id: 262,
      elementType: "G4_TISSUE_SOFT_ICRU-4",
      density: 1,
      energy: 74.9,
    },

    "G4_TISSUE-METHANE": {
      id: 263,
      elementType: "G4_TISSUE-METHANE",
      density: 0.00106409,
      energy: 61.2,
    },

    "G4_TISSUE-PROPANE": {
      id: 264,
      elementType: "G4_TISSUE-PROPANE",
      density: 0.00182628,
      energy: 59.5,
    },

    G4_TITANIUM_DIOXIDE: {
      id: 265,
      elementType: "G4_TITANIUM_DIOXIDE",
      density: 4.26,
      energy: 179.5,
    },

    G4_TOLUENE: {
      id: 266,
      elementType: "G4_TOLUENE",
      density: 0.8669,
      energy: 62.5,
    },

    G4_TRICHLOROETHYLENE: {
      id: 267,
      elementType: "G4_TRICHLOROETHYLENE",
      density: 1.46,
      energy: 148.1,
    },

    G4_TRIETHYL_PHOSPHATE: {
      id: 268,
      elementType: "G4_TRIETHYL_PHOSPHATE",
      density: 1.07,
      energy: 81.2,
    },

    G4_TUNGSTEN_HEXAFLUORIDE: {
      id: 269,
      elementType: "G4_TUNGSTEN_HEXAFLUORIDE",
      density: 2.4,
      energy: 354.4,
    },

    G4_URANIUM_DICARBIDE: {
      id: 270,
      elementType: "G4_URANIUM_DICARBIDE",
      density: 11.28,
      energy: 752,
    },

    G4_URANIUM_MONOCARBIDE: {
      id: 271,
      elementType: "G4_URANIUM_MONOCARBIDE",
      density: 13.63,
      energy: 862,
    },

    G4_URANIUM_OXIDE: {
      id: 272,
      elementType: "G4_URANIUM_OXIDE",
      density: 10.96,
      energy: 720.6,
    },

    G4_UREA: {
      id: 273,
      elementType: "G4_UREA",
      density: 1.323,
      energy: 72.8,
    },

    G4_VALINE: {
      id: 274,
      elementType: "G4_VALINE",
      density: 1.23,
      energy: 67.7,
    },

    G4_VITON: {
      id: 275,
      elementType: "G4_VITON",
      density: 1.8,
      energy: 98.6,
    },

    G4_WATER: {
      id: 276,
      elementType: "G4_WATER",
      density: 1,
      energy: 78,
    },

    G4_WATER_VAPOR: {
      id: 277,
      elementType: "G4_WATER_VAPOR",
      density: 0.000756182,
      energy: 71.6,
    },

    G4_XYLENE: {
      id: 278,
      elementType: "G4_XYLENE",
      density: 0.87,
      energy: 61.8,
    },

    G4_GRAPHITE: {
      id: 279,
      elementType: "G4_GRAPHITE",
      dens279: 2.21,
      energy: 78,
    },

    //HEP and Nuclear Materials

    G4_lH2: {
      id: 280,
      elementType: "G4_lH2",
      density: 0.0708,
      energy: 21.8,
    },

    G4_lN2: {
      id: 281,
      elementType: "G4_lN2",
      density: 0.807,
      energy: 21.8,
    },

    G4_lO2: {
      id: 282,
      elementType: "G4_lO2",
      density: 1.141,
      energy: 95,
    },

    G4_lAr: {
      id: 283,
      elementType: "G4_lAr",
      density: 1.1396,
      energy: 188,
    },

    G4_lBr: {
      id: 284,
      elementType: "G4_lBr",
      density: 3.1028,
      energy: 343,
    },

    G4_lKr: {
      id: 285,
      elementType: "G4_lKr",
      density: 2.418,
      energy: 352,
    },

    G4_lXe: {
      id: 286,
      elementType: "G4_lXe",
      density: 2.953,
      energy: 482,
    },

    G4_PbWO4: {
      id: 287,
      elementType: "G4_PbWO4",
      density: 8.28,
      energy: 0,
    },

    G4_Galactic: {
      id: 288,
      elementType: "G4_Galactic",
      density: 1e-25,
      energy: 21.8,
    },

    G4_GRAPHITE_POROUS: {
      id: 289,
      elementType: "G4_GRAPHITE_POROUS",
      density: 1.7,
      energy: 78,
    },

    G4_LUCITE: {
      id: 290,
      elementType: "G4_LUCITE",
      density: 1.19,
      energy: 74,
    },

    G4_BRASS: {
      id: 291,
      elementType: "G4_BRASS",
      density: 8.52,
      energy: 0,
    },

    G4_BRONZE: {
      id: 292,
      elementType: "G4_BRONZE",
      density: 8.82,
      energy: 0,
    },

    "G4_STAINLESS-STEEL": {
      id: 293,
      elementType: "G4_STAINLESS-STEEL",
      density: 8,
      energy: 0,
    },

    G4_CR39: {
      id: 294,
      elementType: "G4_CR39",
      density: 1.32,
      energy: 0,
    },

    G4_OCTADECANOL: {
      id: 295,
      elementType: "G4_OCTADECANOL",
      dens295: 0.812,
      energy: 0,
    },

    //Space (ISS) Materials

    G4_KEVLAR: {
      id: 296,
      elementType: "G4_KEVLAR",
      density: 1.44,
      energy: 0,
    },

    G4_DACRON: {
      id: 297,
      elementType: "G4_DACRON",
      density: 1.4,
      energy: 0,
    },

    G4_NEOPRENE: {
      id: 297,
      elementType: "G4_NEOPRENE",
      dens298: 1.23,
      energy: 0,
    },

    //Bio-Chemical Materials

    G4_CYTOSINE: {
      id: 299,
      elementType: "G4_CYTOSINE",
      density: 1.55,
      energy: 72,
    },

    G4_THYMINE: {
      id: 300,
      elementType: "G4_THYMINE",
      density: 1.23,
      energy: 72,
    },

    G4_URACIL: {
      id: 301,
      elementType: "G4_URACIL",
      density: 1.32,
      energy: 72,
    },

    G4_DNA_ADENITE: {
      id: 302,
      elementType: "G4_DNA_ADENITE",
      density: 1,
      energy: 72,
    },

    G4_DNA_GUANINE: {
      id: 303,
      elementType: "G4_DNA_GUANINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_CYTOSINE: {
      id: 304,
      elementType: "G4_DNA_CYTOSINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_THYMINE: {
      id: 305,
      elementType: "G4_DNA_THYMINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_URACIL: {
      id: 306,
      elementType: "G4_DNA_URACIL",
      density: 1,
      energy: 72,
    },

    G4_DNA_ADENOSINE: {
      id: 307,
      elementType: "G4_DNA_ADENOSINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_GUANOSINE: {
      id: 308,
      elementType: "G4_DNA_GUANOSINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_CYTIDINE: {
      id: 309,
      elementType: "G4_DNA_CYTIDINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_URIDINE: {
      id: 310,
      elementType: "G4_DNA_URIDINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_METHYLURIDINE: {
      id: 311,
      elementType: "G4_DNA_METHYLURIDINE",
      density: 1,
      energy: 72,
    },

    G4_DNA_MONOPHOSPHATE: {
      id: 312,
      elementType: "G4_DNA_MONOPHOSPHATE",
      density: 1,
      energy: 72,
    },

    G4_DNA_A: {
      id: 313,
      elementType: "G4_DNA_A",
      density: 1,
      energy: 72,
    },

    G4_DNA_G: {
      id: 314,
      elementType: "G4_DNA_G",
      density: 1,
      energy: 72,
    },

    G4_DNA_C: {
      id: 315,
      elementType: "G4_DNA_C",
      density: 1,
      energy: 72,
    },

    G4_DNA_U: {
      id: 316,
      elementType: "G4_DNA_U",
      density: 1,
      energy: 72,
    },

    G4_DNA_MU: {
      id: 317,
      elementType: "G4_DNA_MU",
      density: 1,
      energy: 72,
    },
  };
}

export { Loader };
