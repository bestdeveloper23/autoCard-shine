// import * as THREE from "three";
// import { CSG } from "../CSGMesh.js";

// class aCutTubeGeometry extends THREE.BufferGeometry {
//     constructor(pRMin, pRMax, pDz, SPhi, DPhi, pLowNorm, pHighNorm) {
//         super();
//         this.type = "aCutTubeGeometry";

//         if (!this.isValidVector(pLowNorm) || !this.isValidVector(pHighNorm)) return;

//         const material = new THREE.MeshLambertMaterial();
//         const aCSG = this.createCutTubeCSG(pRMin, pRMax, pDz, SPhi, DPhi, pLowNorm, pHighNorm);

//         const finalGeometry = CSG.toGeometry(aCSG);
//         finalGeometry.type = "aCutTubeGeometry";
//         finalGeometry.parameters = { pRMin, pRMax, pDz, SPhi, DPhi, pLowNorm, pHighNorm };

//         Object.assign(this, finalGeometry);
//     }

//     isValidVector(vector) {
//         return !(vector.x === 0 && vector.y === 0 && vector.z === 0);
//     }

//     createCutTubeCSG(pRMin, pRMax, pDz, SPhi, DPhi, pLowNorm, pHighNorm) {
//         const maxdis = Math.max(pRMax, pRMin, pDz * 2);
        
//         const cylinder1 = this.createCylinder(pRMax, pDz);
//         const cylinder2 = this.createCylinder(pRMin, pDz);

//         let aCSG = CSG.fromMesh(cylinder1).subtract(CSG.fromMesh(cylinder2));

//         const box1 = this.createBox(maxdis);
//         this.alignBox(box1, pHighNorm, maxdis / 2);
//         aCSG = aCSG.subtract(CSG.fromMesh(box1));

//         const box2 = this.createBox(maxdis);
//         this.alignBox(box2, pLowNorm, -maxdis / 2);
//         aCSG = aCSG.subtract(CSG.fromMesh(box2));

//         const segmentBox = this.createSegmentBox(pRMax, maxdis);
//         aCSG = this.subtractSegmentCSG(aCSG, segmentBox, SPhi, DPhi);

//         return aCSG;
//     }

//     createCylinder(radius, height) {
//         const geometry = new THREE.CylinderGeometry(radius, radius, height * 2 * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
//         const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
//         mesh.rotateX(Math.PI / 2);
//         mesh.updateMatrix();
//         return mesh;
//     }

//     createBox(size) {
//         const geometry = new THREE.BoxGeometry(size * Math.sqrt(2) * 2, size * Math.sqrt(2) * 2, size * Math.sqrt(2) * 2);
//         return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
//     }

//     createSegmentBox(pRMax, maxdis) {
//         const geometry = new THREE.BoxGeometry(pRMax, pRMax, maxdis * 2);
//         return new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
//     }

//     alignBox(box, normal, positionZ) {
//         if (!this.isVertical(normal)) {
//             const rotation = this.calculateRotation(normal);
//             box.rotation.set(-rotation.x, -rotation.y, -rotation.z);
//         }
//         box.position.set(0, 0, positionZ);
//         box.updateMatrix();
//     }

//     isVertical(vector) {
//         return vector.y !== 0 && vector.x === 0 && vector.z === 0;
//     }

//     calculateRotation(normal) {
//         return new THREE.Vector3(
//             Math.atan(normal.z / normal.y),
//             Math.atan(normal.x / normal.y),
//             Math.atan(normal.z / normal.x)
//         ).clampScalar(-Math.PI / 2, Math.PI / 2);
//     }

//     subtractSegmentCSG(aCSG, box, SPhi, DPhi) {
//         let bCSG = aCSG;

//         if (DPhi > 270 && DPhi < 360) {
//             let v_DPhi = 360 - DPhi;
//             this.rotateAndSubtractBox(box, SPhi - 90, aCSG);

//             let repeatCount = Math.floor((270 - v_DPhi) / 90);
//             for (let i = 0; i < repeatCount; i++) {
//                 this.rotateAndSubtractBox(box, -90, aCSG);
//             }
//             this.rotateAndSubtractBox(box, - (270 - v_DPhi - repeatCount * 90), aCSG);
//             return aCSG.subtract(bCSG);
//         } else if (DPhi <= 270) {
//             this.rotateAndSubtractBox(box, SPhi, aCSG);

//             let repeatCount = Math.floor((270 - DPhi) / 90);
//             for (let i = 0; i < repeatCount; i++) {
//                 this.rotateAndSubtractBox(box, 90, aCSG);
//             }
//             this.rotateAndSubtractBox(box, (270 - DPhi - repeatCount * 90), aCSG);
//         }

