import { Loader, LoaderUtils, FileLoader, Group, Vector3, BoxGeometry, Shape, Path, ExtrudeGeometry, SphereGeometry, ConeGeometry, TorusGeometry, PolyhedronGeometry, BufferGeometry, MeshPhongMaterial, MeshBasicMaterial, Mesh, CylinderGeometry, Matrix4, MeshStandardMaterial } from "three";
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

                    var pRMin = solid.getAttribute('rmin');
                    var pRMax = solid.getAttribute('rmax');
                    var pDz = solid.getAttribute('z');

                    var SPhi = solid.getAttribute('startphi');
                    var DPhi = solid.getAttribute('deltaphi');

                    if (aunit === 'rad') {
                        DPhi *= 180.0 / Math.PI;
                        DPhi *= 180.0 / Math.PI;
                    }

                    var material1 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    var material2 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    var material3 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const cylindergeometry1 = new CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
                    const cylindermesh1 = new Mesh(cylindergeometry1, material1);
                    cylindermesh1.rotateX(Math.PI / 2);
                    cylindermesh1.updateMatrix();

                    const cylindergeometry2 = new CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
                    const cylindermesh2 = new Mesh(cylindergeometry2, material2);
                    cylindermesh2.rotateX(Math.PI / 2);
                    cylindermesh2.updateMatrix();

                    const boxgeometry = new BoxGeometry(pRMax, pRMax, pDz);
                    const boxmesh = new Mesh(boxgeometry, material3);

                    boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
                    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
                    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);

                    let aCSG;
                    aCSG = MeshCSG1.subtract(MeshCSG2);

                    let bCSG;
                    bCSG = MeshCSG1.subtract(MeshCSG2);

                    if (DPhi > 270) {
                        let v_DPhi = 360 - DPhi;

                        boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - v_DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / 2;
                            boxmesh.rotateZ(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            bCSG = bCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateZ(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);
                        aCSG = aCSG.subtract(bCSG);

                    } else {

                        boxmesh.rotateZ(SPhi / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / (-2);
                            boxmesh.rotateZ(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            aCSG = aCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateZ(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                    }

                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aTubeGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'Tubs';

                    meshes[name] = finalMesh;
                    // var shape = new Shape();
                    // // x,y, radius, startAngle, endAngle, clockwise, rotation
                    // shape.absarc(0, 0, rmax, startphi, deltaphi, false);

                    // if (rmin > 0.0) {

                    //     var hole = new Path();
                    //     hole.absarc(0, 0, rmin, startphi, deltaphi, true);
                    //     shape.holes.push(hole);

                    // }

                    // var extrudeSettings = {
                    //     depth: z,//new version three.js use depth insted of amount.
                    //     steps: 1,
                    //     bevelEnabled: false,
                    //     curveSegments: 100 // set segment from 24 to 100
                    // };

                    // var geometry = new ExtrudeGeometry(shape, extrudeSettings);
                    // geometry.center();
                    // geometries[name] = geometry;

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

                    var pRmin1 = solid.getAttribute('rmin1');
                    var pRmax1 = solid.getAttribute('rmax1');

                    var pRmin2 = solid.getAttribute('rmin2');
                    var pRmax2 = solid.getAttribute('rmax2');

                    var pDz = solid.getAttribute('z');

                    var SPhi = solid.getAttribute('startphi');
                    var DPhi = solid.getAttribute('deltaphi');

                    var aunit = solid.getAttribute('aunit');

                    if (aunit === 'deg') {

                        SPhi *= Math.PI / 180.0;
                        DPhi *= Math.PI / 180.0;

                    }

                    var pRmin1 = 0.5, pRmax1 = 1, pRmin2 = 2, pRmax2 = 2.5, pDz = 4, SPhi = 0, DPhi = 270

                    const cylindergeometry1 = new CylinderGeometry(pRmin1, pRmin2, pDz, 32, 32, false, 0, Math.PI * 2);
                    const cylindermesh1 = new Mesh(cylindergeometry1, new MeshStandardMaterial());
                    cylindermesh1.rotateX(Math.PI / 2);
                    cylindermesh1.updateMatrix();

                    const cylindergeometry2 = new CylinderGeometry(pRmax1, pRmax2, pDz, 32, 32, false, 0, Math.PI * 2);
                    const cylindermesh2 = new Mesh(cylindergeometry2, new MeshStandardMaterial());
                    cylindermesh2.rotateX(Math.PI / 2);
                    cylindermesh2.updateMatrix();

                    const maxRadius = Math.max(pRmax1, pRmax2);
                    const boxgeometry = new BoxGeometry(maxRadius, maxRadius, pDz);
                    const boxmesh = new Mesh(boxgeometry, new MeshStandardMaterial());

                    boxmesh.geometry.translate(maxRadius / 2, maxRadius / 2, 0);
                    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
                    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);

                    let aCSG;

                    aCSG = MeshCSG2.subtract(MeshCSG1);

                    let bCSG;

                    bCSG = MeshCSG2.subtract(MeshCSG1);


                    if (DPhi > 270) {
                        let v_DPhi = 360 - DPhi;

                        boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - v_DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / 2;
                            boxmesh.rotateZ(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            bCSG = bCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateZ(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);
                        aCSG = aCSG.subtract(bCSG);

                    } else {

                        boxmesh.rotateZ(SPhi / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / (-2);
                            boxmesh.rotateZ(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            aCSG = aCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateZ(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                    }

                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'pRMax1': pRmax1, 'pRMin1': pRmin1, 'pRMax2': pRmax2, 'pRMin2': pRmin2, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aConeGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'Cone';

                    meshes[name] = finalMesh;

                    // Note: ConeGeometry in assumes inner radii of 0 and rmax1 = 0
                    // radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength
                    // var cone = new ConeGeometry(rmax2, z, 32, 1, false, startphi, deltaphi);
                    // geometries[name] = cone;

                }

                if (type === 'torus') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var pRMin = Number(solid.getAttribute('rmin'));
                    var pRMax = Number(solid.getAttribute('rmax'));
                    var pRtor = Number(solid.getAttribute('rtor'));
                    var SPhi = (solid.getAttribute('startphi'));
                    var DPhi = (solid.getAttribute('deltaphi'));

                    console.log(SPhi, DPhi)
                    var aunit = solid.getAttribute('aunit');

                    if (aunit === 'rad') {

                        SPhi *= 180.0 / Math.PI;
                        DPhi *= 180.0 / Math.PI;

                    }

                    // const pRMin = 1, pRMax = 1.5, pRtor = 5, SPhi = 0, DPhi = 90;


                    const torgeometry1 = new TorusGeometry(pRtor, pRMax, 16, 48);
                    const tormesh1 = new Mesh(torgeometry1, new MeshStandardMaterial());
                    tormesh1.rotateX(Math.PI / 2);
                    tormesh1.updateMatrix();

                    const torgeometry2 = new TorusGeometry(pRtor, pRMin, 16, 48);
                    const tormesh2 = new Mesh(torgeometry2, new MeshStandardMaterial());
                    tormesh2.rotateX(Math.PI / 2);
                    tormesh2.updateMatrix();

                    const boxgeometry = new BoxGeometry(pRtor + pRMax, pRtor + pRMax, pRtor + pRMax);
                    const boxmesh = new Mesh(boxgeometry, new MeshStandardMaterial());

                    boxmesh.geometry.translate((pRtor + pRMax) / 2, 0, (pRtor + pRMax) / 2);
                    const MeshCSG1 = CSG.fromMesh(tormesh1);
                    const MeshCSG2 = CSG.fromMesh(tormesh2);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);

                    let aCSG;
                    aCSG = MeshCSG1.subtract(MeshCSG2);

                    let bCSG;
                    bCSG = MeshCSG1.subtract(MeshCSG2);

                    if (DPhi > 270) {
                        let v_DPhi = 360 - DPhi;

                        boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - v_DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / 2;
                            boxmesh.rotateY(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            bCSG = bCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateY(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);
                        aCSG = aCSG.subtract(bCSG);

                    } else {

                        boxmesh.rotateY(SPhi / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / (-2);
                            boxmesh.rotateY(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            aCSG = aCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateY(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                    }

                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pRTor': pRtor, 'pSPhi': SPhi, 'pDPhi': DPhi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aTorusGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'aTorus';

                    meshes[name] = finalMesh;

                    // Note: There is no inner radius for a TorusGeometry
                    // and start phi is always 0.0
                    // radius, tube, radialSegments, tubularSegments, arc
                    // var torus = new TorusGeometry(1.0 * rtor, rmax, 16, 100, deltaphi);
                    // geometries[name] = torus;

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

                    } else {
                        var anchor = v1;
                        var p2 = v2;
                        var p3 = v3;
                        var p4 = v4;

                        function getArray(string) {
                            return string.split(",").map(Number);
                            // return string.join("").match(/-?(?:\d+\.\d*|\.\d+|\d+)/g);
                        }

                        anchor = getArray(anchor);
                        p2 = getArray(p2);
                        p3 = getArray(p3);
                        p4 = getArray(p4);

                        var vertices = [], indices = [];
                        vertices.push(...anchor, ...p2, ...p3, ...p4);
                        indices.push(0, 1, 2, 0, 2, 1, 0, 2, 3, 0, 3, 2, 0, 1, 3, 0, 3, 1, 1, 2, 3, 1, 3, 2);

                        // vertices = vertices.join("").match(/-?(?:\d+\.\d*|\.\d+|\d+)/g);
                        console.log(vertices)
                        const geometry = new PolyhedronGeometry(vertices, indices);
                        const param = { 'anchor': anchor, 'p2': p2, 'p3': p3, 'p4': p4 };
                        geometry.parameters = param;
                        geometry.type = 'aTetrahedraGeometry';
                        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
                        mesh.name = 'Tetrahedra';
                        mesh.rotateX(Math.PI / 2);
                        mesh.updateMatrix();

                        meshes[name] = mesh;
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

                    const param = { 'dx1': x1, 'dy1': y1, 'dz': z, 'dx2': x2, 'dy2': y2 };
                    trd.parameters = param;
                    trd.type = 'aTrapeZoidGeometry';
                    
                    // trd.computeVertexNormals();
                    geometries[name] = trd;
                }

                if (type === 'eltube') {

                    name = solid.getAttribute('name');
                    //console.log(type, name);

                    var xSemiAxis = solid.getAttribute('dx');
                    var semiAxisY = solid.getAttribute('dy');
                    var Dz = solid.getAttribute('dz');

                    // var shape = new Shape();
                    // // x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation
                    // shape.absellipse(0, 0, dx, dy, 0.0, 2 * Math.PI, false, 0);

                    // var extrudeSettings = {
                    //     amount: 2 * dz,
                    //     steps: 1,
                    //     bevelEnabled: false,
                    //     curveSegments: 24
                    // };
                    // var geometry = new ExtrudeGeometry(shape, extrudeSettings);
                    // geometry.center();
                    // geometries[name] = geometry;

                    // var xSemiAxis = 1, semiAxisY = 2, Dz = 4;

                    const cylindergeometry1 = new CylinderGeometry(xSemiAxis, xSemiAxis, Dz, 32, 1, false, 0, Math.PI * 2);
                    const cylindermesh = new Mesh(cylindergeometry1, new MeshStandardMaterial());
                    const ratioZ = semiAxisY / xSemiAxis;
                    cylindermesh.scale.z = ratioZ;
                    cylindermesh.updateMatrix();
                    const aCSG = CSG.fromMesh(cylindermesh);
		            const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'xSemiAxis': xSemiAxis, 'semiAxisY': semiAxisY, 'Dz': Dz };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aEllipticalCylinderGeometry';
                    finalMesh.rotateX(Math.PI / 2);
                    finalMesh.updateMatrix();
                    finalMesh.name = 'EllipeCylnder';

                    meshes[name] = finalMesh;
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
                    let xSemiAxis = Number(solid.getAttribute('ax'));
                    let ySemiAxis = Number(solid.getAttribute('by'));
                    let zSemiAxis = Number(solid.getAttribute('cz'));
                    let zBottomCut = Number(solid.getAttribute('zcut2'));
                    let zTopCut = Number(solid.getAttribute('zcut1'));

                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });
                    
                    const cylindergeometry1 = new CylinderGeometry(xSemiAxis, xSemiAxis, zTopCut - zBottomCut, 32, 256, false, 0, Math.PI * 2);
            
                    cylindergeometry1.translate(0, (zTopCut + zBottomCut)/2, 0);
            
                    let positionAttribute = cylindergeometry1.getAttribute('position');
            
                    let vertex = new Vector3();
            
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
            
                    const cylindermesh = new Mesh(cylindergeometry1, material);
            
                    const finalMesh = cylindermesh;
                    const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'zSemiAxis': zSemiAxis, 'zTopCut': zTopCut, 'zBottomCut': zBottomCut };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aEllipsoidGeometry';
                    finalMesh.rotateX(Math.PI / 2);
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

                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const cylindergeometry1 = new CylinderGeometry(xSemiAxis * ((height - zTopCut) / height), xSemiAxis, zTopCut, 32, 32, false, 0, Math.PI * 2);
                    cylindergeometry1.translate(0, zTopCut / 2, 0)
                    const cylindermesh = new Mesh(cylindergeometry1, material);
                    const ratioZ = ySemiAxis / xSemiAxis;

                    cylindermesh.scale.z = ratioZ;
                    cylindermesh.updateMatrix();
                    const aCSG = CSG.fromMesh(cylindermesh);
                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());

                    const param = { 'xSemiAxis': xSemiAxis, 'ySemiAxis': ySemiAxis, 'height': height, 'zTopCut': zTopCut };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aEllipticalConeGeometry';
                    finalMesh.rotateX(Math.PI / 2);
                    finalMesh.updateMatrix();
                    finalMesh.name = 'aEllipticalCone';
                    meshes[name] = finalMesh;

                }

                if (type === 'paraboloid') {
                    name = solid.getAttribute('name');
                    let radius1 = solid.getAttribute('rlo');
                    let radius2 = solid.getAttribute('rhi');
                    let pDz = solid.getAttribute('dz');

                    console.log(radius1, radius2, pDz);

                    const k2 = (Math.pow(radius1, 2) + Math.pow(radius2, 2)) / 2, k1 = (Math.pow(radius2, 2) - Math.pow(radius1, 2)) / pDz;

                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });
                    
                    const cylindergeometry1 = new CylinderGeometry(radius2, radius1, pDz, 32, 32, false, 0, Math.PI * 2);

                    // cylindergeometry1.translate(0, zTopCut + zBottomCut, 0);

                    let positionAttribute = cylindergeometry1.getAttribute('position');

                    let vertex = new Vector3();

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

                    const cylindermesh = new Mesh(cylindergeometry1, material);

                    const finalMesh = cylindermesh;
                    const param = { 'R1': radius1, 'R2': radius2, 'pDz': pDz };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aParaboloidGeometry';
                    finalMesh.rotateX(Math.PI / 2);
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

                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const maxRadius = Math.max(dx, dy, dz);
                    const geometry = new BoxGeometry(2 * maxRadius, 2 * maxRadius, 2 * maxRadius, 1, 1, 1);
                    const mesh = new Mesh(geometry, material);

                    const boxgeometry = new BoxGeometry(4 * maxRadius, 4 * maxRadius, 4 * maxRadius);
                    const boxmesh = new Mesh(boxgeometry, material);

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

                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'dx': dx, 'dy': dy, 'dz': dz, 'alpha': alpha, 'theta': theta, 'phi': phi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aParallGeometry';
                    finalMesh.rotateX(Math.PI / 2);
                    finalMesh.updateMatrix();
                    finalMesh.name = 'Parallelepiped';

                    meshes[name] = finalMesh;

                }

                if (type === 'polycone') {
                    name = solid.getAttribute('name');
                    
                    let SPhi = solid.getAttribute('startphi');
                    let DPhi = solid.getAttribute('deltaphi');
                    let zplanes = solid.querySelectorAll('zplane');
                    let numZPlanes = zplanes.length;
                    let rInner = [];
                    let rOuter = [];
                    let z = [];

                    console.log(
                        solid, zplanes
                    )
                    for (var j = 0; j < zplanes.length; j++) {
                        const rmin = zplanes[j].getAttribute('rmin');
                        const rmax = zplanes[j].getAttribute('rmax');
                        const zvalue = zplanes[j].getAttribute('z');
                        rInner.push (rmin);
                        rOuter.push(rmax);
                        z.push(zvalue);
                    }

                    
                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, SPhi/180*Math.PI, DPhi/180*Math.PI);

                    const meshOut = new Mesh(geometryOut, material);
                    let maxWidth = Math.max(...rOuter);
                    let maxHeight = Math.max(...z);

                    const boxgeometry = new BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);

                    const boxmesh = new Mesh(boxgeometry, material);
                    boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

                    let MeshCSG1 = CSG.fromMesh(meshOut);

                    const finalMesh = CSG.toMesh(MeshCSG1, new Matrix4());
                    const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.computeVertexNormals();
                    finalMesh.geometry.type = 'aPolyconeGeometry';
                    finalMesh.name = 'Polycone';
                    finalMesh.updateMatrix();

                    meshes[name] = finalMesh;
                }

                if (type === 'genericPolycone') {
                    name = solid.getAttribute('name');
                    
                    let SPhi = solid.getAttribute('startphi');
                    let DPhi = solid.getAttribute('deltaphi');
                    let zplanes = solid.querySelectorAll('zplane');
                    let numZPlanes = zplanes.length;
                    let rInner = [];
                    let rOuter = [];
                    let z = [];


                    for (var j = 0; j < zplanes.length; j++) {
                        const rmax = zplanes[j].getAttribute('rmax');
                        const zvalue = zplanes[j].getAttribute('z');
                        rInner.push (0.01);
                        rOuter.push(rmax);
                        z.push(zvalue);
                    }

                    
                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 1, false, SPhi/180*Math.PI, DPhi/180*Math.PI);

                    const meshOut = new Mesh(geometryOut, material);
                    let maxWidth = Math.max(...rOuter);
                    let maxHeight = Math.max(...z);

                    const boxgeometry = new BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);

                    const boxmesh = new Mesh(boxgeometry, material);
                    boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);

                    let MeshCSG1 = CSG.fromMesh(meshOut);

                    const finalMesh = CSG.toMesh(MeshCSG1, new Matrix4());
                    const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.computeVertexNormals();
                    finalMesh.geometry.type = 'aPolyconeGeometry';
                    finalMesh.name = 'Polycone';
                    finalMesh.updateMatrix();

                    meshes[name] = finalMesh;

                }

                if (type === 'polyhedra') {
                    name = solid.getAttribute('name');

                    let SPhi = solid.getAttribute('startphi');
                    let DPhi = solid.getAttribute('deltaphi');
                    let numSide = solid.getAttribute('numsides');
                    let zplanes = solid.querySelectorAll('zplane');
                    let numZPlanes = zplanes.length;
                    let rInner = [];
                    let rOuter = [];
                    let z = [];

                    for (let j = 0; j < numZPlanes; j++) {
                        const rmin = zplanes[j].getAttribute('rmin');
                        const rmax = zplanes[j].getAttribute('rmax');
                        const zvalue = zplanes[j].getAttribute('z');

                        rInner.push(rmin);
                        rOuter.push(rmax);
                        z.push(zvalue);
                    }
                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI);

                    const meshOut = new Mesh(geometryOut, material);

                    let MeshCSG1 = CSG.fromMesh(meshOut);

                    const finalMesh = CSG.toMesh(MeshCSG1, new Matrix4());
                    const param = { 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.computeVertexNormals();
                    finalMesh.geometry.type = 'aPolyhedraGeometry';
                    finalMesh.name = 'Polyhedra';
                    finalMesh.updateMatrix();

                    meshes[name] = finalMesh;
                }

                if (type === 'genericPolyhedra') {
                    name = solid.getAttribute('name');

                    let SPhi = solid.getAttribute('startphi');
                    let DPhi = solid.getAttribute('deltaphi');
                    let numSide = solid.getAttribute('numsides');
                    let zplanes = solid.querySelectorAll('zplane');
                    let numZPlanes = zplanes.length;
                    let rInner = [];
                    let rOuter = [];
                    let z = [];

                    for (let j = 0; j < numZPlanes; j++) {
                        const rmax = zplanes[j].getAttribute('rmax');
                        const zvalue = zplanes[j].getAttribute('z');

                        rInner.push(0.01);
                        rOuter.push(rmax);
                        z.push(zvalue);
                    }

                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, numSide, 1, false, SPhi / 180 * Math.PI, DPhi / 180 * Math.PI);

                    const meshOut = new Mesh(geometryOut, material);

                    let MeshCSG1 = CSG.fromMesh(meshOut);

                    const finalMesh = CSG.toMesh(MeshCSG1, new Matrix4());
                    const param = { 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi, 'numSide': numSide };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.computeVertexNormals();
                    finalMesh.geometry.type = 'aPolyhedraGeometry';
                    finalMesh.name = 'Polyhedra';
                    finalMesh.updateMatrix();

                    meshes[name] = finalMesh;
                }

                if (type === 'trap') {
                    name = solid.getAttribute('name');

                    let pDx1 = Number(solid.getAttribute('x1'));
                    let pDx2 = Number(solid.getAttribute('x2'));
                    let pDx3 = Number(solid.getAttribute('x3'));
                    let pDx4 = Number(solid.getAttribute('x4'));
                    let pDy1 = Number(solid.getAttribute('y1'));
                    let pDy2 = Number(solid.getAttribute('y2'));
                    let pDz = Number(solid.getAttribute('z'));
                    let pTheta = solid.getAttribute('theta');
                    let pPhi = solid.getAttribute('phi');
                    let pAlpha = solid.getAttribute('alpha1');

                    const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
                    const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);

                    var material1 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    var material2 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    console.log(dy, maxWidth, pDx1, pDx2, pDx3, pDx4, pDy1, pDy2,pDz, pTheta, pAlpha, pPhi)
                    
                    const geometry = new BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
                    const mesh = new Mesh(geometry, material1);

                    const boxgeometry = new BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth);
                    const boxmesh = new Mesh(boxgeometry, material2);

                    let MeshCSG1 = CSG.fromMesh(mesh);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);

                    boxmesh.geometry.translate(2 * maxWidth, 0, 0);
                    boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
                    boxmesh.position.set(0 + dx / 2, 0, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    let aCSG = MeshCSG1.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
                    boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
                    boxmesh.position.set(0 - dx / 2, 0, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
                    boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
                    boxmesh.position.set(0, 0, dy);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
                    boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
                    boxmesh.position.set(0, 0, -dy);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);


                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aTrapeZoidPGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'aTrapeZoidP';

                    meshes[name] = finalMesh;
                }

                if (type === 'hype') {
                    name = solid.getAttribute('name');

                    let radiusIn = solid.getAttribute('rmin');
                    let radiusOut = solid.getAttribute('rmax');
                    let stereo1 = solid.getAttribute('outst');
                    let stereo2 = solid.getAttribute('inst');
                    let pDz = solid.getAttribute('z');

                    const c_z1 = Math.tan(stereo1 * Math.PI / 180 / 2);
                    const c_z2 = Math.tan(stereo2 * Math.PI / 180 / 2);
                    const cylindergeometry1 = new CylinderGeometry(radiusOut, radiusOut, pDz, 32, 16, false, 0, Math.PI * 2);
                    const cylindergeometry2 = new CylinderGeometry(radiusIn, radiusIn, pDz, 32, 16, false, 0, Math.PI * 2);

                    let positionAttribute = cylindergeometry1.getAttribute('position');
                    let positionAttribute2 = cylindergeometry2.getAttribute('position');
                    let vertex = new Vector3();
                    let vertex2 = new Vector3();

                    for (let i = 0; i < positionAttribute.count; i++) {

                        vertex.fromBufferAttribute(positionAttribute, i);
                        vertex2.fromBufferAttribute(positionAttribute2, i);
                        let x, y, z, x2, y2, z2;
                        x = vertex.x;
                        y = vertex.y;
                        z = vertex.z;
                        x2 = vertex2.x;
                        y2 = vertex2.y;
                        z2 = vertex2.z;
                        let r = radiusOut * Math.sqrt((1 + Math.pow((y / c_z1), 2)));
                        let r2 = radiusIn * Math.sqrt((1 + Math.pow((y2 / c_z2), 2)));

                        let alpha = Math.atan(z / x) ? Math.atan(z / x) : cylindergeometry1.attributes.position.array[i * 3 + 2] >= 0 ? Math.PI / 2 : Math.PI / (-2);

                        if (vertex.z >= 0) {
                            z = Math.abs(r * Math.sin(alpha));
                            z2 = Math.abs(r2 * Math.sin(alpha));
                        } else {
                            z = - Math.abs(r * Math.sin(alpha));
                            z2 = - Math.abs(r2 * Math.sin(alpha));
                        }
                        if (vertex.x >= 0) {
                            x = r * Math.cos(alpha);
                            x2 = r2 * Math.cos(alpha);
                        } else {
                            x = -r * Math.cos(alpha);
                            x2 = -r2 * Math.cos(alpha);
                        }

                        cylindergeometry1.attributes.position.array[i * 3] = x;
                        cylindergeometry1.attributes.position.array[i * 3 + 1] = y;
                        cylindergeometry1.attributes.position.array[i * 3 + 2] = z;


                        cylindergeometry2.attributes.position.array[i * 3] = x2;
                        cylindergeometry2.attributes.position.array[i * 3 + 1] = y2;
                        cylindergeometry2.attributes.position.array[i * 3 + 2] = z2;

                    }
                    cylindergeometry1.attributes.position.needsUpdate = true;
                    cylindergeometry2.attributes.position.needsUpdate = true;

                    var material1 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    var material2 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const cylindermesh = new Mesh(cylindergeometry1, material1);
                    const cylindermesh2 = new Mesh(cylindergeometry2, material2);

                    const MeshCSG1 = CSG.fromMesh(cylindermesh);
                    const MeshCSG2 = CSG.fromMesh(cylindermesh2);

                    let aCSG = MeshCSG1.subtract(MeshCSG2);

                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());

                    const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pDz };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aHyperboloidGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'Hyperboloid';

                    meshes[name] = finalMesh;
                }

                if (type === 'cutTube') {
                    name = solid.getAttribute('name');

                    let pRMin = solid.getAttribute('rmin');
                    let pRMax = solid.getAttribute('rmax');
                    let pDz = solid.getAttribute('z');
                    let SPhi = solid.getAttribute('startphi');
                    let DPhi = solid.getAttribute('deltaphi');
                    let pLowNorm = new Vector3();
                    pLowNorm.x = solid.getAttribute('lowX');
                    pLowNorm.y = solid.getAttribute('lowY');
                    pLowNorm.z = solid.getAttribute('lowZ');

                    let pHighNorm = new Vector3();
                    pHighNorm.x = solid.getAttribute('highX');
                    pHighNorm.y = solid.getAttribute('highY');
                    pHighNorm.z = solid.getAttribute('highZ');

                    function CutTube_vectorVal(vector) {
                        if (CutTube_vectorVertical(vector)) {
                            return true;
                        } else if ((vector.x * vector.y) === 0 && (vector.x * vector.z) === 0 && (vector.y * vector.z) === 0) {
                            return false;
                        } else if (vector.y === 0) {
                            return false;
                        } else return true;
                    }
            
                    function CutTube_vectorVertical(vector) {
                        if (vector.y !== 0 && vector.x === 0 && vector.z === 0) {
                            return true;
                        } else return false;
                    }
            
                    if (CutTube_vectorVal(pLowNorm) === false || CutTube_vectorVal(pHighNorm) === false) return;
            
                    const cylindergeometry1 = new CylinderGeometry(pRMax, pRMax, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
                    const cylindermesh1 = new Mesh(cylindergeometry1, new MeshStandardMaterial());
                    cylindermesh1.rotateX(Math.PI / 2);
                    cylindermesh1.updateMatrix();
            
                    const cylindergeometry2 = new CylinderGeometry(pRMin, pRMin, pDz * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
                    const cylindermesh2 = new Mesh(cylindergeometry2, new MeshStandardMaterial());
                    cylindermesh2.rotateX(Math.PI / 2);
                    cylindermesh2.updateMatrix();
            
                    const maxdis = Math.max(pRMax, pRMin, pDz);
            
                    const boxgeometry1 = new BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
                    const boxmesh1 = new Mesh(boxgeometry1, new MeshStandardMaterial());
            
                    const boxgeometry2 = new BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
                    const boxmesh2 = new Mesh(boxgeometry2, new MeshStandardMaterial());
            
                    const boxgeometry = new BoxGeometry(pRMax, pRMax, 2 * Math.sqrt(2) * maxdis);
                    const boxmesh = new Mesh(boxgeometry, new MeshStandardMaterial());
            
            
                    boxmesh1.geometry.translate(0, 0, Math.sqrt(2) * maxdis);
                    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
                    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
                    let MeshCSG3 = CSG.fromMesh(boxmesh1);
            
                    let aCSG;
                    aCSG = MeshCSG1.subtract(MeshCSG2);
            
            
                    if (CutTube_vectorVertical(pHighNorm) === false) {
            
                        let rotateX = Math.atan(pHighNorm.z / pHighNorm.y);
                        let rotateY = Math.atan(pHighNorm.x / pHighNorm.y);
                        let rotateZ = Math.atan(pHighNorm.z / pHighNorm.x);
            
                        if (rotateX === Infinity) rotateX = boxmesh1.rotation.x;
                        if (rotateY === Infinity) rotateY = boxmesh1.rotation.y;
                        if (rotateZ === Infinity) rotateZ = boxmesh1.rotation.z;
            
                        boxmesh1.rotation.set(-rotateX, -rotateY, -rotateZ);
                    }
            
                    boxmesh1.position.set(0, 0, maxdis / 2);
                    boxmesh1.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh1);
            
                    aCSG = aCSG.subtract(MeshCSG3);
            
                    boxmesh2.geometry.translate(0, 0, -Math.sqrt(2) * pDz);
                    if (!CutTube_vectorVertical(pLowNorm)) {
            
                        let rotateX = Math.atan(pLowNorm.z / pLowNorm.y);
                        let rotateY = Math.atan(pLowNorm.x / pLowNorm.y);
                        let rotateZ = Math.atan(pLowNorm.z / pLowNorm.x);
            
                        if (rotateX === Infinity) rotateX = boxmesh2.rotation.x;
                        if (rotateY === Infinity) rotateY = boxmesh2.rotation.y;
                        if (rotateZ === Infinity) rotateZ = boxmesh2.rotation.z;
            
                        boxmesh2.rotation.set(-rotateX, -rotateY, -rotateZ);
                    }
            
                    boxmesh2.position.set(0, 0, -maxdis / 2);
                    boxmesh2.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh2);
            
                    aCSG = aCSG.subtract(MeshCSG3);
            
            
                    boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
                    let bCSG = aCSG;
            
                    if (DPhi > 270) {
                        let v_DPhi = 360 - DPhi;
            
                        boxmesh.rotateZ((SPhi + 90) / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);
            
                        let repeatCount = Math.floor((270 - v_DPhi) / 90);
            
                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / 2;
                            boxmesh.rotateZ(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            bCSG = bCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateZ(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);
                        aCSG = aCSG.subtract(bCSG);
            
                    } else {
            
                        boxmesh.rotateZ(SPhi / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);
            
                        let repeatCount = Math.floor((270 - DPhi) / 90);
            
                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / (-2);
                            boxmesh.rotateZ(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            aCSG = aCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateZ(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);
            
                    }
            
                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'pHighNorm': pHighNorm, 'pLowNorm': pLowNorm };
                    finalMesh.geometry.parameters = param;
                    finalMesh.geometry.type = 'aCutTubeGeometry';
                    finalMesh.updateMatrix();
                    finalMesh.name = 'CTubs';

                    meshes[name] = finalMesh;
                }

                if (type === 'twistedbox') {
                    name = solid.getAttribute('name');

                    let twistedangle = solid.getAttribute('PhiTwist');
                    let pDx = solid.getAttribute('x');
                    let pDy = solid.getAttribute('y');
                    let pDz = solid.getAttribute('z');
                    
                    const geometry = new BoxGeometry(pDx, pDy, pDz, 32, 32, 32);
                    geometry.type = 'aTwistedBoxGeometry';
                    const positionAttribute = geometry.getAttribute('position');

                    let vec3 = new Vector3();
                    let axis_vector = new Vector3(0, 1, 0);
                    for (let i = 0; i < positionAttribute.count; i++) {
                        vec3.fromBufferAttribute(positionAttribute, i);
                        vec3.applyAxisAngle(axis_vector, (vec3.y / pDy) * twistedangle / 180 * Math.PI);
                        geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
                    }

                    const param = { 'width': pDx, 'height': pDy, 'depth': pDz, 'angle': twistedangle };
                    geometry.parameters = param;

                    var material = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const mesh = new Mesh(geometry, material);
                    mesh.rotateX(Math.PI / 2);
                    mesh.updateMatrix();
                    mesh.name = 'TwistedBox';

                    meshes[name] = mesh;
                }

                if (type === 'twistedtrd') {
                    name = solid.getAttribute('name');

                    let dx1 = solid.getAttribute('x1');
                    let dx2 = solid.getAttribute('x2');
                    let dy1 = solid.getAttribute('y1');
                    let dy2 = solid.getAttribute('y2');
                    let twistedangle = solid.getAttribute('PhiTwist');
                    let dz = solid.getAttribute('z');
                    
                    const maxdis = Math.max(dx1, dy1, dx2, dy2, dz);
                    const maxwidth = Math.max(dx1, dy1, dx2, dy2);
                    var material1 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    var material2 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const geometry = new BoxGeometry(maxwidth, dz, maxwidth, 32, 32, 32);
                    const mesh = new Mesh(geometry, material1);
            
                    const boxgeometry = new BoxGeometry(maxdis * 2, maxdis * 2, maxdis * 2, 32, 32, 32);
                    const boxmesh = new Mesh(boxgeometry, material2);
            
                    let MeshCSG1 = CSG.fromMesh(mesh);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);
            
                    let alpha = Math.atan((dx1 - dx2) / 2 / dz);
                    let phi = Math.atan((dy1 - dy2) / 2 / dz);
            
                    boxmesh.geometry.translate(maxdis, maxdis, 0);
                    boxmesh.rotation.set(0, 0, phi);
                    boxmesh.position.set(0 + dx1 / 2, -dz / 2, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    let aCSG = MeshCSG1.subtract(MeshCSG3);
            
                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(-2 * maxdis, 0, 0);
                    boxmesh.rotation.set(0, 0, -phi);
                    boxmesh.position.set(0 - dx1 / 2, -dz / 2, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);
            
                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(maxdis, 0, maxdis);
                    boxmesh.rotation.set(-alpha, 0, 0);
                    boxmesh.position.set(0, -dz / 2, dy1 / 2);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);
            
                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(0, 0, -2 * maxdis);
                    boxmesh.rotation.set(alpha, 0, 0);
                    boxmesh.position.set(0, -dz / 2, -dy1 / 2);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);
            
                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'dx1': dx1, 'dy1': dy1, 'dz': dz, 'dx2': dx2, 'dy2': dy2, 'twistedangle': twistedangle };
                    finalMesh.geometry.parameters = param;
            
                    const positionAttribute = finalMesh.geometry.getAttribute('position');
            
                    let vec3 = new Vector3();
                    let axis_vector = new Vector3(0, 1, 0);
                    for (let i = 0; i < positionAttribute.count; i++) {
                        vec3.fromBufferAttribute(positionAttribute, i);
                        vec3.applyAxisAngle(axis_vector, (vec3.y / dz) * twistedangle / 180 * Math.PI);
                        finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
                    }
            
                    finalMesh.geometry.type = 'aTwistedTrdGeometry';
                    finalMesh.rotateX(Math.PI / 2);
                    finalMesh.updateMatrix();
                    finalMesh.name = 'TwistedTrapeZoid';

                    meshes[name] = finalMesh;
                }

                if (type === 'twistedtrap') {
                    name = solid.getAttribute('name');

                    let pDx1 = Number(solid.getAttribute('x1'));
                    let pDx2 = Number(solid.getAttribute('x2'));
                    let pDx3 = Number(solid.getAttribute('x3'));
                    let pDx4 = Number(solid.getAttribute('x4'));
                    let pDy1 = Number(solid.getAttribute('y1'));
                    let pDy2 = Number(solid.getAttribute('y2'));
                    let pDz = Number(solid.getAttribute('z'));
                    let twistedangle = solid.getAttribute('PhiTwist');
                    let pAlpha = solid.getAttribute('Alph');
                    let pTheta = solid.getAttribute('Theta');
                    let pPhi = solid.getAttribute('Phi');
                
                    const dx = (pDx1 + pDx2 + pDx3 + pDx4) / 4, dy = (pDy1 + pDy2) / 2, dz = pDz, alpha = pAlpha, theta = pTheta, phi = pPhi;
                    const maxWidth = Math.max(dx, pDx2, pDx3, pDx4);

                    var material1 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    var material2 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const geometry = new BoxGeometry(2 * maxWidth, dz, 2 * maxWidth, 1, 1, 1);
                    const mesh = new Mesh(geometry, material1);

                    const boxgeometry = new BoxGeometry(4 * maxWidth, 4 * dz, 4 * maxWidth, 32, 32, 32);
                    const boxmesh = new Mesh(boxgeometry, material2);

                    let MeshCSG1 = CSG.fromMesh(mesh);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);

                    boxmesh.geometry.translate(2 * maxWidth, 0, 0);
                    boxmesh.rotation.set(0, Math.atan((pDy2 - pDy1) / 2 / pDz) + phi / 180 * Math.PI, alpha / 180 * Math.PI + Math.atan((pDy1 - pDy2) / 2 / dz));
                    boxmesh.position.set(0 + dx / 2, 0, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    let aCSG = MeshCSG1.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(-4 * maxWidth, 0, 0);
                    boxmesh.rotation.set(0, Math.atan((pDy1 - pDy2) / 2 / pDz) - phi / 180 * Math.PI, alpha / 180 * Math.PI - Math.atan((pDy1 - pDy2) / 2 / dz));
                    boxmesh.position.set(0 - dx / 2, 0, 0);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(2 * maxWidth, 0, 2 * maxWidth);
                    boxmesh.rotation.set(-theta / 180 * Math.PI - Math.tan((pDx1 - pDx3) / 2 / pDz), 0, 0);
                    boxmesh.position.set(0, 0, dy);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);

                    boxmesh.rotation.set(0, 0, 0);
                    boxmesh.geometry.translate(0, 0, - 4 * maxWidth);
                    boxmesh.rotation.set(theta / 180 * Math.PI + Math.tan((pDx2 - pDx4) / 2 / pDz), 0, 0);
                    boxmesh.position.set(0, 0, -dy);
                    boxmesh.updateMatrix();
                    MeshCSG3 = CSG.fromMesh(boxmesh);
                    aCSG = aCSG.subtract(MeshCSG3);


                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'dx1': pDx1, 'dx2': pDx2, 'dy1': pDy1, 'dx3': pDx3, 'dx4': pDx4, 'dy2': pDy2, 'dz': pDz, 'alpha': alpha, 'theta': theta, 'phi': phi, 'twistedangle': twistedangle };
                    finalMesh.geometry.parameters = param;

                    const positionAttribute = finalMesh.geometry.getAttribute('position');

                    let vec3 = new Vector3();
                    let axis_vector = new Vector3(0, 1, 0);
                    for (let i = 0; i < positionAttribute.count; i++) {
                        vec3.fromBufferAttribute(positionAttribute, i);
                        vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
                        finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
                    }

                    finalMesh.geometry.type = 'aTwistedTrapGeometry';
                    finalMesh.rotateX(Math.PI / 2);
                    finalMesh.updateMatrix();
                    finalMesh.name = 'TwistedTrapeZoidP';

                    meshes[name] = finalMesh;
                }

                if (type === 'twistedtubs') {
                    name = solid.getAttribute('name');

                    let pRMin = solid.getAttribute('endinnerrad');
                    let pRMax = solid.getAttribute('endouterrad');
                    let pDz = solid.getAttribute('zlen');
                    let SPhi = 0
                    let DPhi = solid.getAttribute('phi');
                    let twistedangle = solid.getAttribute('twistedangle');

                    var material1 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    var material2 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });
                    
                    var material3 = new MeshPhongMaterial({
                        color: 0xffffff, //delete randomColor
                        transparent: true,
                        opacity: 0.6, //set opacity to 0.6
                        wireframe: false
                    });

                    const cylindergeometry1 = new CylinderGeometry(pRMax, pRMax, pDz, 32, 32, false, 0, Math.PI * 2);
                    const cylindermesh1 = new Mesh(cylindergeometry1, material1);

                    const cylindergeometry2 = new CylinderGeometry(pRMin, pRMin, pDz, 32, 32, false, 0, Math.PI * 2);
                    const cylindermesh2 = new Mesh(cylindergeometry2, material2);

                    const boxgeometry = new BoxGeometry(pRMax, pDz, pRMax, 32, 32, 32);
                    const boxmesh = new Mesh(boxgeometry, material3);

                    boxmesh.geometry.translate(pRMax / 2, 0, pRMax / 2);
                    const MeshCSG1 = CSG.fromMesh(cylindermesh1);
                    const MeshCSG2 = CSG.fromMesh(cylindermesh2);
                    let MeshCSG3 = CSG.fromMesh(boxmesh);

                    let aCSG;
                    aCSG = MeshCSG1.subtract(MeshCSG2);

                    let bCSG;
                    bCSG = MeshCSG1.subtract(MeshCSG2);

                    if (DPhi > 270) {
                        let v_DPhi = 360 - DPhi;

                        boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - v_DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / 2;
                            boxmesh.rotateY(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            bCSG = bCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateY(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        bCSG = bCSG.subtract(MeshCSG3);
                        aCSG = aCSG.subtract(bCSG);

                    } else {

                        boxmesh.rotateY(SPhi / 180 * Math.PI);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                        let repeatCount = Math.floor((270 - DPhi) / 90);

                        for (let i = 0; i < repeatCount; i++) {
                            let rotateVaule = Math.PI / (-2);
                            boxmesh.rotateY(rotateVaule);
                            boxmesh.updateMatrix();
                            MeshCSG3 = CSG.fromMesh(boxmesh);
                            aCSG = aCSG.subtract(MeshCSG3);
                        }
                        let rotateVaule = (-1) * (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
                        boxmesh.rotateY(rotateVaule);
                        boxmesh.updateMatrix();
                        MeshCSG3 = CSG.fromMesh(boxmesh);
                        aCSG = aCSG.subtract(MeshCSG3);

                    }

                    const finalMesh = CSG.toMesh(aCSG, new Matrix4());
                    const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'twistedangle': twistedangle };
                    finalMesh.geometry.parameters = param;

                    const positionAttribute = finalMesh.geometry.getAttribute('position');

                    let vec3 = new Vector3();
                    let axis_vector = new Vector3(0, 1, 0);
                    for (let i = 0; i < positionAttribute.count; i++) {
                        vec3.fromBufferAttribute(positionAttribute, i);
                        vec3.applyAxisAngle(axis_vector, (vec3.y / pDz) * twistedangle / 180 * Math.PI);
                        finalMesh.geometry.attributes.position.setXYZ(i, vec3.x, vec3.y, vec3.z);
                    }

                    finalMesh.geometry.type = 'aTwistedTubeGeometry';
                    finalMesh.rotateX(Math.PI / 2);
                    finalMesh.updateMatrix();
                    finalMesh.name = 'TwistedTubs';

                    meshes[name] = finalMesh;
                }
            }
            
            console.log(geometries, meshes)
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
            console.log(volumes)
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

                var newMesh;

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
                        newMesh = meshes[refs[volumeref]];

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
                if (newMesh) {
                    newMesh.visible = true;
                    newMesh.position.set(position.x, position.y, position.z);
                    newMesh.rotation.set(rotation.x, rotation.y, rotation.z);
                    group.add(newMesh);
                }
            }
            console.log(physvols)
        }

        function parseSetup() {
            var setup = GDML.querySelectorAll('setup');
            console.log(setup, GDML)
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