import { UIPanel, UIButton, UICheckbox } from './libs/ui.js';

function Toolbar( editor ) {

	const signals = editor.signals;
	const strings = editor.strings;

	const container = new UIPanel();
	container.setId( 'toolbar' );

	// translate / rotate / scale

	const translateIcon = document.createElement( 'img' );
	translateIcon.title = strings.getKey( 'toolbar/translate' );
	translateIcon.src = 'images/translate.svg';

	const translate = new UIButton();
	translate.dom.className = 'Button selected';
	translate.dom.appendChild( translateIcon );
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	container.add( translate );

	const rotateIcon = document.createElement( 'img' );
	rotateIcon.title = strings.getKey( 'toolbar/rotate' );
	rotateIcon.src = 'images/rotate.svg';

	const rotate = new UIButton();
	rotate.dom.appendChild( rotateIcon );
	rotate.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	container.add( rotate );

	const scaleIcon = document.createElement( 'img' );
	scaleIcon.title = strings.getKey( 'toolbar/scale' );
	scaleIcon.src = 'images/scale.svg';

	const scale = new UIButton();
	scale.dom.appendChild( scaleIcon );
	scale.onClick( function () {

		signals.transformModeChanged.dispatch( 'scale' );

	} );
	container.add( scale );

	const local = new UICheckbox( false );
	local.dom.title = strings.getKey( 'toolbar/local' );
	local.onChange( function () {

		signals.spaceChanged.dispatch( this.getValue() === true ? 'local' : 'world' );

	} );
	container.add( local );

	const mergeIcon = document.createElement( 'img' );
	mergeIcon.title = strings.getKey( 'toolbar/merge' );
	mergeIcon.src = 'images/merge.svg';

	const merge = new UIButton();
	merge.dom.appendChild( mergeIcon );
	merge.onClick( function () {

		signals.booleanEventChanged.dispatch( 'merge' );

	} );
	container.add( merge );

	const subtractIcon = document.createElement( 'img' );
	subtractIcon.title = strings.getKey( 'toolbar/subtract' );
	subtractIcon.src = 'images/subtract.svg';

	const subtract = new UIButton();
	subtract.dom.appendChild( subtractIcon );
	subtract.onClick( function () {

		signals.booleanEventChanged.dispatch( 'subtract' );

	} );
	container.add( subtract );
	
	const excludeIcon = document.createElement( 'img' );
	excludeIcon.title = strings.getKey( 'toolbar/exclude' );
	excludeIcon.src = 'images/exclude.svg';

	const exclude = new UIButton();
	exclude.dom.appendChild( excludeIcon );
	exclude.onClick( function () {

		signals.booleanEventChanged.dispatch( 'exclude' );

	} );
	container.add( exclude );

	//

	signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
		scale.dom.classList.remove( 'selected' );

		switch ( mode ) {

			case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
			case 'scale': scale.dom.classList.add( 'selected' ); break;

		}

	} );

	signals.booleanEventChanged.add( function (booleanType) {
		console.log("booleanEvent is changed!", booleanType)
		merge.dom.classList.remove( 'selected' );
		subtract.dom.classList.remove( 'selected' );
		exclude.dom.classList.remove( 'selected' );
		switch (booleanType) {
			case 'merge' : merge.dom.classList.add( 'selected' ); break;
			case 'subtract' : merge.dom.classList.add( 'selected' ); break;
			case 'exclude' : merge.dom.classList.add( 'selected' ); break;
		}
	})


	return container;

}

export { Toolbar };
