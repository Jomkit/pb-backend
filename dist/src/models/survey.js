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
const sql_1 = require("../helpers/sql");
class Survey {
    /**
     * Creates a new survey in the database.
    *
     * @param {string} taskId - The ID of the clockify task associated with the survey.
     * @param {string} projectId - The ID of the clockify project associated with the survey.
     * @param {string} timerId - The ID of the clockify timer associated with the survey. Should be unique
     * @param {number} score - The score of the survey.
     * @param {string} description - The description of the survey.
     * @return {Promise<Object>} The newly created survey object.
     * @throws {BadRequestError} If the task already has a survey.
     */
    static create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ taskId, projectId, timerId, score, description }) {
            const duplicateCheck = yield db_1.default.query(`
            SELECT timer_id 
            FROM surveys
            WHERE timer_id=$1
            `, [timerId]);
            if (duplicateCheck.rows[0])
                throw new ExpressError_1.BadRequestError("timer already has survey");
            const result = yield db_1.default.query(`
            INSERT INTO surveys
            (task_id, project_id, timer_id, score, description)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, task_id AS "taskId", project_id AS "projectId", timer_id AS "timerId", score, description
            `, [taskId, projectId, timerId, score, description]);
            return result.rows[0];
        });
    }
    /**
     * Retrieves all surveys from the database.
     *
     * Optionally accepts timerId to filter by
     *
     * @return {Promise<Array<ISurvey>>} An array of survey objects.
     */
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            SELECT id, task_id AS "taskId", project_id AS "projectId", timer_id AS "timerId", score, description
            FROM surveys
            `);
            return result.rows;
        });
    }
    /**
     * Retrieves a survey from the database based on the provided survey ID.
     *
     * @param {number} surveyId - The ID of the survey to retrieve.
     * @return {Promise<ISurvey>} - A promise that resolves to the survey object if found,
     *                            or throws a NotFoundError if the survey is not found.
     * @throws {NotFoundError} - If the survey with the provided ID is not found.
     */
    static get(surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            SELECT id, task_id AS "taskId", project_id AS "projectId", timer_id AS "timerId", score, description
            FROM surveys
            WHERE id = $1
            `, [surveyId]);
            if (!result.rows[0])
                throw new ExpressError_1.NotFoundError("Survey not found");
            return result.rows[0];
        });
    }
    /**
     * Updates a survey in the database
     *
     * @param {number} surveyId - the ID of the survey to be updated
     * @param {Object} data - the data to be updated, can be partial
     * @param {number} data.score - the score of the survey
     * @param {string} data.description - the description of the survey
     *
     * @returns {Object} the updated survey
    */
    static update(surveyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            //check survey exists in db
            const surveyCheck = yield db_1.default.query(`
            SELECT id
            FROM surveys
            WHERE id = $1
            `, [surveyId]);
            if (!surveyCheck.rows[0])
                throw new ExpressError_1.NotFoundError("Survey not found");
            const { setCols, values } = (0, sql_1.sqlForPartialUpdate)(data);
            const result = yield db_1.default.query(`
            UPDATE surveys
            SET ${setCols}
            WHERE id=$${values.length + 1}
            RETURNING id, task_id AS "taskId", project_id AS "projectId", timer_id AS "timerId", score, description
            `, [...values, surveyId]);
            if (result.rows.length === 0) {
                throw new ExpressError_1.NotFoundError("Survey not found");
            }
            return result.rows[0];
        });
    }
    /**
     * Delete a survey from the database
     * @param {number} surveyId - the ID of the survey to be deleted
     *
     * @returns {void}
     */
    static remove(surveyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            DELETE FROM surveys
            WHERE id = $1
            RETURNING id
            `, [surveyId]);
            if (!result.rows[0])
                throw new ExpressError_1.NotFoundError("Survey not found");
            return result.rows[0].id;
        });
    }
}
exports.default = Survey;
