import { ref, set, remove, get, push, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { DashboardActionModals } from '/js/DashboardComponents/Dashboard.ActionModals.js';

function DashboardActions() {

  async function openProject(projectId, project) {

    if (project.archived) {
      alert('Cannot open archived projects. Please restore it first.');
      return;
    }

    if (project.deleted) {
      alert('Cannot open deleted projects. Please restore it first.');
      return;
    }

    window.router.navigate(`/editor/${projectId}`);
  }

  async function createProject(projectData) {
    const user = window.router.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    try {
      const projectsRef = ref(window.firebaseDB, `users/${user.uid}/projects`);
      const newProjectRef = push(projectsRef);
      const projectId = newProjectRef.key;

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

      if (projectData.file && projectData.type === 'upload') {
        const fileContent = await readFile(projectData.file);
        try {
          const parsedData = JSON.parse(fileContent);
          project.data = parsedData;
        } catch (error) {
          throw new Error('Invalid JSON file format');
        }
      } else if (projectData.data) {
        console.log('Using provided project data:', {
          size: JSON.stringify(projectData.data).length,
          hasScene: !!projectData.data.scene,
          objectCount: projectData.data.scene?.children?.length || 0
        });
        project.data = projectData.data;
      } else {
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

      console.log('Saving project with data:', {
        name: project.name,
        dataSize: JSON.stringify(project.data).length,
        hasScene: !!project.data.scene,
        objectCount: project.data.scene?.children?.length || 0
      });

      await set(newProjectRef, project);

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

      console.log('Project created successfully:', {
        projectId,
        name: project.name,
        dataPreserved: !!projectData.data
      });

      return { projectId, project };

    } catch (error) {
      console.error(' Error in createProject:', error);
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

            await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/name`), newName);
            await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/lastModified`), Date.now());

            await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
              projectName: newName,
              lastModified: Date.now()
            });


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

            const projectsRef = ref(window.firebaseDB, `users/${user.uid}/projects`);
            const newProjectRef = push(projectsRef);
            const newProjectId = newProjectRef.key;

            const newProject = {
              name: newName,
              owner: user.uid, 
              ownerName: user.displayName || user.email,
              ownerEmail: user.email,
              createdAt: Date.now(),
              lastModified: Date.now(),
              isPublic: project.isPublic || false,
              archived: false,  
              deleted: false,   
              isFavorite: false, 
              data: project.data ? JSON.parse(JSON.stringify(project.data)) : null 
            };


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


            resolve({ projectId: newProjectId, project: newProject });
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

            if (project.owner !== user.uid) {
              throw new Error('You can only archive your own projects');
            }

            const projectRef = ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`);

            const updates = {
              archived: true,
              lastModified: Date.now()
            };

            await update(projectRef, updates);

            await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
              archived: true,
              lastModified: Date.now()
            });

            const snapshot = await get(projectRef);
            const updatedProject = snapshot.val();
            console.log('Verification - project after update:', {
              id: projectId,
              name: updatedProject?.name,
              archived: updatedProject?.archived,
              deleted: updatedProject?.deleted
            });

            resolve(true);
          } catch (error) {
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

            if (project.owner !== user.uid) {
              throw new Error('You can only delete your own projects');
            }

            const projectRef = ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`);

            const updates = {
              deleted: true,
              lastModified: Date.now()
            };

            console.log('Updating Firebase with:', updates);
            console.log('Firebase path:', `users/${user.uid}/projects/${projectId}`);

            await update(projectRef, updates);


            await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
              deleted: true,
              lastModified: Date.now()
            });

            const snapshot = await get(projectRef);
            const updatedProject = snapshot.val();
            console.log('Verification - project after update:', {
              id: projectId,
              name: updatedProject?.name,
              archived: updatedProject?.archived,
              deleted: updatedProject?.deleted
            });

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

  async function restoreProject(projectId, project) {
    try {
      const user = window.router.getCurrentUser();
      if (!user) {
        throw new Error('No authenticated user');
      }


      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/archived`), false);
      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/deleted`), false);
      await set(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}/lastModified`), Date.now());

      await update(ref(window.firebaseDB, `projectsIndex/${projectId}`), {
        archived: false,
        deleted: false,
        lastModified: Date.now()
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  async function permanentDeleteProject(projectId, project) {
    try {
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


      await remove(ref(window.firebaseDB, `users/${user.uid}/projects/${projectId}`));

      await remove(ref(window.firebaseDB, `projectsIndex/${projectId}`));

      return true;
    } catch (error) {
      throw error;
    }
  }

  async function downloadProject(projectId, project) {
    try {

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

    } catch (error) {
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
    restoreProject,        
    permanentDeleteProject, 
    downloadProject
  };
}

export { DashboardActions };