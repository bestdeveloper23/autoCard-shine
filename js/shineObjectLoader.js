import * as THREE from 'three';
import * as Geometries from './libs/geometry/Geometries.js';


class shineObjectLoader extends THREE.ObjectLoader {
    constructor(manager) {
        super(manager);
    }

    async parseAsync( json ) {

		const animations = super.parseAnimations( json.animations );
		const shapes = super.parseShapes( json.shapes );
		const geometries = this.parseGeometries( json.geometries, shapes );

		const images = await super.parseImagesAsync( json.images );

		const textures = super.parseTextures( json.textures, images );
		const materials = super.parseMaterials( json.materials, textures );

		const object = super.parseObject( json.object, geometries, materials, textures, animations );
		const skeletons = super.parseSkeletons( json.skeletons, object );

		super.bindSkeletons( object, skeletons );
		super.bindLightTargets( object );

		return object;

	}
    


    parseGeometries( json, shapes ) {

		const geometries = {};

		if ( json !== undefined ) {

			const bufferGeometryLoader = new THREE.BufferGeometryLoader();

			for ( let i = 0, l = json.length; i < l; i ++ ) {

				let geometry;
				const data = json[ i ];

				switch ( data.type ) {

					case 'BufferGeometry':
					case 'InstancedBufferGeometry':

						geometry = bufferGeometryLoader.parse( data );
						break;

					default:

						if ( data.type in Geometries ) {

							geometry = Geometries[ data.type ].fromJSON( data, shapes );
                            console.log(geometry);

						} else {

							console.warn( `ShineObjectLoader: Unsupported geometry type "${ data.type }"` );

						}

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;
				if ( data.userData !== undefined ) geometry.userData = data.userData;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	}

}

export { shineObjectLoader};