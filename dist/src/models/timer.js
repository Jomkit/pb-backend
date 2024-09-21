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
class Timer {
    static checkDuplicateTimer(clockifyTimerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const duplicateCheck = yield db_1.default.query(`
            SELECT clockify_timer_id
            FROM users_timers
            WHERE clockify_timer_id = $1
            `, [clockifyTimerId]);
            if (duplicateCheck.rows[0]) {
                throw new ExpressError_1.BadRequestError("Timer already exists");
            }
        });
    }
    static checkUserExists(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const userCheck = yield db_1.default.query(`
            SELECT id
            FROM users
            WHERE id = $1
            `, [userId]);
            if (!userCheck.rows[0]) {
                throw new ExpressError_1.NotFoundError(`User id: ${userId} not found`);
            }
        });
    }
    static create(userId, clockifyTimerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Timer.checkDuplicateTimer(clockifyTimerId);
            yield Timer.checkUserExists(userId);
            const result = yield db_1.default.query(`
            INSERT INTO users_timers
            (user_id, clockify_timer_id)
            VALUES
            ($1, $2)
            RETURNING id, user_id AS "userId", clockify_timer_id AS "clockifyTimerId"
            `, [userId, clockifyTimerId]);
            return result.rows[0];
        });
    }
    static findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "";
            if (userId) {
                query = `
                WHERE user_id = $1
                `;
            }
            const results = yield db_1.default.query(`
            SELECT id, user_id AS "userId", clockify_timer_id AS "clockifyTimerId"
            FROM users_timers
            ${query}
            `, [userId]);
            return results.rows;
        });
    }
    static get(timerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield db_1.default.query(`
            SELECT id, user_id AS "userId", clockify_timer_id AS "clockifyTimerId"
            FROM users_timers
            WHERE clockify_timer_id = $1
            `, [timerId]);
            const timer = results.rows[0];
            if (!timer)
                throw new ExpressError_1.NotFoundError(`No timer found with id: ${timerId}`);
            return results.rows[0];
        });
    }
    static remove(timerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`
            DELETE FROM users_timers
            WHERE clockify_timer_id = $1
            RETURNING clockify_timer_id AS "clockifyTimerId"
            `, [timerId]);
            const timer = result.rows[0];
            if (!timer) {
                throw new ExpressError_1.NotFoundError(`Timer id: ${timerId} not found`);
            }
        });
    }
}
exports.default = Timer;
