import { UIPanel, UIText } from '/js/libs/ui.js';

function HomeTestimonials() {
    const container = new UIPanel();
    container.setClass('home-testimonials');
    container.dom.id = 'testimonials';

    // Section header
    const header = new UIPanel();
    header.setClass('testimonials-header fade-in');

    const headerCode = new UIText('/* Testimonials */');
    headerCode.setClass('testimonials-code-comment');

    const headerTitle = new UIText('What Researchers Say');
    headerTitle.setClass('testimonials-title');

    header.add(headerCode);
    header.add(headerTitle);

    // Testimonials grid
    const testimonialsGrid = new UIPanel();
    testimonialsGrid.setClass('testimonials-grid');

    const testimonials = [
        {
            name: 'Dr. Sarah Chen',
            role: 'Senior Researcher, CERN',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=sarah&backgroundColor=b6e3f4`,
            quote: 'Shine has revolutionized how we prototype our detector designs. The real-time collaboration features are game-changing for our international team.',
            rating: 5
        },
        {
            name: 'Prof. James Miller',
            role: 'Physics Department, MIT',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=james&backgroundColor=d1d4f9`,
            quote: 'The intuitive interface makes it easy for students to learn particle physics simulation without getting bogged down by complex programming.',
            rating: 5
        },
        {
            name: 'Dr. Elena Rodriguez',
            role: 'Lead Scientist, DESY',
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=elena&backgroundColor=ffdfbf`,
            quote: 'Being able to quickly iterate on designs and share them with colleagues has significantly accelerated our research timeline.',
            rating: 5
        }
    ];

    testimonials.forEach(testimonial => {
        const card = new UIPanel();
        card.setClass('testimonial-card fade-in');

        // Profile section
        const profile = new UIPanel();
        profile.setClass('testimonial-profile');

        const avatar = new UIPanel();
        avatar.setClass('testimonial-avatar');
        avatar.dom.innerHTML = `<img src="${testimonial.image}" alt="${testimonial.name}" />`;

        const info = new UIPanel();
        info.setClass('testimonial-info');

        const name = new UIText(testimonial.name);
        name.setClass('testimonial-name');

        const role = new UIText(testimonial.role);
        role.setClass('testimonial-role');

        info.add(name);
        info.add(role);

        profile.add(avatar);
        profile.add(info);

        // Rating
        const rating = new UIPanel();
        rating.setClass('testimonial-rating');
        rating.dom.innerHTML = Array(testimonial.rating)
            .fill('★')
            .join('');

        // Quote
        const quote = new UIText(`"${testimonial.quote}"`);
        quote.setClass('testimonial-quote');

        // Assemble card
        card.add(profile);
        card.add(rating);
        card.add(quote);

        testimonialsGrid.add(card);
    });

    // Assemble testimonials section
    container.add(header);
    container.add(testimonialsGrid);

    return container;
}

export { HomeTestimonials };