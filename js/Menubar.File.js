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
		} 
		// else if (fileExtension === 'tg') {
		// 	const reader = new FileReader();
		// 	reader.onload = function() {
        //         var content = reader.result;
        //         // You can process the content here, such as splitting it into an array
        //         var lines = content.split('\n');
        //         console.log(lines);
        //     };
        //     reader.readAsText(file);
		// } 
		else {
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

	// Export TG

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/geant4' ) );
	// option.onClick( async function () {

	// 	function traversebooleanObjects(object, callback ) {

	// 		callback( object );
	// 		const children = object.childrenObject;
	// 		if(!children) return

	// 		for ( let i = 0, l = children.length; i < l; i ++ ) {

	// 			traversebooleanObjects(children[ i ], callback );

	// 		}

	// 	}

	// 	function getRotationText( object, boolean = false ) {
	// 		let rotated = object.rotation;
	// 		let rotateX = rotated.x * 180 / Math.PI;
	// 		let rotateY = rotated.y * 180 / Math.PI;
	// 		let rotateZ = rotated.z * 180 / Math.PI;
	// 		if(boolean){
	// 			let rotated1 = object.childrenObject[0].rotation;
	// 			let rotated2 = object.childrenObject[1].rotation;

	// 			let rotateX1 = rotated1.x * 180 / Math.PI;
	// 			let rotateY1 = rotated1.y * 180 / Math.PI;
	// 			let rotateZ1 = rotated1.z * 180 / Math.PI;
	// 			let rotateX2 = rotated2.x * 180 / Math.PI;
	// 			let rotateY2 = rotated2.y * 180 / Math.PI;
	// 			let rotateZ2 = rotated2.z * 180 / Math.PI;

	// 			let rotateX = rotateX2 - rotateX1;
	// 			let rotateY = rotateY2 - rotateY1;
	// 			let rotateZ = rotateZ2 - rotateZ1;

	// 			return `:rotm ${object.name}_rot ${rotateX1.toFixed(5)} ${rotateY1.toFixed(5)} ${rotateZ1.toFixed(5)}\n:rotm ${object.name}_rot_rel ${rotateX.toFixed(5)} ${rotateY.toFixed(5)} ${rotateZ.toFixed(5)}\n`
	// 		} else {
	// 			return `:rotm ${object.name}_rot ${rotateX.toFixed(5)} ${rotateY.toFixed(5)} ${rotateZ.toFixed(5)}\n`
	// 		}
			
	// 	}

	// 	function getSolidText( object ) {
	// 		let solidText1 = '';
	// 		switch (object.geometry.type) {
	// 			case "BoxGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} BOX ${object.geometry.parameters.width}*cm ${object.geometry.parameters.depth}*cm ${object.geometry.parameters.height}*cm\n`
					
	// 				break;

	// 			case "SphereGeometry2":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} SPHERE ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi} ${object.geometry.parameters.pSTheta} ${object.geometry.parameters.pDTheta}\n`
					
	// 				break;

	// 			case "aTubeGeometry":
					
	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TUBS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
	// 				break;

	// 			case "aCutTubeGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} CUTTUB ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
	// 				break;

	// 			case "aConeGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} CONS ${object.geometry.parameters.pRMin2}*cm ${object.geometry.parameters.pRMax2}*cm ${object.geometry.parameters.pRMin1}*cm ${object.geometry.parameters.pRMax1}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
	// 				break;

	// 			case "aParallGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} PARA ${object.geometry.parameters.dx}*cm ${object.geometry.parameters.dy}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi}\n`
					
	// 				break;

	// 			case "aTrapeZoidGeometry":
					
	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2} ${object.geometry.parameters.dz}*cm\n`
					
	// 				break;

	// 			case "aTrapeZoidPGeometry": 

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TRAP ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.phi} ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm ${object.geometry.parameters.phi}\n`
					
	// 				break;

	// 			case "aTorusGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TORUS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pRTor}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
	// 				break;
				
	// 			case "aEllipticalCylinderGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPTICAL_TUBE ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.semiAxisY}*cm ${object.geometry.parameters.Dz}*cm\n`
					
	// 				break;
				
	// 			case "aEllipsoidGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPSOID ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.ySemiAxis}*cm ${object.geometry.parameters.zSemiAxis}*cm ${object.geometry.parameters.zBottomCut}*cm ${object.geometry.parameters.zTopCut}*cm\n`
					
	// 				break;

	// 			case "aEllipticalConeGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPTICAL_CONE ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.ySemiAxis}*cm ${object.geometry.parameters.height}*cm ${object.geometry.parameters.zTopCut}*cm\n`
					
	// 				break;

	// 			case "aTwistedBoxGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_BOX ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.width}*cm ${object.geometry.parameters.height}*cm ${object.geometry.parameters.depth}*cm\n`
					
	// 				break;

	// 			case "aTwistedTrdGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_TRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.twistedangle}\n`
					
	// 				break;

	// 			case "aTwistedTrapGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_TRAP ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm\n`
					
	// 				break;

	// 			case "aTwistedTubeGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_TUBS ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pDPhi}\n`
					
	// 				break;

	// 			case "aTetrahedraGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TET ${object.geometry.parameters.anchor[0].toFixed(7)}*cm ${object.geometry.parameters.anchor[1].toFixed(7)}*cm ${object.geometry.parameters.anchor[2].toFixed(7)}*cm ${object.geometry.parameters.p2[0].toFixed(7)}*cm ${object.geometry.parameters.p2[1].toFixed(7)}*cm ${object.geometry.parameters.p2[2].toFixed(7)}*cm ${object.geometry.parameters.p3[0].toFixed(7)}*cm ${object.geometry.parameters.p3[1].toFixed(7)}*cm ${object.geometry.parameters.p3[2].toFixed(7)}*cm ${object.geometry.parameters.p4[0].toFixed(7)}*cm ${object.geometry.parameters.p4[1].toFixed(7)}*cm ${object.geometry.parameters.p4[2].toFixed(7)}*cm\n`
					
	// 				break;

	// 			case "aHyperboloidGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} HYPE ${object.geometry.parameters.radiusIn}*cm ${object.geometry.parameters.radiusOut}*cm ${object.geometry.parameters.stereo1} ${object.geometry.parameters.stereo2} ${object.geometry.parameters.pDz}*cm\n`
					
	// 				break;

	// 			case "aPolyconeGeometry":

	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} POLYCONE ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n`
					
	// 				break;

	// 			case "aPolyhedraGeometry":
					
	// 				solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} POLYHEDRA ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numSide} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n`
					
	// 				break;
				
	// 			case "unitedGeometry":

	// 				{
	// 					const positionX1 = object.childrenObject[0].position.x;
	// 					const positionY1 = object.childrenObject[0].position.y;
	// 					const positionZ1 = object.childrenObject[0].position.z;
						
	// 					const positionX2 = object.childrenObject[1].position.x;
	// 					const positionY2 = object.childrenObject[1].position.y;
	// 					const positionZ2 = object.childrenObject[1].position.z;

	// 					const positionX = positionX2 - positionX1;
	// 					const positionY = positionY2 - positionY1;
	// 					const positionZ = positionZ2 - positionZ1;

	// 					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} UNION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name: object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`
	// 				}
	// 				break;

	// 			case "subtractedGeometry":

	// 				{
	// 					const positionX1 = object.childrenObject[0].position.x;
	// 					const positionY1 = object.childrenObject[0].position.y;
	// 					const positionZ1 = object.childrenObject[0].position.z;
						
	// 					const positionX2 = object.childrenObject[1].position.x;
	// 					const positionY2 = object.childrenObject[1].position.y;
	// 					const positionZ2 = object.childrenObject[1].position.z;
	
	// 					const positionX = positionX2 - positionX1;
	// 					const positionY = positionY2 - positionY1;
	// 					const positionZ = positionZ2 - positionZ1;
	
	// 					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} SUBTRACTION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name : object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`
	// 				}
					
	// 				break;
					
	// 			case "intersectedGeometry":

	// 				{
	// 					const positionX1 = object.childrenObject[0].position.x;
	// 					const positionY1 = object.childrenObject[0].position.y;
	// 					const positionZ1 = object.childrenObject[0].position.z;
						
	// 					const positionX2 = object.childrenObject[1].position.x;
	// 					const positionY2 = object.childrenObject[1].position.y;
	// 					const positionZ2 = object.childrenObject[1].position.z;
	
	// 					const positionX = positionX2 - positionX1;
	// 					const positionY = positionY2 - positionY1;
	// 					const positionZ = positionZ2 - positionZ1;
	
	// 					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} INTERSECTION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name : object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`
	// 				}
					
	// 				break;
					
	// 			default:

	// 				break;
	// 		}

	// 		return solidText1;
	// 	}
	// 	const object = editor.selected;

	// 	let solidText = '';
	// 	let rotationText = '';


	// 	if ( object !== null && object.isMesh != undefined ) {
	// 		var txt = `:volu world BOX 5*m 5*m 5*m G4_AIR\n`;
	// 		const rotated = object.rotation;
	// 		const rotateX = rotated.x * 180 / Math.PI;
	// 		const rotateY = rotated.y * 180 / Math.PI;
	// 		const rotateZ = rotated.z * 180 / Math.PI;

	// 		const rotateX1 = object.childrenObject[0].rotation.x * 180 / Math.PI;
	// 		const rotateY1 = object.childrenObject[0].rotation.y * 180 / Math.PI;
	// 		const rotateZ1 = object.childrenObject[0].rotation.z * 180 / Math.PI;
	
	// 		if(object.geometry.type === "unitedGeometry" || object.geometry.type === "subtractedGeometry" || object.geometry.type === "intersectedGeometry") {
	// 			txt += `:rotm r000 ${rotateX1.toFixed(5)} ${rotateY1.toFixed(5)} ${rotateZ1.toFixed(5)}\n`;
	// 		}
	// 		else {
	// 			txt += `:rotm r000 ${rotateX.toFixed(5)} ${rotateY.toFixed(5)} ${rotateZ.toFixed(5)}\n`;
	// 		}
			
	
	// 		traversebooleanObjects(object, function ( child ) {

	// 			if( child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry"){
	// 				rotationText += getRotationText(child, true);
	// 			}
	// 			solidText += getSolidText(child);
	
	// 		} );
	// 		switch (object.geometry.type) {
	// 			case "unitedGeometry":
	// 				{
	// 					txt += `${rotationText}\n`;
	// 					txt += `${solidText}\n`;
	// 					txt += `:volu mybox box ${object.material.newmaterial?.elementType}\n\n`
	// 					txt += `:place mybox 1 world r000 ${object.childrenObject[0].position.x.toFixed(6)/10}*cm ${object.childrenObject[0].position.y.toFixed(6)/10}*cm ${object.childrenObject[0].position.z.toFixed(6)/10}*cm\n`
	// 					downloadGeant4File( txt, 'unitedGeometry.tg');
	// 				}
					
	// 				break;
				
	// 			case "subtractedGeometry":
	// 				{
	// 					txt += `${rotationText}\n`;
	// 					txt += `${solidText}\n`;
	// 					txt += `:volu mybox box ${object.material.newmaterial?.elementType}\n\n`;
	// 					txt += `:place mybox 1 world r000 ${object.childrenObject[0].position.x.toFixed(6)/10}*cm ${object.childrenObject[0].position.y.toFixed(6)/10}*cm ${object.childrenObject[0].position.z.toFixed(6)/10}*cm\n`
	// 					downloadGeant4File( txt, 'subtractedGeometry.tg');	
	// 				}
					
	// 				break;
					
	// 			case "intersectedGeometry":
	// 				{
	// 					txt += `${rotationText}\n`;
	// 					txt += `${solidText}\n`;
	// 					txt += `:volu mybox box ${object.material.newmaterial?.elementType}\n\n`
	// 					txt += `:place mybox 1 world r000 ${object.childrenObject[0].position.x.toFixed(6)/10}*cm ${object.childrenObject[0].position.y.toFixed(6)/10}*cm ${object.childrenObject[0].position.z.toFixed(6)/10}*cm\n`
	// 					downloadGeant4File( txt, 'intersectedGeometry.tg');
	// 				}

	// 				break;

	// 			case "BoxGeometry":

	// 				txt += `\n:solid box BOX ${object.geometry.parameters.width}*cm ${object.geometry.parameters.depth}*cm ${object.geometry.parameters.height}*cm\n\n`
	// 				txt += `:volu mybox box ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mybox 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'box.tg');
	// 				break;

	// 			case "SphereGeometry2":

	// 				txt += `\n:solid mysphere SPHERE ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi} ${object.geometry.parameters.pSTheta} ${object.geometry.parameters.pDTheta}\n\n`
	// 				txt += `:volu mysphere mysphere ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mysphere 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'sphere.tg');
	// 				break;

	// 			case "aTubeGeometry":
					
	// 				txt += `\n:solid mytub TUBS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
	// 				txt += `:volu mytub mytub ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mytub 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'tub.tg');
	// 				break;

	// 			case "aCutTubeGeometry":

	// 				txt += `\n:solid mytub CUTTUB ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
	// 				txt += `:volu mytub mytub ${object.geometry.parameters.pRMin}*cm\n\n`
	// 				txt += `:place mytub 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'ctub.tg');
	// 				break;

	// 			case "aConeGeometry":

	// 				txt += `\n:solid mycone CONS ${object.geometry.parameters.pRMin2}*cm ${object.geometry.parameters.pRMax2}*cm ${object.geometry.parameters.pRMin1}*cm ${object.geometry.parameters.pRMax1}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
	// 				txt += `:volu mycone mycone ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mycone 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'cone.tg');
	// 				break;

	// 			case "aParallGeometry":

	// 				txt += `\n:solid mypara PARA ${object.geometry.parameters.dx}*cm ${object.geometry.parameters.dy}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi}\n\n`
	// 				txt += `:volu mypara mypara ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mypara 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'parallelepiped.tg');
	// 				break;

	// 			case "aTrapeZoidGeometry":
					
	// 				txt += `\n:solid mytrd TRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dz}*cm\n\n`
	// 				txt += `:volu mytrd mytrd ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mytrd 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n\n`
	// 				downloadGeant4File( txt, 'trapzoid.tg');
	// 				break;

	// 			case "aTrapeZoidPGeometry": 

	// 				txt += `\n:solid mytrdp TRAP ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.phi} ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm ${object.geometry.parameters.phi}\n\n`
	// 				txt += `:volu mytrdp mytrdp ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mytrdp 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'trapezoidp.tg');
	// 				break;

	// 			case "aTorusGeometry":

	// 				txt += `\n:solid mytorus TORUS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pRTor}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
	// 				txt += `:volu mytorus mytorus ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mytorus 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'torus.tg');
	// 				break;
				
	// 			case "aEllipticalCylinderGeometry":

	// 				txt += `\n:solid myellipT ELLIPTICAL_TUBE ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.semiAxisY}*cm ${object.geometry.parameters.Dz}*cm\n\n`
	// 				txt += `:volu myellipT myellipT ${object.manager.name.elementType}\n\n`
	// 				txt += `:place myellipT 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'ellipeTub.tg');
	// 				break;
				
	// 			case "aEllipsoidGeometry":

	// 				txt += `\n:solid myellipsoid ELLIPSOID ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.ySemiAxis}*cm ${object.geometry.parameters.zSemiAxis}*cm ${object.geometry.parameters.zBottomCut}*cm ${object.geometry.parameters.zTopCut}*cm\n\n`
	// 				txt += `:volu myellipsoid myellipsoid ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place myellipsoid 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'ellipsoid.tg');
	// 				break;

	// 			case "aEllipticalConeGeometry":

	// 				txt += `\n:solid myellipticalcone ELLIPTICAL_CONE ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.ySemiAxis}*cm ${object.geometry.parameters.height}*cm ${object.geometry.parameters.zTopCut}*cm\n\n`
	// 				txt += `:volu myellipticalcone myellipticalcone ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place myellipticalcone 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'ellipticalcone.tg');
	// 				break;

	// 			case "aTwistedBoxGeometry":

	// 				txt += `\n:solid mytbox TWISTED_BOX ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.width}*cm ${object.geometry.parameters.height}*cm ${object.geometry.parameters.depth}*cm\n\n`
	// 				txt += `:volu mytbox mytbox ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mytbox 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'twistedbox.tg');
	// 				break;

	// 			case "aTwistedTrdGeometry":

	// 				txt += `\n:solid myttrd TWISTED_TRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.twistedangle}\n\n`
	// 				txt += `:volu myttrd myttrap ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place myttrd 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'twistedtrapzoid.tg');
	// 				break;

	// 			case "aTwistedTrapGeometry":

	// 				txt += `\n:solid myttrap TWISTED_TRAP ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm\n\n`
	// 				txt += `:volu myttrap myttrap ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place myttrap 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'twistedtrapezoidp.tg');
	// 				break;

	// 			case "aTwistedTubeGeometry":

	// 				txt += `\n:solid myttubs TWISTED_TUBS ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pDPhi}\n\n`
	// 				txt += `:volu myttubs myttubs ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place myttubs 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'twistedtub.tg');
	// 				break;

	// 			case "aTetrahedraGeometry":

	// 				txt += `\n:solid mytetra TET ${object.geometry.parameters.anchor[0].toFixed(7)}*cm ${object.geometry.parameters.anchor[1].toFixed(7)}*cm ${object.geometry.parameters.anchor[2].toFixed(7)}*cm ${object.geometry.parameters.p2[0].toFixed(7)}*cm ${object.geometry.parameters.p2[1].toFixed(7)}*cm ${object.geometry.parameters.p2[2].toFixed(7)}*cm ${object.geometry.parameters.p3[0].toFixed(7)}*cm ${object.geometry.parameters.p3[1].toFixed(7)}*cm ${object.geometry.parameters.p3[2].toFixed(7)}*cm ${object.geometry.parameters.p4[0].toFixed(7)}*cm ${object.geometry.parameters.p4[1].toFixed(7)}*cm ${object.geometry.parameters.p4[2].toFixed(7)}*cm\n\n`
	// 				txt += `:volu mytetra mytetra ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mytetra 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'tetrahedra.tg');
	// 				break;

	// 			case "aHyperboloidGeometry":

	// 				txt += `\n:solid myhyperboloid HYPE ${object.geometry.parameters.radiusIn}*cm ${object.geometry.parameters.radiusOut}*cm ${object.geometry.parameters.stereo1} ${object.geometry.parameters.stereo2} ${object.geometry.parameters.pDz}*cm\n\n`
	// 				txt += `:volu myhyperboloid myhyperboloid ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place myhyperboloid 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'hyperboloid.tg');
	// 				break;

	// 			case "aPolyconeGeometry":

	// 				txt += `\n:solid myploycone POLYCONE ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n\n`
	// 				txt += `:volu myploycone mypolycone ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mypolycone 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'polycone.tg');
	// 				break;

	// 			case "aPolyhedraGeometry":
					
	// 				txt += `\n:solid mypolyhedra POLYHEDRA ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numSide} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n\n`
	// 				txt += `:volu mypolyhedra mypolyhedra ${object.material.newmaterial?.elementType}\n\n`
	// 				txt += `:place mypolyhedra 1 world r000 ${object.position.x.toFixed(6)/10}*cm ${object.position.y.toFixed(6)/10}*cm ${object.position.z.toFixed(6)/10}*cm\n`
	// 				downloadGeant4File( txt, 'polyhedra.tg');
	// 				break;

	// 			default:

	// 				break;
	// 		}
	// 	} else {
	// 		alert( 'Please select a model!');
	// 	}

	// 	// TODO: Change to DRACOExporter's parse( geometry, onParse )?
		

	// } );
	// options.add( option );

	// Export TG Scene

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geant4_scene' ) );
	option.onClick( async function () {

		const loginStatus = localStorage.getItem('loginStatus');

		if(loginStatus === undefined || loginStatus === 'false') {
			alert( 'You must log in to export files.');
			return;
		}

		function traversebooleanObjects(object, callback ) {

			callback( object );
			const children = object.childrenObject;
			if(!children) return

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				traversebooleanObjects(children[ i ], callback );

			}

		}

		function getRotationText( object, boolean = false ) {
			let rotated = object.rotation;
			let rotateX = rotated.x * 180 / Math.PI;
			let rotateY = rotated.y * 180 / Math.PI;
			let rotateZ = rotated.z * 180 / Math.PI;
			if(boolean){
				let rotated1 = object.childrenObject[0].rotation;
				let rotated2 = object.childrenObject[1].rotation;

				let rotateX1 = rotated1.x * 180 / Math.PI;
				let rotateY1 = rotated1.y * 180 / Math.PI;
				let rotateZ1 = rotated1.z * 180 / Math.PI;
				let rotateX2 = rotated2.x * 180 / Math.PI;
				let rotateY2 = rotated2.y * 180 / Math.PI;
				let rotateZ2 = rotated2.z * 180 / Math.PI;

				let rotateX = rotateX2 - rotateX1;
				let rotateY = rotateY2 - rotateY1;
				let rotateZ = rotateZ2 - rotateZ1;

				return `:rotm ${object.name}_rot ${rotateX1.toFixed(5)} ${rotateY1.toFixed(5)} ${rotateZ1.toFixed(5)}\n:rotm ${object.name}_rot_rel ${rotateX.toFixed(5)} ${rotateY.toFixed(5)} ${rotateZ.toFixed(5)}\n`
			} else {
				return `:rotm ${object.name}_rot ${rotateX.toFixed(5)} ${rotateY.toFixed(5)} ${rotateZ.toFixed(5)}\n`
			}
			
		}

		function getSolidText( object ) {
			let solidText1 = '';
			switch (object.geometry.type) {
				case "BoxGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} BOX ${object.geometry.parameters.width}*cm ${object.geometry.parameters.depth}*cm ${object.geometry.parameters.height}*cm\n`
					
					break;

				case "SphereGeometry2":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} SPHERE ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi} ${object.geometry.parameters.pSTheta} ${object.geometry.parameters.pDTheta}\n`
					
					break;

				case "aTubeGeometry":
					
					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TUBS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
					break;

				case "aCutTubeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} CUTTUB ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
					break;

				case "aConeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} CONS ${object.geometry.parameters.pRMin2}*cm ${object.geometry.parameters.pRMax2}*cm ${object.geometry.parameters.pRMin1}*cm ${object.geometry.parameters.pRMax1}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
					break;

				case "aParallGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} PARA ${object.geometry.parameters.dx}*cm ${object.geometry.parameters.dy}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi}\n`
					
					break;

				case "aTrapeZoidGeometry":
					
					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dz}*cm\n`
					
					break;

				case "aTrapeZoidPGeometry": 

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TRAP ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.phi} ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm ${object.geometry.parameters.phi}\n`
					
					break;

				case "aTorusGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TORUS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pRTor}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`
					
					break;
				
				case "aEllipticalCylinderGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPTICAL_TUBE ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.semiAxisY}*cm ${object.geometry.parameters.Dz}*cm\n`
					
					break;
				
				case "aEllipsoidGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPSOID ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.ySemiAxis}*cm ${object.geometry.parameters.zSemiAxis}*cm ${object.geometry.parameters.zBottomCut}*cm ${object.geometry.parameters.zTopCut}*cm\n`
					
					break;

				case "aEllipticalConeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPTICAL_CONE ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.ySemiAxis}*cm ${object.geometry.parameters.height}*cm ${object.geometry.parameters.zTopCut}*cm\n`
					
					break;

				case "aTwistedBoxGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_BOX ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.width}*cm ${object.geometry.parameters.height}*cm ${object.geometry.parameters.depth}*cm\n`
					
					break;

				case "aTwistedTrdGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_TRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.twistedangle}\n`
					
					break;

				case "aTwistedTrapGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_TRAP ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm\n`
					
					break;

				case "aTwistedTubeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTED_TUBS ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pDPhi}\n`
					
					break;

				case "aTetrahedraGeometry":
					
					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TET ${object.geometry.parameters.anchor[0].toFixed(7)}*cm ${object.geometry.parameters.anchor[1].toFixed(7)}*cm ${object.geometry.parameters.anchor[2].toFixed(7)}*cm ${object.geometry.parameters.p2[0].toFixed(7)}*cm ${object.geometry.parameters.p2[1].toFixed(7)}*cm ${object.geometry.parameters.p2[2].toFixed(7)}*cm ${object.geometry.parameters.p3[0].toFixed(7)}*cm ${object.geometry.parameters.p3[1].toFixed(7)}*cm ${object.geometry.parameters.p3[2].toFixed(7)}*cm ${object.geometry.parameters.p4[0].toFixed(7)}*cm ${object.geometry.parameters.p4[1].toFixed(7)}*cm ${object.geometry.parameters.p4[2].toFixed(7)}*cm\n`
					
					break;

				case "aHyperboloidGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} HYPE ${object.geometry.parameters.radiusIn}*cm ${object.geometry.parameters.radiusOut}*cm ${object.geometry.parameters.stereo1} ${object.geometry.parameters.stereo2} ${object.geometry.parameters.pDz}*cm\n`
					
					break;

				case "aPolyconeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} POLYCONE ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z}*cm ${object.geometry.parameters.rOuter}\n`
					
					break;

				case "aPolyhedraGeometry":
					
					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} POLYHEDRA ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numSide} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z}*cm ${object.geometry.parameters.rOuter}\n`
					
					break;
				
				case "unitedGeometry":

					{
						
						const positionX1 = object.childrenObject[0].position.x;
						const positionY1 = object.childrenObject[0].position.y;
						const positionZ1 = object.childrenObject[0].position.z;
						
						const positionX2 = object.childrenObject[1].position.x;
						const positionY2 = object.childrenObject[1].position.y;
						const positionZ2 = object.childrenObject[1].position.z;
	
						const positionX = positionX2 - positionX1;
						const positionY = positionY2 - positionY1;
						const positionZ = positionZ2 - positionZ1;

						solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} UNION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name: object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`
					}
					
					break;

				case "subtractedGeometry":

					{
						
						const positionX1 = object.childrenObject[0].position.x;
						const positionY1 = object.childrenObject[0].position.y;
						const positionZ1 = object.childrenObject[0].position.z;
						
						const positionX2 = object.childrenObject[1].position.x;
						const positionY2 = object.childrenObject[1].position.y;
						const positionZ2 = object.childrenObject[1].position.z;
	
						const positionX = positionX2 - positionX1;
						const positionY = positionY2 - positionY1;
						const positionZ = positionZ2 - positionZ1;
						
						solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} SUBTRACTION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name : object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`	
					}
					
					break;
					
				case "intersectedGeometry":

					{
						
						const positionX1 = object.childrenObject[0].position.x;
						const positionY1 = object.childrenObject[0].position.y;
						const positionZ1 = object.childrenObject[0].position.z;
						
						const positionX2 = object.childrenObject[1].position.x;
						const positionY2 = object.childrenObject[1].position.y;
						const positionZ2 = object.childrenObject[1].position.z;
	
						const positionX = positionX2 - positionX1;
						const positionY = positionY2 - positionY1;
						const positionZ = positionZ2 - positionZ1;

						solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} INTERSECTION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name : object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`

					}
					
					break;
					
				default:

					break;
			}

			return solidText1;
		}

		const modelCount = editor.scene.children.length;
		
		var solidText = ''
		var voluText ='';
		var colorText = '';
		var placeText = '';
		var rotationText = '';

		if(modelCount > 0) {
			let i = 0;
			editor.scene.traverse(function (children) {

				if (children.isMesh) {
	
					// for (let i=0; i<modelCount; i++) {
						//:solid base TUBS 5*cm 14*cm 5*cm 0 360
						// const children = editor.scene.children[i];
		
						switch (children.geometry.type) {
							case "BoxGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`											
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} BOX ${children.geometry.parameters.width}*cm ${children.geometry.parameters.depth}*cm ${children.geometry.parameters.height}*cm\n`
								break;
			
							case "SphereGeometry2":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} SPHERE ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi} ${children.geometry.parameters.pSTheta} ${children.geometry.parameters.pDTheta}\n`
								break;
			
							case "aTubeGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`											
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TUBS ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
								break;
			
							case "aCutTubeGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} CUTTUB ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
								break;
			
							case "aConeGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} CONS ${children.geometry.parameters.pRMin2}*cm ${children.geometry.parameters.pRMax2}*cm ${children.geometry.parameters.pRMin1}*cm ${children.geometry.parameters.pRMax1}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
								break;
			
							case "aParallGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} PARA ${children.geometry.parameters.dx}*cm ${children.geometry.parameters.dy}*cm ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.alpha} ${children.geometry.parameters.theta} ${children.geometry.parameters.phi}\n`
								break;
			
							case "aTrapeZoidGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`											
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TRD ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dz}*cm\n`
								break;
			
							case "aTrapeZoidPGeometry": 
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TRAP ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.theta} ${children.geometry.parameters.phi} ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.alpha} ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dx3}*cm ${children.geometry.parameters.dx4}*cm ${children.geometry.parameters.phi}\n`
								break;
			
							case "aTorusGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TORUS ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pRTor}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
								break;
							
							case "aEllipticalCylinderGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} ELLIPTICAL_TUBE ${children.geometry.parameters.xSemiAxis}*cm ${children.geometry.parameters.semiAxisY}*cm ${children.geometry.parameters.Dz}*cm\n`
								break;
							
							case "aEllipsoidGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} ELLIPSOID ${children.geometry.parameters.xSemiAxis}*cm ${children.geometry.parameters.ySemiAxis}*cm ${children.geometry.parameters.zSemiAxis}*cm ${children.geometry.parameters.zBottomCut}*cm ${children.geometry.parameters.zTopCut}*cm\n`
								break;
			
							case "aEllipticalConeGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} ELLIPTICAL_CONE ${children.geometry.parameters.xSemiAxis}*cm ${children.geometry.parameters.ySemiAxis}*cm ${children.geometry.parameters.height}*cm ${children.geometry.parameters.zTopCut}*cm\n`
								break;
			
							case "aTwistedBoxGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTED_BOX ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.width}*cm ${children.geometry.parameters.height}*cm ${children.geometry.parameters.depth}*cm\n`
								break;
			
							case "aTwistedTrdGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTED_TRD ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.twistedangle}\n`
								break;
			
							case "aTwistedTrapGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTED_TRAP ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.theta} ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dx3}*cm ${children.geometry.parameters.dx4}*cm\n`
								break;
			
							case "aTwistedTubeGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTED_TUBS ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pDPhi}\n`
								break;
			
							case "aTetrahedraGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TET ${children.geometry.parameters.anchor[0].toFixed(7)}*cm ${children.geometry.parameters.anchor[1].toFixed(7)}*cm ${children.geometry.parameters.anchor[2].toFixed(7)}*cm ${children.geometry.parameters.p2[0].toFixed(7)}*cm ${children.geometry.parameters.p2[1].toFixed(7)}*cm ${children.geometry.parameters.p2[2].toFixed(7)}*cm ${children.geometry.parameters.p3[0].toFixed(7)}*cm ${children.geometry.parameters.p3[1].toFixed(7)}*cm ${children.geometry.parameters.p3[2].toFixed(7)}*cm ${children.geometry.parameters.p4[0].toFixed(7)}*cm ${children.geometry.parameters.p4[1].toFixed(7)}*cm ${children.geometry.parameters.p4[2].toFixed(7)}*cm\n`
								break;
			
							case "aHyperboloidGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} HYPE ${children.geometry.parameters.radiusIn}*cm ${children.geometry.parameters.radiusOut}*cm ${children.geometry.parameters.stereo1} ${children.geometry.parameters.stereo2} ${children.geometry.parameters.pDz}*cm\n`
								break;
			
							case "aPolyconeGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`									
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} POLYCONE ${children.geometry.parameters.SPhi} ${children.geometry.parameters.DPhi} ${children.geometry.parameters.numZPlanes} ${children.geometry.parameters.z} ${children.geometry.parameters.rOuter}\n`
								break;
			
							case "aPolyhedraGeometry":
								rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`											
								solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} POLYHEDRA ${children.geometry.parameters.SPhi} ${children.geometry.parameters.DPhi} ${children.geometry.parameters.numSide} ${children.geometry.parameters.numZPlanes} ${children.geometry.parameters.z} ${children.geometry.parameters.rOuter}\n`
								break;
			
							case "unitedGeometry": 
								{
									let tempSolidText = [];
									traversebooleanObjects(children, function (child) {
										if( child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry"){
											rotationText += getRotationText(child, true);
										}
										tempSolidText.push(getSolidText(child));
									});	
									
									for(let i = tempSolidText.length - 1; i >= 0; i--){
										solidText += tempSolidText[i];
									}
									
								}
								
								break;
				
							case "subtractedGeometry":
								{
									let tempSolidText = [];
									traversebooleanObjects(children, function (child) {
										if( child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry"){
											rotationText += getRotationText(child, true);
										}
										tempSolidText.push(getSolidText(child));
									});

									for(let i = tempSolidText.length - 1; i >= 0; i--){
										solidText += tempSolidText[i];
									}
								}
								
								break;
									
							case "intersectedGeometry":
								{
									let tempSolidText = [];
									traversebooleanObjects(children, function (child) {
										if( child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry"){
											rotationText += getRotationText(child, true);
										}
										tempSolidText.push(getSolidText(child));
									});

									for(let i = tempSolidText.length - 1; i >= 0; i--){
										solidText += tempSolidText[i];
									}
									
								}
								
								break;
		
							default:
			
								break;
						}
						//:volu gear1 bas5 G4_STAINLESS-STEEL
						if(children.geometry.type !== "aGenericTrapGeometry" && children.geometry.type !== "aParaboloidGeometry" && children.name !== "RadiationSource"){
							voluText += `:volu ${children.name} ${children.geometry.name ? children.geometry.name : children.name} ${children.material.newmaterial?.elementType}\n`
						}
						
						colorText += `:color ${children.name} ${children.material.color.r.toFixed(2)} ${children.material.color.g.toFixed(2)} ${children.material.color.b.toFixed(2)}\n`
						console.log(children.material.color.r)

		
						//:place gear1 1 world r000 -2*cm -8*cm 0
						if(children.geometry.type === "unitedGeometry" || children.geometry.type === "subtractedGeometry" || children.geometry.type === "intersectedGeometry") {
							if (children.parent.isMesh) {
								placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} ${children.parent.name} ${children.name}_rot ${children.childrenObject[0].position.x === 0 ? 0 : children.childrenObject[0].position.x.toFixed(6)/10 + "*cm"} ${children.childrenObject[0].position.y === 0 ? 0 : children.childrenObject[0].position.y.toFixed(6)/10 + "*cm"} ${children.childrenObject[0].position.z === 0 ? 0 : children.childrenObject[0].position.z.toFixed(6)/10 + "*cm"}\n`
							} else {
								placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} world ${children.name}_rot ${children.childrenObject[0].position.x === 0 ? 0 : children.childrenObject[0].position.x.toFixed(6)/10 + "*cm"} ${children.childrenObject[0].position.y === 0 ? 0 : children.childrenObject[0].position.y.toFixed(6)/10 + "*cm"} ${children.childrenObject[0].position.z === 0 ? 0 : children.childrenObject[0].position.z.toFixed(6)/10 + "*cm"}\n`
							}
							
						}
						else {
							if (children.parent.isMesh) {
								placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} ${children.parent.name} ${children.name}_rot ${children.position.x === 0 ? 0 : children.position.x.toFixed(6)/10 + "*cm"} ${children.position.y === 0 ? 0 : children.position.y.toFixed(6)/10 + "*cm"} ${children.position.z === 0 ? 0 : children.position.z.toFixed(6)/10 + "*cm"}\n`
							} else {
								placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} world ${children.name}_rot ${children.position.x === 0 ? 0 : children.position.x.toFixed(6)/10 + "*cm"} ${children.position.y === 0 ? 0 : children.position.y.toFixed(6)/10 + "*cm"} ${children.position.z === 0 ? 0 : children.position.z.toFixed(6)/10 + "*cm"}\n`
							}
							
						}
		
					
						//:vis world OFF
					// }	

					i++;
	
				}
	
			});


			var sceneText = `:volu world BOX 5*m 5*m 5*m G4_AIR\n`;
			sceneText += `:vis world OFF\n\n`;

			// sceneText += `:rotm r000 0 0 0\n`;
			sceneText += `${rotationText}\n`;

			sceneText += `${solidText}\n`;

			sceneText += `${voluText}\n`;

			sceneText += `${colorText}\n`;

			sceneText += `${placeText}\n`;

			downloadGeant4File(sceneText, 'detector.tg')
		} else {
			alert( 'The added model could not be found.');
		}

	} );
	options.add( option );

	// Export GDML
	
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/gdml' ) );

	option.onClick( async function () {

		const object = editor.selected;

		function traversebooleanObjects(object, callback ) {

			callback( object );
			const children = object.childrenObject;
			if(!children) return

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				traversebooleanObjects(children[ i ], callback );

			}

		}

		function getPositionText( children ) {
			return `    <position name="${children.name}_${children.uuid}_pos" unit="m" x="${children.position.x.toFixed(4)}" y="${children.position.y.toFixed(4)}" z="${children.position.z.toFixed(4)}"/>\n`;
		}

		function getRotationText( children ) {
			const rotated = children.rotation;
			const rotateX = rotated.x * 180 / Math.PI;
			const rotateY = rotated.y * 180 / Math.PI;
			const rotateZ = rotated.z * 180 / Math.PI;
			return `    <rotation name="${children.name}_${children.uuid}_rot" unit="m" x="${rotateX.toFixed(4)}" y="${rotateY.toFixed(4)}" z="${rotateZ.toFixed(4)}"/>\n`;
		}

		function getSolidText( children ) {
			let solidsText = '';
			switch (children.geometry.type) {
				case "BoxGeometry":
					
					solidsText += `      <box name="${children.name}_${children.uuid}" x="${children.geometry.parameters.width}" y="${children.geometry.parameters.height}" z="${children.geometry.parameters.depth}" lunit="m"/>\n`;
					break;

				case "SphereGeometry2":
					
					solidsText += `      <sphere name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" startphi="${children.geometry.parameters.pSPhi}"  deltaphi="${children.geometry.parameters.pDPhi}" starttheta="${children.geometry.parameters.pSTheta}" deltatheta="${children.geometry.parameters.pDTheta}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTubeGeometry":
					
					solidsText += `      <tube name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aCutTubeGeometry":
					
					solidsText += `      <cutTube name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" lowX="${children.geometry.parameters.pLowNorm.x}" lowY="${children.geometry.parameters.pLowNorm.y}" lowZ="${children.geometry.parameters.pLowNorm.z}" highX="${children.geometry.parameters.pHighNorm.x}" highY="${children.geometry.parameters.pHighNorm.y}" highZ="${children.geometry.parameters.pHighNorm.z}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aConeGeometry":
					
					solidsText += `      <cone name="${children.name}_${children.uuid}" rmin1="${children.geometry.parameters.pRMin1}" rmin2="${children.geometry.parameters.pRMin2}" rmax1="${children.geometry.parameters.pRMax1}" rmax2="${children.geometry.parameters.pRMax2}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aParallGeometry":
					
					solidsText += `      <para name="${children.name}_${children.uuid}" x="${children.geometry.parameters.dx}" y="${children.geometry.parameters.dy}" z="${children.geometry.parameters.dz}" alpha="${children.geometry.parameters.alpha}" theta="${children.geometry.parameters.theta}" phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTrapeZoidGeometry":
					
					solidsText += `      <trd name="${children.name}_${children.uuid}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTrapeZoidPGeometry": 
					
					solidsText += `      <trap name="${children.name}_${children.uuid}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" x3="${children.geometry.parameters.dx3}" x4="${children.geometry.parameters.dx4}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" alpha1="${children.geometry.parameters.alpha}" alpha2="${children.geometry.parameters.alpha}" theta="${children.geometry.parameters.theta}" phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTorusGeometry":
					
					solidsText += `      <torus name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" rtor="${children.geometry.parameters.pRTor}" starttheta="${children.geometry.parameters.pSPhi}" deltatheta="${children.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;
				
				case "aEllipticalCylinderGeometry":
					
					solidsText += `      <eltube name="${children.name}_${children.uuid}" dx="${children.geometry.parameters.xSemiAxis}" dy="${children.geometry.parameters.semiAxisY}" dz="${children.geometry.parameters.Dz}" lunit="m"/>\n`; // Adjust size as needed
					break;
				
				case "aEllipsoidGeometry":
					
					solidsText += `      <ellipsoid name="${children.name}_${children.uuid}" ax="${children.geometry.parameters.xSemiAxis}" by="${children.geometry.parameters.ySemiAxis}" cz="${children.geometry.parameters.zSemiAxis}" zcut2="${children.geometry.parameters.zBottomCut}" zcut1="${children.geometry.parameters.zTopCut}" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aEllipticalConeGeometry":
					
					solidsText += `      <elcone name="${children.name}_${children.uuid}" dx="${children.geometry.parameters.xSemiAxis}" dy="${children.geometry.parameters.ySemiAxis}" zmax="${children.geometry.parameters.height}" zcut="${children.geometry.parameters.zTopCut}" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedBoxGeometry":
					
					solidsText += `      <twistedbox name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.angle}" x="${children.geometry.parameters.width}" y="${children.geometry.parameters.height}" z="${children.geometry.parameters.depth}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedTrdGeometry":
					
					solidsText += `      <twistedtrd name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.twistedangle}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedTrapGeometry":
					
					solidsText += `      <twistedtrap name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.twistedangle}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" x3="${children.geometry.parameters.dx3}" x4="${children.geometry.parameters.dx4}" Alph="${children.geometry.parameters.alpha}" Theta="${children.geometry.parameters.theta}" Phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedTubeGeometry":
					
					solidsText += `      <twistedtubs name="${children.name}_${children.uuid}" twistedangle="${children.geometry.parameters.twistedangle}" endinnerrad="${children.geometry.parameters.pRMin}" endouterrad="${children.geometry.parameters.pRMax}" zlen="${children.geometry.parameters.pDz}" phi="${children.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTetrahedraGeometry":
					
					solidsText += `      <tet name="${children.name}_${children.uuid}" vertex1="${children.geometry.parameters.anchor}" vertex2="${children.geometry.parameters.p2}" vertex3="${children.geometry.parameters.p3}" vertex4="${children.geometry.parameters.p4}"/>\n`; // Adjust size as needed
					break;

				case "Paraboloid":
			
					solidsText += `      <paraboloid name="${children.name}_${children.uuid}" rhi="${children.geometry.parameters.R2}" rlo="${children.geometry.parameters.R1}" dz="${children.geometry.parameters.pDz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aHyperboloidGeometry":
					
					solidsText += `      <hype name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.radiusIn}" rmax="${children.geometry.parameters.radiusOut}" z="${children.geometry.parameters.pDz}" inst="${children.geometry.parameters.stereo1}" outst="${children.geometry.parameters.stereo2}" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aPolyconeGeometry":
					
					solidsText += `      <polycone name="${children.name}_${children.uuid}" startphi="${children.geometry.parameters.SPhi}" deltaphi="${children.geometry.parameters.DPhi}" aunit="deg" lunit="m">\n`; // Adjust size as needed

					for(var j = 0; j < children.geometry.parameters.numZPlanes; j++){
						solidsText += `        <zplane rmin="${children.geometry.parameters.rInner[j]}" rmax="${children.geometry.parameters.rOuter[j]}" z="${children.geometry.parameters.z[j]}"/>\n`
					}

					solidsText += `      </polycone>\n`;
					break;

				case "aPolyhedraGeometry":
					
					solidsText += `      <polyhedra name="${children.name}_${children.uuid}" startphi="${children.geometry.parameters.SPhi}" deltaphi="${children.geometry.parameters.DPhi}" numsides="${children.geometry.parameters.numSide}" aunit="deg" lunit="m">\n`; // Adjust size as needed

					for(var k = 0; k < children.geometry.parameters.numZPlanes; k++){
						solidsText += `        <zplane rmin="${children.geometry.parameters.rInner[k]}" rmax="${children.geometry.parameters.rOuter[k]}" z="${children.geometry.parameters.z[k]}"/>\n`
					}

					solidsText += `      </polyhedra>\n`;
					break;
				
				case "unitedGeometry":

					solidsText += `      <union name="${children.name}_${children.uuid}">\n`;
					solidsText += `        <first ref="${children.childrenObject[0].name}_${children.childrenObject[0].uuid}">\n`;
					solidsText += `        <second ref="${children.childrenObject[1].name}_${children.childrenObject[1].uuid}">\n`;
					solidsText += `        <positionref ref="${children.name}_${children.uuid}_pos">\n`;
					solidsText += `        <rotationref ref="${children.name}_${children.uuid}_rot">\n`;
					solidsText += `      </union>\n`;
					break;

				case "subtractedGeometry":

					solidsText += `      <subtraction name="${children.name}_${children.uuid}">\n`;
					solidsText += `        <first ref="${children.childrenObject[0].name}_${children.childrenObject[0].uuid}">\n`;
					solidsText += `        <second ref="${children.childrenObject[1].name}_${children.childrenObject[1].uuid}">\n`;
					solidsText += `        <positionref ref="${children.name}_${children.uuid}_pos">\n`;
					solidsText += `        <rotationref ref="${children.name}_${children.uuid}_rot">\n`;
					solidsText += `      </union>\n`;
					break;
					
				case "intersectedGeometry":

					solidsText += `      <intersection name="${children.name}_${children.uuid}">\n`;
					solidsText += `        <first ref="${children.childrenObject[0].name}_${children.childrenObject[0].uuid}">\n`;
					solidsText += `        <second ref="${children.childrenObject[1].name}_${children.childrenObject[1].uuid}">\n`;
					solidsText += `        <positionref ref="${children.name}_${children.uuid}_pos">\n`;
					solidsText += `        <rotationref ref="${children.name}_${children.uuid}_rot">\n`;
					solidsText += `      </union>\n`;
					break;
					
				default:

					break;
			}

			return solidsText;
		}

		if ( object !== null && object.isMesh != undefined ) {
			const rotated = object.rotation;
			const rotateX = rotated.x * 180 / Math.PI;
			const rotateY = rotated.y * 180 / Math.PI;
			const rotateZ = rotated.z * 180 / Math.PI;
	
			const roomSize = 10;
	
			let solidText = '';
			let rotationText = '';
			let positionText = '';
	
			traversebooleanObjects(object, function ( child ) {
	
				if( child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry"){
					rotationText += getRotationText(child);
					positionText += getPositionText(child)
				}
				solidText += getSolidText(child);
	
			} );
			switch (object.geometry.type) {
				case "BoxGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <box name="boxSolid" x="${object.geometry.parameters.width}" y="${object.geometry.parameters.depth}" z="${object.geometry.parameters.height}" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="boxVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="boxVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="boxSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'box.gdml')
	
					break;
			
				case "SphereGeometry2":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <sphere name="sphereSolid" rmin="${0}" rmax="${object.geometry.parameters.radius}" deltaphi="${object.geometry.parameters.phiLength}" deltatheta="${object.geometry.parameters.thetaLength}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="sphereVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="sphereVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="sphereSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'spehre.gdml')
					break;
		
				case "aTubeGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <tube name="tubeSolid" rmin="${object.geometry.parameters.pRMin}" rmax="${object.geometry.parameters.pRMax}" z="${object.geometry.parameters.pDz}" deltaphi="${object.geometry.parameters.pDPhi}" startphi="${object.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="sphereVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="sphereVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="tubeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Tube.gdml')
					break;
							
				case "aCutTubeGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <cutTube name="CtubeSolid" rmin="${object.geometry.parameters.pRMin}" rmax="${object.geometry.parameters.pRMax}" z="${object.geometry.parameters.pDz}" deltaphi="${object.geometry.parameters.pDPhi}" startphi="${object.geometry.parameters.pSPhi}" lowX="${object.geometry.parameters.pLowNorm.x}" lowY="${object.geometry.parameters.pLowNorm.y}" lowZ="${object.geometry.parameters.pLowNorm.z}" highX="${object.geometry.parameters.pHighNorm.x}" highY="${object.geometry.parameters.pHighNorm.y}" highZ="${object.geometry.parameters.pHighNorm.z}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="CtubVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="CtubVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="CtubeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Ctube.gdml')
					break;
												
				case "aConeGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <cone name="coneSolid" rmin1="${object.geometry.parameters.pRMin1}" rmin2="${object.geometry.parameters.pRMin2}" rmax1="${object.geometry.parameters.pRMax1}" rmax2="${object.geometry.parameters.pRMax2}" z="${object.geometry.parameters.pDz}" deltaphi="${object.geometry.parameters.pDPhi}" startphi="${object.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="coneVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="coneVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="coneSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Cone.gdml')
					break;
																	
				case "aParallGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <para name="paraSolid" x="${object.geometry.parameters.dx}" y="${object.geometry.parameters.dy}" z="${object.geometry.parameters.dz}" alpha="${object.geometry.parameters.alpha}" theta="${object.geometry.parameters.theta}" phi="${object.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="paraVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="paraVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="paraSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Parallelepiped.gdml')
					break;
																						
				case "aTrapeZoidGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <trd name="trdSolid" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="trdVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="trdVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="trdSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Trapezoid.gdml')
					break;
																											
				case "aTrapeZoidPGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <trap name="trapSolid" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" x3="${object.geometry.parameters.dx3}" x4="${object.geometry.parameters.dx4}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" alpha1="${object.geometry.parameters.alpha}" alpha2="${object.geometry.parameters.alpha}" theta="${object.geometry.parameters.theta}" phi="${object.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="trapVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="trapVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="trapSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Trapezoid.gdml')
					break;
																										
				case "aTorusGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <torus name="torusSolid" rmin="${object.geometry.parameters.pRMin}" rmax="${object.geometry.parameters.pRMax}" rtor="${object.geometry.parameters.pRTor}" startphi="${object.geometry.parameters.pSPhi}" deltaphi="${object.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="torusVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="torusVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="torusSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Torus.gdml')
					break;
																																
				case "aEllipticalCylinderGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <eltube name="ellipetubeSolid" dx="${object.geometry.parameters.xSemiAxis}" dy="${object.geometry.parameters.semiAxisY}" dz="${object.geometry.parameters.Dz}" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="elliptubeVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="elliptubeVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="ellipetubeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'EllipeTube.gdml')
					break;
																																						
				case "aEllipsoidGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <ellipsoid name="ellipsoidSolid" ax="${object.geometry.parameters.xSemiAxis}" by="${object.geometry.parameters.ySemiAxis}" cz="${object.geometry.parameters.zSemiAxis}" zcut2="${object.geometry.parameters.zBottomCut}" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="ellipsoidVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="ellipsoidVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="ellipsoidSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Ellipsoid.gdml')
					break;
																																												
				case "aEllipticalConeGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <elcone name="elconeSolid" dx="${object.geometry.parameters.xSemiAxis}" dy="${object.geometry.parameters.ySemiAxis}" zmax="${object.geometry.parameters.height}" zcut="${object.geometry.parameters.zTopCut}" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="elconeVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="elconeVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="elconeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'EllipticalCone.gdml')
					break;
																																																
				case "aTwistedBoxGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <twistedbox name="tboxSolid" PhiTwist="${object.geometry.parameters.angle}" x="${object.geometry.parameters.width}" y="${object.geometry.parameters.height}" z="${object.geometry.parameters.depth}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="tboxVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="tboxVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="tboxSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'TwistedBox.gdml')
					break;
																																																				
				case "aTwistedTrdGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <twistedtrd name="ttradSolid" PhiTwist="${object.geometry.parameters.twistedangle}" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="ttradVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="ttradVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="ttradSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'TwistedTrapeZoid.gdml')
					break;
																																																								
				case "aTwistedTrapGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <twistedtrap name="ttrapSolid" PhiTwist="${object.geometry.parameters.twistedangle}" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" x3="${object.geometry.parameters.dx3}" x4="${object.geometry.parameters.dx4}" Alph="${object.geometry.parameters.alpha}" Theta="${object.geometry.parameters.theta}" Phi="${object.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="ttrapVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="ttrapVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="ttrapSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'TwistedTrapeZoidP.gdml')
					break;
																																																												
				case "aTwistedTubeGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <twistedtubs name="ttubeSolid" twistedangle="${object.geometry.parameters.twistedangle}" endinnerrad="${object.geometry.parameters.pRMin}" endouterrad="${object.geometry.parameters.pRMax}" zlen="${object.geometry.parameters.pDz}" phi="${object.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="ttubeVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="ttubeVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="ttubeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'TwistedTubs.gdml')
					break;
																																																																
				case "aTetrahedraGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <tet name="tetraSolid" vertex1="${object.geometry.parameters.anchor}" vertex2="${object.geometry.parameters.p2}" vertex3="${object.geometry.parameters.p3}" vertex4="${object.geometry.parameters.p4}"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="tetraVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="tetraVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="tetraSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Tetrahedra.gdml')
					break;
						
				case "Paraboloid":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <paraboloid name="hypeSolid" rhi="${object.geometry.parameters.R2}" rlo="${object.geometry.parameters.R1}" dz="${object.geometry.parameters.pDz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="paraboloidVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="paraboloidVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="hypeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Paraboloid.gdml')
					break;

				case "aHyperboloidGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <hype name="hypeSolid" rmin="${object.geometry.parameters.radiusIn}" rmax="${object.geometry.parameters.radiusOut}" z="${object.geometry.parameters.pDz}" inst="${object.geometry.parameters.stereo1}" outst="${object.geometry.parameters.stereo2}" lunit="m"/>\n`; // Adjust size as needed
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="hypeVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="hypeVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="hypeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Hyperboloid.gdml')
					break;
																																																														
				case "aPolyconeGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <polycone name="polyconeSolid" startphi="${object.geometry.parameters.SPhi}" deltaphi="${object.geometry.parameters.DPhi}" aunit="deg" lunit="m">\n`; // Adjust size as needed
	
					for(var i = 0; i < object.geometry.parameters.numZPlanes; i++){
						gdml += `        <zplane rmin="${object.geometry.parameters.rInner[i]}" rmax="${object.geometry.parameters.rOuter[i]}" z="${object.geometry.parameters.z[i]}"/>\n`
					}
	
					gdml += `      </polycone>\n`;
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="polyconeVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="polyconeVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="polyconeSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Polycone.gdml')
					break;
																																																																			
				case "aPolyhedraGeometry":
					var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
					gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
					gdml += `  <define>\n`;
					gdml += `    <materials>\n`;
					gdml += `      <material name="Air" state="gas">\n`;
					gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
					gdml += `          <fraction ref="N" n="0.7"/>\n`;
					gdml += `          <fraction ref="O" n="0.3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `      <material name="${object.material?.name?.elementType}">\n`;
					gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
					gdml += `      </material>\n`;
					gdml += `    </materials>\n`;
					gdml += `    <solids>\n`;
					gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
					gdml += `      <polyhedra name="polyhedraSolid" startphi="${object.geometry.parameters.SPhi}" deltaphi="${object.geometry.parameters.DPhi}" numsides="${object.geometry.parameters.numSide}" aunit="deg" lunit="m">\n`; // Adjust size as needed
	
					for(var i = 0; i < object.geometry.parameters.numZPlanes; i++){
						gdml += `        <zplane rmin="${object.geometry.parameters.rInner[i]}" rmax="${object.geometry.parameters.rOuter[i]}" z="${object.geometry.parameters.z[i]}"/>\n`
					}
	
					gdml += `      </polyhedra>\n`;
					gdml += `    </solids>\n`;
					gdml += `  </define>\n`;
					gdml += `  <structure>\n`;
					gdml += `    <volume name="world">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `      <physvol>\n`;
					gdml += `        <volumeref ref="polyhedraVolume"/>\n`;
					gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
					gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
					gdml += `      </physvol>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="roomVolume">\n`;
					gdml += `      <materialref ref="Air"/>\n`;
					gdml += `      <solidref ref="roomSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `    <volume name="polyhedraVolume">\n`;
					gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
					gdml += `      <solidref ref="polyhedraSolid"/>\n`;
					gdml += `    </volume>\n`;
					gdml += `  </structure>\n`;
					gdml += `  <setup name="default" version="1.0">\n`;
					gdml += `    <world ref="world"/>\n`;
					gdml += `  </setup>\n`;
					gdml += `</gdml>\n`;
					
					downloadGeant4File( gdml, 'Polyhedra.gdml')
					break;
					
					case "unitedGeometry":
						var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
						gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
						gdml += `  <define>\n`;
						gdml += rotationText;
						gdml += positionText;
						gdml += `  </define>\n`;
						gdml += `    <materials>\n`;
						gdml += `      <material name="Air" state="gas">\n`;
						gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
							gdml += `          <fraction ref="N" n="0.7"/>\n`;
						gdml += `          <fraction ref="O" n="0.3"/>\n`;
						gdml += `      </material>\n`;
						gdml += `      <material name="${object.material?.name?.elementType}">\n`;
						gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
						gdml += `      </material>\n`;
						gdml += `    </materials>\n`;
						gdml += `    <solids>\n`;
						gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
						gdml += solidText;
						gdml += `    </solids>\n`;
						gdml += `  </define>\n`;
						gdml += `  <structure>\n`;
						gdml += `    <volume name="world">\n`;
						gdml += `      <materialref ref="Air"/>\n`;
						gdml += `      <solidref ref="roomSolid"/>\n`;
						gdml += `      <physvol>\n`;
						gdml += `        <volumeref ref="unitedVolume"/>\n`;
						gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
						gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
						gdml += `      </physvol>\n`;
						gdml += `    </volume>\n`;
						gdml += `    <volume name="roomVolume">\n`;
						gdml += `      <materialref ref="Air"/>\n`;
						gdml += `      <solidref ref="roomSolid"/>\n`;
						gdml += `    </volume>\n`;
						gdml += `    <volume name="unitedVolume">\n`;
						gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
						gdml += `      <solidref ref="${object.name}_${object.uuid}"/>\n`;
						gdml += `    </volume>\n`;
						gdml += `  </structure>\n`;
						gdml += `  <setup name="default" version="1.0">\n`;
						gdml += `    <world ref="world"/>\n`;
						gdml += `  </setup>\n`;
						gdml += `</gdml>\n`;
						
						downloadGeant4File( gdml, 'unitedGeometry.gdml')
						break;
					
						case "subtractedGeometry":
							var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
							gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
							gdml += `  <define>\n`;
							gdml += rotationText;
							gdml += positionText;
							gdml += `  </define>\n`;
							gdml += `    <materials>\n`;
							gdml += `      <material name="Air" state="gas">\n`;
							gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
									gdml += `          <fraction ref="N" n="0.7"/>\n`;
							gdml += `          <fraction ref="O" n="0.3"/>\n`;
							gdml += `      </material>\n`;
							gdml += `      <material name="${object.material?.name?.elementType}">\n`;
							gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
							gdml += `      </material>\n`;
							gdml += `    </materials>\n`;
							gdml += `    <solids>\n`;
							gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
							gdml += solidText;
							gdml += `    </solids>\n`;
							gdml += `  </define>\n`;
							gdml += `  <structure>\n`;
							gdml += `    <volume name="world">\n`;
							gdml += `      <materialref ref="Air"/>\n`;
							gdml += `      <solidref ref="roomSolid"/>\n`;
							gdml += `      <physvol>\n`;
							gdml += `        <volumeref ref="subtractedVolume"/>\n`;
							gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
							gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
							gdml += `      </physvol>\n`;
							gdml += `    </volume>\n`;
							gdml += `    <volume name="roomVolume">\n`;
							gdml += `      <materialref ref="Air"/>\n`;
							gdml += `      <solidref ref="roomSolid"/>\n`;
							gdml += `    </volume>\n`;
							gdml += `    <volume name="subtractedVolume">\n`;
							gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
							gdml += `      <solidref ref="${object.name}_${object.uuid}"/>\n`;
							gdml += `    </volume>\n`;
							gdml += `  </structure>\n`;
							gdml += `  <setup name="default" version="1.0">\n`;
							gdml += `    <world ref="world"/>\n`;
							gdml += `  </setup>\n`;
							gdml += `</gdml>\n`;
							
							downloadGeant4File( gdml, 'subtractedGeometry.gdml')
							break;
											
					case "intersectedGeometry":
						var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
						gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
						gdml += `  <define>\n`;
						gdml += rotationText;
						gdml += positionText;
						gdml += `  </define>\n`;
						gdml += `    <materials>\n`;
						gdml += `      <material name="Air" state="gas">\n`;
						gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
							gdml += `          <fraction ref="N" n="0.7"/>\n`;
						gdml += `          <fraction ref="O" n="0.3"/>\n`;
						gdml += `      </material>\n`;
						gdml += `      <material name="${object.material?.name?.elementType}">\n`;
						gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
						gdml += `      </material>\n`;
						gdml += `    </materials>\n`;
						gdml += `    <solids>\n`;
						gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
						gdml += solidText;
						gdml += `    </solids>\n`;
						gdml += `  </define>\n`;
						gdml += `  <structure>\n`;
						gdml += `    <volume name="world">\n`;
						gdml += `      <materialref ref="Air"/>\n`;
						gdml += `      <solidref ref="roomSolid"/>\n`;
						gdml += `      <physvol>\n`;
						gdml += `        <volumeref ref="intersectedVolume"/>\n`;
						gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
						gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(5)}" y="${rotateY.toFixed(5)}" z="${rotateZ.toFixed(5)}"/>\n`; // Adjust rotation as needed
						gdml += `      </physvol>\n`;
						gdml += `    </volume>\n`;
						gdml += `    <volume name="roomVolume">\n`;
						gdml += `      <materialref ref="Air"/>\n`;
						gdml += `      <solidref ref="roomSolid"/>\n`;
						gdml += `    </volume>\n`;
						gdml += `    <volume name="intersectedVolume">\n`;
						gdml += `      <materialref ref="${object.material.newmaterial?.elementType}"/>\n`;
						gdml += `      <solidref ref="${object.name}_${object.uuid}"/>\n`;
						gdml += `    </volume>\n`;
						gdml += `  </structure>\n`;
						gdml += `  <setup name="default" version="1.0">\n`;
						gdml += `    <world ref="world"/>\n`;
						gdml += `  </setup>\n`;
						gdml += `</gdml>\n`;
						
						downloadGeant4File( gdml, 'intersectedGeometry.gdml')
						break;
	
				default:
					break;
			}
		} else {
			alert( 'Please select a model!');
		}


		

	} );
	// options.add( option );

	// Export GDML scene
	
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/gdml_scene' ) );
	option.onClick( async function () {

		const loginStatus = localStorage.getItem('loginStatus');

		if(loginStatus === undefined || loginStatus === 'false') {
			alert( 'You must log in to export files.');
			return;
		}

		function traversebooleanObjects(object, callback ) {

			callback( object );
			const children = object.childrenObject;
			if(!children) return

			for ( let i = 0, l = children.length; i < l; i ++ ) {

				traversebooleanObjects(children[ i ], callback );

			}

		}

		function getPositionText( children ) {
			return `    <position name="${children.name}_${children.uuid}_pos" unit="m" x="${children.position.x.toFixed(4)}" y="${children.position.y.toFixed(4)}" z="${children.position.z.toFixed(4)}"/>\n`;
		}

		function getRotationText( children ) {
			const rotated = children.rotation;
			const rotateX = rotated.x * 180 / Math.PI;
			const rotateY = rotated.y * 180 / Math.PI;
			const rotateZ = rotated.z * 180 / Math.PI;
			return `    <rotation name="${children.name}_${children.uuid}_rot" unit="m" x="${rotateX.toFixed(4)}" y="${rotateY.toFixed(4)}" z="${rotateZ.toFixed(4)}"/>\n`;
		}

		function getSolidText( children ) {
			let solidsText = '';
			switch (children.geometry.type) {
				case "BoxGeometry":
					
					solidsText += `      <box name="${children.name}_${children.uuid}" x="${children.geometry.parameters.width}" y="${children.geometry.parameters.height}" z="${children.geometry.parameters.depth}" lunit="m"/>\n`;
					break;

				case "SphereGeometry2":
					
					solidsText += `      <sphere name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" startphi="${children.geometry.parameters.pSPhi}" deltaphi="${children.geometry.parameters.pDPhi}" starttheta="${children.geometry.parameters.pSTheta}" deltatheta="${children.geometry.parameters.pDTheta}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTubeGeometry":
					
					solidsText += `      <tube name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aCutTubeGeometry":
					
					solidsText += `      <cutTube name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" lowX="${children.geometry.parameters.pLowNorm.x}" lowY="${children.geometry.parameters.pLowNorm.y}" lowZ="${children.geometry.parameters.pLowNorm.z}" highX="${children.geometry.parameters.pHighNorm.x}" highY="${children.geometry.parameters.pHighNorm.y}" highZ="${children.geometry.parameters.pHighNorm.z}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aConeGeometry":
					
					solidsText += `      <cone name="${children.name}_${children.uuid}" rmin1="${children.geometry.parameters.pRMin1}" rmin2="${children.geometry.parameters.pRMin2}" rmax1="${children.geometry.parameters.pRMax1}" rmax2="${children.geometry.parameters.pRMax2}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aParallGeometry":
					
					solidsText += `      <para name="${children.name}_${children.uuid}" x="${children.geometry.parameters.dx}" y="${children.geometry.parameters.dy}" z="${children.geometry.parameters.dz}" alpha="${children.geometry.parameters.alpha}" theta="${children.geometry.parameters.theta}" phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTrapeZoidGeometry":
					
					solidsText += `      <trd name="${children.name}_${children.uuid}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" alpha="${children.geometry.parameters.alpha}" theta="${children.geometry.parameters.theta}" phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTrapeZoidPGeometry": 
					
					solidsText += `      <trap name="${children.name}_${children.uuid}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" x3="${children.geometry.parameters.dx3}" x4="${children.geometry.parameters.dx4}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" alpha1="${children.geometry.parameters.alpha}" alpha2="${children.geometry.parameters.alpha}" theta="${children.geometry.parameters.theta}" phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTorusGeometry":
					
					solidsText += `      <torus name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" rtor="${children.geometry.parameters.pRTor}" starttheta="${children.geometry.parameters.pSPhi}" deltatheta="${children.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;
				
				case "aEllipticalCylinderGeometry":
					
					solidsText += `      <eltube name="${children.name}_${children.uuid}" dx="${children.geometry.parameters.xSemiAxis}" dy="${children.geometry.parameters.semiAxisY}" dz="${children.geometry.parameters.Dz}" lunit="m"/>\n`; // Adjust size as needed
					break;
				
				case "aEllipsoidGeometry":
					
					solidsText += `      <ellipsoid name="${children.name}_${children.uuid}" ax="${children.geometry.parameters.xSemiAxis}" by="${children.geometry.parameters.ySemiAxis}" cz="${children.geometry.parameters.zSemiAxis}" zcut2="${children.geometry.parameters.zBottomCut}" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aEllipticalConeGeometry":
					
					solidsText += `      <elcone name="${children.name}_${children.uuid}" dx="${children.geometry.parameters.xSemiAxis}" dy="${children.geometry.parameters.ySemiAxis}" zmax="${children.geometry.parameters.height}" zcut="${children.geometry.parameters.zTopCut}" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedBoxGeometry":
					
					solidsText += `      <twistedbox name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.angle}" x="${children.geometry.parameters.width}" y="${children.geometry.parameters.height}" z="${children.geometry.parameters.depth}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedTrdGeometry":
					
					solidsText += `      <twistedtrd name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.twistedangle}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedTrapGeometry":
					
					solidsText += `      <twistedtrap name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.twistedangle}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" x3="${children.geometry.parameters.dx3}" x4="${children.geometry.parameters.dx4}" Alph="${children.geometry.parameters.alpha}" Theta="${children.geometry.parameters.theta}" Phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTwistedTubeGeometry":
					
					solidsText += `      <twistedtubs name="${children.name}_${children.uuid}" twistedangle="${children.geometry.parameters.twistedangle}" endinnerrad="${children.geometry.parameters.pRMin}" endouterrad="${children.geometry.parameters.pRMax}" zlen="${children.geometry.parameters.pDz}" phi="${children.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aTetrahedraGeometry":
					
					solidsText += `      <tet name="${children.name}_${children.uuid}" vertex1="${children.geometry.parameters.anchor}" vertex2="${children.geometry.parameters.p2}" vertex3="${children.geometry.parameters.p3}" vertex4="${children.geometry.parameters.p4}"/>\n`; // Adjust size as needed
					break;

				case "Paraboloid":
			
					solidsText += `      <paraboloid name="${children.name}_${children.uuid}" rhi="${children.geometry.parameters.R2}" rlo="${children.geometry.parameters.R1}" dz="${children.geometry.parameters.pDz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aHyperboloidGeometry":
					
					solidsText += `      <hype name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.radiusIn}" rmax="${children.geometry.parameters.radiusOut}" z="${children.geometry.parameters.pDz}" inst="${children.geometry.parameters.stereo1}" outst="${children.geometry.parameters.stereo2}" lunit="m"/>\n`; // Adjust size as needed
					break;

				case "aPolyconeGeometry":
					
					solidsText += `      <polycone name="${children.name}_${children.uuid}" startphi="${children.geometry.parameters.SPhi}" deltaphi="${children.geometry.parameters.DPhi}" aunit="deg" lunit="m">\n`; // Adjust size as needed

					for(var j = 0; j < children.geometry.parameters.numZPlanes; j++){
						solidsText += `        <zplane rmin="${children.geometry.parameters.rInner[j]}" rmax="${children.geometry.parameters.rOuter[j]}" z="${children.geometry.parameters.z[j]}"/>\n`
					}

					solidsText += `      </polycone>\n`;
					break;

				case "aPolyhedraGeometry":
					
					solidsText += `      <polyhedra name="${children.name}_${children.uuid}" startphi="${children.geometry.parameters.SPhi}" deltaphi="${children.geometry.parameters.DPhi}" numsides="${children.geometry.parameters.numSide}" aunit="deg" lunit="m">\n`; // Adjust size as needed

					for(var k = 0; k < children.geometry.parameters.numZPlanes; k++){
						solidsText += `        <zplane rmin="${children.geometry.parameters.rInner[k]}" rmax="${children.geometry.parameters.rOuter[k]}" z="${children.geometry.parameters.z[k]}"/>\n`
					}

					solidsText += `      </polyhedra>\n`;
					break;
				
				case "unitedGeometry":

					solidsText += `      <union name="${children.name}_${children.uuid}">\n`;
					solidsText += `      <first ref="${children.childrenObject[0].name}_${children.childrenObject[0].uuid}">\n`;
					solidsText += `      <second ref="${children.childrenObject[1].name}_${children.childrenObject[1].uuid}">\n`;
					solidsText += `      <positionref ref="${children.name}_${children.uuid}_pos">\n`;
					solidsText += `      <rotationref ref="${children.name}_${children.uuid}_rot">\n`;
					solidsText += `      </union>\n`;
					break;

				case "subtractedGeometry":

					solidsText += `      <subtraction name="${children.name}_${children.uuid}">\n`;
					solidsText += `      <first ref="${children.childrenObject[0].name}_${children.childrenObject[0].uuid}">\n`;
					solidsText += `      <second ref="${children.childrenObject[1].name}_${children.childrenObject[1].uuid}">\n`;
					solidsText += `      <positionref ref="${children.name}_${children.uuid}_pos">\n`;
					solidsText += `      <rotationref ref="${children.name}_${children.uuid}_rot">\n`;
					solidsText += `      </union>\n`;
					break;
					
				case "intersectedGeometry":

					solidsText += `      <intersection name="${children.name}_${children.uuid}">\n`;
					solidsText += `      <first ref="${children.childrenObject[0].name}_${children.childrenObject[0].uuid}">\n`;
					solidsText += `      <second ref="${children.childrenObject[1].name}_${children.childrenObject[1].uuid}">\n`;
					solidsText += `      <positionref ref="${children.name}_${children.uuid}_pos">\n`;
					solidsText += `      <rotationref ref="${children.name}_${children.uuid}_rot">\n`;
					solidsText += `      </union>\n`;
					break;
					
				default:

					break;
			}

			return solidsText;
		}

		const modelCount = editor.scene.children.length;
		const roomSize = 10;
		var sceneText = '';

		var defineTexts = '';

		var positionText = '';

		var rotationText = '';

		var materialsText = `    <materials>\n`;
		materialsText += `      <material name="Air" state="gas">\n`;
		materialsText += `        <D value="0.001205" unit="g/cm3"/>\n`;
		materialsText += `          <fraction ref="N" n="0.7"/>\n`;
		materialsText += `          <fraction ref="O" n="0.3"/>\n`;
		materialsText += `      </material>\n`;

		var solidsText = '';
		solidsText += '    <solids>\n';
		solidsText += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}"/>\n`;

		var structureText = '';

		var volumesText = '';

		var physvolsText = '';
		physvolsText += `    <volume name="world">\n`
		physvolsText += `      <materialref ref="Air"/>\n`;
		physvolsText += `      <solidref ref="roomSolid"/>\n`;

		var materialRefArray = [];
		if(modelCount > 0) {
			for (let i=0; i<modelCount; i++) {
				const children = editor.scene.children[i];
				switch (children.geometry.type) {
					case "BoxGeometry":
						
						solidsText += `      <box name="${children.name}_${children.uuid}" x="${children.geometry.parameters.width}" y="${children.geometry.parameters.height}" z="${children.geometry.parameters.depth}" lunit="m"/>\n`;
						break;
	
					case "SphereGeometry2":
						
						solidsText += `      <sphere name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" startphi="${children.geometry.parameters.pSPhi}" deltaphi="${children.geometry.parameters.pDPhi}" starttheta="${children.geometry.parameters.pSTheta}" deltatheta="${children.geometry.parameters.pDTheta}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTubeGeometry":
						
						solidsText += `      <tube name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aCutTubeGeometry":
						
						solidsText += `      <cutTube name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" lowX="${children.geometry.parameters.pLowNorm.x}" lowY="${children.geometry.parameters.pLowNorm.y}" lowZ="${children.geometry.parameters.pLowNorm.z}" highX="${children.geometry.parameters.pHighNorm.x}" highY="${children.geometry.parameters.pHighNorm.y}" highZ="${children.geometry.parameters.pHighNorm.z}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aConeGeometry":
						
						solidsText += `      <cone name="${children.name}_${children.uuid}" rmin1="${children.geometry.parameters.pRMin1}" rmin2="${children.geometry.parameters.pRMin2}" rmax1="${children.geometry.parameters.pRMax1}" rmax2="${children.geometry.parameters.pRMax2}" z="${children.geometry.parameters.pDz}" deltaphi="${children.geometry.parameters.pDPhi}" startphi="${children.geometry.parameters.pSPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aParallGeometry":
						
						solidsText += `      <para name="${children.name}_${children.uuid}" x="${children.geometry.parameters.dx}" y="${children.geometry.parameters.dy}" z="${children.geometry.parameters.dz}" alpha="${children.geometry.parameters.alpha}" theta="${children.geometry.parameters.theta}" phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTrapeZoidGeometry":
						
						solidsText += `      <trd name="${children.name}_${children.uuid}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTrapeZoidPGeometry": 
						
						solidsText += `      <trap name="${children.name}_${children.uuid}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" x3="${children.geometry.parameters.dx3}" x4="${children.geometry.parameters.dx4}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" alpha1="${children.geometry.parameters.alpha}" alpha2="${children.geometry.parameters.alpha}" theta="${children.geometry.parameters.theta}" phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTorusGeometry":
						
						solidsText += `      <torus name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.pRMin}" rmax="${children.geometry.parameters.pRMax}" rtor="${children.geometry.parameters.pRTor}" starttheta="${children.geometry.parameters.pSPhi}" deltatheta="${children.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
					
					case "aEllipticalCylinderGeometry":
						
						solidsText += `      <eltube name="${children.name}_${children.uuid}" dx="${children.geometry.parameters.xSemiAxis}" dy="${children.geometry.parameters.semiAxisY}" dz="${children.geometry.parameters.Dz}" lunit="m"/>\n`; // Adjust size as needed
						break;
					
					case "aEllipsoidGeometry":
						
						solidsText += `      <ellipsoid name="${children.name}_${children.uuid}" ax="${children.geometry.parameters.xSemiAxis}" by="${children.geometry.parameters.ySemiAxis}" cz="${children.geometry.parameters.zSemiAxis}" zcut2="${children.geometry.parameters.zBottomCut}" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aEllipticalConeGeometry":
						
						solidsText += `      <elcone name="${children.name}_${children.uuid}" dx="${children.geometry.parameters.xSemiAxis}" dy="${children.geometry.parameters.ySemiAxis}" zmax="${children.geometry.parameters.height}" zcut="${children.geometry.parameters.zTopCut}" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTwistedBoxGeometry":
						
						solidsText += `      <twistedbox name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.angle}" x="${children.geometry.parameters.width}" y="${children.geometry.parameters.height}" z="${children.geometry.parameters.depth}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTwistedTrdGeometry":
						
						solidsText += `      <twistedtrd name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.twistedangle}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTwistedTrapGeometry":
						
						solidsText += `      <twistedtrap name="${children.name}_${children.uuid}" PhiTwist="${children.geometry.parameters.twistedangle}" x1="${children.geometry.parameters.dx1}" x2="${children.geometry.parameters.dx2}" y1="${children.geometry.parameters.dy1}" y2="${children.geometry.parameters.dy2}" z="${children.geometry.parameters.dz}" x3="${children.geometry.parameters.dx3}" x4="${children.geometry.parameters.dx4}" Alph="${children.geometry.parameters.alpha}" Theta="${children.geometry.parameters.theta}" Phi="${children.geometry.parameters.phi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTwistedTubeGeometry":
						
						solidsText += `      <twistedtubs name="${children.name}_${children.uuid}" twistedangle="${children.geometry.parameters.twistedangle}" endinnerrad="${children.geometry.parameters.pRMin}" endouterrad="${children.geometry.parameters.pRMax}" zlen="${children.geometry.parameters.pDz}" phi="${children.geometry.parameters.pDPhi}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aTetrahedraGeometry":
						
						solidsText += `      <tet name="${children.name}_${children.uuid}" vertex1="${children.geometry.parameters.anchor}" vertex2="${children.geometry.parameters.p2}" vertex3="${children.geometry.parameters.p3}" vertex4="${children.geometry.parameters.p4}"/>\n`; // Adjust size as needed
						break;
	
					case "Paraboloid":
			
						solidsText += `      <paraboloid name="${children.name}_${children.uuid}" rhi="${children.geometry.parameters.R2}" rlo="${children.geometry.parameters.R1}" dz="${children.geometry.parameters.pDz}" aunit="deg" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aHyperboloidGeometry":
						
						solidsText += `      <hype name="${children.name}_${children.uuid}" rmin="${children.geometry.parameters.radiusIn}" rmax="${children.geometry.parameters.radiusOut}" z="${children.geometry.parameters.pDz}" inst="${children.geometry.parameters.stereo1}" outst="${children.geometry.parameters.stereo2}" lunit="m"/>\n`; // Adjust size as needed
						break;
	
					case "aPolyconeGeometry":
						
						solidsText += `      <polycone name="${children.name}_${children.uuid}" startphi="${children.geometry.parameters.SPhi}" deltaphi="${children.geometry.parameters.DPhi}" aunit="deg" lunit="m">\n`; // Adjust size as needed
	
						for(var j = 0; j < children.geometry.parameters.numZPlanes; j++){
							solidsText += `        <zplane rmin="${children.geometry.parameters.rInner[j]}" rmax="${children.geometry.parameters.rOuter[j]}" z="${children.geometry.parameters.z[j]}"/>\n`
						}
	
						solidsText += `      </polycone>\n`;
						break;
	
					case "aPolyhedraGeometry":
						
						solidsText += `      <polyhedra name="${children.name}_${children.uuid}" startphi="${children.geometry.parameters.SPhi}" deltaphi="${children.geometry.parameters.DPhi}" numsides="${children.geometry.parameters.numSide}" aunit="deg" lunit="m">\n`; // Adjust size as needed
	
						for(var k = 0; k < children.geometry.parameters.numZPlanes; k++){
							solidsText += `        <zplane rmin="${children.geometry.parameters.rInner[k]}" rmax="${children.geometry.parameters.rOuter[k]}" z="${children.geometry.parameters.z[k]}"/>\n`
						}
	
						solidsText += `      </polyhedra>\n`;
						break;
	
					case "unitedGeometry":
	
						traversebooleanObjects(children, function ( child ) {
	
							rotationText += getRotationText(child);
							positionText += getPositionText(child);
							solidsText += getSolidText(child);
				
						} );
						break;
	
						case "subtractedGeometry":
	
						traversebooleanObjects(children, function ( child ) {
	
							rotationText += getRotationText(child);
							positionText += getPositionText(child);
							solidsText += getSolidText(child);
				
						} );
						break;
	
						case "intersectedGeometry":
	
						traversebooleanObjects(children, function ( child ) {
	
							rotationText += getRotationText(child);
							positionText += getPositionText(child);
							solidsText += getSolidText(child);
				
						} );
						break;
	
					default:
	
						break;
				}
				
				// Material properties
				
				if( children.material && children.material.newmaterial ) {
					if(!materialRefArray.includes(children.material.newmaterial?.elementType)) {
						materialsText += `      <material name="${children.material?.name?.elementType}"/>\n`;
						materialsText += `        <D value="${children.material?.name?.density}"/>\n`;
						materialsText += `      <material/>\n`;
		
						materialRefArray.push(children.material?.name?.elementType);
					}
				}
				// position and rotation properties
				if(children.name != "unitedGeometry" && children.name != "subtractedGeometry" && children.name != "intersectedGeometry"){
					positionText += `    <position name="${children.name}_${children.uuid}_pos" unit="m" x="${children.position.x.toFixed(4)}" y="${children.position.y.toFixed(4)}" z="${children.position.z.toFixed(4)}"/>\n`;
					rotationText += `    <rotation name="${children.name}_${children.uuid}_rot" unit="m" x="${children.rotation.x.toFixed(4)}" y="${children.rotation.y.toFixed(4)}" z="${children.rotation.z.toFixed(4)}"/>\n`;	
				}
				
				// Volume properties
				volumesText += `    <volume name="${children.name}_${children.uuid}_volume">\n`;
				if( children.material && children.material.newmaterial ) {
					volumesText += `      <materialref ref="${children.material.newmaterial?.elementType}"/>\n`;
				} else {
					volumesText += `      <materialref ref="G4_C"/>\n`;
				}
				volumesText += `      <solidref ref="${children.name}_${children.uuid}"/>\n`;
				volumesText += `    </volume>\n`

				// PhysiVolume properties
				physvolsText += `      <physvol>\n`
				physvolsText += `        <volumeref ref="${children.name}_${children.uuid}_volume"/>\n`;
				physvolsText += `        <positionref ref="${children.name}_${children.uuid}_pos"/>\n`;
				physvolsText += `        <rotationref ref="${children.name}_${children.uuid}_rot"/>\n`;
				physvolsText += `      </physvol>\n`;
			
			}
	
			var sceneText = `<?xml version="1.0" encoding="UTF-8"?>\n`;
			sceneText += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">\n`;
			// close define
			defineTexts += `  <define>\n`;
			defineTexts += positionText;
			defineTexts += rotationText;
			defineTexts += `  </define>\n`;		
		
			// close material
			materialsText += '    </materials>\n';
	
			// close solidtext
			solidsText += '    </solids>\n';
	
			// close structure
			structureText += `  <structure>\n`;
			structureText += volumesText;
			structureText += physvolsText;
			structureText += `    </volume>\n`;
			structureText += `  </structure>\n`;
	
			sceneText += defineTexts;
			sceneText += materialsText;
			sceneText += solidsText;
			sceneText += structureText;
			sceneText += `  <setup name="Default" version="1.0">\n`;
			sceneText += `    <world ref="world"/>\n`;
			sceneText += `  </setup>\n`;
			sceneText += `</gdml>`;
	
			downloadGeant4File(sceneText, 'detector.gdml');
		} 
		else {
			alert( 'The added model could not be found.');
		}

	} );
	options.add( option );
		

	// Export Macro
	
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/mac' ) );
	option.onClick( async function () {

		const loginStatus = localStorage.getItem('loginStatus');
		
		if(loginStatus === undefined || loginStatus === 'false') {
			alert( 'You must log in to export files.');
			return;
		}

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
	
			let macro = '';
			
			macro += `/gps/particle ${object.energykind}\n`
			macro += `/gps/energy ${object.energysize} ${object.energyunit}\n`
			macro += `/gps/pos/centre ${position.x} ${position.y} ${position.z} m\n`
			macro += `/gps/pos/type ${object.source}\n`
			if(sourceShape) 
			{
				macro += `/gps/pos/shape ${sourceShape}\n`
				macro += `/gps/pos/halfx ${object.halfX}\n`
				macro += `/gps/pos/halfy ${object.halfY}\n`
				macro += `/gps/pos/halfz ${object.halfZ}\n`
				macro += `/gps/pos/inner_radius ${object.innerradius}\n`
				macro += `/gps/pos/outer_radius ${object.outerradius}\n`
			}
	
			downloadGeant4File( macro, 'run.mac')
	
		} else {
			
			let macro = '';
				
			macro += `# print macro commands on screen\n`;
			macro += `/control/verbose 1\n`;
			macro += `# uncomment the following line if you use https://github.com/jintonic/gears\n`;
			macro += `#/geometry/source detector.tg\n\n`;

			macro += `# initialize geometry and physics\n`;
			macro += `/run/initialize\n\n`;

			macro += `# change particle and its energy here\n`;
			macro += `/gps/particle gamma\n`;
			macro += `/gps/energy 2.6 MeV\n\n`;

			macro += `# visualize geometry and events for debugging\n`;
			macro += `/vis/open\n`;
			macro += `/vis/drawVolume\n`;
			macro += `/vis/scene/add/trajectories\n`;
			macro += `/vis/scene/endOfEventAction accumulate 10\n`;
			macro += `/run/beamOn 10\n`;

			downloadGeant4File( macro, 'run.mac')
		}
		
	} );
	options.add( option );


	// Export Geometry	

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/geometry' ) );
	// option.onClick( function () {

	// 	const object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected.' );
	// 		return;

	// 	}

	// 	const geometry = object.geometry;

	// 	if ( geometry === undefined ) {

	// 		alert( 'The selected object doesn\'t have geometry.' );
	// 		return;

	// 	}

	// 	let output = geometry.toJSON();

	// 	try {

	// 		output = JSON.stringify( output, null, '\t' );
	// 		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	} catch ( e ) {

	// 		output = JSON.stringify( output );

	// 	}

	// 	saveString( output, 'geometry.json' );

	// } );
	// options.add( option );

	// // Export Object

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/object' ) );
	// option.onClick( function () {

	// 	const object = editor.selected;

	// 	if ( object === null ) {

	// 		alert( 'No object selected' );
	// 		return;

	// 	}

	// 	let output = object.toJSON();

	// 	try {

	// 		output = JSON.stringify( output, null, '\t' );
	// 		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	} catch ( e ) {

	// 		output = JSON.stringify( output );

	// 	}

	// 	saveString( output, 'model.json' );

	// } );
	// options.add( option );

	// // Export Scene

	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/scene' ) );
	// option.onClick( function () {

	// 	let output = editor.scene.toJSON();

	// 	try {

	// 		output = JSON.stringify( output, null, '\t' );
	// 		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

	// 	} catch ( e ) {

	// 		output = JSON.stringify( output );

	// 	}

	// 	saveString( output, 'scene.json' );

	// } );
	// options.add( option );

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
