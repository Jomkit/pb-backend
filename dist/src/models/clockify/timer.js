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
/** model for functions related to clockify time-entry api calls */
const axios_1 = __importStar(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/** Class representing a Project in local db */
class ClockifyTimer {
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
     * Create new timer, "time-entry" in clockify
     * @param {object} data - object containing data for the timer
     * @param {string} data.projectId - (optional) The id of the associated project
     * @param {string} data.type - (optional) the type of the timer, "REGULAR" or "BREAK"
     * @param {date} data.start - (required) the start time of the timer, defaults to NOW
     * @param {date} data.end - (optional) the end time of the timer
     *
     * @returns {object} - created timer
     */
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries`, "post", data);
            return result;
        });
    }
    /**
     * Get all time-entries in clockify
     *
     * @returns {Array} - array of time-entries
     */
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield ClockifyTimer.request(`workspaces/${this.workspaceId}/user/${this.mainUserId}/time-entries`);
            return results;
        });
    }
    /**
     * Get specific time-entry in clockify by id
     *
     * @param {string} timerId - (required) the id of the timer
     */
    static get(timerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries/${timerId}`);
            return result;
        });
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
    static update(timerId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries/${timerId}`, "put", data);
            return result;
        });
    }
    /**
     * Delete a time-entry in clockify
     *
     * @param {string} timerId - (required) the id of the timer
     */
    static delete(timerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield ClockifyTimer.request(`workspaces/${this.workspaceId}/time-entries/${timerId}`, "delete");
            return result;
        });
    }
}
ClockifyTimer.clockifyApiKey = process.env.CLOCKIFY_API_KEY;
ClockifyTimer.workspaceId = process.env.WORKSPACE_ID;
ClockifyTimer.mainUserId = process.env.MAIN_USER_ID;
ClockifyTimer.clockifyProjectId = "66ce2d640b9aac5a40145a31"; // TODO: needs to be passed in body of request
exports.default = ClockifyTimer;
