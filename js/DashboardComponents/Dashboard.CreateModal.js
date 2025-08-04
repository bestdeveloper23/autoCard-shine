import { UIPanel, UIText, UIButton, UIInput } from '/js/libs/ui.js';

function DashboardCreateModal(onClose, onCreate) {
  const overlay = new UIPanel();
  overlay.setClass('modal-overlay');

  const modal = new UIPanel();
  modal.setClass('create-modal');

  const header = new UIPanel();
  header.setClass('modal-header');

  const title = new UIText('Create New Project');
  title.setClass('modal-title');

  const closeBtn = new UIButton('×');
  closeBtn.setClass('modal-close');
  closeBtn.onClick(() => {
    if (onClose) onClose();
  });

  header.add(title);
  header.add(closeBtn);

  const body = new UIPanel();
  body.setClass('modal-body');

  const typeSection = new UIPanel();
  typeSection.setClass('modal-section');

  const typeLabel = new UIText('Project Type');
  typeLabel.setClass('section-label');

  const typeOptions = new UIPanel();
  typeOptions.setClass('type-options');

  const blankOption = new UIPanel();
  blankOption.setClass('type-option active');
  blankOption.setId('blank-option');

  const blankIcon = new UIText('📄');
  blankIcon.setClass('option-icon');

  const blankLabel = new UIText('Blank Project');
  blankLabel.setClass('option-label');

  const blankDesc = new UIText('Start from scratch with an empty project');
  blankDesc.setClass('option-description');

  blankOption.add(blankIcon);
  blankOption.add(blankLabel);
  blankOption.add(blankDesc);

  const uploadOption = new UIPanel();
  uploadOption.setClass('type-option');
  uploadOption.setId('upload-option');

  const uploadIcon = new UIText('📤');
  uploadIcon.setClass('option-icon');

  const uploadLabel = new UIText('Upload Project');
  uploadLabel.setClass('option-label');

  const uploadDesc = new UIText('Import an existing project file');
  uploadDesc.setClass('option-description');

  uploadOption.add(uploadIcon);
  uploadOption.add(uploadLabel);
  uploadOption.add(uploadDesc);

  let selectedType = 'blank';

  blankOption.onClick(() => {
    blankOption.setClass('type-option active');
    uploadOption.setClass('type-option');
    selectedType = 'blank';
    updateTypeUI();
  });

  uploadOption.onClick(() => {
    uploadOption.setClass('type-option active');
    blankOption.setClass('type-option');
    selectedType = 'upload';
    updateTypeUI();
  });

  typeOptions.add(blankOption);
  typeOptions.add(uploadOption);

  typeSection.add(typeLabel);
  typeSection.add(typeOptions);

  const nameSection = new UIPanel();
  nameSection.setClass('modal-section');

  const nameLabel = new UIText('Project Name');
  nameLabel.setClass('section-label');

  const nameInput = new UIInput('');
  nameInput.setClass('project-name-input');
  nameInput.dom.placeholder = 'New Project';

  nameSection.add(nameLabel);
  nameSection.add(nameInput);

  const publicSection = new UIPanel();
  publicSection.setClass('modal-section');

  const publicLabel = new UIText('Make it Private');
  publicLabel.setClass('section-label');

  const toggleContainer = new UIPanel();
  toggleContainer.setClass('toggle-container');

  const toggle = new UIPanel();
  toggle.setClass('toggle-switch');

  const toggleSlider = new UIPanel();
  toggleSlider.setClass('toggle-slider');

  const toggleLabel = new UIText('Private');
  toggleLabel.setClass('toggle-label');

  let isPublic = false;

  toggle.onClick(() => {
    isPublic = !isPublic;
    if (isPublic) {
      toggle.setClass('toggle-switch active');
      toggleLabel.setValue('Public');
    } else {
      toggle.setClass('toggle-switch');
      toggleLabel.setValue('Private');
    }
  });

  toggle.add(toggleSlider);
  toggleContainer.add(toggle);
  toggleContainer.add(toggleLabel);

  publicSection.add(publicLabel);
  publicSection.add(toggleContainer);

  const fileSection = new UIPanel();
  fileSection.setClass('modal-section file-section');
  fileSection.dom.style.display = 'none';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.className = 'file-input';
  fileInput.style.display = 'none';

  const fileUploadContainer = new UIPanel();
  fileUploadContainer.setClass('file-upload-container');

  const fileInputButton = new UIButton('Choose File');
  fileInputButton.setClass('file-input-button');
  fileInputButton.onClick(() => {
    fileInput.click();
  });

  const fileSelectedText = new UIText('');
  fileSelectedText.setClass('file-selected-text');
  fileSelectedText.dom.style.display = 'none';

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      fileSelectedText.setValue(e.target.files[0].name);
      fileSelectedText.dom.style.display = 'inline-block';
    } else {
      fileSelectedText.setValue('');
      fileSelectedText.dom.style.display = 'none';
    }
  });

  body.dom.appendChild(fileInput);

  fileUploadContainer.add(fileInputButton);
  fileUploadContainer.add(fileSelectedText);

  fileSection.add(fileUploadContainer);

  body.add(typeSection);
  body.add(nameSection);
  body.add(publicSection);
  body.add(fileSection);

  const footer = new UIPanel();
  footer.setClass('modal-footer');

  const cancelBtn = new UIButton('Cancel');
  cancelBtn.setClass('modal-button cancel-button');
  cancelBtn.onClick(() => {
    if (onClose) onClose();
  });

  const createBtn = new UIButton('Create Project');
  createBtn.setClass('modal-button create-button');
  createBtn.onClick(() => {
    const projectName = nameInput.getValue().trim();

    if (!projectName) {
      alert('Please enter a project name');
      return;
    }

    if (selectedType === 'upload' && !fileInput.files[0]) {
      alert('Please select a file to upload');
      return;
    }

    const projectData = {
      name: projectName,
      type: selectedType,
      isPublic: isPublic,
      file: selectedType === 'upload' ? fileInput.files[0] : null
    };

    if (onCreate) onCreate(projectData);
  });

  footer.add(cancelBtn);
  footer.add(createBtn);

  const updateTypeUI = () => {
    if (selectedType === 'upload') {
      fileSection.dom.style.display = 'block';
      createBtn.setValue('Upload Project');
    } else {
      fileSection.dom.style.display = 'none';
      createBtn.setValue('Create Project');
      fileInput.value = '';
      fileSelectedText.setValue('');
      fileSelectedText.dom.style.display = 'none';
    }
  };

  modal.add(header);
  modal.add(body);
  modal.add(footer);
  overlay.add(modal);

  overlay.onClick((e) => {
    if (e.target === overlay.dom) {
      if (onClose) onClose();
    }
  });

  return overlay;
}

export { DashboardCreateModal };
