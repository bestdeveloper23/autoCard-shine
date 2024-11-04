import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';

import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CreateCone } from './libs/CSG/Cone.js';

function GeometryParametersPanel(editor, object) {

     const strings = editor.strings;

     const container = new UIDiv();

     const geometry = object.geometry;
     const parameters = geometry.parameters;


     // minRadius2

     const minRadiusRow2 = new UIRow();
     const minRadius2 = new UINumber(parameters.pRMin2).setRange(0, parameters.pRMax2 - 0.001).onChange(update);

     minRadiusRow2.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/minradius2')).setWidth('90px'));
     minRadiusRow2.add(minRadius2);

     minRadiusRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

     container.add(minRadiusRow2);


     // maxRadius2

     const maxRadiusRow2 = new UIRow();
     const maxRadius2 = new UINumber(parameters.pRMax2).setRange(parameters.pRMin2 + 0.001, Infinity).onChange(update);

     maxRadiusRow2.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/maxradius2')).setWidth('90px'));
     maxRadiusRow2.add(maxRadius2);

     maxRadiusRow2.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

     container.add(maxRadiusRow2);


     // minRadius1

     const minRadiusRow1 = new UIRow();
     const minRadius1 = new UINumber(parameters.pRMin1).setRange(0, parameters.pRMax1 - 0.001).onChange(update);

     minRadiusRow1.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/minradius1')).setWidth('90px'));
     minRadiusRow1.add(minRadius1);

     minRadiusRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

     container.add(minRadiusRow1);


     // maxRadius1

     const maxRadiusRow1 = new UIRow();
     const maxRadius1 = new UINumber(parameters.pRMax1).setRange(parameters.pRMin1 + 0.001, Infinity).onChange(update);

     maxRadiusRow1.add(new UIText(strings.getKey('sidebar/geometry/acone_geometry/maxradius1')).setWidth('90px'));
     maxRadiusRow1.add(maxRadius1);

     maxRadiusRow1.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

     container.add(maxRadiusRow1);


     // height

     const heightRow = new UIRow();
     const height = new UINumber(parameters.pDz).setRange(0.001, Infinity).onChange(update);

     heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'));
     heightRow.add(height);

     heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

     container.add(heightRow);

     // startphi

     const pSPhiRow = new UIRow();
     const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
     pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
     pSPhiRow.add(pSPhi);
     pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

     container.add(pSPhiRow);

     // deltaphi

     const pDPhiRow = new UIRow();
     const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(update);
     pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
     pDPhiRow.add(pDPhi);
     pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

     container.add(pDPhiRow);


     function update() {
          var pRmin1 = minRadius1.getValue(), pRmax1 = maxRadius1.getValue(), pRmin2 = minRadius2.getValue(), pRmax2 = maxRadius2.getValue(),
          pDz = height.getValue(), SPhi = - pSPhi.getValue(), DPhi = pDPhi.getValue();

          if (pRmin1 === 0 && pRmin2 !== 0) {
               pRmin1 = 0.00001;
          }

          const finalMesh = CreateCone( pRmin1*10 , pRmax1*10 , pRmin2*10 , pRmax2*10 , pDz*10 , SPhi , DPhi );

          maxRadius1.setRange(pRmin1 + 0.001, Infinity);
          minRadius1.setRange(0, pRmax1 - 0.001);
          maxRadius2.setRange(pRmin2 + 0.001, Infinity);
          minRadius2.setRange(0, pRmax2 - 0.001);

          finalMesh.geometry.name = object.geometry.name;

          editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

     }

     return container;

}

export { GeometryParametersPanel };
