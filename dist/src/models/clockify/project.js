"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** model for functions related to clockify project api calls */
const axios_1 = __importStar(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/** Class representing a Project in local db */
class ClockifyProject {
    static request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, method = "get", data = {}) {
            // console.debug("API call:", endpoint, data, method);
            const url = `https://api.clockify.me/api/v1/${endpoint}`;
            const headers = { 'X-Api-Key': this.clockifyApiKey };
            const params = (method === "get") ? data : {};
            try {
                return (yield (0, axios_1.default)({ url, method, data, params, headers })).data;
            }
            catch (err) {
                if (err instanceof axios_1.AxiosError && err.response) {
                    console.error("API Error:", err.response);
                    let message = err.response.data.error.message;
                    throw Array.isArray(message) ? message : [message];
                }
            }
        });
    }
    /**
     * Adds a project to clockify
     * @param {object} data - object containing data for the project
     * @param {string} data.name - (required) The name of the project
     * @param {string} data.note - Notes, or description of project
     * @param {string} data.estimate - Optional, object, follows ISO-8601 format
     */
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.request(`workspaces/${this.workspaceId}/projects`, "post", data);
                return result;
            }
            catch (err) {
                console.error(err);
                return err;
            }
        });
    }
    /**
     * Find all projects in local db
     * @returns {Promise<any>} array of projects with id, user_id, and clockify_project_id
     */
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield this.request(`workspaces/${this.workspaceId}/projects`);
            return results;
        });
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
    static findById(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.request(`workspaces/${this.workspaceId}/projects/${projectId}`);
            return result;
        });
    }
    /**
     * Update a project in the database
     *
     * @param {string} id - The ID of the project to update.
     * @param {object} data - The data to update the project with,
     * can contain properties including: name, note, color, archived. See
     * clockify docs for full list
     */
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.request(`workspaces/${this.workspaceId}/projects/${id}`, "put", data);
            return result;
        });
    }
    /**
     * Deletes a project from the database
     * Project must be archived first via put /workspaces/:workspaceId/projects/:projectId
     *
     * @param {string} id - The ID of the project to delete.
     * @returns {Promise<void>}
     */
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.request(`workspaces/${this.workspaceId}/projects/${id}`, "delete");
        });
    }
}
ClockifyProject.workspaceId = process.env.WORKSPACE_ID;
ClockifyProject.clockifyApiKey = process.env.CLOCKIFY_API_KEY;
exports.default = ClockifyProject;
