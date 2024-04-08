import { Loader, LoaderUtils, FileLoader, Group, Vector3, BoxGeometry, Shape, Path, ExtrudeGeometry, SphereGeometry, ConeGeometry, TorusGeometry, BufferGeometry, MeshPhongMaterial, MeshBasicMaterial, Mesh } from "three";
import { CSG } from "./CSGMesh";
import { PolyconeGeometry } from "./geometry/PolyconeGeometry";

class GDMLLoader extends Loader {
    constructor(manager) {
        super(manager)
    }

    load(url, onLoad, onProgress, onError) {
        const scope = this;
        const path = (scope.path === '') ? LoaderUtils.extractUrlBase(url) : scope.path;

        const loader = new FileLoader(scope.manager);
        loader.setPath(scope.path);
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(url, function (text) {

            try {

                onLoad(scope.parse(text, path));

            } catch (e) {

                if (onError) {

                    onError(e);

                } else {

                    console.error(e);

                }

                scope.manager.itemError(url);

            }

        }, onProgress, onError);
    }
    parse(text, path) {
        const GDML = new DOMParser().parseFromString(text, 'text/xml');

        const group = new Group();
        let defines = {};
        let geometries = {};
        let refs = {};
        let meshes = {};

        function parseDefines() {
            var elements = GDML.querySelectorAll('define');
            var defs = elements[0].childNodes;
            var name = '';
            var value;

            for (var i = 0; i < defs.length; i++) {

                var nodeName = defs[i].nodeName;
                var def = defs[i];

                if (nodeName === 'constant') {

                    name = def.getAttribute('name');
                    value = def.getAttribute('value');

                }

                if (nodeName === 'position') {

                    name = def.getAttribute('name');

                    var x = def.getAttribute('x');

                    if (!x) {
                        x = 0.0;
                    }

                    var y = def.getAttribute('y');

                    if (!y) {
                        y = 0.0;
                    }

                    var z = def.getAttribute('z');

                    if (!z) {
                        z = 0.0;
                    }

                    var position = new Vector3(x, y, z);
                    defines[name] = position;

                }

                if (nodeName === 'rotation') {

                    // Note: need to handle constants
                    // before this can be implemented

                    name = def.getAttribute('name');

                    var x = def.getAttribute('x');
                    var y = def.getAttribute('y');
                    var z = def.getAttribute('z');

                }

                if (nodeName === 'quantity') {

                    // Note: need to handle units

                    name = def.getAttribute('name');
                    var type = def.getAttribute('type');

                }

                if (nodeName === 'expression') {

                    name = def.getAttribute('name');

                }

            }

        }

        function parseSolids() {
            var elements = GDML.querySelectorAll('solids');
            var solids = elements[0].childNodes;
            var name = '';

            for (var i = 0; i < solids.length; i++) {

                var type = solids[i].nodeName;
                var solid = solids[i];

                if (type === 'box') {

                    name = solid.getAttribute('name');
                    var x = solid.getAttribute('x');
                    var y = solid.getAttribute('y');
                    var z = solid.getAttribute('z');

                    if (defines[x]) {
                        x = defines[x];
                    }

                    if (defines[y]) {
                        y = defines[y];
                    }

                    if (defines[z]) {
                        z = defines[z];
                    }

                    // x,y,z in GDML are half-widths
                    var geometry = new BoxGeometry(2 * x, 2 * y, 2 * z);
                    geometries[name] = geometry;

                }

                if (type === 'tube') {

                    // Note: need to handle units
                    var aunit = solid.getAttribute('aunit');
                    var lunit = solid.getAttribute('lunit');

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var rmin = solid.getAttribute('rmin');
                    var rmax = solid.getAttribute('rmax');
                    var z = solid.getAttribute('z');

                    var startphi = solid.getAttribute('startphi');
                    var deltaphi = solid.getAttribute('deltaphi');

                    if (aunit === 'deg') {
                        startphi *= Math.PI / 180.0;
                        deltaphi *= Math.PI / 180.0;
                    }

                    var shape = new Shape();
                    // x,y, radius, startAngle, endAngle, clockwise, rotation
                    shape.absarc(0, 0, rmax, startphi, deltaphi, false);

                    if (rmin > 0.0) {

                        var hole = new Path();
                        hole.absarc(0, 0, rmin, startphi, deltaphi, true);
                        shape.holes.push(hole);

                    }

                    var extrudeSettings = {
                        depth: z,//new version three.js use depth insted of amount.
                        steps: 1,
                        bevelEnabled: false,
                        curveSegments: 100 // set segment from 24 to 100
                    };

                    var geometry = new ExtrudeGeometry(shape, extrudeSettings);
                    geometry.center();
                    geometries[name] = geometry;

                }

                if (type === 'sphere') {

                    name = solid.getAttribute('name');
                    var rmin = solid.getAttribute('rmin');
                    var rmax = solid.getAttribute('rmax');

                    var startphi = solid.getAttribute('startphi');
                    var deltaphi = solid.getAttribute('deltaphi');

                    var starttheta = solid.getAttribute('starttheta');
                    var deltatheta = solid.getAttribute('deltatheta');

                    var aunit = solid.getAttribute('aunit');

                    if (!rmin) {
                        rmin = 0.0;
                    }

                    if (!startphi) {
                        startphi = 0.0;
                    }

                    if (!starttheta) {
                        starttheta = 0.0;
                    }

                    if (aunit === 'deg') {

                        startphi *= Math.PI / 180.0;
                        deltaphi *= Math.PI / 180.0;

                        starttheta *= Math.PI / 180.0;
                        deltatheta *= Math.PI / 180.0;

                    }

                    // radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength
                    var sphere = new SphereGeometry(rmax, 32, 32, startphi, deltaphi, starttheta, deltatheta);
                    geometries[name] = sphere;

                }

                if (type === 'orb') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var r = solid.getAttribute('r');

                    var sphere = new SphereGeometry(r, 32, 32, 0.0, 2 * Math.PI, 0.0, Math.PI);
                    geometries[name] = sphere;

                }

                if (type === 'cone') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var rmin1 = solid.getAttribute('rmin1');
                    var rmax1 = solid.getAttribute('rmax1');

                    var rmin2 = solid.getAttribute('rmin2');
                    var rmax2 = solid.getAttribute('rmax2');

                    var z = solid.getAttribute('z');

                    var startphi = solid.getAttribute('startphi');
                    var deltaphi = solid.getAttribute('deltaphi');

                    var aunit = solid.getAttribute('aunit');

                    if (aunit === 'deg') {

                        startphi *= Math.PI / 180.0;
                        deltaphi *= Math.PI / 180.0;

                    }

                    // Note: ConeGeometry in THREE assumes inner radii of 0 and rmax1 = 0
                    // radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength
                    var cone = new ConeGeometry(rmax2, z, 32, 1, false, startphi, deltaphi);
                    geometries[name] = cone;

                }

                if (type === 'torus') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var rmin = solid.getAttribute('rmin');
                    var rmax = solid.getAttribute('rmax');
                    var rtor = solid.getAttribute('rtor');
                    var startphi = solid.getAttribute('startphi');
                    var deltaphi = solid.getAttribute('deltaphi');

                    var aunit = solid.getAttribute('aunit');

                    if (aunit === 'deg') {

                        startphi *= Math.PI / 180.0;
                        deltaphi *= Math.PI / 180.0;

                    }

                    // Note: There is no inner radius for a TorusGeometry
                    // and start phi is always 0.0
                    // radius, tube, radialSegments, tubularSegments, arc
                    var torus = new TorusGeometry(1.0 * rtor, rmax, 16, 100, deltaphi);
                    geometries[name] = torus;

                }

