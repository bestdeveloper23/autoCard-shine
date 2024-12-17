import { UITabbedPanel } from './libs/ui.js';

import { SidebarObject } from './Sidebar.Object.js';
import { SidebarScript } from './Sidebar.Script.js';
import { SidebarModifies } from './Sidebar.Modifies.js';
import { SidebarLight } from "./sidebar.Lights.js";

function SidebarModify( editor ) {

	const strings = editor.strings;

	const container = new UITabbedPanel();
	container.setId( 'modifies' );

	container.addTab(  'lights', strings.getKey("sidebar/properties/lights"), new SidebarLight(editor));
	container.addTab( 'scripts', strings.getKey( 'sidebar/source' ), new SidebarScript( editor ) );
	container.addTab( 'modify', strings.getKey( 'sidebar/replicas' ), new SidebarModifies( editor ) );
	container.select( 'lights' );

	return container;

}

export { SidebarModify };
