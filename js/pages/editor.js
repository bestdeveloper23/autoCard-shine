import * as THREE from 'three';
import { UIButton, UIInput, UIPanel, UIRow, UISelect, UIText, UITextArea, UINumber, UIDiv } from '/js/libs/ui.js';
import { Editor } from '/js/Editor.js';
import { Viewport } from '/js/Viewport.js';
import { Toolbar } from '/js/Toolbar.js';
import { Script } from '/js/Script.js';
import { Player } from '/js/Player.js';
import { Sidebar } from '/js/Sidebar.js';
import { Menubar } from '/js/Menubar.js';
import { Resizer } from '/js/Resizer.js';
import { LeftBarResizer } from "/js/LeftBarResizer.js";
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { SidebarLeft } from '/js/Sidebar.Left.js';
import { ref, get, set } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

export class EditorPage {
  constructor() {
    this.container = null;
    this.editor = null;
    this.projectId = null;
    this.projectName = null;
    this.autoSaveTimeout = null;
    this.onWindowResize = null;
    this.isDemo = false;
  }

  async render() {
    console.log('=== EDITOR PAGE RENDER START ===');
    console.log('Current URL:', window.location.href);
    console.log('Current hash:', window.location.hash);
  
    try {
      // Check if this is demo mode first
      const path = window.router.getCurrentPath();
      if (path === '/shine/demo') {
        console.log('Demo mode detected');
        this.isDemo = true;
        await this.initializeDemoEditor();
        return;
      }
  
      if (this.isDemo) {
        // Skip auth checks and project loading for demo
        await this.initializeDemoEditor();
        return;
      }
  
      // Get project ID from hash path
      const pathParts = path.split('/');
      console.log('Hash path parts:', pathParts);
  
      if (path.startsWith('/shine/editor/') && pathParts[3]) {
        this.projectId = pathParts[3];
        console.log('Editor URL detected, projectId:', this.projectId);
      } else {
        console.error('Invalid editor URL format');
        window.router.navigate('/shine/dashboard');
        return;
      }
  
      // Validate project ID format
      if (!this.projectId || this.projectId === 'undefined' || this.projectId === 'null') {
        console.error('Invalid project ID:', this.projectId);
        alert('Invalid project ID. Redirecting to dashboard.');
        window.router.navigate('/shine/dashboard');
        return;
      }
  
      // Wait for user authentication (with better error handling)
      const user = await this.waitForUser();
      if (!user) {
        console.error('No authenticated user found');
        window.router.navigate('/shine/auth');
        return;
      }
  
      // Validate project exists and get project info
      const isValid = await this.validateAndLoadProjectInfo(this.projectId);
      if (!isValid) {
        console.error('Project validation failed for ID:', this.projectId);
        alert('Project not found or access denied. Redirecting to dashboard.');
        window.router.navigate('/shine/dashboard');
        return;
      }
  
      console.log('Final project info:', { projectId: this.projectId, projectName: this.projectName });
  
      const appContainer = document.getElementById('app');
      if (!appContainer) {
        console.error('App container not found');
        throw new Error('App container not found');
      }
  
      // Clear existing content
      appContainer.innerHTML = '';
  
      // Create editor container
      this.container = new UIPanel();
      this.container.setClass('editor-container');
      this.container.setId('editor-root');
  
      appContainer.appendChild(this.container.dom);
  
      // Load dependencies and initialize Three.js editor
      await this.loadDependenciesAndInitialize();
  
      console.log('=== EDITOR PAGE RENDER COMPLETE ===');
  
    } catch (error) {
      console.error('=== EDITOR PAGE RENDER ERROR ===');
      console.error('Error:', error);
      console.error('Error stack:', error.stack);
  
      if (!this.isDemo) {
        window.router.navigate('/shine/dashboard');
      }
      // Clean up on error
      if (this.container && this.container.dom && this.container.dom.parentNode) {
        this.container.dom.parentNode.removeChild(this.container.dom);
      }
  
      alert('Failed to load editor. Redirecting to dashboard.');
      window.router.navigate('/shine/dashboard');
    }
  }

