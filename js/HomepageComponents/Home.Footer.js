import { UIPanel, UIText, UIButton, UIInput } from '/js/libs/ui.js';
import { createIcon } from './Home.Utils.js';

function HomeFooter() {
    const container = new UIPanel();
    container.setClass('home-footer');

    // Main footer content
    const footerContent = new UIPanel();
    footerContent.setClass('footer-content');

    // About section
    const aboutSection = new UIPanel();
    aboutSection.setClass('footer-section about-section');

    const logo = new UIText('shine');
    logo.setClass('footer-logo');

    const aboutText = new UIText(`Empowering physics researchers with intuitive simulation tools. Design, collaborate, and validate your experiments before they're built.`);
    aboutText.setClass('about-text');

    const socialLinks = new UIPanel();
    socialLinks.setClass('social-links');

    ['github', 'twitter', 'linkedin', 'youtube'].forEach(platform => {
        const socialLink = new UIButton();
        socialLink.setClass('social-link');
        socialLink.dom.setAttribute('aria-label', `Follow us on ${platform}`);
        socialLink.dom.appendChild(createIcon(`ri-${platform}-line`));
        socialLink.onClick(() => window.open(`https://${platform}.com/shine`, '_blank'));
        socialLinks.add(socialLink);
    });

    aboutSection.add(logo);
    aboutSection.add(aboutText);
    aboutSection.add(socialLinks);

    // Quick links section
    const quickLinksSection = new UIPanel();
    quickLinksSection.setClass('footer-section');

    const quickLinksTitle = new UIText('Quick Links');
    quickLinksTitle.setClass('footer-section-title');

    const quickLinksList = new UIPanel();
    quickLinksList.setClass('footer-links');

    [
        { text: 'Features', href: '#features' },
        { text: 'Pricing', href: '#pricing' },
        { text: 'Documentation', href: '/docs' },
        { text: 'Blog', href: '/blog' }
    ].forEach(link => {
        const linkBtn = new UIButton(link.text);
        linkBtn.setClass('footer-link');
        linkBtn.onClick(() => window.router.navigate(link.href));
        quickLinksList.add(linkBtn);
    });

    quickLinksSection.add(quickLinksTitle);
    quickLinksSection.add(quickLinksList);

    // Legal section
    const legalSection = new UIPanel();
    legalSection.setClass('footer-section');

    const legalTitle = new UIText('Legal');
    legalTitle.setClass('footer-section-title');

    const legalLinks = new UIPanel();
    legalLinks.setClass('footer-links');

    [
        { text: 'Terms', href: '/terms' },
        { text: 'Privacy', href: '/privacy' },
        { text: 'Cookies', href: '/cookies' },
        { text: 'Security', href: '/security' }
    ].forEach(link => {
        const linkBtn = new UIButton(link.text);
        linkBtn.setClass('footer-link');
        linkBtn.onClick(() => window.router.navigate(link.href));
        legalLinks.add(linkBtn);
    });

    legalSection.add(legalTitle);
    legalSection.add(legalLinks);

    // Newsletter & Contact section
    const contactSection = new UIPanel();
    contactSection.setClass('footer-section contact-section');

    const newsletterTitle = new UIText('Stay Updated');
    newsletterTitle.setClass('footer-section-title');

    const subscribeForm = new UIPanel();
    subscribeForm.setClass('subscribe-form');

    const emailInput = new UIInput();
    emailInput.setClass('subscribe-input');
    emailInput.dom.type = 'email';
    emailInput.dom.placeholder = 'Enter your email';
    emailInput.dom.setAttribute('aria-label', 'Email subscription');
    emailInput.setValue('');

    const subscribeBtn = new UIButton('Subscribe');
    subscribeBtn.setClass('subscribe-btn');
    const btnIcon = createIcon('ri-send-plane-line');
    subscribeBtn.dom.appendChild(btnIcon);
    subscribeBtn.onClick(() => {
        if (emailInput.getValue()) {
            // TODO: Implement newsletter subscription
            console.log('Newsletter subscription:', emailInput.getValue());
            emailInput.setValue('');
        }
    });

    subscribeForm.add(emailInput);
    subscribeForm.add(subscribeBtn);

    const contactInfo = new UIPanel();
    contactInfo.setClass('contact-info');

    const contactItems = [
        { icon: 'ri-mail-line', text: 'hello@shine.dev' },
        { icon: 'ri-map-pin-line', text: 'University of South Dakota' },
        { icon: 'ri-phone-line', text: '+1 (605) 123-4567' }
    ];

    contactItems.forEach(item => {
        const contactItem = new UIPanel();
        contactItem.setClass('contact-item');

        const icon = new UIPanel();
        icon.setClass('contact-icon');
        icon.dom.appendChild(createIcon(item.icon));

        const text = new UIText(item.text);
        text.setClass('contact-text');

        contactItem.add(icon);
        contactItem.add(text);
        contactInfo.add(contactItem);
    });

    contactSection.add(newsletterTitle);
    contactSection.add(subscribeForm);
    contactSection.add(contactInfo);

    // Assemble footer sections
    footerContent.add(aboutSection);
    footerContent.add(quickLinksSection);
    footerContent.add(legalSection);
    footerContent.add(contactSection);

    // Footer bottom
    const footerBottom = new UIPanel();
    footerBottom.setClass('footer-bottom');

    const copyright = new UIText(`© ${new Date().getFullYear()} Shine. All rights reserved.`);
    copyright.setClass('copyright');

    footerBottom.add(copyright);

    // Assemble footer
    container.add(footerContent);
    container.add(footerBottom);

    return container;
}

export { HomeFooter };