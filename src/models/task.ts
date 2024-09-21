import db from "../../db";
import { BadRequestError, NotFoundError } from "../ExpressError";

class Task {

    /** 
     * Create a task in the database
     * @param {number} userId - The ID of the user who owns the task.
     * @param {string} clockifyTaskId - The ID of the task in Clockify.
     * @returns {Promise<any>} The newly created task object.
     * 
     * NOTE: 
     */
    static async create(userId: number, clockifyTaskId: string) {
        const duplicateCheck = await db.query(`
            SELECT clockify_task_id
            FROM users_tasks
            WHERE clockify_task_id = $1
            `, [clockifyTaskId]);
        if(duplicateCheck.rows[0]) {
            throw new BadRequestError("Task already exists");
        }
        
        const result = await db.query(`
            INSERT INTO users_tasks
            (user_id, clockify_task_id)
            VALUES ($1, $2)
            RETURNING id, user_id AS "userId", clockify_task_id AS "clockifyTaskId"
            `, [userId, clockifyTaskId]);
        return result.rows[0];
    }

    static async findAll() {
        const results = await db.query(`
            SELECT id, user_id AS "userId", clockify_task_id AS "clockifyTaskId"
            FROM users_tasks
            `);
        return results.rows;
    }

    static async get(id: number) {
        const results = await db.query(`
            SELECT id, user_id AS "userId", clockify_task_id AS "clockifyTaskId"
            FROM users_tasks
            WHERE clockify_task_id = $1
            `, [id]);

        const task = results.rows[0];
        if(!task) throw new NotFoundError(`No task found with id: ${id}`);
        return results.rows[0];
    }

    static async remove(taskId: string){
        const result = await db.query(`
            DELETE FROM users_tasks
            WHERE clockify_task_id = $1
            RETURNING id
            `, [taskId]);
        const task = result.rows[0];
        if(!task) {
            throw new NotFoundError(`Task id: ${taskId} not found`);
        }
    }
}

export default Task;