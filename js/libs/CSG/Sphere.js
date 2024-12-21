import * as THREE from "three";
import { SphereGeometry2 } from "../geometry/SphereGeometry2.js";

function CreateSphere(pRMin, pRMax, pStheta, pDtheta, pSphi, pDphi) {

    const geometry = new SphereGeometry2(pRMin, pRMax, pStheta, pDtheta, pSphi, pDphi);
    const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial());


    mesh.updateMatrix();
    mesh.name = "Sphere";

    return mesh;
}

export { CreateSphere };