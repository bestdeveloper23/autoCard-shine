import { UITabbedPanel } from './libs/ui.js';

import { SidebarObject } from './Sidebar.Object.js';
import { SidebarScript } from './Sidebar.Script.js';
import { SidebarModifies } from './Sidebar.Modifies.js';

function SidebarModify( editor ) {

	const strings = editor.strings;

	const container = new UITabbedPanel();
	container.setId( 'modifies' );

	container.addTab( 'scripts', strings.getKey( 'sidebar/script' ), new SidebarScript( editor ) );
	container.addTab( 'modify', strings.getKey( 'sidebar/modify' ), new SidebarModifies( editor ) );
	container.select( 'scripts' );

	return container;

}

export { SidebarModify };
