import { UIPanel, UIButton, UICheckbox, UIText } from './libs/ui.js';

import translateImg from '../images/translate.svg';
import rotateImg from '../images/rotate.svg';
import mergeImg from '../images/merge.svg';
import subtractImg from '../images/subtract.svg';
import excludeImg from '../images/exclude.svg';
import measureImg from '../images/measure.svg';

function Toolbar( editor ) {

	const signals = editor.signals;
	const strings = editor.strings;

	const container = new UIPanel();
	container.setId( 'toolbar' );

	// translate / rotate / scale

	const translateIcon = document.createElement( 'img' );
	translateIcon.title = strings.getKey( 'toolbar/translate' );
	translateIcon.src = translateImg;

	const translate = new UIButton();
	translate.dom.className = 'Button selected';
	translate.dom.appendChild( translateIcon );
	translate.onClick( function () {

		signals.transformModeChanged.dispatch( 'translate' );

	} );
	container.add( translate );

	const rotateIcon = document.createElement( 'img' );
	rotateIcon.title = strings.getKey( 'toolbar/rotate' );
	rotateIcon.src = rotateImg;

	const rotate = new UIButton();
	rotate.dom.appendChild( rotateIcon );
	rotate.onClick( function () {

		signals.transformModeChanged.dispatch( 'rotate' );

	} );
	container.add( rotate );

	// const scaleIcon = document.createElement( 'img' );
	// scaleIcon.title = strings.getKey( 'toolbar/scale' );
	// scaleIcon.src = '../images/scale.svg';

	// const scale = new UIButton();
	// scale.dom.appendChild( scaleIcon );
	// scale.onClick( function () {

	// 	signals.transformModeChanged.dispatch( 'scale' );

	// } );
	// container.add( scale );

	const local = new UICheckbox( false );
	local.dom.title = strings.getKey( 'toolbar/local' );
	local.onChange( function () {

		signals.spaceChanged.dispatch( this.getValue() === true ? 'local' : 'world' );

	} );
	container.add( local );

	const mergeIcon = document.createElement( 'img' );
	mergeIcon.title = strings.getKey( 'toolbar/merge' );
	mergeIcon.src = mergeImg;

	const merge = new UIButton();
	merge.dom.appendChild( mergeIcon );
	merge.onClick( function () {

		if (editor.booleanEvent === 'merge'){
			signals.booleanEventChanged.dispatch();
		} else {
			signals.booleanEventChanged.dispatch( 'merge' );	
		}

	} );
	container.add( merge );

	const subtractIcon = document.createElement( 'img' );
	subtractIcon.title = strings.getKey( 'toolbar/subtract' );
	subtractIcon.src = subtractImg;

	const subtract = new UIButton();
	subtract.dom.appendChild( subtractIcon );
	subtract.onClick( function () {
		if (editor.booleanEvent === 'subtract'){
			signals.booleanEventChanged.dispatch();
		} else {
			signals.booleanEventChanged.dispatch( 'subtract' );	
		}

	} );
	container.add( subtract );
	
	const excludeIcon = document.createElement( 'img' );
	excludeIcon.title = strings.getKey( 'toolbar/exclude' );
	excludeIcon.src = excludeImg;

	const exclude = new UIButton();
	exclude.dom.appendChild( excludeIcon );
	exclude.onClick( function () {

		if (editor.booleanEvent === 'exclude'){
			signals.booleanEventChanged.dispatch();
		} else {
			signals.booleanEventChanged.dispatch( 'exclude' );	
		}

	} );
	container.add( exclude );


	const measureIcon = document.createElement( 'img' );
	measureIcon.title = strings.getKey( 'toolbar/measure' );
	measureIcon.src = measureImg;

	const measure = new UIButton();
	measure.dom.appendChild( measureIcon );
	measure.onClick( function () {

		if (editor.booleanEvent === 'measure'){
			signals.booleanEventChanged.dispatch();
			signals.measureEventChanged.dispatch();
		} else {
			signals.booleanEventChanged.dispatch( 'measure' );
			signals.measureEventChanged.dispatch( 'measure' );
		}

	} );
	container.add( measure );

	const measureValue = new UIText();
	measureValue.dom.style.paddingLeft = "5px";
	measureValue.dom.style.paddingRight = "5px";
	// measureValue.setValue( editor.measureValue );
	container.add( measureValue );


	//

	signals.transformModeChanged.add( function ( mode ) {

		translate.dom.classList.remove( 'selected' );
		rotate.dom.classList.remove( 'selected' );
		// scale.dom.classList.remove( 'selected' );

		switch ( mode ) {

			case 'translate': translate.dom.classList.add( 'selected' ); break;
			case 'rotate': rotate.dom.classList.add( 'selected' ); break;
			// case 'scale': scale.dom.classList.add( 'selected' ); break;

		}

	} );

	signals.booleanEventChanged.add( function (booleanType) {

		merge.dom.classList.remove( 'selected' ); editor.booleanEvent = null;
		subtract.dom.classList.remove( 'selected' ); editor.booleanEvent = null;
		exclude.dom.classList.remove( 'selected' ); editor.booleanEvent = null;
		measure.dom.classList.remove( 'selected' ); editor.booleanEvent = null;
		console.log("booleanEvent is changed!", measure.dom.classList, booleanType);
		if(booleanType){
			switch (booleanType) {
				case 'merge': merge.dom.classList.add( 'selected' ); editor.booleanEvent = 'merge'; break;
				case 'subtract': subtract.dom.classList.add( 'selected' ); editor.booleanEvent = 'subtract'; break;
				case 'exclude': exclude.dom.classList.add( 'selected' ); editor.booleanEvent = 'exclude'; break;
				case 'measure': measure.dom.classList.add( 'selected' ); editor.booleanEvent = 'measure'; break;
			}	
		}
		
	});

	this.container = container;
	this.measureValue = measureValue;

}

export { Toolbar };
