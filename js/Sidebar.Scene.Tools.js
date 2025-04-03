import { UIButton, UIDiv, UIRow } from "./libs/ui.js";

function SidebarSceneTool(editor) {

    const signals = editor.signals;
    const strings = editor.strings;
    const scene = editor.scene;


    const container = new UIDiv()
    container.setPaddingTop('20px');

    const toolRow = new UIRow().setId('Scene-tool');

    //for clearing world
    const clearButton = new UIButton(strings.getKey('sidebar/scene/tool/clearworld')).setId('Scene-tool-clrWorld');
    clearButton.onClick(() => {

        const confirmation = window.confirm("Are you sure you want to clear everything?");
        clearWorld(confirmation);

        editor.deselect();
        signals.sceneGraphChanged.dispatch();

    });

    function clearWorld(confirmation) {

        const worldObjects = scene.children?.filter(obj => obj.isMesh === true || obj.isGroup === true);
        const VRMLMesh = scene.children?.filter(obj => obj.isScene === true).map(obj => obj.children?.filter(obj => obj.isMesh === true)).flat();
        const particles = scene.children?.filter(obj => obj.isScene === true).map(obj => obj.children?.filter(obj => obj.isGroup === true)).flat();
        worldObjects.push(...particles, ...VRMLMesh);

        if (confirmation) {
            for (let i = 0; i < worldObjects.length; i++) {
                editor.removeObject(worldObjects[i]);
            }

        }
    }

    toolRow.add(clearButton);

    container.add(toolRow);

    signals.worldCleared.add(clearWorld);

    return container;

}



export { SidebarSceneTool }
