import { UIPanel, UIText, UIButton, UIInput, UISelect } from '/js/libs/ui.js';

// Share Modal Component for Project Sharing
export class DashboardShareModal {
  
  static showShareModal(projectId, project, onConfirm, onCancel) {
    const modal = this.createBaseModal();
    const content = this.createModalContent();
    
    // Header
    const header = this.createModalHeader('Share project', onCancel);
    
    // Body
    const body = new UIPanel();
    body.setClass('share-modal-body');
    
    // Current project info
    const projectInfo = new UIPanel();
    projectInfo.setClass('project-info-section');
    
    const projectTitle = new UIText(`Sharing: ${project.name}`);
    projectTitle.setClass('share-project-title');
    
    const projectVisibility = new UIText(project.isPublic ? 'Public Project' : 'Private Project');
    projectVisibility.setClass('share-project-visibility');
    
    projectInfo.add(projectTitle);
    projectInfo.add(projectVisibility);
    
    // Share with user section
    const shareSection = new UIPanel();
    shareSection.setClass('share-section');
    
    const shareLabel = new UIText('Share with user');
    shareLabel.setClass('share-label');
    
    const emailInput = new UIInput('');
    emailInput.setClass('share-email-input');
    emailInput.dom.placeholder = 'Enter user email address';
    emailInput.dom.type = 'email';
    
    // Permission selector
    const permissionContainer = new UIPanel();
    permissionContainer.setClass('permission-container');
    
    const permissionLabel = new UIText('Permission');
    permissionLabel.setClass('permission-label');
    
    const permissionSelect = document.createElement('select');
    permissionSelect.className = 'permission-select';
    
    const permissions = [
      { value: 'read', label: 'Read Only - Can view and fork' },
      { value: 'write', label: 'Read/Write - Can view and edit' }
    ];
    
    permissions.forEach(perm => {
      const option = document.createElement('option');
      option.value = perm.value;
      option.textContent = perm.label;
      permissionSelect.appendChild(option);
    });
    
    const selectWrapper = new UIPanel();
    selectWrapper.dom.appendChild(permissionSelect);
    
    permissionContainer.add(permissionLabel);
    permissionContainer.add(selectWrapper);
    
    shareSection.add(shareLabel);
    shareSection.add(emailInput);
    shareSection.add(permissionContainer);
    
    // Current shares section
    const currentSharesSection = new UIPanel();
    currentSharesSection.setClass('current-shares-section');
    
    const currentSharesTitle = new UIText('Current Shares');
    currentSharesTitle.setClass('current-shares-title');
    
    const sharesList = new UIPanel();
    sharesList.setClass('shares-list');
    sharesList.setId('shares-list');
    
    currentSharesSection.add(currentSharesTitle);
    currentSharesSection.add(sharesList);
    
    // Load existing shares
    this.loadExistingShares(projectId, sharesList);
    
    // Error container
    const errorContainer = new UIPanel();
    errorContainer.setClass('share-error-container');
    errorContainer.setId('share-error-container');
    
    body.add(projectInfo);
    body.add(shareSection);
    body.add(errorContainer);
    body.add(currentSharesSection);
    
    // Footer
    const footer = this.createModalFooter([
      { text: 'Cancel', style: 'cancel', onClick: onCancel },
      { text: 'Share', style: 'confirm', onClick: () => {
        const email = emailInput.getValue().trim();
        const permission = permissionSelect.value;
        
        if (!email) {
          this.showError(errorContainer, 'Please enter an email address');
          return;
        }
        
        if (!this.validateEmail(email)) {
          this.showError(errorContainer, 'Please enter a valid email address');
          return;
        }
        
        onConfirm(email, permission);
      }}
    ]);
    
    content.add(header);
    content.add(body);
    content.add(footer);
    modal.add(content);
    
    document.body.appendChild(modal.dom);
    emailInput.dom.focus();
    
    return modal;
  }
  
  static async loadExistingShares(projectId, sharesList) {
    try {
      const { ref, get, query, orderByChild, equalTo } = await import("https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js");
      
      // OPTIMIZED: Query single collection for this project's shares
      const sharesRef = ref(window.firebaseDB, 'projectShares');
      const projectSharesQuery = query(
        sharesRef,
        orderByChild('projectId'),
        equalTo(projectId)
      );
      const snapshot = await get(projectSharesQuery);
      
      sharesList.clear();
      
      if (snapshot.exists()) {
        const shares = snapshot.val();
        
        Object.entries(shares).forEach(([shareId, share]) => {
          const shareItem = this.createShareItem(shareId, share, projectId);
          sharesList.add(shareItem);
        });
      } else {
        const noShares = new UIText('No users shared with yet');
        noShares.setClass('no-shares-text');
        sharesList.add(noShares);
      }
    } catch (error) {
      console.error('Error loading shares:', error);
      const errorText = new UIText('Error loading current shares');
      errorText.setClass('shares-error-text');
      sharesList.add(errorText);
    }
  }
  
