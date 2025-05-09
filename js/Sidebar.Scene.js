import * as THREE from "three";

import {
  UIPanel,
  UIBreak,
  UIRow,
  UIColor,
  UISelect,
  UIText,
  UINumber,
} from "./libs/ui.js";
import { UIOutliner, UITexture } from "./libs/ui.three.js";

function SidebarScene(editor) {
  const signals = editor.signals;
  const strings = editor.strings;

  const container = new UIPanel();
  container.setBorderTop("0");
  container.setPaddingTop("20px");

  // outliner

  const nodeStates = new WeakMap();

  function buildOption(object, draggable, pointerEvents = "auto") {
    const option = document.createElement("div");
    option.draggable = draggable;
    option.style.pointerEvents = pointerEvents;
    option.innerHTML = buildHTML(object);
    option.value = object.id;

    // opener

    if (nodeStates.has(object)) {
      const state = nodeStates.get(object);

      const opener = document.createElement("span");
      opener.classList.add("opener");

      if (object.children.length > 0) {
        opener.classList.add(state ? "open" : "closed");
      }

      opener.addEventListener("click", function () {
        nodeStates.set(object, nodeStates.get(object) === false); // toggle
        refreshUI();
      });

      option.insertBefore(opener, option.firstChild);
    }

    return option;
  }

  function getMaterialName(material) {
    if (Array.isArray(material)) {
      const array = [];

      for (let i = 0; i < material.length; i++) {
        array.push(material[i].name);
      }

      return array.join(",");
    }

    return material.name;
  }

  function escapeHTML(html) {
    return html
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getObjectType(object) {
    if (object.isScene) return "Scene";
    if (object.isCamera) return "Camera";
    if (object.isLight) return "Light";
    if (object.isMesh) return "Mesh";
    if (object.isLine) return "Line";
    if (object.isPoints) return "Points";

    return "Object3D";
  }

  function buildHTML(object) {
    let html = "";
    if (object.name === "Scene") {
      html = `<span class="type ${getObjectType(object)}"></span> ${escapeHTML(
        "World"
      )}`;
    } else if (object.name === 'Light') {
      html = `<span class="type ${getObjectType(object)}"></span> ${escapeHTML(
        object.name //Light
      )}`;
    } else if (object.name === 'Particles') {
      html = `<span class="type ${getObjectType(object)}"></span> ${escapeHTML(
        object.name
      )}`;
    } else {
      html = `<span class="type ${getObjectType(object)}"></span> ${escapeHTML(
        object.name
      )}`;
    }

    if (object.isMesh) {
      const geometry = object.geometry;
      const material = object.material;

      html += ` <span class="type Geometry"></span> ${escapeHTML(
        geometry.name
      )}`;
      html += ` <span class="type Material"></span> ${escapeHTML(
        getMaterialName(material)
      )}`;
    }

    html += getScript(object.uuid);

    return html;
  }

  function getScript(uuid) {
    if (editor.scripts[uuid] !== undefined) {
      return ' <span class="type Script"></span>';
    }

    return "";
  }

  let ignoreObjectSelectedSignal = false;

  const outliner = new UIOutliner(editor);
  outliner.setId("outliner");
  outliner.onChange(function () {
    ignoreObjectSelectedSignal = true;

    editor.selectById(parseInt(outliner.getValue()));

    ignoreObjectSelectedSignal = false;
  });
  outliner.onDblClick(function () {
    editor.focusById(parseInt(outliner.getValue()));
  });
  container.add(outliner);
  container.add(new UIBreak());

  // background

  const backgroundRow = new UIRow();

  const backgroundType = new UISelect()
    .setOptions({
      None: "",
      Color: "Color",
      Texture: "Texture",
      Equirectangular: "Equirect",
    })
    .setWidth("150px");
  backgroundType.onChange(function () {
    onBackgroundChanged();
    refreshBackgroundUI();
  });

  backgroundRow.add(
    new UIText(strings.getKey("sidebar/scene/background")).setWidth("90px")
  );
  backgroundRow.add(backgroundType);

  const backgroundColor = new UIColor()
    .setValue("#000000")
    .setMarginLeft("8px")
    .onInput(onBackgroundChanged);
  backgroundRow.add(backgroundColor);

  const backgroundTexture = new UITexture()
    .setMarginLeft("8px")
    .onChange(onBackgroundChanged);
  backgroundTexture.setDisplay("none");
  backgroundRow.add(backgroundTexture);

  const backgroundEquirectangularTexture = new UITexture()
    .setMarginLeft("8px")
    .onChange(onBackgroundChanged);
  backgroundEquirectangularTexture.setDisplay("none");
  backgroundRow.add(backgroundEquirectangularTexture);

  container.add(backgroundRow);

  const backgroundEquirectRow = new UIRow();
  backgroundEquirectRow.setDisplay("none");
  backgroundEquirectRow.setMarginLeft("90px");

  const backgroundBlurriness = new UINumber(0)
    .setWidth("40px")
    .setRange(0, 1)
    .onChange(onBackgroundChanged);
  backgroundEquirectRow.add(backgroundBlurriness);

  const backgroundIntensity = new UINumber(1)
    .setWidth("40px")
    .setRange(0, Infinity)
    .onChange(onBackgroundChanged);
  backgroundEquirectRow.add(backgroundIntensity);

  container.add(backgroundEquirectRow);

  function onBackgroundChanged() {
    signals.sceneBackgroundChanged.dispatch(
      backgroundType.getValue(),
      backgroundColor.getHexValue(),
      backgroundTexture.getValue(),
      backgroundEquirectangularTexture.getValue(),
      backgroundBlurriness.getValue(),
      backgroundIntensity.getValue()
    );
  }

  function refreshBackgroundUI() {
    const type = backgroundType.getValue();

    backgroundType.setWidth(type === "None" ? "150px" : "110px");
    backgroundColor.setDisplay(type === "Color" ? "" : "none");
    backgroundTexture.setDisplay(type === "Texture" ? "" : "none");
    backgroundEquirectangularTexture.setDisplay(
      type === "Equirectangular" ? "" : "none"
    );
    backgroundEquirectRow.setDisplay(type === "Equirectangular" ? "" : "none");
  }

  function refreshUI() {
    const camera = editor.camera;
    const scene = editor.scene;
    const lights = scene.children?.filter(obj => obj.isLight === true);
    const mesh = scene.children?.filter(obj => obj.isMesh === true || obj.isGroup === true);
    const VRMLMesh = scene.children?.filter(obj => obj.isScene === true).map(obj => obj.children?.filter(obj => obj.isMesh === true)).flat();
    mesh.push(...VRMLMesh);
    const particles = scene.children?.filter(obj => obj.isScene === true).map(obj => obj.children?.filter(obj => obj.isGroup === true)).flat();
    const cameras = Object.values(editor.cameras).filter(camera => !camera.name.startsWith('default'));

    const options = [];


    options.push(buildOption(scene, false));
    addObjects(mesh, 0);
    options.push(buildOption({ name: 'Light' }, false, 'none'));
    addObjects(lights, 0);
    options.push(buildOption({ name: 'Camera' }, false, 'none'));
    addObjects(cameras, 0);
    options.push(buildOption({ name: "Particles" }, false, 'none'));
    addObjects(particles, 0);

    function addObjects(objects, pad) {
      for (let i = 0, l = objects.length; i < l; i++) {
        const object = objects[i];

        if (nodeStates.has(object) === false) {
          nodeStates.set(object, false);
        }

        const option = buildOption(object, true);
        option.style.paddingLeft = pad * 18 + "px";
        options.push(option);

        if (nodeStates.get(object) === true) {
          addObjects(object.children, pad + 1);
        }
      }
    };


    outliner.setOptions(options);

    if (editor.selected !== null) {
      outliner.setValue(editor.selected.id);
    }

    if (scene.background) {
      if (scene.background.isColor) {
        backgroundType.setValue("Color");
        backgroundColor.setHexValue(scene.background.getHex());
      } else if (scene.background.isTexture) {
        if (
          scene.background.mapping === THREE.EquirectangularReflectionMapping
        ) {
          backgroundType.setValue("Equirectangular");
          backgroundEquirectangularTexture.setValue(scene.background);
          backgroundBlurriness.setValue(scene.backgroundBlurriness);
          backgroundIntensity.setValue(scene.backgroundIntensity);
        } else {
          backgroundType.setValue("Texture");
          backgroundTexture.setValue(scene.background);
        }
      }
    } else {
      backgroundType.setValue("None");
    }

    refreshBackgroundUI();
  }

  refreshUI();

  // events

  signals.editorCleared.add(refreshUI);

  signals.sceneGraphChanged.add(refreshUI);

  signals.refreshSidebarEnvironment.add(refreshUI);

  signals.objectChanged.add(function (object) {
    let options = outliner.options;

    for (let i = 0; i < options.length; i++) {
      let option = options[i];

      if (option.value === object.id) {
        option.innerHTML = buildHTML(object);
        return;
      }
    }
  });

  signals.objectSelected.add(function (object) {
    if (ignoreObjectSelectedSignal === true) return;

    if (object !== null && object.parent !== null) {
      let needsRefresh = false;
      let parent = object.parent;

      while (parent !== editor.scene) {
        if (nodeStates.get(parent) !== true) {
          nodeStates.set(parent, true);
          needsRefresh = true;
        }

        parent = parent.parent;
      }

      if (needsRefresh) refreshUI();

      outliner.setValue(object.id);
    } else {
      outliner.setValue(null);
    }
  });

  return container;
}

export { SidebarScene };
