import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { PolyconeGeometry } from './libs/geometry/PolyconeGeometry.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger, UIInput } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // sphi

    const sphiRow = new UIRow();
    const sphiI = new UINumber(parameters.SPhi).setStep(5).setRange(0, Infinity).onChange(update);

    sphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/sphi')).setWidth('90px'));
    sphiRow.add(sphiI);

    container.add(sphiRow);

    // dphi

    const dphiRow = new UIRow();
    const dphiI = new UINumber(parameters.DPhi).setStep(5).setRange(0, Infinity).onChange(update);

    dphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/dphi')).setWidth('90px'));
    dphiRow.add(dphiI);

    container.add(dphiRow);


    // z-count

    const znumberRow = new UIRow();
    const znumberI = new UIInteger(parameters.numZPlanes).setRange(2, Infinity).onChange(update);

    znumberRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/znumber')).setWidth('90px'));
    znumberRow.add(znumberI);

    container.add(znumberRow);


    // radius

    const radiusRow = new UIRow();
    const radius = new UIInput(parameters.rOuter).setWidth('150px').setFontSize('12px').onChange(update);

    radiusRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/radius')).setWidth('90px'));
    radiusRow.add(radius);

    container.add(radiusRow);

    // z

    const zpositionRow = new UIRow();
    const zposition = new UIInput(parameters.z).setWidth('150px').setFontSize('12px').onChange(update);

    zpositionRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/z')).setWidth('90px'));
    zpositionRow.add(zposition);

    container.add(zpositionRow);


    function update() {

        const SPhi = sphiI.getValue(), DPhi = dphiI.getValue(), numZPlanes = znumberI.getValue(), rInner_string = [0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01, 0.01], rOuter_string = radius.getValue().split(','), z_string = zposition.getValue().split(',');

        const rInner = rInner_string.map(item => parseFloat(item));
        const rOuter = rOuter_string.map(item => parseFloat(item));
        const z = z_string.map(item => parseFloat(item));

        if (rInner.some(item => item === 0) || rOuter.some(item => item === 0)) {
            return;
        }

        // const geometryIn = new PolyconeGeometry(numZPlanes, rInner, z, 32, 5, false);
        const geometryOut = new PolyconeGeometry(numZPlanes, rOuter, z, 32, 5, false);

        // const meshIn = new THREE.Mesh(geometryIn, new THREE.MeshStandardMaterial());
        const meshOut = new THREE.Mesh(geometryOut, new THREE.MeshStandardMaterial());
        let maxWidth = Math.max(...rOuter);
        let maxHeight = Math.max(...z);

        const boxgeometry = new THREE.BoxGeometry(maxWidth, maxHeight, maxWidth, 32, 32, 32);
        const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshStandardMaterial());
        boxmesh.geometry.translate(maxWidth / 2, maxHeight / 2, maxWidth / 2);
        let MeshCSG1 = CSG.fromMesh(meshOut);
        // let MeshCSG2 = CSG.fromMesh(meshIn);
        let MeshCSG3 = CSG.fromMesh(boxmesh);

        let aCSG;
        aCSG = MeshCSG1;

        let bCSG;
        bCSG = MeshCSG1;

        if (DPhi > 270 && DPhi< 360) {
            let v_DPhi = 360 - DPhi;
         
            boxmesh.rotateY((SPhi + 90) / 180 * Math.PI);
            boxmesh.updateMatrix();
            MeshCSG3 = CSG.fromMesh(boxmesh);
            bCSG = bCSG.subtract(MeshCSG3);
         
            let repeatCount = Math.floor((270 - v_DPhi) / 90);
         
            for (let i = 0; i < repeatCount; i++) {
             let rotateVaule = Math.PI / (2);
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
         
           } else if(DPhi <= 270) {
         
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
         

        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());
        const param = { 'rInner': rInner, 'rOuter': rOuter, 'z': z, 'numZPlanes': numZPlanes, 'SPhi': SPhi, 'DPhi': DPhi };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.computeVertexNormals();
        finalMesh.geometry.type = 'aPolyconeGeometry';

        editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

    }

    return container;

}

export { GeometryParametersPanel };

