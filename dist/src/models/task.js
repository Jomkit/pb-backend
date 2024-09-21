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
const db_1 = __importDefault(require("../../db"));
const ExpressError_1 = require("../ExpressError");
class Task {
    /**
     * Create a task in the database
     * @param {number} userId - The ID of the user who owns the task.
     * @param {string} clockifyTaskId - The ID of the task in Clockify.
     * @returns {Promise<any>} The newly created task object.
     *
     * NOTE:
     */
    static create(userId, clockifyTaskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const duplicateCheck = yield db_1.default.query(`
            SELECT clockify_task_id
            FROM users_tasks
            WHERE clockify_task_id = $1
            `, [clockifyTaskId]);
            if (duplicateCheck.rows[0]) {
                throw new ExpressError_1.BadRequestError("Task already exists");
            }
            const result = yield db_1.default.query(`
            INSERT INTO users_tasks
            (user_id, clockify_task_id)
            VALUES ($1, $2)
            RETURNING id, user_id AS "userId", clockify_task_id AS "clockifyTaskId"
            `, [userId, clockifyTaskId]);
            return result.rows[0];
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield db_1.default.query(`
            SELECT id, user_id AS "userId", clockify_task_id AS "clockifyTaskId"
            FROM users_tasks
            `);
            return results.rows;
        });
    }
    static get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield db_1.default.query(`
            SELECT id, user_id AS "userId", clockify_task_id AS "clockifyTaskId"
            FROM users_tasks
            WHERE clockify_task_id = $1
            `, [id]);
            const task = results.rows[0];
            if (!task)
                throw new ExpressError_1.NotFoundError(`No task found with id: ${id}`);
            return results.rows[0];
        });
    }
    static remove(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            DELETE FROM users_tasks
            WHERE clockify_task_id = $1
            RETURNING id
            `, [taskId]);
            const task = result.rows[0];
            if (!task) {
                throw new ExpressError_1.NotFoundError(`Task id: ${taskId} not found`);
            }
        });
    }
}
exports.default = Task;
