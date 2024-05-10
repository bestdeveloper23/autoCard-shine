import { UIPanel, UIDivider, UIBreak, UIText, UIButton, UIRow, UIInteger, UISelect, UINumber } from './libs/ui.js';

function SidebarModifies( editor ) {

	const strings = editor.strings;

	const signals = editor.signals;

	const container = new UIPanel();

	container.add( new UIText( strings.getKey( 'sidebar/modify/replicas' ) ).setTextTransform( 'uppercase' ) );
	container.add( new UIBreak() );
	container.add( new UIBreak() );

	//

    // type

    const replicaTypeRow = new UIRow();
    const replicaTypeSelect = new UISelect().setWidth('150px').setFontSize('12px').onChange(Update);

    replicaTypeRow.add(new UIText(strings.getKey('sidebar/modify/replicas/type')).setWidth('90px'));
    replicaTypeRow.add(replicaTypeSelect);
    replicaTypeSelect.setOptions(replicaTypeOption);

    container.add(replicaTypeRow);


    // axis

    const replicaAxisRow = new UIRow();
    const replicaAxisSelect = new UISelect().setWidth('150px').setFontSize('12px');

    replicaAxisRow.add(new UIText(strings.getKey('sidebar/modify/replicas/axis')).setWidth('90px'));
    replicaAxisRow.add(replicaAxisSelect);
    replicaAxisSelect.setOptions(replicaAxisOption);

    container.add(replicaAxisRow);
    

    // angle

	const replicaAngleRow = new UIRow();
	const replicaAngle = new UINumber().setWidth( '150px' ).setFontSize( '12px' ).setUnit('°');
    replicaAngleRow.setDisplay('none');
    
	replicaAngleRow.add( new UIText( strings.getKey( 'sidebar/modify/replicas/angle' ) ).setWidth( '90px' ) );
	replicaAngleRow.add( replicaAngle );
    replicaAngle.setValue(90);

	container.add( replicaAngleRow );


    // distance

	const replicaDistanceRow = new UIRow();
	const replicaDistance = new UINumber().setWidth( '150px' ).setFontSize( '12px' );
    replicaDistanceRow.setDisplay('none');

	replicaDistanceRow.add( new UIText( strings.getKey( 'sidebar/modify/replicas/distance' ) ).setWidth( '90px' ) );
	replicaDistanceRow.add( replicaDistance );
    replicaDistance.setValue(1);

	container.add( replicaDistanceRow );


    // radius

	const replicaRadiusRow = new UIRow();
	const replicaRadius = new UINumber().setWidth( '150px' ).setFontSize( '12px' );
    replicaRadiusRow.setDisplay('none');

	replicaRadiusRow.add( new UIText( strings.getKey( 'sidebar/modify/replicas/radius' ) ).setWidth( '90px' ) );
	replicaRadiusRow.add( replicaRadius );
    replicaRadius.setValue(1);

	container.add( replicaRadiusRow );

    
    // count

	const replicaCountRow = new UIRow();
	const replicaCount = new UIInteger().setWidth( '150px' ).setFontSize( '12px' );

	replicaCountRow.add( new UIText( strings.getKey( 'sidebar/modify/replicas/count' ) ).setWidth( '90px' ) );
	replicaCountRow.add( replicaCount );
    replicaCount.setValue(2);

	container.add( replicaCountRow );
    

    // uuid

	const replicaSubmitRow = new UIRow();
	const replicaSubmit = new UIButton( strings.getKey( 'sidebar/modify/replicas/submit' ) ).setMarginLeft( '150px' ).onClick( SubmitReplicas );

	replicaSubmitRow.add( replicaSubmit );

	container.add( replicaSubmitRow );
    

    // add a divider
    container.add( new UIDivider() );

    function Update() {

        const replicationType = replicaTypeSelect.getValue();

        if( replicationType === 'Linear') {

            replicaRadiusRow.setDisplay('none');
            replicaAngleRow.setDisplay('none');
            replicaDistanceRow.setDisplay('flex');

        } else if( replicationType === 'Circular' ) {

            replicaRadiusRow.setDisplay('flex');
            replicaAngleRow.setDisplay('flex');
            replicaDistanceRow.setDisplay('none');

        }
    }

    function SubmitReplicas() {

        const replicationType = replicaTypeSelect.getValue();
        const replicationAxis = replicaAxisSelect.getValue();
        const replicationDistance = replicaDistance.getValue();
        const replicationRadius = replicaRadius.getValue();
        const replicationAngle = replicaAngle.getValue();
        const replicationCount = replicaCount.getValue();

        if( !replicationType || !replicationAxis ) {
            alert( 'Please input validate values for replication.');
            return;
        }
        

        switch ( replicationType ) {

            case 'Linear':

                {
                    const object = editor.selected;

                    const originalPosition = object.position;
                    const origianlRotation = object.rotation;
                    
                    
                    for (let i = 0; i < replicationCount; i++) {
                        const replica = object.clone();

                        const modifiedDistance = replicationDistance * (i+1);

                        switch ( replicationAxis ) {

                            case 'X':

                                {
                                    replica.position.set(originalPosition.x + modifiedDistance, originalPosition.y, originalPosition.z);
                                }
                                break;

                            case 'Y':

                                {
                                    replica.position.set(originalPosition.x, originalPosition.y + modifiedDistance, originalPosition.z);
                                }
                                break;


                            case 'Z':

                                {
                                    replica.position.set(originalPosition.x, originalPosition.y, originalPosition.z + modifiedDistance);
                                }
                                break;

                            default:
                                break;

                        }

                        
                        editor.addObject( replica );
                    }
                }
                break;

            case 'Circular':

                {
                    const object = editor.selected;

                    const originalPosition = object.position;
                    const origianlRotation = object.rotation;
                    
                    
                    for (let i = 0; i < replicationCount; i++) {
                        const replica = object.clone();

                        switch ( replicationAxis ) {

                            case 'X':

                                {
                                    const modifiedDistanceY = replicationRadius * Math.sin(replicationAngle / 180 * Math.PI * i);
                                    const modifiedDistanceZ = replicationRadius * Math.cos(replicationAngle / 180 * Math.PI * i);

                                    replica.position.set(originalPosition.x, originalPosition.y + modifiedDistanceY, originalPosition.z + modifiedDistanceZ);
                                }
                                break;

                            case 'Y':

                                {
                                    const modifiedDistanceX = replicationRadius * Math.sin(replicationAngle / 180 * Math.PI * i);
                                    const modifiedDistanceZ = replicationRadius * Math.cos(replicationAngle / 180 * Math.PI * i);

                                    replica.position.set(originalPosition.x + modifiedDistanceX, originalPosition.y, originalPosition.z + modifiedDistanceZ);
                                }
                                break;


                            case 'Z':

                                {
                                    const modifiedDistanceY = replicationRadius * Math.sin(replicationAngle / 180 * Math.PI * i);
                                    const modifiedDistanceX = replicationRadius * Math.cos(replicationAngle / 180 * Math.PI * i);

                                    replica.position.set(originalPosition.x + modifiedDistanceX, originalPosition.y + modifiedDistanceY, originalPosition.z);
                                }
                                break;

                            default:
                                break;

                        }

                        
                        editor.addObject( replica );
                    }
                }
                break;

            default:
                break;
        }

    }
    
	return container;

}

const replicaTypeOption = {
	'Linear': 'Linear',
	'Circular': 'Circular',
};

const replicaAxisOption = {
    'X': 'X',
    'Y': 'Y',
    'Z': 'Z',
    'Rho': 'Rho',
    'Phi': 'Phi'
}


export { SidebarModifies };
