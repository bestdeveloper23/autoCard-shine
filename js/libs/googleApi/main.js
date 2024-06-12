// main.js
import { initClient, handleAuthClick, handleSignoutClick, verifyCode } from './googleApi.js';

document.getElementById('login-button').addEventListener('click', handleAuthClick);
document.getElementById('logout-button').addEventListener('click', handleSignoutClick);
document.getElementById('verify-code-button').addEventListener('click', verifyCode);

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
