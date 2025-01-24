import * as THREE from 'three';
import tippy from 'tippy.js';
import { UIDiv, UIRow, UIText, UINumber, UISelect } from './libs/ui.js';
import { SetGeometryCommand } from './commands/SetGeometryCommand.js';
import { CSG } from './libs/CSGMesh.js';
import { BoxGeometry } from './libs/geometry/BoxGeometry.js';

function GeometryParametersPanel( editor, object ) {
    
    const strings = editor.strings;
    const container = new UIDiv();
    const geometry = object.geometry;
    const parameters = geometry.parameters;

    // Define unit options
    const unitOptions = { cm: 'cm', inch: 'inch', mm: 'mm' };

    // Base dimensions stored in mm for consistent calculations
    let baseDimensions = {
        width: parameters.width,  
        height: parameters.height, 
        depth: parameters.depth
    };

    // Unit conversion multipliers relative to mm
    const unitMultiplier = {
        cm: 1, 
        inch: 2.54, 
        mm: 0.1 
    };

    let isUnitChange = false; // Flag to track if a unit change is occurring

    // Default Unit Row
    const defaultUnitRow = new UIRow();
	const defaultUnitSelect = new UISelect().setOptions( unitOptions ).setValue('cm').onChange( updateDefaultUnit );
	defaultUnitRow.add( new UIText( strings.getKey( 'sidebar/geometry/default_unit' ) ).setWidth( '90px' ) );
	defaultUnitRow.add( defaultUnitSelect );
    setTimeout(updateDefaultUnit, 300); //shows the default units in cm

    //grid space
    const gridSpace = new UIText(strings.getKey('sidebar/geometry/grid_Space')).setClass('grid_Space');
    defaultUnitRow.add(gridSpace);
	container.add( defaultUnitRow );

    tippy(gridSpace.dom, { //For comment
        content: 'The grid is 10x10, with each square and the space between lines measuring 1 cm.',
        placement: 'top', 
    });

    // Width Row
    const widthRow = new UIRow();
    const width = new UINumber(baseDimensions.width).setRange(0.01,Infinity).onChange(updateDimensions);
    const widthUnitSelect = new UISelect().setOptions( unitOptions ).setValue('mm').onChange( handleUnitChange );

	widthRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/width' ) ).setWidth( '90px' ) );
	widthRow.add( width );
	widthRow.add( widthUnitSelect );
	container.add( widthRow );

    // Height Row
    const heightRow = new UIRow();
    const height = new UINumber(baseDimensions.height).setRange(0.01,Infinity).onChange(updateDimensions);
    const heightUnitSelect = new UISelect().setOptions(unitOptions).setValue('mm').onChange(handleUnitChange);

	heightRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/height' ) ).setWidth( '90px' ) );
	heightRow.add( height );
	heightRow.add( heightUnitSelect );
	container.add( heightRow );

    // Depth Row
    const depthRow = new UIRow();
    const depth = new UINumber(baseDimensions.depth).setRange(0.01,Infinity).onChange(updateDimensions);
    const depthUnitSelect = new UISelect().setOptions(unitOptions).setValue('mm').onChange(handleUnitChange);

	depthRow.add( new UIText( strings.getKey( 'sidebar/geometry/box_geometry/depth' ) ).setWidth( '90px' ) );
	depthRow.add( depth );
	depthRow.add( depthUnitSelect );
	container.add( depthRow );

    // Function to update dimensions when the default unit changes
    function updateDefaultUnit() {
        isUnitChange = true; // Prevent normal value change handling
        const selectedUnit = defaultUnitSelect.getValue();

        // Update the displayed values for width, height, and depth
        width.setValue(baseDimensions.width / unitMultiplier[selectedUnit]);
        height.setValue(baseDimensions.height / unitMultiplier[selectedUnit]);
        depth.setValue(baseDimensions.depth / unitMultiplier[selectedUnit]);

        // Update unit selectors to match the new default unit
        widthUnitSelect.setValue(selectedUnit);
        heightUnitSelect.setValue(selectedUnit);
        depthUnitSelect.setValue(selectedUnit);

        updateGeometry(); // Apply changes to the geometry
        isUnitChange = false;
    }

    // Function to update the base dimensions and geometry based on value changes
    function updateDimensions() {
        if (!isUnitChange) {
            const widthUnit = widthUnitSelect.getValue();
            const heightUnit = heightUnitSelect.getValue();
            const depthUnit = depthUnitSelect.getValue();

            // Convert displayed values to base dimensions in mm
            baseDimensions.width = width.getValue() * unitMultiplier[widthUnit];
            baseDimensions.height = height.getValue() * unitMultiplier[heightUnit];
            baseDimensions.depth = depth.getValue() * unitMultiplier[depthUnit];

            updateGeometry(); // Apply changes to the geometry
        }
    }

    // Function to handle unit changes and conversion
    function handleUnitChange() {
        isUnitChange = true; // Set flag to true to prevent value change handling
        const selectedWidthUnit = widthUnitSelect.getValue();
        const selectedHeightUnit = heightUnitSelect.getValue();
        const selectedDepthUnit = depthUnitSelect.getValue();

        // Update displayed values for each dimension based on their selected unit
        width.setValue(baseDimensions.width / unitMultiplier[selectedWidthUnit]);
        height.setValue(baseDimensions.height / unitMultiplier[selectedHeightUnit]);
        depth.setValue(baseDimensions.depth / unitMultiplier[selectedDepthUnit]);

        updateGeometry(); // Apply changes to the geometry if needed
        isUnitChange = false;
    }

    // Function to update the geometry
    function updateGeometry() {
        // Create a new geometry using the base dimensions
        const width = baseDimensions.width;
        const height = baseDimensions.height;
        const depth = baseDimensions.depth;
        const widthSegments = baseDimensions.width;
        const heightSegments = baseDimensions.height;
        const depthSegments = baseDimensions.depth;

        // Execute the geometry update command
        editor.execute( new SetGeometryCommand( editor, object, new BoxGeometry(width, height, depth)));
    }

    return container;
}

export { GeometryParametersPanel };
