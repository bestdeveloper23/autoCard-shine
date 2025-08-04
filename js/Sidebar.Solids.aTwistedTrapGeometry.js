import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger, UISelect } from './libs/ui.js';
import tippy from 'tippy.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTwistedTrapGeometry } from './libs/geometry/TwistedTrap.js';

function GeometryParametersPanel(editor, object) {
    const strings = editor.strings;
    const container = new UIDiv();
    const geometry = object.geometry;
    const parameters = geometry.parameters;
    const EPSILON = 0.0001;

    // Define unit options and multipliers
    const unitOptions = { cm: 'cm', mm: 'mm', inch: 'inch' };
    const unitMultiplier = { cm: 1, mm: 0.1, inch: 2.54 }; // Conversion factor relative to cm
    let baseDimensions = {
        dz: parameters.dz,
        dy1: parameters.dy1,
        dx1: parameters.dx1,
        dx2: parameters.dx2,
        dy2: parameters.dy2,
        dx3: parameters.dx3,
        dx4: parameters.dx4
    };
    let isUnitChange = false;

    // For validation error messages
    const errorMessageDiv = new UIDiv().setClass('error-message');
    errorMessageDiv.dom.style.display = 'none';

    // Default Unit Selection
    const defaultUnitRow = new UIRow();
    const defaultUnitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(updateDefaultUnit);
    defaultUnitRow.add(new UIText('Default Unit').setWidth('90px'), defaultUnitSelect);
    container.add(defaultUnitRow);

    // grid space
    const gridSpace = new UIText('ℹ️');
    const gridSpace2 = new UIText(strings.getKey('sidebar/geometry/grid_Space')).setClass('grid_Space');
    let instructionrow = new UIRow();
    instructionrow.add(gridSpace);
    instructionrow.add(gridSpace2);
    container.add(instructionrow);
    container.add(errorMessageDiv);

    tippy(gridSpace.dom, {
        content: 'Valid shapes: Either both ends rectangular (dx1=dx2, dx3=dx4) OR both trapezoids (if dx1≠dx2 and dx3≠dx4, then dy2=dy1×(dx3-dx4)/(dx1-dx2)). No mixed shapes allowed.',
        placement: 'top', 
    });

    tippy(gridSpace2.dom, {
        content: 'The grid is 10x10, with each square and the space between lines measuring 1 cm.',
        placement: 'top', 
    });

    // Create parameter rows with unit conversion for dimensional parameters
    const createDimensionalParameterRow = (label, value, paramKey, range = [0, Infinity]) => {
        const row = new UIRow();
        const input = new UINumber(value).onChange(updateDimensions);
        const unitSelect = new UISelect().setOptions(unitOptions).setValue('cm').onChange(handleUnitChange);
        row.add(new UIText(strings.getKey(label)).setWidth('90px'));
        row.add(input);
        row.add(unitSelect);
        container.add(row);
        return { input, unitSelect, paramKey };
    };

    // Create parameter rows for angles (no unit conversion)
    const createAngleParameterRow = (label, value, range = [-90, 90]) => {
        const row = new UIRow();
        const input = new UINumber(value).setRange(range[0], range[1]).onChange(updateGeometry);
        row.add(new UIText(strings.getKey(label)).setWidth('90px'));
        row.add(input);
        row.add(new UIText(strings.getKey('sidebar/properties/angleunit')).setWidth('20px'));
        container.add(row);
        return input;
    };

    // Create all parameter inputs
    const angleI = createAngleParameterRow('sidebar/geometry/atrapezoidp_geometry/twistedangle', parameters.twistedangle, [-90, 90]);
    const heightParam = createDimensionalParameterRow('sidebar/geometry/atrapezoidp_geometry/dz', parameters.dz, 'dz');
    const thetaI = createAngleParameterRow('sidebar/geometry/atrapezoidp_geometry/theta', parameters.theta, [-90, 90]);
    const phiI = createAngleParameterRow('sidebar/geometry/atrapezoidp_geometry/phi', parameters.phi, [-90, 90]);
    const depth1Param = createDimensionalParameterRow('sidebar/geometry/atrapezoidp_geometry/dy1', parameters.dy1, 'dy1', [0.0001, Infinity]);
    const width1Param = createDimensionalParameterRow('sidebar/geometry/atrapezoidp_geometry/dx1', parameters.dx1, 'dx1');
    const width2Param = createDimensionalParameterRow('sidebar/geometry/atrapezoidp_geometry/dx2', parameters.dx2, 'dx2', [0.0001, Infinity]);
    const depth2Param = createDimensionalParameterRow('sidebar/geometry/atrapezoidp_geometry/dy2', parameters.dy2, 'dy2', [0.0001, Infinity]);

    // Add Calculate dy2 button
    const calculateDy2Row = new UIRow();
    const calculateDy2Button = document.createElement('button');
    calculateDy2Button.textContent = 'Calculate dy2';
    calculateDy2Button.className = 'calculate-button';
    calculateDy2Button.addEventListener('click', () => {
        const params = getParameters();
        const result = calculateDy2(params);
    
        if (result.valid) {
            const isRectangularMessage = result.message.includes("Both ends are rectangular dy2 can be any positive value.");
            const currentDy2 = depth2Param.input.getValue();
            if (isRectangularMessage && currentDy2 === 0) {
                depth2Param.input.setValue(0.001);
                baseDimensions.dy2 = 0.001 * unitMultiplier[depth2Param.unitSelect.getValue()];
            } else {
                depth2Param.input.setValue(result.value);
                baseDimensions.dy2 = result.value * unitMultiplier[depth2Param.unitSelect.getValue()];
            }
            displayMessage(result.message, "info");
            updateGeometry();
        } else {
            displayMessage(result.message, "error");
        }
    });
    
    calculateDy2Row.add(new UIText('').setWidth('90px'));
    calculateDy2Row.dom.appendChild(calculateDy2Button);
    container.add(calculateDy2Row);

    const width3Param = createDimensionalParameterRow('sidebar/geometry/atrapezoidp_geometry/dx3', parameters.dx3, 'dx3');
    const width4Param = createDimensionalParameterRow('sidebar/geometry/atrapezoidp_geometry/dx4', parameters.dx4, 'dx4');
    const alphaI = createAngleParameterRow('sidebar/geometry/atrapezoidp_geometry/alpha', parameters.alpha, [-90, 90]);

    // Store dimensional parameter references
    const dimensionalParams = [heightParam, depth1Param, width1Param, width2Param, depth2Param, width3Param, width4Param];

    function updateDefaultUnit() {
        isUnitChange = true;
        const selectedUnit = defaultUnitSelect.getValue();

        dimensionalParams.forEach(param => {
            param.input.setValue(baseDimensions[param.paramKey] / unitMultiplier[selectedUnit]);
            param.unitSelect.setValue(selectedUnit);
        });

        isUnitChange = false;
        updateGeometry();
    }

    function updateDimensions() {
        if (!isUnitChange) {
            dimensionalParams.forEach(param => {
                const unit = param.unitSelect.getValue();
                baseDimensions[param.paramKey] = param.input.getValue() * unitMultiplier[unit];
            });
            updateGeometry();
        }
    }

    function handleUnitChange() {
        isUnitChange = true;

        dimensionalParams.forEach(param => {
            const selectedUnit = param.unitSelect.getValue();
            param.input.setValue(baseDimensions[param.paramKey] / unitMultiplier[selectedUnit]);
        });

        isUnitChange = false;
    }

    function getParameters() {
        return {
            dx1: baseDimensions.dx1,
            dx2: baseDimensions.dx2,
            dy1: baseDimensions.dy1,
            dx3: baseDimensions.dx3,
            dx4: baseDimensions.dx4,
            dy2: baseDimensions.dy2,
            dz: baseDimensions.dz,
            theta: thetaI.getValue(),
            phi: phiI.getValue(),
            alpha: alphaI.getValue(),
            twistedangle: angleI.getValue()
        };
    }

    function calculateDy2(params) {
        const { dx1, dx2, dy1, dx3, dx4 } = params;
        
        // Check if we have valid trapezoids
        const isFirstEndRectangular = Math.abs(dx1 - dx2) < EPSILON;
        const isSecondEndRectangular = Math.abs(dx3 - dx4) < EPSILON;
        
        // Both ends are rectangular
        if (isFirstEndRectangular && isSecondEndRectangular) {
            return { 
                valid: true, 
                message: "Both ends are rectangular dy2 can be any positive value." 
            };
        }
        
        // Mixed shapes
        if (isFirstEndRectangular !== isSecondEndRectangular) {
            return {
                valid: false,
                message: "Cannot calculate dy2: Mixed shapes are not allowed. Both ends must be either rectangular or trapezoid."
            };
        }
        
        // Both ends are trapezoids
        if (Math.abs(dx1 - dx2) < EPSILON) {
            return { 
                valid: false, 
                message: "Cannot calculate dy2: dx1 and dx2 are too similar" 
            };
        }
        
        // Calculate the expected dy2 value
        const calculatedDy2 = dy1 * (dx3 - dx4) / (dx1 - dx2);
        
        if (calculatedDy2 <= 0) {
            return {
                valid: false,
                message: "Cannot calculate dy2: Calculation resulted in a -ve value check if dx1<dx2 and dx3<dx4"
            };
        }
        
        return { 
            valid: true, 
            value: calculatedDy2,
            message: `Calculated dy2 = ${calculatedDy2.toFixed(4)}`
        };
    }

    function handleGeometryValidation(params) {
        const { dx1, dx2, dy1, dx3, dx4, dy2 } = params;
        
        const isFirstEndRectangular = Math.abs(dx1 - dx2) < EPSILON;
        const isSecondEndRectangular = Math.abs(dx3 - dx4) < EPSILON;
        
        // Both ends are rectangular - valid configuration
        if (isFirstEndRectangular && isSecondEndRectangular) {
            return { 
                valid: true, 
                message: "Both ends are rectangular - dy2 can be any positive value." 
            };
        }
        
        // Both ends are trapezoids - check relationship
        if (!isFirstEndRectangular && !isSecondEndRectangular) {
            if (Math.abs(dx1 - dx2) < EPSILON) {
                return { 
                    valid: false, 
                    message: "Invalid trapezoid: dx1 and dx2 are too similar for a trapezoid." 
                };
            }
            
            const expectedDy2 = dy1 * (dx3 - dx4) / (dx1 - dx2);
            
            if (Math.abs(dy2 - expectedDy2) < EPSILON) {
                return { valid: true, message: "" };
            } else {
                return { 
                    valid: false, 
                    message: `Invalid dy2: should be ${expectedDy2.toFixed(4)} based on the relationship dy2=dy1×(dx3-dx4)/(dx1-dx2)` 
                };
            }
        }
        
        // Mixed shapes are not allowed
        return { 
            valid: false, 
            message: "Invalid shape: Mixed shapes are not allowed. Both ends must be either rectangular or trapezoid." 
        };
    }

    function displayMessage(text, type) {
        errorMessageDiv.dom.textContent = text;
        errorMessageDiv.dom.className = `error-message message-${type}`;
        errorMessageDiv.dom.style.display = 'block';
    }

    function updateGeometry() {
        const params = getParameters();
        const validation = handleGeometryValidation(params);
        
        if (validation.valid) {
            editor.execute(new SetGeometryCommand(editor, object, new aTwistedTrapGeometry(
                params.twistedangle, 
                params.dz, 
                params.theta, 
                params.phi, 
                params.dy1, 
                params.dx1, 
                params.dx2, 
                params.dy2, 
                params.dx3, 
                params.dx4, 
                params.alpha
            )));
        } else {
            displayMessage(validation.message, "error");
        }
    }

    return container;
}

export { GeometryParametersPanel };