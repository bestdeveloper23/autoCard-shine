import { UIButton, UILink, UIDiv, UIInput, UIPanel, UIText } from './libs/ui.js';
import { UIBoolean } from './libs/ui.three.js';

function MenubarLogin( editor ) {

	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu right' );

    const loginStatusLabel = new UIText('Not logged in');
    loginStatusLabel.setId('loginStatusLabel');

// Login/Logout main Button
    const LoginButton = new UIButton('Sign up/Log in with Google');
    LoginButton.setId('login-button');
    LoginButton.dom.addEventListener('click', () => {
        loginModalBackground.dom.style.display = 'block';
    });

    const LogoutButton = new UIButton('Log out');
    LogoutButton.setId('logout-button');

    LogoutButton.dom.addEventListener('click', () => {
        updateSigninStatus(false);
        loginModalBackground.dom.style.display = 'none';
    });

    container.add(loginStatusLabel, LoginButton, LogoutButton);

    const loginModalBackground = new UIDiv();
    loginModalBackground.addClass('overlayModal');
    loginModalBackground.setId('LoginFormID')
    loginModalBackground.dom.style.display = 'none';

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
    InputforGmail.setId('gmailInput');

    InputforGmailDIv.addClass('rowfull')
    InputforGmailDIv.add(InputforGmailLabel, InputforGmail);

    
    const loginWelcomeMessage = new UIText('A PIN has sent to you, \n please check your gmail.');
    loginWelcomeMessage.dom.style.display = 'none';
    loginWelcomeMessage.setId('verification-message');


// Sending verification code
    const SendCodeButton = new UIButton('Send me a PIN');
    
    SendCodeButton.dom.addEventListener('click', () => {
        
        SendCodeButton.dom.textContent = 'Sending the PIN ... ';
                    
        SendCodeButton.dom.disabled = true;

        const scriptURL = 'https://script.google.com/macros/s/AKfycbw4IIWqutEqzgrqrU69d-i6SVWsTi6pkHAYSO0u81yhb4cKVP3MkXaR9xVHFUc1id1N/exec'; // Replace with your Web App URL
        
        fetch(scriptURL, {
            method: 'GET',
            mode: 'cors'
        })
        .then(response => response.json())
        .then(data => {

            const userEmail = InputforGmail.getValue();

            if (data && data.length > 0) {
                const emails = data.map(row => row.email);
                if (emails.includes(userEmail)) {

                  loginWelcomeMessage.setValue('A PIN has sent to you, \n please check your gmail.');
                  generateAndSendCode(userEmail);
                
                } else {

                    loginWelcomeMessage.setValue('Unknown email address. Please sign up with Gmail first!');
                    
                }
            } else {
                loginWelcomeMessage.setValue('Error: Unknown email address. Please sign up with Gmail first!');

            }

        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Failed to fetch emails.');
        }).finally(() => {
            SendCodeButton.dom.disabled = false;
            SendCodeButton.dom.textContent = 'Send me a PIN';
            loginWelcomeMessage.dom.style.display = 'block';
        });;
    
    })

// PIN input group
    const PINDiv = new UIDiv();

    PINDiv.addClass('pincontainer');
    
    const InputforPINLabel = new UIText('PIN: ');
    // InputforPINLabel.dom.style.display = 'none';

    const InputforPINDiv = new UIDiv();
    InputforPINDiv.addClass('pinInputcontainer');
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
    const registerContent = new UIText('Or sign up free\u00A0');
    const registerLink = new UILink('here', 'https://forms.gle/cgPREbttZ56Ex4BU9');
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

    SubmitLogin.dom.addEventListener('click', () => {
        
        let inputCode = '';
        const pincodearray = document.getElementsByClassName('loginFormInputPIN');
    
        // Convert HTMLCollection to an array using the spread operator
        [...pincodearray].forEach(pinInput => {
            inputCode += pinInput.value;
            
        });

        if (inputCode) {

            verifyCode();    
        } else {
            document.getElementById('verification-message').textContent = 'Please input PIN code';
        }
        
    })

    // PIN input chaining

	return container;

}

  
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      document.getElementById('login-button').style.display = 'none';
      document.getElementById('logout-button').style.display = 'block';

      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) 
        {
            document.getElementById('loginStatusLabel').textContent = userEmail;
        }

    } else {
        
        const pincodearray = document.getElementsByClassName('loginFormInputPIN');

        // Convert HTMLCollection to an array using the spread operator
        [...pincodearray].forEach(pinInput => {
            pinInput.value = '';
            pinInput.textContent = '';
        });
        document.getElementById('gmailInput').textContent = '';

        document.getElementById('login-button').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('verification-message').style.display = 'none';
        document.querySelector('.pincontainer').style.display = 'none';
        document.getElementById('LoginFormID').style.display = 'none';
        

        localStorage.setItem('loginStatus', false);
        localStorage.setItem('verificationCode', '');
        localStorage.setItem('tempUserEmail', '');
        localStorage.setItem('userEmail', '');

        document.getElementById('loginStatusLabel').textContent = 'Not logged in';
        
        
    }
  }
  
  
  function generateAndSendCode(email) {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem('verificationCode', code);
    localStorage.setItem('tempUserEmail', email);
  
    sendEmail(email, code);
  }
  
  function sendEmail(email, code) {

    emailjs.send('service_82gn40c', 'template_iokrqmk', {
      to_email: email,
      reply_to: 'request2shine@gmail.com',
      verification_code: code
    })
    .then((response) => {
      document.getElementById('verification-message').textContent = 'A PIN has sent to you, \n please check your gmail.';
      document.querySelector('.pincontainer').style.display = 'flex';
      document.getElementById('verification-message').style.display = 'block';
    }, (error) => {
      console.error('Failed to send email', error);
      document.getElementById('verification-message').textContent = 'Failed to send email';
      document.getElementById('verification-message').style.display = 'block';
    });
  
  }
  
  
  function verifyCode() {
    let inputCode = '';
    const pincodearray = document.getElementsByClassName('loginFormInputPIN');

    // Convert HTMLCollection to an array using the spread operator
    [...pincodearray].forEach(pinInput => {
        inputCode += pinInput.value;
    });

    const storedCode = localStorage.getItem('verificationCode');
    if (inputCode === storedCode) {
      const email = localStorage.getItem('tempUserEmail');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('loginStatus', true);
      document.getElementById('verification-message').textContent = 'Verification successful!';
      updateSigninStatus(true);
      document.getElementById('LoginFormID').style.display = 'none';
    } else {
      document.getElementById('verification-message').textContent = 'Incorrect code. Please try again.';
    }
  }
  
  
  function handleClientLoad() {
    
    const inputs = document.querySelectorAll('.loginFormInputPIN');

    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (input.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            if (paste.length === 4) {
                inputs.forEach((input, index) => {
                    input.value = paste[index];
                });
                inputs[inputs.length - 1].focus();
            }
            e.preventDefault();
        });

        input.addEventListener('keydown', (e) => {
            
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });

    emailjs.init("ZdZOsOOaG3vBGigqs"); // Replace 'YOUR_USER_ID' with your EmailJS user ID
    if(localStorage.getItem('loginStatus') === 'true') {
        updateSigninStatus(true);
    } else {
       updateSigninStatus(false);
    }
    
  }
  
  document.addEventListener('DOMContentLoaded', handleClientLoad);
  

export { MenubarLogin };