//         return aCSG;
//     }

//     rotateAndSubtractBox(box, angleDeg, aCSG) {
//         box.rotateZ((angleDeg / 180) * Math.PI);
//         box.updateMatrix();
//         aCSG.subtract(CSG.fromMesh(box));
//     }

//     copy(source) {
//         super.copy(source);
//         this.parameters = Object.assign({}, source.parameters);
//         return this;
//     }

//     static fromJSON(data) {
//         return new aCutTubeGeometry(data.pRMin, data.pRMax, data.pDz, data.SPhi, data.DPhi, data.pLowNorm, data.pHighNorm);
//     }
// }

// export { aCutTubeGeometry };




// import * as THREE from "three";
// import { CSG } from "../CSGMesh.js";

// function CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm ){
//     function CutTube_vectorVal(vector) {
//         if (CutTube_vectorVertical(vector)) {
//             return true;
//         } else if ((vector.x * vector.y) === 0 && (vector.x * vector.z) === 0 && (vector.y * vector.z) === 0) {
//             return false;
//         } else if (vector.y === 0) {
//             return false;
//         } else return true;
//     }

//     function CutTube_vectorVertical(vector) {
//         if (vector.y !== 0 && vector.x === 0 && vector.z === 0) {
//             return true;
//         } else return false;
//     }

//     if (CutTube_vectorVal(pLowNorm) === false || CutTube_vectorVal(pHighNorm) === false) return;

//     const cylindergeometry1 = new THREE.CylinderGeometry(pRMax, pRMax, pDz * 2 * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
//     const cylindermesh1 = new THREE.Mesh(cylindergeometry1, new THREE.MeshBasicMaterial());
//     cylindermesh1.rotateX(Math.PI / 2);
//     cylindermesh1.updateMatrix();

//     const cylindergeometry2 = new THREE.CylinderGeometry(pRMin, pRMin, pDz * 2 * Math.sqrt(2) * 2, 32, 1, false, 0, Math.PI * 2);
//     const cylindermesh2 = new THREE.Mesh(cylindergeometry2, new THREE.MeshBasicMaterial());
//     cylindermesh2.rotateX(Math.PI / 2);
//     cylindermesh2.updateMatrix();

//     const maxdis = Math.max(pRMax, pRMin, pDz * 2);

//     const boxgeometry1 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
//     const boxmesh1 = new THREE.Mesh(boxgeometry1, new THREE.MeshBasicMaterial());

//     const boxgeometry2 = new THREE.BoxGeometry(2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis, 2 * Math.sqrt(2) * maxdis);
//     const boxmesh2 = new THREE.Mesh(boxgeometry2, new THREE.MeshBasicMaterial());

//     const boxgeometry = new THREE.BoxGeometry(pRMax, pRMax, 2 * Math.sqrt(2) * maxdis);
//     const boxmesh = new THREE.Mesh(boxgeometry, new THREE.MeshBasicMaterial());


//     boxmesh1.geometry.translate(0, 0, Math.sqrt(2) * maxdis);
//     const MeshCSG1 = CSG.fromMesh(cylindermesh1);
//     const MeshCSG2 = CSG.fromMesh(cylindermesh2);
//     let MeshCSG3 = CSG.fromMesh(boxmesh1);

//     let aCSG;
//     aCSG = MeshCSG1.subtract(MeshCSG2);


//     if (CutTube_vectorVertical(pHighNorm) === false) {

//         let rotateX = Math.atan(pHighNorm.z / pHighNorm.y);
//         let rotateY = Math.atan(pHighNorm.x / pHighNorm.y);
//         let rotateZ = Math.atan(pHighNorm.z / pHighNorm.x);

//         if (rotateX === Infinity) rotateX = boxmesh1.rotation.x;
//         if (rotateY === Infinity) rotateY = boxmesh1.rotation.y;
//         if (rotateZ === Infinity) rotateZ = boxmesh1.rotation.z;

//         boxmesh1.rotation.set(-rotateX, -rotateY, -rotateZ);
//     }

//     boxmesh1.position.set(0, 0, maxdis / 2);
//     boxmesh1.updateMatrix();
//     MeshCSG3 = CSG.fromMesh(boxmesh1);

//     aCSG = aCSG.subtract(MeshCSG3);

//     boxmesh2.geometry.translate(0, 0, -Math.sqrt(2) * pDz * 2);
//     if (!CutTube_vectorVertical(pLowNorm)) {

//         let rotateX = Math.atan(pLowNorm.z / pLowNorm.y);
//         let rotateY = Math.atan(pLowNorm.x / pLowNorm.y);
//         let rotateZ = Math.atan(pLowNorm.z / pLowNorm.x);

