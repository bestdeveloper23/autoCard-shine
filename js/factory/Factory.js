class Factory {

	// Export TG
	static async exportTg(editor) {

		function traversebooleanObjects(object, callback) {

			callback(object);
			const children = object.childrenObject;
			if (!children) return

			for (let i = 0, l = children.length; i < l; i++) {

				traversebooleanObjects(children[i], callback);

			}

		}

		function getRotationText(object, boolean = false) {
			let rotated = object.rotation;
			let rotateX = rotated.x * 180 / Math.PI;
			let rotateY = rotated.y * 180 / Math.PI;
			let rotateZ = rotated.z * 180 / Math.PI;
			if (boolean) {
				let rotated1 = object.childrenObject[0].rotation;
				let rotated2 = object.childrenObject[1].rotation;

				let rotateX1 = rotated1.x * 180 / Math.PI;
				let rotateY1 = rotated1.y * 180 / Math.PI;
				let rotateZ1 = rotated1.z * 180 / Math.PI;
				let rotateX2 = rotated2.x * 180 / Math.PI;
				let rotateY2 = rotated2.y * 180 / Math.PI;
				let rotateZ2 = rotated2.z * 180 / Math.PI;

				let rotateX = rotateX2 - rotateX1;
				let rotateY = rotateY2 - rotateY1;
				let rotateZ = rotateZ2 - rotateZ1;

				return `:rotm ${object.name}_rot ${rotateX1.toFixed(5)} ${rotateY1.toFixed(5)} ${rotateZ1.toFixed(5)}\n:rotm ${object.name}_rot_rel ${rotateX.toFixed(5)} ${rotateY.toFixed(5)} ${rotateZ.toFixed(5)}\n`
			} else {
				return `:rotm ${object.name}_rot ${rotateX.toFixed(5)} ${rotateY.toFixed(5)} ${rotateZ.toFixed(5)}\n`
			}

		}

		function getSolidText(object) {
			let solidText1 = '';
			switch (object.geometry.type) {
				case "BoxGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} BOX ${object.geometry.parameters.width}*cm ${object.geometry.parameters.depth}*cm ${object.geometry.parameters.height}*cm\n`

					break;

				case "SphereGeometry2":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} SPHERE ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi} ${object.geometry.parameters.pSTheta} ${object.geometry.parameters.pDTheta}\n`

					break;

				case "aTubeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TUBS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`

					break;

				case "aCutTubeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} CUTTUB ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`

					break;

				case "aConeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} CONS ${object.geometry.parameters.pRMin2}*cm ${object.geometry.parameters.pRMax2}*cm ${object.geometry.parameters.pRMin1}*cm ${object.geometry.parameters.pRMax1}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`

					break;

				case "aParallGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} PARA ${object.geometry.parameters.dx}*cm ${object.geometry.parameters.dy}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi}\n`

					break;

				case "aTrapeZoidGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dz}*cm\n`

					break;

				case "aTrapeZoidPGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TRAP ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.phi} ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.alpha} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm ${object.geometry.parameters.phi}\n`

					break;

				case "aTorusGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TORUS ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pRTor}*cm ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n`

					break;

				case "aEllipticalCylinderGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPTICALTUBE ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.semiAxisY}*cm ${object.geometry.parameters.Dz}*cm\n`

					break;

				case "aEllipsoidGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} ELLIPSOID ${object.geometry.parameters.xSemiAxis}*cm ${object.geometry.parameters.ySemiAxis}*cm ${object.geometry.parameters.zSemiAxis}*cm ${object.geometry.parameters.zBottomCut}*cm ${object.geometry.parameters.zTopCut}*cm\n`

					break;

				case "aEllipticalConeGeometry":

					solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} ELLIPTICALTUBE ${children.geometry.parameters.xSemiAxis}*cm ${children.geometry.parameters.semiAxisY}*cm ${children.geometry.parameters.Dz}*cm\n`

					break;

				case "aTwistedBoxGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTEDBOX ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.width}*cm ${object.geometry.parameters.height}*cm ${object.geometry.parameters.depth}*cm\n`

					break;

				case "aTwistedTrdGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTEDTRD ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.twistedangle}\n`

					break;

				case "aTwistedTrapGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTEDTRAP ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.dx1}*cm ${object.geometry.parameters.dx2}*cm ${object.geometry.parameters.dy1}*cm ${object.geometry.parameters.dz}*cm ${object.geometry.parameters.theta} ${object.geometry.parameters.dy2}*cm ${object.geometry.parameters.dx3}*cm ${object.geometry.parameters.dx4}*cm\n`

					break;

				case "aTwistedTubeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TWISTEDTUBS ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.pRMin}*cm ${object.geometry.parameters.pRMax}*cm ${object.geometry.parameters.pDz}*cm ${object.geometry.parameters.pDPhi}\n`

					break;

				case "aTetrahedraGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} TET ${object.geometry.parameters.anchor[0].toFixed(7)}*cm ${object.geometry.parameters.anchor[1].toFixed(7)}*cm ${object.geometry.parameters.anchor[2].toFixed(7)}*cm ${object.geometry.parameters.p2[0].toFixed(7)}*cm ${object.geometry.parameters.p2[1].toFixed(7)}*cm ${object.geometry.parameters.p2[2].toFixed(7)}*cm ${object.geometry.parameters.p3[0].toFixed(7)}*cm ${object.geometry.parameters.p3[1].toFixed(7)}*cm ${object.geometry.parameters.p3[2].toFixed(7)}*cm ${object.geometry.parameters.p4[0].toFixed(7)}*cm ${object.geometry.parameters.p4[1].toFixed(7)}*cm ${object.geometry.parameters.p4[2].toFixed(7)}*cm\n`

					break;

				case "aHyperboloidGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} HYPE ${object.geometry.parameters.radiusIn}*cm ${object.geometry.parameters.radiusOut}*cm ${object.geometry.parameters.stereo1} ${object.geometry.parameters.stereo2} ${object.geometry.parameters.pDz}*cm\n`

					break;

				case "aPolyconeGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} POLYCONE ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z}*cm ${object.geometry.parameters.rOuter}\n`

					break;

				case "aPolyhedraGeometry":

					solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} POLYHEDRA ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numSide} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z}*cm ${object.geometry.parameters.rOuter}\n`

					break;

				case "unitedGeometry":

					{

						const positionX1 = object.childrenObject[0].position.x;
						const positionY1 = object.childrenObject[0].position.y;
						const positionZ1 = object.childrenObject[0].position.z;

						const positionX2 = object.childrenObject[1].position.x;
						const positionY2 = object.childrenObject[1].position.y;
						const positionZ2 = object.childrenObject[1].position.z;

						const positionX = positionX2 - positionX1;
						const positionY = positionY2 - positionY1;
						const positionZ = positionZ2 - positionZ1;

						solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} UNION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name : object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`
					}

					break;

				case "subtractedGeometry":

					{

						const positionX1 = object.childrenObject[0].position.x;
						const positionY1 = object.childrenObject[0].position.y;
						const positionZ1 = object.childrenObject[0].position.z;

						const positionX2 = object.childrenObject[1].position.x;
						const positionY2 = object.childrenObject[1].position.y;
						const positionZ2 = object.childrenObject[1].position.z;

						const positionX = positionX2 - positionX1;
						const positionY = positionY2 - positionY1;
						const positionZ = positionZ2 - positionZ1;

						solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} SUBTRACTION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name : object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`
					}

					break;

				case "intersectedGeometry":

					{

						const positionX1 = object.childrenObject[0].position.x;
						const positionY1 = object.childrenObject[0].position.y;
						const positionZ1 = object.childrenObject[0].position.z;

						const positionX2 = object.childrenObject[1].position.x;
						const positionY2 = object.childrenObject[1].position.y;
						const positionZ2 = object.childrenObject[1].position.z;

						const positionX = positionX2 - positionX1;
						const positionY = positionY2 - positionY1;
						const positionZ = positionZ2 - positionZ1;

						solidText1 += `:solid ${object.geometry.name ? object.geometry.name : object.name} INTERSECTION ${object.childrenObject[0].geometry.name ? object.childrenObject[0].geometry.name : object.childrenObject[0].name} ${object.childrenObject[1].geometry.name ? object.childrenObject[1].geometry.name : object.childrenObject[1].name} ${object.name}_rot_rel ${positionX}*cm ${positionY}*cm ${positionZ}*cm\n`

					}

					break;

				default:

					break;
			}

			return solidText1;
		}

		const modelCount = editor.scene.children.length;

		var solidText = ''
		var voluText = '';
		var colorText = '';
		var placeText = '';
		var rotationText = '';
		var variableText = '';

		if (modelCount > 0) {
			let i = 0;
			editor.scene.traverse(function (children) {

				if (children.isMesh) {

					// for (let i=0; i<modelCount; i++) {
					//:solid base TUBS 5*cm 14*cm 5*cm 0 360
					// const children = editor.scene.children[i];

					switch (children.geometry.type) {
						case "BoxGeometry":
							variableText += `//Half x, Half y, Half z`
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} BOX ${children.geometry.parameters.width}*cm ${children.geometry.parameters.height}*cm ${children.geometry.parameters.depth}*cm\n`
							break;

						case "SphereGeometry2":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} SPHERE ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi} ${children.geometry.parameters.pSTheta} ${children.geometry.parameters.pDTheta}\n`
							break;

						case "aTubeGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TUBS ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
							break;

						case "aCutTubeGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} CUTTUB ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
							break;

						case "aConeGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} CONS ${children.geometry.parameters.pRMin2}*cm ${children.geometry.parameters.pRMax2}*cm ${children.geometry.parameters.pRMin1}*cm ${children.geometry.parameters.pRMax1}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
							break;

						case "aParallGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} PARA ${children.geometry.parameters.dx}*cm ${children.geometry.parameters.dy}*cm ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.alpha} ${children.geometry.parameters.theta} ${children.geometry.parameters.phi}\n`
							break;

						case "aTrapeZoidGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TRD ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dz}*cm\n`
							break;

						case "aTrapeZoidPGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TRAP ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.theta} ${children.geometry.parameters.phi} ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.alpha} ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dx3}*cm ${children.geometry.parameters.dx4}*cm ${children.geometry.parameters.phi}\n`
							break;

						case "aTorusGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TORUS ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pRTor}*cm ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
							break;

						case "aEllipticalCylinderGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} ELLIPTICALTUBE ${children.geometry.parameters.xSemiAxis}*cm ${children.geometry.parameters.semiAxisY}*cm ${children.geometry.parameters.Dz}*cm\n`
							break;

						case "aEllipsoidGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} ELLIPSOID ${children.geometry.parameters.xSemiAxis}*cm ${children.geometry.parameters.ySemiAxis}*cm ${children.geometry.parameters.zSemiAxis}*cm ${children.geometry.parameters.zBottomCut}*cm ${children.geometry.parameters.zTopCut}*cm\n`
							break;

						case "aEllipticalConeGeometry":
							variableText += '// scaling along x, y in cm, z of the apex, z of the top plane in cm'
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} ELLIPTICALCONE ${children.geometry.parameters.xSemiAxis}/${(children.geometry.parameters.height + children.geometry.parameters.zTopCut) * 10}*cm ${children.geometry.parameters.ySemiAxis}/${(children.geometry.parameters.height + children.geometry.parameters.zTopCut) * 10}*cm ${children.geometry.parameters.height}*cm ${children.geometry.parameters.zTopCut}*cm\n`;
							break;

						case "aTwistedBoxGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTEDBOX ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.width}*cm ${children.geometry.parameters.height}*cm ${children.geometry.parameters.depth}*cm\n`
							break;

						case "aTwistedTrdGeometry":
							variableText += `//Half (x at -dz, x at +dz, y at -dz, y at +dz, z length, angle in degree)`
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTEDTRD ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.twistedangle}*degree\n`
							break;

						case "aTwistedTrapGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTEDTRAP ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.dx1}*cm ${children.geometry.parameters.dx2}*cm ${children.geometry.parameters.dy1}*cm ${children.geometry.parameters.dz}*cm ${children.geometry.parameters.theta} ${children.geometry.parameters.dy2}*cm ${children.geometry.parameters.dx3}*cm ${children.geometry.parameters.dx4}*cm\n`
							break;

						case "aTwistedTubeGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TWISTEDTUBS ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.pRMin}*cm ${children.geometry.parameters.pRMax}*cm ${children.geometry.parameters.pDz}*cm ${children.geometry.parameters.pDPhi}\n`
							break;

						case "aTetrahedraGeometry":
							variableText += `// anchor point, point 2, 3, 4`
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} TET ${children.geometry.parameters.anchor[0].toFixed(7)}*cm ${children.geometry.parameters.anchor[1].toFixed(7)}*cm ${children.geometry.parameters.anchor[2].toFixed(7)}*cm ${children.geometry.parameters.p2[0].toFixed(7)}*cm ${children.geometry.parameters.p2[1].toFixed(7)}*cm ${children.geometry.parameters.p2[2].toFixed(7)}*cm ${children.geometry.parameters.p3[0].toFixed(7)}*cm ${children.geometry.parameters.p3[1].toFixed(7)}*cm ${children.geometry.parameters.p3[2].toFixed(7)}*cm ${children.geometry.parameters.p4[0].toFixed(7)}*cm ${children.geometry.parameters.p4[1].toFixed(7)}*cm ${children.geometry.parameters.p4[2].toFixed(7)}*cm\n`
							break;

						case "aHyperboloidGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} HYPE ${children.geometry.parameters.radiusIn}*cm ${children.geometry.parameters.radiusOut}*cm ${children.geometry.parameters.stereo1} ${children.geometry.parameters.stereo2} ${children.geometry.parameters.pDz}*cm\n`
							break;

						case "aPolyconeGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} POLYCONE ${children.geometry.parameters.SPhi} ${children.geometry.parameters.DPhi} ${children.geometry.parameters.numZPlanes} ${children.geometry.parameters.z} ${children.geometry.parameters.rOuter}\n`
							break;

						case "aPolyhedraGeometry":
							rotationText += `:rotm ${children.name}_rot ${children.rotation.x * 180 / Math.PI} ${children.rotation.y * 180 / Math.PI} ${children.rotation.z * 180 / Math.PI}\n`
							solidText += `:solid ${children.geometry.name ? children.geometry.name : children.name} POLYHEDRA ${children.geometry.parameters.SPhi} ${children.geometry.parameters.DPhi} ${children.geometry.parameters.numSide} ${children.geometry.parameters.numZPlanes} ${children.geometry.parameters.z} ${children.geometry.parameters.rOuter}\n`
							break;

						case "unitedGeometry":
							{
								let tempSolidText = [];
								traversebooleanObjects(children, function (child) {
									if (child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry") {
										rotationText += getRotationText(child, true);
									}
									tempSolidText.push(getSolidText(child));
								});

								for (let i = tempSolidText.length - 1; i >= 0; i--) {
									solidText += tempSolidText[i];
								}

							}

							break;

						case "subtractedGeometry":
							{
								let tempSolidText = [];
								traversebooleanObjects(children, function (child) {
									if (child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry") {
										rotationText += getRotationText(child, true);
									}
									tempSolidText.push(getSolidText(child));
								});

								for (let i = tempSolidText.length - 1; i >= 0; i--) {
									solidText += tempSolidText[i];
								}
							}

							break;

						case "intersectedGeometry":
							{
								let tempSolidText = [];
								traversebooleanObjects(children, function (child) {
									if (child.geometry.type === "unitedGeometry" || child.geometry.type === "subtractedGeometry" || child.geometry.type === "intersectedGeometry") {
										rotationText += getRotationText(child, true);
									}
									tempSolidText.push(getSolidText(child));
								});

								for (let i = tempSolidText.length - 1; i >= 0; i--) {
									solidText += tempSolidText[i];
								}

							}

							break;

						default:

							break;
					}
					//:volu gear1 bas5 G4_STAINLESS-STEEL
					if (children.geometry.type !== "aGenericTrapGeometry" && children.geometry.type !== "aParaboloidGeometry" && children.name !== "RadiationSource") {
						if (children.material.name) {
							voluText += `:volu ${children.name} ${children.geometry.name ? children.geometry.name : children.name} ${children.material.name ? children.material.name : children.material.newmaterial?.elementType}\n`
						} else {
							// default material is G4_Galactic
							voluText += `:volu ${children.name} ${children.geometry.name ? children.geometry.name : children.name} ${children.material.name ? children.material.name : 'G4_Galactic'}\n`
						}
					}

					colorText += `:color ${children.name} ${children.material.color.r.toFixed(2)} ${children.material.color.g.toFixed(2)} ${children.material.color.b.toFixed(2)}\n`
					console.log(children.material.color.r)


					//:place gear1 1 world r000 -2*cm -8*cm 0
					if (children.geometry.type === "unitedGeometry" || children.geometry.type === "subtractedGeometry" || children.geometry.type === "intersectedGeometry") {
						if (children.parent.isMesh) {
							placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} ${children.parent.name} ${children.name}_rot ${children.childrenObject[0].position.x === 0 ? 0 : children.childrenObject[0].position.x.toFixed(6) / 10 + "*cm"} ${children.childrenObject[0].position.y === 0 ? 0 : children.childrenObject[0].position.y.toFixed(6) / 10 + "*cm"} ${children.childrenObject[0].position.z === 0 ? 0 : children.childrenObject[0].position.z.toFixed(6) / 10 + "*cm"}\n`
						} else {
							placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} world ${children.name}_rot ${children.childrenObject[0].position.x === 0 ? 0 : children.childrenObject[0].position.x.toFixed(6) / 10 + "*cm"} ${children.childrenObject[0].position.y === 0 ? 0 : children.childrenObject[0].position.y.toFixed(6) / 10 + "*cm"} ${children.childrenObject[0].position.z === 0 ? 0 : children.childrenObject[0].position.z.toFixed(6) / 10 + "*cm"}\n`
						}

					}
					else {
						if (children.parent.isMesh) {
							placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} ${children.parent.name} ${children.name}_rot ${children.position.x === 0 ? 0 : children.position.x.toFixed(6) / 10 + "*cm"} ${children.position.y === 0 ? 0 : children.position.y.toFixed(6) / 10 + "*cm"} ${children.position.z === 0 ? 0 : children.position.z.toFixed(6) / 10 + "*cm"}\n`
						} else {
							placeText += `:place ${children.name} ${children.copynumber ? children.copynumber : 1} world ${children.name}_rot ${children.position.x === 0 ? 0 : children.position.x.toFixed(6) / 10 + "*cm"} ${children.position.y === 0 ? 0 : children.position.y.toFixed(6) / 10 + "*cm"} ${children.position.z === 0 ? 0 : children.position.z.toFixed(6) / 10 + "*cm"}\n`
						}

					}


					//:vis world OFF
					// }	

					i++;

				}

			});


			var sceneText = `:volu world BOX 5*m 5*m 5*m G4_AIR\n`;
			sceneText += `:vis world OFF\n\n`;

			// sceneText += `:rotm r000 0 0 0\n`;
			sceneText += `${rotationText}\n`;

			sceneText += `${variableText}\n`;

			sceneText += `${solidText}\n`;

			sceneText += `${voluText}\n`;

			sceneText += `${colorText}\n`;

			sceneText += `${placeText}\n`;

			// downloadGeant4File(sceneText, 'detector.tg')
			return sceneText;
		} else {
			alert('The added model could not be found.');
		}

	}

	//Export Macro
	static async exportMacro(editor) {

		var object = null;
		editor.scene.traverse(function (node) {
			if (node.name === 'RadiationSource') {
				object = node;
			}
		})

		// const object = editor.selected;

		if (object) {
			const position = object.position
			var sourceShape;

			switch (object.source) {
				case 'Point':

					sourceShape = null;
					break;

				case "Plane":

					sourceShape = object.planeshape;
					break;

				case "Beam":

					sourceShape = null;
					break;

				case "Surface":

					sourceShape = object.volumeshape;
					break;

				case "Volume":

					sourceShape = object.volumeshape;
					break;

				default:
					break;
			}

			let macro = '';

			macro += `/gps/particle ${object.energykind}`
			macro += `\n/gps/energy ${object.energysize} ${object.energyunit}`
			macro += `\n/gps/pos/centre ${position.x / 10} ${position.y / 10} ${position.z / 10} cm`
			macro += `\n/gps/pos/type ${object.source}`
			if (sourceShape) {
				macro += `\n/gps/pos/shape ${sourceShape}`
				if (object.halfX) {
					macro += `\n/gps/pos/halfx ${object.halfX} cm`
				}

				if (object.halfY) {
					macro += `\n/gps/pos/halfy ${object.halfY} cm`
				}

				if (object.halfZ) {
					macro += `\n/gps/pos/halfz ${object.halfZ} cm`
				}

				if (object.innerradius) {
					macro += `\n/gps/pos/inner_radius ${object.innerradius} cm`
				}

				if (object.outerradius) {
					macro += `\n/gps/pos/outer_radius ${object.outerradius} cm`
				}

				if (object.alpha) {
					macro += `\n/gps/pos/paralp ${object.alpha}`
				}

				if (object.theta) {
					macro += `\n/gps/pos/parthe ${object.theta}`
				}

				if (object.phi) {
					macro += `\n/gps/pos/parphi ${object.phi}`
				}
			}

			return macro;

		} else {

			let macro = '';

			macro += `# print macro commands on screen\n`;
			macro += `/control/verbose 1\n`;
			macro += `# uncomment the following line if you use https://github.com/jintonic/gears\n`;
			macro += `/geometry/source detector.tg\n\n`;

			macro += `# initialize geometry and physics\n`;
			macro += `/run/initialize\n\n`;

			macro += `# change particle and its energy here\n`;
			macro += `/gps/particle gamma\n`;
			macro += `/gps/energy 2.6 MeV\n`;
			macro += `/gps/ang/type iso\n\n`;

			macro += `# visualize geometry and events for debugging\n`;
			macro += `/vis/open\n`;
			macro += `/vis/drawVolume\n`;
			macro += `/vis/scene/add/trajectories\n`;
			macro += `/vis/scene/endOfEventAction accumulate 10\n`;
			macro += `/run/beamOn 10\n`;

			return macro;
		}
	}
}

export { Factory }