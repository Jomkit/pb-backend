/** model for functions related to clockify project api calls */
import axios from "axios";
import dotenv from "dotenv";
import db from "../../db";
import { BadRequestError, NotFoundError } from "../ExpressError";
dotenv.config();

/** Class representing a Project in local db */
class Project {    
    
    /**
     * Adds a project to the database
     * @param {number} userId - The ID of the user who owns the project.
     * @param {string} clockifyProjectId - The ID of the project in Clockify.
     * @returns {Promise<any>} The newly created project object.
     */
    static async create(userId: number, clockifyProjectId: string) {
        const duplicateCheck = await db.query(`
            SELECT clockify_project_id
            FROM users_projects
            WHERE clockify_project_id = $1
            `, [clockifyProjectId]);
        if(duplicateCheck.rows[0]) {
            throw new BadRequestError("Project already exists");
        }
        
        const result = await db.query(`
            INSERT INTO users_projects
            (user_id, clockify_project_id)
            VALUES ($1, $2)
            RETURNING id, user_id AS "userId", clockify_project_id AS "clockifyProjectId"
            `, [userId, clockifyProjectId]);
        return result.rows[0];
    }
    
    /**
     * Find all projects in local db
     * @returns {Promise<any>} array of projects with id, user_id, and clockify_project_id
     */
    static async findAll() {
        const results = await db.query(`
            SELECT id, user_id AS "userId", clockify_project_id AS "clockifyProjectId"
            FROM users_projects
            `);
        return results.rows;
    }
    
    /**
     * Finds all projects in local db by user id.
     *
     * @param {number} userId - The ID of the user who owns the project.
     * @return {Array<any>} An array of project objects with id, user_id, and clockify_project_id.
     */
    static async findByUserId(userId: number) {
        const result = await db.query(`
            SELECT id, user_id AS "userId", clockify_project_id AS "clockifyProjectId"
            FROM users_projects
            WHERE user_id = $1
            `, [userId]);
            
        return result.rows;
    }

    /** 
     * Removes a project from the database
     * @param {string} projectId - The ID of the project to remove.
     * @returns {Promise<void>}
     */
    static async remove(projectId: string) {
        const result = await db.query(`
            DELETE FROM users_projects
            WHERE clockify_project_id = $1
            RETURNING id
            `, [projectId]);
        const project = result.rows[0];
        if(!project) {
            throw new NotFoundError(`Clockify Project id: ${projectId} not found`);
        }
    }
}

export default Project;