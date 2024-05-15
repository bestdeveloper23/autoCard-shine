import { UITabbedPanel } from './libs/ui.js';

import { SidebarScript } from './Sidebar.Script.js';
import { SidebarModifies } from './Sidebar.Modifies.js';

function SidebarModify( editor ) {

	const strings = editor.strings;

	const container = new UITabbedPanel();
	container.setId( 'leftbar' );

	container.addTab( 'solids', strings.getKey( 'sidebar/left/solids' ), new SidebarScript( editor ) );
	container.addTab( 'sources', strings.getKey( 'sidebar/left/sources' ), new SidebarModifies( editor ) );
	container.select( 'solids' );

	return container;

}

export { SidebarModify };