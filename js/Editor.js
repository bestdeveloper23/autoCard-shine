import * as THREE from 'three';

import { Config } from './Config.js';
import { Loader } from './Loader.js';
import { History as _History } from './History.js';
import { Strings } from './Strings.js';
import { Storage as _Storage } from './Storage.js';
import { Selector } from './Viewport.Selector.js';
import { PointSourceHelper } from './libs/helper/pointsourceHelper.js';
import { shineObjectLoader } from './shineObjectLoader.js';

var _DEFAULT_CAMERA = new THREE.PerspectiveCamera(50, 1, 0.1, 10000);
_DEFAULT_CAMERA.name = 'defaultCamera';
_DEFAULT_CAMERA.position.set(0, 500, 1000);
_DEFAULT_CAMERA.lookAt(new THREE.Vector3());

function Editor() {

	const Signal = signals.Signal; // eslint-disable-line no-undef

	this.signals = {

		// script

		editScript: new Signal(),

		// player

		startPlayer: new Signal(),
		stopPlayer: new Signal(),

		// vr

		toggleVR: new Signal(),
		exitedVR: new Signal(),

		// notifications

		editorCleared: new Signal(),

		savingStarted: new Signal(),
		savingFinished: new Signal(),

		transformModeChanged: new Signal(),
		booleanEventChanged: new Signal(),
		measureEventChanged: new Signal(),
		snapChanged: new Signal(),
		spaceChanged: new Signal(),
		rendererCreated: new Signal(),
		rendererUpdated: new Signal(),

		sceneBackgroundChanged: new Signal(),
		sceneEnvironmentChanged: new Signal(),
		sceneFogChanged: new Signal(),
		sceneFogSettingsChanged: new Signal(),
		sceneGraphChanged: new Signal(),
		sceneRendered: new Signal(),

		cameraChanged: new Signal(),
		cameraResetted: new Signal(),

		geometryChanged: new Signal(),

		objectSelected: new Signal(),
		objectFocused: new Signal(),

		objectAdded: new Signal(),
		objectChanged: new Signal(),
		objectRemoved: new Signal(),

		cameraAdded: new Signal(),
		cameraRemoved: new Signal(),

		helperAdded: new Signal(),
		helperRemoved: new Signal(),

		materialAdded: new Signal(),
		materialChanged: new Signal(),
		materialRemoved: new Signal(),

		worldCleared: new Signal(),

		scriptAdded: new Signal(),
		scriptChanged: new Signal(),
		scriptRemoved: new Signal(),

		windowResize: new Signal(),

		showGridChanged: new Signal(),
		showHelpersChanged: new Signal(),
		showDefaultLightChanged: new Signal(),
		showLightHelperChanged: new Signal(),
		refreshSidebarObject3D: new Signal(),
		refreshSidebarEnvironment: new Signal(),
		historyChanged: new Signal(),

		viewportCameraChanged: new Signal(),
		viewportShadingChanged: new Signal(),

		intersectionsDetected: new Signal(),

		userLoggedIn: new Signal(),
		userLoggedOut: new Signal(),
		projectTitleChanged: new Signal(),
		projectCreated: new Signal()

	};

	this.config = new Config();
	this.history = new _History(this);
	this.storage = new _Storage();
	this.strings = new Strings(this.config);
	this.selector = new Selector(this);

	this.loader = new Loader(this);

	this.camera = _DEFAULT_CAMERA.clone();

	this.scene = new THREE.Scene();
	this.scene.name = 'Scene';

	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};
	this.scripts = {};

	this.materialsRefCounter = new Map(); // tracks how often is a material used by a 3D object

	this.mixer = new THREE.AnimationMixer(this.scene);

	this.selected = null;
	this.helpers = {};

	this.cameras = {};

	this.viewportCamera = this.camera;
	this.viewportShading = 'default';

	this.addCamera(this.camera);

	this.booleanEvent = null;
	this.measureEvent = null;
	this.measurementPoints = [
		new THREE.Vector3(),
		new THREE.Vector3()
	];
	this.markers = [
		new THREE.Mesh(
			new THREE.SphereGeometry(0.05, 10, 20),
			new THREE.MeshBasicMaterial({
				color: 0xff5555
			})
		),
		new THREE.Mesh(
			new THREE.SphereGeometry(0.05, 10, 20),
			new THREE.MeshBasicMaterial({
				color: 0xff5555
			})
		)
	];
	this.markers[0].name = "ruler end 1";
	this.markers[1].name = "ruler end 2";
	this.clicks = 0;
	this.measurementLine = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), new THREE.LineBasicMaterial({ color: 0xff5555 }));
	this.measurementLine.name = "ruler";
}

