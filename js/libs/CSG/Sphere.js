import * as THREE from "three";
import { CSG } from "../CSGMesh.js";

function CreateSphere(pRMin, pRMax, pStheta, pDtheta, pSphi, pDphi) {
  const mmTOcm=10;
  const pRmin = pRMin*mmTOcm;
  const pRmax = pRMax*mmTOcm;
  const pSTheta =  pStheta/ 180 * Math.PI;
  const  pDTheta =  pDtheta/ 180 * Math.PI;
  const pSPhi =  pSphi/ 180 * Math.PI;
  const pDPhi =  pDphi/ 180 * Math.PI;
  const pETheta = pSTheta + pDTheta;

  const sphereGeometry = new THREE.SphereGeometry(pRmax);
  const innerSphereGeometry = new THREE.SphereGeometry(pRmin);

  //Create box geometry for making hemisphere cuts
  const boxGeometry = new THREE.BoxGeometry(pRmax * 2, pRmax, pRmax * 2);
  boxGeometry.rotateX(Math.PI / 2);
  boxGeometry.translate(0, 0, pRmax / 2);

  // Create Cone geometries to make a cut
  const cone1Geometry = new THREE.CylinderGeometry(
    pRmax * Math.tan(pSTheta),
    0.00001,
    pRmax
  ); //Smaller upper cone
  cone1Geometry.rotateX(Math.PI / 2);
  cone1Geometry.translate(0, 0, pRmax / 2);

  const cone2Geometry = new THREE.CylinderGeometry(
    pRmax * Math.tan(pETheta),
    0.0001,
    pRmax
  ); //Bigger upper cone
  cone2Geometry.rotateX(Math.PI / 2);
  cone2Geometry.translate(0, 0, pRmax / 2);

  const cone3Geometry = new THREE.CylinderGeometry(
    0.0001,
    pRmax * Math.tan(Math.PI - pSTheta),
    pRmax
  ); //Smaller lower cone
  cone3Geometry.rotateX(Math.PI / 2);
  cone3Geometry.translate(0, 0, -pRmax / 2);

  const cone4Geometry = new THREE.CylinderGeometry(
    0.0001,
    pRmax * Math.tan(Math.PI - pETheta),
    pRmax
  ); //Bigger lower cone
  cone4Geometry.rotateX(Math.PI / 2);
  cone4Geometry.translate(0, 0, -pRmax / 2);

  // Create the pie shape
  const pieShape = new THREE.Shape();
  pieShape.absarc(0, 0, pRmax, pSPhi, pSPhi + pDPhi, false);
  pieShape.lineTo(0, 0);
  const extrusionsettings = { depth: 2 * pRmax, bevelEnabled: false };
  const pieGeometry = new THREE.ExtrudeGeometry(pieShape, extrusionsettings);
  pieGeometry.translate(0, 0, -pRmax);

  // Convert geometries to CSG objects
  const sphereCSG = CSG.fromGeometry(sphereGeometry);
  const innerSphereCSG = CSG.fromGeometry(innerSphereGeometry);
  const cone1CSG = CSG.fromGeometry(cone1Geometry);
  const cone2CSG = CSG.fromGeometry(cone2Geometry);
  const cone3CSG = CSG.fromGeometry(cone3Geometry);
  const cone4CSG = CSG.fromGeometry(cone4Geometry);
  const boxCSG = CSG.fromGeometry(boxGeometry);
  const pieCSG = CSG.fromGeometry(pieGeometry);

  let resultCSG = sphereCSG;
  // get shapes under different conditions
  if (pSTheta === 0 && pETheta > 0 && pETheta < Math.PI / 2) {
    resultCSG = cone2CSG.intersect(sphereCSG);
  } else if (pSTheta === 0 && pETheta === Math.PI / 2) {
    resultCSG = boxCSG.intersect(sphereCSG);
  } else if (pSTheta === 0 && pETheta > Math.PI / 2 && pETheta < Math.PI) {
    resultCSG = sphereCSG.subtract(cone4CSG);
  } else if (
    pSTheta > 0 &&
    pSTheta < Math.PI / 2 &&
    pETheta > pSTheta &&
    pETheta < Math.PI / 2
  ) {
    var step1CSG = cone2CSG.subtract(cone1CSG);
    resultCSG = step1CSG.intersect(sphereCSG);
  } else if (pSTheta > 0 && pSTheta < Math.PI / 2 && pETheta === Math.PI / 2) {
    var step1CSG = boxCSG.subtract(cone1CSG);
    resultCSG = step1CSG.intersect(sphereCSG);
  } else if (
    pSTheta > 0 &&
    pSTheta < Math.PI / 2 &&
    pETheta > Math.PI / 2 &&
    pETheta < Math.PI
  ) {
    var step1CSG = sphereCSG.subtract(cone1CSG);
    resultCSG = step1CSG.subtract(cone4CSG);
  } else if (pSTheta > 0 && pSTheta < Math.PI / 2 && pETheta === Math.PI) {
    resultCSG = sphereCSG.subtract(cone1CSG);
  } else if (
    pSTheta === Math.PI / 2 &&
    pETheta > Math.PI / 2 &&
    pETheta < Math.PI
  ) {
    var step1CSG = sphereCSG.subtract(boxCSG);
    resultCSG = step1CSG.subtract(cone4CSG);
  } else if (pSTheta === Math.PI / 2 && pETheta === Math.PI) {
    resultCSG = sphereCSG.subtract(boxCSG);
  } else if (
    pSTheta > Math.PI / 2 &&
    pSTheta < Math.PI &&
    pETheta > pSTheta &&
    pETheta < Math.PI
  ) {
    step1CSG = cone3CSG.subtract(cone4CSG);
    resultCSG = step1CSG.intersect(sphereCSG);
  } else if (
    pSTheta > Math.PI / 2 &&
    pSTheta < Math.PI &&
    pETheta === Math.PI
  ) {
    resultCSG = sphereCSG.intersect(cone3CSG);
  }

  if (pDPhi < Math.PI * 2) {
    resultCSG = resultCSG.intersect(pieCSG);
  }
  if (pRmin > 0) {
    resultCSG = resultCSG.subtract(innerSphereCSG);
  }

  if (resultCSG) {
    const mesh = CSG.toMesh(
      resultCSG,
      new THREE.Matrix4(),
      new THREE.MeshLambertMaterial()
    );
    const param = {
      pRMin: pRMin ,
      pRMax: pRMax ,
      pSTheta: pStheta ,
      pDTheta: pDtheta ,
      pSPhi: pSphi ,
      pDPhi: pDphi ,
    };
    mesh.geometry.parameters = param;
    mesh.geometry.type = "SphereGeometry2";
    mesh.updateMatrix();
    mesh.name = "Sphere";

    return mesh;
  }
}

export { CreateSphere };
