import db from "../../db";
import { BadRequestError, NotFoundError } from "../ExpressError";

class Timer {
    static async checkDuplicateTimer(clockifyTimerId: string) {
        const duplicateCheck = await db.query(`
            SELECT clockify_timer_id
            FROM users_timers
            WHERE clockify_timer_id = $1
            `, [clockifyTimerId]);
        if(duplicateCheck.rows[0]) {
            throw new BadRequestError("Timer already exists");
        }
    }

    static async checkUserExists(userId: number) {
        const userCheck = await db.query(`
            SELECT id
            FROM users
            WHERE id = $1
            `, [userId]);
        if(!userCheck.rows[0]) {
            throw new NotFoundError(`User id: ${userId} not found`);
        }
    }
    
    static async create(userId: number, clockifyTimerId: string) {
        await Timer.checkDuplicateTimer(clockifyTimerId);
        await Timer.checkUserExists(userId);
        
        const result = await db.query(`
            INSERT INTO users_timers
            (user_id, clockify_timer_id)
            VALUES
            ($1, $2)
            RETURNING id, user_id AS "userId", clockify_timer_id AS "clockifyTimerId"
            `, [userId, clockifyTimerId]);
        return result.rows[0];
    }

    static async findAll(userId?: number) {
        let query: string = "";
        if(userId) {
            query = `
                WHERE user_id = $1
                `;
        }
        const results = await db.query(`
            SELECT id, user_id AS "userId", clockify_timer_id AS "clockifyTimerId"
            FROM users_timers
            ${query}
            `, [userId]);
        return results.rows;
    }
    
    static async get(timerId: string) {
        const results = await db.query(`
            SELECT id, user_id AS "userId", clockify_timer_id AS "clockifyTimerId"
            FROM users_timers
            WHERE clockify_timer_id = $1
            `, [timerId]);
        const timer = results.rows[0];
        if(!timer) throw new NotFoundError(`No timer found with id: ${timerId}`);
        return results.rows[0];
    }
    static async remove(timerId: string) {
        const result = await db.query(`
            DELETE FROM users_timers
            WHERE clockify_timer_id = $1
            RETURNING clockify_timer_id AS "clockifyTimerId"
            `, [timerId]);
        const timer = result.rows[0];
        if(!timer) {
            throw new NotFoundError(`Timer id: ${timerId} not found`);
        }
    }
}

export default Timer;