import { UIPanel, UIText, UIButton, UIInput } from '/js/libs/ui.js';
import {
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    sendEmailVerification,
    deleteUser,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";
import {
    doc,
    updateDoc,
    deleteDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

export class SettingsPage {
    constructor() {
        this.container = null;
        this.currentUser = null;
        this.profileImageFile = null;
        this.isUploading = false;
        this.hasUnsavedChanges = false;

        // Get current user
        this.currentUser = window.firebaseAuth?.currentUser;

        // Bind methods - only bind methods that actually exist
        this.handleProfileImageChange = this.handleProfileImageChange.bind(this);
        this.handleSaveChanges = this.handleSaveChanges.bind(this);
        this.handleForgotPassword = this.handleForgotPassword.bind(this);
    }

    async render() {
        const appContainer = document.getElementById('app');
        if (!appContainer) return;

        appContainer.innerHTML = '';

        this.container = new UIPanel();
        this.container.setClass('settings-container');

        // Header
        const header = this.createHeader();

        // Main content
        const content = this.createContent();

        this.container.add(header);
        this.container.add(content);

        appContainer.appendChild(this.container.dom);

        // Add event listeners
        this.setupEventListeners();
    }

    createHeader() {
        const header = new UIPanel();
        header.setClass('settings-header');

        const headerContent = new UIPanel();
        headerContent.setClass('settings-header-content');

        // Back button and title
        const leftSection = new UIPanel();
        leftSection.setClass('settings-header-left');

        const backBtn = new UIButton('← Back to Dashboard');
        backBtn.setClass('back-button');
        backBtn.onClick(() => {
            if (this.hasUnsavedChanges) {
                if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
                    window.router.navigate('/shine/dashboard');
                }
            } else {
                window.router.navigate('/shine/dashboard');
            }
        });

        const title = new UIText('Account Settings');
        title.setClass('settings-title');

        leftSection.add(backBtn);
        leftSection.add(title);

        // Save button
        const rightSection = new UIPanel();
        rightSection.setClass('settings-header-right');

        const saveBtn = new UIButton('Save Changes');
        saveBtn.setClass('save-button');
        saveBtn.setId('save-changes-btn');
        saveBtn.onClick(this.handleSaveChanges);
        saveBtn.dom.disabled = true;

        rightSection.add(saveBtn);

        headerContent.add(leftSection);
        headerContent.add(rightSection);
        header.add(headerContent);

        return header;
    }

    createContent() {
        const content = new UIPanel();
        content.setClass('settings-content');

        const contentWrapper = new UIPanel();
        contentWrapper.setClass('settings-content-wrapper');

        // Profile section
        const profileSection = this.createProfileSection();

        // Account section
        const accountSection = this.createAccountSection();

        // Security section
        const securitySection = this.createSecuritySection();

        // Danger zone
        const dangerSection = this.createDangerSection();

        contentWrapper.add(profileSection);
        contentWrapper.add(accountSection);
        contentWrapper.add(securitySection);
        contentWrapper.add(dangerSection);

        content.add(contentWrapper);

        return content;
    }

    createProfileSection() {
        const section = new UIPanel();
        section.setClass('settings-section');

        const sectionHeader = new UIText('Profile Information');
        sectionHeader.setClass('section-header');

        const sectionContent = new UIPanel();
        sectionContent.setClass('section-content');

        // Profile image upload
        const imageGroup = new UIPanel();
        imageGroup.setClass('profile-image-group');

        const imageContainer = new UIPanel();
        imageContainer.setClass('profile-image-container');

        const profileImage = document.createElement('img');
        profileImage.className = 'profile-image';
        profileImage.src = this.currentUser?.photoURL || this.getDefaultAvatar();
        profileImage.alt = 'Profile Picture';

        const imageOverlay = new UIPanel();
        imageOverlay.setClass('image-overlay');

        const cameraIcon = new UIText('📷');
        cameraIcon.setClass('camera-icon');

        const changeText = new UIText('Change Photo');
        changeText.setClass('change-text');

        imageOverlay.add(cameraIcon);
        imageOverlay.add(changeText);

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', this.handleProfileImageChange);

        imageContainer.dom.appendChild(profileImage);
        imageContainer.add(imageOverlay);
        imageContainer.dom.appendChild(fileInput);

        // Click to upload
        imageContainer.dom.addEventListener('click', () => {
            if (!this.isUploading) {
                fileInput.click();
            }
        });

        const imageInfo = new UIPanel();
        imageInfo.setClass('image-info');

        const imageTitle = new UIText('Profile Picture');
        imageTitle.setClass('image-title');

        const imageDesc = new UIText('Click to upload a new profile picture. Max size: 5MB. Supported formats: JPG, PNG, GIF');
        imageDesc.setClass('image-description');

        imageInfo.add(imageTitle);
        imageInfo.add(imageDesc);

        imageGroup.add(imageContainer);
        imageGroup.add(imageInfo);

        // Display name
        const nameGroup = new UIPanel();
        nameGroup.setClass('input-group');

        const nameLabel = new UIText('Display Name');
        nameLabel.setClass('input-label');

        const nameInput = new UIInput(this.currentUser?.displayName || '');
        nameInput.setClass('settings-input');
        nameInput.setId('display-name-input');
        nameInput.dom.placeholder = 'Enter your display name';

        nameGroup.add(nameLabel);
        nameGroup.add(nameInput);

        sectionContent.add(imageGroup);
        sectionContent.add(nameGroup);

        section.add(sectionHeader);
        section.add(sectionContent);

        return section;
    }

    createAccountSection() {
        const section = new UIPanel();
        section.setClass('settings-section');

        const sectionHeader = new UIText('Account Information');
        sectionHeader.setClass('section-header');

        const sectionContent = new UIPanel();
        sectionContent.setClass('section-content');

        // Email
        const emailGroup = new UIPanel();
        emailGroup.setClass('input-group');

        const emailLabel = new UIText('Email Address');
        emailLabel.setClass('input-label');

        const emailContainer = new UIPanel();
        emailContainer.setClass('email-container');

        const emailInput = new UIInput(this.currentUser?.email || '');
        emailInput.setClass('settings-input');
        emailInput.setId('email-input');
        emailInput.dom.type = 'email';

        const emailStatus = new UIPanel();
        emailStatus.setClass('email-status');

        if (this.currentUser?.emailVerified) {
            const verifiedBadge = new UIPanel();
            verifiedBadge.setClass('status-badge verified');

            const verifiedIcon = new UIText('✅');
            verifiedIcon.setClass('status-icon');

            const verifiedText = new UIText('Verified');
            verifiedText.setClass('status-text');

            verifiedBadge.add(verifiedIcon);
            verifiedBadge.add(verifiedText);
            emailStatus.add(verifiedBadge);
        } else {
            const unverifiedBadge = new UIPanel();
            unverifiedBadge.setClass('status-badge unverified');

            const unverifiedIcon = new UIText('⚠️');
            unverifiedIcon.setClass('status-icon');

            const unverifiedText = new UIText('Unverified');
            unverifiedText.setClass('status-text');

            unverifiedBadge.add(unverifiedIcon);
            unverifiedBadge.add(unverifiedText);

            const verifyBtn = new UIButton('Send Verification');
            verifyBtn.setClass('verify-button');
            verifyBtn.onClick(() => this.sendEmailVerification());

            emailStatus.add(unverifiedBadge);
            emailStatus.add(verifyBtn);
        }

        emailContainer.add(emailInput);
        emailContainer.add(emailStatus);

        emailGroup.add(emailLabel);
        emailGroup.add(emailContainer);

        // Account creation date
        const createdGroup = new UIPanel();
        createdGroup.setClass('info-group');

        const createdLabel = new UIText('Member Since');
        createdLabel.setClass('info-label');

        const createdDate = new UIText(
            this.currentUser?.metadata?.creationTime
                ? new Date(this.currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
                : 'Unknown'
        );
        createdDate.setClass('info-value');

        createdGroup.add(createdLabel);
        createdGroup.add(createdDate);

        // Last sign in
        const lastSignInGroup = new UIPanel();
        lastSignInGroup.setClass('info-group');

        const lastSignInLabel = new UIText('Last Sign In');
        lastSignInLabel.setClass('info-label');

        const lastSignInDate = new UIText(
            this.currentUser?.metadata?.lastSignInTime
                ? new Date(this.currentUser.metadata.lastSignInTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
                : 'Unknown'
        );
        lastSignInDate.setClass('info-value');

        lastSignInGroup.add(lastSignInLabel);
        lastSignInGroup.add(lastSignInDate);

        sectionContent.add(emailGroup);
        sectionContent.add(createdGroup);
        sectionContent.add(lastSignInGroup);

        section.add(sectionHeader);
        section.add(sectionContent);

        return section;
    }


    createSecuritySection() {
        const section = new UIPanel();
        section.setClass('settings-section');

        const sectionHeader = new UIText('Security & Password');
        sectionHeader.setClass('section-header');

        const sectionContent = new UIPanel();
        sectionContent.setClass('section-content');

        // Password change form
        const passwordSection = new UIPanel();
        passwordSection.setClass('password-change-section');

        const passwordLabel = new UIText('Change Password');
        passwordLabel.setClass('action-label');

        const passwordDesc = new UIText('Enter your current password and choose a new secure password to update your account.');
        passwordDesc.setClass('action-description');

        const passwordForm = new UIPanel();
        passwordForm.setClass('password-form');

        // Current password field
        const currentPasswordGroup = new UIPanel();
        currentPasswordGroup.setClass('input-group');

        const currentPasswordLabel = new UIText('Current Password');
        currentPasswordLabel.setClass('input-label');

        const currentPasswordContainer = new UIPanel();
        currentPasswordContainer.setClass('password-input-container');

        const currentPasswordInput = new UIInput('');
        currentPasswordInput.setClass('settings-input password-input');
        currentPasswordInput.setId('current-password-input');
        currentPasswordInput.dom.type = 'password';
        currentPasswordInput.dom.placeholder = 'Enter your current password';

        const currentPasswordToggle = new UIButton('👁️');
        currentPasswordToggle.setClass('password-toggle');
        currentPasswordToggle.onClick(() => this.togglePasswordVisibility('current-password-input'));

        currentPasswordContainer.add(currentPasswordInput);
        currentPasswordContainer.add(currentPasswordToggle);

        // Error message for current password
        const currentPasswordError = new UIText('');
        currentPasswordError.setClass('password-error-message');
        currentPasswordError.setId('current-password-error');
        currentPasswordError.dom.style.display = 'none';

        currentPasswordGroup.add(currentPasswordLabel);
        currentPasswordGroup.add(currentPasswordContainer);
        currentPasswordGroup.add(currentPasswordError);

        // New password field
        const newPasswordGroup = new UIPanel();
        newPasswordGroup.setClass('input-group');

        const newPasswordLabel = new UIText('New Password');
        newPasswordLabel.setClass('input-label');

        const newPasswordContainer = new UIPanel();
        newPasswordContainer.setClass('password-input-container');

        const newPasswordInput = new UIInput('');
        newPasswordInput.setClass('settings-input password-input');
        newPasswordInput.setId('new-password-input');
        newPasswordInput.dom.type = 'password';
        newPasswordInput.dom.placeholder = 'Enter new password (min. 8 characters)';

        const newPasswordToggle = new UIButton('👁️');
        newPasswordToggle.setClass('password-toggle');
        newPasswordToggle.onClick(() => this.togglePasswordVisibility('new-password-input'));

        newPasswordContainer.add(newPasswordInput);
        newPasswordContainer.add(newPasswordToggle);

        // Error message for new password
        const newPasswordError = new UIText('');
        newPasswordError.setClass('password-error-message');
        newPasswordError.setId('new-password-error');
        newPasswordError.dom.style.display = 'none';

        // Password strength indicator
        const passwordStrength = new UIPanel();
        passwordStrength.setClass('password-strength-indicator');
        passwordStrength.setId('password-strength');
        passwordStrength.dom.style.display = 'none';

        const strengthText = new UIText('Password strength: ');
        const strengthValue = new UIText('');
        strengthValue.setId('strength-value');
        strengthValue.setClass('strength-value');

        passwordStrength.add(strengthText);
        passwordStrength.add(strengthValue);

        newPasswordGroup.add(newPasswordLabel);
        newPasswordGroup.add(newPasswordContainer);
        newPasswordGroup.add(newPasswordError);
        newPasswordGroup.add(passwordStrength);

        // Confirm password field
        const confirmPasswordGroup = new UIPanel();
        confirmPasswordGroup.setClass('input-group');

        const confirmPasswordLabel = new UIText('Confirm New Password');
        confirmPasswordLabel.setClass('input-label');

        const confirmPasswordContainer = new UIPanel();
        confirmPasswordContainer.setClass('password-input-container');

        const confirmPasswordInput = new UIInput('');
        confirmPasswordInput.setClass('settings-input password-input');
        confirmPasswordInput.setId('confirm-password-input');
        confirmPasswordInput.dom.type = 'password';
        confirmPasswordInput.dom.placeholder = 'Confirm your new password';

        const confirmPasswordToggle = new UIButton('👁️');
        confirmPasswordToggle.setClass('password-toggle');
        confirmPasswordToggle.onClick(() => this.togglePasswordVisibility('confirm-password-input'));

        confirmPasswordContainer.add(confirmPasswordInput);
        confirmPasswordContainer.add(confirmPasswordToggle);

        // Error message for confirm password
        const confirmPasswordError = new UIText('');
        confirmPasswordError.setClass('password-error-message');
        confirmPasswordError.setId('confirm-password-error');
        confirmPasswordError.dom.style.display = 'none';

        confirmPasswordGroup.add(confirmPasswordLabel);
        confirmPasswordGroup.add(confirmPasswordContainer);
        confirmPasswordGroup.add(confirmPasswordError);

        // Password actions
        const passwordActions = new UIPanel();
        passwordActions.setClass('password-actions');

        const forgotPasswordBtn = new UIButton('Forgot Password?');
        forgotPasswordBtn.setClass('text-button');
        forgotPasswordBtn.onClick(() => this.handleForgotPassword());

        const updatePasswordBtn = new UIButton('Update Password');
        updatePasswordBtn.setClass('action-button primary-button');
        updatePasswordBtn.setId('update-password-btn');
        updatePasswordBtn.onClick(() => this.handlePasswordUpdate());

        passwordActions.add(forgotPasswordBtn);
        passwordActions.add(updatePasswordBtn);

        // Add real-time validation
        newPasswordInput.dom.addEventListener('input', (e) => {
            this.validateNewPassword(e.target.value);
            this.validatePasswordMatch();
        });

        confirmPasswordInput.dom.addEventListener('input', () => {
            this.validatePasswordMatch();
        });

        passwordForm.add(currentPasswordGroup);
        passwordForm.add(newPasswordGroup);
        passwordForm.add(confirmPasswordGroup);
        passwordForm.add(passwordActions);

        passwordSection.add(passwordLabel);
        passwordSection.add(passwordDesc);
        passwordSection.add(passwordForm);

        sectionContent.add(passwordSection);

        section.add(sectionHeader);
        section.add(sectionContent);

        return section;
    }


    // Toggle password visibility
    togglePasswordVisibility(inputId) {
        const input = document.getElementById(inputId);
        const toggleBtn = input?.parentElement?.querySelector('.password-toggle');

        if (!input || !toggleBtn) return;

        if (input.type === 'password') {
            input.type = 'text';
            toggleBtn.textContent = '🙈';
            toggleBtn.setAttribute('title', 'Hide password');
        } else {
            input.type = 'password';
            toggleBtn.textContent = '👁️';
            toggleBtn.setAttribute('title', 'Show password');
        }
    }

    // Validate new password
    validateNewPassword(password) {
        const errorElement = document.getElementById('new-password-error');
        const strengthElement = document.getElementById('password-strength');
        const strengthValue = document.getElementById('strength-value');

        if (!password) {
            this.hideError('new-password-error');
            strengthElement.style.display = 'none';
            return false;
        }

        strengthElement.style.display = 'block';

        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        };

        const validCount = Object.values(requirements).filter(Boolean).length;
        const isValid = validCount === 5;

        // Update strength indicator
        strengthValue.classList.remove('weak', 'medium', 'strong');
        if (validCount < 3) {
            strengthValue.textContent = 'Weak';
            strengthValue.classList.add('weak');
        } else if (validCount < 5) {
            strengthValue.textContent = 'Medium';
            strengthValue.classList.add('medium');
        } else {
            strengthValue.textContent = 'Strong';
            strengthValue.classList.add('strong');
        }

        // Show specific error messages
        if (!isValid) {
            const missingRequirements = [];
            if (!requirements.length) missingRequirements.push('at least 8 characters');
            if (!requirements.uppercase) missingRequirements.push('uppercase letter');
            if (!requirements.lowercase) missingRequirements.push('lowercase letter');
            if (!requirements.number) missingRequirements.push('number');
            if (!requirements.special) missingRequirements.push('special character');

            this.showError('new-password-error', `Password must contain: ${missingRequirements.join(', ')}`);
            return false;
        } else {
            this.hideError('new-password-error');
            return true;
        }
    }

    // Validate password match
    validatePasswordMatch() {
        const newPassword = document.getElementById('new-password-input')?.value;
        const confirmPassword = document.getElementById('confirm-password-input')?.value;

        if (!confirmPassword) {
            this.hideError('confirm-password-error');
            return false;
        }

        if (newPassword !== confirmPassword) {
            this.showError('confirm-password-error', 'Passwords do not match');
            return false;
        } else {
            this.hideError('confirm-password-error');
            return true;
        }
    }

    // Show error message
    showError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.dom.textContent = message;
            errorElement.dom.style.display = 'block';
        }
    }

    // Hide error message
    hideError(errorId) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.dom.style.display = 'none';
            errorElement.dom.textContent = '';
        }
    }

    // Handle password update
    async handlePasswordUpdate() {
        const currentPasswordInput = document.getElementById('current-password-input');
        const newPasswordInput = document.getElementById('new-password-input');
        const confirmPasswordInput = document.getElementById('confirm-password-input');
        const updateBtn = document.getElementById('update-password-btn');

        const currentPassword = currentPasswordInput?.value;
        const newPassword = newPasswordInput?.value;
        const confirmPassword = confirmPasswordInput?.value;

        // Clear previous errors
        this.hideError('current-password-error');
        this.hideError('new-password-error');
        this.hideError('confirm-password-error');

        // Validate inputs
        let hasErrors = false;

        if (!currentPassword) {
            this.showError('current-password-error', 'Current password is required');
            hasErrors = true;
        }

        if (!newPassword) {
            this.showError('new-password-error', 'New password is required');
            hasErrors = true;
        } else if (!this.validateNewPassword(newPassword)) {
            hasErrors = true;
        }

        if (!confirmPassword) {
            this.showError('confirm-password-error', 'Please confirm your new password');
            hasErrors = true;
        } else if (!this.validatePasswordMatch()) {
            hasErrors = true;
        }

        if (hasErrors) return;

        // Disable button during update
        updateBtn.dom.disabled = true;
        updateBtn.dom.textContent = 'Updating...';

        try {
            // Re-authenticate user with current password
            const credential = EmailAuthProvider.credential(this.currentUser.email, currentPassword);
            await reauthenticateWithCredential(this.currentUser, credential);

            // Update password
            await updatePassword(this.currentUser, newPassword);

            // Clear form
            currentPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmPasswordInput.value = '';

            // Hide strength indicator
            document.getElementById('password-strength').style.display = 'none';

            this.showSuccess('Password updated successfully!');

        } catch (error) {
            console.error('Password update error:', error);

            // Show specific error messages
            if (error.code === 'auth/wrong-password') {
                this.showError('current-password-error', 'Current password is incorrect');
            } else if (error.code === 'auth/weak-password') {
                this.showError('new-password-error', 'Password is too weak');
            } else if (error.code === 'auth/requires-recent-login') {
                this.showError('current-password-error', 'Please log out and log back in, then try again');
            } else {
                this.showError('current-password-error', 'Failed to update password. Please try again.');
            }
        } finally {
            // Re-enable button
            updateBtn.dom.disabled = false;
            updateBtn.dom.textContent = 'Update Password';
        }
    }



    // createSecuritySection() {
    //     const section = new UIPanel();
    //     section.setClass('settings-section');

    //     const sectionHeader = new UIText('Security & Password');
    //     sectionHeader.setClass('section-header');

    //     const sectionContent = new UIPanel();
    //     sectionContent.setClass('section-content');

    //     // Password change form
    //     const passwordSection = new UIPanel();
    //     passwordSection.setClass('password-change-section');

    //     const passwordLabel = new UIText('Change Password');
    //     passwordLabel.setClass('action-label');

    //     const passwordDesc = new UIText('Enter your current password and choose a new secure password to update your account.');
    //     passwordDesc.setClass('action-description');

    //     const passwordForm = new UIPanel();
    //     passwordForm.setClass('password-form');

    //     // Current password field
    //     const currentPasswordGroup = new UIPanel();
    //     currentPasswordGroup.setClass('input-group');

    //     const currentPasswordLabel = new UIText('Current Password');
    //     currentPasswordLabel.setClass('input-label');

    //     const currentPasswordInput = new UIInput('');
    //     currentPasswordInput.setClass('settings-input');
    //     currentPasswordInput.setId('current-password-input');
    //     currentPasswordInput.dom.type = 'password';
    //     currentPasswordInput.dom.placeholder = 'Enter your current password';

    //     currentPasswordGroup.add(currentPasswordLabel);
    //     currentPasswordGroup.add(currentPasswordInput);

    //     // New password fields row
    //     const passwordRow = new UIPanel();
    //     passwordRow.setClass('password-row');

    //     // New password field
    //     const newPasswordGroup = new UIPanel();
    //     newPasswordGroup.setClass('input-group');

    //     const newPasswordLabel = new UIText('New Password');
    //     newPasswordLabel.setClass('input-label');

    //     const newPasswordInput = new UIInput('');
    //     newPasswordInput.setClass('settings-input');
    //     newPasswordInput.setId('new-password-input');
    //     newPasswordInput.dom.type = 'password';
    //     newPasswordInput.dom.placeholder = 'Enter new password';

    //     newPasswordGroup.add(newPasswordLabel);
    //     newPasswordGroup.add(newPasswordInput);

    //     // Confirm password field
    //     const confirmPasswordGroup = new UIPanel();
    //     confirmPasswordGroup.setClass('input-group');

    //     const confirmPasswordLabel = new UIText('Confirm New Password');
    //     confirmPasswordLabel.setClass('input-label');

    //     const confirmPasswordInput = new UIInput('');
    //     confirmPasswordInput.setClass('settings-input');
    //     confirmPasswordInput.setId('confirm-password-input');
    //     confirmPasswordInput.dom.type = 'password';
    //     confirmPasswordInput.dom.placeholder = 'Confirm new password';

    //     confirmPasswordGroup.add(confirmPasswordLabel);
    //     confirmPasswordGroup.add(confirmPasswordInput);

    //     passwordRow.add(newPasswordGroup);
    //     passwordRow.add(confirmPasswordGroup);

    //     // Password actions
    //     const passwordActions = new UIPanel();
    //     passwordActions.setClass('password-actions');

    //     const forgotPasswordBtn = new UIButton('Forgot Password?');
    //     forgotPasswordBtn.setClass('text-button');
    //     forgotPasswordBtn.onClick(() => this.handleForgotPassword());

    //     const changePasswordBtn = new UIButton('Update Password');
    //     changePasswordBtn.setClass('action-button secondary-button');
    //     changePasswordBtn.setId('change-password-btn');
    //     changePasswordBtn.onClick(() => this.handlePasswordChangeInline());

    //     passwordActions.add(forgotPasswordBtn);
    //     passwordActions.add(changePasswordBtn);

    //     passwordForm.add(currentPasswordGroup);
    //     passwordForm.add(passwordRow);
    //     passwordForm.add(passwordActions);

    //     passwordSection.add(passwordLabel);
    //     passwordSection.add(passwordDesc);
    //     passwordSection.add(passwordForm);

    //     sectionContent.add(passwordSection);

    //     section.add(sectionHeader);
    //     section.add(sectionContent);

    //     return section;
    // }

    // // Add this new method to handle inline password change:
    // async handlePasswordChangeInline() {
    //     const currentPasswordInput = document.getElementById('current-password-input');
    //     const newPasswordInput = document.getElementById('new-password-input');
    //     const confirmPasswordInput = document.getElementById('confirm-password-input');

    //     const currentPassword = currentPasswordInput?.value;
    //     const newPassword = newPasswordInput?.value;
    //     const confirmPassword = confirmPasswordInput?.value;

    //     if (!currentPassword || !newPassword || !confirmPassword) {
    //         this.showError('Please fill in all password fields');
    //         return;
    //     }

    //     if (newPassword !== confirmPassword) {
    //         this.showError('New passwords do not match');
    //         return;
    //     }

    //     if (!this.validatePasswordStrength(newPassword)) {
    //         this.showError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
    //         return;
    //     }

    //     try {
    //         // Re-authenticate user
    //         const credential = EmailAuthProvider.credential(this.currentUser.email, currentPassword);
    //         await reauthenticateWithCredential(this.currentUser, credential);

    //         // Update password
    //         await updatePassword(this.currentUser, newPassword);

    //         // Clear form
    //         currentPasswordInput.value = '';
    //         newPasswordInput.value = '';
    //         confirmPasswordInput.value = '';

    //         this.showSuccess('Password updated successfully!');
    //     } catch (error) {
    //         this.showError(this.getErrorMessage(error.code));
    //     }
    // }

    createDangerSection() {
        const section = new UIPanel();
        section.setClass('settings-section danger-section');

        const sectionHeader = new UIText('Danger Zone');
        sectionHeader.setClass('section-header danger-header');

        const sectionContent = new UIPanel();
        sectionContent.setClass('section-content');

        // Warning text
        const warningText = new UIText('⚠️ Actions in this section are permanent and cannot be undone!');
        warningText.setClass('warning-text');

        // Delete account
        const deleteGroup = new UIPanel();
        deleteGroup.setClass('action-group danger-group');

        const deleteInfo = new UIPanel();
        deleteInfo.setClass('action-info');

        const deleteLabel = new UIText('Delete Account');
        deleteLabel.setClass('action-label danger-label');

        const deleteDesc = new UIText('Permanently delete your account and all associated data. This will remove all your projects, settings, and personal information.');
        deleteDesc.setClass('action-description danger-description');

        deleteInfo.add(deleteLabel);
        deleteInfo.add(deleteDesc);

        const deleteActions = new UIPanel();
        deleteActions.setClass('action-buttons');

        const deleteBtn = new UIButton('Delete My Account');
        deleteBtn.setClass('action-button danger-button');
        deleteBtn.onClick(() => this.showDeleteAccountModal());

        deleteActions.add(deleteBtn);

        deleteGroup.add(deleteInfo);
        deleteGroup.add(deleteActions);

        sectionContent.add(warningText);
        sectionContent.add(deleteGroup);

        section.add(sectionHeader);
        section.add(sectionContent);

        return section;
    }

    // Handle profile image change
    async handleProfileImageChange(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showError('File size must be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.showError('Please select a valid image file');
            return;
        }

        this.profileImageFile = file;
        this.hasUnsavedChanges = true;
        this.updateSaveButton();

        // Preview image
        const reader = new FileReader();
        reader.onload = (e) => {
            const profileImage = document.querySelector('.profile-image');
            if (profileImage) {
                profileImage.src = e.target.result;
            }
        };
        reader.readAsDataURL(file);
    }

    //  Handle save changes
    async handleSaveChanges() {
        const saveBtn = document.getElementById('save-changes-btn');
        if (!saveBtn || saveBtn.disabled) return;

        this.isUploading = true;
        this.updateSaveButton();

        try {
            const updates = {};
            let needsProfileUpdate = false;

            // Handle profile image upload
            if (this.profileImageFile) {
                const photoURL = await this.uploadProfileImage();
                updates.photoURL = photoURL;
                needsProfileUpdate = true;
            }

            // Handle display name update
            const displayNameInput = document.getElementById('display-name-input');
            if (displayNameInput && displayNameInput.value !== (this.currentUser?.displayName || '')) {
                updates.displayName = displayNameInput.value.trim();
                needsProfileUpdate = true;
            }

            // Update profile if needed
            if (needsProfileUpdate) {
                await updateProfile(this.currentUser, updates);
            }

            // Handle email update separately (requires re-authentication)
            const emailInput = document.getElementById('email-input');
            if (emailInput && emailInput.value !== this.currentUser?.email) {
                await this.handleEmailChange(emailInput.value);
            }

            this.hasUnsavedChanges = false;
            this.profileImageFile = null;
            this.updateSaveButton();
            this.showSuccess('Profile updated successfully!');

        } catch (error) {
            console.error('Error updating profile:', error);
            this.showError(this.getErrorMessage(error.code));
        } finally {
            this.isUploading = false;
            this.updateSaveButton();
        }
    }

    //  Upload profile image
    async uploadProfileImage() {
        if (!this.profileImageFile || !window.firebaseStorage) {
            throw new Error('No file selected or storage not available');
        }

        const storageRef = ref(window.firebaseStorage, `profile-images/${this.currentUser.uid}`);

        // Delete old image if exists
        try {
            await deleteObject(storageRef);
        } catch (error) {
            // Old image might not exist, ignore error
        }

        // Upload new image
        const snapshot = await uploadBytes(storageRef, this.profileImageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    }

    // Handle email change
    async handleEmailChange(newEmail) {
        if (newEmail === this.currentUser?.email) return;

        // Email change requires re-authentication
        const modal = this.createReauthModal('email', newEmail);
        document.body.appendChild(modal);
    }

    //  Create re-authentication modal
    createReauthModal(action, newValue = null) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        const modal = new UIPanel();
        modal.setClass('reauth-modal');

        const modalHeader = new UIText('Confirm Your Identity');
        modalHeader.setClass('modal-header');

        const modalDesc = new UIText('For security reasons, please enter your current password to continue.');
        modalDesc.setClass('modal-description');

        const passwordGroup = new UIPanel();
        passwordGroup.setClass('input-group');

        const passwordLabel = new UIText('Current Password');
        passwordLabel.setClass('input-label');

        const passwordInput = new UIInput('');
        passwordInput.setClass('modal-input');
        passwordInput.dom.type = 'password';
        passwordInput.dom.placeholder = 'Enter your current password';

        passwordGroup.add(passwordLabel);
        passwordGroup.add(passwordInput);

        const buttonGroup = new UIPanel();
        buttonGroup.setClass('modal-buttons');

        const cancelBtn = new UIButton('Cancel');
        cancelBtn.setClass('modal-button secondary-button');
        cancelBtn.onClick(() => {
            document.body.removeChild(modalOverlay);
        });

        const confirmBtn = new UIButton('Confirm');
        confirmBtn.setClass('modal-button primary-button');
        confirmBtn.onClick(async () => {
            const password = passwordInput.getValue();
            if (!password) {
                this.showModalError('Please enter your password');
                return;
            }

            try {
                // Re-authenticate user
                const credential = EmailAuthProvider.credential(this.currentUser.email, password);
                await reauthenticateWithCredential(this.currentUser, credential);

                if (action === 'email') {
                    await updateEmail(this.currentUser, newValue);
                    this.showSuccess('Email updated successfully! Please verify your new email.');
                    // Refresh page to show updated email
                    window.location.reload();
                }

                document.body.removeChild(modalOverlay);
            } catch (error) {
                this.showModalError(this.getErrorMessage(error.code));
            }
        });

        buttonGroup.add(cancelBtn);
        buttonGroup.add(confirmBtn);

        modal.add(modalHeader);
        modal.add(modalDesc);
        modal.add(passwordGroup);
        modal.add(buttonGroup);

        modalOverlay.appendChild(modal.dom);

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });

        return modalOverlay;
    }

    // MISSING METHOD: Show delete account modal
    showDeleteAccountModal() {
        const modal = this.createDeleteAccountModal();
        document.body.appendChild(modal);
    }

    // MISSING METHOD: Create delete account modal
    createDeleteAccountModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        const modal = new UIPanel();
        modal.setClass('delete-modal');

        const modalHeader = new UIText('Delete Account');
        modalHeader.setClass('modal-header danger-header');

        const warningText = new UIText('⚠️ This action is permanent and cannot be undone!');
        warningText.setClass('warning-text');

        const modalDesc = new UIText('Deleting your account will permanently remove all your projects, data, and settings. Please enter your password to confirm.');
        modalDesc.setClass('modal-description');

        const passwordGroup = new UIPanel();
        passwordGroup.setClass('input-group');

        const passwordLabel = new UIText('Password');
        passwordLabel.setClass('input-label');

        const passwordInput = new UIInput('');
        passwordInput.setClass('modal-input');
        passwordInput.dom.type = 'password';
        passwordInput.dom.placeholder = 'Enter your password to confirm';

        passwordGroup.add(passwordLabel);
        passwordGroup.add(passwordInput);

        const confirmGroup = new UIPanel();
        confirmGroup.setClass('input-group');

        const confirmLabel = new UIText('Type "DELETE" to confirm');
        confirmLabel.setClass('input-label');

        const confirmInput = new UIInput('');
        confirmInput.setClass('modal-input');
        confirmInput.dom.placeholder = 'Type DELETE in capital letters';

        confirmGroup.add(confirmLabel);
        confirmGroup.add(confirmInput);

        const buttonGroup = new UIPanel();
        buttonGroup.setClass('modal-buttons');

        const cancelBtn = new UIButton('Cancel');
        cancelBtn.setClass('modal-button secondary-button');
        cancelBtn.onClick(() => {
            document.body.removeChild(modalOverlay);
        });

        const deleteBtn = new UIButton('Delete Account');
        deleteBtn.setClass('modal-button danger-button');
        deleteBtn.onClick(async () => {
            const password = passwordInput.getValue();
            const confirmation = confirmInput.getValue();

            if (!password) {
                this.showModalError('Please enter your password');
                return;
            }

            if (confirmation !== 'DELETE') {
                this.showModalError('Please type DELETE to confirm');
                return;
            }

            try {
                // Re-authenticate user
                const credential = EmailAuthProvider.credential(this.currentUser.email, password);
                await reauthenticateWithCredential(this.currentUser, credential);

                // Delete user data from Firestore (if you're storing user data)
                if (window.firebaseFirestore) {
                    const userDocRef = doc(window.firebaseFirestore, 'users', this.currentUser.uid);
                    await deleteDoc(userDocRef);
                }

                // Delete user account
                await deleteUser(this.currentUser);

                // Redirect to home page
                window.router.navigate('/shine/');

            } catch (error) {
                this.showModalError(this.getErrorMessage(error.code));
            }
        });

        buttonGroup.add(cancelBtn);
        buttonGroup.add(deleteBtn);

        modal.add(modalHeader);
        modal.add(warningText);
        modal.add(modalDesc);
        modal.add(passwordGroup);
        modal.add(confirmGroup);
        modal.add(buttonGroup);

        modalOverlay.appendChild(modal.dom);

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });

        return modalOverlay;
    }

    // Show modal error
    showModalError(message) {
        // Show error in current modal
        const modals = document.querySelectorAll('.reauth-modal, .password-modal, .delete-modal');
        const currentModal = modals[modals.length - 1]; // Get the topmost modal

        if (currentModal) {
            let errorContainer = currentModal.querySelector('.modal-error');
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.className = 'modal-error';
                currentModal.insertBefore(errorContainer, currentModal.querySelector('.modal-buttons'));
            }
            errorContainer.textContent = message;
            errorContainer.style.display = 'block';

            // Hide after 3 seconds
            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 3000);
        }
    }

    // Enhanced Password Change Modal with Current Password
    createPasswordChangeModal() {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';

        const modal = new UIPanel();
        modal.setClass('password-modal');

        const modalHeader = new UIText('Change Password');
        modalHeader.setClass('modal-header');

        const modalDesc = new UIText('Enter your current password and choose a new secure password.');
        modalDesc.setClass('modal-description');

        // Current password
        const currentPasswordGroup = new UIPanel();
        currentPasswordGroup.setClass('input-group');

        const currentPasswordLabel = new UIText('Current Password');
        currentPasswordLabel.setClass('input-label');

        const currentPasswordInput = new UIInput('');
        currentPasswordInput.setClass('modal-input');
        currentPasswordInput.dom.type = 'password';
        currentPasswordInput.dom.placeholder = 'Enter your current password';

        currentPasswordGroup.add(currentPasswordLabel);
        currentPasswordGroup.add(currentPasswordInput);

        // New password
        const newPasswordGroup = new UIPanel();
        newPasswordGroup.setClass('input-group');

        const newPasswordLabel = new UIText('New Password');
        newPasswordLabel.setClass('input-label');

        const newPasswordInput = new UIInput('');
        newPasswordInput.setClass('modal-input');
        newPasswordInput.dom.type = 'password';
        newPasswordInput.dom.placeholder = 'Enter your new password';

        newPasswordGroup.add(newPasswordLabel);
        newPasswordGroup.add(newPasswordInput);

        // Confirm new password
        const confirmPasswordGroup = new UIPanel();
        confirmPasswordGroup.setClass('input-group');

        const confirmPasswordLabel = new UIText('Confirm New Password');
        confirmPasswordLabel.setClass('input-label');

        const confirmPasswordInput = new UIInput('');
        confirmPasswordInput.setClass('modal-input');
        confirmPasswordInput.dom.type = 'password';
        confirmPasswordInput.dom.placeholder = 'Confirm your new password';

        confirmPasswordGroup.add(confirmPasswordLabel);
        confirmPasswordGroup.add(confirmPasswordInput);

        // Password validation
        const validationContainer = new UIPanel();
        validationContainer.setClass('password-validation');

        const validationTitle = new UIText('Password Requirements:');
        validationTitle.setClass('validation-title');
        validationContainer.add(validationTitle);

        const validationItems = [
            'At least 8 characters',
            'At least 1 uppercase letter',
            'At least 1 lowercase letter',
            'At least 1 number',
            'At least 1 special character'
        ];

        validationItems.forEach(item => {
            const validationItem = new UIPanel();
            validationItem.setClass('validation-item validation-invalid');
            const validationText = new UIText(`• ${item}`);
            validationItem.add(validationText);
            validationContainer.add(validationItem);
        });

        // Real-time validation
        newPasswordInput.dom.addEventListener('input', (e) => {
            this.validatePasswordInModal(e.target.value, validationContainer.dom);
            this.validatePasswordMatch(newPasswordInput.getValue(), confirmPasswordInput.getValue());
        });

        confirmPasswordInput.dom.addEventListener('input', (e) => {
            this.validatePasswordMatch(newPasswordInput.getValue(), confirmPasswordInput.getValue());
        });

        // Password strength indicator
        const strengthIndicator = new UIPanel();
        strengthIndicator.setClass('password-strength');
        const strengthText = new UIText('Password Strength: ');
        const strengthValue = new UIText('Weak');
        strengthValue.setClass('strength-value weak');
        strengthIndicator.add(strengthText);
        strengthIndicator.add(strengthValue);

        const buttonGroup = new UIPanel();
        buttonGroup.setClass('modal-buttons');

        const cancelBtn = new UIButton('Cancel');
        cancelBtn.setClass('modal-button secondary-button');
        cancelBtn.onClick(() => {
            document.body.removeChild(modalOverlay);
        });

        const changeBtn = new UIButton('Change Password');
        changeBtn.setClass('modal-button primary-button');
        changeBtn.onClick(async () => {
            const currentPassword = currentPasswordInput.getValue();
            const newPassword = newPasswordInput.getValue();
            const confirmPassword = confirmPasswordInput.getValue();

            if (!currentPassword || !newPassword || !confirmPassword) {
                this.showModalError('Please fill in all fields');
                return;
            }

            if (newPassword !== confirmPassword) {
                this.showModalError('New passwords do not match');
                return;
            }

            if (!this.validatePasswordStrength(newPassword)) {
                this.showModalError('Password does not meet requirements');
                return;
            }

            try {
                // Re-authenticate user
                const credential = EmailAuthProvider.credential(this.currentUser.email, currentPassword);
                await reauthenticateWithCredential(this.currentUser, credential);

                // Update password
                await updatePassword(this.currentUser, newPassword);

                this.showSuccess('Password updated successfully!');
                document.body.removeChild(modalOverlay);
            } catch (error) {
                this.showModalError(this.getErrorMessage(error.code));
            }
        });

        buttonGroup.add(cancelBtn);
        buttonGroup.add(changeBtn);

        modal.add(modalHeader);
        modal.add(modalDesc);
        modal.add(currentPasswordGroup);
        modal.add(newPasswordGroup);
        modal.add(confirmPasswordGroup);
        modal.add(validationContainer);
        modal.add(strengthIndicator);
        modal.add(buttonGroup);

        modalOverlay.appendChild(modal.dom);

        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                document.body.removeChild(modalOverlay);
            }
        });

        return modalOverlay;
    }

    // Forgot Password Handler
    async handleForgotPassword() {
        const email = this.currentUser?.email;
        if (!email) {
            this.showError('No email associated with this account');
            return;
        }

        try {
            await sendPasswordResetEmail(window.firebaseAuth, email);
            this.showSuccess(`Password reset email sent to ${email}. Please check your inbox.`);
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        }
    }

    // Enhanced validation methods
    validatePasswordMatch(password, confirmPassword) {
        const modal = document.querySelector('.password-modal');
        if (!modal) return;

        let matchIndicator = modal.querySelector('.password-match');
        if (!matchIndicator) {
            matchIndicator = document.createElement('div');
            matchIndicator.className = 'password-match';
            modal.querySelector('.modal-buttons').before(matchIndicator);
        }

        if (confirmPassword) {
            if (password === confirmPassword) {
                matchIndicator.textContent = '✓ Passwords match';
                matchIndicator.className = 'password-match match';
            } else {
                matchIndicator.textContent = '✗ Passwords do not match';
                matchIndicator.className = 'password-match no-match';
            }
        } else {
            matchIndicator.textContent = '';
        }
    }

    validatePasswordInModal(password, container) {
        const requirements = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[a-z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        ];

        const items = container.querySelectorAll('.validation-item');
        let validCount = 0;

        items.forEach((item, index) => {
            if (index === 0) return; // Skip title
            const reqIndex = index - 1;
            if (requirements[reqIndex]) {
                item.classList.remove('validation-invalid');
                item.classList.add('validation-valid');
                validCount++;
            } else {
                item.classList.remove('validation-valid');
                item.classList.add('validation-invalid');
            }
        });

        // Update strength indicator
        const strengthValue = container.parentNode.querySelector('.strength-value');
        if (strengthValue) {
            strengthValue.classList.remove('weak', 'medium', 'strong');
            if (validCount < 3) {
                strengthValue.textContent = 'Weak';
                strengthValue.classList.add('weak');
            } else if (validCount < 5) {
                strengthValue.textContent = 'Medium';
                strengthValue.classList.add('medium');
            } else {
                strengthValue.textContent = 'Strong';
                strengthValue.classList.add('strong');
            }
        }
    }

    getDefaultAvatar() {
        // Return a data URL for a simple default avatar
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNDAiIGZpbGw9IiNFNUU3RUIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIzMiIgcj0iMTIiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEyIDY4QzEyIDU2IDI0IDQ4IDQwIDQ4QzU2IDQ4IDY4IDU2IDY4IDY4VjgwSDEyVjY4WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
    }

    setupEventListeners() {
        const inputs = ['display-name-input', 'email-input'];

        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => {
                    this.hasUnsavedChanges = true;
                    this.updateSaveButton();
                });
            }
        });

        window.addEventListener('beforeunload', (e) => {
            if (this.hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    updateSaveButton() {
        const saveBtn = document.getElementById('save-changes-btn');
        if (saveBtn) {
            saveBtn.disabled = !this.hasUnsavedChanges || this.isUploading;
            if (this.hasUnsavedChanges && !this.isUploading) {
                saveBtn.classList.add('has-changes');
            } else {
                saveBtn.classList.remove('has-changes');
            }
        }
    }

    showPasswordChangeModal() {
        const modal = this.createPasswordChangeModal();
        document.body.appendChild(modal);
    }

    validatePasswordStrength(password) {
        return password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /\d/.test(password) &&
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    }

    async sendEmailVerification() {
        try {
            await sendEmailVerification(this.currentUser);
            this.showSuccess('Verification email sent! Please check your inbox.');
        } catch (error) {
            this.showError(this.getErrorMessage(error.code));
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 10000;
      max-width: 400px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      animation: slideInRight 0.3s ease;
    `;

        if (type === 'success') {
            notification.style.backgroundColor = '#10b981';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#ef4444';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/wrong-password':
                return 'Incorrect current password. Please try again.';
            case 'auth/email-already-in-use':
                return 'This email is already associated with another account.';
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/weak-password':
                return 'Password should be at least 8 characters long.';
            case 'auth/requires-recent-login':
                return 'Please log out and log back in before making this change.';
            case 'auth/too-many-requests':
                return 'Too many requests. Please try again later.';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    destroy() {
        if (this.container && this.container.dom && this.container.dom.parentNode) {
            this.container.dom.parentNode.removeChild(this.container.dom);
        }
    }
}