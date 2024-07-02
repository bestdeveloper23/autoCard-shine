import * as THREE from 'three';

import { UIButton, UIInput, UIPanel, UIRow, UISelect, UIText, UITextArea, UINumber, UIDiv } from './libs/ui.js';

import { SetMaterialCommand } from './commands/SetMaterialCommand.js';
import { SetMaterialValueCommand } from './commands/SetMaterialValueCommand.js';

import { SidebarMaterialBooleanProperty } from './Sidebar.Material.BooleanProperty.js';
import { SidebarMaterialColorProperty } from './Sidebar.Material.ColorProperty.js';
import { SidebarMaterialConstantProperty } from './Sidebar.Material.ConstantProperty.js';
import { SidebarMaterialMapProperty } from './Sidebar.Material.MapProperty.js';
import { SidebarMaterialNumberProperty } from './Sidebar.Material.NumberProperty.js';
import { SidebarMaterialRangeValueProperty } from './Sidebar.Material.RangeValueProperty.js';
import { SidebarMaterialProgram } from './Sidebar.Material.Program.js';
import { PeriodicTable } from './PeriodTable.js';

import { SOURCE } from './libs/nucleardata/radiation.js';


function SidebarMaterial(editor) {

	const signals = editor.signals;
	const strings = editor.strings;

	let currentObject;

	let currentMaterialSlot = 0;

	const container = new UIPanel();
	container.setBorderTop('0');
	container.setDisplay('none');
	container.setPaddingTop('20px');

	// Current material slot

	const materialSlotRow = new UIRow();

	materialSlotRow.add(new UIText(strings.getKey('sidebar/material/slot')).setWidth('90px'));

	const materialSlotSelect = new UISelect().setWidth('170px').setFontSize('12px').onChange(update);
	materialSlotSelect.setOptions({ 0: '' }).setValue(0);
	materialSlotRow.add(materialSlotSelect);

	container.add(materialSlotRow);

	// type

	const materialClassRow = new UIRow();
	const materialClass = new UISelect().setWidth('150px').setFontSize('12px').onChange(update);

	materialClassRow.add(new UIText(strings.getKey('sidebar/material/type')).setWidth('90px'));
	materialClassRow.add(materialClass);

	// container.add(materialClassRow);


	// elementTypes

	const materialTypeRow = new UIRow();
	const materialType = new UISelect().setWidth('150px').setFontSize('12px').onChange((event) => {
		
		editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'elementTypes', event.target.value, currentMaterialSlot));
	});


	materialTypeRow.add(new UIText(strings.getKey('sidebar/material/type')).setWidth('90px'));
	materialTypeRow.add(materialType);

	materialType.setOptions(materialClassOptions);

	container.add(materialTypeRow);

	// uuid

	// const materialUUIDRow = new UIRow();
	// const materialUUID = new UIInput().setWidth('102px').setFontSize('12px').setDisabled(true);
	// const materialUUIDRenew = new UIButton(strings.getKey('sidebar/material/new')).setMarginLeft('7px');
	// materialUUIDRenew.onClick(function () {

	// 	materialUUID.setValue(THREE.MathUtils.generateUUID());
	// 	update();

	// });

	// materialUUIDRow.add(new UIText(strings.getKey('sidebar/material/uuid')).setWidth('90px'));
	// materialUUIDRow.add(materialUUID);
	// materialUUIDRow.add(materialUUIDRenew);

	// container.add(materialUUIDRow);

	// name

		// name

	const materialNameRow1 = new UIRow();
	const materialName1 = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {

		editor.execute( new SetMaterialValueCommand( editor, editor.selected, 'name', materialName1.getValue(), currentMaterialSlot ) );
		

	} );

	materialNameRow1.add( new UIText( strings.getKey( 'sidebar/material/name' ) ).setWidth( '90px' ) );
	materialNameRow1.add( materialName1 );

	// container.add( materialNameRow1 );

	const materialNameRow = new UIRow();

	// const materialName = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {
	const materialName = new UISelect().setWidth('150px').setFontSize('12px').onChange(onChangeProperty)

	const options = [];
	compoundMaterialOptions.forEach(element => {
		options.push(element.elementType);
	});

	materialNameRow.dom.style.display = 'none';
	
	const materialBasicRow = new UIRow();

	const basicMaterialButton = new UIButton("Select...").setWidth('120px');
	basicMaterialButton.dom.style.textTransform = 'none';
	materialBasicRow.dom.style.display = 'none';

	materialName.setOptions(options);
	materialName.dom.style.marginLeft = '90px';

	materialBasicRow.add(new UIText(strings.getKey('sidebar/material/element')).setWidth('90px'));
	materialBasicRow.add(basicMaterialButton);

	materialNameRow.add(materialName);

	container.add(materialBasicRow);
	container.add(materialNameRow);



	// density

	const densityRow = new UIRow();
	densityRow.add(new UIText(strings.getKey('sidebar/material/density')).setWidth('120px'));

	const materialDensity = new UIText().setWidth('60px');
	densityRow.add(materialDensity);
	container.add(densityRow);

	// energy

	const materialEnergyRow = new UIRow();
	materialEnergyRow.add(new UIText(strings.getKey('sidebar/material/energy')).setWidth('120px'));

	const materialEnergy = new UIText().setWidth('60px');
	materialEnergyRow.add(materialEnergy);
	container.add(materialEnergyRow);
	// program

	// const materialProgram = new SidebarMaterialProgram(editor, 'vertexShader');
	// container.add(materialProgram);

	// color

	const materialColor = new SidebarMaterialColorProperty(editor, 'color', strings.getKey('sidebar/material/color'));
	container.add(materialColor);

	// // specular

	// const materialSpecular = new SidebarMaterialColorProperty(editor, 'specular', strings.getKey('sidebar/material/specular'));
	// container.add(materialSpecular);

	// // shininess

	// const materialShininess = new SidebarMaterialNumberProperty(editor, 'shininess', strings.getKey('sidebar/material/shininess'));
	// container.add(materialShininess);

	// // emissive

	// const materialEmissive = new SidebarMaterialColorProperty(editor, 'emissive', strings.getKey('sidebar/material/emissive'));
	// container.add(materialEmissive);

	// // reflectivity

	// const materialReflectivity = new SidebarMaterialNumberProperty(editor, 'reflectivity', strings.getKey('sidebar/material/reflectivity'));
	// container.add(materialReflectivity);

	// // roughness

	// const materialRoughness = new SidebarMaterialNumberProperty(editor, 'roughness', strings.getKey('sidebar/material/roughness'), [0, 1]);
	// container.add(materialRoughness);

	// // metalness

	// const materialMetalness = new SidebarMaterialNumberProperty(editor, 'metalness', strings.getKey('sidebar/material/metalness'), [0, 1]);
	// container.add(materialMetalness);

	// // clearcoat

	// const materialClearcoat = new SidebarMaterialNumberProperty(editor, 'clearcoat', strings.getKey('sidebar/material/clearcoat'), [0, 1]);
	// container.add(materialClearcoat);

	// // clearcoatRoughness

	// const materialClearcoatRoughness = new SidebarMaterialNumberProperty(editor, 'clearcoatRoughness', strings.getKey('sidebar/material/clearcoatroughness'), [0, 1]);
	// container.add(materialClearcoatRoughness);

	// // iridescence

	// const materialIridescence = new SidebarMaterialNumberProperty(editor, 'iridescence', strings.getKey('sidebar/material/iridescence'), [0, 1]);
	// container.add(materialIridescence);

	// // iridescenceIOR

	// const materialIridescenceIOR = new SidebarMaterialNumberProperty(editor, 'iridescenceIOR', strings.getKey('sidebar/material/iridescenceIOR'), [1, 5]);
	// container.add(materialIridescenceIOR);

	// // iridescenceThicknessMax

	// const materialIridescenceThicknessMax = new SidebarMaterialRangeValueProperty(editor, 'iridescenceThicknessRange', strings.getKey('sidebar/material/iridescenceThicknessMax'), false, [0, Infinity], 0, 10, 1, 'nm');
	// container.add(materialIridescenceThicknessMax);

	// // sheen

	// const materialSheen = new SidebarMaterialNumberProperty(editor, 'sheen', strings.getKey('sidebar/material/sheen'), [0, 1]);
	// container.add(materialSheen);

	// // sheen roughness

	// const materialSheenRoughness = new SidebarMaterialNumberProperty(editor, 'sheenRoughness', strings.getKey('sidebar/material/sheenroughness'), [0, 1]);
	// container.add(materialSheenRoughness);

	// // sheen color

	// const materialSheenColor = new SidebarMaterialColorProperty(editor, 'sheenColor', strings.getKey('sidebar/material/sheencolor'));
	// container.add(materialSheenColor);

	// // transmission

	// const materialTransmission = new SidebarMaterialNumberProperty(editor, 'transmission', strings.getKey('sidebar/material/transmission'), [0, 1]);
	// container.add(materialTransmission);

	// // attenuation distance

	// const materialAttenuationDistance = new SidebarMaterialNumberProperty(editor, 'attenuationDistance', strings.getKey('sidebar/material/attenuationDistance'));
	// container.add(materialAttenuationDistance);

	// // attenuation tint

	// const materialAttenuationColor = new SidebarMaterialColorProperty(editor, 'attenuationColor', strings.getKey('sidebar/material/attenuationColor'));
	// container.add(materialAttenuationColor);

	// // thickness

	// const materialThickness = new SidebarMaterialNumberProperty(editor, 'thickness', strings.getKey('sidebar/material/thickness'));
	// container.add(materialThickness);

	// // vertex colors

	// const materialVertexColors = new SidebarMaterialBooleanProperty(editor, 'vertexColors', strings.getKey('sidebar/material/vertexcolors'));
	// container.add(materialVertexColors);

	// // depth packing

	// const materialDepthPackingOptions = {
	// 	[THREE.BasicDepthPacking]: 'Basic',
	// 	[THREE.RGBADepthPacking]: 'RGBA'
	// };

	// const materialDepthPacking = new SidebarMaterialConstantProperty(editor, 'depthPacking', strings.getKey('sidebar/material/depthPacking'), materialDepthPackingOptions);
	// container.add(materialDepthPacking);

	// // map

	// const materialMap = new SidebarMaterialMapProperty(editor, 'map', strings.getKey('sidebar/material/map'));
	// container.add(materialMap);

	// // specular map

	// const materialSpecularMap = new SidebarMaterialMapProperty(editor, 'specularMap', strings.getKey('sidebar/material/specularmap'));
	// container.add(materialSpecularMap);

	// // emissive map

	// const materialEmissiveMap = new SidebarMaterialMapProperty(editor, 'emissiveMap', strings.getKey('sidebar/material/emissivemap'));
	// container.add(materialEmissiveMap);

	// // matcap map

	// const materialMatcapMap = new SidebarMaterialMapProperty(editor, 'matcap', strings.getKey('sidebar/material/matcap'));
	// container.add(materialMatcapMap);

	// // alpha map

	// const materialAlphaMap = new SidebarMaterialMapProperty(editor, 'alphaMap', strings.getKey('sidebar/material/alphamap'));
	// container.add(materialAlphaMap);

	// // bump map

	// const materialBumpMap = new SidebarMaterialMapProperty(editor, 'bumpMap', strings.getKey('sidebar/material/bumpmap'));
	// container.add(materialBumpMap);

	// // normal map

	// const materialNormalMap = new SidebarMaterialMapProperty(editor, 'normalMap', strings.getKey('sidebar/material/normalmap'));
	// container.add(materialNormalMap);

	// // clearcoat map

	// const materialClearcoatMap = new SidebarMaterialMapProperty(editor, 'clearcoatMap', strings.getKey('sidebar/material/clearcoatmap'));
	// container.add(materialClearcoatMap);

	// // clearcoat normal map

	// const materialClearcoatNormalMap = new SidebarMaterialMapProperty(editor, 'clearcoatNormalMap', strings.getKey('sidebar/material/clearcoatnormalmap'));
	// container.add(materialClearcoatNormalMap);

	// // clearcoat roughness map

	// const materialClearcoatRoughnessMap = new SidebarMaterialMapProperty(editor, 'clearcoatRoughnessMap', strings.getKey('sidebar/material/clearcoatroughnessmap'));
	// container.add(materialClearcoatRoughnessMap);

	// // displacement map

	// const materialDisplacementMap = new SidebarMaterialMapProperty(editor, 'displacementMap', strings.getKey('sidebar/material/displacementmap'));
	// container.add(materialDisplacementMap);

	// // roughness map

	// const materialRoughnessMap = new SidebarMaterialMapProperty(editor, 'roughnessMap', strings.getKey('sidebar/material/roughnessmap'));
	// container.add(materialRoughnessMap);

	// // metalness map

	// const materialMetalnessMap = new SidebarMaterialMapProperty(editor, 'metalnessMap', strings.getKey('sidebar/material/metalnessmap'));
	// container.add(materialMetalnessMap);

	// // iridescence map

	// const materialIridescenceMap = new SidebarMaterialMapProperty(editor, 'iridescenceMap', strings.getKey('sidebar/material/iridescencemap'));
	// container.add(materialIridescenceMap);

	// // sheen color map

	// const materialSheenColorMap = new SidebarMaterialMapProperty(editor, 'sheenColorMap', strings.getKey('sidebar/material/sheencolormap'));
	// container.add(materialSheenColorMap);

	// // sheen roughness map

	// const materialSheenRoughnessMap = new SidebarMaterialMapProperty(editor, 'sheenRoughnessMap', strings.getKey('sidebar/material/sheenroughnessmap'));
	// container.add(materialSheenRoughnessMap);

	// // iridescence thickness map

	// const materialIridescenceThicknessMap = new SidebarMaterialMapProperty(editor, 'iridescenceThicknessMap', strings.getKey('sidebar/material/iridescencethicknessmap'));
	// container.add(materialIridescenceThicknessMap);

	// // env map

	// const materialEnvMap = new SidebarMaterialMapProperty(editor, 'envMap', strings.getKey('sidebar/material/envmap'));
	// container.add(materialEnvMap);

	// // light map

	// const materialLightMap = new SidebarMaterialMapProperty(editor, 'lightMap', strings.getKey('sidebar/material/lightmap'));
	// container.add(materialLightMap);

	// // ambient occlusion map

	// const materialAOMap = new SidebarMaterialMapProperty(editor, 'aoMap', strings.getKey('sidebar/material/aomap'));
	// container.add(materialAOMap);

	// // gradient map

	// const materialGradientMap = new SidebarMaterialMapProperty(editor, 'gradientMap', strings.getKey('sidebar/material/gradientmap'));
	// container.add(materialGradientMap);

	// // transmission map

	// const transmissionMap = new SidebarMaterialMapProperty(editor, 'transmissionMap', strings.getKey('sidebar/material/transmissionmap'));
	// container.add(transmissionMap);

	// // thickness map

	// const thicknessMap = new SidebarMaterialMapProperty(editor, 'thicknessMap', strings.getKey('sidebar/material/thicknessmap'));
	// container.add(thicknessMap);

	// // side

	// const materialSideOptions = {
	// 	0: 'Front',
	// 	1: 'Back',
	// 	2: 'Double'
	// };

	// const materialSide = new SidebarMaterialConstantProperty(editor, 'side', strings.getKey('sidebar/material/side'), materialSideOptions);
	// container.add(materialSide);

	// // size

	// const materialSize = new SidebarMaterialNumberProperty(editor, 'size', strings.getKey('sidebar/material/size'), [0, Infinity]);
	// container.add(materialSize);

	// // sizeAttenuation

	// const materialSizeAttenuation = new SidebarMaterialBooleanProperty(editor, 'sizeAttenuation', strings.getKey('sidebar/material/sizeAttenuation'));
	// container.add(materialSizeAttenuation);

	// // flatShading

	// const materialFlatShading = new SidebarMaterialBooleanProperty(editor, 'flatShading', strings.getKey('sidebar/material/flatShading'));
	// container.add(materialFlatShading);

	// // blending

	// const materialBlendingOptions = {
	// 	0: 'No',
	// 	1: 'Normal',
	// 	2: 'Additive',
	// 	3: 'Subtractive',
	// 	4: 'Multiply',
	// 	5: 'Custom'
	// };

	// const materialBlending = new SidebarMaterialConstantProperty(editor, 'blending', strings.getKey('sidebar/material/blending'), materialBlendingOptions);
	// container.add(materialBlending);

	// opacity

	const materialOpacity = new SidebarMaterialNumberProperty(editor, 'opacity', strings.getKey('sidebar/material/opacity'), [0, 1]);
	container.add(materialOpacity);

	// transparent

	const materialTransparent = new SidebarMaterialBooleanProperty(editor, 'transparent', strings.getKey('sidebar/material/transparent'));
	container.add(materialTransparent);

	// forceSinglePass

	// const materialForceSinglePass = new SidebarMaterialBooleanProperty(editor, 'forceSinglePass', strings.getKey('sidebar/material/forcesinglepass'));
	// container.add(materialForceSinglePass);

	// // alpha test

	// const materialAlphaTest = new SidebarMaterialNumberProperty(editor, 'alphaTest', strings.getKey('sidebar/material/alphatest'), [0, 1]);
	// container.add(materialAlphaTest);

	// // depth test

	// const materialDepthTest = new SidebarMaterialBooleanProperty(editor, 'depthTest', strings.getKey('sidebar/material/depthtest'));
	// container.add(materialDepthTest);

	// // depth write

	// const materialDepthWrite = new SidebarMaterialBooleanProperty(editor, 'depthWrite', strings.getKey('sidebar/material/depthwrite'));
	// container.add(materialDepthWrite);

	// // wireframe

	// const materialWireframe = new SidebarMaterialBooleanProperty(editor, 'wireframe', strings.getKey('sidebar/material/wireframe'));
	// container.add(materialWireframe);

	// // userData

	// const materialUserDataRow = new UIRow();
	// const materialUserData = new UITextArea().setWidth('150px').setHeight('40px').setFontSize('12px').onChange(update);
	// materialUserData.onKeyUp(function () {

	// 	try {

	// 		JSON.parse(materialUserData.getValue());

	// 		materialUserData.dom.classList.add('success');
	// 		materialUserData.dom.classList.remove('fail');

	// 	} catch (error) {

	// 		materialUserData.dom.classList.remove('success');
	// 		materialUserData.dom.classList.add('fail');

	// 	}

	// });

	// materialUserDataRow.add(new UIText(strings.getKey('sidebar/material/userdata')).setWidth('90px'));
	// materialUserDataRow.add(materialUserData);

	// container.add(materialUserDataRow);


	
	const priodicElement = new UIRow();
	priodicElement.dom.style.display = 'none';
	priodicElement.add(PeriodicTable(materialDensity, materialEnergy, onChangeProperty, basicMaterialButton, priodicElement, materialName));

	container.add(priodicElement);