                if (type === 'tet') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var v1 = solid.getAttribute('vertex1');
                    var v2 = solid.getAttribute('vertex2');
                    var v3 = solid.getAttribute('vertex3');
                    var v4 = solid.getAttribute('vertex4');

                    if (defines[v1] && defines[v2] && defines[v3] && defines[v4]) {

                        v1 = defines[v1];
                        v2 = defines[v2];
                        v3 = defines[v3];
                        v4 = defines[v4];

                        var tet = new BufferGeometry();

                        const points = [
                            v1,
                            v4,
                            v2,

                            v3,
                            v4,
                            v1,

                            v2,
                            v3,
                            v1,

                            v4,
                            v3,
                            v2,
                        ]
                        // tet.vertices = [v1, v2, v3, v4];

                        // tet.faces.push(new Face3(0, 3, 1));
                        // tet.faces.push(new Face3(2, 3, 0));
                        // tet.faces.push(new Face3(1, 2, 0));
                        // tet.faces.push(new Face3(3, 2, 1));
                        tet.setFromPoints(points)
                        geometries[name] = tet;

                    }

                }

                if (type === 'trd') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var x1 = solid.getAttribute('x1');
                    var x2 = solid.getAttribute('x2');
                    var y1 = solid.getAttribute('y1');
                    var y2 = solid.getAttribute('y2');
                    var z = solid.getAttribute('z');

                    var trd = new BufferGeometry();

                    const points = [
                        new Vector3(-x2, -y2, z),//2
                        new Vector3(-x2, y2, z),//1
                        new Vector3(x2, y2, z),//0

                        new Vector3(x2, y2, z),//0
                        new Vector3(x2, -y2, z),//3
                        new Vector3(-x2, -y2, z),//2

                        new Vector3(x1, y1, -z),//4
                        new Vector3(-x1, y1, -z),//5
                        new Vector3(-x1, -y1, -z),//6

                        new Vector3(-x1, -y1, -z),//6
                        new Vector3(x1, -y1, -z),//7
                        new Vector3(x1, y1, -z),//4

                        new Vector3(x2, y2, z),//0
                        new Vector3(x1, y1, -z),//4
                        new Vector3(x1, -y1, -z),//7

                        new Vector3(x1, -y1, -z),//7
                        new Vector3(x2, -y2, z),//3
                        new Vector3(x2, y2, z),//0

                        new Vector3(-x2, y2, z),//1
                        new Vector3(-x2, -y2, z),//2
                        new Vector3(-x1, -y1, -z),//6

                        new Vector3(-x1, -y1, -z),//6
                        new Vector3(-x1, y1, -z),//5
                        new Vector3(-x2, y2, z),//1

                        new Vector3(-x2, y2, z),//1
                        new Vector3(-x1, y1, -z),//5
                        new Vector3(x1, y1, -z),//4

                        new Vector3(x1, y1, -z),//4
                        new Vector3(x2, y2, z),//0
                        new Vector3(-x2, y2, z),//1

                        new Vector3(-x2, -y2, z),//2
                        new Vector3(x2, -y2, z),//3
                        new Vector3(x1, -y1, -z),//7

                        new Vector3(x1, -y1, -z),//7
                        new Vector3(-x1, -y1, -z),//6
                        new Vector3(-x2, -y2, z),//2
                    ]

                    // trd.vertices.push(new Vector3(x2, y2, z));//0
                    // trd.vertices.push(new Vector3(-x2, y2, z));//1
                    // trd.vertices.push(new Vector3(-x2, -y2, z));//2
                    // trd.vertices.push(new Vector3(x2, -y2, z));//3
                    // trd.vertices.push(new Vector3(x1, y1, -z));//4
                    // trd.vertices.push(new Vector3(-x1, y1, -z));//5
                    // trd.vertices.push(new Vector3(-x1, -y1, -z));//6
                    // trd.vertices.push(new Vector3(x1, -y1, -z));//7

                    // trd.faces.push(new Face3(2, 1, 0));
                    // trd.faces.push(new Face3(0, 3, 2));

                    // trd.faces.push(new Face3(4, 5, 6));
                    // trd.faces.push(new Face3(6, 7, 4));

                    // trd.faces.push(new Face3(0, 4, 7));
                    // trd.faces.push(new Face3(7, 3, 0));

                    // trd.faces.push(new Face3(1, 2, 6));
                    // trd.faces.push(new Face3(6, 5, 1));

                    // trd.faces.push(new Face3(1, 5, 4));
                    // trd.faces.push(new Face3(4, 0, 1));

                    // trd.faces.push(new Face3(2, 3, 7));
                    // trd.faces.push(new Face3(7, 6, 2));

                    trd.setFromPoints(points);
                    // trd.computeVertexNormals();
                    geometries[name] = trd;
                }

                if (type === 'eltube') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var dx = solid.getAttribute('dx');
                    var dy = solid.getAttribute('dy');
                    var dz = solid.getAttribute('dz');

                    var shape = new Shape();
                    // x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation
                    shape.absellipse(0, 0, dx, dy, 0.0, 2 * Math.PI, false, 0);

                    var extrudeSettings = {
                        amount: 2 * dz,
                        steps: 1,
                        bevelEnabled: false,
                        curveSegments: 24
                    };

                    var geometry = new ExtrudeGeometry(shape, extrudeSettings);
                    geometry.center();
                    geometries[name] = geometry;

                }

                if (type === 'arb8') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var dz = solid.getAttribute('dz');

                    var v1x = solid.getAttribute('v1x');
                    var v1y = solid.getAttribute('v1y');

                    var v2x = solid.getAttribute('v2x');
                    var v2y = solid.getAttribute('v2y');

                    var v3x = solid.getAttribute('v3x');
                    var v3y = solid.getAttribute('v3y');

                    var v4x = solid.getAttribute('v4x');
                    var v4y = solid.getAttribute('v4y');

                    var v5x = solid.getAttribute('v5x');
                    var v5y = solid.getAttribute('v5y');

                    var v6x = solid.getAttribute('v6x');
                    var v6y = solid.getAttribute('v6y');

                    var v7x = solid.getAttribute('v7x');
                    var v7y = solid.getAttribute('v7y');

                    var v8x = solid.getAttribute('v8x');
                    var v8y = solid.getAttribute('v8y');

                    var trd = new BufferGeometry();

                    const points = [
                        new Vector3(v7x, v7y, z),//2
                        new Vector3(v6x, v6y, z),//1
                        new Vector3(v5x, v5y, z),//0

                        new Vector3(v5x, v5y, z),//0
                        new Vector3(v8x, v8y, z),//3
                        new Vector3(v7x, v7y, z),//2

                        new Vector3(v1x, v1y, -z),//4
                        new Vector3(v2x, v2y, -z),//5
                        new Vector3(v3x, v3y, -z),//6

                        new Vector3(v3x, v3y, -z),//6
                        new Vector3(v4x, v4y, -z),//7
                        new Vector3(v1x, v1y, -z),//4

                        new Vector3(v5x, v5y, z),//0
                        new Vector3(v1x, v1y, -z),//4
                        new Vector3(v4x, v4y, -z),//7

                        new Vector3(v4x, v4y, -z),//7
                        new Vector3(v8x, v8y, z),//3
                        new Vector3(v5x, v5y, z),//0

                        new Vector3(v6x, v6y, z),//1
                        new Vector3(v7x, v7y, z),//2
                        new Vector3(v3x, v3y, -z),//6

                        new Vector3(v3x, v3y, -z),//6
                        new Vector3(v2x, v2y, -z),//5
                        new Vector3(v6x, v6y, z),//1

                        new Vector3(v6x, v6y, z),//1
                        new Vector3(v2x, v2y, -z),//5
                        new Vector3(v1x, v1y, -z),//4

                        new Vector3(v1x, v1y, -z),//4
                        new Vector3(v5x, v5y, z),//0
                        new Vector3(v6x, v6y, z),//1

                        new Vector3(v7x, v7y, z),//2
                        new Vector3(v8x, v8y, z),//3
                        new Vector3(v4x, v4y, -z),//7

                        new Vector3(v4x, v4y, -z),//7
                        new Vector3(v3x, v3y, -z),//6
                        new Vector3(v7x, v7y, z),//2
                    ]

                    // trd.vertices.push(new Vector3(v5x, v5y, z));
                    // trd.vertices.push(new Vector3(v6x, v6y, z));
                    // trd.vertices.push(new Vector3(v7x, v7y, z));
                    // trd.vertices.push(new Vector3(v8x, v8y, z));

                    // trd.vertices.push(new Vector3(v1x, v1y, -z));
                    // trd.vertices.push(new Vector3(v2x, v2y, -z));
                    // trd.vertices.push(new Vector3(v3x, v3y, -z));
                    // trd.vertices.push(new Vector3(v4x, v4y, -z));

                    // trd.faces.push(new Face3(2, 1, 0));
                    // trd.faces.push(new Face3(0, 3, 2));

                    // trd.faces.push(new Face3(4, 5, 6));
                    // trd.faces.push(new Face3(6, 7, 4));

                    // trd.faces.push(new Face3(0, 4, 7));
                    // trd.faces.push(new Face3(7, 3, 0));

                    // trd.faces.push(new Face3(1, 2, 6));
                    // trd.faces.push(new Face3(6, 5, 1));

                    // trd.faces.push(new Face3(1, 5, 4));
                    // trd.faces.push(new Face3(4, 0, 1));

                    // trd.faces.push(new Face3(2, 3, 7));
                    // trd.faces.push(new Face3(7, 6, 2));

                    trd.setFromPoints(points);
                    geometries[name] = trd;

                }
                
                if (type === 'ellipsoid') {

                    name = solid.getAttribute('name');
                    let xSemiAxis = solid.getAttribute('ax');
                    let ySemiAxis = solid.getAttribute('by');
                    let zSemiAxis = solid.getAttribute('cz');
                    let zBottomCut = solid.getAttribute('zcut1');
                    let zTopCut = solid.getAttribute('zcut2');

                    
                    const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis, xSemiAxis, zTopCut - zBottomCut, 32, 256, false, 0, Math.PI * 2);
            
                    cylindergeometry1.translate(0, zTopCut + zBottomCut, 0);
            
                    let positionAttribute = cylindergeometry1.getAttribute('position');
            
                    let vertex = new THREE.Vector3();
            
                    function calculate_normal_vector(x, y, z, a, b, c) {
                        // Calculate the components of the normal vector
                        let nx = 2 * (x / a ** 2)
                        let ny = 2 * (y / b ** 2)
                        let nz = 2 * (z / c ** 2)
            
                        // Normalize the normal vector
                        let magnitude = Math.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
                        nx /= magnitude
                        ny /= magnitude
                        nz /= magnitude
                        let normal = { x: nx, y: ny, z: nz };
                        return normal;
                    }
                    for (let i = 0; i < positionAttribute.count; i++) {
            
                        vertex.fromBufferAttribute(positionAttribute, i);
                        let x, y, z;
                        x = vertex.x, y = vertex.y;
                        let k = 0;
                        do {
                            x = vertex.x + k;
                            if (Math.abs(x) < 0) {
                                x = vertex.x;
                                break;
                            }
                            if (vertex.z > 0) {
                                z = ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                            } else {
                                z = -ySemiAxis * Math.sqrt(1 - Math.pow(y / zSemiAxis, 2) - Math.pow(x / xSemiAxis, 2));
                            }
                            if (x > 0) {
                                k -= 0.01
                            } else {
                                k += 0.01;
                            }
            
                        } while (!z);
            
            
                        cylindergeometry1.attributes.position.array[i * 3] = x;
                        cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
                        cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;
            
                        let normal = calculate_normal_vector(x, y, z, xSemiAxis, zSemiAxis, ySemiAxis)
                        cylindergeometry1.attributes.normal.array[i * 3] = normal.x;
                        cylindergeometry1.attributes.normal.array[i * 3 + 1] = normal.y;
                        cylindergeometry1.attributes.normal.array[i * 3 + 2] = normal.z;
            
                    }
                    cylindergeometry1.attributes.position.needsUpdate = true;
            
                    const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
            
                    const finalMesh = cylindermesh;
                    const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'zSemiAxis': zSemiAxis, 'zTopCut': zTopCut, 'zBottomCut': zBottomCut };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aEllipsoidGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'Ellipsoid';
                    
                    meshes[name] = finalMesh;

                }

                if (type === 'elcone') {
                    name = solid.getAttribute('name');
                    let xSemiAxis = solid.getAttribute('dx');
                    let ySemiAxis = solid.getAttribute('dy');
                    var height = solid.getAttribute('zmax');
                    var zTopCut = solid.getAttribute('zcut');

                    const cylindergeometry1 = new THREE.CylinderGeometry(xSemiAxis * ((height - zTopCut) / height), xSemiAxis, zTopCut, 32, 32, false, 0, Math.PI * 2);
                    cylindergeometry1.translate(0, zTopCut / 2, 0)
                    const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
                    const ratioZ = ySemiAxis / xSemiAxis;

                    cylindermesh.scale.z = ratioZ;
                    cylindermesh.updateMatrix();
                    const aCSG = CSG.fromMesh(cylindermesh);
                    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

                    const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'height': height, 'zTopCut': zTopCut };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aEllipticalConeGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'aEllipticalCone';
                    meshes[name] = finalMesh;

                }

                if (type === 'paraboloid') {
                    name = solid.getAttribute('name');
                    let radius1 = solid.getAttribute('rlo');
                    let radius2 = solid.getAttribute('rhi');
                    let pDz = solid.getAttribute('dz');

                    const k2 = (Math.pow(radius1, 2) + Math.pow(radius2, 2)) / 2, k1 = (Math.pow(radius2, 2) - Math.pow(radius1, 2)) / pDz;

                    const cylindergeometry1 = new THREE.CylinderGeometry(radius2, radius1, pDz, 32, 32, false, 0, Math.PI * 2);

                    // cylindergeometry1.translate(0, zTopCut + zBottomCut, 0);

                    let positionAttribute = cylindergeometry1.getAttribute('position');

                    let vertex = new THREE.Vector3();

                    for (let i = 0; i < positionAttribute.count; i++) {

                        vertex.fromBufferAttribute(positionAttribute, i);
                        let x, y, z;
                        x = vertex.x;
                        y = vertex.y;
                        z = vertex.z;
                        let r = Math.sqrt((y * k1 + k2));

                        let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

                        if (vertex.z >= 0) {
                            z = Math.abs(r * Math.sin(alpha));
                        } else {
                            z = - Math.abs(r * Math.sin(alpha));
                        }
                        if (vertex.x >= 0) {
                            x = r * Math.cos(alpha);
                        } else {
                            x = -r * Math.cos(alpha);
                        }

                        cylindergeometry1.attributes.position.array[i * 3] = x;
                        cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
                        cylindergeometry1.attributes.position.array[i * 3 + 2] = z ? z : vertex.z;

                    }
                    cylindergeometry1.attributes.position.needsUpdate = true;

                    const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());

                    const finalMesh = cylindermesh;
                    const param = { 'R1': radius1, 'R2': radius2, 'pDz': pDz };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aParaboloidGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'Paraboloid';

                    meshes[name] = finalMesh;
                }

                if (type === 'para') {
                    name = solid.getAttribute('name');
                    let dx = solid.getAttribute('x');
                    let dy = solid.getAttribute('y');
                    let dz = solid.getAttribute('z');
                    let alpha = solid.getAttribute('alpha');
                    let theta = solid.getAttribute('theta');
                    let phi = solid.getAttribute('phi');

                    const maxRadius = Math.max(dx, dy, dz);
                    const geometry = new THREE.BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
                    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());

                    const boxgeometry = new THREE.BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
                    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());

                    let MeshCSG1 = CSG.fromMesh(mesh);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);

                    boxmesh.geometry.translate(2 * maxRadius, 0, 0);
                    boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
                    boxmesh.position.set(0 + dx / 2, 0, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    let aCSG = MeshCSG1.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(-4 * maxRadius, 0, 0);
                    boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
                    boxmesh.position.set(0 - dx / 2, 0, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(2 * maxRadius, 0, 2 * maxRadius);
                    boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
                    boxmesh.position.set(0, 0, dz / 2);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(0, 0, -4 * maxRadius);
                    boxmesh.rotation.set(alpha / 180 * Math.PI, phi / 180 * Math.PI, theta / 180 * Math.PI);
                    boxmesh.position.set(0, 0, -dz / 2);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(0, 2 * maxRadius, 2 * maxRadius);
                    boxmesh.position.set(0, dy / 2, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.geometry.translate(0, -4 * maxRadius, 0);
                    boxmesh.position.set(0, - dy / 2, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
                    const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': alpha, 'theta': theta, 'phi': phi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aParallGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'Parallelepiped';

                    meshes[name] = finalMesh;

                }

                if (type === 'polycone') {
                    name = solid.getAttribute('name');
                    
                    let SPhi = solid.getAttribute('startphi');
                    let DPhi = solid.getAttribute('deltaphi');
                    let zplanes = solid.childNodes;
                    let numZPlanes = solid.childNodes.length;
                    let rInner = [];
                    let rOuter = [];
                    let z = [];


                    for (var j = 0; j < zplanes.length; j++) {
                        const rmin = zplanes[j].getAttribute('rmin');
                        const rmax = zplanes[j].getAttribute('rmax');
                        const zvalue = zplanes[j].getAttribute('z');
                        rInner.push (rmin);
                        rOuter.push(rmax);
                        z.push(zvalue);
                    }

                    const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, SPhi/180*Math.PI, DPhi/180*Math.PI);

                    const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());
                    let maxWidth = Math.max(...rOuter);
                    let maxHeight = Math.max(...z);

                    const boxgeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);
                    const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());
                    boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

                    let MeshCSG1 = CSG.fromMesh(meshOut);

                    const finalMesh = CSG.toMesh(MeshCSG1, new THREE.Matrix4());
                    const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.computeVertexNormals();
                    finalMesh.geometry.type = 'aPolyconeGeometry';
                    finalMesh.name = 'Polycone';
                    finalMesh.updateMatrix();

                    meshes[name] = finalMesh;
                }
            }
        }

        function parseVolumes() {
            var volumes = GDML.querySelectorAll('volume');

            for (var i = 0; i < volumes.length; i++) {

                var name = volumes[i].getAttribute('name');
                var solidrefs = volumes[i].childNodes;

                for (var j = 0; j < solidrefs.length; j++) {

                    var type = solidrefs[j].nodeName;

                    if (type === 'solidref') {
                        var solidref = solidrefs[j].getAttribute('ref');
                        refs[name] = solidref;

                    }
                }
            }
        }

        function parsePhysVols() {
            var physvols = GDML.querySelectorAll('physvol');

            for (var i = 0; i < physvols.length; i++) {

                var name = physvols[i].getAttribute('name');

                if (!name) {
                    name = 'JDoe';
                }

                var children = physvols[i].childNodes;
                var volumeref = '';

                var position = new Vector3(0, 0, 0);
                var rotation = new Vector3(0, 0, 0);

                var geometry;

                var material = new MeshPhongMaterial({
                    color: 0xffffff, //delete randomColor
                    transparent: true,
                    opacity: 0.6, //set opacity to 0.6
                    wireframe: false
                });

                for (var j = 0; j < children.length; j++) {

                    var type = children[j].nodeName;

                    if (type === 'volumeref') {

                        var volumeref = children[j].getAttribute('ref');
                        geometry = geometries[refs[volumeref]];

                    }

                    if (type === 'positionref') {

                        var positionref = children[j].getAttribute('ref');
                        position = defines[positionref];

                    }

                    if (type === 'rotationref') {

                        var rotationref = children[j].getAttribute('ref');

                    }

                    if (type === 'position') {

                        var x = children[j].getAttribute('x');
                        var y = children[j].getAttribute('y');
                        var z = children[j].getAttribute('z');

                        // Note: how to handle units?
                        position.set(x, y, z);
                    }

                    if (type === 'rotation') {

                        var x = children[j].getAttribute('x') * Math.PI / 180.0;
                        var y = children[j].getAttribute('y') * Math.PI / 180.0;
                        var z = children[j].getAttribute('z') * Math.PI / 180.0;

                        rotation.set(x, y, z);
                    }

                }

                if (geometry) {
                    var mesh = new Mesh(geometry, material);
                    mesh.name = name;
                    mesh.visible = true;

                    mesh.position.set(position.x, position.y, position.z);
                    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
                    group.add(mesh);

                }
            }
        }

        function parseSetup() {
            var setup = GDML.querySelectorAll('setup');
            var worlds = setup[0].childNodes;

            for (var i = 0; i < worlds.length; i++) {

                var nodeName = worlds[i].nodeName;
                var node = worlds[i];

                if (nodeName === 'world') {

                    var volumeref = node.getAttribute('ref');
                    var solidref = refs[volumeref];

                    var geometry = geometries[solidref];
                    var material = new MeshBasicMaterial({
                        color: 0xcccccc,
                        wireframe: false,
                        transparent: true,
                        opacity: 0.5
                    });

                    var mesh = new Mesh(geometry, material);
                    mesh.name = nodeName;
                    mesh.visible = true;

                    mesh.position.set(0.0, 0.0, 0.0);
                    group.add(mesh);

                }

            }
        }

        parseDefines();
        parseSolids();
        parseVolumes();
        parsePhysVols();
        parseSetup();

        return group
    }

}


export { GDMLLoader }