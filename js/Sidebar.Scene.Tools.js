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

        const worldObjects = scene.children?.filter(obj => obj.isMesh === true || obj.isGroup === true);

        const confirmation = worldObjects.length > 0 && window.confirm("Are you sure you want to clear everything?");
        clearWorld(confirmation);

        editor.deselect();
        signals.sceneGraphChanged.dispatch();

    });

    function clearWorld(confirmation) {

        const worldObjects = scene.children?.filter(obj => obj.isMesh === true || obj.isGroup === true);
        const particles = scene.children?.filter(obj => obj.isScene === true).map(line => line.children?.filter(obj => obj.isGroup === true)).flat();
        worldObjects.push(...particles);

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
