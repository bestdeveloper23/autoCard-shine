import { UIButton, UIDiv , UIRow} from "./libs/ui.js";

function SidebarSceneTool( editor ) {

    const signals = editor.signals;
    const strings = editor.strings;
    const scene = editor.scene;


    const container = new UIDiv()
    container.setPaddingTop( '20px' );
    
    const toolRow = new UIRow().setId('Scene-tool');

    //for clearing world
    const button = new UIButton(  strings.getKey('sidebar/scene/tool/clearworld') ).setId('Scene-tool-clrWorld');
    button.onClick( function () {

        const worldObjects = scene.children?.filter(obj => obj.isMesh === true || obj.isGroup === true);

        const confirmation = worldObjects.length > 0 && window.confirm("Are you sure you want to clear everything?");

        if(confirmation){
            for(let i = 0; i < worldObjects.length; i++){
              editor.removeObject(worldObjects[i]);
            }

           editor.deselect();
           signals.sceneGraphChanged.dispatch();
        }


    } );

    toolRow.add( button );

    container.add(toolRow)

    return container;

}



export {SidebarSceneTool}



// import { UIButton, UIDiv, UIRow } from "./libs/ui.js";

// function SidebarSceneTool(editor) {
//     const signals = editor.signals;
//     const container = new UIDiv();
//     container.setPaddingTop('20px');

//     // Row for scene tools
//     const toolRow = new UIRow().setId('Scene-tool');

//     // Clear World Button
//     const clearButton = new UIButton('Clear World').setId('Scene-tool-clrWorld');
//     clearButton.onClick(function () {
//         if (confirm('Are you sure you want to clear the world?')) {
//             const worldObjects = editor.scene.children?.filter(obj => obj.isMesh || obj.isGroup) || [];
//             worldObjects.forEach(obj => editor.removeObject(obj));
//             editor.deselect();
//             signals.sceneGraphChanged.dispatch();
//         }
//     });
//     toolRow.add(clearButton);

//     // Save Scene Button
//     const saveButton = new UIButton('Save Scene').setId('Scene-tool-saveScene');
//     saveButton.onClick(() => saveSceneToLocalStorage(editor));
//     toolRow.add(saveButton);

//     // Load Scene Button
//     const loadButton = new UIButton('Load Scene').setId('Scene-tool-loadScene');
//     loadButton.onClick(() => loadSceneFromLocalStorage(editor));
//     toolRow.add(loadButton);

//     container.add(toolRow);

//     return container;
// }

// export { SidebarSceneTool };
