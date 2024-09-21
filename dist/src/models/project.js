"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("../../db"));
const ExpressError_1 = require("../ExpressError");
dotenv_1.default.config();
/** Class representing a Project in local db */
class Project {
    /**
     * Adds a project to the database
     * @param {number} userId - The ID of the user who owns the project.
     * @param {string} clockifyProjectId - The ID of the project in Clockify.
     * @returns {Promise<any>} The newly created project object.
     */
    static create(userId, clockifyProjectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const duplicateCheck = yield db_1.default.query(`
            SELECT clockify_project_id
            FROM users_projects
            WHERE clockify_project_id = $1
            `, [clockifyProjectId]);
            if (duplicateCheck.rows[0]) {
                throw new ExpressError_1.BadRequestError("Project already exists");
            }
            const result = yield db_1.default.query(`
            INSERT INTO users_projects
            (user_id, clockify_project_id)
            VALUES ($1, $2)
            RETURNING id, user_id AS "userId", clockify_project_id AS "clockifyProjectId"
            `, [userId, clockifyProjectId]);
            return result.rows[0];
        });
    }
    /**
     * Find all projects in local db
     * @returns {Promise<any>} array of projects with id, user_id, and clockify_project_id
     */
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield db_1.default.query(`
            SELECT id, user_id AS "userId", clockify_project_id AS "clockifyProjectId"
            FROM users_projects
            `);
            return results.rows;
        });
    }
    /**
     * Finds all projects in local db by user id.
     *
     * @param {number} userId - The ID of the user who owns the project.
     * @return {Array<any>} An array of project objects with id, user_id, and clockify_project_id.
     */
    static findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            SELECT id, user_id AS "userId", clockify_project_id AS "clockifyProjectId"
            FROM users_projects
            WHERE user_id = $1
            `, [userId]);
            return result.rows;
        });
    }
    /**
     * Removes a project from the database
     * @param {string} projectId - The ID of the project to remove.
     * @returns {Promise<void>}
     */
    static remove(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            DELETE FROM users_projects
            WHERE clockify_project_id = $1
            RETURNING id
            `, [projectId]);
            const project = result.rows[0];
            if (!project) {
                throw new ExpressError_1.NotFoundError(`Clockify Project id: ${projectId} not found`);
            }
        });
    }
}
exports.default = Project;
