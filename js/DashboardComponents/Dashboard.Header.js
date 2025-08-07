import { UIPanel, UIText, UIButton } from '/js/libs/ui.js';
import logoDark from '../../images/favicon_dark.ico';
import logoLight from '../../images/favicon_white.ico';

function DashboardHeader(onLogout) {
  const header = new UIPanel();
  header.setClass('dashboard-header');

  const headerContent = new UIPanel();
  headerContent.setClass('header-content');

  // Logo and title section
  const leftSection = new UIPanel();
  leftSection.setClass('header-left');

  // Logo with icon
  const logoContainer = new UIPanel();
  logoContainer.setClass('logo-container');

  const logoElement = document.createElement('img');
  logoElement.alt = 'Shine Logo';
  logoElement.className = 'header-logo-img';

  const updateLogo = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Dark theme: use white logo
      logoElement.src = logoLight;
    } else {
      // Light theme: use dark logo
      logoElement.src = logoDark;
    }
  };

  // Listen for theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateLogo);
  }

  updateLogo(); // Set initial logo

  const logoText = new UIText('Shine');
  logoText.setClass('header-logo-text');

  logoContainer.dom.appendChild(logoElement);
  logoContainer.add(logoText);

  leftSection.add(logoContainer);

  // Navigation section (for future features)
  const navSection = new UIPanel();
  navSection.setClass('header-nav');

  // Updated navigation items without Community
  const navItems = ['Dashboard', 'Explore'];

  navItems.forEach((item, index) => {
    const navItem = new UIText(item);
    navItem.setClass('nav-item');

    if (index === 0) { // Dashboard is active
      navItem.setClass('nav-item active');
    } else {
      navItem.setClass('nav-item disabled'); // Future features
    }

    navSection.add(navItem);
  });

  // User section
  const rightSection = new UIPanel();
  rightSection.setClass('header-right');

  const currentUser = window.router.getCurrentUser();

  const userInfo = new UIPanel();
  userInfo.setClass('user-info');

  const userEmail = new UIText(currentUser?.email || 'user@example.com');
  userEmail.setClass('user-email');

  userInfo.add(userEmail);

  // User actions
  const userActions = new UIPanel();
  userActions.setClass('user-actions');

  // Settings button (future feature)
  const settingsBtn = new UIButton('⚙️');
  settingsBtn.setClass('header-button settings-btn');
  settingsBtn.dom.title = 'Settings (Coming Soon)';
  settingsBtn.onClick(() => {
    // Future implementation
    console.log('Settings clicked');
    if (window.router) {
      window.router.navigate('/shine/settings');
    }
  });

  // Logout button
  const logoutBtn = new UIButton('LOGOUT');
  logoutBtn.setClass('header-button logout-btn');
  logoutBtn.onClick(() => {
    if (onLogout) {
      onLogout();
    }
  });

  const homeButton = new UIButton('HOME');
  homeButton.setClass('header-button logout-btn');
  homeButton.onClick(function () {
    window.router.navigate('/');
  });

  userActions.add(settingsBtn);
  userActions.add(logoutBtn);
  userActions.add(homeButton);

  rightSection.add(userInfo);
  rightSection.add(userActions);

  // Assemble header
  headerContent.add(leftSection);
  headerContent.add(navSection);
  headerContent.add(rightSection);
  header.add(headerContent);

  // Public methods for updating user info
  header.updateUser = function (user) {
    userEmail.setValue(user?.email || 'user@example.com');
  };

  header.setActiveNav = function (navItemName) {
    const navElements = navSection.dom.querySelectorAll('.nav-item');
    navElements.forEach(el => {
      el.classList.remove('active');
      if (el.textContent === navItemName) {
        el.classList.add('active');
      }
    });
  };

  return header;
}

export { DashboardHeader };