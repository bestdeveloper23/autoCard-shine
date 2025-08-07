import { UIPanel, UIText, UIButton, UIInput } from '/js/libs/ui.js';
import { createIcon } from './Home.Utils.js';
import googleIconImg from '../../images/google-icon.svg';
import productPreviewImg from '../../images/shine-preview.png';
import {
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

function HomeHero() {
    const container = new UIPanel();
    container.setClass('home-hero');

    // Initialize Google provider for hero section
    const googleProvider = new GoogleAuthProvider();

    // Left section - Content
    const contentSection = new UIPanel();
    contentSection.setClass('hero-content fade-in');

    const tagline = new UIText('Craft your experiment');
    tagline.setClass('hero-tagline');

    const typingContainer = new UIPanel();
    typingContainer.setClass('typing-container');

    const beforeText = new UIText('before you');
    beforeText.setClass('typing-before');

    const typingText = new UIText('');
    typingText.setClass('typing-text');
    typingText.dom.setAttribute('data-words', JSON.stringify([
        'design.',
        'prototype.',
        'simulate.',
        'collaborate.',
        'build it.'
    ]));

    typingContainer.add(beforeText);
    typingContainer.add(typingText);

    const description = new UIText('A collaborative online Geant4 simulator that brings particle physics to your browser.');
    description.setClass('hero-description');

    // Auth container with glass effect
    const authContainer = new UIPanel();
    authContainer.setClass('hero-auth-container');

    const emailWrapper = new UIPanel();
    emailWrapper.setClass('email-wrapper');

    const emailInput = new UIInput();
    emailInput.setClass('hero-email-input');
    emailInput.dom.type = 'email';
    emailInput.dom.placeholder = 'Enter your email';
    emailInput.dom.setAttribute('aria-label', 'Email address');
    emailInput.setValue('');

    // Email validation function
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    emailInput.dom.addEventListener('input', (e) => {
        const value = e.target.value.trim();
        const isValid = value && validateEmail(value);
        startBtn.dom.disabled = !isValid;

        // Visual feedback for email validation
        if (value && !isValid) {
            emailInput.dom.style.borderColor = '#ef4444';
        } else {
            emailInput.dom.style.borderColor = '';
        }
    });

    const startBtn = new UIButton('Get Started');
    startBtn.setClass('hero-start-btn');
    startBtn.dom.disabled = true;
    startBtn.onClick(() => {
        const email = emailInput.getValue().trim();

        // Check if user is already logged in
        const currentUser = window.router?.getCurrentUser();
        if (currentUser) {
            // User is logged in, go to dashboard
            window.router.navigate('/dashboard');
            return;
        }

        // Validate email before proceeding
        if (!email || !validateEmail(email)) {
            showEmailError('Please enter a valid email address');
            return;
        }

        // Store email in sessionStorage for the auth page
        sessionStorage.setItem('heroEmail', email);

        // Navigate to auth page without parameters
        window.router.navigate('/auth');
    });

    // Error message container for email validation
    const emailErrorContainer = new UIPanel();
    emailErrorContainer.setClass('hero-email-error');
    emailErrorContainer.dom.style.display = 'none';

    const showEmailError = (message) => {
        emailErrorContainer.clear();
        const errorMsg = new UIText(message);
        errorMsg.setClass('error-text');
        emailErrorContainer.add(errorMsg);
        emailErrorContainer.dom.style.display = 'block';

        // Hide error after 3 seconds
        setTimeout(() => {
            emailErrorContainer.dom.style.display = 'none';
        }, 3000);
    };

    emailWrapper.add(emailInput);
    emailWrapper.add(emailErrorContainer);
    emailWrapper.add(startBtn);

    const orDivider = new UIPanel();
    orDivider.setClass('auth-divider');
    const dividerText = new UIText('or continue with');
    dividerText.setClass('divider-Text');
    orDivider.add(dividerText);

    const googleBtn = new UIButton();
    googleBtn.setClass('google-signin-btn');

    const googleIcon = document.createElement('img');
    googleIcon.src = googleIconImg;
    googleIcon.alt = 'Google';
    googleIcon.className = 'google-icon';

    const googleText = document.createElement('span');
    googleText.textContent = 'Sign in with Google';

    googleBtn.dom.appendChild(googleIcon);
    googleBtn.dom.appendChild(googleText);

    // Google authentication handler
    googleBtn.onClick(async () => {
        // Check if user is already logged in
        const currentUser = window.router?.getCurrentUser();
        if (currentUser) {
            window.router.navigate('/dashboard');
            return;
        }

        // Show loading state
        const originalText = googleText.textContent;
        googleText.textContent = 'Signing in...';
        googleBtn.dom.disabled = true;

        try {
            if (!window.firebaseAuth) {
                throw new Error('Firebase not initialized');
            }

            await signInWithPopup(window.firebaseAuth, googleProvider);

            // Success - user will be redirected by auth state listener
            // The auth.js updateAuthState method will handle localStorage updates
            window.router.navigate('/dashboard');

        } catch (error) {
            console.error('Google sign-in error:', error);

            // Handle specific errors
            let errorMessage = 'Sign-in failed. Please try again.';

            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage = 'Sign-in was cancelled.';
                    break;
                case 'auth/popup-blocked':
                    errorMessage = 'Popup was blocked. Please allow popups for this site.';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection.';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many attempts. Please try again later.';
                    break;
            }

            showEmailError(errorMessage);

        } finally {
            // Reset button state
            googleText.textContent = originalText;
            googleBtn.dom.disabled = false;
        }
    });

    authContainer.add(emailWrapper);
    authContainer.add(orDivider);
    authContainer.add(googleBtn);

    // Add content to left section
    contentSection.add(tagline);
    contentSection.add(typingContainer);
    contentSection.add(description);
    contentSection.add(authContainer);

    // Right section - Product Preview
    const previewSection = new UIPanel();
    previewSection.setClass('hero-preview-section fade-in');

    const previewWrapper = new UIPanel();
    previewWrapper.setClass('preview-wrapper');

    const productPreview = document.createElement('img');
    productPreview.src = productPreviewImg;
    productPreview.alt = 'Shine Interface Preview';
    productPreview.className = 'product-preview';

    previewWrapper.dom.appendChild(productPreview);
    previewSection.add(previewWrapper);

    // Add sections to container
    container.add(contentSection);
    container.add(previewSection);

    // Typing animation logic 
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const words = JSON.parse(typingText.dom.getAttribute('data-words'));
        const currentWord = words[currentWordIndex];

        if (isDeleting) {
            typingText.dom.textContent = currentWord.substring(0, currentCharIndex - 1);
            currentCharIndex--;
            typingSpeed = 50;
        } else {
            typingText.dom.textContent = currentWord.substring(0, currentCharIndex + 1);
            currentCharIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && currentCharIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentWordIndex = (currentWordIndex + 1) % words.length;
            typingSpeed = 500;
        }

        container.typingTimeout = setTimeout(typeText, typingSpeed);
    }

    // Public methods
    container.startTypingAnimation = function () {
        typeText();
    };

    container.destroy = function () {
        if (container.typingTimeout) {
            clearTimeout(container.typingTimeout);
        }
    };

    return container;
}

export { HomeHero };