import { UIPanel, UIText, UIButton } from '/js/libs/ui.js';
import { DashboardScenePreview } from './Dashboard.ScenePreview.js';

function DashboardProjectCard(projectId, project, actions, utils) {
  const card = new UIPanel();
  card.setClass('project-card');

  // Top actions bar (like second image)
  const topActionsBar = new UIPanel();
  topActionsBar.setClass('top-actions-bar');

  // Visibility info on the left
  const visibilityInfo = new UIPanel();
  visibilityInfo.setClass('visibility-info');
  
  const visibilityIcon = new UIText(project.isPublic ? '🌐' : '🔒');
  visibilityIcon.setClass('visibility-icon');
  
  const visibilityText = new UIText(project.isPublic ? 'Public' : 'Private');
  visibilityText.setClass('visibility-text');
  
  visibilityInfo.add(visibilityIcon);
  visibilityInfo.add(visibilityText);

  // Action buttons on the right (context-aware based on project status)
  const topActions = new UIPanel();
  topActions.setClass('top-actions');

  // Define action buttons based on project status
  let actionButtons = [];

  if (project.deleted) {
    // Deleted projects: Only restore and permanent delete
    actionButtons = [
      { key: 'restore', icon: '↩️', title: 'Restore' },
      { key: 'permanentDelete', icon: '🗑️', title: 'Delete Permanently' }
    ];
  } else if (project.archived) {
    // Archived projects: Restore, delete, edit name, download
    actionButtons = [
      { key: 'restore', icon: '↩️', title: 'Restore' },
      { key: 'rename', icon: '✏️', title: 'Rename' },
      { key: 'download', icon: '📥', title: 'Download' },
      { key: 'delete', icon: '🗑️', title: 'Delete' }
    ];
  } else {
    // Normal projects: All actions
    actionButtons = [
      { key: 'rename', icon: '✏️', title: 'Rename' },
      { key: 'copy', icon: '📋', title: 'Duplicate' },
      { key: 'download', icon: '📥', title: 'Download' },
      { key: 'archive', icon: '📦', title: 'Archive' },
      { key: 'delete', icon: '🗑️', title: 'Delete' }
    ];
  }

  actionButtons.forEach(actionBtn => {
    const btn = new UIButton('');
    btn.setClass('top-action-btn');
    btn.dom.innerHTML = actionBtn.icon;
    
    // Create custom tooltip with JavaScript for instant control
    const tooltipText = actionBtn.title;
    let tooltip = null;
    
    btn.dom.addEventListener('mouseenter', () => {
      // Remove any existing tooltip
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
      
      // Create new tooltip immediately and append to body
      tooltip = document.createElement('div');
      tooltip.className = 'project-tooltip';
      tooltip.textContent = tooltipText;
      tooltip.style.position = 'fixed';
      tooltip.style.zIndex = '10000';
      
      // Position tooltip relative to button
      const rect = btn.dom.getBoundingClientRect();
      tooltip.style.left = (rect.left + rect.width / 2) + 'px';
      tooltip.style.top = (rect.bottom + 8) + 'px';
      tooltip.style.transform = 'translateX(-50%)';
      
      document.body.appendChild(tooltip);
    });
    
    btn.dom.addEventListener('mouseleave', () => {
      // Remove tooltip when mouse leaves
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }
    });

    btn.onClick((e) => {
      e.stopPropagation();
      // Remove tooltip on click
      if (tooltip) {
        tooltip.remove();
        tooltip = null;
      }

      // Handle the action based on the button key
      if (actions) {
        switch (actionBtn.key) {
          case 'restore':
            if (actions.restore) {
              actions.restore(projectId, project);
            }
            break;
          case 'permanentDelete':
            if (actions.permanentDelete) {
              actions.permanentDelete(projectId, project);
            }
            break;
          default:
            if (actions[actionBtn.key]) {
              actions[actionBtn.key](projectId, project);
            }
            break;
        }
      }
    });

    topActions.add(btn);
  });

  topActionsBar.add(visibilityInfo);
  topActionsBar.add(topActions);

  // Project thumbnail/preview area
  const thumbnail = new UIPanel();
  thumbnail.setClass('project-thumbnail');

  // Add a 3D scene preview (UPDATED VERSION)
  const scenePreview = new UIPanel();
  scenePreview.setClass('scene-preview');
  
  // Create canvas for 3D rendering
  const previewCanvas = document.createElement('canvas');
  previewCanvas.className = 'scene-canvas';
  scenePreview.dom.appendChild(previewCanvas);
  
  // Add fallback text for when 3D preview fails
  const fallbackText = new UIText('No preview');
  fallbackText.setClass('no-preview-text');
  fallbackText.dom.style.display = 'none'; // Hidden by default
  scenePreview.add(fallbackText);
  
  // Add object count badge (SAME AS ORIGINAL)
  const objectCount = utils.getObjectCount(project.data);
  const objectCountBadge = new UIText(`${objectCount} objects`);
  objectCountBadge.setClass('object-count-badge');
  
  scenePreview.add(objectCountBadge);
  thumbnail.add(scenePreview);

  // Generate 3D preview with debouncing to prevent excessive calls
  let isGenerating = false;
  function generate3DPreview() {
    // Prevent multiple simultaneous generations
    if (isGenerating) return;
    
    isGenerating = true;
    try {
      const success = DashboardScenePreview.generatePreview(previewCanvas, project.data);
      
      if (success) {
        // Show canvas, hide fallback
        previewCanvas.style.display = 'block';
        fallbackText.dom.style.display = 'none';
      } else {
        // Show fallback, hide canvas
        previewCanvas.style.display = 'none';
        fallbackText.dom.style.display = 'flex';
      }
    } catch (error) {
      // Show fallback on error
      previewCanvas.style.display = 'none';
      fallbackText.dom.style.display = 'flex';
    } finally {
      isGenerating = false;
    }
  }

  // Generate preview when card is created
  setTimeout(() => generate3DPreview(), 100);

  // Project info section (bottom)
  const info = new UIPanel();
  info.setClass('project-info');

  // Project title
  const title = new UIText(project.name || 'Untitled Project');
  title.setClass('project-title');

  // Project metadata
  const metadata = new UIPanel();
  metadata.setClass('project-metadata');

  // Owner info
  const ownerInfo = new UIPanel();
  ownerInfo.setClass('project-owner');
  
  const ownerIcon = new UIText('👤');
  ownerIcon.setClass('owner-icon');
  
  const ownerText = new UIText(project.ownerName || 'Unknown User');
  ownerText.setClass('owner-text');
  
  ownerInfo.add(ownerIcon);
  ownerInfo.add(ownerText);

  // Date information
  const dateInfo = new UIPanel();
  dateInfo.setClass('project-dates');

  const createdDate = new Date(project.createdAt);
  const modifiedDate = new Date(project.lastModified || project.createdAt);

  const updated = new UIText(`Updated: ${utils.formatDate(modifiedDate)}`);
  updated.setClass('date-updated');

  const created = new UIText(`Created: ${utils.formatDate(createdDate)}`);
  created.setClass('date-created');

  dateInfo.add(updated);
  dateInfo.add(created);

  metadata.add(ownerInfo);
  metadata.add(dateInfo);

  info.add(title);
  info.add(metadata);

  // Assemble card
  card.add(topActionsBar);
  card.add(thumbnail);
  card.add(info);

  // Card click handler (open project) - but not on action buttons
  // Only allow opening if project is not deleted
  card.onClick((e) => {
    // Don't open if clicking on action buttons
    if (e.target.closest('.top-action-btn')) {
      return;
    }
    
    // Don't open deleted projects
    if (project.deleted) {
      return;
    }
    
    if (actions && actions.open) {
      actions.open(projectId, project);
    }
  });

  // Public methods (SAME AS ORIGINAL)
  card.updateProject = function(updatedProject) {
    title.setValue(updatedProject.name || 'Untitled Project');
    
    const newModifiedDate = new Date(updatedProject.lastModified || updatedProject.createdAt);
    updated.setValue(`Updated: ${utils.formatDate(newModifiedDate)}`);
    
    const newCreatedDate = new Date(updatedProject.createdAt);
    created.setValue(`Created: ${utils.formatDate(newCreatedDate)}`);
    
    const newObjectCount = utils.getObjectCount(updatedProject.data);
    objectCountBadge.setValue(`${newObjectCount} objects`);
    
    // Update visibility info
    visibilityIcon.setValue(updatedProject.isPublic ? '🌐' : '🔒');
    visibilityText.setValue(updatedProject.isPublic ? 'Public' : 'Private');
    
    // Update owner
    ownerText.setValue(updatedProject.ownerName || 'Unknown User');
    
    // Regenerate preview if project data changed
    if (JSON.stringify(updatedProject.data) !== JSON.stringify(project.data)) {
      project = updatedProject;
      setTimeout(() => generate3DPreview(), 100);
    }
  };

  // Method to manually regenerate preview
  card.regeneratePreview = function() {
    setTimeout(() => generate3DPreview(), 100);
  };

  return card;
}

export { DashboardProjectCard };