////////////////////////// Source


	// type

	const sourceTypeRow = new UIRow();
	const sourceType = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const sourcetypeoption = [];
	SOURCE.type.forEach(element => {
		sourcetypeoption.push(element);
	});

	sourceType.setOptions(sourcetypeoption);
	sourceType.setValue(0);

	sourceTypeRow.add(new UIText(strings.getKey('sidebar/object/type')).setWidth('90px'));
	sourceTypeRow.add(sourceType);

	container.add(sourceTypeRow);


	// Source Shape

	const planesourceShapeRow = new UIRow();
	const planesourceShape = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const planeshapeoption = [];
	SOURCE.shape.plane.forEach(element => {
		planeshapeoption.push(element);
	});

	planesourceShape.setOptions(planeshapeoption);

	planesourceShapeRow.add(new UIText(strings.getKey('sidebar/object/shape')).setWidth('90px'));
	planesourceShapeRow.add(planesourceShape);
	planesourceShapeRow.setDisplay( 'none' );

	container.add(planesourceShapeRow);

	// Source Shape

	const volumesourceShapeRow = new UIRow();
	const volumesourceShape = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const volumeshapeoption = [];
	SOURCE.shape.volume.forEach(element => {
		volumeshapeoption.push(element);
	});

	volumesourceShape.setOptions(volumeshapeoption);

	volumesourceShapeRow.add(new UIText(strings.getKey('sidebar/object/shape')).setWidth('90px'));
	volumesourceShapeRow.add(volumesourceShape);
	volumesourceShapeRow.setDisplay( 'none' );

	container.add(volumesourceShapeRow);
	

	// particle type

	const energyKindRow = new UIRow();
	const energykind = new UISelect().setWidth('150px').setFontSize('12px').onChange( update );
	const energyoptions = [];
	SOURCE.particle.forEach(element => {
		energyoptions.push(element);
	});

	energykind.setOptions(energyoptions);
	energykind.setValue(0);

	energyKindRow.add(new UIText(strings.getKey('sidebar/object/kind')).setWidth('90px'));
	energyKindRow.add(energykind);

	container.add(energyKindRow);

	// energy size

	const energyRow = new UIRow();
	energyRow.add(new UIText(strings.getKey('sidebar/object/size')).setWidth('120px'));

	const energysize = new UINumber().setPrecision( 5 ).setWidth('60px').onChange( update );
	energyRow.add(energysize);
	container.add(energyRow);

	// energy unit

	const energyunit = new UISelect().setWidth('60px').setFontSize('12px').onChange( update );
	const unitoptions = [];
	SOURCE.unit.forEach(element => {
		unitoptions.push(element);
	});

	energyunit.setOptions(unitoptions);
	energyunit.setValue(1);

	energyRow.add(energyunit);

	container.add(energyRow);










	// select basicMaterial element
	
	basicMaterialButton.onClick(() => {
		priodicElement.dom.style.display = 'grid';
	})



	//

	function update() {

		if (currentObject.source) {
			const newsourcename = sourceType.getValue();			
			if ( newsourcename == 1 ) {
				planesourceShapeRow.setDisplay( 'flex' );
				volumesourceShapeRow.setDisplay( 'none' );
			} else if ( newsourcename == 3 || newsourcename == 4 ) {
				planesourceShapeRow.setDisplay( 'none' );
				volumesourceShapeRow.setDisplay( 'flex' );
			} else {
				planesourceShapeRow.setDisplay( 'none' );
				volumesourceShapeRow.setDisplay( 'none' );
			}

			if( object.source !== undefined ) {

				object.source = SOURCE.type[Number(newsourcename)];
				// object.updateProjectionMatrix();

			}

			// if( object.planeshape !== undefined ) {

				const newplaneshape = planesourceShape.getValue();
				object.planeshape = SOURCE.shape.plane[Number(newplaneshape)];
				// object.updateProjectionMatrix();
				
			// }

			// if( object.volumeshape !== undefined ) {

				const newvolumeshape = volumesourceShape.getValue();
				object.volumeshape = SOURCE.shape.volume[Number(newvolumeshape)];
				
				// object.updateProjectionMatrix();
				
			// }

			if( object.energykind !== undefined ) {

				const newKind = energykind.getValue();
				object.energykind = SOURCE.particle[Number(newKind)];
				// object.updateProjectionMatrix();
				
			}

			
			if( object.energysize !== undefined ) {

				const newSize = energysize.getValue();
				object.energysize = newSize;
				// object.updateProjectionMatrix();
				
			}
			
			if( object.energyunit !== undefined ) {

				const newUnit = energyunit.getValue();
				object.energyunit = SOURCE.unit[Number(newUnit)];
				// object.updateProjectionMatrix();
				
			}
		} else {
			const previousSelectedSlot = currentMaterialSlot;

			currentMaterialSlot = parseInt(materialSlotSelect.getValue());
	
			if (currentMaterialSlot !== previousSelectedSlot) refreshUI();
	
			let material = editor.getObjectMaterial(currentObject, currentMaterialSlot);
	
			if (material) {
	
				// if (material.uuid !== undefined && material.uuid !== materialUUID.getValue()) {
	
				// 	editor.execute(new SetMaterialValueCommand(editor, currentObject, 'uuid', materialUUID.getValue(), currentMaterialSlot));
	
				// }
	
				if (material.type !== materialClass.getValue()) {
	
					material = new materialClasses[materialClass.getValue()]();
	
					if (material.type === 'RawShaderMaterial') {
	
						material.vertexShader = vertexShaderVariables + material.vertexShader;
	
					}
	
					if (Array.isArray(currentObject.material)) {
	
						// don't remove the entire multi-material. just the material of the selected slot
	
						editor.removeMaterial(currentObject.material[currentMaterialSlot]);
	
					} else {
	
						editor.removeMaterial(currentObject.material);
	
					}
	
					editor.execute(new SetMaterialCommand(editor, currentObject, material, currentMaterialSlot), 'New Material: ' + materialClass.getValue());
					editor.addMaterial(material);
					// TODO Copy other references in the scene graph
					// keeping name and UUID then.
					// Also there should be means to create a unique
					// copy for the current object explicitly and to
					// attach the current material to other objects.
	
				}
	
				if ( material.name !== undefined ) {
	
					materialName1.setValue( material.name );
					
				}
	
	
				// try {
	
				// 	const userData = JSON.parse(materialUserData.getValue());
				// 	if (JSON.stringify(material.userData) != JSON.stringify(userData)) {
	
				// 		editor.execute(new SetMaterialValueCommand(editor, currentObject, 'userData', userData, currentMaterialSlot));
	
				// 	}
	
				// } catch (exception) {
	
				// 	console.warn(exception);
	
				// }
	
				refreshUI();
	
			}
	
		}

	}

	//

	function setRowVisibility() {

		
		if( currentObject.source) {
			const properties = {
				'source': sourceTypeRow,
				'planeshape': planesourceShapeRow,
				'volumeshape': volumesourceShapeRow,
				'energykind': energyKindRow,
				'energysize': energyRow,
			};
	
			for ( const property in properties ) {
	
				const uiElement = properties[ property ];
	
				if ( Array.isArray( uiElement ) === true ) {
	
					for ( let i = 0; i < uiElement.length; i ++ ) {
	
						uiElement[ i ].setDisplay( currentObject[ property ] !== undefined ? '' : 'none' );
	
					}
	
				} else {
	
					uiElement.setDisplay( currentObject[ property ] !== undefined ? '' : 'none' );
	
				}
	
			}

			
			materialTypeRow.setDisplay( 'none');
			materialEnergyRow.setDisplay( 'none');
			densityRow.setDisplay( 'none');
			materialColor.setDisplay( 'none');
			materialOpacity.setDisplay( 'none');
			materialTransparent.setDisplay( 'none');

		} 
		if(currentObject.material) {
			const properties2 = {
				'type': materialTypeRow,
				'energy': materialEnergyRow,
				'density': densityRow,
				'color	': materialColor,
				'opacity': materialOpacity,
				'transparent': materialTransparent,
			};
	
			for ( const property in properties2 ) {
	
				const uiElement = properties2[ property ];
	
				if ( Array.isArray( uiElement ) === true ) {
	
					for ( let i = 0; i < uiElement.length; i ++ ) {
	
						uiElement[ i ].setDisplay( currentObject?.material[ property ] !== undefined ? '' : 'none' );
	
					}
	
				} else {
	
					uiElement.setDisplay( currentObject?.material[ property ] !== undefined ? '' : 'none' );
	
				}
	
			}

			sourceTypeRow.setDisplay( 'none');
			planesourceShapeRow.setDisplay( 'none');
			volumesourceShapeRow.setDisplay( 'none');
			energyKindRow.setDisplay( 'none');
			energyRow.setDisplay( 'none');
		}
		
		
		const material = currentObject.material;

		if (Array.isArray(material)) {

			materialSlotRow.setDisplay('');

		} else {

			materialSlotRow.setDisplay('none');

		}

		if ( object.source !== undefined ) {
			objectNameRow.setDisplay( 'none' );
		}

		if ( object.source) {
			if ( object.source === 'Plane' ) {
				planesourceShapeRow.setDisplay( 'flex' );
			} else if ( object.source === 'Surface' || object.source === 'Volume' ) {
				volumesourceShapeRow.setDisplay( 'flex' );
			} else if( object.source === 'Point' || object.source === 'Beam' ) {
				planesourceShapeRow.setDisplay( 'none' );
				volumesourceShapeRow.setDisplay( 'none' );
			} else {
			}
	
		}
		
	}

	function refreshUI() {

		if (!currentObject) return;

		if (currentObject.source) {
			if( currentObject.source !== undefined ) {
				sourceType.setValue( SOURCE.type.indexOf(currentObject.source) );	
			}
			
			if( currentObject.planeshape !== undefined ) {
				const index = SOURCE.shape.plane.indexOf(currentObject.planeshape);
				planesourceShape.setValue( index );
			}
	
			if( currentObject.volumeshape !== undefined ) {
				const index = SOURCE.shape.volume.indexOf(currentObject.volumeshape);
				volumesourceShape.setValue( index );
			}
	
			if( currentObject.energysize !== undefined ) {
				energysize.setValue( currentObject.energysize );
			}
	
			if( currentObject.energyunit !== undefined ) {
				energyunit.setValue( SOURCE.unit.indexOf(currentObject.energyunit) );
			}
			
			if( currentObject.energykind !== undefined ) {
				energykind.setValue( SOURCE.particle.indexOf(currentObject.energykind) );
			}
			
		} else {
			let material = currentObject.material;

			if (Array.isArray(material)) {
	
				const slotOptions = {};
	
				currentMaterialSlot = Math.max(0, Math.min(material.length, currentMaterialSlot));
	
				for (let i = 0; i < material.length; i++) {
	
					slotOptions[i] = String(i + 1) + ': ' + material[i].name;
	
				}
	
				materialSlotSelect.setOptions(slotOptions).setValue(currentMaterialSlot);
	
			}
	
			material = editor.getObjectMaterial(currentObject, currentMaterialSlot);
	
			// if (material.uuid !== undefined) {
	
			// 	materialUUID.setValue(material.uuid);
	
			// }
	
	
			if ( material.name !== undefined ) {
	
				materialName1.setValue( material.name );
	
			}
			
			if (material.density !== undefined) {
	
				materialDensity.setValue(material.density);
	
			} else {
				materialDensity.setValue('')
			}
	
			if (material.energy !== undefined) {
	
				materialEnergy.setValue(material.energy);
	
			} else {
				materialEnergy.setValue('');
			}
	
			if (currentObject.isMesh) {
	
				materialClass.setOptions(meshMaterialOptions);
	
			} else if (currentObject.isSprite) {
	
				materialClass.setOptions(spriteMaterialOptions);
	
			} else if (currentObject.isPoints) {
	
				materialClass.setOptions(pointsMaterialOptions);
	
			} else if (currentObject.isLine) {
	
				materialClass.setOptions(lineMaterialOptions);
	
			}
	
			materialClass.setValue(material.type);
			if(material.elementTypes) {
				if(material.elementTypes === 'BasicMaterial') {
					materialType.setValue(0);
					materialBasicRow.dom.style.display = 'block';
					materialNameRow.dom.style.display = 'none';
					if(material.newmaterial) {
						basicMaterialButton.setInnerHTML(materialTypeOptions[material.newmaterial.id-1].elementType);
						materialName.setValue(-1);
					} else {
						basicMaterialButton.setInnerHTML('Select...');
					}
					
				} else if (material.elementTypes === 'CompoundMaterial') {
					materialType.setValue(1);
					materialNameRow.dom.style.display = 'block';
					materialBasicRow.dom.style.display = 'none';
					if(material.newmaterial) {
						materialName.setValue(material.newmaterial.id-99);
						basicMaterialButton.setInnerHTML('Select...');
					} else {
						materialName.setValue(-1);
					}
				}
			}
			materialType.setValue(material.elementTypes);
	
	
		}


		
		
		setRowVisibility();

		// try {

		// 	materialUserData.setValue(JSON.stringify(material.userData, null, '  '));

		// } catch (error) {

		// 	console.log(error);

		// }

		// materialUserData.setBorderColor('transparent');
		// materialUserData.setBackgroundColor('');

	}

	// events

	signals.objectSelected.add(function (object) {

		let hasMaterial = false;
		materialBasicRow.dom.style.display = 'none';
		materialNameRow.dom.style.display = 'none';

		if (object && object.material || object && object.source && object.children[1].material) {

			hasMaterial = true;

			if (Array.isArray(object.material) && object.material.length === 0) {

				hasMaterial = false;

			}
			if (object.source && Array.isArray(object.children[1].material) && object.children[1].material.length === 0) {

				hasMaterial = false;

			}

		}

		if (hasMaterial) {

			currentObject = object;
			refreshUI();
			container.setDisplay('');

		} else {

			currentObject = null;
			container.setDisplay('none');

		}

	});

	function onChangeProperty(basic = false, id = 0) {
		if(basic === true) {
			
			const materialElement = materialTypeOptions[id];
			materialDensity.setValue(materialElement.density);
			materialEnergy.setValue(materialElement.energy);
			editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'newmaterial', materialElement, currentMaterialSlot));
			editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'density', String(materialElement.density), currentMaterialSlot));
			editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'energy', String(materialElement.energy), currentMaterialSlot));
			
			editor.execute( new SetMaterialValueCommand( editor, editor.selected, 'name', materialElement.elementType, currentMaterialSlot ) );
			

			// editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'elementTypes', 'BasicMaterial', currentMaterialSlot));

			
		} else {
			const selectedMaterialID = Number(materialName.getValue());
			
			const materialElement = compoundMaterialOptions[selectedMaterialID];
			materialDensity.setValue(materialElement.density);
			materialEnergy.setValue(materialElement.energy);
			basicMaterialButton.setInnerHTML('Select...');
			editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'newmaterial', materialElement, currentMaterialSlot));
			editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'density', String(materialElement.density), currentMaterialSlot));
			editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'energy', String(materialElement.energy), currentMaterialSlot));
			// editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'elementTypes', 'CompoundMaterial', currentMaterialSlot));

			editor.execute( new SetMaterialValueCommand( editor, editor.selected, 'name', materialElement.elementType, currentMaterialSlot ) );
			
		}
		
	}

	signals.materialChanged.add(refreshUI);

	return container;

}

