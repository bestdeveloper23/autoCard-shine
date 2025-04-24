import * as THREE from 'three';
import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aPolyhedraGeometry } from './libs/geometry/PolyHedra.js';

function GeometryParametersPanel(editor, object) {
    const strings = editor.strings;
    const container = new UIDiv();
    const geometry = object.geometry;
    const parameters = geometry.parameters;
    const zPlaneRowsContainer = new UIDiv();
    const zPlaneInputs = [];
    
    // Store the current values between updates
    let currentZPlaneData = parameters.zPlaneData ? [...parameters.zPlaneData] : [];
    
    // sphi
    const sphiRow = new UIRow();
    const sphiI = new UINumber(parameters.SPhi).setStep(5).setRange(0, Infinity).onChange(update);
    sphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/sphi')).setWidth('90px'));
    sphiRow.add(sphiI);
    sphiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(sphiRow);

    // dphi
    const dphiRow = new UIRow();
    const dphiI = new UINumber(parameters.DPhi).setStep(5).setRange(0, Infinity).onChange(update);
    dphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/dphi')).setWidth('90px'));
    dphiRow.add(dphiI);
    dphiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(dphiRow);

    // numside
    const numsideRow = new UIRow();
    const numsideI = new UIInteger(parameters.numSide || 5).setRange(2, Infinity).onChange(update);
    numsideRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/numside')).setWidth('90px'));
    numsideRow.add(numsideI);
    container.add(numsideRow);

    // z-count
    const znumberRow = new UIRow();
    const znumberI = new UIInteger(parameters.numZPlanes || 2).setRange(1, Infinity).onChange(() => {
        saveCurrentValues();
        updateZPlaneRows();
        update();
    });
    znumberRow.add(new UIText(strings.getKey('sidebar/geometry/apolyhedra_geometry/znumber')).setWidth('90px'));
    znumberRow.add(znumberI);
    container.add(znumberRow);
    
    container.add(zPlaneRowsContainer);
    
    function saveCurrentValues() {
        if (zPlaneInputs.length === 0) return;
        
        currentZPlaneData = [];
        zPlaneInputs.forEach(inputs => {
            currentZPlaneData.push(
                inputs.z.getValue(),
                inputs.rInner.getValue(),
                inputs.rOuter.getValue()
            );
        });
    }
    
    function updateZPlaneRows() {
        zPlaneRowsContainer.clear();
        zPlaneInputs.length = 0;
        
        const headerRow = new UIRow();
        headerRow.add(new UIText('Z-Plane').setWidth('65px'));
        headerRow.add(new UIText('z:').setWidth('62px'));
        headerRow.add(new UIText('rIn:').setWidth('62px'));
        headerRow.add(new UIText('rOut:').setWidth('62px'));
        zPlaneRowsContainer.add(headerRow);
        
        const numZPlanes = znumberI.getValue();
        
        for (let i = 0; i < numZPlanes; i++) {
            const planeRow = new UIRow();
            planeRow.add(new UIText(`${i + 1}`).setWidth('60px'));
            
            // Use current values if available, otherwise use default or original values
            const zValue = i * 3 < currentZPlaneData.length ? currentZPlaneData[i * 3] : 0;
            const rInnerValue = i * 3 + 1 < currentZPlaneData.length ? currentZPlaneData[i * 3 + 1] : 0;
            const rOuterValue = i * 3 + 2 < currentZPlaneData.length ? currentZPlaneData[i * 3 + 2] : 0.001;
            
            const zInput = new UINumber(zValue).onChange(update);
            const rOuterInput = new UINumber(rOuterValue)
                .setRange(0.001, Infinity)
                .onChange(() => {
                    enforceConstraint(i);
                    update();
                });
            const rInnerInput = new UINumber(rInnerValue)
                .setRange(0, Infinity)
                .onChange(() => {
                    enforceConstraint(i);
                    update();
                });
            
            planeRow.add(zInput.setWidth('60px'));
            planeRow.add(rInnerInput.setWidth('60px'));
            planeRow.add(rOuterInput.setWidth('60px'));
            
            zPlaneInputs.push({ z: zInput, rInner: rInnerInput, rOuter: rOuterInput });
            zPlaneRowsContainer.add(planeRow);
        }
        
        enforceAllConstraints();
    }
    
    function enforceConstraint(index) {
        const inputs = zPlaneInputs[index];
        
        if (inputs.rOuter.getValue() < 0.001) {
            inputs.rOuter.setValue(0.001);
        }
        
        if (inputs.rInner.getValue() < 0) {
            inputs.rInner.setValue(0);
        }
        
        if (inputs.rInner.getValue() >= inputs.rOuter.getValue() - 0.001) {
            inputs.rInner.setValue(inputs.rOuter.getValue() - 0.001);
        }
    }
    
    function enforceAllConstraints() {
        zPlaneInputs.forEach((_, i) => enforceConstraint(i));
    }
    
    function update() {
        saveCurrentValues();
        
        const zPlaneDataArray = [];
        zPlaneInputs.forEach(inputs => {
            zPlaneDataArray.push(
                inputs.z.getValue(),
                inputs.rInner.getValue(),
                inputs.rOuter.getValue()
            );
        });
        
        editor.execute(new SetGeometryCommand(editor, object, new aPolyhedraGeometry(
            sphiI.getValue(), 
            dphiI.getValue(), 
            numsideI.getValue(),
            znumberI.getValue(), 
            zPlaneDataArray
        )));
    }
    
    updateZPlaneRows();
    return container;
}

export { GeometryParametersPanel };