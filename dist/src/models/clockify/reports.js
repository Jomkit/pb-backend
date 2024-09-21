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
/** model for functions related to clockify report api calls */
const axios_1 = __importStar(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ClockifyReport {
    static request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, method = "get", data = {}) {
            // console.debug("API call:", endpoint, data, method);
            const url = `https://reports.api.clockify.me/v1/${endpoint}`;
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
     * Create a detailed report on time entries
     *
     * Currently set to just last 7 days
     *
     * Accepts a period in days betweend end (today) and start (today - period), defaults to 7
     * Returns a lot of data on the last week, most importantly is an array of time entries
     */
    static createReport() {
        return __awaiter(this, arguments, void 0, function* (period = 7) {
            const dateRangeEnd = new Date();
            const dateRangeStart = new Date();
            dateRangeStart.setDate(dateRangeEnd.getDate() - period);
            const dateRangeType = "THIS_WEEK";
            const detailedFilter = {
                options: { totals: "CALCULATE" },
                "page": 1,
                "sortColumn": "DATE"
            };
            const data = {
                dateRangeEnd,
                dateRangeStart,
                dateRangeType,
                detailedFilter
            };
            const result = yield this.request(`workspaces/${this.workspaceId}/reports/detailed`, "post", data);
            return result;
        });
    }
}
ClockifyReport.workspaceId = process.env.WORKSPACE_ID;
ClockifyReport.clockifyApiKey = process.env.CLOCKIFY_API_KEY;
exports.default = ClockifyReport;
