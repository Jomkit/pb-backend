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
/** model for functions related to clockify task api calls */
const axios_1 = __importStar(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/** Class representing a Project in local db */
class ClockifyTask {
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
     * Create a clockify task
     * @param {string} clockifyProjectId - The clockify project id
     * @param {object} data - object containing data for the task
     * @param {string} data.name - (required) The name of the task
     * @param {string} data.status - (optional) The status of the task
     * @param {string} data.estimate - (optional) Estimate, follows ISO-8601 format
     */
    static create(clockifyProjectId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks`, "post", data);
            return result;
        });
    }
    /**
     * Find all clockify tasks for a project
     */
    static findAll(clockifyProjectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks`);
            return result;
        });
    }
    /**
     * Find a specific clockify task by id
     * @param {string} clockifyProjectId - The clockify project id
     * @param {string} taskId - The id of the task to find
     * @returns {Promise<any>} The found task
     */
    static findById(clockifyProjectId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks/${taskId}`);
            return result;
        });
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
    static update(clockifyProjectId, taskId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.request(`workspaces/${this.workspaceId}/projects/${clockifyProjectId}/tasks/${taskId}`, "put", data);
            return result;
        });
    }
    /**
     * Delete a clockify task
     * @param {string} projectId - The clockify project id
     * @param {string} taskId - The id of the task to delete
     */
    static delete(projectId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.request(`workspaces/${this.workspaceId}/projects/${projectId}/tasks/${taskId}`, "delete");
        });
    }
}
ClockifyTask.clockifyApiKey = process.env.CLOCKIFY_API_KEY;
ClockifyTask.workspaceId = process.env.WORKSPACE_ID;
ClockifyTask.clockifyProjectId = "66ce2d640b9aac5a40145a31"; // TODO: needs to be passed in body of request
exports.default = ClockifyTask;
