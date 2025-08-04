import { ref, set, remove, get, push, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { DashboardActionModals } from '/js/DashboardComponents/Dashboard.ActionModals.js';

function DashboardActions() {

  async function openProject(projectId, project) {
    console.log('Opening project:', projectId);

    // Don't open archived or deleted projects
    if (project.archived) {
      alert('Cannot open archived projects. Please restore it first.');
      return;
    }

    if (project.deleted) {
      alert('Cannot open deleted projects. Please restore it first.');
      return;
    }

    // Navigate to editor
    window.router.navigate(`/shine/editor/${projectId}`);
  }

  async function createProject(projectData) {
    const user = window.router.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    console.log('Creating project:', projectData);

    try {
      // Generate project ID
      const projectsRef = ref(window.firebaseDB, `users/${user.uid}/projects`);
      const newProjectRef = push(projectsRef);
      const projectId = newProjectRef.key;

      // Prepare project data
      const project = {
        name: projectData.name,
        owner: user.uid,
        ownerName: user.displayName || user.email,
        ownerEmail: user.email,
        createdAt: Date.now(),
        lastModified: Date.now(),
        isPublic: projectData.isPublic || false,
        archived: false,
        deleted: false,
        data: null
      };

      // Handle file upload if provided
      if (projectData.file && projectData.type === 'upload') {
        const fileContent = await readFile(projectData.file);
        try {
          const parsedData = JSON.parse(fileContent);
          project.data = parsedData;
        } catch (error) {
          console.error('Error parsing uploaded file:', error);
          throw new Error('Invalid JSON file format');
        }
      } else {
        // Create empty scene data for blank projects
        project.data = {
          metadata: {
            version: "1.0",
            type: "Object",
            generator: "Shine Editor"
          },
          geometries: [],
          materials: [],
          textures: [],
          images: [],
          animations: [],
          scene: {
            uuid: generateUUID(),
            type: "Scene",
            name: "Scene",
            layers: 1,
            matrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            children: []
          }
        };
      }

      // Save to user's projects
      await set(newProjectRef, project);

      // ALSO save to global projects index for easier querying
      const globalProjectRef = ref(window.firebaseDB, `projectsIndex/${projectId}`);
      const globalProjectData = {
        projectId: projectId,
        projectName: project.name,
        ownerEmail: user.email,
        ownerName: user.displayName || user.email,
        ownerId: user.uid,
        createdAt: project.createdAt,
        lastModified: project.lastModified,
        isPublic: project.isPublic,
        archived: project.archived,
        deleted: project.deleted
      };

      await set(globalProjectRef, globalProjectData);

      console.log('Project created successfully:', projectId);
      console.log('Global project index updated');

      return { projectId, project };

    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async function renameProject(projectId, project) {
    return new Promise((resolve, reject) => {
      const modal = DashboardActionModals.showRenameModal(
        project.name,
        async (newName) => {
          try {
            DashboardActionModals.closeModal(modal);

            const user = window.router.getCurrentUser();
            if (!user) {
              throw new Error('No authenticated user');
            }

            // Update project name in user's projects
            await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/name`), newName);
            await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/lastModified`), Date.now());

            // ALSO update global projects index
            await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
              projectName: newName,
              lastModified: Date.now()
            });

            console.log('Project renamed successfully');
            console.log('Global project index updated for rename');

            resolve(newName);
          } catch (error) {
            reject(error);
          }
        },
        () => {
          DashboardActionModals.closeModal(modal);
          resolve(null);
        }
      );
    });
  }

  async function copyProject(projectId, project) {
    return new Promise((resolve, reject) => {
      const modal = DashboardActionModals.showCopyModal(
        project.name,
        async (newName) => {
          try {
            DashboardActionModals.closeModal(modal);

            const user = window.router.getCurrentUser();
            if (!user) {
              throw new Error('No authenticated user');
            }

            // Create new project with copied data
            const projectsRef = ref(window.firebaseDB, `users/${user.uid}/projects`);
            const newProjectRef = push(projectsRef);
            const newProjectId = newProjectRef.key;

            // Create a clean copy with proper ownership and flags
            const newProject = {
              name: newName,
              owner: user.uid,  // Ensure current user is owner
              ownerName: user.displayName || user.email,
              ownerEmail: user.email, // Add email to project data
              createdAt: Date.now(),
              lastModified: Date.now(),
              isPublic: project.isPublic || false,
              archived: false,  // Ensure new copy is not archived
              deleted: false,   // Ensure new copy is not deleted
              isFavorite: false, // Reset favorite status for copy
              data: project.data ? JSON.parse(JSON.stringify(project.data)) : null // Deep copy of data
            };

            console.log('Creating copied project with data:', newProject);

            // Save to user's projects
            await set(newProjectRef, newProject);

            // ALSO update global projects index
            const globalProjectRef = ref(window.firebaseDB, `projectsIndex/${newProjectId}`);
            const globalProjectData = {
              projectId: newProjectId,
              projectName: newProject.name,
              ownerEmail: user.email,
              ownerName: user.displayName || user.email,
              ownerId: user.uid,
              createdAt: newProject.createdAt,
              lastModified: newProject.lastModified,
              isPublic: newProject.isPublic,
              archived: newProject.archived,
              deleted: newProject.deleted
            };

            await set(globalProjectRef, globalProjectData);

            console.log('Project copied successfully:', newProjectId);
            console.log('Global project index updated for copy');

            resolve({ projectId: newProjectId, project: newProject });
          } catch (error) {
            console.error('Error copying project:', error);
            reject(error);
          }
        },
        () => {
          DashboardActionModals.closeModal(modal);
          resolve(null);
        }
      );
    });
  }

  async function archiveProject(projectId, project) {
    return new Promise((resolve, reject) => {
      const modal = DashboardActionModals.showArchiveModal(
        project.name,
        async () => {
          try {
            DashboardActionModals.closeModal(modal);

            const user = window.router.getCurrentUser();
            if (!user) {
              throw new Error('No authenticated user');
            }

            console.log('Archiving project:', projectId, 'for user:', user.uid);
            console.log('Project owner:', project.owner);

            // Verify user owns this project
            if (project.owner !== user.uid) {
              throw new Error('You can only archive your own projects');
            }

            const projectRef = ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`);

            // Update multiple fields atomically
            const updates = {
              archived: true,
              lastModified: Date.now()
            };

            console.log('Updating Firebase with:', updates);
            console.log('Firebase path:', `users/${user.uid}/projects/${projectId}`);

            // Use update instead of set for partial updates
            await update(projectRef, updates);

            console.log('Firebase update completed successfully');

            // ALSO update global projects index
            await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
              archived: true,
              lastModified: Date.now()
            });

            // Verify the update worked by reading back
            const snapshot = await get(projectRef);
            const updatedProject = snapshot.val();
            console.log('Verification - project after update:', {
              id: projectId,
              name: updatedProject?.name,
              archived: updatedProject?.archived,
              deleted: updatedProject?.deleted
            });

            console.log('Global project index updated for archive');
            resolve(true);
          } catch (error) {
            console.error('Archive error:', error);
            console.error('Error details:', error.message);
            reject(error);
          }
        },
        () => {
          DashboardActionModals.closeModal(modal);
          resolve(false);
        }
      );
    });
  }

  async function deleteProject(projectId, project) {
    return new Promise((resolve, reject) => {
      const modal = DashboardActionModals.showDeleteModal(
        project.name,
        async () => {
          try {
            DashboardActionModals.closeModal(modal);

            const user = window.router.getCurrentUser();
            if (!user) {
              throw new Error('No authenticated user');
            }

            console.log('Deleting project:', projectId, 'for user:', user.uid);
            console.log('Project owner:', project.owner);

            // Verify user owns this project
            if (project.owner !== user.uid) {
              throw new Error('You can only delete your own projects');
            }

            const projectRef = ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`);

            // Update multiple fields atomically
            const updates = {
              deleted: true,
              lastModified: Date.now()
            };

            console.log('Updating Firebase with:', updates);
            console.log('Firebase path:', `users/${user.uid}/projects/${projectId}`);

            // Use update instead of set for partial updates
            await update(projectRef, updates);

            console.log('Firebase update completed successfully');

            // ALSO update global projects index
            await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
              deleted: true,
              lastModified: Date.now()
            });

            // Verify the update worked by reading back
            const snapshot = await get(projectRef);
            const updatedProject = snapshot.val();
            console.log('Verification - project after update:', {
              id: projectId,
              name: updatedProject?.name,
              archived: updatedProject?.archived,
              deleted: updatedProject?.deleted
            });

            console.log('Global project index updated for delete');
            resolve(true);
          } catch (error) {
            console.error('Delete error:', error);
            console.error('Error details:', error.message);
            reject(error);
          }
        },
        () => {
          DashboardActionModals.closeModal(modal);
          resolve(false);
        }
      );
    });
  }

  // NEW: Restore project from archive or trash
  async function restoreProject(projectId, project) {
    try {
      const user = window.router.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      console.log('Restoring project:', projectId);

      // Remove archived and deleted flags
      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/archived`), false);
      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/deleted`), false);
      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/lastModified`), Date.now());

      // ALSO update global projects index
      await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
        archived: false,
        deleted: false,
        lastModified: Date.now()
      });

      console.log('Project restored successfully');
      console.log('Global project index updated for restore');
      return true;
    } catch (error) {
      console.error('Error restoring project:', error);
      throw error;
    }
  }

  // NEW: Permanently delete project from database
  async function permanentDeleteProject(projectId, project) {
    try {
      // Single confirmation
      const confirmDelete = confirm(
        `Are you sure you want to permanently delete "${project.name}"?\n\n` +
        'This action cannot be undone and will remove the project from the database completely.'
      );

      if (!confirmDelete) {
        return false;
      }

      const user = window.router.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }

      console.log('Permanently deleting project:', projectId);

      // Remove project completely from Firebase
      await remove(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`));

      // ALSO remove from global projects index
      await remove(ref(window.firebaseDB, `projectsIndex/${projectId}`));

      console.log('Project permanently deleted from database');
      console.log('Project removed from global index');
      return true;
    } catch (error) {
      console.error('Error permanently deleting project:', error);
      throw error;
    }
  }

  async function downloadProject(projectId, project) {
    try {
      console.log('Downloading project:', projectId);

      // Prepare project data for download
      let projectData = {
        metadata: {
          name: project.name,
          created: new Date(project.createdAt).toISOString(),
          modified: new Date(project.lastModified).toISOString(),
          version: "1.0"
        },
        ...project.data
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(projectData, null, 2);

      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${project.name || 'project'}.json`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      console.log('Project downloaded successfully');
    } catch (error) {
      console.error('Error downloading project:', error);
      throw error;
    }
  }

  // Helper functions
  function readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Public API
  return {
    openProject,
    createProject,
    renameProject,
    copyProject,
    archiveProject,
    deleteProject,
    restoreProject,        // NEW
    permanentDeleteProject, // NEW
    downloadProject
  };
}

export { DashboardActions };