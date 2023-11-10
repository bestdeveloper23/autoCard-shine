import * as THREE from 'three';
import { CSG } from './libs/CSGMesh';
class Selector {

	constructor( editor ) {

		const signals = editor.signals;

		this.editor = editor;
		this.signals = signals;

		this.booleanEventavailability = false;
		// events
		signals.booleanEventChanged.add((booleanType) => {
			booleanType ? (this.booleanEventavailability = true) : (this.booleanEventavailability = false);
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
		let originObject = this.editor.selected;
		this.editor.selected = object;
		this.editor.config.setKey( 'selected', uuid );

		this.signals.objectSelected.dispatch( object );
		console.log("I am detected boolean", this.booleanEventavailability);

			if(this.booleanEventavailability){
				console.log("I am detected boolean", this.booleanEventavailability);
				
				const MeshCSG1 = CSG.fromMesh(originObject)
				const MeshCSG2 = CSG.fromMesh(object)
				let aCSG;
				switch (this.editor.booleanEvent) {
					case 'merge' : aCSG = MeshCSG1.union(MeshCSG2); break;
					case 'subtract' : aCSG = MeshCSG1.subtract(MeshCSG2); break;
					case 'exclude' : aCSG = MeshCSG1.intersect(MeshCSG2); break;
				}

				const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4())
	
				this.editor.removeObject(originObject)
				this.editor.removeObject(object);
				
				switch (this.editor.booleanEvent) {
					case 'merge' : finalMesh.name = "new merged object"; break;
					case 'subtract' : finalMesh.name = "new subtracted object"; break;
					case 'exclude' : finalMesh.name = "new excluded object"; break;
				}
				this.editor.addObject(finalMesh);
				
				this.booleanEventavailability = false;
				this.signals.booleanEventChanged.dispatch();
				this.originObject = object;
			}
		

	}

	deselect() {

		this.select( null );

	}

}

export { Selector };
