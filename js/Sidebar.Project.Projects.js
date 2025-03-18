import { UIButton, UIPanel, UIRow, UIText, UINotification, UIModal, UIProgressModal, UITextArea, UIDiv } from './libs/ui.js';
import { ProjectAPI } from './factory/ProjectAPIs.js';
import { PatternEraser } from './factory/PatternEraser.js';
import { Factory } from './factory/Factory.js'


function SidebarProjects(editor) {
    const signals = editor.signals;
    const strings = editor.strings;
    const container = new UIPanel();
    const projectsList = new UIPanel();
    const notification = new UINotification();

    function clearProjectsList() {
        while (projectsList.dom.firstChild) {
            projectsList.dom.removeChild(projectsList.dom.firstChild);
        }
    }

    // Store project order
    function saveProjectOrder() {
        const userEmail = localStorage.getItem('userEmail');
        const projects = Array.from(projectsList.dom.children).map(row =>
            row.getAttribute('data-project')
        );
        localStorage.setItem(`projectOrder_${userEmail}`, JSON.stringify(projects));
    }

    // Load project order
    function loadProjectOrder() {
        const userEmail = localStorage.getItem('userEmail');
        const order = JSON.parse(localStorage.getItem(`projectOrder_${userEmail}`) || '[]');
        return order;
    }

    async function loadUserProjects() {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        try {
            clearProjectsList();
            const response = await ProjectAPI.getUserProjects(userEmail);

            if (!response.projects) {
                throw new Error('Invalid server response');
            }

            const projects = response.projects;
            const order = loadProjectOrder();

            // Sort projects based on saved order
            const sortedProjects = projects.sort((a, b) => {
                const indexA = order.indexOf(a['project-name']);
                const indexB = order.indexOf(b['project-name']);
                return indexA - indexB;
            });

            sortedProjects.forEach(project => {
                if (project['project-name']) {
                    addProjectButton(project['project-name']);
                }
            });
        } catch (error) {
            notification.show(error.message || 'Failed to load projects', 'error');
        }
    }

    function addProjectButton(title) {
        const projectRow = new UIRow();

        projectRow.dom.draggable = true;
        projectRow.dom.setAttribute('data-project', title);

        // Drag events
        projectRow.dom.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', title);
            e.target.style.opacity = '0.4';
        });

        projectRow.dom.addEventListener('dragend', (e) => {
            e.target.style.opacity = '1';
            saveProjectOrder();
        });

        projectRow.dom.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        projectRow.dom.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedTitle = e.dataTransfer.getData('text/plain');
            const draggedRow = projectsList.dom.querySelector(`[data-project="${draggedTitle}"]`);
            const targetRow = e.currentTarget;

            if (draggedRow && targetRow !== draggedRow) {
                const rect = targetRow.getBoundingClientRect();
                const mid = rect.top + rect.height / 2;
                if (e.clientY < mid) {
                    targetRow.parentNode.insertBefore(draggedRow, targetRow);
                } else {
                    targetRow.parentNode.insertBefore(draggedRow, targetRow.nextSibling);
                }
            }
        });

        // Project Title
        const projectTitle = new UIDiv();
        projectTitle.dom.textContent = title;
        projectTitle.dom.style.padding = '8px 12px';
        projectTitle.dom.style.fontSize = '13px';
        projectTitle.dom.style.fontFamily = 'Arial, sans-serif';
        projectTitle.dom.style.borderRadius = '4px';
        projectTitle.dom.style.flex = '1';
        projectTitle.dom.style.overflow = 'hidden';
        projectTitle.dom.style.textOverflow = 'ellipsis';
        projectTitle.dom.style.whiteSpace = 'nowrap';

        projectTitle.dom.addEventListener('mouseover', function () {
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
        });

        projectTitle.dom.addEventListener('mouseout', function () {
            this.style.backgroundColor = 'transparent';
        });

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            projectTitle.dom.style.color = '#aaa';
            projectTitle.dom.addEventListener('mouseover', function () {
                this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            });
        }

        projectTitle.onClick(function () {
            console.log('Project selected:', title);
        });

        // Simulate Button
        const simulateButton = new UIButton('▶');
        simulateButton.setMarginLeft('8px');
        simulateButton.dom.style.color = '#0a0';
        simulateButton.dom.style.fontWeight = 'bold';

        simulateButton.onClick(async function () {
            const userEmail = localStorage.getItem('userEmail');
            const progressModal = new UIProgressModal('Simulating...');

            try {
                // Get project files from server
                const files = await ProjectAPI.getProjectFiles(userEmail, title);

                if (!files.tgFile || !files.macFile) {
                    throw new Error('Invalid file content received');
                }

                const tgContent = files.tgFile;
                const macContent = files.macFile;


                // preview modal
                const modal = new UIModal(`Simulation Preview: ${title}`);

                const previewContainer = document.createElement('div');
                previewContainer.style.display = 'flex';
                previewContainer.style.gap = '20px';

                // TG Container
                const tgContainer = document.createElement('div');
                tgContainer.style.flex = '1';

                const tgHeader = document.createElement('div');
                tgHeader.textContent = 'Detector Configuration (detector.tg)';
                tgHeader.style.marginBottom = '8px';
                tgHeader.style.fontWeight = 'bold';
                tgContainer.appendChild(tgHeader);

                const tgPreview = new UITextArea().dom;
                tgPreview.value = tgContent;
                tgPreview.style.width = '100%';
                tgPreview.style.height = '300px';
                tgPreview.style.fontFamily = 'monospace';
                tgPreview.style.marginBottom = '10px';
                tgPreview.style.resize = 'none';
                tgPreview.spellcheck = false;
                tgPreview.setAttribute('wrap', 'off')
                tgContainer.appendChild(tgPreview);

                // MAC Container
                const macContainer = document.createElement('div');
                macContainer.style.flex = '1';

                const macHeader = document.createElement('div');
                macHeader.textContent = 'Run Configuration (run.mac)';
                macHeader.style.marginBottom = '8px';
                macHeader.style.fontWeight = 'bold';
                macContainer.appendChild(macHeader);

                const macPreview = new UITextArea().dom;
                macPreview.value = macContent;
                macPreview.style.width = '100%';
                macPreview.style.height = '300px';
                macPreview.style.fontFamily = 'monospace';
                macPreview.style.marginBottom = '10px';
                macPreview.style.resize = 'none';
                macPreview.spellcheck = false;
                macPreview.setAttribute('wrap', 'off');
                macContainer.appendChild(macPreview);

                // Track changes
                let hasChanges = false;
                const originalTgContent = tgContent;
                const originalMacContent = macContent;

                // Update Button
                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update Changes';
                updateButton.style.padding = '8px 16px';
                updateButton.style.marginRight = '10px';
                updateButton.style.display = 'none';

                updateButton.onclick = async () => {
                    try {

                        const mac_blob = new Blob([macPreview.value], { type: 'text/plain' });
                        const tg_blob = new Blob([tgPreview.value], { type: 'text/plain' });

                        const updated = await ProjectAPI.updateProject(userEmail, title, mac_blob, tg_blob);
                        notification.show('Changes saved successfully', 'success');
                    } catch (error) {
                        notification.show('Failed to save changes', 'error');
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
                simulateButtonModal.textContent = 'Start Simulation';
                simulateButtonModal.style.padding = '8px 16px';

                simulateButtonModal.onclick = async () => {
                    const progressModal = new UIProgressModal('Simulating...');
                    try {
                        progressModal.show();
                        progressModal.setProgress(30);

                        const tg_blob = new Blob([tgPreview.value], { type: 'text/plain' });
                        const mac_blob = new Blob([macPreview.value], { type: 'text/plain' });

                        const result = await ProjectAPI.simulateProject(
                            userEmail,
                            title,
                            tg_blob,
                            mac_blob
                        );

                        if (result.Status !== 'Success') {
                            throw new Error(result.message || 'Simulation failed');
                        }

                        if (result.Status === 'Success') {
                            progressModal.setProgress(60);

                            try {
                                const wrlContent = PatternEraser.removeSolids(await ProjectAPI.getFileContent(
                                    userEmail,
                                    title,
                                    result.filename
                                ));

                                progressModal.setProgress(100);
                                await progressModal.hide();

                                const wrlContainer = document.createElement('div');
                                wrlContainer.style.marginTop = '20px';

                                const wrlHeader = document.createElement('div');
                                wrlHeader.textContent = 'Simulation Result (.wrl)';
                                wrlHeader.style.fontWeight = 'bold';
                                wrlHeader.style.marginBottom = '8px';
                                wrlContainer.appendChild(wrlHeader);

                                const wrlPreview = document.createElement('textarea');
                                wrlPreview.value = wrlContent;
                                wrlPreview.readOnly = true;
                                wrlPreview.style.width = '100%';
                                wrlPreview.style.height = '250px';
                                wrlPreview.style.fontFamily = 'monospace';
                                wrlContainer.appendChild(wrlPreview);

                                previewContainer.appendChild(wrlContainer);

                                const downloadButton = document.createElement('button');
                                downloadButton.textContent = 'Download Result';
                                downloadButton.style.padding = '8px 16px';
                                downloadButton.onclick = () => {
                                    const blob = new Blob([wrlContent], { type: 'text/plain' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = result.filename;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    URL.revokeObjectURL(url);
                                };

                                simulateButtonModal.replaceWith(downloadButton);
                                notification.show('Simulation completed successfully', 'success');

                            } catch (fileError) {
                                await progressModal.hide();
                                notification.show(error.message || 'Failed to get simulation results', 'error');
                            }
                        }
                    } catch (error) {
                        notification.show(error.message || 'Failed to prepare simulation', 'error');
                        await progressModal.hide();
                    }
                };

                // Button container
                const buttonContainer = document.createElement('div');
                buttonContainer.style.marginTop = '20px';
                buttonContainer.style.textAlign = 'right';
                buttonContainer.style.position = 'sticky';
                buttonContainer.style.bottom = '0';
                buttonContainer.style.backgroundColor = 'inherit';
                buttonContainer.style.padding = '10px 0';
                buttonContainer.appendChild(updateButton);
                buttonContainer.appendChild(simulateButtonModal);

                // previewContainer.appendChild(buttonContainer);
                modal.footer.appendChild(buttonContainer);
                modal.setContent(previewContainer);
                modal.show();

            } catch (error) {
                notification.show('Failed to prepare simulation', 'error');
            }
        });

        // Delete Button
        const deleteButton = new UIButton('×');
        deleteButton.setMarginLeft('8px');
        deleteButton.dom.style.color = '#f00';
        deleteButton.dom.style.fontWeight = 'bold';

        deleteButton.onClick(async function () {
            const userEmail = localStorage.getItem('userEmail');
            if (confirm(`Are you sure you want to delete project "${title}"? This action cannot be undone.`)) {
                try {
                    await ProjectAPI.deleteProject(userEmail, title);
                    projectsList.remove(projectRow);
                    notification.show('Project deleted successfully', 'success');
                } catch (error) {
                    notification.show('Failed to delete project', 'error');
                }
            }
        });

        projectRow.add(projectTitle);
        projectRow.add(simulateButton);
        projectRow.add(deleteButton);
        projectsList.add(projectRow);

        saveProjectOrder();
    }


    // Event Listeners
    signals.userLoggedIn.add(function (userEmail) {
        loadUserProjects();
    });

    signals.userLoggedOut.add(function () {
        clearProjectsList();
    });

    signals.projectCreated.add(function (projectName) {
        loadUserProjects();
    });

    const headerRow = new UIRow();
    headerRow.add(new UIText(strings.getKey('sidebar/project/projectlist')));
    container.add(headerRow);
    container.add(projectsList);

    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
        loadUserProjects();
    }

    return container;
}

export { SidebarProjects };