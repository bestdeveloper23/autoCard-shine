import { UIPanel, UIText, UIButton, UIInput } from '/js/libs/ui.js';

function DashboardMainContent(onCreateProject, onSearch) {
  const container = new UIPanel();
  container.setClass('dashboard-main-content');

  const welcomeSection = new UIPanel();
  welcomeSection.setClass('welcome-section');

  // Helper function to get best user display name
  function getUserDisplayName(user) {
    if (!user) return 'User';
    
    // Priority: displayName (name) > email username > full email
    if (user.displayName && user.displayName.trim()) {
      return user.displayName.trim();
    }
    
    if (user.email) {
      // Extract username from email (part before @)
      const emailUsername = user.email.split('@')[0];
      if (emailUsername && emailUsername.trim()) {
        return emailUsername.trim();
      }
      
      // Fall back to full email
      return user.email;
    }
    
    return 'User';
  }

  const currentUser = window.router.getCurrentUser();
  const userDisplay = getUserDisplayName(currentUser);
  const welcomeTitle = new UIText(`Welcome back, ${userDisplay}!`);
  welcomeTitle.setClass('welcome-title');

  welcomeSection.add(welcomeTitle);

  const contentHeader = new UIPanel();
  contentHeader.setClass('content-header');

  const titleSection = new UIPanel();
  titleSection.setClass('title-section');

  const pageTitle = new UIText('All Projects'); 
  pageTitle.setClass('page-title');

  titleSection.add(pageTitle);

  const actionsSection = new UIPanel();
  actionsSection.setClass('actions-section');

  const searchContainer = new UIPanel();
  searchContainer.setClass('search-container');

  const searchIcon = new UIText('🔍');
  searchIcon.setClass('search-icon');

  const searchInput = new UIInput('');
  searchInput.setClass('search-input');
  searchInput.dom.placeholder = 'Search projects...';
  searchInput.dom.type = 'text';

  let searchTimeout;
  searchInput.dom.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      if (onSearch) {
        onSearch(e.target.value);
      }
    }, 300);
  });

  searchContainer.add(searchIcon);
  searchContainer.add(searchInput);

  const sortContainer = new UIPanel();
  sortContainer.setClass('sort-container');

  const sortLabel = new UIText('Sort by:');
  sortLabel.setClass('sort-label');

  const sortSelect = document.createElement('select');
  sortSelect.className = 'sort-select';
  
  const sortOptions = [
    { value: 'lastModified', label: 'Last Modified' },
    { value: 'name', label: 'Name' },
    { value: 'created', label: 'Date Created' }
  ];

  sortOptions.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.label;
    sortSelect.appendChild(optionElement);
  });

  const sortWrapper = new UIPanel();
  sortWrapper.dom.appendChild(sortSelect);

  sortContainer.add(sortLabel);
  sortContainer.add(sortWrapper);

  // Create project button
  const createBtn = new UIButton('+ Create New Project');
  createBtn.setClass('create-project-btn');
  createBtn.onClick(() => {
    if (onCreateProject) {
      onCreateProject();
    }
  });

  actionsSection.add(searchContainer);
  actionsSection.add(sortContainer);
  actionsSection.add(createBtn);

  contentHeader.add(titleSection);
  contentHeader.add(actionsSection);

  // Projects content area
  const projectsContent = new UIPanel();
  projectsContent.setClass('projects-content');
  projectsContent.setId('projects-content-area');

  // Loading indicator
  const loadingSection = new UIPanel();
  loadingSection.setClass('loading-section');

  const loadingText = new UIText('Loading projects...');
  loadingText.setClass('loading-text');

  loadingSection.add(loadingText);

  // Initially show loading
  projectsContent.add(loadingSection);

  // Assemble main content
  container.add(welcomeSection);
  container.add(contentHeader);
  container.add(projectsContent);

  // Public methods
  container.updatePageTitle = function(title) {
    pageTitle.setValue(title);
  };

  container.updateFilterInfo = function(filterText) {
  };

  container.updateUser = function(user) {
    const userDisplay = getUserDisplayName(user);
    welcomeTitle.setValue(`Welcome back, ${userDisplay}!`);
  };

  container.showLoading = function() {
    projectsContent.clear();
    projectsContent.add(loadingSection);
  };

  container.hideLoading = function() {
    const existingLoading = projectsContent.dom.querySelector('.loading-section');
    if (existingLoading) {
      existingLoading.remove();
    }
  };

  container.setProjectsContent = function(content) {
    projectsContent.clear();
    projectsContent.add(content);
  };

  container.getProjectsContainer = function() {
    return projectsContent;
  };

  container.clearSearch = function() {
    searchInput.setValue('');
  };

  container.getSortValue = function() {
    return sortSelect.value;
  };

  container.setSortValue = function(value) {
    sortSelect.value = value;
  };

  // Add sort change listener
  sortSelect.addEventListener('change', (e) => {
    // Trigger search/filter update with current search term
    if (onSearch) {
      onSearch(searchInput.getValue(), e.target.value);
    }
  });

  return container;
}

export { DashboardMainContent };