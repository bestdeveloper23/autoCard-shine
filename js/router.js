import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

export class Router {
  constructor() {
    this.routes = {
      '/': () => import('/js/pages/home.js').then(m => new m.HomePage()),
      '/home': () => { this.navigate('/'); }, // Redirect old URLs
      '/auth': () => import('/js/pages/auth.js').then(m => new m.AuthPage()),
      '/dashboard': () => import('/js/pages/dashboard.js').then(m => new m.DashboardPage()),
      '/dashboard/:filter': () => import('/js/pages/dashboard.js').then(m => new m.DashboardPage()),
      '/settings': () => import('/js/pages/settings.js').then(m => new m.SettingsPage()),
      '/editor': () => import('/js/pages/editor.js').then(m => new m.EditorPage()),
      '/demo': () => import('/js/pages/editor.js').then(m => new m.EditorPage()),
      '/editor/:projectId': () => import('/js/pages/editor.js').then(m => new m.EditorPage())
    };

    this.currentPage = null;
    this.currentUser = null;
    this.protectedRoutes = ['/dashboard', '/settings'];
    this.authInitialized = false;
    this.authStateCallbacks = [];
    this.isInitialLoad = true;
    this.authPromise = null;
    this.authResolver = null;

    this.authPromise = new Promise((resolve) => {
      this.authResolver = resolve;
    });

    onAuthStateChanged(window.firebaseAuth, (user) => {
      const wasAuthenticated = !!this.currentUser;
      const wasAuthInitialized = this.authInitialized;

      this.currentUser = user;
      this.authInitialized = true;

      if (!wasAuthInitialized && this.authResolver) {
        this.authResolver(user);
        this.authResolver = null;
      }

      this.authStateCallbacks.forEach(callback => {
        try {
          callback(user);
        } catch (error) {
        }
      });

      if (!wasAuthInitialized && this.isInitialLoad) {
        const currentPath = this.getCurrentPath();
        const isProtectedRoute = this.protectedRoutes.some(protectedPath =>
          currentPath.startsWith(protectedPath)
        );

        if (isProtectedRoute) {
          setTimeout(() => this.handleRoute(), 0);
          return;
        }
      }

      this.handleAuthStateChange(wasAuthenticated);
    });
  }

  getCurrentPath() {
    const hash = window.location.hash.slice(1);
    return hash || '/';
  }

  init() {
    this.handleRoute();

    window.addEventListener('hashchange', () => {
      this.isInitialLoad = false;
      this.handleRoute();
    });

    document.addEventListener('click', (e) => {
      if (e.target.matches('a[data-route]')) {
        e.preventDefault();
        this.navigate(e.target.getAttribute('data-route'));
      }
    });
  }

  navigate(path, replace = false) {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    this.isInitialLoad = false;

    if (replace) {
      window.location.replace('#' + path);
    } else {
      window.location.hash = path;
    }
  }

