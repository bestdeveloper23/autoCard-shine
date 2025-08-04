import { UIPanel, UIText, UIButton } from '/js/libs/ui.js';

function DashboardSidebar(editor, onNavigate) {
  const container = new UIPanel();
  container.setClass('dashboard-sidebar');

  // Sidebar header
  const header = new UIPanel();
  header.setClass('sidebar-header');
  
  const headerTitle = new UIText('PROJECTS');
  headerTitle.setClass('sidebar-header-title');
  header.add(headerTitle);

  // Navigation items
  const navigation = new UIPanel();
  navigation.setClass('sidebar-navigation');

  // Navigation options
  const navItems = [
    { key: 'all', label: 'All Projects', icon: '📁' },
    { key: 'yours', label: 'Your Projects', icon: '👤' },
    { key: 'shared', label: 'Shared with you', icon: '👥', disabled: true },
    { key: 'archived', label: 'Archived Projects', icon: '📦' },
    { key: 'trashed', label: 'Trashed Projects', icon: '🗑️' }
  ];

  let activeItem = 'all'; // Default active item

  navItems.forEach(item => {
    const navItem = new UIPanel();
    navItem.setClass('sidebar-nav-item');
    
    if (item.key === activeItem) {
      navItem.setClass('sidebar-nav-item active');
    }
    
    if (item.disabled) {
      navItem.setClass('sidebar-nav-item disabled');
    }

    const icon = new UIText(item.icon);
    icon.setClass('nav-icon');

    const label = new UIText(item.label);
    label.setClass('nav-label');

    navItem.add(icon);
    navItem.add(label);

    if (!item.disabled) {
      navItem.onClick(() => {
        // Remove active class from all items
        const allItems = navigation.dom.querySelectorAll('.sidebar-nav-item');
        allItems.forEach(el => el.classList.remove('active'));
        
        // Add active class to clicked item
        navItem.dom.classList.add('active');
        activeItem = item.key;
        
        // Notify parent component
        if (onNavigate) {
          onNavigate(item.key);
        }
      });
    }

    navigation.add(navItem);
  });

  // Future sections placeholder
  const futureSection = new UIPanel();
  futureSection.setClass('sidebar-future-section');

  // Add a divider
  const divider = new UIPanel();
  divider.setClass('sidebar-divider');

  // Placeholder for future features
  const comingSoon = new UIText('More features coming soon...');
  comingSoon.setClass('coming-soon-text');

  futureSection.add(divider);
//   futureSection.add(comingSoon);

  // Assemble sidebar
  container.add(header);
  container.add(navigation);
  container.add(futureSection);

  // Public methods
  container.setActiveItem = function(itemKey) {
    const allItems = navigation.dom.querySelectorAll('.sidebar-nav-item');
    allItems.forEach(el => el.classList.remove('active'));
    
    const targetItem = Array.from(allItems).find(el => 
      el.querySelector('.nav-label').textContent === navItems.find(item => item.key === itemKey)?.label
    );
    
    if (targetItem) {
      targetItem.classList.add('active');
      activeItem = itemKey;
    }
  };

  container.getActiveItem = function() {
    return activeItem;
  };

  return container;
}

export { DashboardSidebar };