  async waitForUser(timeout = 5000) {
    console.log('Waiting for authenticated user...');

    // If we already have a user, return immediately
    if (window.router && window.router.getCurrentUser()) {
      console.log('User already available');
      return window.router.getCurrentUser();
    }

    // Wait for router and auth to be ready
    let attempts = 0;
    const maxAttempts = timeout / 100;

    return new Promise((resolve, reject) => {
      const checkForUser = () => {
        attempts++;

        if (window.router && window.router.getCurrentUser()) {
          console.log('User found:', window.router.getCurrentUser().email);
          resolve(window.router.getCurrentUser());
          return;
        }

        if (attempts >= maxAttempts) {
          console.error('Timeout waiting for user');
          reject(new Error('User timeout'));
          return;
        }

        setTimeout(checkForUser, 100);
      };

      checkForUser();
    });
  }

  async validateAndLoadProjectInfo(projectId) {
    const user = window.router.getCurrentUser();
    if (!user) {
      console.error('No user available for project validation');
      return false;
    }

    try {
      console.log('Validating project:', projectId);
      const projectRef = ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`);
      const snapshot = await get(projectRef);

      if (snapshot.exists()) {
        const projectData = snapshot.val();
        this.projectName = projectData.name || 'Untitled Project';
        console.log('Project validated successfully:', {
          id: projectId,
          name: this.projectName
        });
        return true;
      } else {
        console.error('Project does not exist:', projectId);
        return false;
      }
    } catch (error) {
      console.error('Error validating project:', error);
      return false;
    }
  }

  async initializeDemoEditor() {
    // Initialize editor without project loading
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
  
    this.container = new UIPanel();
    this.container.setClass('editor-container demo-mode');
    this.container.setId('editor-root');
    appContainer.appendChild(this.container.dom);
  
    // Initialize editor with demo notice
    await this.loadDependenciesAndInitialize();
  
    // Add demo notice
    const demoNotice = new UIPanel();
    demoNotice.setClass('demo-notice');
    demoNotice.dom.innerHTML = `
            <div class="demo-message">
                <i class="ri-information-line"></i>
                You're in demo mode. 
                <a href="#/shine/auth" class="demo-link">Sign up</a> 
                to save your work.
            </div>
        `;
    this.container.dom.appendChild(demoNotice.dom);
  
    // Disable save functionality in demo mode
    this.editor.signals.savingStarted.add(() => {
      if (this.isDemo) {
        alert('Saving is not available in demo mode. Sign up to save your work!');
        return false;
      }
    });
  }

  async loadDependenciesAndInitialize() {
    console.log('Loading dependencies and initializing editor...');

    try {
      // Load critical dependencies first
      await this.loadCriticalDependencies();

      // Initialize the editor
      await this.initializeEditor();

    } catch (error) {
      console.error('Error in loadDependenciesAndInitialize:', error);
      throw error;
    }
  }

  async loadCriticalDependencies() {
    console.log('Loading critical dependencies...');

    // Load signals if not already loaded
    if (!window.signals) {
      console.log('Loading signals library...');
      await this.loadScript('/js/libs/signals.min.js');
    }

    // Ensure other critical globals are available
    if (!window.signals) {
      console.error('Failed to load signals library');
      throw new Error('Failed to load required dependencies');
    }

    console.log('Critical dependencies loaded successfully');
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log('Loaded script:', src);
        resolve();
      };
      script.onerror = () => {
        console.error('Failed to load script:', src);
        reject(new Error(`Failed to load script: ${src}`));
      };
      document.head.appendChild(script);
    });
  }

  async initializeEditor() {
    console.log('Initializing Three.js editor...');

    try {
      // Expose globals exactly like original
      window.URL = window.URL || window.webkitURL;
      window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;
      window.VRButton = VRButton;

      if (!Number.prototype.format) {
        Number.prototype.format = function () {
          return this.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        };
      }

      // Initialize editor
      this.editor = new Editor();
      window.editor = this.editor; // Expose editor to Console
      window.THREE = THREE; // Expose THREE to APP Scripts and Console

      // Add export functions to editor for menu access
      this.editor.exportProject = () => this.exportProject();
      this.editor.exportJSON = () => this.exportJSON();

      // Create editor components in the correct order
      const toolbar = new Toolbar(this.editor);
      this.container.dom.appendChild(toolbar.container.dom);

      const viewport = new Viewport(this.editor, toolbar.measureValue);
      this.container.dom.appendChild(viewport.dom);

      const script = new Script(this.editor);
      this.container.dom.appendChild(script.dom);

      const player = new Player(this.editor);
      this.container.dom.appendChild(player.dom);

      const sidebarLeft = new SidebarLeft(this.editor);
      this.container.dom.appendChild(sidebarLeft.dom);

      const sidebar = new Sidebar(this.editor);
      this.container.dom.appendChild(sidebar.dom);

      const menubar = new Menubar(this.editor);
      this.container.dom.appendChild(menubar.dom);

      const leftBarResizer = new LeftBarResizer(this.editor);
      this.container.dom.appendChild(leftBarResizer.dom);

      const resizer = new Resizer(this.editor);
      this.container.dom.appendChild(resizer.dom);

      // Add back to dashboard button
      const backButton = this.createBackButton();
      this.container.dom.appendChild(backButton.dom);

      // Initialize storage
      await new Promise((resolve, reject) => {
        try {
          this.editor.storage.init(() => {
            console.log('Editor storage initialized');
            resolve();
          });
        } catch (error) {
          console.error('Error initializing editor storage:', error);
          reject(error);
        }
      });

      // Load project data after editor is initialized
      if (this.projectId) {
        setTimeout(() => {
          this.loadProject();
        }, 100);
      }

      // Set up features
      this.setupAutoSave();
      this.setupDragAndDrop();
      this.setupWindowResize();
      this.setupKeyboardShortcuts();

      console.log('Three.js editor initialized successfully');

    } catch (error) {
      console.error('Error initializing editor:', error);
      throw error;
    }
  }

  async loadProject() {
    if (!this.projectId) {
      console.error('No project ID to load');
      return;
    }

    const user = window.router.getCurrentUser();
    if (!user) {
      console.error('No user available for loading project');
      window.router.navigate('/shine/auth');
      return;
    }

    try {
      console.log('Loading project data:', this.projectId);

      const projectRef = ref(window.firebaseDB, `users/${user.uid}/projects/${this.projectId}`);
      const snapshot = await get(projectRef);

      if (snapshot.exists()) {
        const projectData = snapshot.val();

        if (projectData.data) {
          console.log('Loading project data into editor...');

          // Clear existing editor state
          this.editor.clear();

          // Ensure scripts object exists
          if (!projectData.data.scripts) {
            projectData.data.scripts = {};
          }

          // Load new data
          this.editor.fromJSON(projectData.data);

          // Update page title
          document.title = `${projectData.name || 'Untitled'} - Shine Editor`;
          this.projectName = projectData.name;

          // Signal that scene has changed
          this.editor.signals.sceneGraphChanged.dispatch();
          console.log('Project loaded successfully');
        } else {
          console.log('Project has no data, starting with empty scene');
          // Initialize empty scene
          this.editor.clear();
        }

      } else {
        console.error('Project not found during load', this.projectId);
        alert('Project not found');
        window.router.navigate('/shine/dashboard');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project: ' + error.message);
      window.router.navigate('/shine/dashboard');
    }
  }

  async saveProject() {
    if (!this.projectId) {
      console.warn('No project ID to save');
      return;
    }

    const user = window.router.getCurrentUser();
    if (!user) {
      console.warn('No user available for saving');
      return;
    }

    try {
      console.log('Saving project...');
      let projectData = this.editor.toJSON();

      // Fix undefined values that Firebase doesn't accept
      if (projectData.scripts === undefined) {
        projectData.scripts = {};
      }

      projectData = this.cleanFirebaseIncompatibleValues(projectData);

      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${this.projectId}/data`), projectData);
      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${this.projectId}/lastModified`), Date.now());

      if (this.editor.signals) {
        this.editor.signals.savingStarted.dispatch();
        setTimeout(() => {
          this.editor.signals.savingFinished.dispatch();
        }, 500);
      }

      console.log('Project saved successfully');

    } catch (error) {
      console.error('Error saving project:', error);
    }
  }

  cleanFirebaseIncompatibleValues(obj) {
    if (obj === null || typeof obj !== 'object') {
      if (typeof obj === 'number' && (isNaN(obj) || !isFinite(obj))) {
        return null; 
      }
      return obj === undefined ? null : obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanFirebaseIncompatibleValues(item));
    }

    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = this.cleanFirebaseIncompatibleValues(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
      }
    }
    return cleaned;
  }

  async exportJSON() {
    if (!this.editor) return;

    try {
      console.log('Exporting project as JSON...');

      let output = this.editor.toJSON();
      output.metadata.type = 'App';
      delete output.history;

      const jsonString = JSON.stringify(output, null, '\t');
      const formattedJson = jsonString.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');

      const blob = new Blob([formattedJson], { type: 'application/json' });

      const title = this.editor.config.getKey('project/title') || this.projectName || 'untitled';
      this.downloadBlob(blob, title + '.json');

      console.log('Project exported as JSON successfully');

    } catch (error) {
      console.error('Error exporting JSON:', error);
      alert('Failed to export JSON');
    }
  }

  async exportProject() {
    if (!this.editor) return;

    try {
      console.log('Exporting project as ZIP...');

      const { zipSync, strToU8 } = await import('https://cdn.skypack.dev/fflate');

      const toZip = {};

      let output = this.editor.toJSON();
      output.metadata.type = 'App';
      delete output.history;
      output = JSON.stringify(output, null, '\t');
      output = output.replace(/[\n\t]+([\d\.e\-\[\]]+)/g, '$1');
      toZip['app.json'] = strToU8(output);

      const title = this.editor.config.getKey('project/title') || this.projectName || 'untitled';

      const manager = new THREE.LoadingManager(() => {
        try {
          const zipped = zipSync(toZip, { level: 9 });
          const blob = new Blob([zipped.buffer], { type: 'application/zip' });
          this.downloadBlob(blob, title + '.zip');
          console.log('Project exported as ZIP successfully');
        } catch (error) {
          console.error('Error creating ZIP:', error);
          alert('Failed to export project');
        }
      });

      const loader = new THREE.FileLoader(manager);

      loader.load('/js/libs/app/index.html', (content) => {
        content = content.replace('<!-- title -->', title);

        const includes = [];
        content = content.replace('<!-- includes -->', includes.join('\n\t\t'));

        let editButton = '';
        if (this.editor.config.getKey('project/editable')) {
          editButton = [
            '			let button = document.createElement( \'a\' );',
            '			button.href = \'https://threejs.org/editor/#file=\' + location.href.split( \'/\' ).slice( 0, - 1 ).join( \'/\' ) + \'/app.json\';',
            '			button.style.cssText = \'position: absolute; bottom: 20px; right: 20px; padding: 10px 16px; color: #fff; border: 1px solid #fff; border-radius: 20px; text-decoration: none;\';',
            '			button.target = \'_blank\';',
            '			button.textContent = \'EDIT\';',
            '			document.body.appendChild( button );',
          ].join('\n');
        }

        content = content.replace('\t\t\t/* edit button */', editButton);
        toZip['index.html'] = strToU8(content);
      });

      loader.load('/js/libs/app.js', (content) => {
        toZip['js/app.js'] = strToU8(content);
      });

      loader.load('/build/three.module.js', (content) => {
        toZip['js/three.module.js'] = strToU8(content);
      });

      loader.load('/examples/jsm/webxr/VRButton.js', (content) => {
        toZip['js/VRButton.js'] = strToU8(content);
      });

    } catch (error) {
      console.error('Error exporting project:', error);
      alert('Failed to export project: ' + error.message);
    }
  }

  downloadBlob(blob, filename) {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  setupAutoSave() {
    const saveState = () => {
      if (this.editor.config.getKey('autosave') === false) return;

      clearTimeout(this.autoSaveTimeout);

      this.autoSaveTimeout = setTimeout(() => {
        console.log('Auto-saving project due to changes...');
        this.saveProject();
      }, 1000);
    };

    // Listen to editor signals for auto-save
    const signals = this.editor.signals;

    // Add debug logging for object operations with error handling
    const originalObjectAdded = signals.objectAdded.dispatch;
    signals.objectAdded.dispatch = function (object) {
      console.log('=== OBJECT ADDED ===');
      console.log('Object:', object);
      console.log('Object name:', object.name);
      console.log('Object type:', object.type);
      console.log('Scene children count:', window.editor.scene.children.length);

      // Call original dispatch with error handling
      try {
        originalObjectAdded.call(this, object);
      } catch (error) {
        console.warn('Error in original objectAdded dispatch:', error);
      }

      // Force outliner refresh with error handling
      setTimeout(() => {
        try {
          console.log('Forcing outliner refresh after object add...');
          signals.sceneGraphChanged.dispatch();
        } catch (error) {
          console.warn('Error refreshing outliner:', error);
        }
      }, 100);
    };

    signals.geometryChanged.add(saveState);
    signals.objectAdded.add(saveState);
    signals.objectChanged.add(saveState);
    signals.objectRemoved.add(saveState);
    signals.materialChanged.add(saveState);
    signals.sceneBackgroundChanged.add(saveState);
    signals.sceneEnvironmentChanged.add(saveState);
    signals.sceneFogChanged.add(saveState);
    signals.sceneGraphChanged.add(saveState);
    signals.scriptChanged.add(saveState);
    signals.historyChanged.add(saveState);

    console.log('Auto-save setup complete');
  }

  setupDragAndDrop() {
    document.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    });

    document.addEventListener('drop', (event) => {
      event.preventDefault();
      if (event.dataTransfer.types[0] === 'text/plain') return; // Outliner drop

      if (event.dataTransfer.items) {
        // DataTransferItemList supports folders
        this.editor.loader.loadItemList(event.dataTransfer.items);
      } else {
        this.editor.loader.loadFiles(event.dataTransfer.files);
      }
    });
  }

  setupWindowResize() {
    this.onWindowResize = () => {
      this.editor.signals.windowResize.dispatch();
    };

    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Only handle shortcuts when editor is active
      if (!this.editor) return;

      // Ctrl+S or Cmd+S - Save project
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        this.saveProject();
      }

      // Ctrl+E or Cmd+E - Export as ZIP
      if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
        event.preventDefault();
        this.exportProject();
      }

      // Ctrl+Shift+E or Cmd+Shift+E - Export as JSON
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
        event.preventDefault();
        this.exportJSON();
      }
    });
  }

  createBackButton() {
    const backBtn = new UIButton('← Dashboard');
    backBtn.setClass('back-to-dashboard');
    backBtn.onClick(() => {
      if (confirm('Do you want to save your changes before leaving?')) {
        this.saveProject();
      }
      window.router.navigate('/shine/dashboard');
    });
  
    return backBtn;
  }

  destroy() {
    console.log('Destroying editor page');

    // Clear auto-save timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Remove window resize listener
    if (this.onWindowResize) {
      window.removeEventListener('resize', this.onWindowResize);
    }

    // Save before destroying
    if (this.projectId && this.editor) {
      this.saveProject();
    }

    // Clean up editor
    if (this.editor) {
      // The editor cleanup will be handled by the individual components
    }

    // Remove container
    if (this.container && this.container.dom && this.container.dom.parentNode) {
      this.container.dom.parentNode.removeChild(this.container.dom);
    }

    // Clear globals
    window.editor = null;
  }
}