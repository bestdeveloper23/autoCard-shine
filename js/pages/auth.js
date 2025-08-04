import { UIButton, UIInput, UIPanel, UIRow, UISelect, UIText, UITextArea, UINumber, UIDiv } from '/js/libs/ui.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import logoDark from '../../images/favicon_dark.ico';
import logoLight from '../../images/favicon_white.ico';

export class AuthPage {
  constructor(editor = null) {
    this.container = null;
    this.isLoginMode = true;
    this.googleProvider = new GoogleAuthProvider();
    this.editor = editor;
    this.prefilledEmail = null;

    this.extractEmailFromSession();



    // Set up auth state listener to maintain localStorage compatibility
    if (window.firebaseAuth) {
      onAuthStateChanged(window.firebaseAuth, (user) => {
        this.updateAuthState(user);
      });

      // Check initial auth state
      const currentUser = window.firebaseAuth.currentUser;
      if (currentUser) {
        this.updateAuthState(currentUser);
      }
    }
  }

  extractEmailFromSession() {
    const email = sessionStorage.getItem('heroEmail');

    if (email && this.validateEmail(email)) {
      this.prefilledEmail = email;

      // Clear the sessionStorage item after reading it
      sessionStorage.removeItem('heroEmail');
    }
  }

  //email validation method
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // This method maintains compatibility with existing localStorage checks
  updateAuthState(user) {
    if (user) {
      // User is signed in - update localStorage for compatibility
      localStorage.setItem('loginStatus', 'true');
      localStorage.setItem('userEmail', user.email);

      // Update UI elements if they exist
      this.updateLoginUI(true, user.email);

      // Dispatch editor signals if available
      if (this.editor && this.editor.signals && this.editor.signals.userLoggedIn) {
        this.editor.signals.userLoggedIn.dispatch(user.email);
      }
    } else {
      // User is signed out - clear localStorage
      localStorage.setItem('loginStatus', 'false');
      localStorage.removeItem('userEmail');

      // Update UI elements if they exist
      this.updateLoginUI(false);

      // Dispatch editor signals if available
      if (this.editor && this.editor.signals && this.editor.signals.userLoggedOut) {
        this.editor.signals.userLoggedOut.dispatch();
      }
    }

    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('authStateChanged'));
  }

  updateLoginUI(isLoggedIn, email = '') {
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');
    const loginStatusLabel = document.getElementById('loginStatusLabel');

    // Only update UI elements if they exist (for pages with menubar)
    if (loginButton && logoutButton && loginStatusLabel) {
      if (isLoggedIn) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        loginStatusLabel.textContent = email;
      } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        loginStatusLabel.textContent = 'Not logged in';
      }
    }
  }

  // Static method to check login status (for use in your existing button checks)
  static isUserLoggedIn() {
    const loginStatus = localStorage.getItem('loginStatus');
    return loginStatus === 'true';
  }

  // Static method to get current user email
  static getCurrentUserEmail() {
    return localStorage.getItem('userEmail') || '';
  }

  // Method to handle logout
  async handleLogout() {
    try {
      await window.firebaseAuth.signOut();
      // Auth state listener will handle localStorage cleanup
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async render() {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
      // If no app container, create one temporarily for demo pages
      const tempContainer = document.createElement('div');
      tempContainer.id = 'temp-auth-container';
      tempContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
      `;
      document.body.appendChild(tempContainer);

      this.container = new UIPanel();
      this.container.setClass('auth-container');
      tempContainer.appendChild(this.container.dom);
    } else {
      appContainer.innerHTML = '';
      this.container = new UIPanel();
      this.container.setClass('auth-container');
      appContainer.appendChild(this.container.dom);
    }

    const authCard = new UIPanel();
    authCard.setClass('auth-card');

    // Header
    const header = this.createHeader();

    // Form
    const form = this.createForm();

    // Footer
    const footer = this.createFooter();

    authCard.add(header);
    authCard.add(form);
    authCard.add(footer);

    this.container.add(authCard);
  }

  createHeader() {
    const header = new UIPanel();
    header.setClass('auth-header');

    // Logo container
    const logoContainer = new UIPanel();
    logoContainer.setClass('logo-container');

    const logoImg = document.createElement('img');
    logoImg.alt = 'Shine Logo';
    logoImg.className = 'auth-logo-img';

    // Set up responsive logo for dark/light mode
    const updateLogo = () => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        logoImg.src = logoLight;
      } else {
        logoImg.src = logoDark;
      }
    };

    // Listen for theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogo);
    }

    updateLogo(); // Set initial logo

    const logoText = new UIText('Shine');
    logoText.setClass('auth-logo-text');

    logoContainer.dom.appendChild(logoImg);
    logoContainer.add(logoText);

    const title = new UIText(
      this.isLoginMode
        ? 'Log in to Shine'
        : 'Create an Account'
    );
    title.setClass('auth-title');

    header.add(logoContainer);
    header.add(title);

    return header;
  }

  createForm() {
    const form = new UIPanel();
    form.setClass('auth-form');

    // Error message container
    const errorContainer = new UIPanel();
    errorContainer.setClass('error-container');
    this.errorContainer = errorContainer;

    // Close button for demo pages
    const closeBtn = new UIButton('×');
    closeBtn.setClass('auth-close-btn');
    closeBtn.onClick(() => this.hideAuthForm());

    // Email input
    const emailGroup = new UIPanel();
    emailGroup.setClass('input-group');

    const emailLabel = new UIText('Email');
    emailLabel.setClass('input-label');

    const emailInput = new UIInput('');
    emailInput.setClass('auth-input');
    emailInput.dom.type = 'email';
    emailInput.dom.placeholder = 'Enter your email';
    this.emailInput = emailInput;

    // Pre-fill email if available
    if (this.prefilledEmail) {
      emailInput.setValue(this.prefilledEmail);


      emailInput.dom.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
      emailInput.dom.style.borderColor = '#22c55e';

      // Shows a subtle message
      const prefilledMessage = new UIText('Email pre-filled from previous step ✓');
      prefilledMessage.setClass('prefilled-message');
      emailGroup.add(prefilledMessage);

      // Remove styling after user interacts
      emailInput.dom.addEventListener('input', () => {
        emailInput.dom.style.backgroundColor = '';
        emailInput.dom.style.borderColor = '';
        const message = emailGroup.dom.querySelector('.prefilled-message');
        if (message) message.remove();
      }, { once: true });
    }


    emailGroup.add(emailLabel);
    emailGroup.add(emailInput);

    // Username input (only for signup)
    let usernameInput;
    const usernameGroup = new UIPanel();
    usernameGroup.setClass('input-group');

    if (!this.isLoginMode) {
      const usernameLabel = new UIText('Username');
      usernameLabel.setClass('input-label');

      usernameInput = new UIInput('');
      usernameInput.setClass('auth-input');
      usernameInput.dom.type = 'text';
      usernameInput.dom.placeholder = 'Enter your username';

      usernameGroup.add(usernameLabel);
      usernameGroup.add(usernameInput);
    }

    // Password input
    const passwordGroup = new UIPanel();
    passwordGroup.setClass('input-group');

    const passwordLabel = new UIText('Password');
    passwordLabel.setClass('input-label');

    const passwordInput = new UIInput('');
    passwordInput.setClass('auth-input');
    passwordInput.dom.type = 'password';
    passwordInput.dom.placeholder = 'Enter your password';

    passwordGroup.add(passwordLabel);
    passwordGroup.add(passwordInput);

    // Password validation indicators (only for signup)
    let validationContainer;
    if (!this.isLoginMode) {
      validationContainer = new UIPanel();
      validationContainer.setClass('password-validation');
      validationContainer.setId('password-validation-container');

      // Initially hide the validation container
      validationContainer.dom.style.display = 'none';

      const minLengthIndicator = new UIPanel();
      minLengthIndicator.setClass('validation-item validation-invalid');
      minLengthIndicator.setId('min-length-indicator');
      const minLengthText = new UIText('✓ At least 8 characters');
      minLengthIndicator.add(minLengthText);

      const uppercaseIndicator = new UIPanel();
      uppercaseIndicator.setClass('validation-item validation-invalid');
      uppercaseIndicator.setId('uppercase-indicator');
      const uppercaseText = new UIText('✓ At least 1 uppercase letter');
      uppercaseIndicator.add(uppercaseText);

      const lowercaseIndicator = new UIPanel();
      lowercaseIndicator.setClass('validation-item validation-invalid');
      lowercaseIndicator.setId('lowercase-indicator');
      const lowercaseText = new UIText('✓ At least 1 lowercase letter');
      lowercaseIndicator.add(lowercaseText);

      const numberIndicator = new UIPanel();
      numberIndicator.setClass('validation-item validation-invalid');
      numberIndicator.setId('number-indicator');
      const numberText = new UIText('✓ At least 1 number');
      numberIndicator.add(numberText);

      const specialIndicator = new UIPanel();
      specialIndicator.setClass('validation-item validation-invalid');
      specialIndicator.setId('special-indicator');
      const specialText = new UIText('✓ At least 1 special character');
      specialIndicator.add(specialText);

      validationContainer.add(minLengthIndicator);
      validationContainer.add(uppercaseIndicator);
      validationContainer.add(lowercaseIndicator);
      validationContainer.add(numberIndicator);
      validationContainer.add(specialIndicator);

      passwordGroup.add(validationContainer);

      // Add real-time validation and show/hide logic
      passwordInput.dom.addEventListener('input', (e) => {
        const password = e.target.value;
        this.showValidationContainer(password.length > 0);
        this.updatePasswordValidation(password);
      });

      // Show validation on focus if there's already text
      passwordInput.dom.addEventListener('focus', (e) => {
        const password = e.target.value;
        if (password.length > 0) {
          this.showValidationContainer(true);
        }
      });

      // Hide validation on blur if field is empty
      passwordInput.dom.addEventListener('blur', (e) => {
        const password = e.target.value;
        if (password.length === 0) {
          this.showValidationContainer(false);
        }
      });
    }

    // Confirm password (only for signup)
    const confirmPasswordGroup = new UIPanel();
    confirmPasswordGroup.setClass('input-group');

    let confirmPasswordInput;
    if (!this.isLoginMode) {
      const confirmPasswordLabel = new UIText('Confirm Password');
      confirmPasswordLabel.setClass('input-label');

      confirmPasswordInput = new UIInput('');
      confirmPasswordInput.setClass('auth-input');
      confirmPasswordInput.dom.type = 'password';
      confirmPasswordInput.dom.placeholder = 'Confirm your password';

      confirmPasswordGroup.add(confirmPasswordLabel);
      confirmPasswordGroup.add(confirmPasswordInput);

      // Add confirm password validation
      const confirmValidationContainer = new UIPanel();
      confirmValidationContainer.setClass('password-validation');
      confirmValidationContainer.setId('confirm-validation-container');
      confirmValidationContainer.dom.style.display = 'none';

      const passwordMatchIndicator = new UIPanel();
      passwordMatchIndicator.setClass('validation-item validation-invalid');
      passwordMatchIndicator.setId('password-match-indicator');
      const passwordMatchText = new UIText('✓ Passwords match');
      passwordMatchIndicator.add(passwordMatchText);

      confirmValidationContainer.add(passwordMatchIndicator);
      confirmPasswordGroup.add(confirmValidationContainer);

      // Add real-time confirm password validation
      const validatePasswordMatch = () => {
        const password = passwordInput.getValue();
        const confirmPassword = confirmPasswordInput.getValue();

        if (confirmPassword.length > 0) {
          this.showConfirmValidationContainer(true);
          this.updatePasswordMatchValidation(password, confirmPassword);
        } else {
          this.showConfirmValidationContainer(false);
        }
      };

      confirmPasswordInput.dom.addEventListener('input', validatePasswordMatch);
      passwordInput.dom.addEventListener('input', () => {
        const password = passwordInput.getValue();
        this.showValidationContainer(password.length > 0);
        this.updatePasswordValidation(password);

        // Also check confirm password match if it has content
        if (confirmPasswordInput.getValue().length > 0) {
          validatePasswordMatch();
        }
      });

      confirmPasswordInput.dom.addEventListener('focus', (e) => {
        const confirmPassword = e.target.value;
        if (confirmPassword.length > 0) {
          this.showConfirmValidationContainer(true);
        }
      });

      confirmPasswordInput.dom.addEventListener('blur', (e) => {
        const confirmPassword = e.target.value;
        if (confirmPassword.length === 0) {
          this.showConfirmValidationContainer(false);
        }
      });
    }

    // Forgot password link (only for login)
    const forgotPassword = new UIButton('Forgot Password?');
    forgotPassword.setClass('forgot-password-link');
    forgotPassword.onClick(() => this.handleForgotPassword(emailInput.getValue()));

    // Submit button
    const submitBtn = new UIButton(this.isLoginMode ? 'Sign In' : 'Create Account');
    submitBtn.setClass('auth-submit-btn');
    submitBtn.onClick(() => {
      this.handleEmailAuth(
        emailInput.getValue(),
        passwordInput.getValue(),
        !this.isLoginMode ? confirmPasswordInput?.getValue() : null,
        !this.isLoginMode ? usernameInput?.getValue() : null
      );
    });

    // Divider
    const divider = new UIPanel();
    divider.setClass('auth-divider');
    const dividerText = new UIText('or');
    dividerText.setClass('divider-text');
    divider.add(dividerText);

    // Google sign in button
    const googleBtn = new UIButton('Continue with Google');
    googleBtn.setClass('google-auth-btn');
    googleBtn.onClick(() => this.handleGoogleAuth());

    // Add components to form
    form.add(closeBtn);
    form.add(errorContainer);
    form.add(emailGroup);

    if (!this.isLoginMode) {
      form.add(usernameGroup);
    }

    form.add(passwordGroup);

    if (!this.isLoginMode) {
      form.add(confirmPasswordGroup);
    }

    if (this.isLoginMode) {
      form.add(forgotPassword);
    }

    form.add(submitBtn);
    form.add(divider);
    form.add(googleBtn);

    return form;
  }

  createFooter() {
    const footer = new UIPanel();
    footer.setClass('auth-footer');

    const switchText = new UIText(
      this.isLoginMode
        ? "Don't have an account? "
        : "Already have an account? "
    );
    switchText.setClass('switch-text');

    const switchLink = new UIButton(this.isLoginMode ? 'Sign Up' : 'Sign In');
    switchLink.setClass('switch-link');
    switchLink.onClick(() => this.toggleMode());

    footer.add(switchText);
    footer.add(switchLink);

    return footer;
  }

  async handleEmailAuth(email, password, confirmPassword, username) {
    this.clearError();

    if (!email || !password) {
      this.showError('Please fill in all fields');
      return;
    }

    if (!this.isLoginMode) {
      if (!username) {
        this.showError('Please enter a username');
        return;
      }

      if (!this.validatePassword(password)) {
        this.showError('Password must contain at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character');
        return;
      }

      if (password !== confirmPassword) {
        this.showError('Passwords do not match');
        return;
      }
    }

    try {
      if (this.isLoginMode) {
        await signInWithEmailAndPassword(window.firebaseAuth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(window.firebaseAuth, email, password);

        // Store username in user profile
        if (username) {
          const { updateProfile } = await import("https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js");
          await updateProfile(userCredential.user, {
            displayName: username
          });
        }
      }

      // Hide the auth form after successful login
      this.hideAuthForm();

    } catch (error) {
      this.showError(this.getErrorMessage(error.code));
    }
  }

  showConfirmValidationContainer(show) {
    const container = document.getElementById('confirm-validation-container');
    if (container) {
      container.style.display = show ? 'block' : 'none';
    }
  }

  updatePasswordMatchValidation(password, confirmPassword) {
    const isMatch = password === confirmPassword && password.length > 0;
    this.updateIndicator('password-match-indicator', isMatch);
  }

  showValidationContainer(show) {
    const container = document.getElementById('password-validation-container');
    if (container) {
      container.style.display = show ? 'block' : 'none';
    }
  }

  updatePasswordValidation(password) {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    // Update indicators
    this.updateIndicator('min-length-indicator', minLength);
    this.updateIndicator('uppercase-indicator', hasUppercase);
    this.updateIndicator('lowercase-indicator', hasLowercase);
    this.updateIndicator('number-indicator', hasNumber);
    this.updateIndicator('special-indicator', hasSpecialChar);
  }

  updateIndicator(elementId, isValid) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('validation-valid', 'validation-invalid');
      element.classList.add(isValid ? 'validation-valid' : 'validation-invalid');
    }
  }

  validatePassword(password) {
    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    return minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  }

  async handleGoogleAuth() {
    this.clearError();

    try {
      await signInWithPopup(window.firebaseAuth, this.googleProvider);

      // Hide the auth form after successful login
      this.hideAuthForm();

    } catch (error) {
      this.showError(this.getErrorMessage(error.code));
    }
  }

  hideAuthForm() {
    // Remove the auth form
    const appContainer = document.getElementById('app');
    const tempContainer = document.getElementById('temp-auth-container');

    if (appContainer && appContainer.innerHTML) {
      appContainer.innerHTML = '';
    }

    if (tempContainer) {
      tempContainer.remove();
    }
  }

  async handleForgotPassword(email) {
    if (!email) {
      this.showError('Please enter your email address');
      return;
    }

    try {
      await sendPasswordResetEmail(window.firebaseAuth, email);
      this.showSuccess('Password reset email sent!');
    } catch (error) {
      this.showError(this.getErrorMessage(error.code));
    }
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.render();
  }

  showError(message) {
    this.errorContainer.clear();
    const errorMsg = new UIText(message);
    errorMsg.setClass('error-message message-error');
    this.errorContainer.add(errorMsg);
  }

  showSuccess(message) {
    this.errorContainer.clear();
    const successMsg = new UIText(message);
    successMsg.setClass('success-message message-info');
    this.errorContainer.add(successMsg);
  }

  clearError() {
    this.errorContainer.clear();
  }

  getErrorMessage(errorCode) {

    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again';
      case 'auth/invalid-password':
        return 'Invalid password. Please try again';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address format';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection';
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/requires-recent-login':
        return 'Please log out and log back in to perform this action';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled';
      case 'auth/popup-blocked':
        return 'Popup was blocked. Please allow popups for this site';
      case 'auth/cancelled-popup-request':
        return 'Another popup is already open';
      case 'auth/missing-password':
        return 'Please enter your password';
      case 'auth/missing-email':
        return 'Please enter your email address';
      case 'auth/internal-error':
        return 'Internal error occurred. Please try again';
      default:
        return `Authentication failed: ${errorCode}. Please try again`;
    }
  }

  destroy() {
    if (this.container && this.container.dom && this.container.dom.parentNode) {
      this.container.dom.parentNode.removeChild(this.container.dom);
    }
  }
}