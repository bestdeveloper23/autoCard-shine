import { UIButton, UIPanel, UIRow, UIText, UINotification, UIModal, UIProgressModal, UITextArea, UIDiv } from './libs/ui.js';
import { ProjectAPI } from './factory/ProjectAPIs.js';
import { PatternModifier } from './factory/PatternModifier.js';
import { Factory } from './factory/Factory.js'

function SidebarProjects(editor) {
    const signals = editor.signals;
    const strings = editor.strings;
    const container = new UIPanel();
    const notification = new UINotification();
    
    let currentSimulationProject = null;
    let currentDashboardProjectId = null;
    let simulationExists = false;
    let isOperationInProgress = false;
    let projectChangeInterval = null;
    let isDestroyed = false;
    let currentModal = null; // Track current modal

    const projectRow = new UIRow();
    projectRow.setClass('simulation-project-row');
    
    const projectDisplay = new UIDiv();
    projectDisplay.setClass('project-display');
    
    const projectNameSpan = new UIDiv();
    projectNameSpan.setClass('project-name-display');
    
    const buttonsContainer = new UIDiv();
    buttonsContainer.setClass('project-buttons');

    const simulateButton = new UIButton('▶');
    simulateButton.setClass('simulate-btn');
    simulateButton.dom.title = 'Simulate';

    function getCurrentProjectInfo() {
        const editorInstance = window.editorPageInstance;
        if (!editorInstance || !editorInstance.projectId) return null;

        const originalName = editorInstance.projectName || 'Untitled Project';
        const projectName = originalName.replace(/[^a-zA-Z0-9]/g, '_');
        
        return {
            id: editorInstance.projectId,
            name: originalName || 'Untitled Project',
            simulationName: projectName || 'Untitled Project'
        };
    }

    function updateProjectNameOnly() {
        const projectInfo = getCurrentProjectInfo();
        if (!projectInfo) {
            projectNameSpan.dom.textContent = 'No Project';
            simulateButton.dom.style.display = 'none';
            projectDisplay.removeClass('has-simulation');
            projectDisplay.addClass('no-simulation');
            return;
        }

        projectNameSpan.dom.textContent = projectInfo.name;
        simulateButton.dom.style.display = 'inline-block';
        simulateButton.dom.disabled = false;
        simulateButton.dom.title = 'Simulate';
        
        // Check if simulation exists when project changes
        checkSimulationExists().then(() => {
            updateProjectDisplay();
        });
    }

    function updateProjectDisplay() {
        const projectInfo = getCurrentProjectInfo();
        if (!projectInfo) {
            projectNameSpan.dom.textContent = 'No Project';
            projectDisplay.removeClass('has-simulation');
            projectDisplay.addClass('no-simulation');
            simulateButton.dom.style.display = 'none';
            return;
        }

        projectNameSpan.dom.textContent = projectInfo.name;
        simulateButton.dom.style.display = 'inline-block';
        
        if (isOperationInProgress) {
            simulateButton.dom.disabled = true;
            simulateButton.dom.title = 'Creating simulation...';
        } else {
            simulateButton.dom.disabled = false;
            simulateButton.dom.title = 'Simulate';
            
            if (simulationExists) {
                projectDisplay.removeClass('no-simulation');
                projectDisplay.addClass('has-simulation');
            } else {
                projectDisplay.removeClass('has-simulation');
                projectDisplay.addClass('no-simulation');
            }
        }
    }

    async function retryApiCall(apiCall, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * attempt));
            }
        }
    }

    async function checkSimulationExists() {
        const projectInfo = getCurrentProjectInfo();
        if (!projectInfo) {
            simulationExists = false;
            return false;
        }

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
            simulationExists = false;
            return false;
        }

        try {
            const response = await retryApiCall(() => ProjectAPI.getUserProjects(userEmail));
            const projects = response.projects || [];
            
            const simProject = projects.find(p => p['project-name'] === projectInfo.simulationName);
            simulationExists = !!simProject;
            currentSimulationProject = simProject;
            
            return simulationExists;
        } catch (error) {
            console.warn('Failed to check simulation existence:', error);
            simulationExists = false;
            return false;
        }
    }

    async function cleanupAllProjects() {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        try {
            const response = await ProjectAPI.getUserProjects(userEmail);
            const projects = response.projects || [];
            
            // Delete all existing projects
            for (const project of projects) {
                try {
                    await ProjectAPI.deleteProject(userEmail, project['project-name']);
                    console.log(`Cleaned up project: ${project['project-name']}`);
                } catch (error) {
                    console.warn(`Failed to cleanup project ${project['project-name']}:`, error);
                }
            }
        } catch (error) {
            console.warn('Failed to cleanup projects:', error);
        }
    }

    async function createSimulationAndRun() {
        if (isOperationInProgress) return;
        
        const projectInfo = getCurrentProjectInfo();
        const userEmail = localStorage.getItem('userEmail');
        
        if (!projectInfo || !userEmail) {
            notification.show('Project information not available', 'error');
            return;
        }

        isOperationInProgress = true;
        updateProjectDisplay();

        const progressModal = new UIProgressModal('Preparing simulation...');
        
        try {
            progressModal.show();
            progressModal.setProgress(10);

            // Clean up all existing projects first
            await cleanupAllProjects();
            progressModal.setProgress(30);

            const mac = await Factory.exportMacro(editor);
            const tg = await Factory.exportTg(editor);

            if (!mac || !tg) {
                throw new Error('Failed to export scene data');
            }

            progressModal.setProgress(60);
            
            simulationExists = true;
            currentSimulationProject = projectInfo.simulationName;

            progressModal.setProgress(100);
            await progressModal.hide();
            
            showSimulationModal(projectInfo, userEmail, mac, tg);

        } catch (error) {
            await progressModal.hide();
            
            let errorMessage = 'Failed to prepare simulation';
            if (error.message) {
                errorMessage += ': ' + error.message;
            }
            
            notification.show(errorMessage, 'error');
            
            simulationExists = false;
            currentSimulationProject = null;
        } finally {
            isOperationInProgress = false;
            updateProjectDisplay();
        }
    }

    function showSimulationModal(projectInfo, userEmail, macContent, tgContent) {
        // Close any existing modal first
        if (currentModal) {
            currentModal.hide();
            currentModal = null;
        }

        const modal = new UIModal(`Simulation Preview: ${projectInfo.name}`);
        currentModal = modal; // Track the current modal

        // Add custom close handler
        const originalHide = modal.hide.bind(modal);
        modal.hide = function() {
            currentModal = null;
            return originalHide();
        };

        const previewContainer = document.createElement('div');
        previewContainer.className = 'simulation-preview-container';

        // TG Container
        const tgContainer = document.createElement('div');
        tgContainer.className = 'simulation-file-container';

        const tgHeader = document.createElement('div');
        tgHeader.className = 'simulation-file-header';
        tgHeader.textContent = 'Detector Configuration (detector.tg)';
        tgContainer.appendChild(tgHeader);

        const tgPreview = new UITextArea().dom;
        tgPreview.className = 'simulation-textarea';
        tgPreview.value = tgContent;
        tgPreview.spellcheck = false;
        tgPreview.setAttribute('wrap', 'off');
        tgContainer.appendChild(tgPreview);

        // MAC Container
        const macContainer = document.createElement('div');
        macContainer.className = 'simulation-file-container';

        const macHeader = document.createElement('div');
        macHeader.className = 'simulation-file-header';
        macHeader.textContent = 'Run Configuration (run.mac)';
        macContainer.appendChild(macHeader);

        const macPreview = new UITextArea().dom;
        macPreview.className = 'simulation-textarea';
        macPreview.value = macContent;
        macPreview.spellcheck = false;
        macPreview.setAttribute('wrap', 'off');
        macContainer.appendChild(macPreview);

        // Track changes
        let hasChanges = false;
        const originalTgContent = tgContent;
        const originalMacContent = macContent;

        // Update Button
        const updateButton = document.createElement('button');
        updateButton.className = 'simulation-update-button';
        updateButton.textContent = 'Update Changes';
        updateButton.style.display = 'none';

        updateButton.onclick = async () => {
            try {
                updateButton.disabled = true;
                updateButton.textContent = 'Updating...';

                const mac_blob = new Blob([macPreview.value], { type: 'text/plain' });
                const tg_blob = new Blob([tgPreview.value], { type: 'text/plain' });

                await ProjectAPI.updateProject(userEmail, projectInfo.simulationName, mac_blob, tg_blob);
                notification.show('Changes saved successfully', 'success');
                hasChanges = false;
                updateButton.style.display = 'none';
            } catch (error) {
                notification.show('Failed to save changes', 'error');
            } finally {
                updateButton.disabled = false;
                updateButton.textContent = 'Update Changes';
            }
        };

        // Change listeners
        [tgPreview, macPreview].forEach(textarea => {
            textarea.addEventListener('input', () => {
                hasChanges = tgPreview.value !== originalTgContent ||
                    macPreview.value !== originalMacContent;
                updateButton.style.display = hasChanges ? 'inline-block' : 'none';
            });
        });

        previewContainer.appendChild(tgContainer);
        previewContainer.appendChild(macContainer);

        // Simulate button
        const simulateButtonModal = document.createElement('button');
        simulateButtonModal.className = 'simulation-run-button';
        simulateButtonModal.textContent = 'Start Simulation';

        simulateButtonModal.onclick = async () => {
            const progressModal = new UIProgressModal('Running simulation...');
            
            try {
                progressModal.show();
                progressModal.setProgress(10);

                simulateButtonModal.disabled = true;
                simulateButtonModal.textContent = 'Simulating...';

                const tg_blob = new Blob([tgPreview.value], { type: 'text/plain' });
                const mac_blob = new Blob([macPreview.value], { type: 'text/plain' });

                progressModal.setProgress(20);

                // Create the project
                try {
                    await ProjectAPI.createProject(userEmail, projectInfo.simulationName, mac_blob, tg_blob);
                    console.log('Project created successfully');
                } catch (createError) {
                    console.warn('Project creation failed:', createError);
                    throw createError;
                }

                progressModal.setProgress(40);

                // Run simulation
                const result = await retryApiCall(() => 
                    ProjectAPI.simulateProject(userEmail, projectInfo.simulationName, tg_blob, mac_blob)
                );

                if (result.Status !== 'Success') {
                    throw new Error(result.Message || result.message || 'Simulation failed');
                }

                progressModal.setProgress(60);
                
                // Get results
                const wrlContent = await retryApiCall(() =>
                    ProjectAPI.getFileContent(userEmail, projectInfo.simulationName, result.filename)
                );

                progressModal.setProgress(100);
                await progressModal.hide();

                // Show results
                showSimulationResults(previewContainer, wrlContent, result.filename);
                
                simulateButtonModal.style.display = 'none';
                updateButton.style.display = 'none';
                notification.show('Simulation completed successfully!', 'success');

            } catch (error) {
                await progressModal.hide();
                
                let errorMsg = 'Simulation failed';
                if (error.message) {
                    errorMsg += ': ' + error.message;
                }
                notification.show(errorMsg, 'error');
                
                simulateButtonModal.disabled = false;
                simulateButtonModal.textContent = 'Start Simulation';
            }
        };

        // Button container
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'simulation-button-container';
        buttonContainer.appendChild(updateButton);
        buttonContainer.appendChild(simulateButtonModal);

        modal.footer.appendChild(buttonContainer);
        modal.setContent(previewContainer);
        modal.show();
    }

    function showSimulationResults(container, wrlContent, filename) {
        // Add WRL container to the side
        const wrlContainer = document.createElement('div');
        wrlContainer.className = 'simulation-wrl-container';

        const wrlHeader = document.createElement('div');
        wrlHeader.className = 'simulation-wrl-header';
        wrlHeader.textContent = `Simulation Result (${filename})`;
        wrlContainer.appendChild(wrlHeader);

        const wrlPreview = document.createElement('textarea');
        wrlPreview.className = 'simulation-wrl-textarea';
        wrlPreview.value = wrlContent;
        wrlPreview.readOnly = true;
        wrlContainer.appendChild(wrlPreview);

        const downloadButton = document.createElement('button');
        downloadButton.className = 'simulation-download-button';
        downloadButton.textContent = 'Download Result';
        
        downloadButton.onclick = () => {
            const blob = new Blob([wrlContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        wrlContainer.appendChild(downloadButton);
        container.appendChild(wrlContainer);
    }

    function handleProjectChange() {
        const projectInfo = getCurrentProjectInfo();
        const newProjectId = projectInfo?.id;
        
        if (newProjectId !== currentDashboardProjectId) {
            currentDashboardProjectId = newProjectId;
            simulationExists = false;
            currentSimulationProject = null;
            
            // Close any open modal when project changes
            if (currentModal) {
                currentModal.hide();
                currentModal = null;
            }
        }
        
        updateProjectNameOnly();
    }

    function initialize() {
        setupAutoCleanup();
        
        if (editor.signals && editor.signals.sceneGraphChanged) {
            editor.signals.sceneGraphChanged.add(() => {
                updateProjectNameOnly();
            });
        }
        
        setTimeout(() => {
            if (!isDestroyed) {
                handleProjectChange();
            }
        }, 500);
        
        projectChangeInterval = setInterval(() => {
            if (!isDestroyed) {
                handleProjectChange();
            }
        }, 5000);
    }

    async function destroy() {
        isDestroyed = true;
        
        // Close any open modal
        if (currentModal) {
            currentModal.hide();
            currentModal = null;
        }
        
        if (projectChangeInterval) {
            clearInterval(projectChangeInterval);
            projectChangeInterval = null;
        }
        
        // Cleanup projects on destroy
        await cleanupAllProjects();
        
        currentSimulationProject = null;
        currentDashboardProjectId = null;
        simulationExists = false;
        isOperationInProgress = false;
    }

    function setupAutoCleanup() {
        const cleanup = async () => {
            // Close modal if open
            if (currentModal) {
                currentModal.hide();
                currentModal = null;
            }
            
            // Cleanup all projects
            try {
                const userEmail = localStorage.getItem('userEmail');
                if (userEmail) {
                    // Use sendBeacon for immediate cleanup, fallback to regular cleanup
                    if (navigator.sendBeacon) {
                        const response = await ProjectAPI.getUserProjects(userEmail);
                        const projects = response.projects || [];
                        
                        for (const project of projects) {
                            const formData = new FormData();
                            formData.append('username', userEmail);
                            formData.append('project_name', project['project-name']);
                            navigator.sendBeacon('https://aws.physino.xyz/delete-project', formData);
                        }
                    } else {
                        await cleanupAllProjects();
                    }
                }
            } catch (error) {
                console.warn('Failed to cleanup on unload:', error);
            }
        };

        // Handle page navigation/close
        window.addEventListener('beforeunload', cleanup);
        window.addEventListener('pagehide', cleanup);
        
        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            if (currentModal) {
                currentModal.hide();
                currentModal = null;
            }
        });
        
        // Handle editor cleanup
        if (editor.signals && editor.signals.editorCleared) {
            editor.signals.editorCleared.add(() => {
                destroy();
            });
        }
    }

    // Setup UI
    simulateButton.onClick(createSimulationAndRun);
    projectDisplay.add(projectNameSpan);
    buttonsContainer.add(simulateButton);
    projectRow.add(projectDisplay);
    projectRow.add(buttonsContainer);

    const headerRow = new UIRow();
    headerRow.add(new UIText('Project').setWidth('100px'));
    container.add(headerRow);
    container.add(projectRow);

    // Initialize
    initialize();
    container.destroy = destroy;

    return container;
}

export { SidebarProjects };