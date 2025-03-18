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

	// Title

	async function createNewProject(userEmail, newTitle) {

		try {

			const mac = await Factory.exportMacro(editor);
			const tg = await Factory.exportTg(editor);

			const mac_blob = new Blob([mac], { type: 'text/plain' });
			const tg_blob = new Blob([tg], { type: 'text/plain' });

			await ProjectAPI.createProject(userEmail, newTitle, mac_blob, tg_blob);
			notification.show('Project created successfully!', 'success');
			editor.signals.projectCreated.dispatch(newTitle);
		} catch (error) {
			notification.show(`${error.message}`, 'error');
			title.setValue('');
		}
	}

	const titleRow = new UIRow();
	const title = new UIInput(config.getKey('project/title'))
		.setLeft('100px')
		.setWidth('150px')
		.onChange(function () {
			const newTitle = this.getValue();
			const regex = /^[a-zA-Z0-9_]+$/;

			if (!regex.test(newTitle)) {
				alert('Project name can only contain letters, numbers, and underscores');
				this.setValue('');
				return;
			}

			config.setKey('project/title', newTitle);

			// Get current user email
			const userEmail = localStorage.getItem('userEmail');

			if (!userEmail) {
				alert('Please log in or sign up to create projects.');
				this.setValue('');
			} else {
				createNewProject(userEmail, newTitle);
				signals.projectTitleChanged.dispatch(newTitle);
			}

		});

	// Add button
	const addButton = new UIButton('+');
	addButton.dom.style.width = '24px';
	addButton.dom.style.height = '24px';
	addButton.dom.style.borderRadius = '50%';
	addButton.dom.style.marginLeft = '8px';
	addButton.dom.style.padding = '0';
	addButton.dom.style.display = 'flex';
	addButton.dom.style.alignItems = 'center';
	addButton.dom.style.justifyContent = 'center';
	addButton.dom.style.fontSize = '18px';
	addButton.dom.style.fontWeight = 'bold';
	addButton.dom.style.cursor = 'pointer';
	addButton.dom.style.transition = 'all 0.2s';


	addButton.onClick(async function () {
		const userEmail = localStorage.getItem('userEmail');
		const newTitle = title.getValue();

		if (newTitle && userEmail) {
			await createNewProject(userEmail, newTitle);
			title.setValue('');
		}
	});

	titleRow.add(new UIText(strings.getKey('sidebar/project/title')).setWidth('90px'));
	titleRow.add(title);
	titleRow.add(addButton);

	settings.add(titleRow);

	// Editable

	// const editableRow = new UIRow();
	// const editable = new UICheckbox(config.getKey('project/editable')).setLeft('100px').onChange(function () {

	// 	config.setKey('project/editable', this.getValue());

	// });

	// editableRow.add(new UIText(strings.getKey('sidebar/project/editable')).setWidth('90px'));
	// editableRow.add(editable);

	// settings.add(editableRow);

	// // WebVR

	// const vrRow = new UIRow();
	// const vr = new UICheckbox(config.getKey('project/vr')).setLeft('100px').onChange(function () {

	// 	config.setKey('project/vr', this.getValue());

	// });

	// vrRow.add(new UIText(strings.getKey('sidebar/project/vr')).setWidth('90px'));
	// vrRow.add(vr);

	// settings.add(vrRow);

	//

	/* container.add( new SidebarProjectMaterials( editor ) ); */
	container.add(new SidebarProjectRenderer(editor));
	container.add(new SidebarProjects(editor));

	if ('SharedArrayBuffer' in window) {

		container.add(new SidebarProjectVideo(editor));

	}

	// Signals

	signals.editorCleared.add(function () {

		title.setValue('');
		config.setKey('project/title', '');

	});

	return container;

}

export { SidebarProject };
