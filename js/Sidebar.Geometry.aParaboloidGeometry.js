import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

    const strings = editor.strings;

    const container = new UIDiv();

    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // radius1

    const radius1Row = new UIRow();
    const radius1I = new UINumber(parameters.R1).setRange(0, Infinity).onChange(update);

    radius1Row.add(new UIText(strings.getKey('sidebar/geometry/aparaboloid_geometry/r1')).setWidth('90px'));
    radius1Row.add(radius1I);

    radius1Row.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(radius1Row);

    // radius2

    const radius2Row = new UIRow();
    const radius2I = new UINumber(parameters.R2).setRange(0, Infinity).onChange(update);

    radius2Row.add(new UIText(strings.getKey('sidebar/geometry/aparaboloid_geometry/r2')).setWidth('90px'));
    radius2Row.add(radius2I);

    radius2Row.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(radius2Row);

    // height

    const dzRow = new UIRow();
    const dzI = new UINumber(parameters.pDz).setRange(0, Infinity).onChange(update);

    dzRow.add(new UIText(strings.getKey('sidebar/geometry/aparaboloid_geometry/height')).setWidth('90px'));
    dzRow.add(dzI);

    dzRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

    container.add(dzRow);
    //

    function update() {


        var radius1 = radius1I.getValue(), radius2 = radius2I.getValue(), pDz = dzI.getValue();
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

        finalMesh.geometry.name = object.geometry.name;
        
        editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

    }

    return container;

}

export { GeometryParametersPanel };