  static createShareItem(shareId, share, projectId) {
    const item = new UIPanel();
    item.setClass('share-item');
    
    const userInfo = new UIPanel();
    userInfo.setClass('share-user-info');
    
    const email = new UIText(share.userEmail);
    email.setClass('share-user-email');
    
    const permission = new UIText(share.permission === 'read' ? 'Read Only' : 'Read/Write');
    permission.setClass(`share-permission ${share.permission}`);
    
    const sharedDate = new UIText(`Shared ${this.formatDate(new Date(share.sharedAt))}`);
    sharedDate.setClass('share-date');
    
    userInfo.add(email);
    userInfo.add(permission);
    userInfo.add(sharedDate);
    
    const actions = new UIPanel();
    actions.setClass('share-item-actions');
    
    // Change permission button
    const changePermBtn = new UIButton('⚙️');
    changePermBtn.setClass('share-action-btn');
    changePermBtn.dom.title = 'Change Permission';
    changePermBtn.onClick((e) => {
      e.stopPropagation();
      this.showChangePermissionModal(shareId, share, projectId);
    });
    
    // Remove share button
    const removeBtn = new UIButton('🗑️');
    removeBtn.setClass('share-action-btn remove');
    removeBtn.dom.title = 'Remove Access';
    removeBtn.onClick((e) => {
      e.stopPropagation();
      this.removeShare(shareId, share.userEmail, projectId);
    });
    
    actions.add(changePermBtn);
    actions.add(removeBtn);
    
    item.add(userInfo);
    item.add(actions);
    
    return item;
  }
  
  static async removeShare(shareId, userEmail, projectId) {
    if (!confirm(`Remove sharing access for ${userEmail}?`)) {
      return;
    }
    
    try {
      const { ref, remove } = await import("https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js");
      
      // OPTIMIZED: Remove from single collection
      await remove(ref(window.firebaseDB, `projectShares/${shareId}`));
      
      // Reload the shares list
      const sharesList = document.getElementById('shares-list');
      if (sharesList) {
        const sharesListPanel = { 
          clear: () => sharesList.innerHTML = '',
          add: (item) => sharesList.appendChild(item.dom)
        };
        this.loadExistingShares(projectId, sharesListPanel);
      }
      
    } catch (error) {
      console.error('Error removing share:', error);
      alert('Failed to remove sharing access');
    }
  }
  
  static async showChangePermissionModal(shareId, share, projectId) {
    const newPermission = share.permission === 'read' ? 'write' : 'read';
    const permissionText = newPermission === 'read' ? 'Read Only' : 'Read/Write';
    
    if (!confirm(`Change ${share.userEmail}'s permission to ${permissionText}?`)) {
      return;
    }
    
    try {
      const { ref, update } = await import("https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js");
      
      // OPTIMIZED: Update single collection
      await update(ref(window.firebaseDB, `projectShares/${shareId}`), {
        permission: newPermission
      });
      
      // Reload the shares list
      const sharesList = document.getElementById('shares-list');
      if (sharesList) {
        const sharesListPanel = { 
          clear: () => sharesList.innerHTML = '',
          add: (item) => sharesList.appendChild(item.dom)
        };
        this.loadExistingShares(projectId, sharesListPanel);
      }
      
    } catch (error) {
      console.error('Error changing permission:', error);
      alert('Failed to change permission');
    }
  }
  
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static showError(errorContainer, message) {
    errorContainer.clear();
    const errorMsg = new UIText(message);
    errorMsg.setClass('share-error-message');
    errorContainer.add(errorMsg);
    
    // Clear error after 5 seconds
    setTimeout(() => {
      errorContainer.clear();
    }, 5000);
  }
  
  static formatDate(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'today';
    } else if (diffDays === 2) {
      return 'yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Base Modal Structure (reuse from existing modals)
  static createBaseModal() {
    const modal = new UIPanel();
    modal.setClass('action-modal-overlay share-modal-overlay');
    
    modal.onClick((e) => {
      if (e.target === modal.dom) {
        this.closeModal(modal);
      }
    });
    
    return modal;
  }
  
  static createModalContent() {
    const content = new UIPanel();
    content.setClass('action-modal-content share-modal-content');
    return content;
  }
  
  static createModalHeader(title, onClose) {
    const header = new UIPanel();
    header.setClass('action-modal-header');
    
    const titleText = new UIText(title);
    titleText.setClass('action-modal-title');
    
    const closeBtn = new UIButton('×');
    closeBtn.setClass('action-modal-close');
    closeBtn.onClick(onClose);
    
    header.add(titleText);
    header.add(closeBtn);
    
    return header;
  }
  
  static createModalFooter(buttons) {
    const footer = new UIPanel();
    footer.setClass('action-modal-footer');
    
    buttons.forEach(btnConfig => {
      const btn = new UIButton(btnConfig.text);
      btn.setClass(`action-modal-btn ${btnConfig.style}`);
      btn.onClick(btnConfig.onClick);
      footer.add(btn);
    });
    
    return footer;
  }
  
  static closeModal(modal) {
    if (modal && modal.dom && modal.dom.parentNode) {
      modal.dom.parentNode.removeChild(modal.dom);
    }
  }
}