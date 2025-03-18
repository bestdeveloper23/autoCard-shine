
export const ProjectAPI = {
    async createProject(username, projectName, macBlob, tgBlob) {

        const mac_File = new File([macBlob], 'run.mac', { type: 'text/plain' });
        const tg_File = new File([tgBlob], 'detector.tg', { type: 'text/plain' });

        const formData = new FormData();
        formData.append('username', username);
        formData.append('project_name', projectName);
        formData.append('file', mac_File);
        formData.append('file', tg_File);

        try {
            const response = await fetch('https://aws.physino.xyz/create-project/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.message || 'Failed to create project');
            }

            return await response.json();
        } catch (error) {
            throw error.message || 'Network error occurred';
        }
    },

    async deleteProject(username, projectName) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('project_name', projectName);

        try {
            const response = await fetch('https://aws.physino.xyz/delete-project', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Failed to delete ${projectName}.`)
            }

            return await response.json();

        } catch (error) {
            throw error.message;
        }

    },
    async getFileNames(username, projectName) {

        const formData = new FormData();
        formData.append('username', username);
        formData.append('project_name', projectName);

        try {
            const response = await fetch('https://aws.physino.xyz/get-Mac-tg-files/', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error(response.message || 'Failed to get the files')
            }

            const result = await response.json();
            return result;

        } catch (error) {

            throw error.message
        }

    },
    async fetchFileContent(userName, projectName, fileName) {
        const formData = new FormData();
        formData.append('username', userName);
        formData.append('project_name', projectName);
        formData.append('filename', fileName);

        try {
            const response = await fetch('https://aws.physino.xyz/get-files/', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error(response.message || 'failed to fetech file content')
            }

            const data = await response.text();
            return data;
        } catch (error) {
            throw error
        }

    },
    async getProjectFiles(username, projectName) {

        try {

            const fileNames = await this.getFileNames(username, projectName);
            const [macContent, tgContent] = await Promise.all([
                this.fetchFileContent(username, projectName, fileNames.macfilename),
                this.fetchFileContent(username, projectName, fileNames.tgfilename)
            ])

            // Handle file content
            const result = {
                macFile: macContent,
                tgFile: tgContent
            }

            return result;
        } catch (error) {
            throw error

        }
    },

    async simulateProject(username, projectName, tgBlob, macBlob) {

        const mac_File = new File([macBlob], 'run.mac', { type: 'text/plain' });
        const tg_File = new File([tgBlob], 'detector.tg', { type: 'text/plain' });

        const formData = new FormData();
        formData.append('username', username);
        formData.append('project_name', projectName);
        formData.append('file', mac_File);
        formData.append('file', tg_File);


        try {
            const response = await fetch('https://aws.physino.xyz/process-mac-tg-files', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw new Error(`Simulation failed for ${projectName}`);
            }


            // Handle .wrl file response
            const result = await response.json();
            return result;

        } catch (error) {
            throw error.message;
        }
    },

    async getFileContent(username, projectName, filename) {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('project_name', projectName);
        formData.append('filename', filename);


        try {
            const response = await fetch('https://aws.physino.xyz/get-files/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to fetch file content');
            }

            return await response.text();
        } catch (error) {
            throw error.message;
        }
    },

    async updateProject(userName, projectName, mac_blob, tg_blob) {

        const mac_File = new File([mac_blob], 'run.mac', { type: 'text/plain' });
        const tg_File = new File([tg_blob], 'detector.tg', { type: 'text/plain' });

        const formData = new FormData();
        formData.append('username', userName);
        formData.append('project_name', projectName);
        formData.append('file', mac_File);
        formData.append('file', tg_File);

        try {
            const response = await fetch('https://aws.physino.xyz/update-mac-tg-files', {
                method: 'POST',
                body: formData
            })

            if (!response.ok) {
                throw error;
            }

            return 'File successfully updated';

        } catch (error) {
            throw error.message;
        }

    },
    async getUserProjects(username) {
        const formData = new FormData();
        formData.append('username', username);

        try {
            const response = await fetch('https://aws.physino.xyz/list-projects/', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(response.message || 'Failed to fetch projects');
            }

            return await response.json();
        } catch (error) {
            throw error.message;
        }
    }
};