//         if (rotateX === Infinity) rotateX = boxmesh2.rotation.x;
//         if (rotateY === Infinity) rotateY = boxmesh2.rotation.y;
//         if (rotateZ === Infinity) rotateZ = boxmesh2.rotation.z;

//         boxmesh2.rotation.set(-rotateX, -rotateY, -rotateZ);
//     }

//     boxmesh2.position.set(0, 0, -maxdis / 2);
//     boxmesh2.updateMatrix();
//     MeshCSG3 = CSG.fromMesh(boxmesh2);

//     aCSG = aCSG.subtract(MeshCSG3);


//     boxmesh.geometry.translate(pRMax / 2, pRMax / 2, 0);
//     let bCSG = aCSG;

//     if (DPhi > 270 && DPhi < 360) {
//         let v_DPhi = 360 - DPhi;

//         boxmesh.rotateZ((SPhi - 90) / 180 * Math.PI);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         bCSG = bCSG.subtract(MeshCSG3);

//         let repeatCount = Math.floor((270 - v_DPhi) / 90);

//         for (let i = 0; i < repeatCount; i++) {
//             let rotateVaule = - Math.PI / 2;
//             boxmesh.rotateZ(rotateVaule);
//             boxmesh.updateMatrix();
//             MeshCSG3 = CSG.fromMesh(boxmesh);
//             bCSG = bCSG.subtract(MeshCSG3);
//         }
//         let rotateVaule = (-1) * (270 - v_DPhi - repeatCount * 90) / 180 * Math.PI;
//         boxmesh.rotateZ(rotateVaule);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         bCSG = bCSG.subtract(MeshCSG3);
//         aCSG = aCSG.subtract(bCSG);

//     } else if(DPhi <= 270){

//         boxmesh.rotateZ((SPhi) / 180 * Math.PI);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         aCSG = aCSG.subtract(MeshCSG3);

//         let repeatCount = Math.floor((270 - DPhi) / 90);

//         for (let i = 0; i < repeatCount; i++) {
//             let rotateVaule = Math.PI / (2);
//             boxmesh.rotateZ(rotateVaule);
//             boxmesh.updateMatrix();
//             MeshCSG3 = CSG.fromMesh(boxmesh);
//             aCSG = aCSG.subtract(MeshCSG3);
//         }
//         let rotateVaule = (270 - DPhi - repeatCount * 90) / 180 * Math.PI;
//         boxmesh.rotateZ(rotateVaule);
//         boxmesh.updateMatrix();
//         MeshCSG3 = CSG.fromMesh(boxmesh);
//         aCSG = aCSG.subtract(MeshCSG3);

//     }

//     const finalMesh = CSG.toMesh(aCSG, new THREE.Matrix4(), new THREE.MeshLambertMaterial());
//     const param = { 'pRMax': pRMax, 'pRMin': pRMin, 'pDz': pDz, 'pSPhi': SPhi, 'pDPhi': DPhi, 'pHighNorm': pHighNorm, 'pLowNorm': pLowNorm };
//     finalMesh.geometry.parameters = param;
//     finalMesh.geometry.type = 'aCutTubeGeometry';
//     finalMesh.updateMatrix();
//     finalMesh.name = 'CTubs';

//     return finalMesh;
// }

// export{CreateCutTube}





// import cuttubImg from '../images/basicmodels/aCutTube.jpg';


// // CutTube model

// item = new UIDiv();
// item.setClass('Category-item');

// item.dom.style.backgroundImage = `url(${cuttubImg})`;

// item.setTextContent(strings.getKey('menubar/add/g4cuttube'));
// item.dom.setAttribute('draggable', true);
// item.dom.setAttribute('item-type', 'cutTub');
// item.onClick(function () {

//     // we need to new each geometry module

//     var pRMin = 1, pRMax = 1.5, pDz = 4, SPhi = 0, DPhi = 270, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);
//     const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );

//     editor.execute(new AddObjectCommand(editor, finalMesh));

// });

// item.dom.addEventListener('dragend', function (event) {

//     var position = getPositionFromMouse(event);        

//     var pRMin = 1, pRMax = 1.5, pDz = 4, SPhi = 0, DPhi = 270, pLowNorm = new THREE.Vector3(0, -0.71, -0.7), pHighNorm = new THREE.Vector3(0.7, 0.71, 0);
//     const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );
//     finalMesh.position.copy(position);

//     editor.execute(new AddObjectCommand(editor, finalMesh));

// });

// options.add(item);





// Sidebar.Geometry.aCutTubeGeometry.js




