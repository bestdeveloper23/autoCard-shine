import * as THREE from 'three';

import { UIButton, UIInput, UIPanel, UIRow, UISelect, UIText, UITextArea, UINumber } from './libs/ui.js';

import { SetMaterialCommand } from './commands/SetMaterialCommand.js';
import { SetMaterialValueCommand } from './commands/SetMaterialValueCommand.js';

import { SidebarMaterialBooleanProperty } from './Sidebar.Material.BooleanProperty.js';
import { SidebarMaterialColorProperty } from './Sidebar.Material.ColorProperty.js';
import { SidebarMaterialConstantProperty } from './Sidebar.Material.ConstantProperty.js';
import { SidebarMaterialMapProperty } from './Sidebar.Material.MapProperty.js';
import { SidebarMaterialNumberProperty } from './Sidebar.Material.NumberProperty.js';
import { SidebarMaterialRangeValueProperty } from './Sidebar.Material.RangeValueProperty.js';
import { SidebarMaterialProgram } from './Sidebar.Material.Program.js';

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

	container.add(materialClassRow);

	// uuid

	const materialUUIDRow = new UIRow();
	const materialUUID = new UIInput().setWidth('102px').setFontSize('12px').setDisabled(true);
	const materialUUIDRenew = new UIButton(strings.getKey('sidebar/material/new')).setMarginLeft('7px');
	materialUUIDRenew.onClick(function () {

		materialUUID.setValue(THREE.MathUtils.generateUUID());
		update();

	});

	materialUUIDRow.add(new UIText(strings.getKey('sidebar/material/uuid')).setWidth('90px'));
	materialUUIDRow.add(materialUUID);
	materialUUIDRow.add(materialUUIDRenew);

	container.add(materialUUIDRow);

	// name

	const materialNameRow = new UIRow();
	// const materialName = new UIInput().setWidth( '150px' ).setFontSize( '12px' ).onChange( function () {
	const materialName = new UISelect().setWidth('150px').setFontSize('12px').onChange(onChangeProperty)

	const options = [];
	materialTypeOptions.forEach(element => {
		options.push(element.elementType);
	});

	materialName.setOptions(options);

	materialNameRow.add(new UIText(strings.getKey('sidebar/material/name')).setWidth('90px'));
	materialNameRow.add(materialName);

	container.add(materialNameRow);

	// density

	const densityRow = new UIRow();
	densityRow.add( new UIText(strings.getKey('sidebar/material/density')).setWidth( '90px' ) );

	const materialDensity = new UIText().setWidth( '90px' );
	densityRow.add( materialDensity );
	container.add(densityRow);

	// energy

	const energyRow = new UIRow();
	energyRow.add( new UIText(strings.getKey('sidebar/material/energy')).setWidth( '90px' ) );

	const materialEnergy = new UIText().setWidth( '90px' );
	energyRow.add( materialEnergy );
	container.add(energyRow);
	// program

	const materialProgram = new SidebarMaterialProgram(editor, 'vertexShader');
	container.add(materialProgram);

	// color

	const materialColor = new SidebarMaterialColorProperty(editor, 'color', strings.getKey('sidebar/material/color'));
	container.add(materialColor);

	// specular

	const materialSpecular = new SidebarMaterialColorProperty(editor, 'specular', strings.getKey('sidebar/material/specular'));
	container.add(materialSpecular);

	// shininess

	const materialShininess = new SidebarMaterialNumberProperty(editor, 'shininess', strings.getKey('sidebar/material/shininess'));
	container.add(materialShininess);

	// emissive

	const materialEmissive = new SidebarMaterialColorProperty(editor, 'emissive', strings.getKey('sidebar/material/emissive'));
	container.add(materialEmissive);

	// reflectivity

	const materialReflectivity = new SidebarMaterialNumberProperty(editor, 'reflectivity', strings.getKey('sidebar/material/reflectivity'));
	container.add(materialReflectivity);

	// roughness

	const materialRoughness = new SidebarMaterialNumberProperty(editor, 'roughness', strings.getKey('sidebar/material/roughness'), [0, 1]);
	container.add(materialRoughness);

	// metalness

	const materialMetalness = new SidebarMaterialNumberProperty(editor, 'metalness', strings.getKey('sidebar/material/metalness'), [0, 1]);
	container.add(materialMetalness);

	// clearcoat

	const materialClearcoat = new SidebarMaterialNumberProperty(editor, 'clearcoat', strings.getKey('sidebar/material/clearcoat'), [0, 1]);
	container.add(materialClearcoat);

	// clearcoatRoughness

	const materialClearcoatRoughness = new SidebarMaterialNumberProperty(editor, 'clearcoatRoughness', strings.getKey('sidebar/material/clearcoatroughness'), [0, 1]);
	container.add(materialClearcoatRoughness);

	// iridescence

	const materialIridescence = new SidebarMaterialNumberProperty(editor, 'iridescence', strings.getKey('sidebar/material/iridescence'), [0, 1]);
	container.add(materialIridescence);

	// iridescenceIOR

	const materialIridescenceIOR = new SidebarMaterialNumberProperty(editor, 'iridescenceIOR', strings.getKey('sidebar/material/iridescenceIOR'), [1, 5]);
	container.add(materialIridescenceIOR);

	// iridescenceThicknessMax

	const materialIridescenceThicknessMax = new SidebarMaterialRangeValueProperty(editor, 'iridescenceThicknessRange', strings.getKey('sidebar/material/iridescenceThicknessMax'), false, [0, Infinity], 0, 10, 1, 'nm');
	container.add(materialIridescenceThicknessMax);

	// sheen

	const materialSheen = new SidebarMaterialNumberProperty(editor, 'sheen', strings.getKey('sidebar/material/sheen'), [0, 1]);
	container.add(materialSheen);

	// sheen roughness

	const materialSheenRoughness = new SidebarMaterialNumberProperty(editor, 'sheenRoughness', strings.getKey('sidebar/material/sheenroughness'), [0, 1]);
	container.add(materialSheenRoughness);

	// sheen color

	const materialSheenColor = new SidebarMaterialColorProperty(editor, 'sheenColor', strings.getKey('sidebar/material/sheencolor'));
	container.add(materialSheenColor);

	// transmission

	const materialTransmission = new SidebarMaterialNumberProperty(editor, 'transmission', strings.getKey('sidebar/material/transmission'), [0, 1]);
	container.add(materialTransmission);

	// attenuation distance

	const materialAttenuationDistance = new SidebarMaterialNumberProperty(editor, 'attenuationDistance', strings.getKey('sidebar/material/attenuationDistance'));
	container.add(materialAttenuationDistance);

	// attenuation tint

	const materialAttenuationColor = new SidebarMaterialColorProperty(editor, 'attenuationColor', strings.getKey('sidebar/material/attenuationColor'));
	container.add(materialAttenuationColor);

	// thickness

	const materialThickness = new SidebarMaterialNumberProperty(editor, 'thickness', strings.getKey('sidebar/material/thickness'));
	container.add(materialThickness);

	// vertex colors

	const materialVertexColors = new SidebarMaterialBooleanProperty(editor, 'vertexColors', strings.getKey('sidebar/material/vertexcolors'));
	container.add(materialVertexColors);

	// depth packing

	const materialDepthPackingOptions = {
		[THREE.BasicDepthPacking]: 'Basic',
		[THREE.RGBADepthPacking]: 'RGBA'
	};

	const materialDepthPacking = new SidebarMaterialConstantProperty(editor, 'depthPacking', strings.getKey('sidebar/material/depthPacking'), materialDepthPackingOptions);
	container.add(materialDepthPacking);

	// map

	const materialMap = new SidebarMaterialMapProperty(editor, 'map', strings.getKey('sidebar/material/map'));
	container.add(materialMap);

	// specular map

	const materialSpecularMap = new SidebarMaterialMapProperty(editor, 'specularMap', strings.getKey('sidebar/material/specularmap'));
	container.add(materialSpecularMap);

	// emissive map

	const materialEmissiveMap = new SidebarMaterialMapProperty(editor, 'emissiveMap', strings.getKey('sidebar/material/emissivemap'));
	container.add(materialEmissiveMap);

	// matcap map

	const materialMatcapMap = new SidebarMaterialMapProperty(editor, 'matcap', strings.getKey('sidebar/material/matcap'));
	container.add(materialMatcapMap);

	// alpha map

	const materialAlphaMap = new SidebarMaterialMapProperty(editor, 'alphaMap', strings.getKey('sidebar/material/alphamap'));
	container.add(materialAlphaMap);

	// bump map

	const materialBumpMap = new SidebarMaterialMapProperty(editor, 'bumpMap', strings.getKey('sidebar/material/bumpmap'));
	container.add(materialBumpMap);

	// normal map

	const materialNormalMap = new SidebarMaterialMapProperty(editor, 'normalMap', strings.getKey('sidebar/material/normalmap'));
	container.add(materialNormalMap);

	// clearcoat map

	const materialClearcoatMap = new SidebarMaterialMapProperty(editor, 'clearcoatMap', strings.getKey('sidebar/material/clearcoatmap'));
	container.add(materialClearcoatMap);

	// clearcoat normal map

	const materialClearcoatNormalMap = new SidebarMaterialMapProperty(editor, 'clearcoatNormalMap', strings.getKey('sidebar/material/clearcoatnormalmap'));
	container.add(materialClearcoatNormalMap);

	// clearcoat roughness map

	const materialClearcoatRoughnessMap = new SidebarMaterialMapProperty(editor, 'clearcoatRoughnessMap', strings.getKey('sidebar/material/clearcoatroughnessmap'));
	container.add(materialClearcoatRoughnessMap);

	// displacement map

	const materialDisplacementMap = new SidebarMaterialMapProperty(editor, 'displacementMap', strings.getKey('sidebar/material/displacementmap'));
	container.add(materialDisplacementMap);

	// roughness map

	const materialRoughnessMap = new SidebarMaterialMapProperty(editor, 'roughnessMap', strings.getKey('sidebar/material/roughnessmap'));
	container.add(materialRoughnessMap);

	// metalness map

	const materialMetalnessMap = new SidebarMaterialMapProperty(editor, 'metalnessMap', strings.getKey('sidebar/material/metalnessmap'));
	container.add(materialMetalnessMap);

	// iridescence map

	const materialIridescenceMap = new SidebarMaterialMapProperty(editor, 'iridescenceMap', strings.getKey('sidebar/material/iridescencemap'));
	container.add(materialIridescenceMap);

	// sheen color map

	const materialSheenColorMap = new SidebarMaterialMapProperty(editor, 'sheenColorMap', strings.getKey('sidebar/material/sheencolormap'));
	container.add(materialSheenColorMap);

	// sheen roughness map

	const materialSheenRoughnessMap = new SidebarMaterialMapProperty(editor, 'sheenRoughnessMap', strings.getKey('sidebar/material/sheenroughnessmap'));
	container.add(materialSheenRoughnessMap);

	// iridescence thickness map

	const materialIridescenceThicknessMap = new SidebarMaterialMapProperty(editor, 'iridescenceThicknessMap', strings.getKey('sidebar/material/iridescencethicknessmap'));
	container.add(materialIridescenceThicknessMap);

	// env map

	const materialEnvMap = new SidebarMaterialMapProperty(editor, 'envMap', strings.getKey('sidebar/material/envmap'));
	container.add(materialEnvMap);

	// light map

	const materialLightMap = new SidebarMaterialMapProperty(editor, 'lightMap', strings.getKey('sidebar/material/lightmap'));
	container.add(materialLightMap);

	// ambient occlusion map

	const materialAOMap = new SidebarMaterialMapProperty(editor, 'aoMap', strings.getKey('sidebar/material/aomap'));
	container.add(materialAOMap);

	// gradient map

	const materialGradientMap = new SidebarMaterialMapProperty(editor, 'gradientMap', strings.getKey('sidebar/material/gradientmap'));
	container.add(materialGradientMap);

	// transmission map

	const transmissionMap = new SidebarMaterialMapProperty(editor, 'transmissionMap', strings.getKey('sidebar/material/transmissionmap'));
	container.add(transmissionMap);

	// thickness map

	const thicknessMap = new SidebarMaterialMapProperty(editor, 'thicknessMap', strings.getKey('sidebar/material/thicknessmap'));
	container.add(thicknessMap);

	// side

	const materialSideOptions = {
		0: 'Front',
		1: 'Back',
		2: 'Double'
	};

	const materialSide = new SidebarMaterialConstantProperty(editor, 'side', strings.getKey('sidebar/material/side'), materialSideOptions);
	container.add(materialSide);

	// size

	const materialSize = new SidebarMaterialNumberProperty(editor, 'size', strings.getKey('sidebar/material/size'), [0, Infinity]);
	container.add(materialSize);

	// sizeAttenuation

	const materialSizeAttenuation = new SidebarMaterialBooleanProperty(editor, 'sizeAttenuation', strings.getKey('sidebar/material/sizeAttenuation'));
	container.add(materialSizeAttenuation);

	// flatShading

	const materialFlatShading = new SidebarMaterialBooleanProperty(editor, 'flatShading', strings.getKey('sidebar/material/flatShading'));
	container.add(materialFlatShading);

	// blending

	const materialBlendingOptions = {
		0: 'No',
		1: 'Normal',
		2: 'Additive',
		3: 'Subtractive',
		4: 'Multiply',
		5: 'Custom'
	};

	const materialBlending = new SidebarMaterialConstantProperty(editor, 'blending', strings.getKey('sidebar/material/blending'), materialBlendingOptions);
	container.add(materialBlending);

	// opacity

	const materialOpacity = new SidebarMaterialNumberProperty(editor, 'opacity', strings.getKey('sidebar/material/opacity'), [0, 1]);
	container.add(materialOpacity);

	// transparent

	const materialTransparent = new SidebarMaterialBooleanProperty(editor, 'transparent', strings.getKey('sidebar/material/transparent'));
	container.add(materialTransparent);

	// forceSinglePass

	const materialForceSinglePass = new SidebarMaterialBooleanProperty(editor, 'forceSinglePass', strings.getKey('sidebar/material/forcesinglepass'));
	container.add(materialForceSinglePass);

	// alpha test

	const materialAlphaTest = new SidebarMaterialNumberProperty(editor, 'alphaTest', strings.getKey('sidebar/material/alphatest'), [0, 1]);
	container.add(materialAlphaTest);

	// depth test

	const materialDepthTest = new SidebarMaterialBooleanProperty(editor, 'depthTest', strings.getKey('sidebar/material/depthtest'));
	container.add(materialDepthTest);

	// depth write

	const materialDepthWrite = new SidebarMaterialBooleanProperty(editor, 'depthWrite', strings.getKey('sidebar/material/depthwrite'));
	container.add(materialDepthWrite);

	// wireframe

	const materialWireframe = new SidebarMaterialBooleanProperty(editor, 'wireframe', strings.getKey('sidebar/material/wireframe'));
	container.add(materialWireframe);

	// userData

	const materialUserDataRow = new UIRow();
	const materialUserData = new UITextArea().setWidth('150px').setHeight('40px').setFontSize('12px').onChange(update);
	materialUserData.onKeyUp(function () {

		try {

			JSON.parse(materialUserData.getValue());

			materialUserData.dom.classList.add('success');
			materialUserData.dom.classList.remove('fail');

		} catch (error) {

			materialUserData.dom.classList.remove('success');
			materialUserData.dom.classList.add('fail');

		}

	});

	materialUserDataRow.add(new UIText(strings.getKey('sidebar/material/userdata')).setWidth('90px'));
	materialUserDataRow.add(materialUserData);

	container.add(materialUserDataRow);

	//

	function update() {

		const previousSelectedSlot = currentMaterialSlot;

		currentMaterialSlot = parseInt(materialSlotSelect.getValue());

		if (currentMaterialSlot !== previousSelectedSlot) refreshUI();

		let material = editor.getObjectMaterial(currentObject, currentMaterialSlot);

		if (material) {

			if (material.uuid !== undefined && material.uuid !== materialUUID.getValue()) {

				editor.execute(new SetMaterialValueCommand(editor, currentObject, 'uuid', materialUUID.getValue(), currentMaterialSlot));

			}

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

			try {

				const userData = JSON.parse(materialUserData.getValue());
				if (JSON.stringify(material.userData) != JSON.stringify(userData)) {

					editor.execute(new SetMaterialValueCommand(editor, currentObject, 'userData', userData, currentMaterialSlot));

				}

			} catch (exception) {

				console.warn(exception);

			}

			refreshUI();

		}

	}

	//

	function setRowVisibility() {

		const material = currentObject.material;

		if (Array.isArray(material)) {

			materialSlotRow.setDisplay('');

		} else {

			materialSlotRow.setDisplay('none');

		}

	}

	function refreshUI() {

		if (!currentObject) return;

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

		if (material.uuid !== undefined) {

			materialUUID.setValue(material.uuid);

		}

		if (material.name !== undefined) {

			materialName.setValue(material.name.id - 1);

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

		setRowVisibility();

		try {

			materialUserData.setValue(JSON.stringify(material.userData, null, '  '));

		} catch (error) {

			console.log(error);

		}

		materialUserData.setBorderColor('transparent');
		materialUserData.setBackgroundColor('');

	}

	// events

	signals.objectSelected.add(function (object) {

		let hasMaterial = false;

		if (object && object.material) {

			hasMaterial = true;

			if (Array.isArray(object.material) && object.material.length === 0) {

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

	function onChangeProperty(){
		const selectedMaterialID = Number(materialName.getValue());
		const materialElement = materialTypeOptions[selectedMaterialID];
		materialDensity.setValue(materialElement.density);
		materialEnergy.setValue(materialElement.energy);
		editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'name', materialElement, currentMaterialSlot));
		editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'density', String(materialElement.density), currentMaterialSlot));
		editor.execute(new SetMaterialValueCommand(editor, editor.selected, 'energy', String(materialElement.energy), currentMaterialSlot));
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
		}
	]

export { SidebarMaterial };
