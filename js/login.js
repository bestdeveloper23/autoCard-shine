import { UIButton, UILink, UIDiv, UIInput, UIPanel, UIText } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

import { initClient, handleAuthClick, generateAndSendCode, handleSignoutClick, verifyCode, updateSigninStatus, checkUserEmail } from './libs/googleApi/googleApi.js';

function MenubarLogin( editor ) {

	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu right' );

// Login/Logout main Button
    const LoginButton = new UIButton('Log in with Google');
    LoginButton.setId('login-button');
    LoginButton.dom.addEventListener('click', () => {
        handleAuthClick;
        loginModalBackground.dom.style.display = 'block';
    });

    const LogoutButton = new UIButton('Log out');
    LogoutButton.setId('logout-button');

    LogoutButton.dom.addEventListener('click', () => {
        handleAuthClick;
        updateSigninStatus(false);
        loginModalBackground.dom.style.display = 'none';
    });

    container.add(LoginButton, LogoutButton);

    const loginModalBackground = new UIDiv();
    loginModalBackground.addClass('overlayModal');

    const loginModal = new UIDiv();
    loginModal.addClass('loginModalContainer');

    const FormLayout = new UIDiv();
    FormLayout.addClass('displayLogin');

    const DisplayForm = new UIDiv();
    DisplayForm.addClass('displayForm');

// Gmail Input
    const InputforGmailDIv = new UIDiv();
    const InputforGmailLabel = new UIText('Gmail: ');
    const InputforGmail = new UIInput('');
    InputforGmail.addClass('loginFormInput');

    InputforGmailDIv.addClass('rowfull')
    InputforGmailDIv.add(InputforGmailLabel, InputforGmail);

    
    const loginWelcomeMessage = new UIText('A PIN has sent to you, \n please check your gmail.');
    loginWelcomeMessage.dom.style.display = 'none';
    loginWelcomeMessage.addClass('welcome-message');


// Sending verification code
    const SendCodeButton = new UIButton('Send me a PIN');
    
    SendCodeButton.dom.addEventListener('click', () => {
        
        const scriptURL = 'https://script.google.com/macros/s/AKfycbw4IIWqutEqzgrqrU69d-i6SVWsTi6pkHAYSO0u81yhb4cKVP3MkXaR9xVHFUc1id1N/exec'; // Replace with your Web App URL
        
        fetch(scriptURL, {
            method: 'GET',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // const emailList = document.getElementById('email-list');
            // emailList.innerHTML = ''; // Clear the list
            // data.forEach(item => {
            // const emailItem = document.createElement('div');
            // emailItem.textContent = `Email: ${item.email}, Timestamp: ${item.timestamp}`;
            // emailList.appendChild(emailItem);
            // });


            const userEmail = InputforGmail.getValue();

            if (data && data.length > 0) {
                const emails = data.map(row => row.email);
                if (emails.includes(userEmail)) {
                    console.log(userEmail)
                  localStorage.setItem('userEmail', userEmail);
                  loginWelcomeMessage.dom.display = 'block';
                  generateAndSendCode(userEmail);
                } else {
                //   generateAndSendCode(userEmail);
                    console.log(userEmail)
                    loginWelcomeMessage.setValue('Unregistered user, register first!');
                }
            } else {
                loginWelcomeMessage.setValue('Error: This Gmail user is not registered.\nPlease register first.');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Failed to fetch emails.');
        });
    
    })

// PIN input group
    const PINDiv = new UIDiv();

    PINDiv.addClass('pincontainer');
    const InputforPINLabel = new UIText('PIN: ');
    // InputforPINLabel.dom.style.display = 'none';

    const InputforPINDiv = new UIDiv();
    InputforPINDiv.addClass('pinInputcontainer')
    const InputforPIN1 = new UIInput('').setWidth('20px');
    const InputforPIN2 = new UIInput('').setWidth('20px');
    const InputforPIN3 = new UIInput('').setWidth('20px');
    const InputforPIN4 = new UIInput('').setWidth('20px');
    
    InputforPIN1.addClass('loginFormInputPIN');
    InputforPIN2.addClass('loginFormInputPIN');
    InputforPIN3.addClass('loginFormInputPIN');
    InputforPIN4.addClass('loginFormInputPIN');


    InputforPIN1.dom.setAttribute('maxlength', 1);
    InputforPIN2.dom.setAttribute('maxlength', 1);
    InputforPIN3.dom.setAttribute('maxlength', 1);
    InputforPIN4.dom.setAttribute('maxlength', 1);

    PINDiv.dom.style.display = 'none';

    InputforPINDiv.add(InputforPIN1, InputforPIN2, InputforPIN3, InputforPIN4);
    PINDiv.add(InputforPINLabel, InputforPINDiv);

// Checkbox for remember
    const CheckboxforRemember = new UIBoolean( false, 'Remember my login status' );
	CheckboxforRemember.text.setColor( '#888' );

    CheckboxforRemember.addClass('rememberbox');
    CheckboxforRemember.dom.addEventListener('click', () => {
        CheckboxforRemember.setValue(!CheckboxforRemember.getValue())
    })

// Login Button
    const SubmitLogin = new UIButton('Log in');

// Register
    const registerDiv = new UIDiv();
    const registerContent = new UIText(`Or register free`);
    const registerLink = new UILink(' here', 'https://forms.gle/cgPREbttZ56Ex4BU9');
    registerDiv.add(registerContent, registerLink);

// Close Button

    const closeButton = new UIButton('X');
    closeButton.addClass('closeLoginForm');
    loginModal.add(closeButton);

    closeButton.dom.addEventListener('click', () => {
        loginModalBackground.dom.style.display = 'none';
    })


    LoginButton.addClass('signButton');
    LogoutButton.addClass('signButton');

    InputforGmailDIv.addClass('fullwidth');
    SendCodeButton.addClass('fullwidth');
    InputforPINLabel.addClass('fullwidth');
    InputforPINDiv.addClass('fullwidth');
    CheckboxforRemember.addClass('fullwidth');
    SubmitLogin.addClass('fullwidth');
    
    InputforPINLabel.addClass('inlinesizeFit');
    CheckboxforRemember.addClass('inlinesizeFit')

    SendCodeButton.addClass('loginformButton');
    SubmitLogin.addClass('loginformButton');

    registerDiv.addClass('registercontainer');


    DisplayForm.add(InputforGmailDIv );
	DisplayForm.add( SendCodeButton );
    DisplayForm.add( loginWelcomeMessage );
    DisplayForm.add( PINDiv );
	// DisplayForm.add( InputforPINLabel );
    // DisplayForm.add(InputforPINDiv);
	DisplayForm.add( CheckboxforRemember );
    DisplayForm.add( SubmitLogin );
    DisplayForm.add(registerDiv);

    FormLayout.add( DisplayForm );
    loginModal.add(FormLayout);
    loginModalBackground.add(loginModal);

    container.add(loginModalBackground);

	// const autosave = new UIBoolean( editor.config.getKey( 'autosave' ), strings.getKey( 'menubar/status/autosave' ) );
	// autosave.text.setColor( '#888' );
	// autosave.onChange( function () {

	// 	const value = this.getValue();

	// 	editor.config.setKey( 'autosave', value );

	// 	if ( value === true ) {

	// 		editor.signals.sceneGraphChanged.dispatch();

	// 	}

	// } );
	// container.add( autosave );

	// editor.signals.savingStarted.add( function () {

	// 	autosave.text.setTextDecoration( 'underline' );

	// } );

	// editor.signals.savingFinished.add( function () {

	// 	autosave.text.setTextDecoration( 'none' );

	// } );

	// const version = new UIText( 'r' + THREE.REVISION );
	// version.setClass( 'title' );
	// version.setOpacity( 0.5 );
	// container.add( version );

	return container;

}

export { MenubarLogin };