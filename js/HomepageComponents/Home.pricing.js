import { UIPanel, UIText, UIButton } from '/js/libs/ui.js';
import { createIcon } from './Home.Utils';

function HomePricing() {
    const container = new UIPanel();
    container.setClass('home-pricing');
    container.dom.id = 'pricing';

    // Section header
    const header = new UIPanel();
    header.setClass('pricing-header fade-in');

    const headerTitle = new UIPanel();
    headerTitle.setClass('pricing-title-wrapper');

    const codeComment = new UIText('/* Pricing */');
    codeComment.setClass('pricing-code-comment');

    const title = new UIText('Simple, Transparent Pricing');
    title.setClass('pricing-title');

    headerTitle.add(codeComment);
    headerTitle.add(title);

    const headerDescription = new UIText('Choose the plan that best fits your needs');
    headerDescription.setClass('pricing-description');

    header.add(headerTitle);
    header.add(headerDescription);

    // header.add(headerCodeWrapper);
    // header.add(headerContent);

    // Pricing grid
    const pricingGrid = new UIPanel();
    pricingGrid.setClass('pricing-grid');

    const plans = [
        {
            name: 'Free',
            price: '0',
            description: 'Perfect for individual researchers',
            features: [
                '1 Active Project',
                'Basic Geometries',
                'Standard Physics Models',
                'Community Support'
            ],
            cta: 'Get Started',
            popular: false
        },
        {
            name: 'Coffee',
            price: '15',
            description: 'Most popular for research teams',
            features: [
                'Unlimited Projects',
                'Advanced Geometries',
                'Custom Physics Models',
                'Real-time Collaboration',
                'Priority Support',
                'Version History'
            ],
            cta: 'Start Free Trial',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'For large institutions',
            features: [
                'Everything in Coffee Plan',
                'Custom Integration',
                'Dedicated Support',
                'Training Sessions',
                'SLA Agreement',
                'Custom Features'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    plans.forEach(plan => {
        const planCard = new UIPanel();
        planCard.setClass(`pricing-card fade-in ${plan.popular ? 'popular' : ''}`);

        if (plan.popular) {
            const popularBadge = new UIText('Most Popular');
            popularBadge.setClass('popular-badge');
            planCard.add(popularBadge);
        }

        const planName = new UIText(plan.name);
        planName.setClass('plan-name');

        const priceContainer = new UIPanel();
        priceContainer.setClass('price-container');

        const currency = new UIText('$');
        currency.setClass('currency');

        const price = new UIText(plan.price);
        price.setClass('price');

        const period = new UIText(plan.price === 'Custom' ? '' : '/month');
        period.setClass('period');

        priceContainer.add(currency);
        priceContainer.add(price);
        priceContainer.add(period);

        const description = new UIText(plan.description);
        description.setClass('plan-description');

        const featuresList = new UIPanel();
        featuresList.setClass('features-list');

        plan.features.forEach(feature => {
            const featureItem = new UIPanel();
            featureItem.setClass('feature-item');

            const icon = new UIPanel();
            icon.setClass('feature-icon');

            // Determine if feature is included
            const isIncluded = true; // You can add logic here based on plan level
            icon.dom.appendChild(
                createIcon(isIncluded ? 'ri-checkbox-circle-line' : 'ri-close-circle-line')
            );
            icon.addClass(isIncluded ? 'included' : 'excluded');

            const featureText = new UIText(feature);
            featureText.setClass('feature-text');

            featureItem.add(icon);
            featureItem.add(featureText);
            featuresList.add(featureItem);
        });

        const ctaButton = new UIButton(plan.cta);
        ctaButton.setClass(`plan-cta ${plan.popular ? 'popular-cta' : ''}`);
        ctaButton.onClick(() => {
            if (plan.name === 'Enterprise') {
                window.router.navigate('/contact');
            } else {
                window.router.navigate('/auth?signup=true&plan=' + plan.name.toLowerCase());
            }
        });

        planCard.add(planName);
        planCard.add(priceContainer);
        planCard.add(description);
        planCard.add(featuresList);
        planCard.add(ctaButton);

        pricingGrid.add(planCard);
    });

    // Assemble pricing section
    container.add(header);
    container.add(pricingGrid);

    return container;
}

export { HomePricing };