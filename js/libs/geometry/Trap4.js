import * as THREE from "three";

class aTrap4Geometry extends THREE.BufferGeometry {
    constructor(pdZ, pdY, pdX, pdLTX) {
        super();
        this.type = "aTrap4Geometry";

        const mmTocm = 10;
        const Z = pdZ * mmTocm / 2;           
        const Y = pdY * mmTocm / 2;           
        const X = pdX * mmTocm / 2;           
        const ltx = pdLTX * mmTocm;           

        const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

        const positionAttribute = boxGeometry.getAttribute('position');
        const positions = positionAttribute.array;

        for (let i = 0; i < positions.length; i += 3) {
            let x = positions[i];
            let y = positions[i + 1];
            let z = positions[i + 2];

            positions[i + 2] = z * (2 * Z);

            positions[i + 1] = y * (2 * Y);

            const t = (y + 0.5);

            if (x < 0) {
                positions[i] = -X;
            } else {
                positions[i] = -X + (2 * X) * (1 - t) + ltx * t;
            }
        }

        positionAttribute.needsUpdate = true;
        boxGeometry.computeVertexNormals();

        this.copy(boxGeometry);
        this.parameters = {
            'pZ': pdZ,
            'pY': pdY,
            'pX': pdX,
            'pLTX': pdLTX
        };
        this.type = 'aTrap4Geometry'
    }

    copy(source) {
        super.copy(source);

        if (source.parameters) {
            this.parameters = Object.assign({}, source.parameters);
        }

        return this;
    }

    static fromJSON(data) {
        return new aTrap4Geometry(
            data.pZ,
            data.pY,
            data.pX,
            data.pLTX
        );
    }
}

export { aTrap4Geometry };