const materialClasses = {
	'LineBasicMaterial': THREE.LineBasicMaterial,
	'LineDashedMaterial': THREE.LineDashedMaterial,
	'MeshBasicMaterial': THREE.MeshBasicMaterial,
	'MeshDepthMaterial': THREE.MeshDepthMaterial,
	'MeshNormalMaterial': THREE.MeshNormalMaterial,
	'MeshLambertMaterial': THREE.MeshLambertMaterial,
	'MeshMatcapMaterial': THREE.MeshMatcapMaterial,
	'MeshPhongMaterial': THREE.MeshPhongMaterial,
	'MeshToonMaterial': THREE.MeshToonMaterial,
	'MeshStandardMaterial': THREE.MeshStandardMaterial,
	'MeshPhysicalMaterial': THREE.MeshPhysicalMaterial,
	'RawShaderMaterial': THREE.RawShaderMaterial,
	'ShaderMaterial': THREE.ShaderMaterial,
	'ShadowMaterial': THREE.ShadowMaterial,
	'SpriteMaterial': THREE.SpriteMaterial,
	'PointsMaterial': THREE.PointsMaterial
};

const vertexShaderVariables = [
	'uniform mat4 projectionMatrix;',
	'uniform mat4 modelViewMatrix;\n',
	'attribute vec3 position;\n\n',
].join('\n');

const meshMaterialOptions = {
	'MeshBasicMaterial': 'MeshBasicMaterial',
	'MeshDepthMaterial': 'MeshDepthMaterial',
	'MeshNormalMaterial': 'MeshNormalMaterial',
	'MeshLambertMaterial': 'MeshLambertMaterial',
	'MeshMatcapMaterial': 'MeshMatcapMaterial',
	'MeshPhongMaterial': 'MeshPhongMaterial',
	'MeshToonMaterial': 'MeshToonMaterial',
	'MeshStandardMaterial': 'MeshStandardMaterial',
	'MeshPhysicalMaterial': 'MeshPhysicalMaterial',
	'RawShaderMaterial': 'RawShaderMaterial',
	'ShaderMaterial': 'ShaderMaterial',
	'ShadowMaterial': 'ShadowMaterial'
};

const materialClassOptions = {
		'BasicMaterial':'BasicMaterial',
		'CompoundMaterial':'CompoundMaterial',
	}

const lineMaterialOptions = {
	'LineBasicMaterial': 'LineBasicMaterial',
	'LineDashedMaterial': 'LineDashedMaterial',
	'RawShaderMaterial': 'RawShaderMaterial',
	'ShaderMaterial': 'ShaderMaterial'
};

const spriteMaterialOptions = {
	'SpriteMaterial': 'SpriteMaterial',
	'RawShaderMaterial': 'RawShaderMaterial',
	'ShaderMaterial': 'ShaderMaterial'
};

const pointsMaterialOptions = {
	'PointsMaterial': 'PointsMaterial',
	'RawShaderMaterial': 'RawShaderMaterial',
	'ShaderMaterial': 'ShaderMaterial'
};

