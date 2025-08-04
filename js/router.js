import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

export class Router {
  constructor() {
    // Keep your existing routes with /shine/ prefix for hash routing
    this.routes = {
      '/': () => import('/js/pages/home.js').then(m => new m.HomePage()),
      '/shine': () => import('/js/pages/home.js').then(m => new m.HomePage()),
      '/shine/': () => import('/js/pages/home.js').then(m => new m.HomePage()),
      '/home': () => { this.navigate('/shine/'); }, // Redirect old URLs
      '/shine/auth': () => import('/js/pages/auth.js').then(m => new m.AuthPage()),
      '/shine/dashboard': () => import('/js/pages/dashboard.js').then(m => new m.DashboardPage()),
      '/shine/dashboard/:filter': () => import('/js/pages/dashboard.js').then(m => new m.DashboardPage()),
      '/shine/settings': () => import('/js/pages/settings.js').then(m => new m.SettingsPage()),
      '/shine/editor': () => import('/js/pages/editor.js').then(m => new m.EditorPage()),
      '/shine/demo': () => import('/js/pages/editor.js').then(m => new m.EditorPage()),
      '/shine/editor/:projectId': () => import('/js/pages/editor.js').then(m => new m.EditorPage())
    };

    this.currentPage = null;
    this.currentUser = null;
    this.protectedRoutes = ['/shine/dashboard', '/shine/editor', '/shine/settings'];
    this.authInitialized = false;
    this.authStateCallbacks = [];
    this.isInitialLoad = true;
    this.authPromise = null;
    this.authResolver = null;

    console.log('Hash Router initialized');

    // Create auth promise that we can resolve when auth initializes
    this.authPromise = new Promise((resolve) => {
      this.authResolver = resolve;
    });

    // Auth state listener
    onAuthStateChanged(window.firebaseAuth, (user) => {

      const wasAuthenticated = !!this.currentUser;
      const wasAuthInitialized = this.authInitialized;

      this.currentUser = user;
      this.authInitialized = true;

      // Resolve auth promise if this is the first time
      if (!wasAuthInitialized && this.authResolver) {
        this.authResolver(user);
        this.authResolver = null;
      }

      // Call all registered callbacks
      this.authStateCallbacks.forEach(callback => {
        try {
          callback(user);
        } catch (error) {
        }
      });

      // If this is the first auth initialization and we have a protected route
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

  // Get current path from hash
  getCurrentPath() {
    const hash = window.location.hash.slice(1); // Remove #
    return hash || '/shine/';
  }

  init() {
    this.handleRoute();

    window.addEventListener('hashchange', () => {
      this.isInitialLoad = false;
      this.handleRoute();
    });

    // Handle link clicks
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
    console.log('Navigating to:', path);
    this.isInitialLoad = false;

    // Set hash instead of using history API
    if (replace) {
      window.location.replace('#' + path);
    } else {
      window.location.hash = path;
    }
    // handleRoute will be called automatically by hashchange event
  }

  async handleRoute() {
    const path = this.getCurrentPath();

    if (path === '/shine/demo') {

      this.setPageClass(path);

      if (this.currentPage && this.currentPage.destroy) {
        this.currentPage.destroy();
      }

      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = '';
      }

      // Load demo page directly
      try {
        const pageModule = await import('/js/pages/editor.js');
        this.currentPage = new pageModule.EditorPage();
        await this.currentPage.render();
      } catch (error) {
        this.navigate('/shine/auth', true);
      }
      return;
    }

    // Handle legacy /editor/ redirects
    if (path.startsWith('/editor/')) {
      const projectId = path.split('/editor/')[1];
      if (projectId) {
        this.navigate(`/shine/editor/${projectId}`, true);
        return;
      }
    }

    const isProtectedRoute = this.protectedRoutes.some(protectedPath => path.startsWith(protectedPath));

    if (isProtectedRoute && !this.authInitialized) {
      console.log('Protected route detected, waiting for auth initialization...');

      try {
        // Wait for auth with timeout
        await Promise.race([
          this.authPromise,
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Auth timeout')), 10000)
          )
        ]);
        console.log('Auth initialization complete, continuing with route handling');
      } catch (error) {
        console.error('Auth initialization failed or timed out:', error);
        this.navigate('/shine/', true);
        return;
      }
    }

    const route = this.matchRoute(path);

    if (!route) {
      console.log('No route found, redirecting to home');
      this.navigate('/shine/', true);
      return;
    }

    // Check if authenticated user is required for this route
    if (isProtectedRoute && !this.currentUser) {
      console.log('Protected route requires authentication, redirecting to auth');
      this.navigate('/shine/auth', true);
      return;
    }

    // Set body class for CSS styling
    this.setPageClass(path);

    // Clear current page
    if (this.currentPage && this.currentPage.destroy) {
      try {
        this.currentPage.destroy();
      } catch (error) {
        console.warn('Error destroying current page:', error);
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
      console.log('Loading page for:', path);
      const PageClass = await route.handler();
      this.currentPage = PageClass;

      // Pass route parameters to the page
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

      console.log('Page loaded successfully for:', path);

    } catch (error) {
      console.error('Error loading page:', error);
      console.error('Error stack:', error.stack);

      // More specific error handling
      if (path.startsWith('/shine/editor/')) {
        console.log('Editor page failed to load, redirecting to dashboard');
        alert('Failed to load project. Redirecting to dashboard.');
        this.navigate('/shine/dashboard', true);
      } else {
        console.log('Page failed to load, redirecting to home');
        this.navigate('/shine/', true);
      }
    }
  }

  setPageClass(path) {
    // Remove all page classes
    document.body.classList.remove('page-home', 'page-auth', 'page-dashboard', 'page-editor', 'page-settings');

    // Add current page class
    if (path === '/' || path === '/shine' || path === '/shine/') {
      document.body.classList.add('page-home');
    } else if (path === '/shine/auth') {
      document.body.classList.add('page-auth');
    } else if (path.startsWith('/shine/dashboard')) {
      document.body.classList.add('page-dashboard');
    } else if (path.startsWith('/shine/editor') || path === '/shine/demo') {
      document.body.classList.add('page-editor');
    } else if (path === '/shine/settings') {
      document.body.classList.add('page-settings');
    }
  }

  matchRoute(path) {
    console.log('Matching route for path:', path);

    // Exact match first
    if (this.routes[path]) {
      console.log('Exact match found:', path);
      return { handler: this.routes[path], params: {} };
    }

    // Parameter matching
    for (const routePath in this.routes) {
      const paramMatch = this.matchParameterRoute(routePath, path);
      if (paramMatch) {
        console.log('Parameter match found:', routePath, 'for path:', path);
        return { handler: this.routes[routePath], params: paramMatch };
      }
    }

    console.log('No route match found for:', path);
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
      console.log('Auth not yet initialized, skipping state change handling');
      return;
    }

    const currentPath = this.getCurrentPath();
    const isAuthenticated = !!this.currentUser;
    const isProtectedRoute = this.protectedRoutes.some(protectedPath => currentPath.startsWith(protectedPath));

    console.log('=== HANDLING AUTH STATE CHANGE ===');
    console.log('Current path:', currentPath);
    console.log('Was authenticated:', wasAuthenticated);
    console.log('Is authenticated:', isAuthenticated);
    console.log('Is initial load:', this.isInitialLoad);
    console.log('Is protected route:', isProtectedRoute);

    // Handle authentication state changes
    if (isAuthenticated && !wasAuthenticated) {
      // User just logged in
      console.log('User just logged in');

      // If on auth page, redirect to dashboard
      if (currentPath === '/shine/auth') {
        console.log('User on auth page, redirecting to dashboard...');
        this.navigate('/shine/dashboard');
      }

    } else if (!isAuthenticated && wasAuthenticated) {
      // User just logged out
      console.log('User just logged out');
      if (isProtectedRoute) {
        console.log('User on protected route, redirecting to home...');
        this.navigate('/shine/');
      }

    } else if (!isAuthenticated && this.isInitialLoad) {
      // User not authenticated on initial load
      console.log('User not authenticated on initial load');

      if (isProtectedRoute) {
        console.log('Unauthenticated user on protected route, redirecting to home...');
        this.navigate('/shine/');
      }
    }
  }

  // Method to manually trigger navigation (for debugging)
  forceNavigate(path) {
    console.log('Force navigating to:', path);
    this.navigate(path);
  }

  // Method to check current auth state
  checkAuthState() {
    console.log('=== CURRENT AUTH STATE ===');
    console.log('Auth initialized:', this.authInitialized);
    console.log('Current user:', this.currentUser);
    console.log('Firebase Auth current user:', window.firebaseAuth?.currentUser);
    console.log('Current hash:', window.location.hash);
    console.log('Is initial load:', this.isInitialLoad);
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

  // Method to get route parameters (for use in pages)
  getRouteParams() {
    return this.currentPage?.routeParams || {};
  }

  // Method to update URL without triggering navigation (for dashboard filters)
  updateURL(path, replace = false) {
    if (replace) {
      window.location.replace('#' + path);
    } else {
      window.location.hash = path;
    }
  }

  // Wait for auth to be ready (for external use)
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
      console.error('Auth wait failed:', error);
      return null;
    }
  }
}