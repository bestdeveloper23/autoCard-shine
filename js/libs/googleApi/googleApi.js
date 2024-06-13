// googleApi.js
export let GoogleAuth;


const googleClientId = '908824484688-15acjgvnmg8th61o106blq1328qja3f7.apps.googleusercontent.com';
const googleApiKey = 'AIzaSyCL0Drj6JUZ5li-flemULQgFarda-rLCjY';
export function initClient() {
  gapi.client.init({
    'apiKey': googleApiKey,
    'clientId': googleClientId,
    'scope': 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.email',
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4']
  }).then(function () {
    GoogleAuth = gapi.auth2.getAuthInstance();
    console.log(GoogleAuth)
    GoogleAuth.isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(GoogleAuth.isSignedIn.get());
    console.log(GoogleAuth.isSignedIn.get(), "Google Auth");
  });
}

export function handleAuthClick() {
  GoogleAuth.signIn();
}

export function handleSignoutClick() {
  GoogleAuth.signOut();
}

export function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById('login-button').style.display = 'none';
    document.getElementById('logout-button').style.display = 'block';
    checkUserEmail();
  } else {
    document.getElementById('login-button').style.display = 'block';
    document.getElementById('logout-button').style.display = 'none';
  }
}

export function checkUserEmail() {
    console.log("I am called2")
  const user = GoogleAuth.currentUser.get();
  const profile = user.getBasicProfile();
  const email = profile.getEmail();

//   const spreadsheetId = 'YOUR_SPREADSHEET_ID';

  const range = 'Sheet1!A:A';

  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  }).then(function(response) {
    const values = response.result.values;
    if (values && values.length > 0) {
      const emails = values.map(row => row.email);
      if (emails.includes(email)) {
        localStorage.setItem('userEmail', email);
        document.getElementById('welcome-message').innerText = `Welcome back, ${profile.getName()}!`;
      } else {
        generateAndSendCode(email);
      }
    } else {
        document.getElementById('welcome-message').innerText = 'Error: This Gmail user is not registered.\nPlease register first.';
    }
  }, function(response) {
    document.getElementById('welcome-message').innerText = 'Error: ' + response.result.error.message;
  });
}

export function generateAndSendCode(email) {
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  localStorage.setItem('verificationCode', code);
  localStorage.setItem('tempUserEmail', email);

  sendEmail(email, code);
}

function sendEmail(email, code) {
  console.log('Sending email')
  emailjs.send('service_82gn40c', 'template_iokrqmk', {
    to_email: email,
    reply_to: 'request2shine@gmail.com',
    verification_code: code
  })
  .then((response) => {
    console.log('Email sent successfully', response.status, response);
  }, (error) => {
    console.error('Failed to send email', error);
  });

}



export function verifyCode() {
  const inputCode = document.getElementById('verification-code').value;
  const storedCode = localStorage.getItem('verificationCode');
  if (inputCode === storedCode) {
    const email = localStorage.getItem('tempUserEmail');
    localStorage.setItem('userEmail', email);
    addToSheet(email);
    document.getElementById('verification-message').innerText = 'Verification successful!';
  } else {
    document.getElementById('verification-message').innerText = 'Incorrect code. Please try again.';
  }
}

function addToSheet(email) {
  const spreadsheetId = 'YOUR_SPREADSHEET_ID';
  const range = 'Sheet1!A:A';
  const valueInputOption = 'RAW';
  const values = [
    [email]
  ];

  const body = {
    values: values
  };

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: spreadsheetId,
    range: range,
    valueInputOption: valueInputOption,
    resource: body
  }).then((response) => {
    const result = response.result;
    console.log(`${result.updates.updatedCells} cells appended.`);
  });
}

function handleClientLoad() {
  emailjs.init("ZdZOsOOaG3vBGigqs"); // Replace 'YOUR_USER_ID' with your EmailJS user ID
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