  async checkProjectAccess(projectId) {
    try {

      const globalProjectRef = ref(window.firebaseDB, `projectsIndex/${projectId}`);
      const globalSnapshot = await get(globalProjectRef);

      if (globalSnapshot.exists()) {
        const projectInfo = globalSnapshot.val();

        if (projectInfo.isPublic && !projectInfo.deleted && !projectInfo.archived) {
          return {
            accessible: true,
            isPublic: true,
            requiresAuth: false,
            projectInfo
          };
        }
      }

      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        return {
          accessible: false,
          isPublic: false,
          requiresAuth: true,
          projectInfo: null
        };
      }

      const userProjectRef = ref(window.firebaseDB, `users/${currentUser.uid}/projects/${projectId}`);
      const userSnapshot = await get(userProjectRef);

      if (userSnapshot.exists()) {
        const projectData = userSnapshot.val();
        if (!projectData.deleted && !projectData.archived) {
          return {
            accessible: true,
            isPublic: false,
            requiresAuth: true,
            projectInfo: projectData
          };
        }
      }

      return {
        accessible: false,
        isPublic: false,
        requiresAuth: true,
        projectInfo: null
      };

    } catch (error) {
      return {
        accessible: false,
        isPublic: false,
        requiresAuth: true,
        projectInfo: null
      };
    }
  }

  async handleRoute() {
    const path = this.getCurrentPath();

    if (path === '/demo') {
      this.setPageClass(path);

      if (this.currentPage && this.currentPage.destroy) {
        this.currentPage.destroy();
      }

      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = '';
      }

      try {
        const pageModule = await import('/js/pages/editor.js');
        this.currentPage = new pageModule.EditorPage();
        await this.currentPage.render();
      } catch (error) {
        this.navigate('/auth', true);
      }
      return;
    }

    if (path.startsWith('/shine/')) {
      const newPath = path.replace('/shine', '');
      this.navigate(newPath || '/', true);
      return;
    }

    if (path.startsWith('/editor/')) {
      const pathParts = path.split('/');
      if (pathParts[2]) {
        const projectId = pathParts[2];

        const accessResult = await this.checkProjectAccess(projectId);

        if (!accessResult.accessible) {
          if (accessResult.requiresAuth && !this.getCurrentUser()) {
            alert('This project is private. Please sign in to access it.');
            this.navigate('/auth', true);
            return;
          } else {
            alert('Project not found or access denied.');
            this.navigate('/', true);
            return;
          }
        }

      }
    }

    const isProtectedRoute = this.protectedRoutes.some(protectedPath => path.startsWith(protectedPath));

    if (isProtectedRoute && !this.authInitialized) {
      try {
        // Wait for auth with timeout
        await Promise.race([
          this.authPromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Auth timeout')), 10000)
          )
        ]);
      } catch (error) {
        this.navigate('/', true);
        return;
      }
    }

    const route = this.matchRoute(path);

    if (!route) {
      this.navigate('/', true);
      return;
    }

    // Check if authenticated user is required for this route
    if (isProtectedRoute && !this.currentUser) {
      this.navigate('/auth', true);
      return;
    }

    // Set body class for CSS styling
    this.setPageClass(path);

    // Clear current page
    if (this.currentPage && this.currentPage.destroy) {
      try {
        this.currentPage.destroy();
      } catch (error) {
      }
    }

    // Clear app container
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = '';
      appContainer.classList.remove('page-active');
    }

    // Load and render new page
    try {
      const PageClass = await route.handler();
      this.currentPage = PageClass;
      this.currentPage.routeParams = route.params || {};

      await this.currentPage.render();

      // Show page content
      if (appContainer) {
        appContainer.classList.add('page-active');
      }

      // Mark that initial load is complete
      if (this.isInitialLoad) {
        this.isInitialLoad = false;
      }

    } catch (error) {
      // More specific error handling
      if (path.startsWith('/editor/')) {
        alert('Failed to load project. Redirecting to dashboard.');
        this.navigate('/dashboard', true);
      } else {
        this.navigate('/', true);
      }
    }
  }

  setPageClass(path) {
    document.body.classList.remove('page-home', 'page-auth', 'page-dashboard', 'page-editor');

    if (path === '/') {
      document.body.classList.add('page-home');
    } else if (path === '/auth') {
      document.body.classList.add('page-auth');
    } else if (path.startsWith('/dashboard')) {
      document.body.classList.add('page-dashboard');
    } else if (path.startsWith('/editor') || path === '/demo') {
      document.body.classList.add('page-editor');
    }
  }

  matchRoute(path) {
    // Exact match first
    if (this.routes[path]) {
      return { handler: this.routes[path], params: {} };
    }

    // Parameter matching
    for (const routePath in this.routes) {
      const paramMatch = this.matchParameterRoute(routePath, path);
      if (paramMatch) {
        return { handler: this.routes[routePath], params: paramMatch };
      }
    }

    return null;
  }

  matchParameterRoute(routePath, actualPath) {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }

    return params;
  }

  handleAuthStateChange(wasAuthenticated) {
    if (!this.authInitialized) {
      return;
    }

    const currentPath = this.getCurrentPath();
    const isAuthenticated = !!this.currentUser;
    const isProtectedRoute = this.protectedRoutes.some(protectedPath => currentPath.startsWith(protectedPath));

    if (isAuthenticated && !wasAuthenticated) {
      // User just logged in
      if (currentPath === '/auth') {
        this.navigate('/dashboard');
      }

    } else if (!isAuthenticated && wasAuthenticated) {
      // User just logged out
      if (isProtectedRoute) {
        this.navigate('/');
      }

    } else if (!isAuthenticated && this.isInitialLoad) {
      // User not authenticated on initial load
      if (isProtectedRoute) {
        this.navigate('/');
      }
    }
  }

  forceNavigate(path) {
    this.navigate(path);
  }

  checkAuthState() {
    return {
      authInitialized: this.authInitialized,
      currentUser: this.currentUser,
      firebaseUser: window.firebaseAuth?.currentUser,
      currentPath: this.getCurrentPath(),
      isInitialLoad: this.isInitialLoad
    };
  }

  getCurrentUser() {
    return this.currentUser;
  }

  getRouteParams() {
    return this.currentPage?.routeParams || {};
  }

  updateURL(path, replace = false) {
    if (replace) {
      window.location.replace('#' + path);
    } else {
      window.location.hash = path;
    }
  }

  async waitForAuth(timeout = 10000) {
    if (this.authInitialized) {
      return this.currentUser;
    }

    try {
      const user = await Promise.race([
        this.authPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), timeout)
        )
      ]);
      return user;
    } catch (error) {
      return null;
    }
  }
}