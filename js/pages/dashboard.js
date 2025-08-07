import { UIPanel } from '/js/libs/ui.js';
import { signOut } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { ref, onValue, get, off } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Import dashboard components
import { DashboardHeader } from '/js/DashboardComponents/Dashboard.Header.js';
import { DashboardSidebar } from '/js/DashboardComponents/Dashboard.Sidebar.js';
import { DashboardMainContent } from '/js/DashboardComponents/Dashboard.MainContent.js';
import { DashboardProjectGrid } from '/js/DashboardComponents/Dashboard.ProjectGrid.js';
import { DashboardProjectCard } from '/js/DashboardComponents/Dashboard.ProjectCard.js';
import { DashboardCreateModal } from '/js/DashboardComponents/Dashboard.CreateModal.js';
import { DashboardActions } from '/js/DashboardComponents/Dashboard.Actions.js';
import { DashboardUtils } from '/js/DashboardComponents/Dashboard.Utils.js';

export class DashboardPage {
  constructor() {
    this.container = null;
    this.projects = {};
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.currentSearchTerm = '';
    this.currentSortBy = 'lastModified';
    this.isLoading = true;

    // Initialize components
    this.actions = DashboardActions();
    this.utils = DashboardUtils();
    this.components = {};

    // Add Firebase listener tracking
    this.firebaseListeners = [];
    this.projectsRef = null;
    
    this.projectCards = new Map();
  }

  async render() {
    const appContainer = document.getElementById('app');
    if (!appContainer) {
      return;
    }

    // Clear existing content
    appContainer.innerHTML = '';

    this.container = new UIPanel();
    this.container.setClass('dashboard-container');

    // Create header
    this.components.header = DashboardHeader(() => this.handleLogout());

    // Create sidebar with navigation callback
    this.components.sidebar = DashboardSidebar(null, (category) => this.handleNavigation(category));

    // Create main content with callbacks
    this.components.mainContent = DashboardMainContent(
      () => this.showCreateModal(),
      (searchTerm, sortBy) => this.handleSearch(searchTerm, sortBy)
    );

    // Create project grid
    this.components.projectGrid = DashboardProjectGrid();

    // Add components to container
    this.container.add(this.components.header);
    this.container.add(this.components.sidebar);
    this.container.add(this.components.mainContent);

    // Add project grid to main content
    this.components.mainContent.setProjectsContent(this.components.projectGrid);

    appContainer.appendChild(this.container.dom);

    // Load user projects
    await this.loadProjects();
  }

  async loadProjects() {
    const user = window.router.getCurrentUser();
    if (!user) {
      console.error('No user found');
      return;
    }

    try {
      this.projectsRef = ref(window.firebaseDB, `users/${user.uid}/projects`);

      // First load existing data
      const snapshot = await get(this.projectsRef);
      this.projects = snapshot.val() || {};
      this.isLoading = false;
      this.updateProjectsDisplay();

      // Then listen for changes - but store the unsubscribe function
      const unsubscribe = onValue(this.projectsRef, (snapshot) => {
        // Check if components still exist before trying to update
        if (this.components && this.components.mainContent) {
          this.projects = snapshot.val() || {};
          this.updateProjectsDisplay();
        }
      });

      this.firebaseListeners.push(unsubscribe);

    } catch (error) {
      this.isLoading = false;
      if (this.components && this.components.mainContent) {
        this.updateProjectsDisplay();
      }

      alert(`Database permission error. Please check your Firebase Database Rules.\n\nError: ${error.message}`);
    }
  }

  updateProjectsDisplay() {
    if (!this.components || !this.components.mainContent) {
      return;
    }

    // Filter and sort projects
    const user = window.router.getCurrentUser();
    this.filteredProjects = this.utils.filterProjects(this.projects, this.currentFilter, user?.uid);

    // console.log('Filtered projects details:', this.filteredProjects.map(p => ({
    //   id: p.id.substring(0, 8) + '...',
    //   name: p.name,
    //   archived: !!p.archived,
    //   deleted: !!p.deleted,
    //   owner: p.owner === user?.uid ? 'MINE' : 'OTHER'
    // })));

    this.filteredProjects = this.utils.searchProjects(this.filteredProjects, this.currentSearchTerm);
    this.filteredProjects = this.utils.sortProjects(this.filteredProjects, this.currentSortBy);

    // Update filter info
    const filterLabels = {
      'all': 'All Projects',
      'yours': 'Your Projects',
      'shared': 'Shared with you',
      'archived': 'Archived Projects',
      'trashed': 'Trashed Projects'
    };
    this.components.mainContent.updateFilterInfo(filterLabels[this.currentFilter] || 'Projects');

    // Create project cards
    const projectCards = this.filteredProjects.map(project => {
      return this.createProjectCard(project.id, project);
    });

    // Update grid
    const isFirstTime = Object.keys(this.projects).length === 0;
    this.components.projectGrid.setProjects(
      projectCards,
      this.filteredProjects.length,
      isFirstTime,
      () => this.showCreateModal()
    );
  }

