/** model for functions related to clockify time-entry api calls */
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
dotenv.config();


/** Class representing a Project in local db */
export default class ClockifyTimer {    
    static clockifyApiKey = process.env.CLOCKIFY_API_KEY;
    static workspaceId = process.env.WORKSPACE_ID;
    static mainUserId = process.env.MAIN_USER_ID;
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
     * Create new timer, "time-entry" in clockify
     * @param {object} data - object containing data for the timer
     * @param {string} data.projectId - (optional) The id of the associated project
     * @param {string} data.type - (optional) the type of the timer, "REGULAR" or "BREAK"
     * @param {date} data.start - (required) the start time of the timer, defaults to NOW
     * @param {date} data.end - (optional) the end time of the timer
     * 
     * @returns {object} - created timer
     */
    static async create(data: object){
        const result = await ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries`, "post", data);
        return result;
    }

    /**
     * Get all time-entries in clockify
     * 
     * @returns {Array} - array of time-entries
     */
    static async findAll(){
        const results = await ClockifyTimer.request(`workspaces/${this.workspaceId}/user/${this.mainUserId}/time-entries`);
        return results;
    }

    /**
     * Get specific time-entry in clockify by id
     * 
     * @param {string} timerId - (required) the id of the timer
     */
    static async get(timerId: string){
        const result = await ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries/${timerId}`);
        return result;
    }

    /** 
     * Update a time-entry in clockify
     * 
     * @param {string} timerId - (required) the id of the timer
     * @param {object} data - object containing data for updating the timer
     * @param {string} data.projectId - (optional) The id of the project to reassign to
     * @param {date} data.start - (required) the start time of the timer
     * @param {date} data.end - (optional) the end time of the timer
     */
    static async update(timerId: string, data: object){
        const result = await ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries/${timerId}`, "put", data);
        return result;
    }

    /**
     * Delete a time-entry in clockify
     * 
     * @param {string} timerId - (required) the id of the timer
     */
    static async delete(timerId: string){
        const result = await ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries/${timerId}`, "delete");
        return result;
    }
} 