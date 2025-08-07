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
    this.isReadOnly = false;
    this.isPublicProject = false;
    this.projectData = null;
    this.detectedOwnerId = null;
  }

  async render() {
    try {
      // Clear any dashboard nstance reference when entering editor
      window.dashboardPageInstance = null;
      
      // Check if this is demo mode first
      const path = window.router.getCurrentPath();
      if (path === '/demo') {
        this.isDemo = true;
        await this.initializeDemoEditor();
        return;
      }

      const pathParts = path.split('/');

      if (path.startsWith('/editor/') && pathParts[2]) {
        this.projectId = pathParts[2]; 
      } else {
        window.router.navigate('/dashboard');
        return;
      }

      // Validate project ID format
      if (!this.projectId || this.projectId === 'undefined' || this.projectId === 'null') {
        alert('Invalid project ID. Redirecting to dashboard.');
        window.router.navigate('/dashboard');
        return;
      }

      // Check project access and determine mode
      const accessInfo = await this.checkProjectAccess(this.projectId);
      
      if (!accessInfo.accessible) {
        alert('Project not found or access denied.');
        window.router.navigate('/');
        return;
      }

      // Set project data first
      this.projectData = accessInfo.projectInfo;
      this.projectName = this.projectData.projectName || this.projectData.name || 'Untitled Project';
      this.isPublicProject = accessInfo.isPublic;
      
      // Enhanced ownership detection
      const user = window.router.getCurrentUser();
      let projectOwnerId = this.projectData?.ownerId || this.projectData?.ownerUid || this.projectData?.userId;
      
      // Check global index for public projects if no owner ID found
      if (!projectOwnerId && accessInfo.isPublic) {
        try {
          const globalProjectRef = ref(window.firebaseDB, `projectsIndex/${this.projectId}`);
          const globalSnapshot = await get(globalProjectRef);
          if (globalSnapshot.exists()) {
            const globalData = globalSnapshot.val();
            projectOwnerId = globalData.ownerId || globalData.ownerUid || globalData.userId;
          }
        } catch (error) {
          console.warn('Could not check global index:', error);
        }
      }
      
      // For private projects, assume folder owner is project owner
      if (!projectOwnerId && !accessInfo.isPublic) {
        projectOwnerId = user?.uid;
      }
      
      // Store detected owner ID for use by other components
      this.detectedOwnerId = projectOwnerId;
      
      const isOwner = user && projectOwnerId && user.uid === projectOwnerId;
      
      // Determine read-only status
      if (this.isPublicProject) {
        this.isReadOnly = !isOwner;
      } else {
        this.isReadOnly = false;
      }

      const appContainer = document.getElementById('app');
      if (!appContainer) {
        throw new Error('App container not found');
      }

      // Clear existing content
      appContainer.innerHTML = '';

      // Create editor container
      this.container = new UIPanel();
      this.container.setClass('editor-container');
      this.container.setId('editor-root');

      // Add read-only class if needed
      if (this.isReadOnly) {
        this.container.addClass('read-only-mode');
      }

      appContainer.appendChild(this.container.dom);

      // Load dependencies and initialize Three.js editor
      await this.loadDependenciesAndInitialize();

    } catch (error) {
      console.error('Editor initialization error:', error);
      alert('Failed to load editor. Redirecting to dashboard.');
      window.router.navigate('/dashboard');
    }
  }

  // Check project access
  async checkProjectAccess(projectId) {
    try {
      // First check global index for public projects
      const globalProjectRef = ref(window.firebaseDB, `projectsIndex/${projectId}`);
      const globalSnapshot = await get(globalProjectRef);
      
      if (globalSnapshot.exists()) {
        const projectInfo = globalSnapshot.val();
        
        if (projectInfo.isPublic && !projectInfo.deleted && !projectInfo.archived) {
          // Public project - get full data from owner
          const ownerProjectRef = ref(window.firebaseDB, `users/${projectInfo.ownerId}/projects/${projectId}`);
          const ownerSnapshot = await get(ownerProjectRef);
          
          if (ownerSnapshot.exists()) {
            return {
              accessible: true,
              isPublic: true,
              projectInfo: ownerSnapshot.val()
            };
          }
        }
      }
      
      // Check if user owns the project
      const user = window.router.getCurrentUser();
      if (user) {
        const userProjectRef = ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`);
        const userSnapshot = await get(userProjectRef);
        
        if (userSnapshot.exists()) {
          const projectData = userSnapshot.val();
          if (!projectData.deleted && !projectData.archived) {
            return {
              accessible: true,
              isPublic: projectData.isPublic || false,
              projectInfo: projectData
            };
          }
        }
      }
      
      return { accessible: false, isPublic: false, projectInfo: null };
      
    } catch (error) {
      console.error('Error checking project access:', error);
      return { accessible: false, isPublic: false, projectInfo: null };
    }
  }

  async saveProject() {
    // Don't save if read-only or demo mode
    if (this.isReadOnly || this.isDemo) {
      return;
    }

    if (!this.projectId) {
      return;
    }

    const user = window.router.getCurrentUser();
    if (!user) {
      return;
    }

    try {
      let projectData = this.editor.toJSON();

      // Fix undefined values that Firebase doesn't accept
      if (projectData.scripts === undefined) {
        projectData.scripts = {};
      }

      projectData = this.cleanFirebaseIncompatibleValues(projectData);

      // Save to Firebase
      const dataRef = ref(window.firebaseDB, `users/${user.uid}/projects/${this.projectId}/data`);
      await set(dataRef, projectData);

      // Update timestamp
      const timestampRef = ref(window.firebaseDB, `users/${user.uid}/projects/${this.projectId}/lastModified`);
      await set(timestampRef, Date.now());

      // Update project index if it's public
      if (this.isPublicProject) {
        const indexRef = ref(window.firebaseDB, `projectsIndex/${this.projectId}/lastModified`);
        await set(indexRef, Date.now());
      }

      // Signal save completion
      if (this.editor.signals) {
        this.editor.signals.savingStarted.dispatch();
        setTimeout(() => {
          this.editor.signals.savingFinished.dispatch();
        }, 500);
      }

    } catch (error) {
      console.error('Save failed:', error);
    }
  }

  async initializeEditor() {
    try {
      // Expose globals
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
      window.editor = this.editor;
      window.THREE = THREE;
      window.editorPageInstance = this;

      // Set read-only mode on editor if needed
      if (this.isReadOnly) {
        this.editor.config.setKey('readOnly', true);
      }

      // Create editor components
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



      // Initialize storage
      await new Promise((resolve, reject) => {
        try {
          this.editor.storage.init(() => {
            resolve();
          });
        } catch (error) {
          console.error('Error initializing editor storage:', error);
          reject(error);
        }
      });

      // Load project data
      if (this.projectId) {
        setTimeout(() => {
          this.loadProject();
        }, 100);
      }

      // Set up auto-save ONLY if not read-only and not demo
      if (!this.isReadOnly && !this.isDemo) {
        this.setupAutoSave();
      }

      this.setupDragAndDrop();
      this.setupWindowResize();
      this.setupKeyboardShortcuts();

    } catch (error) {
      console.error('Error initializing editor:', error);
      throw error;
    }
  }



  setupAutoSave() {
    const saveState = () => {
      if (this.editor.config.getKey('autosave') === false) return;

      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = setTimeout(() => {
        this.saveProject();
      }, 1000);
    };

    // Listen to editor signals
    const signals = this.editor.signals;
    signals.objectAdded.add(saveState);
    signals.objectChanged.add(saveState);
    signals.objectRemoved.add(saveState);
    signals.materialChanged.add(saveState);
    signals.geometryChanged.add(saveState);
    signals.sceneGraphChanged.add(saveState);
    signals.scriptChanged.add(saveState);
    signals.historyChanged.add(saveState);
  }

  setupDragAndDrop() {
    // Disable drag and drop in read-only mode
    if (this.isReadOnly) {
      return;
    }

    document.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    });

    document.addEventListener('drop', (event) => {
      event.preventDefault();
      if (event.dataTransfer.types[0] === 'text/plain') return; // Outliner drop

      if (event.dataTransfer.items) {
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
      if (!this.editor) return;

      // Ctrl+S or Cmd+S - Save project (only if not read-only)
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (!this.isReadOnly) {
          this.saveProject();
        }
      }
    });
  }

  async loadDependenciesAndInitialize() {
    try {
      await this.loadCriticalDependencies();
      await this.initializeEditor();
    } catch (error) {
      console.error('Error in loadDependenciesAndInitialize:', error);
      throw error;
    }
  }

  async loadCriticalDependencies() {
    if (!window.signals) {
      await this.loadScript('/js/libs/signals.min.js');
    }

    if (!window.signals) {
      throw new Error('Failed to load required dependencies');
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  async loadProject() {
    if (this.projectData && this.projectData.data) {
      this.editor.clear();
      if (!this.projectData.data.scripts) {
        this.projectData.data.scripts = {};
      }
      this.editor.fromJSON(this.projectData.data);
      
      // Update page title
      document.title = `${this.projectName} - Shine Editor${this.isReadOnly ? ' (Read-Only)' : ''}`;
      
      this.editor.signals.sceneGraphChanged.dispatch();
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

  async initializeDemoEditor() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = '';
  
    this.container = new UIPanel();
    this.container.setClass('editor-container demo-mode');
    this.container.setId('editor-root');
    appContainer.appendChild(this.container.dom);
  
    await this.loadDependenciesAndInitialize();
  
    // Add demo notice
    const demoNotice = new UIPanel();
    demoNotice.setClass('demo-notice');
    demoNotice.dom.innerHTML = `
      <div class="demo-message">
        <i class="ri-information-line"></i>
        You're in demo mode. 
        <a href="#/auth" class="demo-link">Sign up</a> 
        to save your work.
      </div>
    `;
    this.container.dom.appendChild(demoNotice.dom);
  }

  destroy() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    if (this.onWindowResize) {
      window.removeEventListener('resize', this.onWindowResize);
    }
    if (this.projectId && this.editor && !this.isReadOnly) {
      this.saveProject();
    }
    if (this.container && this.container.dom && this.container.dom.parentNode) {
      this.container.dom.parentNode.removeChild(this.container.dom);
    }
    window.editor = null;
    window.editorPageInstance = null;
  }
}