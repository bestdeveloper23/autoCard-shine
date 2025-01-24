import * as THREE from "three";
import * as Geometries from "./libs/geometry/Geometries.js";

class shineObjectLoader extends THREE.ObjectLoader {
  constructor(manager) {
    super(manager);
  }

  parseGeometries(json, shapes) {
    const geometries = {};

    if (json !== undefined) {
      const bufferGeometryLoader = new THREE.BufferGeometryLoader();

      for (let i = 0, l = json.length; i < l; i++) {
        let geometry;
        const data = json[i];

        switch (data.type) {
          case "BufferGeometry":
          case "InstancedBufferGeometry":
            geometry = bufferGeometryLoader.parse(data);
            break;

          default:
            if (data.type in Geometries) {
              geometry = Geometries[data.type].fromJSON(data, shapes);
            } else {
              console.warn(
                `ShineObjectLoader: Unsupported geometry type "${data.type}"`
              );
            }
        }

        geometry.uuid = data.uuid;

        if (data.name !== undefined) geometry.name = data.name;
        if (data.userData !== undefined) geometry.userData = data.userData;

        geometries[data.uuid] = geometry;
      }
    }

    return geometries;
  }
}

export { shineObjectLoader };
