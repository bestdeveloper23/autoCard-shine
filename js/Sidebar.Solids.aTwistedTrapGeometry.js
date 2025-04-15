import * as THREE from 'three';
import { CSG } from './libs/CSGMesh.js';
import { UIDiv, UIRow, UIText, UINumber, UIInteger } from './libs/ui.js';
import tippy from 'tippy.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { aTwistedTrapGeometry } from './libs/geometry/TwistedTrap.js';

function GeometryParametersPanel(editor, object) {
    const strings = editor.strings;
    const container = new UIDiv();
    const geometry = object.geometry;
    const parameters = geometry.parameters;
    const EPSILON = 0.0001;

    // For validation error messages
    const errorMessageDiv = new UIDiv().setClass('error-message');
    errorMessageDiv.dom.style.display = 'none';

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

    // Create parameter rows with consistent pattern
    const createParameterRow = (label, value, unit, range = [0, Infinity]) => {
        const row = new UIRow();
        const input = new UINumber(value).setRange(range[0], range[1]).onChange(update);
        row.add(new UIText(strings.getKey(label)).setWidth('90px'));
        row.add(input);
        row.add(new UIText(strings.getKey(unit)).setWidth('20px'));
        container.add(row);
        return input;
    };

    // Create all parameter inputs
    const angleI = createParameterRow('sidebar/geometry/atrapezoidp_geometry/twistedangle', parameters.twistedangle, 'sidebar/properties/angleunit', [-90, 90]);
    const height = createParameterRow('sidebar/geometry/atrapezoidp_geometry/dz', parameters.dz, 'sidebar/properties/demensionunit');
    const thetaI = createParameterRow('sidebar/geometry/atrapezoidp_geometry/theta', parameters.theta, 'sidebar/properties/angleunit', [-90, 90]);
    const phiI = createParameterRow('sidebar/geometry/atrapezoidp_geometry/phi', parameters.phi, 'sidebar/properties/angleunit', [-90, 90]);
    const depth1 = createParameterRow('sidebar/geometry/atrapezoidp_geometry/dy1', parameters.dy1, 'sidebar/properties/demensionunit');
    const width1 = createParameterRow('sidebar/geometry/atrapezoidp_geometry/dx1', parameters.dx1, 'sidebar/properties/demensionunit');
    const width2 = createParameterRow('sidebar/geometry/atrapezoidp_geometry/dx2', parameters.dx2, 'sidebar/properties/demensionunit');
    const depth2 = createParameterRow('sidebar/geometry/atrapezoidp_geometry/dy2', parameters.dy2, 'sidebar/properties/demensionunit');

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
            const currentDy2 = depth2.getValue();
            if (isRectangularMessage && currentDy2 === 0) {
                depth2.setValue(0.001);
            } else {
                depth2.setValue(result.value);
            }
            displayMessage(result.message, "info");
            update();
        } else {
            displayMessage(result.message, "error");
        }
    });
    
    calculateDy2Row.add(new UIText('').setWidth('90px'));
    calculateDy2Row.dom.appendChild(calculateDy2Button);
    container.add(calculateDy2Row);

    const width3 = createParameterRow('sidebar/geometry/atrapezoidp_geometry/dx3', parameters.dx3, 'sidebar/properties/demensionunit');
    const width4 = createParameterRow('sidebar/geometry/atrapezoidp_geometry/dx4', parameters.dx4, 'sidebar/properties/demensionunit');
    const alphaI = createParameterRow('sidebar/geometry/atrapezoidp_geometry/alpha', parameters.alpha, 'sidebar/properties/angleunit', [-90, 90]);

    function getParameters() {
        return {
            dx1: width1.getValue(),
            dx2: width2.getValue(),
            dy1: depth1.getValue(),
            dx3: width3.getValue(),
            dx4: width4.getValue(),
            dy2: depth2.getValue(),
            dz: height.getValue(),
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

    function update() {
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