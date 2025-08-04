import * as THREE from 'three';
import { UIDiv, UIRow, UIText, UINumber, UIInteger, UISelect } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aPolyconeGeometry } from './libs/geometry/Polycons.js';

function GeometryParametersPanel(editor, object) {
    const strings = editor.strings;
    const container = new UIDiv();
    const geometry = object.geometry;
    const parameters = geometry.parameters;
    const zPlaneRowsContainer = new UIDiv();
    const zPlaneInputs = [];
    
    // Define unit options and multipliers
    const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
    const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
    let baseDimensions = {
        zPlaneData: parameters.zPlaneData ? [...parameters.zPlaneData] : []
    };
    let isUnitChange = false;
    
    // Store the current values between updates
    let currentZPlaneData = parameters.zPlaneData ? [...parameters.zPlaneData] : [];
    
    // Default Unit Selection
    const defaultUnitRow = new UIRow();
    const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
    container.add(defaultUnitRow);
    
    //S-Phi
    const sphiRow = new UIRow();
    const sphiI = new UINumber(parameters.SPhi).setRange(0, Infinity).onChange(update);
    sphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/sphi')).setWidth('90px'));
    sphiRow.add(sphiI);
    sphiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(sphiRow);

    //D-Phi
    const dphiRow = new UIRow();
    const dphiI = new UINumber(parameters.DPhi).setRange(0, Infinity).onChange(update);
    dphiRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/dphi')).setWidth('90px'));
    dphiRow.add(dphiI);
    dphiRow.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
    container.add(dphiRow);

    // Number of Z-Plane
    const znumberRow = new UIRow();
    const znumberI = new UIInteger(parameters.numZPlanes).setRange(2, Infinity).onChange(() => {
        saveCurrentValues();
        updateZPlaneRows();
        update();
    });
    znumberRow.add(new UIText(strings.getKey('sidebar/geometry/apolycone_geometry/znumber')).setWidth('90px'));
    znumberRow.add(znumberI);
    container.add(znumberRow);

    //Z-Row
    container.add(zPlaneRowsContainer);
    
    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = defaultUnitSelect.getValue();
        
        // Convert base dimensions to new unit
        for (let i = 0; i < baseDimensions.zPlaneData.length; i += 3) {
            baseDimensions.zPlaneData[i] = baseDimensions.zPlaneData[i]; // z-coordinate
            baseDimensions.zPlaneData[i + 1] = baseDimensions.zPlaneData[i + 1]; // rInner
            baseDimensions.zPlaneData[i + 2] = baseDimensions.zPlaneData[i + 2]; // rOuter
        }
        
        // Update all unit selectors and input values
        zPlaneInputs.forEach((inputs, index) => {
            const baseIndex = index * 3;
            inputs.z.setValue(baseDimensions.zPlaneData[baseIndex] / unitMultiplier[selectedUnit]);
            inputs.rInner.setValue(baseDimensions.zPlaneData[baseIndex + 1] / unitMultiplier[selectedUnit]);
            inputs.rOuter.setValue(baseDimensions.zPlaneData[baseIndex + 2] / unitMultiplier[selectedUnit]);
            inputs.unitSelect.setValue(selectedUnit);
        });
        
        isUnitChange = false;
        update();
    }
    
    function saveCurrentValues() {
        if (zPlaneInputs.length === 0) return;
        
        currentZPlaneData = [];
        baseDimensions.zPlaneData = [];
        zPlaneInputs.forEach(inputs => {
            const unit = inputs.unitSelect.getValue();
            const zValue = inputs.z.getValue() * unitMultiplier[unit];
            const rInnerValue = inputs.rInner.getValue() * unitMultiplier[unit];
            const rOuterValue = inputs.rOuter.getValue() * unitMultiplier[unit];
            
            currentZPlaneData.push(inputs.z.getValue(), inputs.rInner.getValue(), inputs.rOuter.getValue());
            baseDimensions.zPlaneData.push(zValue, rInnerValue, rOuterValue);
        });
    }
    
    function updateZPlaneRows() {
        zPlaneRowsContainer.clear();
        zPlaneInputs.length = 0;
        
        const headerRow = new UIRow();
        headerRow.add(new UIText('Z-Plane').setWidth('50px'));
        headerRow.add(new UIText('z:').setWidth('50px'));
        headerRow.add(new UIText('rIn:').setWidth('50px'));
        headerRow.add(new UIText('rOut:').setWidth('50px'));
        headerRow.add(new UIText('Unit').setWidth('60px'));
        zPlaneRowsContainer.add(headerRow);
        
        const numZPlanes = znumberI.getValue();
        const currentUnit = defaultUnitSelect.getValue();
        
        for (let i = 0; i < numZPlanes; i++) {
            const planeRow = new UIRow();
            planeRow.add(new UIText(`${i + 1}`).setWidth('50px'));
            
            const zValue = i * 3 < currentZPlaneData.length ? currentZPlaneData[i * 3] : i;
            const rInnerValue = i * 3 + 1 < currentZPlaneData.length ? currentZPlaneData[i * 3 + 1] : 0;
            const rOuterValue = i * 3 + 2 < currentZPlaneData.length ? currentZPlaneData[i * 3 + 2] : 1;
            
            const zInput = new UINumber(zValue).onChange(() => {
                updateDimensions();
                enforceZOrdering();
            });
            const rInnerInput = new UINumber(rInnerValue).onChange(updateDimensions);
            const rOuterInput = new UINumber(rOuterValue).onChange(updateDimensions);
            const unitSelect = new UISelect().setOptions(unitOptions).setValue(currentUnit).onChange(handleUnitChange);
            
            planeRow.add(zInput.setWidth('50px'));
            planeRow.add(rInnerInput.setWidth('50px'));
            planeRow.add(rOuterInput.setWidth('50px'));
            planeRow.add(unitSelect.setWidth('60px'));
            
            zPlaneInputs.push({ 
                z: zInput, 
                rInner: rInnerInput, 
                rOuter: rOuterInput,
                unitSelect: unitSelect
            });
            zPlaneRowsContainer.add(planeRow);
        }
        
        enforceAllConstraints();
    }
    
    function updateDimensions() {
        if (!isUnitChange) {
            saveCurrentValues();
            enforceAllConstraints();
            update();
        }
    }
    
    function handleUnitChange() {
        isUnitChange = true;
        
        // Update input values when individual unit changes
        zPlaneInputs.forEach((inputs, index) => {
            const selectedUnit = inputs.unitSelect.getValue();
            const baseIndex = index * 3;
            
            if (baseIndex < baseDimensions.zPlaneData.length) {
                inputs.z.setValue(baseDimensions.zPlaneData[baseIndex] / unitMultiplier[selectedUnit]);
                inputs.rInner.setValue(baseDimensions.zPlaneData[baseIndex + 1] / unitMultiplier[selectedUnit]);
                inputs.rOuter.setValue(baseDimensions.zPlaneData[baseIndex + 2] / unitMultiplier[selectedUnit]);
            }
        });
        
        isUnitChange = false;
    }
    
    function enforceZOrdering() {
        // Ensure Z-coordinates are in ascending order
        for (let i = 0; i < zPlaneInputs.length; i++) {
            const currentUnit = zPlaneInputs[i].unitSelect.getValue();
            let zValue = zPlaneInputs[i].z.getValue();
            
            // Check against previous Z-plane
            if (i > 0) {
                const prevUnit = zPlaneInputs[i - 1].unitSelect.getValue();
                const prevZ = zPlaneInputs[i - 1].z.getValue() * unitMultiplier[prevUnit] / unitMultiplier[currentUnit];
                if (zValue <= prevZ) {
                    zValue = prevZ + 0.001 / unitMultiplier[currentUnit];
                    zPlaneInputs[i].z.setValue(zValue);
                }
            }
            
            // Check against next Z-plane
            if (i < zPlaneInputs.length - 1) {
                const nextUnit = zPlaneInputs[i + 1].unitSelect.getValue();
                const nextZ = zPlaneInputs[i + 1].z.getValue() * unitMultiplier[nextUnit] / unitMultiplier[currentUnit];
                if (zValue >= nextZ) {
                    const newNextZ = zValue + 0.001 / unitMultiplier[nextUnit];
                    zPlaneInputs[i + 1].z.setValue(newNextZ);
                }
            }
        }
    }
    
    function enforceConstraint(index) {
        const inputs = zPlaneInputs[index];
        const unit = inputs.unitSelect.getValue();
        
        // Enforce outer radius minimum
        if (inputs.rOuter.getValue() < 0.001 / unitMultiplier[unit]) {
            inputs.rOuter.setValue(0.001 / unitMultiplier[unit]);
        }
        
        // Enforce inner radius minimum
        if (inputs.rInner.getValue() < 0) {
            inputs.rInner.setValue(0);
        }
        
        // Enforce inner < outer radius relationship
        const minGap = 0.001 / unitMultiplier[unit];
        if (inputs.rInner.getValue() >= inputs.rOuter.getValue() - minGap) {
            inputs.rInner.setValue(Math.max(0, inputs.rOuter.getValue() - minGap));
        }
    }
    
    function enforceAllConstraints() {
        zPlaneInputs.forEach((_, i) => enforceConstraint(i));
        enforceZOrdering();
    }
    
    function update() {
        saveCurrentValues();
        
        const zPlaneDataArray = [];
        zPlaneInputs.forEach(inputs => {
            const unit = inputs.unitSelect.getValue();
            zPlaneDataArray.push(
                inputs.z.getValue() * unitMultiplier[unit],
                inputs.rInner.getValue() * unitMultiplier[unit],
                inputs.rOuter.getValue() * unitMultiplier[unit]
            );
        });
        
        editor.execute(new SetGeometryCommand(editor, object, new aPolyconeGeometry(sphiI.getValue(), dphiI.getValue(), znumberI.getValue(), zPlaneDataArray)));
    }
    
    updateZPlaneRows();
    return container;
}

export { GeometryParametersPanel };