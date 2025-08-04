import { UIPanel } from '/js/libs/ui.js';
import { HomeNavbar } from '../HomepageComponents/Home.Navbar.js';
import { HomeHero } from '../HomepageComponents/Home.Hero.js';
import { HomeFeatures } from '../HomepageComponents/Home.Features.js';
import { HomePricing } from '../HomepageComponents/Home.pricing.js';
import { HomeTestimonials } from '../HomepageComponents/Home.Testimonials.js';
import { HomeFooter } from '../HomepageComponents/Home.Footer.js';

export class HomePage {
  constructor() {
    this.container = null;
    this.components = {};
    this.setupScrollAnimations = this.setupScrollAnimations.bind(this);
  }

  async render() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';

    // Initialize main container
    this.container = new UIPanel();
    this.container.setClass('home-container');

    // Initialize components
    this.components = {
      navbar: new HomeNavbar(),
      hero: new HomeHero(),
      features: new HomeFeatures(),
      pricing: new HomePricing(),
      testimonials: new HomeTestimonials(),
      footer: new HomeFooter()
    };

    // Add components to container
    Object.values(this.components).forEach(component => {
      this.container.add(component);
    });

    // Add container to DOM
    appContainer.appendChild(this.container.dom);

    // Setup animations after DOM is ready
    requestAnimationFrame(() => {
      this.setupScrollAnimations();
      this.components.hero.startTypingAnimation();
    });

    // Setup navbar scroll effect
    window.addEventListener('scroll', () => {
      this.components.navbar.handleScroll();
    });
  }

  setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  destroy() {
    // Remove scroll listener
    window.removeEventListener('scroll', this.components.navbar.handleScroll);

    // Cleanup components
    Object.values(this.components).forEach(component => {
      if (component.destroy) component.destroy();
    });

    // Remove container
    if (this.container?.dom?.parentNode) {
      this.container.dom.parentNode.removeChild(this.container.dom);
    }
  }
}