import { UIPanel, UIButton, UIText } from '/js/libs/ui.js';
import logoImg from '../../images/favicon.ico';

function HomeNavbar() {
    const container = new UIPanel();
    container.setClass('home-navbar');
    container.addClass('navbar-transparent');

    // Logo section
    const logoSection = new UIPanel();
    logoSection.setClass('navbar-logo-section');

    const logoWrapper = new UIPanel();
    logoWrapper.setClass('logo-wrapper');

    const logoIcon = new UIPanel();
    logoIcon.setClass('navbar-logo-icon');
    const icon = document.createElement('img');
    icon.src = logoImg;
    icon.alt = 'Shine';
    logoIcon.dom.appendChild(icon);

    const logoText = new UIButton('shine');
    logoText.setClass('navbar-logo');
    logoText.onClick(() => window.router.navigate('/'));

    logoWrapper.add(logoIcon);
    // logoWrapper.add(logoText);
    logoSection.add(logoWrapper);

    // Navigation links
    const navLinks = new UIPanel();
    navLinks.setClass('navbar-links');

    const links = [
        { text: 'Features', href: '#features' },
        { text: 'Explore', href: '#explore' },
        { text: 'Pricing', href: '#pricing' },
        {
            text: 'Help', href: '#', dropdown: [
                { text: 'Documentation', href: '/docs' },
                { text: 'Tutorials', href: '/tutorials' },
                { text: 'FAQ', href: '/faq' }
            ]
        }
    ];

    links.forEach(link => {
        if (link.dropdown) {
            const dropdownContainer = new UIPanel();
            dropdownContainer.setClass('navbar-dropdown');

            const dropdownBtn = new UIButton(link.text);
            dropdownBtn.setClass('navbar-link dropdown-toggle');

            const dropdownContent = new UIPanel();
            dropdownContent.setClass('dropdown-content');

            link.dropdown.forEach(item => {
                const dropdownItem = new UIButton(item.text);
                dropdownItem.setClass('dropdown-item');
                dropdownItem.onClick(() => window.router.navigate(item.href));
                dropdownContent.add(dropdownItem);
            });

            dropdownContainer.add(dropdownBtn);
            dropdownContainer.add(dropdownContent);
            navLinks.add(dropdownContainer);
        } else {
            const linkBtn = new UIButton(link.text);
            linkBtn.setClass('navbar-link');
            linkBtn.onClick(() => {
                document.querySelector(link.href)?.scrollIntoView({
                    behavior: 'smooth'
                });
            });
            navLinks.add(linkBtn);
        }
    });

    // Auth section
    const authSection = new UIPanel();
    authSection.setClass('navbar-auth');

    const loginBtn = new UIButton('Sign in');
    loginBtn.setClass('auth-btn login-btn');
    loginBtn.onClick(() => {
        // Check if user is logged in
        const currentUser = window.router.getCurrentUser();
        if (currentUser) {
            // User is logged in, go to dashboard
            window.router.navigate('/shine/dashboard');
        } else {
            // User is not logged in, go to auth
            window.router.navigate('shine/auth');
        }
    });

    const signupBtn = new UIButton('Try a Demo');
    signupBtn.setClass('auth-btn signup-btn');
    signupBtn.onClick(() => window.router.navigate('/shine/demo'));

    authSection.add(loginBtn);
    authSection.add(signupBtn);

    // Mobile menu
    const mobileMenuBtn = new UIButton();
    mobileMenuBtn.setClass('mobile-menu-btn');
    mobileMenuBtn.dom.innerHTML = '<i class="ri-menu-line"></i>';
    mobileMenuBtn.onClick(() => toggleMobileMenu());

    // Assemble navbar
    container.add(logoSection);
    container.add(navLinks);
    container.add(authSection);
    container.add(mobileMenuBtn);

    // Handle scroll effect
    function handleScroll() {
        const scrollY = window.scrollY;

        // Add debounce for performance
        if (!container.scrollTimeout) {
            container.scrollTimeout = setTimeout(() => {
                if (scrollY > 50) {
                    container.removeClass('navbar-transparent');
                    container.addClass('navbar-solid');
                } else {
                    container.addClass('navbar-transparent');
                    container.removeClass('navbar-solid');
                }
                container.scrollTimeout = null;
            }, 10);
        }
    }

    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay';
    document.body.appendChild(overlay);

    // Mobile menu toggle
    let isMobileMenuOpen = false;
    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;

        if (isMobileMenuOpen) {
            navLinks.addClass('mobile-active');
            authSection.addClass('mobile-active');
            mobileMenuBtn.addClass('active');
            mobileMenuBtn.dom.innerHTML = '<i class="ri-close-line"></i>';
            document.body.classList.add('menu-open');
            overlay.classList.add('active');
        } else {
            navLinks.removeClass('mobile-active');
            authSection.removeClass('mobile-active');
            mobileMenuBtn.removeClass('active');
            mobileMenuBtn.dom.innerHTML = '<i class="ri-menu-line"></i>';
            document.body.classList.remove('menu-open');
            overlay.classList.remove('active');
        }
    }

    // Public methods
    container.handleScroll = handleScroll;
    container.destroy = () => {
        document.body.style.overflow = '';
        if (container.scrollTimeout) {
            clearTimeout(container.scrollTimeout);
        }
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    };

    return container;
}

export { HomeNavbar };