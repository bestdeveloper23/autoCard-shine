function DashboardUtils() {
  
    // Format date for display
    function formatDate(date) {
      if (!date) return 'Unknown';
      
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        return 'Today';
      } else if (diffDays === 2) {
        return 'Yesterday';
      } else if (diffDays <= 7) {
        return `${diffDays - 1} days ago`;
      } else {
        return date.toLocaleDateString();
      }
    }
  
    // Get object count from project data (robust version)
    function getObjectCount(projectData) {
      if (!projectData) {
        return 0;
      }
  
      function countObjects(obj) {
        if (!obj) return 0;
        
        let count = 0;
        
        // Count current object if it's not the Scene container
        if (obj.type && obj.type !== 'Scene') {
          count = 1;
        }
        
        // Recursively count children
        if (obj.children && Array.isArray(obj.children)) {
          obj.children.forEach(child => {
            count += countObjects(child);
          });
        }
        
        return count;
      }
  
      // Try new structure first (editor-saved projects): projectData.scene.object.children
      if (projectData.scene?.object?.children) {
        return countObjects(projectData.scene.object);
      }
      
      // Fall back to simple structure (dashboard-created projects): projectData.object.children
      if (projectData.object?.children) {
        return countObjects(projectData.object);
      }
      
      // Additional fallback: check if there's a direct scene property with children
      if (projectData.scene?.children) {
        return countObjects(projectData.scene);
      }
      
      return 0;
    }
  
    // Generate UUID for new projects
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  
    // Filter projects based on category
    function filterProjects(projects, category, currentUserId) {
      const projectsArray = Object.entries(projects).map(([id, project]) => ({
        id,
        ...project
      }));
  
      switch (category) {
        case 'all':
          return projectsArray.filter(project => 
            !project.archived && !project.deleted && 
            (project.isPublic || project.owner === currentUserId)
          );
        
        case 'yours':
          return projectsArray.filter(project => 
            project.owner === currentUserId && 
            !project.archived && !project.deleted
          );
        
        case 'shared':
          // Future implementation for shared projects
          return projectsArray.filter(project => 
            project.owner !== currentUserId && 
            project.isPublic && 
            !project.archived && !project.deleted
          );
        
        case 'archived':
          return projectsArray.filter(project => 
            project.owner === currentUserId && 
            project.archived && !project.deleted
          );
        
        case 'trashed':
          return projectsArray.filter(project => 
            project.owner === currentUserId && 
            project.deleted
          );
        
        default:
          return projectsArray;
      }
    }
  
    // Sort projects by various criteria
    function sortProjects(projects, sortBy = 'lastModified') {
      const sorted = [...projects];
      
      switch (sortBy) {
        case 'name':
          return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        
        case 'created':
          return sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        
        case 'lastModified':
        default:
          return sorted.sort((a, b) => 
            (b.lastModified || b.createdAt || 0) - (a.lastModified || a.createdAt || 0)
          );
      }
    }
  
    // Search projects by name
    function searchProjects(projects, searchTerm) {
      if (!searchTerm.trim()) {
        return projects;
      }
      
      const term = searchTerm.toLowerCase();
      return projects.filter(project => 
        (project.name || '').toLowerCase().includes(term)
      );
    }
  
    // Validate project name
    function validateProjectName(name) {
      if (!name || !name.trim()) {
        return { valid: false, error: 'Project name is required' };
      }
      
      if (name.length > 100) {
        return { valid: false, error: 'Project name is too long (max 100 characters)' };
      }
      
      // Check for invalid characters
      const invalidChars = /[<>:"/\\|?*]/;
      if (invalidChars.test(name)) {
        return { valid: false, error: 'Project name contains invalid characters' };
      }
      
      return { valid: true };
    }
  
    // Format file size
    function formatFileSize(bytes) {
      if (!bytes) return '0 B';
      
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
  
    // Get project status display text
    function getProjectStatus(project) {
      if (project.deleted) return 'Deleted';
      if (project.archived) return 'Archived';
      if (project.isPublic) return 'Public';
      return 'Private';
    }
  
    // Public API
    return {
      formatDate,
      getObjectCount,
      generateUUID,
      filterProjects,
      sortProjects,
      searchProjects,
      validateProjectName,
      formatFileSize,
      getProjectStatus
    };
  }
  
  export { DashboardUtils };