const materialTypeOptions =
	[
		{
			id: 1,
			elementType: 'G4_H',
			density: 8.3748e-05,
			energy: 19.2
		},
		{
			id: 2,
			elementType: 'G4_He',
			density: 0.000166322,
			energy: 41.8
		},
		{
			id: 3,
			elementType: 'G4_Li',
			density: 0.534,
			energy: 40
		},
		{
			id: 4,
			elementType: 'G4_Be',
			density: 1.848,
			energy: 63.7
		},
		{
			id: 5,
			elementType: 'G4_B',
			density: 2.37,
			energy: 76
		},
		{
			id: 6,
			elementType: 'G4_C',
			density: 2,
			energy: 81
		},
		{
			id: 7,
			elementType: 'G4_N',
			density: 0.0011652,
			energy: 82
		},
		{
			id: 8,
			elementType: 'G4_O',
			density: 0.00133151,
			energy: 95
		},
		{
			id: 9,
			elementType: 'G4_F',
			density: 0.00158029,
			energy: 115
		},
		{
			id: 10,
			elementType: 'G4_Ne',
			density: 0.000838505,
			energy: 137
		},
		{
			id: 11,
			elementType: 'G4_Na',
			density: 0.971,
			energy: 149
		},
		{
			id: 12,
			elementType: 'G4_Mg',
			density: 1.74,
			energy: 156
		},
		{
			id: 13,
			elementType: 'G4_Al',
			density: 2.699,
			energy: 166
		},
		{
			id: 14,
			elementType: 'G4_Si',
			density: 2.33,
			energy: 173
		},
		{
			id: 15,
			elementType: 'G4_P',
			density: 2.2,
			energy: 173
		},
		{
			id: 16,
			elementType: 'G4_S',
			density: 2,
			energy: 180
		},
		{
			id: 17,
			elementType: 'G4_Cl',
			density: 0.00299473,
			energy: 174
		},
		{
			id: 18,
			elementType: 'G4_Ar',
			density: 0.00166201,
			energy: 188
		},
		{
			id: 19,
			elementType: 'G4_K',
			density: 0.862,
			energy: 190
		},
		{
			id: 20,
			elementType: 'G4_Ca',
			density: 1.55,
			energy: 191
		},
		{
			id: 21,
			elementType: 'G4_Sc',
			density: 2.989,
			energy: 216
		},
		{
			id: 22,
			elementType: 'G4_Ti',
			density: 4.54,
			energy: 233
		},
		{
			id: 23,
			elementType: 'G4_V',
			density: 6.11,
			energy: 245
		},
		{
			id: 24,
			elementType: 'G4_Cr',
			density: 7.18,
			energy: 257
		},
		{
			id: 25,
			elementType: 'G4_Mn',
			density: 7.44,
			energy: 272
		},
		{
			id: 26,
			elementType: 'G4_Fe',
			density: 7.874,
			energy: 286
		},
		{
			id: 27,
			elementType: 'G4_Co',
			density: 8.9,
			energy: 297
		},
		{
			id: 28,
			elementType: 'G4_Ni',
			density: 8.902,
			energy: 311
		},
		{
			id: 29,
			elementType: 'G4_Cu',
			density: 8.96,
			energy: 322
		},
		{
			id: 30,
			elementType: 'G4_Zn',
			density: 7.133,
			energy: 330
		},
		{
			id: 31,
			elementType: 'G4_Ga',
			density: 5.904,
			energy: 334
		},
		{
			id: 32,
			elementType: 'G4_Ge',
			density: 5.323,
			energy: 350
		},
		{
			id: 33,
			elementType: 'G4_As',
			density: 5.73,
			energy: 347
		},
		{
			id: 34,
			elementType: 'G4_Se',
			density: 4.5,
			energy: 348
		},
		{
			id: 35,
			elementType: 'G4_Br',
			density: 0.0070721,
			energy: 343
		},
		{
			id: 36,
			elementType: 'G4_Kr',
			density: 0.00347832,
			energy: 352
		},
		{
			id: 37,
			elementType: 'G4_Rb',
			density: 1.532,
			energy: 363
		},
		{
			id: 38,
			elementType: 'G4_Sr',
			density: 2.54,
			energy: 366
		},
		{
			id: 39,
			elementType: 'G4_Y',
			density: 4.469,
			energy: 379
		},
		{
			id: 40,
			elementType: 'G4_Zr',
			density: 6.506,
			energy: 393
		},
		{
			id: 41,
			elementType: 'G4_Nb',
			density: 8.57,
			energy: 417
		},
		{
			id: 42,
			elementType: 'G4_Mo',
			density: 10.22,
			energy: 424
		},
		{
			id: 43,
			elementType: 'G4_Tc',
			density: 11.5,
			energy: 428
		},
		{
			id: 44,
			elementType: 'G4_Ru',
			density: 12.41,
			energy: 441
		},
		{
			id: 45,
			elementType: 'G4_Rh',
			density: 12.41,
			energy: 449
		},
		{
			id: 46,
			elementType: 'G4_Pd',
			density: 12.02,
			energy: 470
		},
		{
			id: 47,
			elementType: 'G4_Ag',
			density: 10.5,
			energy: 470
		},
		{
			id: 48,
			elementType: 'G4_Cd',
			density: 8.65,
			energy: 469
		},
		{
			id: 49,
			elementType: 'G4_In',
			density: 7.31,
			energy: 488
		},
		{
			id: 50,
			elementType: 'G4_Sn',
			density: 7.31,
			energy: 488
		},
		{
			id: 51,
			elementType: 'G4_Sb',
			density: 6.691,
			energy: 487
		},
		{
			id: 52,
			elementType: 'G4_Te',
			density: 6.24,
			energy: 485
		},
		{
			id: 53,
			elementType: 'G4_I',
			density: 4.93,
			energy: 491
		},
		{
			id: 54,
			elementType: 'G4_Xe',
			density: 0.00548536,
			energy: 482
		},
		{
			id: 55,
			elementType: 'G4_Cs',
			density: 1.873,
			energy: 488
		},
		{
			id: 56,
			elementType: 'G4_Ba',
			density: 3.5,
			energy: 491
		},
		{
			id: 57,
			elementType: 'G4_La',
			density: 6.154,
			energy: 501
		},
		{
			id: 58,
			elementType: 'G4_Ce',
			density: 6.657,
			energy: 523
		},
		{
			id: 59,
			elementType: 'G4_Pr',
			density: 6.71,
			energy: 535
		},
		{
			id: 60,
			elementType: 'G4_Nd',
			density: 6.9,
			energy: 546
		},
		{
			id: 61,
			elementType: 'G4_Pm',
			density: 7.22,
			energy: 560
		},
		{
			id: 62,
			elementType: 'G4_Sm',
			density: 7.46,
			energy: 574
		},
		{
			id: 63,
			elementType: 'G4_Eu',
			density: 5.243,
			energy: 580
		},
		{
			id: 64,
			elementType: 'G4_Gd',
			density: 7.9004,
			energy: 591
		},
		{
			id: 65,
			elementType: 'G4_Tb',
			density: 8.229,
			energy: 614
		},
		{
			id: 66,
			elementType: 'G4_Dy',
			density: 8.55,
			energy: 628
		},
		{
			id: 67,
			elementType: 'G4_Ho',
			density: 8.795,
			energy: 650
		},
		{
			id: 68,
			elementType: 'G4_Er',
			density: 9.066,
			energy: 658
		},
		{
			id: 69,
			elementType: 'G4_Tm',
			density: 9.321,
			energy: 674
		},
		{
			id: 70,
			elementType: 'G4_Yb',
			density: 6.73,
			energy: 684
		},
		{
			id: 71,
			elementType: 'G4_Lu',
			density: 9.84,
			energy: 694
		},
		{
			id: 72,
			elementType: 'G4_Hf',
			density: 13.31,
			energy: 705
		},
		{
			id: 73,
			elementType: 'G4_Ta',
			density: 16.654,
			energy: 718
		},
		{
			id: 74,
			elementType: 'G4_W',
			density: 19.3,
			energy: 727
		},
		{
			id: 75,
			elementType: 'G4_Re',
			density: 21.02,
			energy: 736
		},
		{
			id: 76,
			elementType: 'G4_Os',
			density: 22.57,
			energy: 746
		},
		{
			id: 77,
			elementType: 'G4_Ir',
			density: 22.42,
			energy: 757
		},
		{
			id: 78,
			elementType: 'G4_Pt',
			density: 21.45,
			energy: 790
		},
		{
			id: 79,
			elementType: 'G4_Au',
			density: 19.32,
			energy: 790
		},
		{
			id: 80,
			elementType: 'G4_Hg',
			density: 13.546,
			energy: 800
		},
		{
			id: 81,
			elementType: 'G4_Tl',
			density: 11.72,
			energy: 810
		},
		{
			id: 82,
			elementType: 'G4_Pb',
			density: 11.35,
			energy: 823
		},
		{
			id: 83,
			elementType: 'G4_Bi',
			density: 9.747,
			energy: 823
		},
		{
			id: 84,
			elementType: 'G4_Po',
			density: 9.32,
			energy: 830
		},
		{
			id: 85,
			elementType: 'G4_At',
			density: 9.32,
			energy: 830
		},
		{
			id: 86,
			elementType: 'G4_Rn',
			density: 0.00900662,
			energy: 794
		},
		{
			id: 87,
			elementType: 'G4_Fr',
			density: 1,
			energy: 827
		},
		{
			id: 88,
			elementType: 'G4_Ra',
			density: 5,
			energy: 826
		},
		{
			id: 89,
			elementType: 'G4_Ac',
			density: 10.07,
			energy: 841
		},
		{
			id: 90,
			elementType: 'G4_Th',
			density: 11.72,
			energy: 847
		},
		{
			id: 91,
			elementType: 'G4_Pa',
			density: 15.37,
			energy: 878
		},
		{
			id: 92,
			elementType: 'G4_U',
			density: 18.95,
			energy: 890
		},
		{
			id: 93,
			elementType: 'G4_Np',
			density: 20.25,
			energy: 902
		},
		{
			id: 94,
			elementType: 'G4_Pu',
			density: 19.84,
			energy: 921
		},
		{
			id: 95,
			elementType: 'G4_Am',
			density: 13.67,
			energy: 934
		},
		{
			id: 96,
			elementType: 'G4_Cm',
			density: 13.51,
			energy: 939
		},
		{
			id: 97,
			elementType: 'G4_Bk',
			density: 14,
			energy: 952
		},
		{
			id: 98,
			elementType: 'G4_Cf',
			density: 10,
			energy: 966
		},


		//NIST Compounds

		{
			id: 99,
			elementType: 'G4_A-150_TISSUE',
			density: 1.127,
			energy: 65.1
		},
		{
			id: 100,
			elementType: 'G4_ACETONE',
			density: 0.7899,
			energy: 64.2
		},
		{
			id: 101,
			elementType: 'G4_ACETYLENE',
			density: 0.0010967,
			energy: 58.2
		},
		{
			id: 102,
			elementType: 'G4_ADENINE',
			density: 1.6,
			energy: 71.4
		},
		{
			id: 103,
			elementType: 'G4_ADIPOSE_TISSUE_ICRP',
			density: 0.95,
			energy: 63.2
		},
		{
			id: 104,
			elementType: 'G4_AIR',
			density: 0.00120479,
			energy: 85.7
		},
		{
			id: 105,
			elementType: 'G4_ALANINE',
			density: 1.42,
			energy: 71.9
		},
		{
			id: 106,
			elementType: 'G4_ALUMINUM_OXIDE',
			density: 3.97,
			energy: 145.2
		},
		{
			id: 107,
			elementType: 'G4_AMBER',
			density: 1.1,
			energy: 63.2
		},
		{
			id: 108,
			elementType: 'G4_AMMONIA',
			density: 0.000826019,
			energy: 53.7
		},
		{
			id: 109,
			elementType: 'G4_ANILINE',
			density: 1.0235,
			energy: 66.2
		},
		{
			id: 110,
			elementType: 'G4_ANTHRACENE',
			density: 1.283,
			energy: 69.5
		},
		{
			id: 111,
			elementType: 'G4_B-100_BONE',
			density: 1.45,
			energy: 85.9
		},
		{
			id: 112,
			elementType: 'G4_BAKELITE',
			density: 1.25,
			energy: 72.4
		},
		{
			id: 113,
			elementType: 'G4_BARIUM_FLUORIDE',
			density: 4.89,
			energy: 375.9
		},
		{
			id: 114,
			elementType: 'G4_BARIUM_SULFATE',
			density: 4.5,
			energy: 285.7
		},
		{
			id: 115,
			elementType: 'G4_BENZENE',
			density: 0.87865,
			energy: 63.4
		},
		{
			id: 116,
			elementType: 'G4_BERYLLIUM_OXIDE',
			density: 3.01,
			energy: 93.2
		},
		{
			id: 117,
			elementType: 'G4_BGO',
			density: 7.13,
			energy: 534.1
		},
		{
			id: 118,
			elementType: 'G4_BLOOD_ICRP',
			density: 1.06,
			energy: 75.2
		},
		{
			id: 119,
			elementType: 'G4_BONE_COMPACT_ICRU',
			density: 1.85,
			energy: 91.9
		},
		{
			id: 120,
			elementType: 'G4_BONE_CORTICAL_ICRP',
			density: 1.92,
			energy: 110
		},
		{
			id: 121,
			elementType: 'G4_BORON_CARBIDE',
			density: 2.52,
			energy: 84.7
		},
		{
			id: 122,
			elementType: 'G4_BORON_OXIDE',
			density: 1.812,
			energy: 99.6
		},
		{
			id: 123,
			elementType: 'G4_BRAIN_ICRP',
			density: 1.04,
			energy: 73.3
		},
		{
			id: 124,
			elementType: 'G4_BUTANE',
			density: 0.00249343,
			energy: 48.3
		},
		{
			id: 125,
			elementType: 'G4_N-BUTYL_ALCOHOL',
			density: 0.8098,
			energy: 59.9
		},
		{
			id: 126,
			elementType: 'G4_C-552',
			density: 1.76,
			energy: 86.8
		},
		{
			id: 127,
			elementType: 'G4_CADMIUM_TELLURIDE',
			density: 6.2,
			energy: 539.3
		},
		{
			id: 128,
			elementType: 'G4_CADMIUM_TUNGSTATE',
			density: 7.9,
			energy: 468.3
		},
		{
			id: 129,
			elementType: 'G4_CALCIUM_CARBONATE',
			density: 2.8,
			energy: 136.4
		},
		{
			id: 130,
			elementType: 'G4_CALCIUM_FLUORIDE',
			density: 3.18,
			energy: 166
		},
		{
			id: 131,
			elementType: 'G4_CALCIUM_OXIDE',
			density: 3.3,
			energy: 176.1
		},
		{
			id: 132,
			elementType: 'G4_CALCIUM_OXIDE',
			density: 3.3,
			energy: 176.1
		},
		{
			id: 133,
			elementType: 'G4_CALCIUM_SULFATE',
			density: 2.96,
			energy: 152.3
		},
		{
			id: 134,
			elementType: 'G4_CALCIUM_TUNGSTATE',
			density: 6.062,
			energy: 395
		},
		{
			id: 135,
			elementType: 'G4_CARBON_DIOXIDE',
			density: 0.00184212,
			energy: 85
		},
		{
			id: 136,
			elementType: 'G4_CARBON_TETRACHLORIDE',
			density: 1.594,
			energy: 166.3
		},
		{
			id: 137,
			elementType: 'G4_CELLULOSE_CELLOPHANE',
			density: 1.42,
			energy: 77.6
		},
		{
			id: 138,
			elementType: 'G4_CELLULOSE_BUTRATE',
			density: 1.2,
			energy: 74.6
		},
		{
			id: 139,
			elementType: 'G4_CELLULOSE_NITRATE',
			density: 1.49,
			energy: 87
		},
		{
			id: 140,
			elementType: 'G4_CERIC_SULFATE',
			density: 1.03,
			energy: 76.7
		},
		{
			id: 141,
			elementType: 'G4_CESIUM_FLUORIDE',
			density: 4.115,
			energy: 440.7
		},
		{
			id: 142,
			elementType: 'G4_CESIUM_IODIDE',
			density: 4.51,
			energy: 553.1
		},
		{
			id: 143,
			elementType: 'G4_CHLOROBENZENE',
			density: 1.1058,
			energy: 89.1
		},
		{
			id: 144,
			elementType: 'G4_CHLOROFORM',
			density: 1.4832,
			energy: 156
		},
		{
			id: 145,
			elementType: 'G4_CONCRETE',
			density: 2.3,
			energy: 135.2
		},
		{
			id: 146,
			elementType: 'G4_CYCLOHEXANE',
			density: 0.779,
			energy: 56.4
		},
		{
			id: 147,
			elementType: 'G4_l,2-DICHLOROBENZENE',
			density: 1.3048,
			energy: 106.5
		},
		{
			id: 148,
			elementType: 'G4_DICHLORODIETHYL_ETHER',
			density: 1.2199,
			energy: 103.3
		},
		{
			id: 149,
			elementType: 'G4_l,2-DICHLOROETHANE',
			density: 1.2351,
			energy: 111.9
		},
		{
			id: 150,
			elementType: 'G4_DIETHYL_ETHER',
			density: 0.71378,
			energy: 60
		},
		{
			id: 151,
			elementType: 'G4_N,N-DIMETHYL_FORMAMIDE',
			density: 0.9487,
			energy: 66.6
		},
		{
			id: 152,
			elementType: 'G4_DIMETHYL_SULFOXIDE',
			density: 1.1014,
			energy: 98.6
		},
		{
			id: 153,
			elementType: 'G4_ETHANE',
			density: 0.00125324,
			energy: 45.4
		},
		{
			id: 154,
			elementType: 'G4_ETHYL_ALCOHOL',
			density: 0.7893,
			energy: 62.9
		},
		{
			id: 155,
			elementType: 'G4_ETHYL_CELLULOSE',
			density: 1.13,
			energy: 69.3
		},
		{
			id: 156,
			elementType: 'G4_ETHYLENE',
			density: 0.00117497,
			energy: 50.7
		},
		{
			id: 157,
			elementType: 'G4_EYE_LENS_ICRP',
			density: 1.07,
			energy: 73.3
		},
		{
			id: 158,
			elementType: 'G4_FERRIC_OXIDE',
			density: 5.2,
			energy: 227.3
		},
		{
			id: 159,
			elementType: 'G4_FERROBORIDE',
			density: 7.15,
			energy: 261
		},
		{
			id: 160,
			elementType: 'G4_FERROUS_OXIDE',
			density: 5.7,
			energy: 248.6
		},
		{
			id: 161,
			elementType: 'G4_FERROUS_SULFATE',
			density: 1.024,
			energy: 76.4
		},
		{
			id: 162,
			elementType: 'G4_FREON-12',
			density: 1.12,
			energy: 143
		},
		{
			id: 163,
			elementType: 'G4_FREON-12B2',
			density: 1.8,
			energy: 284.9
		},
		{
			id: 164,
			elementType: 'G4_FREON-13',
			density: 0.95,
			energy: 126.6
		},
		{
			id: 165,
			elementType: 'G4_FREON-13B1',
			density: 1.5,
			energy: 210.5
		},
		{
			id: 166,
			elementType: 'G4_FREON-13I1',
			density: 1.8,
			energy: 293.5
		},
		{
			id: 167,
			elementType: 'G4_GADOLINIUM_OXYSULFIDE',
			density: 7.44,
			energy: 493.3
		},
		{
			id: 168,
			elementType: 'G4_GALLIUM_ARSENIDE',
			density: 5.31,
			energy: 384.9
		},
		{
			id: 169,
			elementType: 'G4_GEL_PHOTO_EMULSION',
			density: 1.2914,
			energy: 74.8
		},
		{
			id: 170,
			elementType: 'G4_Pyrex_Glass',
			density: 2.23,
			energy: 134
		},
		{
			id: 171,
			elementType: 'G4_GLASS_LEAD',
			density: 6.22,
			energy: 526.4
		},
		{
			id: 172,
			elementType: 'G4_GLASS_PLATE',
			density: 2.4,
			energy: 145.4
		},
		{
			id: 173,
			elementType: 'G4_GLUTAMINE',
			density: 1.46,
			energy: 73.3
		},
		{
			id: 174,
			elementType: 'G4_GLYCEROL',
			density: 1.2613,
			energy: 72.6
		},
		{
			id: 175,
			elementType: 'G4_GUANINE',
			density: 2.2,
			energy: 75
		},
		{
			id: 176,
			elementType: 'G4_GUPSUM',
			density: 2.32,
			energy: 129.7
		},
		{
			id: 177,
			elementType: 'G4_N-HEPTANE',
			density: 0.68376,
			energy: 54.4
		},
		{
			id: 178,
			elementType: 'G4_N-HEXANE',
			density: 0.6603,
			energy: 54
		},
		{
			id: 179,
			elementType: 'G4_KAPTON',
			density: 1.42,
			energy: 79.6
		},
		{
			id: 180,
			elementType: 'G4_LANTHANUM_OXYBROMIDE',
			density: 6.28,
			energy: 439.7
		},
		{
			id: 181,
			elementType: 'G4_LANTHANUM_OXYSULFIDE',
			density: 5.86,
			energy: 421.2
		},
		{
			id: 182,
			elementType: 'G4_LEAD_OXIDE',
			density: 9.53,
			energy: 766.7
		},
		{
			id: 183,
			elementType: 'G4_LITHIUM_AMIDE',
			density: 1.178,
			energy: 55.5
		},
		{
			id: 184,
			elementType: 'G4_LITHIUM_CARBONATE',
			density: 2.11,
			energy: 87.9
		},
		{
			id: 185,
			elementType: 'G4_LITHIUM_FLUORIDE',
			density: 2.635,
			energy: 94
		},
		{
			id: 186,
			elementType: 'G4_LITHIUM_HYDRIDE',
			density: 0.82,
			energy: 36.5
		},
		{
			id: 187,
			elementType: 'G4_LITHIUM_IODIDE',
			density: 3.494,
			energy: 485.1
		},
		{
			id: 188,
			elementType: 'G4_LITHIUM_OXIDE',
			density: 2.013,
			energy: 73.6
		},
		{
			id: 189,
			elementType: 'G4_LITHIUM_TETRABORATE',
			density: 2.44,
			energy: 94.6
		},
		{
			id: 190,
			elementType: 'G4_LUNG_ICRP',
			density: 1.04,
			energy: 75.3
		},
		{
			id: 191,
			elementType: 'G4_M3_WAX',
			density: 1.05,
			energy: 67.9
		},
		{
			id: 192,
			elementType: 'G4_MAGNESIUM_CARBONATE',
			density: 2.958,
			energy: 118
		},
		{
			id: 193,
			elementType: 'G4_MAGNESIUM_FLUORIDE',
			density: 3,
			energy: 134.3
		},
		{
			id: 194,
			elementType: 'G4_MAGNESIUM_OXIDE',
			density: 3.58,
			energy: 143.8
		},
		{
			id: 195,
			elementType: 'G4_MAGNESIUM_TETRABORATE',
			density: 2.53,
			energy: 108.3
		},
		{
			id: 196,
			elementType: 'G4_MERCURIC_IODIDE',
			density: 6.36,
			energy: 684.5
		},
		{
			id: 197,
			elementType: 'G4_METHANE',
			density: 0.000667151,
			energy: 41.7
		},
		{
			id: 198,
			elementType: 'G4_METHANOL',
			density: 0.7914,
			energy: 67.6
		},
		{
			id: 199,
			elementType: 'G4_MIX_D_WAX',
			density: 0.99,
			energy: 60.9
		},
		{
			id: 200,
			elementType: 'G4_MS20_TISSUE',
			density: 1,
			energy: 75.1
		},
		{
			id: 201,
			elementType: 'G4_MUSCLE_SKELETAL_ICRP',
			density: 1.05,
			energy: 75.3
		},
		{
			id: 202,
			elementType: 'G4_MUSCLE_STRIATED_ICRU',
			density: 1.04,
			energy: 74.7
		},
		{
			id: 203,
			elementType: 'G4_MUSCLE_WITHOUT_SUCROSE',
			density: 10.7,
			energy: 74.2
		},
		{
			id: 204,
			elementType: 'G4_NAPHTHALENE',
			density: 1.145,
			energy: 68.4
		},
		{
			id: 205,
			elementType: 'G4_NITROBENZENE',
			density: 1.19867,
			energy: 75.8
		},
		{
			id: 206,
			elementType: 'G4_NITROUS_OXIDE',
			density: 0.00183094,
			energy: 84.9
		},
		{
			id: 207,
			elementType: 'G4_NYLON-8062',
			density: 1.08,
			energy: 64.3
		},
		{
			id: 208,
			elementType: 'G4_NYLON-6-6',
			density: 1.14,
			energy: 63.9
		},
		{
			id: 209,
			elementType: 'G4_NYLON-6-10',
			density: 1.14,
			energy: 63.2
		},
		{
			id: 210,
			elementType: 'G4_NYLON-11_RILSAN',
			density: 1.425,
			energy: 61.6
		},
		{
			id: 211,
			elementType: 'G4_OCTANE',
			density: 0.7026,
			energy: 54.7
		},
		{
			id: 212,
			elementType: 'G4_PARAFFIN',
			density: 0.93,
			energy: 55.9
		},
		{
			id: 213,
			elementType: 'G4_N-PENTANE',
			density: 0.6262,
			energy: 53.6
		},
		{
			id: 214,
			elementType: 'G4_PHOTO_EMULSION',
			density: 3.815,
			energy: 331
		},
		{
			id: 215,
			elementType: 'G4_PLASTIC_SC_VINYLTOLUENE',
			density: 1.032,
			energy: 64.7
		},
		{
			id: 216,
			elementType: 'G4_PLUTONIUM_DIOXIDE',
			density: 11.46,
			energy: 746.5
		},
		{
			id: 217,
			elementType: 'G4_POLYACRYLONITRILE',
			density: 1.17,
			energy: 69.6
		},
		{
			id: 218,
			elementType: 'G4_POLYCARBONATE',
			density: 1.2,
			energy: 73.1
		},
		{
			id: 219,
			elementType: 'G4_POLYCHLOROSTYRENE',
			density: 1.3,
			energy: 81.7
		},
		{
			id: 220,
			elementType: 'G4_POLYETHYLENE',
			density: 0.94,
			energy: 57.4
		},
		{
			id: 221,
			elementType: 'G4_MYLAR',
			density: 1.4,
			energy: 78.7
		},
		{
			id: 222,
			elementType: 'G4_PLEXIGLASS',
			density: 1.19,
			energy: 74
		},
		{
			id: 223,
			elementType: 'G4_MYLAR',
			density: 1.4,
			energy: 78.7
		},
		{
			id: 224,
			elementType: 'G4_PLEXIGLASS',
			density: 1.19,
			energy: 74
		},
		{
			id: 225,
			elementType: 'G4_POLYXYMETHYLENE',
			density: 1.425,
			energy: 77.4
		},
		{
			id: 226,
			elementType: 'G4_POLYPROPYLENE',
			density: 0.9,
			energy: 56.5
		},
		{
			id: 227,
			elementType: 'G4_POLYSTYRENE',
			density: 1.06,
			energy: 68.7
		},
		{
			id: 228,
			elementType: 'G4_TEFLON',
			density: 2.2,
			energy: 99.1
		},
		{
			id: 229,
			elementType: 'G4_POLYTRIFLUOROCHLOROETHYLENE',
			density: 2.1,
			energy: 120.7
		},
		{
			id: 230,
			elementType: 'G4_POLYVINYL_ACETATE',
			density: 1.19,
			energy: 73.7
		},
		{
			id: 231,
			elementType: 'G4_POLYVINYL_ALCOHOL',
			density: 1.3,
			energy: 69.7
		},
		{
			id: 232,
			elementType: 'G4_POLYVINYL_BUTYRAL',
			density: 1.12,
			energy: 67.2
		},
		{
			id: 233,
			elementType: 'G4_POLYVINYL_CHLORIDE',
			density: 1.3,
			energy: 108.2
		},
		{
			id: 234,
			elementType: 'G4_POLYVINYLIDENE_CHLORIDE',
			density: 1.7,
			energy: 134.3
		},
		{
			id: 235,
			elementType: 'G4_POLYVINYLIDENE_FLUORIDE',
			density: 1.76,
			energy: 88.8
		},
		{
			id: 236,
			elementType: 'G4_POLYVINYL_PYRROLIDONE',
			density: 1.25,
			energy: 67.7
		},
		{
			id: 237,
			elementType: 'G4_POTASSIUM_IODIDE',
			density: 3.13,
			energy: 431.9
		},
		{
			id: 238,
			elementType: 'G4_POTASSIUM_OXIDE',
			density: 2.32,
			energy: 189.9
		},
		{
			id: 239,
			elementType: 'G4_PROPANE',
			density: 0.00187939,
			energy: 47.1
		},
		{
			id: 240,
			elementType: 'G4_lPROPANE',
			density: 0.43,
			energy: 52
		},
		{
			id: 241,
			elementType: 'G4_N-PROPYL_ALCOHOL',
			density: 0.8035,
			energy: 61.1
		},
		{
			id: 242,
			elementType: 'G4_PYRIDINE',
			density: 0.9819,
			energy: 66.2
		},
		{
			id: 243,
			elementType: 'G4_RUBBER_BUTYL',
			density: 0.92,
			energy: 59.8
		},
		{
			id: 244,
			elementType: 'G4_RUBBER_NEOPRENE',
			density: 1.23,
			energy: 93
		},
		{
			id: 245,
			elementType: 'G4_SILICON_DIOXIDE',
			density: 2.32,
			energy: 139.2
		},
		{
			id: 246,
			elementType: 'G4_SILVER_BROMIDE',
			density: 6.473,
			energy: 486.6
		},
		{
			id: 247,
			elementType: 'G4_SILVER_CHLORIDE',
			density: 5.56,
			energy: 398.4
		},
		{
			id: 248,
			elementType: 'G4_SILVER_HALIDES',
			density: 6.47,
			energy: 487.1
		},
		{
			id: 249,
			elementType: 'G4_SILVER_IODIDE',
			density: 6.01,
			energy: 543.5
		},
		{
			id: 250,
			elementType: 'G4_SKIN_ICRP',
			density: 1.09,
			energy: 72.7
		},
		{
			id: 251,
			elementType: 'G4_SODIUM_CARBONATE',
			density: 2.532,
			energy: 125
		},
		{
			id: 252,
			elementType: 'G4_SODIUM_IODIDE',
			density: 3.667,
			energy: 452
		},
		{
			id: 253,
			elementType: 'G4_SODIUM_MONOXIDE',
			density: 2.27,
			energy: 148.8
		},
		{
			id: 254,
			elementType: 'G4_SODIUM_NITRATE',
			density: 2.261,
			energy: 114.6
		},
		{
			id: 255,
			elementType: 'G4_STILBENE',
			density: 0.9707,
			energy: 67.7
		},
		{
			id: 256,
			elementType: 'G4_SUCROSE',
			density: 1.5805,
			energy: 77.5
		},
		{
			id: 257,
			elementType: 'G4_TERPHENYL',
			density: 1.24,
			energy: 71.7
		},
		{
			id: 258,
			elementType: 'G4_TESTIS_ICRP',
			density: 1.04,
			energy: 75
		},
		{
			id: 259,
			elementType: 'G4_TETRACHLOROETHYLENE',
			density: 1.625,
			energy: 159.2
		},
		{
			id: 260,
			elementType: 'G4_THALLIUM_CHLORIDE',
			density: 7.004,
			energy: 690.3
		},
		{
			id: 261,
			elementType: 'G4_TISSUE_SOFT_ICRP',
			density: 1.03,
			energy: 72.3
		},
		{
			id: 262,
			elementType: 'G4_TISSUE_SOFT_ICRU-4',
			density: 1,
			energy: 74.9
		},
		{
			id: 263,
			elementType: 'G4_TISSUE-METHANE',
			density: 0.00106409,
			energy: 61.2
		},
		{
			id: 264,
			elementType: 'G4_TISSUE-PROPANE',
			density: 0.00182628,
			energy: 59.5
		},
		{
			id: 265,
			elementType: 'G4_TITANIUM_DIOXIDE',
			density: 4.26,
			energy: 179.5
		},
		{
			id: 266,
			elementType: 'G4_TOLUENE',
			density: 0.8669,
			energy: 62.5
		},
		{
			id: 267,
			elementType: 'G4_TRICHLOROETHYLENE',
			density: 1.46,
			energy: 148.1
		},
		{
			id: 268,
			elementType: 'G4_TRIETHYL_PHOSPHATE',
			density: 1.07,
			energy: 81.2
		},
		{
			id: 269,
			elementType: 'G4_TUNGSTEN_HEXAFLUORIDE',
			density: 2.4,
			energy: 354.4
		},
		{
			id: 270,
			elementType: 'G4_URANIUM_DICARBIDE',
			density: 11.28,
			energy: 752
		},
		{
			id: 271,
			elementType: 'G4_URANIUM_MONOCARBIDE',
			density: 13.63,
			energy: 862
		},
		{
			id: 272,
			elementType: 'G4_URANIUM_OXIDE',
			density: 10.96,
			energy: 720.6
		},
		{
			id: 273,
			elementType: 'G4_UREA',
			density: 1.323,
			energy: 72.8
		},
		{
			id: 274,
			elementType: 'G4_VALINE',
			density: 1.23,
			energy: 67.7
		},
		{
			id: 275,
			elementType: 'G4_VITON',
			density: 1.8,
			energy: 98.6
		},
		{
			id: 276,
			elementType: 'G4_WATER',
			density: 1,
			energy: 78
		},
		{
			id: 277,
			elementType: 'G4_WATER_VAPOR',
			density: 0.000756182,
			energy: 71.6
		},
		{
			id: 278,
			elementType: 'G4_XYLENE',
			density: 0.87,
			energy: 61.8
		},
		{
			id: 279,
			elementType: 'G4_GRAPHITE',
			density: 2.21,
			energy: 78
		},

		//HEP and Nuclear Materials

		{
			id: 280,
			elementType: 'G4_lH2',
			density: 0.0708,
			energy: 21.8
		},
		{
			id: 281,
			elementType: 'G4_lN2',
			density: 0.807,
			energy: 21.8
		},
		{
			id: 282,
			elementType: 'G4_lO2',
			density: 1.141,
			energy: 95
		},
		{
			id: 283,
			elementType: 'G4_lAr',
			density: 1.1396,
			energy: 188
		},
		{
			id: 284,
			elementType: 'G4_lBr',
			density: 3.1028,
			energy: 343
		},
		{
			id: 285,
			elementType: 'G4_lKr',
			density: 2.418,
			energy: 352
		},
		{
			id: 286,
			elementType: 'G4_lXe',
			density: 2.953,
			energy: 482
		},
		{
			id: 287,
			elementType: 'G4_PbWO4',
			density: 8.28,
			energy: 0
		},
		{
			id: 288,
			elementType: 'G4_Galactic',
			density: 1e-25,
			energy: 21.8
		},
		{
			id: 289,
			elementType: 'G4_GRAPHITE_POROUS',
			density: 1.7,
			energy: 78
		},
		{
			id: 290,
			elementType: 'G4_LUCITE',
			density: 1.19,
			energy: 74
		},
		{
			id: 291,
			elementType: 'G4_BRASS',
			density: 8.52,
			energy: 0
		},
		{
			id: 292,
			elementType: 'G4_BRONZE',
			density: 8.82,
			energy: 0
		},
		{
			id: 293,
			elementType: 'G4_STAINLESS-STEEL',
			density: 8,
			energy: 0
		},
		{
			id: 294,
			elementType: 'G4_CR39',
			density: 1.32,
			energy: 0
		},
		{
			id: 295,
			elementType: 'G4_OCTADECANOL',
			density: 0.812,
			energy: 0
		},


		//Space (ISS) Materials

		{
			id: 296,
			elementType: 'G4_KEVLAR',
			density: 1.44,
			energy: 0
		},
		{
			id: 297,
			elementType: 'G4_DACRON',
			density: 1.4,
			energy: 0
		},
		{
			id: 298,
			elementType: 'G4_NEOPRENE',
			density: 1.23,
			energy: 0
		},

		//Bio-Chemical Materials

		{
			id: 299,
			elementType: 'G4_CYTOSINE',
			density: 1.55,
			energy: 72
		},
		{
			id: 300,
			elementType: 'G4_THYMINE',
			density: 1.23,
			energy: 72
		},
		{
			id: 301,
			elementType: 'G4_URACIL',
			density: 1.32,
			energy: 72
		},
		{
			id: 302,
			elementType: 'G4_DNA_ADENITE',
			density: 1,
			energy: 72
		},
		{
			id: 303,
			elementType: 'G4_DNA_GUANINE',
			density: 1,
			energy: 72
		},
		{
			id: 304,
			elementType: 'G4_DNA_CYTOSINE',
			density: 1,
			energy: 72
		},
		{
			id: 305,
			elementType: 'G4_DNA_THYMINE',
			density: 1,
			energy: 72
		},
		{
			id: 306,
			elementType: 'G4_DNA_URACIL',
			density: 1,
			energy: 72
		},
		{
			id: 307,
			elementType: 'G4_DNA_ADENOSINE',
			density: 1,
			energy: 72
		},
		{
			id: 308,
			elementType: 'G4_DNA_GUANOSINE',
			density: 1,
			energy: 72
		},
		{
			id: 309,
			elementType: 'G4_DNA_CYTIDINE',
			density: 1,
			energy: 72
		},
		{
			id: 310,
			elementType: 'G4_DNA_URIDINE',
			density: 1,
			energy: 72
		},
		{
			id: 311,
			elementType: 'G4_DNA_METHYLURIDINE',
			density: 1,
			energy: 72
		},
		{
			id: 312,
			elementType: 'G4_DNA_MONOPHOSPHATE',
			density: 1,
			energy: 72
		},
		{
			id: 313,
			elementType: 'G4_DNA_A',
			density: 1,
			energy: 72
		},
		{
			id: 314,
			elementType: 'G4_DNA_G',
			density: 1,
			energy: 72
		},
		{
			id: 315,
			elementType: 'G4_DNA_C',
			density: 1,
			energy: 72
		},
		{
			id: 316,
			elementType: 'G4_DNA_U',
			density: 1,
			energy: 72
		},
		{
			id: 317,
			elementType: 'G4_DNA_MU',
			density: 1,
			energy: 72
		}
	]