Editor.prototype = {

	setScene: function (scene) {

		this.scene.uuid = scene.uuid;
		this.scene.name = scene.name;

		this.scene.background = scene.background;
		this.scene.environment = scene.environment;
		this.scene.fog = scene.fog;
		this.scene.backgroundBlurriness = scene.backgroundBlurriness;
		this.scene.backgroundIntensity = scene.backgroundIntensity;

		this.scene.userData = JSON.parse(JSON.stringify(scene.userData));

		// avoid render per object

		this.signals.sceneGraphChanged.active = false;

		while (scene.children.length > 0) {

			this.addObject(scene.children[0]);

		}

		this.signals.sceneGraphChanged.active = true;
		this.signals.sceneGraphChanged.dispatch();

	},

	//

	addObject: function (object, parent, index) {

		var scope = this;

		object.traverse(function (child) {

			if (child.geometry !== undefined) scope.addGeometry(child.geometry);
			if (child.material !== undefined) scope.addMaterial(child.material);


			if (object.type !== "PointSource") scope.addCamera(child);
			if (!(child.name.startsWith('default'))) scope.addHelper(child);

		});

		if (parent === undefined) {

			this.scene.add(object);

		} else {

			parent.children.splice(index, 0, object);
			object.parent = parent;

		}

		this.signals.objectAdded.dispatch(object);
		this.signals.sceneGraphChanged.dispatch();

	},

	moveObject: function (object, parent, before) {

		if (parent === undefined) {

			parent = this.scene;

		}

		parent.add(object);

		// sort children array

		if (before !== undefined) {

			var index = parent.children.indexOf(before);
			parent.children.splice(index, 0, object);
			parent.children.pop();

		}

		this.signals.sceneGraphChanged.dispatch();

	},

	nameObject: function (object, name) {

		object.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function (object) {

		if (object.parent === null) return; // avoid deleting the camera or scene

		var scope = this;

		object.traverse(function (child) {

			scope.removeCamera(child);
			scope.removeHelper(child);

			if (child.material !== undefined) scope.removeMaterial(child.material);

		});

		object.parent.remove(object);

		this.signals.objectRemoved.dispatch(object);
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function (geometry) {

		this.geometries[geometry.uuid] = geometry;

	},

	setGeometryName: function (geometry, name) {

		geometry.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addMaterial: function (material) {

		if (Array.isArray(material)) {

			for (var i = 0, l = material.length; i < l; i++) {

				this.addMaterialToRefCounter(material[i]);

			}

		} else {

			this.addMaterialToRefCounter(material);

		}

		this.signals.materialAdded.dispatch();

	},

	addMaterialToRefCounter: function (material) {

		var materialsRefCounter = this.materialsRefCounter;

		var count = materialsRefCounter.get(material);

		if (count === undefined) {

			materialsRefCounter.set(material, 1);
			this.materials[material.uuid] = material;

		} else {

			count++;
			materialsRefCounter.set(material, count);

		}

	},

	removeMaterial: function (material) {

		if (Array.isArray(material)) {

			for (var i = 0, l = material.length; i < l; i++) {

				this.removeMaterialFromRefCounter(material[i]);

			}

		} else {

			this.removeMaterialFromRefCounter(material);

		}

		this.signals.materialRemoved.dispatch();

	},

	removeMaterialFromRefCounter: function (material) {

		var materialsRefCounter = this.materialsRefCounter;

		var count = materialsRefCounter.get(material);
		count--;

		if (count === 0) {

			materialsRefCounter.delete(material);
			delete this.materials[material.uuid];

		} else {

			materialsRefCounter.set(material, count);

		}

	},

	getMaterialById: function (id) {

		var material;
		var materials = Object.values(this.materials);

		for (var i = 0; i < materials.length; i++) {

			if (materials[i].id === id) {

				material = materials[i];
				break;

			}

		}

		return material;

	},

	setMaterialName: function (material, name) {

		material.name = name;
		this.signals.sceneGraphChanged.dispatch();

	},

	addTexture: function (texture) {

		this.textures[texture.uuid] = texture;

	},

	//

	addCamera: function (camera) {

		// if( camera.type === "PointSource" ){

		// 	return;

		// }
		if (camera.isCamera) {

			this.cameras[camera.uuid] = camera;

			this.signals.cameraAdded.dispatch(camera);

		}

	},

	removeCamera: function (camera) {

		if (this.cameras[camera.uuid] !== undefined) {

			delete this.cameras[camera.uuid];

			this.signals.cameraRemoved.dispatch(camera);

		}

	},

	//

	addHelper: function () {

		var geometry = new THREE.SphereGeometry(2, 4, 2);
		var material = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });

		return function (object, helper) {

			if (helper === undefined) {
				if (object.name === "PointSource") {

					helper = new PointSourceHelper(object);

				}

				if (object.isCamera) {

					helper = new THREE.CameraHelper(object);

				} else if (object.isPointLight) {

					helper = new THREE.PointLightHelper(object, 1);

				} else if (object.isDirectionalLight) {

					helper = new THREE.DirectionalLightHelper(object, 1);

				} else if (object.isSpotLight) {

					helper = new THREE.SpotLightHelper(object);

				} else if (object.isHemisphereLight) {

					helper = new THREE.HemisphereLightHelper(object, 1);

				} else if (object.isSkinnedMesh) {

					helper = new THREE.SkeletonHelper(object.skeleton.bones[0]);

				} else if (object.isBone === true && object.parent && object.parent.isBone !== true) {

					helper = new THREE.SkeletonHelper(object);

				} else {

					// no helper for this object type
					return;

				}

				const picker = new THREE.Mesh(geometry, material);
				picker.name = 'picker';
				picker.userData.object = object;
				helper.add(picker);

			}

			this.sceneHelpers.add(helper);
			this.helpers[object.id] = helper;

			this.signals.helperAdded.dispatch(helper);

		};

	}(),

	removeHelper: function (object) {

		if (this.helpers[object.id] !== undefined) {

			var helper = this.helpers[object.id];
			helper.parent.remove(helper);

			delete this.helpers[object.id];

			this.signals.helperRemoved.dispatch(helper);

		}

	},

	//

	addScript: function (object, script) {

		if (this.scripts[object.uuid] === undefined) {

			this.scripts[object.uuid] = [];

		}

		this.scripts[object.uuid].push(script);

		this.signals.scriptAdded.dispatch(script);

	},

	removeScript: function (object, script) {

		if (this.scripts[object.uuid] === undefined) return;

		var index = this.scripts[object.uuid].indexOf(script);

		if (index !== - 1) {

			this.scripts[object.uuid].splice(index, 1);

		}

		this.signals.scriptRemoved.dispatch(script);

	},

	getObjectMaterial: function (object, slot) {

		var material = object.material;

		if (Array.isArray(material) && slot !== undefined) {

			material = material[slot];

		}

		return material;

	},

	setObjectMaterial: function (object, slot, newMaterial) {

		if (Array.isArray(object.material) && slot !== undefined) {

			object.material[slot] = newMaterial;

		} else {

			object.material = newMaterial;

		}

	},

	setViewportCamera: function (uuid) {

		this.viewportCamera = this.cameras[uuid];
		this.signals.viewportCameraChanged.dispatch();

	},

	setViewportShading: function (value) {

		this.viewportShading = value;
		this.signals.viewportShadingChanged.dispatch();

	},

	//

	select: function (object) {

		this.selector.select(object);

	},

	selectById: function (id) {

		if (id === this.camera.id) {

			this.select(this.camera);
			return;

		}

		this.select(this.scene.getObjectById(id));

	},

	selectByUuid: function (uuid) {

		var scope = this;

		this.scene.traverse(function (child) {

			if (child.uuid === uuid) {

				scope.select(child);

			}

		});

	},

	deselect: function () {

		this.selector.deselect();

	},

	focus: function (object) {

		if (object !== undefined) {

			this.signals.objectFocused.dispatch(object);

		}

	},

	focusById: function (id) {

		this.focus(this.scene.getObjectById(id));

	},

	clear: function (confirmation) {

		// this.history.clear();
		// this.storage.clear();

		// this.camera.copy( _DEFAULT_CAMERA );
		// this.signals.cameraResetted.dispatch();

		// this.scene.name = 'Scene';
		// this.scene.userData = {};
		// this.scene.background = null;
		// this.scene.environment = null;
		// this.scene.fog = null;

		// var objects = this.scene.children;

		// while ( objects.length > 0 ) {

		// 	this.removeObject( objects[ 0 ] );

		// }

		// this.geometries = {};
		// this.materials = {};
		// this.textures = {};
		// this.scripts = {};

		// this.materialsRefCounter.clear();

		// this.animations = {};
		// this.mixer.stopAllAction();

		// this.deselect();

		// this.signals.editorCleared.dispatch();

		// this.signals.booleanEventChanged.dispatch();
		// this.signals.measureEventChanged.dispatch();


		this.history.clear();
		this.storage.clear();

		this.camera.copy(_DEFAULT_CAMERA);
		this.signals.cameraResetted.dispatch();

		this.scene.name = 'Scene';
		this.scene.userData = {};
		this.scene.background = null;
		this.scene.environment = null;
		this.scene.fog = null;

		// var objects = this.scene.children;

		this.signals.sceneGraphChanged.active = false;


		this.signals.worldCleared.dispatch(confirmation);
		this.signals.sceneGraphChanged.active = true;

		this.geometries = {};
		this.materials = {};
		this.textures = {};
		this.scripts = {};

		this.materialsRefCounter.clear();

		this.animations = {};
		this.mixer.stopAllAction();

		this.deselect();

		this.signals.editorCleared.dispatch();

	},

	//

	fromJSON: async function (json) {

		var loader = new shineObjectLoader();
		var camera = await loader.parseAsync(json.camera);

		this.camera.copy(camera);
		this.signals.cameraResetted.dispatch();

		this.history.fromJSON(json.history);
		this.scripts = json.scripts;

		const retrievedScene = await loader.parseAsync(json.scene)
		retrievedScene.children = retrievedScene.children.filter(obj => !(obj.name.startsWith('default')));
		this.setScene(retrievedScene);

		if (json.environment === 'ModelViewer') {

			this.signals.sceneEnvironmentChanged.dispatch(json.environment);
			this.signals.refreshSidebarEnvironment.dispatch();

		}

	},

	toJSON: function () {

		// scripts clean up

		var scene = this.scene;
		var scripts = this.scripts;

		for (var key in scripts) {

			var script = scripts[key];

			if (script.length === 0 || scene.getObjectByProperty('uuid', key) === undefined) {

				delete scripts[key];

			}

		}

		// honor modelviewer environment

		let environment = null;

		if (this.scene.environment !== null && this.scene.environment.isRenderTargetTexture === true) {

			environment = 'ModelViewer';

		}

		//

		return {

			metadata: {},
			project: {
				shadows: this.config.getKey('project/renderer/shadows'),
				shadowType: this.config.getKey('project/renderer/shadowType'),
				vr: this.config.getKey('project/vr'),
				toneMapping: this.config.getKey('project/renderer/toneMapping'),
				toneMappingExposure: this.config.getKey('project/renderer/toneMappingExposure')
			},
			camera: this.viewportCamera.toJSON(),
			scene: this.scene.toJSON(),
			scripts: this.scripts,
			history: this.history.toJSON(),
			environment: environment

		};

	},

	objectByUuid: function (uuid) {

		return this.scene.getObjectByProperty('uuid', uuid, true);

	},

	execute: function (cmd, optionalName) {

		this.history.execute(cmd, optionalName);

	},

	undo: function () {

		this.history.undo();

	},

	redo: function () {

		this.history.redo();

	}

};

export { Editor };
