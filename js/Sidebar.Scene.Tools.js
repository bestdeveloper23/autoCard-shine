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
