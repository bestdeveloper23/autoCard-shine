import * as THREE from 'three';

class BoxGeometry extends THREE.BufferGeometry {
  constructor(width, height, depth) {
    super();

    this.type = 'BoxGeometry';

    const mmToCm = 10;
    const Width=width*mmToCm;
    const Height=height*mmToCm;
    const Depth=depth*mmToCm;
    const boxGeometry = new THREE.BoxGeometry(Width*2, Height*2, Depth*2);

    const finalGeometry = boxGeometry;
    finalGeometry.type='BoxGeometry';
    finalGeometry.parameters = {'width':width, 'height':height, 'depth':depth};

    Object.assign(this, finalGeometry);
  }

  copy(source) {
		super.copy( source );
		this.parameters = Object.assign( {}, source.parameters );
		return this;
  }

  static fromJSON(data) {
    return new BoxGeometry(data.width, data.height, data.depth);
  }
}

export { BoxGeometry };