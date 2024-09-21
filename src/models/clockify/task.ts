/** model for functions related to clockify task api calls */
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
dotenv.config();


/** Class representing a Project in local db */
export default class ClockifyTask {    
    static clockifyApiKey = process.env.CLOCKIFY_API_KEY;
    static workspaceId = process.env.WORKSPACE_ID;
    static clockifyProjectId = "66ce2d640b9aac5a40145a31"; // TODO: needs to be passed in body of request

    static async request(endpoint: string, method: string = "get", data: any = {}) {
        // console.debug("API call:", endpoint, data, method);

        const url = `https://api.clockify.me/api/v1/${endpoint}`;
        const headers = {'X-Api-Key': this.clockifyApiKey};
        const params = (method === "get") ? data : {};

        try {
            return (await axios({ url, method, data, params, headers })).data;
        } catch(err: unknown){
            if(err instanceof AxiosError && err.response){
                console.error("API Error:", err.response);
                let message = err.response.data.error.message;
                throw Array.isArray(message) ? message : [message];
            }
        }
    }

    /** 
     * Create a clockify task
     * @param {string} clockifyProjectId - The clockify project id
     * @param {object} data - object containing data for the task
     * @param {string} data.name - (required) The name of the task
     * @param {string} data.status - (optional) The status of the task
     * @param {string} data.estimate - (optional) Estimate, follows ISO-8601 format
     */
    static async create(clockifyProjectId: string, data: object) {
        const result = await this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks`, "post", data);
        return result;
    }
    
    /** 
     * Find all clockify tasks for a project
     */
    static async findAll(clockifyProjectId: string) {
        const result = await this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks`);
        return result;
    }

    /**
     * Find a specific clockify task by id
     * @param {string} clockifyProjectId - The clockify project id
     * @param {string} taskId - The id of the task to find
     * @returns {Promise<any>} The found task
     */
    static async findById(clockifyProjectId: string, taskId: string) {
        const result = await this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks/${taskId}`);
        return result;
    }

    /**
     * Update a clockify task
     * @param {string} taskId - The id of the task to update
     * @param {object} data - object containing data for the task
     * @param {string} data.name - (required) The name of the task
     * @param {string} data.status - (optional) The status of the task
     * @param {string} data.estimate - (optional) Estimate, follows ISO-8601 format
     * @returns {Promise<any>} The updated task
     */
    static async update(clockifyProjectId: string, taskId: string, data: object) {
        const result = await this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks/${taskId}`, "put", data);
        return result;
    }

    /**
     * Delete a clockify task
     * @param {string} projectId - The clockify project id
     * @param {string} taskId - The id of the task to delete
     */
    static async delete(projectId: string, taskId: string) {
        await this.request(`workspaces/${this.workspaceId}/projects/${projectId}/tasks/${taskId}`, "delete");
    }
}