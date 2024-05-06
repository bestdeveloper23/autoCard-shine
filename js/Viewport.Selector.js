import * as THREE from 'three';
import { CSG } from './libs/CSGMesh';
class Selector {

	constructor( editor ) {

		const signals = editor.signals;

		this.editor = editor;
		this.signals = signals;

		this.booleanEventAvailability = false;
		this.measurementEventAvailability = false;
		// events
		signals.booleanEventChanged.add((booleanType) => {
			booleanType ? (this.booleanEventAvailability = true) : (this.booleanEventAvailability = false);
		});

		signals.measureEventChanged.add((measurement) => {
			measurement ? (this.measurementEventAvailability = true) : (this.measurementEventAvailability = false);
			console.log(measurement);
		})

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
				if(this.editor.booleanEvent !== 'measure'){
				
					const MeshCSG1 = CSG.fromMesh(originalObject)
					const MeshCSG2 = CSG.fromMesh(object)
					let aCSG;
					switch (this.editor.booleanEvent) {
						case 'merge' : aCSG = MeshCSG1.union(MeshCSG2); break;
						case 'subtract' : aCSG = MeshCSG1.subtract(MeshCSG2); break;
						case 'exclude' : aCSG = MeshCSG1.intersect(MeshCSG2); break;
					}
	
					const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4())
	
					// add childrens for boolean operation handling
					if(!finalMesh.childrenObject) finalMesh.childrenObject = [];
					finalMesh.childrenObject.push(originalObject, object);
	
					// remove old objects from scene
					this.editor.removeObject(originalObject)
					this.editor.removeObject(object);
					
					switch (this.editor.booleanEvent) {
						case 'merge' : finalMesh.name = "united_object"; break;
						case 'subtract' : finalMesh.name = "subtracted_object"; break;
						case 'exclude' : finalMesh.name = "intersected_object"; break;
					}
					this.editor.addObject(finalMesh);
					
					this.booleanEventAvailability = false;
					this.signals.booleanEventChanged.dispatch();
					this.editor.booleanEvent = null;
					this.originalObject = object;	
				}
				
			}
			
	}

	deselect() {

		this.select( null );

	}

}

export { Selector };
