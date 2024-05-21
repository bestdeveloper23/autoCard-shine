import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UIInteger, UICheckbox, UINumber } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';

function GeometryParametersPanel(editor, object) {

 const strings = editor.strings;

 const container = new UIDiv();

 const geometry = object.geometry;
 const parameters = geometry.parameters;

 // xSemiAxis

 const xSemiAxisRow = new UIRow();
 const xSemiAxisI = new UINumber(parameters.xSemiAxis).setRange(0, Infinity).onChange(update);

 xSemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/xSemiAxis')).setWidth('90px'));
 xSemiAxisRow.add(xSemiAxisI);

 xSemiAxisRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(xSemiAxisRow);

 // ySemiAxis

 const ySemiAxisRow = new UIRow();
 const ySemiAxisI = new UINumber(parameters.ySemiAxis).setRange(0, Infinity).onChange(update);

 ySemiAxisRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/ySemiAxis')).setWidth('90px'));
 ySemiAxisRow.add(ySemiAxisI);

 ySemiAxisRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(ySemiAxisRow);

 // height

 const dzRow = new UIRow();
 const dzI = new UINumber(parameters.height).setRange(parameters.height + 0.01, Infinity).onChange(update);

 dzRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/height')).setWidth('90px'));
 dzRow.add(dzI);

 dzRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(dzRow);


 // zTopCut

 const zTopCutRow = new UIRow();
 const zTopCutI = new UINumber(parameters.zTopCut).setRange(0, parameters.height - 0.01).onChange(update);

 zTopCutRow.add(new UIText(strings.getKey('sidebar/geometry/aellipticalcone_geometry/topcut')).setWidth('90px'));
 zTopCutRow.add(zTopCutI);

 zTopCutRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

 container.add(zTopCutRow);
 //

 function update() {

  var xSemiAxis = xSemiAxisI.getValue(), ySemiAxis = ySemiAxisI.getValue(), height = dzI.getValue(), zTopCut = zTopCutI.getValue();
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
  finalMesh.rotateX(Math.PI / 2);
  finalMesh.updateMatrix();

  dzI.setRange(zTopCut + 0.01, Infinity);
  zTopCutI.setRange(0, height - 0.01);
  
  finalMesh.geometry.name = object.geometry.name;

  editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

 }

 return container;

}

export { GeometryParametersPanel };
