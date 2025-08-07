import { UIPanel, UIRow, UIHorizontalRule, UIButton } from './libs/ui.js';

function MenubarFork( editor ) {

	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu right' ); 

	const homeButton = new UIButton( 'Home' );
	homeButton.setClass( 'nav-button' );
	homeButton.onClick( function () {
		window.router.navigate( '/' );
	} );

	const dashboardButton = new UIButton( 'Dashboard' );
	dashboardButton.setClass( 'nav-button' );
	dashboardButton.onClick( function () {
		window.router.navigate( '/dashboard' );
	} );

	const forkButton = new UIButton( 'Fork Project' );
	forkButton.setClass( 'fork-button' );
	
	forkButton.onClick( async function () {
		const editorPage = window.editorPageInstance;
		if ( !editorPage || !editorPage.isPublicProject ) {
			alert( 'This project cannot be forked.' );
			return;
		}

		const user = window.router.getCurrentUser();
		
		if ( !user ) {
			if ( confirm( 'You need to sign in to fork this project. Would you like to sign in now?' ) ) {
				window.router.navigate( '/auth' );
			}
			return;
		}
		
		try {
			const projectName = editorPage.projectName || 'Untitled Project';
			const newName = prompt( `Fork "${projectName}" as:`, `${projectName} (Fork)` );
			if ( !newName ) return;
			
			const currentSceneData = editor.toJSON();
			
			const { DashboardActions } = await import('/js/DashboardComponents/Dashboard.Actions.js');
			const actions = DashboardActions();
			
			const result = await actions.createProject({
				name: newName,
				type: 'blank',
				isPublic: false,
				data: currentSceneData
			});
			
			if (result) {
				alert('Project forked successfully!');
				window.router.navigate('/dashboard');
			} else {
				alert('Failed to fork project: No result returned');
			}
			
		} catch ( error ) {
			alert( 'Failed to fork project: ' + error.message );
		}
	} );

	container.add( homeButton );
	container.add( dashboardButton );
	container.add( forkButton );

	forkButton.dom.style.display = 'none';

	const checkForkVisibility = () => {
		const editorPage = window.editorPageInstance;
		const user = window.router.getCurrentUser();
		
		if ( editorPage && editorPage.isPublicProject ) {
			let projectOwnerId = editorPage.projectData?.ownerId || 
			                    editorPage.projectData?.ownerUid || 
			                    editorPage.projectData?.userId ||
			                    editorPage.detectedOwnerId;
			
			const isOwner = user && projectOwnerId && user.uid === projectOwnerId;
			
			if ( !isOwner ) {
				forkButton.dom.style.display = '';
			} else {
				forkButton.dom.style.display = 'none';
			}
		} else {
			forkButton.dom.style.display = 'none';
		}
	};

	setTimeout( checkForkVisibility, 100 );
	
	setInterval( checkForkVisibility, 5000 );

	return container;

}

export { MenubarFork };