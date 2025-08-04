import { UIPanel, UIText, UIButton, UIInput } from '/js/libs/ui.js';

// Reusable Modal System for Dashboard Actions
export class DashboardActionModals {
  
  // Copy Project Modal
  static showCopyModal(projectName, onConfirm, onCancel) {
    const modal = this.createBaseModal();
    const content = this.createModalContent();
    
    // Header
    const header = this.createModalHeader('Copy project', onCancel);
    
    // Body
    const body = new UIPanel();
    body.setClass('action-modal-body');
    
    const label = new UIText('New Name');
    label.setClass('action-modal-label');
    
    const input = new UIInput(`${projectName} (Copy)`);
    input.setClass('action-modal-input');
    input.dom.placeholder = 'Enter new name';
    
    body.add(label);
    body.add(input);
    
    // Footer
    const footer = this.createModalFooter([
      { text: 'Cancel', style: 'cancel', onClick: onCancel },
      { text: 'Copy', style: 'confirm', onClick: () => {
        const newName = input.getValue().trim();
        if (newName) {
          onConfirm(newName);
        }
      }}
    ]);
    
    content.add(header);
    content.add(body);
    content.add(footer);
    modal.add(content);
    
    document.body.appendChild(modal.dom);
    input.dom.focus();
    input.dom.select();
    
    return modal;
  }
  
  // Rename Project Modal
  static showRenameModal(projectName, onConfirm, onCancel) {
    const modal = this.createBaseModal();
    const content = this.createModalContent();
    
    // Header
    const header = this.createModalHeader('Rename project', onCancel);
    
    // Body
    const body = new UIPanel();
    body.setClass('action-modal-body');
    
    const label = new UIText('New Name');
    label.setClass('action-modal-label');
    
    const input = new UIInput(projectName);
    input.setClass('action-modal-input');
    input.dom.placeholder = 'Enter project name';
    
    body.add(label);
    body.add(input);
    
    // Footer
    const footer = this.createModalFooter([
      { text: 'Cancel', style: 'cancel', onClick: onCancel },
      { text: 'Rename', style: 'confirm', onClick: () => {
        const newName = input.getValue().trim();
        if (newName && newName !== projectName) {
          onConfirm(newName);
        } else if (!newName) {
          // Show error
        } else {
          onCancel(); // Same name, just close
        }
      }}
    ]);
    
    content.add(header);
    content.add(body);
    content.add(footer);
    modal.add(content);
    
    document.body.appendChild(modal.dom);
    input.dom.focus();
    input.dom.select();
    
    return modal;
  }
  
  // Delete Project Modal
  static showDeleteModal(projectName, onConfirm, onCancel) {
    const modal = this.createBaseModal();
    const content = this.createModalContent();
    
    // Header
    const header = this.createModalHeader('Delete project', onCancel);
    
    // Body
    const body = new UIPanel();
    body.setClass('action-modal-body');
    
    const message = new UIText(`Are you sure you want to delete "${projectName}"?`);
    message.setClass('action-modal-message');
    
    const warning = new UIText('This will move the project to trash. You can restore it later.');
    warning.setClass('action-modal-warning');
    
    body.add(message);
    body.add(warning);
    
    // Footer
    const footer = this.createModalFooter([
      { text: 'Cancel', style: 'cancel', onClick: onCancel },
      { text: 'Delete', style: 'danger', onClick: onConfirm }
    ]);
    
    content.add(header);
    content.add(body);
    content.add(footer);
    modal.add(content);
    
    document.body.appendChild(modal.dom);
    
    return modal;
  }
  
  // Archive Project Modal
  static showArchiveModal(projectName, onConfirm, onCancel) {
    const modal = this.createBaseModal();
    const content = this.createModalContent();
    
    // Header
    const header = this.createModalHeader('Archive project', onCancel);
    
    // Body
    const body = new UIPanel();
    body.setClass('action-modal-body');
    
    const message = new UIText(`Are you sure you want to archive "${projectName}"?`);
    message.setClass('action-modal-message');
    
    const info = new UIText('Archived projects can be found in the Archived Projects section.');
    info.setClass('action-modal-info');
    
    body.add(message);
    body.add(info);
    
    // Footer
    const footer = this.createModalFooter([
      { text: 'Cancel', style: 'cancel', onClick: onCancel },
      { text: 'Archive', style: 'confirm', onClick: onConfirm }
    ]);
    
    content.add(header);
    content.add(body);
    content.add(footer);
    modal.add(content);
    
    document.body.appendChild(modal.dom);
    
    return modal;
  }
  
  // Base Modal Structure
  static createBaseModal() {
    const modal = new UIPanel();
    modal.setClass('action-modal-overlay');
    
    modal.onClick((e) => {
      if (e.target === modal.dom) {
        this.closeModal(modal);
      }
    });
    
    return modal;
  }
  
  static createModalContent() {
    const content = new UIPanel();
    content.setClass('action-modal-content');
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