  createProjectCard(projectId, project) {
    const actionHandlers = {
      open: (id, proj) => this.actions.openProject(id, proj),
      rename: (id, proj) => this.handleRenameProject(id, proj),
      copy: (id, proj) => this.handleCopyProject(id, proj),
      download: (id, proj) => this.actions.downloadProject(id, proj),
      archive: (id, proj) => this.handleArchiveProject(id, proj),
      delete: (id, proj) => this.handleDeleteProject(id, proj),
      restore: (id, proj) => this.handleRestoreProject(id, proj),
      permanentDelete: (id, proj) => this.handlePermanentDeleteProject(id, proj)
    };

    const existingCard = this.projectCards.get(projectId);
    if (existingCard && existingCard.destroy) {
      try {
        existingCard.destroy();
      } catch (error) {
        console.warn(`Error destroying card ${projectId}:`, error);
      }
    }

    const card = DashboardProjectCard(projectId, project, actionHandlers, this.utils);
    card.dom.dataset.projectId = projectId;
    
    this.projectCards.set(projectId, card);

    return card;
  }

  handleNavigation(category) {
    this.currentFilter = category;
    this.currentSearchTerm = '';

    // Clear search
    if (this.components && this.components.mainContent) {
      this.components.mainContent.clearSearch();
    }

    // Update projects display
    this.updateProjectsDisplay();

    // Update page title
    const titles = {
      'all': 'All Projects',
      'yours': 'Your Projects',
      'shared': 'Shared Projects',
      'archived': 'Archived Projects',
      'trashed': 'Trashed Projects'
    };
    if (this.components && this.components.mainContent) {
      this.components.mainContent.updatePageTitle(titles[category] || 'Projects');
    }
  }

  handleSearch(searchTerm, sortBy) {
    this.currentSearchTerm = searchTerm || '';
    this.currentSortBy = sortBy || this.currentSortBy;
    this.updateProjectsDisplay();
  }

  showCreateModal() {
    const modal = DashboardCreateModal(
      () => this.hideCreateModal(),
      (projectData) => this.handleCreateProject(projectData)
    );

    document.body.appendChild(modal.dom);
    this.currentModal = modal;
  }

  hideCreateModal() {
    if (this.currentModal && this.currentModal.dom.parentNode) {
      this.currentModal.dom.parentNode.removeChild(this.currentModal.dom);
      this.currentModal = null;
    }
  }

  async handleCreateProject(projectData) {
    try {
      this.hideCreateModal();

      // Show loading state
      if (this.components && this.components.projectGrid) {
        this.components.projectGrid.showLoading();
      }

      const result = await this.actions.createProject(projectData);

      // Navigate to editor with hash routing
      window.router.navigate(`/editor/${result.projectId}`);

    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project: ' + error.message);
      this.updateProjectsDisplay(); 
    }
  }

  async handleRenameProject(projectId, project) {
    try {
      const newName = await this.actions.renameProject(projectId, project);
      if (newName) {
      }
    } catch (error) {
      console.error('Error renaming project:', error);
      alert('Failed to rename project: ' + error.message);
    }
  }

  async handleCopyProject(projectId, project) {
    try {
      const result = await this.actions.copyProject(projectId, project);
      if (result) {
      }
    } catch (error) {
      console.error('Error copying project:', error);
      alert('Failed to copy project: ' + error.message);
    }
  }

  async handleArchiveProject(projectId, project) {
    try {
      const success = await this.actions.archiveProject(projectId, project);
      if (success) {
      }
    } catch (error) {
      console.error('Error archiving project:', error);
      alert('Failed to archive project: ' + error.message);
    }
  }

  async handleDeleteProject(projectId, project) {
    try {
      const success = await this.actions.deleteProject(projectId, project);
      if (success) {
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project: ' + error.message);
    }
  }

  async handleRestoreProject(projectId, project) {
    try {
      const success = await this.actions.restoreProject(projectId, project);
      if (success) {
      }
    } catch (error) {
      console.error('Error restoring project:', error);
      alert('Failed to restore project: ' + error.message);
    }
  }

  async handlePermanentDeleteProject(projectId, project) {
    try {
      const success = await this.actions.permanentDeleteProject(projectId, project);
      if (success) {
      }
    } catch (error) {
      console.error('Error permanently deleting project:', error);
      alert('Failed to permanently delete project: ' + error.message);
    }
  }

  async handleLogout() {
    if (!confirm('Are you sure you want to logout?')) {
      return;
    }

    try {
      await signOut(window.firebaseAuth);
      window.router.navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Failed to logout. Please try again.');
    }
  }

  // Public methods for external access
  refreshProjects() {
    this.updateProjectsDisplay();
  }

  setFilter(filter) {
    this.handleNavigation(filter);
  }

  searchProjects(term) {
    this.handleSearch(term);
  }

  destroy() {

    for (const [projectId, card] of this.projectCards.entries()) {
      if (card && card.destroy) {
        try {
          card.destroy();
        } catch (error) {
          console.warn(`Error destroying card ${projectId}:`, error);
        }
      }
    }
    this.projectCards.clear();

    this.firebaseListeners.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Error unsubscribing listener:', error);
      }
    });
    this.firebaseListeners = [];

    // Clear Firebase reference
    this.projectsRef = null;

    // Hide any open modals
    this.hideCreateModal();

    // Clean up container
    if (this.container && this.container.dom && this.container.dom.parentNode) {
      this.container.dom.parentNode.removeChild(this.container.dom);
    }

    // Clear references
    this.components = {};
    this.projects = {};
    this.filteredProjects = [];

  }
}