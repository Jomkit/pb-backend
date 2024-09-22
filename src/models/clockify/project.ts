/** model for functions related to clockify project api calls */
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import { IProjectData } from "../../types";
dotenv.config();


/** Class representing a Project in local db */
export default class ClockifyProject {    
    static workspaceId = process.env.WORKSPACE_ID;
    static clockifyApiKey = process.env.CLOCKIFY_API_KEY;

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
     * Adds a project to clockify
     * @param {object} data - object containing data for the project
     * @param {string} data.name - (required) The name of the project
     * @param {string} data.note - Notes, or description of project
     * @param {string} data.estimate - Optional, object, follows ISO-8601 format
     */
    static async create(data: IProjectData) {
        try{
            const result = await this.request(
                `workspaces/${this.workspaceId}/projects`,
                "post",
                data
            );
            return result;
        } catch (err: any) {
            console.error(err);
            return err;
        }
    }
    
    /**
     * Find all projects in local db
     * @returns {Promise<any>} array of projects with id, user_id, and clockify_project_id
     */
    static async findAll() {
        const results = await this.request(`workspaces/${this.workspaceId}/projects`);
        return results;
    }
    
    // /**
    //  * Retrieves all projects from the Clockify API.
    //  *
    //  * @return {Promise<any>} A Promise that resolves to an array of project data if successful, or undefined if an error occurs.
    //  */
    // static async findAll() {
    //     try{
    //         const projects = await axios.get(clockifyBaseUrl, config);
    //         return projects.data;
    //     } catch(err: unknown) {
    //         console.error(err);
    //     }
    // }

    static async findById(projectId: string) {
        const result = await this.request(
            `workspaces/${this.workspaceId}/projects/${projectId}`
        );
        return result;
    }

    /** 
     * Update a project in the database
     * 
     * @param {string} id - The ID of the project to update.
     * @param {object} data - The data to update the project with,
     * can contain properties including: name, note, color, archived. See
     * clockify docs for full list
     */
    static async update(id: string, data: Object) {
        const result = await this.request(
            `workspaces/${this.workspaceId}/projects/${id}`,
            "put",
            data
        );
        return result;
    }

    /** 
     * Deletes a project from the database
     * Project must be archived first via put /workspaces/:workspaceId/projects/:projectId
     * 
     * @param {string} id - The ID of the project to delete.
     * @returns {Promise<void>}
     */
    static async delete(id: string) {
        const result = await this.request(
            `workspaces/${this.workspaceId}/projects/${id}`,
            "delete"
        )
    }
}