import { UIPanel, UIText, UIButton } from '/js/libs/ui.js';

function DashboardProjectGrid() {
  const container = new UIPanel();
  container.setClass('projects-grid-container');

  // Grid header with stats
  const gridHeader = new UIPanel();
  gridHeader.setClass('grid-header');

  const projectCount = new UIText('0 projects');
  projectCount.setClass('project-count');

  const viewToggle = new UIPanel();
  viewToggle.setClass('view-toggle');

  // View mode buttons (grid/list - future feature)
  const gridViewBtn = new UIButton('⊞');
  gridViewBtn.setClass('view-btn active');
  gridViewBtn.dom.title = 'Grid View';

  const listViewBtn = new UIButton('☰');
  listViewBtn.setClass('view-btn');
  listViewBtn.dom.title = 'List View (Coming Soon)';

  viewToggle.add(gridViewBtn);
  viewToggle.add(listViewBtn);

  gridHeader.add(projectCount);
  gridHeader.add(viewToggle);

  // Projects grid
  const projectsGrid = new UIPanel();
  projectsGrid.setClass('projects-grid');

  // Empty state
  const emptyState = createEmptyState();

  container.add(gridHeader);
  container.add(projectsGrid);

  // Private methods
  function createEmptyState() {
    const emptyState = new UIPanel();
    emptyState.setClass('empty-state');

    const emptyTitle = new UIText('No projects found');
    emptyTitle.setClass('empty-title');

    const emptyDescription = new UIText('Showing 0 out of 0 Projects.');
    emptyDescription.setClass('empty-description');

    // emptyState.add(emptyTitle);
    emptyState.add(emptyDescription);

    return emptyState;
  }

  function createCreateFirstProjectState(onCreateProject) {
    const createState = new UIPanel();
    createState.setClass('empty-state create-first');

    const createTitle = new UIText('No projects yet');
    createTitle.setClass('empty-title');

    const createDescription = new UIText('Create your first 3D project to get started with Shine Editor');
    createDescription.setClass('empty-description');

    const createBtn = new UIButton('Create Your First Project');
    createBtn.setClass('empty-create-btn');
    createBtn.onClick(() => {
      if (onCreateProject) {
        onCreateProject();
      }
    });

    createState.add(createTitle);
    createState.add(createDescription);
    createState.add(createBtn);

    return createState;
  }

  // Public methods
  container.setProjects = function(projectCards, totalCount = 0, isFirstTime = false, onCreateProject = null) {
    // Update project count
    projectCount.setValue(totalCount === 1 ? '1 project' : `${totalCount} projects`);

    // Clear grid
    projectsGrid.clear();

    if (!projectCards || projectCards.length === 0) {
      if (isFirstTime && totalCount === 0) {
        // Show "create first project" state
        projectsGrid.add(createCreateFirstProjectState(onCreateProject));
      } else {
        // Show empty search results state
        projectsGrid.add(emptyState);
      }
    } else {
      // Add project cards
      projectCards.forEach(card => {
        projectsGrid.add(card);
      });
    }
  };

  container.addProject = function(projectCard) {
    // Remove empty state if present
    const emptyStateElement = projectsGrid.dom.querySelector('.empty-state');
    if (emptyStateElement) {
      emptyStateElement.remove();
    }

    projectsGrid.add(projectCard);
    
    // Update count
    const currentCards = projectsGrid.dom.querySelectorAll('.project-card');
    const count = currentCards.length;
    projectCount.setValue(count === 1 ? '1 project' : `${count} projects`);
  };

  container.removeProject = function(projectId) {
    const projectCards = projectsGrid.dom.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      // Assuming project ID is stored as data attribute or similar
      if (card.dataset.projectId === projectId) {
        card.remove();
      }
    });

    // Update count
    const remainingCards = projectsGrid.dom.querySelectorAll('.project-card');
    const count = remainingCards.length;
    projectCount.setValue(count === 1 ? '1 project' : `${count} projects`);

    // Show empty state if no projects
    if (count === 0) {
      projectsGrid.add(emptyState);
    }
  };

  container.updateProject = function(projectId, updatedCard) {
    const projectCards = projectsGrid.dom.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
      if (card.dataset.projectId === projectId) {
        // Replace the card
        card.parentNode.replaceChild(updatedCard.dom, card);
      }
    });
  };

  container.clear = function() {
    projectsGrid.clear();
    projectCount.setValue('0 projects');
  };

  container.showLoading = function() {
    projectsGrid.clear();
    
    const loadingState = new UIPanel();
    loadingState.setClass('loading-state');

    const loadingIcon = new UIText('⏳');
    loadingIcon.setClass('loading-icon');

    const loadingText = new UIText('Loading projects...');
    loadingText.setClass('loading-text');

    loadingState.add(loadingIcon);
    loadingState.add(loadingText);

    projectsGrid.add(loadingState);
  };

  container.getProjectCount = function() {
    return projectsGrid.dom.querySelectorAll('.project-card').length;
  };

  container.setViewMode = function(mode) {
    if (mode === 'grid') {
      gridViewBtn.setClass('view-btn active');
      listViewBtn.setClass('view-btn');
      projectsGrid.setClass('projects-grid');
    } else if (mode === 'list') {
      listViewBtn.setClass('view-btn active');
      gridViewBtn.setClass('view-btn');
      projectsGrid.setClass('projects-list');
    }
  };

  // View mode toggle handlers
  gridViewBtn.onClick(() => {
    container.setViewMode('grid');
  });

  listViewBtn.onClick(() => {
    // Future implementation
    console.log('List view coming soon!');
  });

  return container;
}

export { DashboardProjectGrid };