import { UIPanel, UIRow, UIInput, UICheckbox, UIText, UISpan, UINotification, UIButton } from './libs/ui.js';

/* import { SidebarProjectMaterials } from './Sidebar.Project.Materials.js'; */
import { SidebarProjectRenderer } from './Sidebar.Project.Renderer.js';
import { SidebarProjectVideo } from './Sidebar.Project.Video.js';
import { SidebarProjects } from './Sidebar.Project.Projects.js';
import { ProjectAPI } from './factory/ProjectAPIs.js';
import { Factory } from './factory/Factory.js'

function SidebarProject(editor) {

	const config = editor.config;
	const signals = editor.signals;
	const strings = editor.strings;

	const container = new UISpan();
	const notification = new UINotification();

	const settings = new UIPanel();
	settings.setBorderTop('0');
	settings.setPaddingTop('20px');
	container.add(settings);
	
	container.add(new SidebarProjectRenderer(editor));
	container.add(new SidebarProjects(editor));

	if ('SharedArrayBuffer' in window) {
		container.add(new SidebarProjectVideo(editor));
	}

	signals.editorCleared.add(function () {
	});

	return container;
}

export { SidebarProject };