// import * as THREE from 'three';
// import { CSG } from './libs/CSGMesh.js';

// import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';

// import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
// import { CreateCutTube } from './libs/CSG/CutTube.js';

// function GeometryParametersPanel(editor, object) {

//  const strings = editor.strings;

//  const container = new UIDiv();

//  const geometry = object.geometry;
//  const parameters = geometry.parameters;

//  // maxRadius

//  const maxRadiusRow = new UIRow();
//  const maxRadius = new UINumber(parameters.pRMax).setRange(parameters.pRMin + 0.001, Infinity).onChange(update);

//  maxRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/maxradius')).setWidth('90px'));
//  maxRadiusRow.add(maxRadius);

//  maxRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

//  container.add(maxRadiusRow);

//  // minRadius

//  const minRadiusRow = new UIRow();
//  const minRadius = new UINumber(parameters.pRMin).setRange(0, parameters.pRMax - 0.001).onChange(update);

//  minRadiusRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/minradius')).setWidth('90px'));
//  minRadiusRow.add(minRadius);

//  minRadiusRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

//  container.add(minRadiusRow);

//  // height

//  const heightRow = new UIRow();
//  const height = new UINumber(parameters.pDz).setRange(0.001, Infinity).onChange(update);

//  heightRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/height')).setWidth('90px'));
//  heightRow.add(height);

//  heightRow.add(new UIText(strings.getKey('sidebar/properties/demensionunit')).setWidth('20px'));

//  container.add(heightRow);

//  // sphi
//  const pSPhiRow = new UIRow();
//  const pSPhi = new UINumber(parameters.pSPhi).setStep(5).onChange(update);
//  pSPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pSPhi')).setWidth('90px'));
//  pSPhiRow.add(pSPhi);

//  pSPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
//  container.add(pSPhiRow);

//  // dphi

//  const pDPhiRow = new UIRow();
//  const pDPhi = new UINumber(parameters.pDPhi).setStep(5).setRange(0.001, 360).onChange(update);
//  pDPhiRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pDPhi')).setWidth('90px'));
//  pDPhiRow.add(pDPhi);
//  pDPhiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));

//  container.add(pDPhiRow);

//  // LowVector3

//  const pLowNormRow = new UIRow();
//  pLowNormRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pLowNorm')).setWidth('90px'));
//  const pLowNormX = new UINumber(parameters.pLowNorm.x).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
//  const pLowNormY = new UINumber(parameters.pLowNorm.y).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
//  const pLowNormZ = new UINumber(parameters.pLowNorm.z).setPrecision( 5 ).setWidth( '50px' ).onChange(update);

//  pLowNormRow.add(pLowNormX);
//  pLowNormRow.add(pLowNormY);
//  pLowNormRow.add(pLowNormZ);

//  container.add(pLowNormRow);

//  // HightVector3

//  const pHighNormRow = new UIRow();
//  pHighNormRow.add(new UIText(strings.getKey('sidebar/geometry/atube_geometry/pHighNorm')).setWidth('90px'));
//  const pHighNormX = new UINumber(parameters.pHighNorm.x).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
//  const pHighNormY = new UINumber(parameters.pHighNorm.y).setPrecision( 5 ).setWidth( '50px' ).onChange(update);
//  const pHighNormZ = new UINumber(parameters.pHighNorm.z).setPrecision( 5 ).setWidth( '50px' ).onChange(update);

//  pHighNormRow.add(pHighNormX);
//  pHighNormRow.add(pHighNormY);
//  pHighNormRow.add(pHighNormZ);

//  container.add(pHighNormRow);

//  //

//  function update() {

//   // we need to new each geometry module

//   var pRMax = maxRadius.getValue(), pRMin = minRadius.getValue(), pDz = height.getValue(), SPhi = - pSPhi.getValue(), DPhi = pDPhi.getValue(),
//   pHighNorm = new THREE.Vector3(pHighNormX.getValue(), pHighNormY.getValue(), pHighNormZ.getValue()), 
//   pLowNorm = new THREE.Vector3(pLowNormX.getValue(), pLowNormY.getValue(), pLowNormZ.getValue());

//   const finalMesh = CreateCutTube( pRMin , pRMax , pDz , SPhi , DPhi , pLowNorm , pHighNorm );
//   // set Range 
//   maxRadius.setRange(pRMin + 0.001, Infinity);
//   minRadius.setRange(0, pRMax - 0.001);

//   finalMesh.geometry.name = object.geometry.name;
  
//   editor.execute(new SetGeometryCommand(editor, object, finalMesh.geometry));

//  }

//  return container;

// }

// export { GeometryParametersPanel };
