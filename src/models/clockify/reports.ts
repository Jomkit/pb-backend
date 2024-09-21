/** model for functions related to clockify report api calls */
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
dotenv.config();

export default class ClockifyReport {    
    static workspaceId = process.env.WORKSPACE_ID;
    static clockifyApiKey = process.env.CLOCKIFY_API_KEY;

    static async request(endpoint: string, method: string = "get", data: any = {}) {
        // console.debug("API call:", endpoint, data, method);

        const url = `https://reports.api.clockify.me/v1/${endpoint}`;
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
     * Create a detailed report on time entries
     * 
     * Currently set to just last 7 days
     * 
     * Accepts a period in days betweend end (today) and start (today - period), defaults to 7
     * Returns a lot of data on the last week, most importantly is an array of time entries
     */
    static async createReport(period: number = 7){
        const dateRangeEnd = new Date();
        const dateRangeStart = new Date();
        dateRangeStart.setDate(dateRangeEnd.getDate() - period);

        const dateRangeType = "THIS_WEEK";
        const detailedFilter = {
            options: {totals: "CALCULATE"},
            "page": 1,
            "sortColumn": "DATE"
        }

        const data = {
            dateRangeEnd,
            dateRangeStart,
            dateRangeType,
            detailedFilter
        }
        
        
        const result = await this.request(`workspaces/${this.workspaceId}/reports/detailed`, "post", data);
        return result;
    }
}