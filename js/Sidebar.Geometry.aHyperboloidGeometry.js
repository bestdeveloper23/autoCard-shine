import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel( editor, object ) {

	const strings = editor.strings;

	const container = new UIDiv();

	const geometry = object.geometry;
	const parameters = geometry.parameters;

	// radius1

	const radius1Row = new UIRow();
	const radius1I = new UINumber( parameters.radiusOut ).setRange(0, Infinity).onChange( update );

	radius1Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/radiusout' ) ).setWidth( '90px' ) );
	radius1Row.add( radius1I );

    radius1Row.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

	container.add( radius1Row );

	// radius2

	const radius2Row = new UIRow();
	const radius2I = new UINumber( parameters.radiusIn ).setRange(0, Infinity).onChange( update );

	radius2Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/radiusin' ) ).setWidth( '90px' ) );
	radius2Row.add( radius2I );

    radius2Row.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

	container.add( radius2Row );

	
	// stereo1

	const stereo1Row = new UIRow();
	const stereo1I = new UINumber( parameters.stereo1 ).setRange(0, 180).onChange( update );

	stereo1Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/stereoout' ) ).setWidth( '90px' ) );
	stereo1Row.add( stereo1I );

	container.add( stereo1Row );

	// stereo2

	const stereo2Row = new UIRow();
	const stereo2I = new UINumber( parameters.stereo2 ).setRange(0, 180).onChange( update );

	stereo2Row.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/stereoin' ) ).setWidth( '90px' ) );
	stereo2Row.add( stereo2I );

	container.add( stereo2Row );

	// height
	
	const heightRow = new UIRow();
	const heightI = new UINumber( parameters.pDz ).setRange(0, Infinity).onChange( update );

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/ahyperboloid_geometry/height' ) ).setWidth( '90px' ) );
	heightRow.add( heightI );

    heightRow.add(new UIText(strings.getKey('sidebar/properties/unit')).setWidth('20px'));

	container.add( heightRow );


	function update() {


        var radiusOut = radius1I.getValue(), radiusIn = radius2I.getValue(), stereo1 = stereo1I.getValue(), stereo2 = stereo2I.getValue(), pDz = heightI.getValue();
        const c_z1 = Math.tan(stereo1 * Math.PI / 90);
        const c_z2 = Math.tan(stereo2 * Math.PI / 90);
        const cylindergeometry1 = new THREE.CylinderGeometry(radiusOut, radiusOut, pDz, 16, 8, false, 0, Math.PI * 2);
        const cylindergeometry2 = new THREE.CylinderGeometry(radiusIn, radiusIn, pDz, 16, 8, false, 0, Math.PI * 2);

        let positionAttribute = cylindergeometry1.getAttribute('position');
        let positionAttribute2 = cylindergeometry2.getAttribute('position');
        let vertex = new THREE.Vector3();
        let vertex2 = new THREE.Vector3();

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
            let r = radiusOut*Math.sqrt((1+ Math.pow((y/c_z1), 2)));
            let r2 = radiusIn*Math.sqrt((1+ Math.pow((y2/c_z2), 2)));

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

        const cylindermesh = new THREE.Mesh(cylindergeometry1, new THREE.MeshStandardMaterial());
        const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshStandardMaterial());

        const MeshCSG1 = CSG.fromMesh(cylindermesh);
        const MeshCSG2 = CSG.fromMesh(cylindermesh2);

        let aCSG;
        if(radiusIn === 0 ) {
            aCSG = MeshCSG1;
        } else {
            aCSG = MeshCSG1.subtract(MeshCSG2);
        }
        


        const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4());

        const param = { 'radiusOut': radiusOut, 'radiusIn': radiusIn, 'stereo1': stereo1, 'stereo2': stereo2, 'pDz': pDz };
        finalMesh.geometry.parameters = param;
        finalMesh.geometry.type = 'aHyperboloidGeometry';
        finalMesh.rotateX(Math.PI / 2);
        finalMesh.updateMatrix();

        finalMesh.geometry.name = object.geometry.name;
        
		editor.execute( new SetGeometryCommand( editor, object, finalMesh.geometry ) );

        radius1I.setRange(radiusIn + 0.001, Infinity);
        radius2I.setRange(0, radiusOut - 0.001);
        stereo1I.setRange(stereo2 + 0.001, Infinity);
        stereo2I.setRange(0, stereo1 - 0.001);

	}

	return container;

}

export { GeometryParametersPanel };
