import * as THREE from 'three';
import { CSG } from './libs/CSGMesh';
class Selector {

	constructor( editor ) {

		const signals = editor.signals;

		this.editor = editor;
		this.signals = signals;

		this.booleanEventAvailability = false;
		// events
		signals.booleanEventChanged.add((booleanType) => {
			booleanType ? (this.booleanEventAvailability = true) : (this.booleanEventAvailability = false);
	});

		// signals

		signals.intersectionsDetected.add( ( intersects ) => {

			if ( intersects.length > 0 ) {

				const object = intersects[ 0 ].object;

				if ( object.userData.object !== undefined ) {

					// helper

					this.select( object.userData.object );

				} else {

					this.select( object );

				}

			} else {

				this.select( null );

			}

		} );

	}

	select( object ) {

		if ( this.editor.selected === object ) return;

		let uuid = null;

		if ( object !== null ) {

			uuid = object.uuid;

		}
		let originalObject = this.editor.selected;
		this.editor.selected = object;
		this.editor.config.setKey( 'selected', uuid );

		this.signals.objectSelected.dispatch( object );
		console.log("boolean operation detected ", this.booleanEventAvailability);

			if(this.booleanEventAvailability){
				console.log("boolean operation detected", this.booleanEventAvailability);
				
				const MeshCSG1 = CSG.fromMesh(originalObject)
				const MeshCSG2 = CSG.fromMesh(object)
				let aCSG;
				switch (this.editor.booleanEvent) {
					case 'merge' : aCSG = MeshCSG1.union(MeshCSG2); break;
					case 'subtract' : aCSG = MeshCSG1.subtract(MeshCSG2); break;
					case 'exclude' : aCSG = MeshCSG1.intersect(MeshCSG2); break;
				}

				const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4())
	
				this.editor.removeObject(originalObject)
				this.editor.removeObject(object);
				
				switch (this.editor.booleanEvent) {
					case 'merge' : finalMesh.name = "united object"; break;
					case 'subtract' : finalMesh.name = "subtracted object"; break;
					case 'exclude' : finalMesh.name = "intersected object"; break;
				}
				this.editor.addObject(finalMesh);
				
				this.booleanEventAvailability = false;
				this.signals.booleanEventChanged.dispatch();
				this.editor.booleanEvent = null;
				this.originalObject = object;
			}

	}

	deselect() {

		this.select( null );

	}

}

export { Selector };
