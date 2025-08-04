import { UIPanel, UIText } from '/js/libs/ui.js';
import { createIcon } from './Home.Utils.js';
import collaborationImg from '../../images/features/collaboration.jpg';
import dragDropImg from '../../images/features/zero_coding.gif';
import prebuiltGeometriesImg from '../../images/features/prebuilt-geometries.png';
import cloudStorageImg from '../../images/features/cloud_storage.gif';


function HomeFeatures() {
    const container = new UIPanel();
    container.setClass('home-features');
    container.dom.id = 'features';

    // Header section
    const header = new UIPanel();
    header.setClass('features-header fade-in');

    const headerCode = new UIText('/* Features */');
    headerCode.setClass('features-code-comment');

    const headerTitle = new UIText('Why Choose Shine?');
    headerTitle.setClass('features-title');

    header.add(headerCode);
    header.add(headerTitle);

    // Features container
    const featuresContainer = new UIPanel();
    featuresContainer.setClass('features-container');

    const features = [
        {
            icon: 'ri-team-line',
            title: 'Real-time Collaboration',
            description: 'Work together seamlessly with your team in real-time.',
            image: collaborationImg,
            list: [
                'Simultaneous multi-user editing',
                'Live preview of changes',
                'Built-in chat and commenting',
                'Version history tracking'
            ]
        },
        {
            icon: 'ri-drag-drop-line',
            title: 'Zero Coding Required',
            description: 'Focus on physics, not programming.',
            image: dragDropImg,
            list: [
                'Drag-and-drop interface',
                'Visual parameter controls',
                'Interactive 3D preview',
                'Auto-generated configuration'
            ]
        },
        {
            icon: 'ri-stack-line',
            title: 'Prebuilt Geometries',
            description: 'Start with proven configurations.',
            image: prebuiltGeometriesImg,
            list: [
                'Extensive geometry library',
                'Customizable templates',
                'One-click importing',
                'Community contributions'
            ]
        },
        {
            icon: 'ri-cloud-line',
            title: 'Cloud Storage',
            description: 'Your work, everywhere you go.',
            image: cloudStorageImg,
            list: [
                'Automatic saves & backups',
                'CSecure data encryption',
                'Cross-device sync',
                'Unlimited storage space'
            ]
        }
    ];

    features.forEach((feature, index) => {
        const featureRow = new UIPanel();
        featureRow.setClass('feature-row fade-in');

        // Media column
        const mediaCol = new UIPanel();
        mediaCol.setClass('feature-media-col');

        const mediaWrapper = new UIPanel();
        mediaWrapper.setClass('media-wrapper');

        if (feature.image) {
            const fileExtension = feature.image.split('.').pop().toLowerCase();

            if (fileExtension === 'gif') {
                // Handle GIF files
                const gif = document.createElement('img');
                gif.src = feature.image;
                gif.alt = `${feature.title} Demo`;
                gif.className = 'feature-media animated';
                mediaWrapper.dom.appendChild(gif);
            } else if (['mp4', 'webm'].includes(fileExtension)) {
                // Handle video files
                const video = document.createElement('video');
                video.className = 'feature-media';
                video.autoplay = true;
                video.loop = true;
                video.muted = true;
                video.playsInline = true;

                const source = document.createElement('source');
                source.src = feature.image;
                source.type = `video/${fileExtension}`;

                video.appendChild(source);
                mediaWrapper.dom.appendChild(video);
            } else {
                // Handle static images (jpg, png, etc)
                const img = document.createElement('img');
                img.src = feature.image;
                img.alt = `${feature.title} Demo`;
                img.className = 'feature-media';
                mediaWrapper.dom.appendChild(img);
            }
        }

        mediaCol.add(mediaWrapper);

        // Content column
        const contentCol = new UIPanel();
        contentCol.setClass('feature-content-col');

        const content = new UIPanel();
        content.setClass('feature-content');

        // Feature icon
        const icon = new UIPanel();
        icon.setClass('feature-icon');
        icon.dom.appendChild(createIcon(feature.icon));

        // Create a wrapper for title and description to ensure vertical layout
        const textContent = new UIPanel();
        textContent.setClass('feature-text-content');


        // Title and description
        const title = new UIText(feature.title);
        title.setClass('feature-title');

        const description = new UIText(feature.description);
        description.setClass('feature-description');

        // Feature list
        const list = new UIPanel();
        list.setClass('feature-list');

        feature.list.forEach(item => {
            const listItem = new UIPanel();
            listItem.setClass('feature-list-item');

            const itemIcon = new UIPanel();
            itemIcon.setClass('list-icon');
            itemIcon.dom.innerHTML = '<i class="fas fa-check-circle"></i>'; // Font Awesome icon


            const itemText = new UIText(item);
            itemText.setClass('list-text');

            listItem.add(itemIcon);
            listItem.add(itemText);
            list.add(listItem);
        });


        textContent.add(title);
        textContent.add(description);

        content.add(icon);
        content.add(textContent);
        content.add(list);

        contentCol.add(content);

        featureRow.add(contentCol);
        featureRow.add(mediaCol);

        featuresContainer.add(featureRow);
    });

    container.add(header);
    container.add(featuresContainer);

    return container;
}

export { HomeFeatures };