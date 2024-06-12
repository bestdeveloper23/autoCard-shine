import { BufferGeometry } from 'three';
import { Float32BufferAttribute } from 'three';
import { Vector3 } from 'three';
import { Vector2 } from 'three';

class PolyconeGeometry extends BufferGeometry {

    constructor(numberZ = 2, rInner = [0, 0], zArray = [0, 1], radialSegments = 32, heightSegments = 1, openEnded = false, thetaStart = 0, thetaLength = Math.PI * 2) {

        super();

        this.type = 'PolyconeGeometry';

        this.parameters = {
            numberZ: Math.min(numberZ, rInner.length, zArray.length),
            rInner: rInner,
            zArray: zArray,
            radialSegments: radialSegments,
            heightSegments: heightSegments,
            openEnded: openEnded,
            thetaStart: thetaStart,
            thetaLength: thetaLength
        };
        // radiusTop: radiusTop,
        // radiusBottom: radiusBottom,
        // height: height,
        const scope = this;

        radialSegments = Math.floor(radialSegments);
        heightSegments = Math.floor(heightSegments);

        // buffers

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        // helper variables

        let index = 0;
        const indexArray = [];
        let groupStart = 0;

        // generate geometry

        generateTorso();

        if (openEnded === false) {

            generateCap(true);
            generateCap(false);

        }

        // build geometry

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

        function generateTorso() {

            const normal = new Vector3();
            const vertex = new Vector3();

            let groupCount = 0;

            // this will be used to calculate the normal

            // generate vertices, normals and uvs
            for (let counter = 1; counter < numberZ; counter++) {
                let slope = 0, radiusBottom, radiusTop, height;

                height = zArray[counter] - zArray[counter - 1];
                radiusBottom = rInner[counter - 1], radiusTop = rInner[counter];
                slope = (radiusBottom - radiusTop) / height;

                const indexColumn = [];

                for (let y = 0; y <= heightSegments; y++) {

                    const indexRow = [];


                    const v = y / heightSegments;

                    // calculate the radius of the current row

                    const radius = v * (radiusTop - radiusBottom) + radiusBottom;

                    for (let x = 0; x <= radialSegments; x++) {

                        const u = x / radialSegments;

                        const theta = (-1) * (u * thetaLength) - thetaStart + Math.PI;

                        const sinTheta = Math.sin(theta);
                        const cosTheta = Math.cos(theta);

                        // vertex

                        vertex.x = radius * sinTheta;
                        vertex.y = v * height + zArray[counter - 1];
                        vertex.z = radius * cosTheta;
                        vertices.push(vertex.x, vertex.y, vertex.z);

                        // normal

                        normal.set(sinTheta, slope, cosTheta).normalize();
                        normals.push(normal.x, normal.y, normal.z);

                        // uv

                        uvs.push(u, 1 - v);

                        // save index of vertex in respective row

                        indexRow.push(index++);

                    }
                    vertices.push(0, v * height + zArray[counter - 1], 0);
                    normals.push(0, 0, 0);
                    uvs.push(0.5, 0.5);
                    indexRow.push(index++);

                    // now save vertices of the row in our index array

                    indexColumn.push(indexRow);

                }
                indexArray.push(indexColumn);
            }


            // generate indices


            for (let x = 0; x <= radialSegments; x++) {
                for (let counter = 0; counter < numberZ - 1; counter++) {
                    for (let y = 0; y < heightSegments; y++) {

                        // we use the index array to access the correct indices

                        if(x === radialSegments){
                            const a = indexArray[counter][y][x+1];
                            const b = indexArray[counter][y + 1][x+1];
                            const c = indexArray[counter][y + 1][0];
                            const d = indexArray[counter][y][0];
    
                            // faces
    
                            indices.push(a, d, b);
                            indices.push(b, d, c);
                            // update group counter
                            groupCount += 6;    
                        }
                        const a = indexArray[counter][y][x];
                        const b = indexArray[counter][y + 1][x];
                        const c = indexArray[counter][y + 1][x + 1];
                        const d = indexArray[counter][y][x + 1];

                        // faces

                        indices.push(a, d, b);
                        indices.push(b, d, c);
                        // update group counter
                        groupCount += 6;
                    }

                }

            }

            // add a group to the geometry. this will ensure multi material support

            scope.addGroup(groupStart, groupCount, 0);

            // calculate new start value for groups

            groupStart += groupCount;

        }

        function generateCap(top) {

            // save the index of the first center vertex
            const centerIndexStart = index;

            const uv = new Vector2();
            const vertex = new Vector3();

            let groupCount = 0;

            const radius = (top === true) ? rInner[numberZ - 1] : rInner[0];
            const sign = (top === true) ? 1 : - 1;
            const halfHeight = (top === true) ? zArray[numberZ - 1] : zArray[0];

            // first we generate the center vertex data of the cap.
            // because the geometry needs one set of uvs per face,
            // we must generate a center vertex per face/segment

            for (let x = 1; x <= radialSegments; x++) {

                // vertex

                vertices.push(0, halfHeight, 0);

                // normal

                normals.push(0, sign, 0);

                // uv

                uvs.push(0.5, 0.5);

                // increase index

                index++;

            }

            // save the index of the last center vertex
            const centerIndexEnd = index;

            // now we generate the surrounding vertices, normals and uvs

            for (let x = 0; x <= radialSegments; x++) {

                const u = x / radialSegments;
                const theta = (-1) * (u * thetaLength) - thetaStart + Math.PI;

                const cosTheta = Math.cos(theta);
                const sinTheta = Math.sin(theta);

                // vertex

                vertex.x = radius * sinTheta;
                vertex.y = halfHeight;
                vertex.z = radius * cosTheta;
                vertices.push(vertex.x, vertex.y, vertex.z);

                // normal

                normals.push(0, sign, 0);

                // uv

                uv.x = (cosTheta * 0.5) + 0.5;
                uv.y = (sinTheta * 0.5 * sign) + 0.5;
                uvs.push(uv.x, uv.y);

                // increase index

                index++;

            }

            // generate indices

            for (let x = 0; x < radialSegments; x++) {

                const c = centerIndexStart + x;
                const i = centerIndexEnd + x;

                if (top === true) {

                    // face top

                    indices.push(i, i + 1, c);

                } else {

                    // face bottom

                    indices.push(i + 1, i, c);

                }

                groupCount += 3;

            }

            // add a group to the geometry. this will ensure multi material support

            scope.addGroup(groupStart, groupCount, top === true ? 1 : 2);

            // calculate new start value for groups

            groupStart += groupCount;

        }

    }

    copy(source) {

        super.copy(source);

        this.parameters = Object.assign({}, source.parameters);

        return this;

    }

    static fromJSON(data) {

        return new PolyconeGeometry(data.numberZ, data.rInner, data.zArray, data.radialSegments, data.heightSegments, data.openEnded, data.thetaStart, data.thetaLength);

    }

}


export { PolyconeGeometry };