const compoundMaterialOptions = [

	{
		id: 99,
		elementType: 'G4_A-150_TISSUE',
		density: 1.127,
		energy: 65.1
	},
	{
		id: 100,
		elementType: 'G4_ACETONE',
		density: 0.7899,
		energy: 64.2
	},
	{
		id: 101,
		elementType: 'G4_ACETYLENE',
		density: 0.0010967,
		energy: 58.2
	},
	{
		id: 102,
		elementType: 'G4_ADENINE',
		density: 1.6,
		energy: 71.4
	},
	{
		id: 103,
		elementType: 'G4_ADIPOSE_TISSUE_ICRP',
		density: 0.95,
		energy: 63.2
	},
	{
		id: 104,
		elementType: 'G4_AIR',
		density: 0.00120479,
		energy: 85.7
	},
	{
		id: 105,
		elementType: 'G4_ALANINE',
		density: 1.42,
		energy: 71.9
	},
	{
		id: 106,
		elementType: 'G4_ALUMINUM_OXIDE',
		density: 3.97,
		energy: 145.2
	},
	{
		id: 107,
		elementType: 'G4_AMBER',
		density: 1.1,
		energy: 63.2
	},
	{
		id: 108,
		elementType: 'G4_AMMONIA',
		density: 0.000826019,
		energy: 53.7
	},
	{
		id: 109,
		elementType: 'G4_ANILINE',
		density: 1.0235,
		energy: 66.2
	},
	{
		id: 110,
		elementType: 'G4_ANTHRACENE',
		density: 1.283,
		energy: 69.5
	},
	{
		id: 111,
		elementType: 'G4_B-100_BONE',
		density: 1.45,
		energy: 85.9
	},
	{
		id: 112,
		elementType: 'G4_BAKELITE',
		density: 1.25,
		energy: 72.4
	},
	{
		id: 113,
		elementType: 'G4_BARIUM_FLUORIDE',
		density: 4.89,
		energy: 375.9
	},
	{
		id: 114,
		elementType: 'G4_BARIUM_SULFATE',
		density: 4.5,
		energy: 285.7
	},
	{
		id: 115,
		elementType: 'G4_BENZENE',
		density: 0.87865,
		energy: 63.4
	},
	{
		id: 116,
		elementType: 'G4_BERYLLIUM_OXIDE',
		density: 3.01,
		energy: 93.2
	},
	{
		id: 117,
		elementType: 'G4_BGO',
		density: 7.13,
		energy: 534.1
	},
	{
		id: 118,
		elementType: 'G4_BLOOD_ICRP',
		density: 1.06,
		energy: 75.2
	},
	{
		id: 119,
		elementType: 'G4_BONE_COMPACT_ICRU',
		density: 1.85,
		energy: 91.9
	},
	{
		id: 120,
		elementType: 'G4_BONE_CORTICAL_ICRP',
		density: 1.92,
		energy: 110
	},
	{
		id: 121,
		elementType: 'G4_BORON_CARBIDE',
		density: 2.52,
		energy: 84.7
	},
	{
		id: 122,
		elementType: 'G4_BORON_OXIDE',
		density: 1.812,
		energy: 99.6
	},
	{
		id: 123,
		elementType: 'G4_BRAIN_ICRP',
		density: 1.04,
		energy: 73.3
	},
	{
		id: 124,
		elementType: 'G4_BUTANE',
		density: 0.00249343,
		energy: 48.3
	},
	{
		id: 125,
		elementType: 'G4_N-BUTYL_ALCOHOL',
		density: 0.8098,
		energy: 59.9
	},
	{
		id: 126,
		elementType: 'G4_C-552',
		density: 1.76,
		energy: 86.8
	},
	{
		id: 127,
		elementType: 'G4_CADMIUM_TELLURIDE',
		density: 6.2,
		energy: 539.3
	},
	{
		id: 128,
		elementType: 'G4_CADMIUM_TUNGSTATE',
		density: 7.9,
		energy: 468.3
	},
	{
		id: 129,
		elementType: 'G4_CALCIUM_CARBONATE',
		density: 2.8,
		energy: 136.4
	},
	{
		id: 130,
		elementType: 'G4_CALCIUM_FLUORIDE',
		density: 3.18,
		energy: 166
	},
	{
		id: 131,
		elementType: 'G4_CALCIUM_OXIDE',
		density: 3.3,
		energy: 176.1
	},
	{
		id: 132,
		elementType: 'G4_CALCIUM_OXIDE',
		density: 3.3,
		energy: 176.1
	},
	{
		id: 133,
		elementType: 'G4_CALCIUM_SULFATE',
		density: 2.96,
		energy: 152.3
	},
	{
		id: 134,
		elementType: 'G4_CALCIUM_TUNGSTATE',
		density: 6.062,
		energy: 395
	},
	{
		id: 135,
		elementType: 'G4_CARBON_DIOXIDE',
		density: 0.00184212,
		energy: 85
	},
	{
		id: 136,
		elementType: 'G4_CARBON_TETRACHLORIDE',
		density: 1.594,
		energy: 166.3
	},
	{
		id: 137,
		elementType: 'G4_CELLULOSE_CELLOPHANE',
		density: 1.42,
		energy: 77.6
	},
	{
		id: 138,
		elementType: 'G4_CELLULOSE_BUTRATE',
		density: 1.2,
		energy: 74.6
	},
	{
		id: 139,
		elementType: 'G4_CELLULOSE_NITRATE',
		density: 1.49,
		energy: 87
	},
	{
		id: 140,
		elementType: 'G4_CERIC_SULFATE',
		density: 1.03,
		energy: 76.7
	},
	{
		id: 141,
		elementType: 'G4_CESIUM_FLUORIDE',
		density: 4.115,
		energy: 440.7
	},
	{
		id: 142,
		elementType: 'G4_CESIUM_IODIDE',
		density: 4.51,
		energy: 553.1
	},
	{
		id: 143,
		elementType: 'G4_CHLOROBENZENE',
		density: 1.1058,
		energy: 89.1
	},
	{
		id: 144,
		elementType: 'G4_CHLOROFORM',
		density: 1.4832,
		energy: 156
	},
	{
		id: 145,
		elementType: 'G4_CONCRETE',
		density: 2.3,
		energy: 135.2
	},
	{
		id: 146,
		elementType: 'G4_CYCLOHEXANE',
		density: 0.779,
		energy: 56.4
	},
	{
		id: 147,
		elementType: 'G4_l,2-DICHLOROBENZENE',
		density: 1.3048,
		energy: 106.5
	},
	{
		id: 148,
		elementType: 'G4_DICHLORODIETHYL_ETHER',
		density: 1.2199,
		energy: 103.3
	},
	{
		id: 149,
		elementType: 'G4_l,2-DICHLOROETHANE',
		density: 1.2351,
		energy: 111.9
	},
	{
		id: 150,
		elementType: 'G4_DIETHYL_ETHER',
		density: 0.71378,
		energy: 60
	},
	{
		id: 151,
		elementType: 'G4_N,N-DIMETHYL_FORMAMIDE',
		density: 0.9487,
		energy: 66.6
	},
	{
		id: 152,
		elementType: 'G4_DIMETHYL_SULFOXIDE',
		density: 1.1014,
		energy: 98.6
	},
	{
		id: 153,
		elementType: 'G4_ETHANE',
		density: 0.00125324,
		energy: 45.4
	},
	{
		id: 154,
		elementType: 'G4_ETHYL_ALCOHOL',
		density: 0.7893,
		energy: 62.9
	},
	{
		id: 155,
		elementType: 'G4_ETHYL_CELLULOSE',
		density: 1.13,
		energy: 69.3
	},
	{
		id: 156,
		elementType: 'G4_ETHYLENE',
		density: 0.00117497,
		energy: 50.7
	},
	{
		id: 157,
		elementType: 'G4_EYE_LENS_ICRP',
		density: 1.07,
		energy: 73.3
	},
	{
		id: 158,
		elementType: 'G4_FERRIC_OXIDE',
		density: 5.2,
		energy: 227.3
	},
	{
		id: 159,
		elementType: 'G4_FERROBORIDE',
		density: 7.15,
		energy: 261
	},
	{
		id: 160,
		elementType: 'G4_FERROUS_OXIDE',
		density: 5.7,
		energy: 248.6
	},
	{
		id: 161,
		elementType: 'G4_FERROUS_SULFATE',
		density: 1.024,
		energy: 76.4
	},
	{
		id: 162,
		elementType: 'G4_FREON-12',
		density: 1.12,
		energy: 143
	},
	{
		id: 163,
		elementType: 'G4_FREON-12B2',
		density: 1.8,
		energy: 284.9
	},
	{
		id: 164,
		elementType: 'G4_FREON-13',
		density: 0.95,
		energy: 126.6
	},
	{
		id: 165,
		elementType: 'G4_FREON-13B1',
		density: 1.5,
		energy: 210.5
	},
	{
		id: 166,
		elementType: 'G4_FREON-13I1',
		density: 1.8,
		energy: 293.5
	},
	{
		id: 167,
		elementType: 'G4_GADOLINIUM_OXYSULFIDE',
		density: 7.44,
		energy: 493.3
	},
	{
		id: 168,
		elementType: 'G4_GALLIUM_ARSENIDE',
		density: 5.31,
		energy: 384.9
	},
	{
		id: 169,
		elementType: 'G4_GEL_PHOTO_EMULSION',
		density: 1.2914,
		energy: 74.8
	},
	{
		id: 170,
		elementType: 'G4_Pyrex_Glass',
		density: 2.23,
		energy: 134
	},
	{
		id: 171,
		elementType: 'G4_GLASS_LEAD',
		density: 6.22,
		energy: 526.4
	},
	{
		id: 172,
		elementType: 'G4_GLASS_PLATE',
		density: 2.4,
		energy: 145.4
	},
	{
		id: 173,
		elementType: 'G4_GLUTAMINE',
		density: 1.46,
		energy: 73.3
	},
	{
		id: 174,
		elementType: 'G4_GLYCEROL',
		density: 1.2613,
		energy: 72.6
	},
	{
		id: 175,
		elementType: 'G4_GUANINE',
		density: 2.2,
		energy: 75
	},
	{
		id: 176,
		elementType: 'G4_GUPSUM',
		density: 2.32,
		energy: 129.7
	},
	{
		id: 177,
		elementType: 'G4_N-HEPTANE',
		density: 0.68376,
		energy: 54.4
	},
	{
		id: 178,
		elementType: 'G4_N-HEXANE',
		density: 0.6603,
		energy: 54
	},
	{
		id: 179,
		elementType: 'G4_KAPTON',
		density: 1.42,
		energy: 79.6
	},
	{
		id: 180,
		elementType: 'G4_LANTHANUM_OXYBROMIDE',
		density: 6.28,
		energy: 439.7
	},
	{
		id: 181,
		elementType: 'G4_LANTHANUM_OXYSULFIDE',
		density: 5.86,
		energy: 421.2
	},
	{
		id: 182,
		elementType: 'G4_LEAD_OXIDE',
		density: 9.53,
		energy: 766.7
	},
	{
		id: 183,
		elementType: 'G4_LITHIUM_AMIDE',
		density: 1.178,
		energy: 55.5
	},
	{
		id: 184,
		elementType: 'G4_LITHIUM_CARBONATE',
		density: 2.11,
		energy: 87.9
	},
	{
		id: 185,
		elementType: 'G4_LITHIUM_FLUORIDE',
		density: 2.635,
		energy: 94
	},
	{
		id: 186,
		elementType: 'G4_LITHIUM_HYDRIDE',
		density: 0.82,
		energy: 36.5
	},
	{
		id: 187,
		elementType: 'G4_LITHIUM_IODIDE',
		density: 3.494,
		energy: 485.1
	},
	{
		id: 188,
		elementType: 'G4_LITHIUM_OXIDE',
		density: 2.013,
		energy: 73.6
	},
	{
		id: 189,
		elementType: 'G4_LITHIUM_TETRABORATE',
		density: 2.44,
		energy: 94.6
	},
	{
		id: 190,
		elementType: 'G4_LUNG_ICRP',
		density: 1.04,
		energy: 75.3
	},
	{
		id: 191,
		elementType: 'G4_M3_WAX',
		density: 1.05,
		energy: 67.9
	},
	{
		id: 192,
		elementType: 'G4_MAGNESIUM_CARBONATE',
		density: 2.958,
		energy: 118
	},
	{
		id: 193,
		elementType: 'G4_MAGNESIUM_FLUORIDE',
		density: 3,
		energy: 134.3
	},
	{
		id: 194,
		elementType: 'G4_MAGNESIUM_OXIDE',
		density: 3.58,
		energy: 143.8
	},
	{
		id: 195,
		elementType: 'G4_MAGNESIUM_TETRABORATE',
		density: 2.53,
		energy: 108.3
	},
	{
		id: 196,
		elementType: 'G4_MERCURIC_IODIDE',
		density: 6.36,
		energy: 684.5
	},
	{
		id: 197,
		elementType: 'G4_METHANE',
		density: 0.000667151,
		energy: 41.7
	},
	{
		id: 198,
		elementType: 'G4_METHANOL',
		density: 0.7914,
		energy: 67.6
	},
	{
		id: 199,
		elementType: 'G4_MIX_D_WAX',
		density: 0.99,
		energy: 60.9
	},
	{
		id: 200,
		elementType: 'G4_MS20_TISSUE',
		density: 1,
		energy: 75.1
	},
	{
		id: 201,
		elementType: 'G4_MUSCLE_SKELETAL_ICRP',
		density: 1.05,
		energy: 75.3
	},
	{
		id: 202,
		elementType: 'G4_MUSCLE_STRIATED_ICRU',
		density: 1.04,
		energy: 74.7
	},
	{
		id: 203,
		elementType: 'G4_MUSCLE_WITHOUT_SUCROSE',
		density: 10.7,
		energy: 74.2
	},
	{
		id: 204,
		elementType: 'G4_NAPHTHALENE',
		density: 1.145,
		energy: 68.4
	},
	{
		id: 205,
		elementType: 'G4_NITROBENZENE',
		density: 1.19867,
		energy: 75.8
	},
	{
		id: 206,
		elementType: 'G4_NITROUS_OXIDE',
		density: 0.00183094,
		energy: 84.9
	},
	{
		id: 207,
		elementType: 'G4_NYLON-8062',
		density: 1.08,
		energy: 64.3
	},
	{
		id: 208,
		elementType: 'G4_NYLON-6-6',
		density: 1.14,
		energy: 63.9
	},
	{
		id: 209,
		elementType: 'G4_NYLON-6-10',
		density: 1.14,
		energy: 63.2
	},
	{
		id: 210,
		elementType: 'G4_NYLON-11_RILSAN',
		density: 1.425,
		energy: 61.6
	},
	{
		id: 211,
		elementType: 'G4_OCTANE',
		density: 0.7026,
		energy: 54.7
	},
	{
		id: 212,
		elementType: 'G4_PARAFFIN',
		density: 0.93,
		energy: 55.9
	},
	{
		id: 213,
		elementType: 'G4_N-PENTANE',
		density: 0.6262,
		energy: 53.6
	},
	{
		id: 214,
		elementType: 'G4_PHOTO_EMULSION',
		density: 3.815,
		energy: 331
	},
	{
		id: 215,
		elementType: 'G4_PLASTIC_SC_VINYLTOLUENE',
		density: 1.032,
		energy: 64.7
	},
	{
		id: 216,
		elementType: 'G4_PLUTONIUM_DIOXIDE',
		density: 11.46,
		energy: 746.5
	},
	{
		id: 217,
		elementType: 'G4_POLYACRYLONITRILE',
		density: 1.17,
		energy: 69.6
	},
	{
		id: 218,
		elementType: 'G4_POLYCARBONATE',
		density: 1.2,
		energy: 73.1
	},
	{
		id: 219,
		elementType: 'G4_POLYCHLOROSTYRENE',
		density: 1.3,
		energy: 81.7
	},
	{
		id: 220,
		elementType: 'G4_POLYETHYLENE',
		density: 0.94,
		energy: 57.4
	},
	{
		id: 221,
		elementType: 'G4_MYLAR',
		density: 1.4,
		energy: 78.7
	},
	{
		id: 222,
		elementType: 'G4_PLEXIGLASS',
		density: 1.19,
		energy: 74
	},
	{
		id: 223,
		elementType: 'G4_MYLAR',
		density: 1.4,
		energy: 78.7
	},
	{
		id: 224,
		elementType: 'G4_PLEXIGLASS',
		density: 1.19,
		energy: 74
	},
	{
		id: 225,
		elementType: 'G4_POLYXYMETHYLENE',
		density: 1.425,
		energy: 77.4
	},
	{
		id: 226,
		elementType: 'G4_POLYPROPYLENE',
		density: 0.9,
		energy: 56.5
	},
	{
		id: 227,
		elementType: 'G4_POLYSTYRENE',
		density: 1.06,
		energy: 68.7
	},
	{
		id: 228,
		elementType: 'G4_TEFLON',
		density: 2.2,
		energy: 99.1
	},
	{
		id: 229,
		elementType: 'G4_POLYTRIFLUOROCHLOROETHYLENE',
		density: 2.1,
		energy: 120.7
	},
	{
		id: 230,
		elementType: 'G4_POLYVINYL_ACETATE',
		density: 1.19,
		energy: 73.7
	},
	{
		id: 231,
		elementType: 'G4_POLYVINYL_ALCOHOL',
		density: 1.3,
		energy: 69.7
	},
	{
		id: 232,
		elementType: 'G4_POLYVINYL_BUTYRAL',
		density: 1.12,
		energy: 67.2
	},
	{
		id: 233,
		elementType: 'G4_POLYVINYL_CHLORIDE',
		density: 1.3,
		energy: 108.2
	},
	{
		id: 234,
		elementType: 'G4_POLYVINYLIDENE_CHLORIDE',
		density: 1.7,
		energy: 134.3
	},
	{
		id: 235,
		elementType: 'G4_POLYVINYLIDENE_FLUORIDE',
		density: 1.76,
		energy: 88.8
	},
	{
		id: 236,
		elementType: 'G4_POLYVINYL_PYRROLIDONE',
		density: 1.25,
		energy: 67.7
	},
	{
		id: 237,
		elementType: 'G4_POTASSIUM_IODIDE',
		density: 3.13,
		energy: 431.9
	},
	{
		id: 238,
		elementType: 'G4_POTASSIUM_OXIDE',
		density: 2.32,
		energy: 189.9
	},
	{
		id: 239,
		elementType: 'G4_PROPANE',
		density: 0.00187939,
		energy: 47.1
	},
	{
		id: 240,
		elementType: 'G4_lPROPANE',
		density: 0.43,
		energy: 52
	},
	{
		id: 241,
		elementType: 'G4_N-PROPYL_ALCOHOL',
		density: 0.8035,
		energy: 61.1
	},
	{
		id: 242,
		elementType: 'G4_PYRIDINE',
		density: 0.9819,
		energy: 66.2
	},
	{
		id: 243,
		elementType: 'G4_RUBBER_BUTYL',
		density: 0.92,
		energy: 59.8
	},
	{
		id: 244,
		elementType: 'G4_RUBBER_NEOPRENE',
		density: 1.23,
		energy: 93
	},
	{
		id: 245,
		elementType: 'G4_SILICON_DIOXIDE',
		density: 2.32,
		energy: 139.2
	},
	{
		id: 246,
		elementType: 'G4_SILVER_BROMIDE',
		density: 6.473,
		energy: 486.6
	},
	{
		id: 247,
		elementType: 'G4_SILVER_CHLORIDE',
		density: 5.56,
		energy: 398.4
	},
	{
		id: 248,
		elementType: 'G4_SILVER_HALIDES',
		density: 6.47,
		energy: 487.1
	},
	{
		id: 249,
		elementType: 'G4_SILVER_IODIDE',
		density: 6.01,
		energy: 543.5
	},
	{
		id: 250,
		elementType: 'G4_SKIN_ICRP',
		density: 1.09,
		energy: 72.7
	},
	{
		id: 251,
		elementType: 'G4_SODIUM_CARBONATE',
		density: 2.532,
		energy: 125
	},
	{
		id: 252,
		elementType: 'G4_SODIUM_IODIDE',
		density: 3.667,
		energy: 452
	},
	{
		id: 253,
		elementType: 'G4_SODIUM_MONOXIDE',
		density: 2.27,
		energy: 148.8
	},
	{
		id: 254,
		elementType: 'G4_SODIUM_NITRATE',
		density: 2.261,
		energy: 114.6
	},
	{
		id: 255,
		elementType: 'G4_STILBENE',
		density: 0.9707,
		energy: 67.7
	},
	{
		id: 256,
		elementType: 'G4_SUCROSE',
		density: 1.5805,
		energy: 77.5
	},
	{
		id: 257,
		elementType: 'G4_TERPHENYL',
		density: 1.24,
		energy: 71.7
	},
	{
		id: 258,
		elementType: 'G4_TESTIS_ICRP',
		density: 1.04,
		energy: 75
	},
	{
		id: 259,
		elementType: 'G4_TETRACHLOROETHYLENE',
		density: 1.625,
		energy: 159.2
	},
	{
		id: 260,
		elementType: 'G4_THALLIUM_CHLORIDE',
		density: 7.004,
		energy: 690.3
	},
	{
		id: 261,
		elementType: 'G4_TISSUE_SOFT_ICRP',
		density: 1.03,
		energy: 72.3
	},
	{
		id: 262,
		elementType: 'G4_TISSUE_SOFT_ICRU-4',
		density: 1,
		energy: 74.9
	},
	{
		id: 263,
		elementType: 'G4_TISSUE-METHANE',
		density: 0.00106409,
		energy: 61.2
	},
	{
		id: 264,
		elementType: 'G4_TISSUE-PROPANE',
		density: 0.00182628,
		energy: 59.5
	},
	{
		id: 265,
		elementType: 'G4_TITANIUM_DIOXIDE',
		density: 4.26,
		energy: 179.5
	},
	{
		id: 266,
		elementType: 'G4_TOLUENE',
		density: 0.8669,
		energy: 62.5
	},
	{
		id: 267,
		elementType: 'G4_TRICHLOROETHYLENE',
		density: 1.46,
		energy: 148.1
	},
	{
		id: 268,
		elementType: 'G4_TRIETHYL_PHOSPHATE',
		density: 1.07,
		energy: 81.2
	},
	{
		id: 269,
		elementType: 'G4_TUNGSTEN_HEXAFLUORIDE',
		density: 2.4,
		energy: 354.4
	},
	{
		id: 270,
		elementType: 'G4_URANIUM_DICARBIDE',
		density: 11.28,
		energy: 752
	},
	{
		id: 271,
		elementType: 'G4_URANIUM_MONOCARBIDE',
		density: 13.63,
		energy: 862
	},
	{
		id: 272,
		elementType: 'G4_URANIUM_OXIDE',
		density: 10.96,
		energy: 720.6
	},
	{
		id: 273,
		elementType: 'G4_UREA',
		density: 1.323,
		energy: 72.8
	},
	{
		id: 274,
		elementType: 'G4_VALINE',
		density: 1.23,
		energy: 67.7
	},
	{
		id: 275,
		elementType: 'G4_VITON',
		density: 1.8,
		energy: 98.6
	},
	{
		id: 276,
		elementType: 'G4_WATER',
		density: 1,
		energy: 78
	},
	{
		id: 277,
		elementType: 'G4_WATER_VAPOR',
		density: 0.000756182,
		energy: 71.6
	},
	{
		id: 278,
		elementType: 'G4_XYLENE',
		density: 0.87,
		energy: 61.8
	},
	{
		id: 279,
		elementType: 'G4_GRAPHITE',
		density: 2.21,
		energy: 78
	},

	//HEP and Nuclear Materials

	{
		id: 280,
		elementType: 'G4_lH2',
		density: 0.0708,
		energy: 21.8
	},
	{
		id: 281,
		elementType: 'G4_lN2',
		density: 0.807,
		energy: 21.8
	},
	{
		id: 282,
		elementType: 'G4_lO2',
		density: 1.141,
		energy: 95
	},
	{
		id: 283,
		elementType: 'G4_lAr',
		density: 1.1396,
		energy: 188
	},
	{
		id: 284,
		elementType: 'G4_lBr',
		density: 3.1028,
		energy: 343
	},
	{
		id: 285,
		elementType: 'G4_lKr',
		density: 2.418,
		energy: 352
	},
	{
		id: 286,
		elementType: 'G4_lXe',
		density: 2.953,
		energy: 482
	},
	{
		id: 287,
		elementType: 'G4_PbWO4',
		density: 8.28,
		energy: 0
	},
	{
		id: 288,
		elementType: 'G4_Galactic',
		density: 1e-25,
		energy: 21.8
	},
	{
		id: 289,
		elementType: 'G4_GRAPHITE_POROUS',
		density: 1.7,
		energy: 78
	},
	{
		id: 290,
		elementType: 'G4_LUCITE',
		density: 1.19,
		energy: 74
	},
	{
		id: 291,
		elementType: 'G4_BRASS',
		density: 8.52,
		energy: 0
	},
	{
		id: 292,
		elementType: 'G4_BRONZE',
		density: 8.82,
		energy: 0
	},
	{
		id: 293,
		elementType: 'G4_STAINLESS-STEEL',
		density: 8,
		energy: 0
	},
	{
		id: 294,
		elementType: 'G4_CR39',
		density: 1.32,
		energy: 0
	},
	{
		id: 295,
		elementType: 'G4_OCTADECANOL',
		density: 0.812,
		energy: 0
	},


	//Space (ISS) Materials

	{
		id: 296,
		elementType: 'G4_KEVLAR',
		density: 1.44,
		energy: 0
	},
	{
		id: 297,
		elementType: 'G4_DACRON',
		density: 1.4,
		energy: 0
	},
	{
		id: 298,
		elementType: 'G4_NEOPRENE',
		density: 1.23,
		energy: 0
	},

	//Bio-Chemical Materials

	{
		id: 299,
		elementType: 'G4_CYTOSINE',
		density: 1.55,
		energy: 72
	},
	{
		id: 300,
		elementType: 'G4_THYMINE',
		density: 1.23,
		energy: 72
	},
	{
		id: 301,
		elementType: 'G4_URACIL',
		density: 1.32,
		energy: 72
	},
	{
		id: 302,
		elementType: 'G4_DNA_ADENITE',
		density: 1,
		energy: 72
	},
	{
		id: 303,
		elementType: 'G4_DNA_GUANINE',
		density: 1,
		energy: 72
	},
	{
		id: 304,
		elementType: 'G4_DNA_CYTOSINE',
		density: 1,
		energy: 72
	},
	{
		id: 305,
		elementType: 'G4_DNA_THYMINE',
		density: 1,
		energy: 72
	},
	{
		id: 306,
		elementType: 'G4_DNA_URACIL',
		density: 1,
		energy: 72
	},
	{
		id: 307,
		elementType: 'G4_DNA_ADENOSINE',
		density: 1,
		energy: 72
	},
	{
		id: 308,
		elementType: 'G4_DNA_GUANOSINE',
		density: 1,
		energy: 72
	},
	{
		id: 309,
		elementType: 'G4_DNA_CYTIDINE',
		density: 1,
		energy: 72
	},
	{
		id: 310,
		elementType: 'G4_DNA_URIDINE',
		density: 1,
		energy: 72
	},
	{
		id: 311,
		elementType: 'G4_DNA_METHYLURIDINE',
		density: 1,
		energy: 72
	},
	{
		id: 312,
		elementType: 'G4_DNA_MONOPHOSPHATE',
		density: 1,
		energy: 72
	},
	{
		id: 313,
		elementType: 'G4_DNA_A',
		density: 1,
		energy: 72
	},
	{
		id: 314,
		elementType: 'G4_DNA_G',
		density: 1,
		energy: 72
	},
	{
		id: 315,
		elementType: 'G4_DNA_C',
		density: 1,
		energy: 72
	},
	{
		id: 316,
		elementType: 'G4_DNA_U',
		density: 1,
		energy: 72
	},
	{
		id: 317,
		elementType: 'G4_DNA_MU',
		density: 1,
		energy: 72
	}

]

export { SidebarMaterial };
