import db from "../../db";
import bcrypt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../../config";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../ExpressError";
import { IUser } from "../types";
import { sqlForPartialUpdate } from "../helpers/sql";

/** Contains user functions
 * @class
 */
class User {

    /**
     * Authenticates a user with the given username and password.
     * @async
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @return {Promise<IUser>} The authenticated user object with the password removed.
     * @throws {UnauthorizedError} If the username or password is invalid.
     */
    static async authenticate(username: string, password: string) {
        // check if user exists
        const result = await db.query(
            `SELECT id,
                    username, 
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName", 
                    email
                FROM users
                WHERE username = $1`,
             [username]
        );
        const user: IUser = result.rows[0];

        if(user) {
            // compare hashed pw to new hash from pw
            const isValid: boolean = await bcrypt.compare(password, user.password!);
            if(isValid === true) {
                delete user.password;
                return user;
            }
        }
        throw new UnauthorizedError("Invalid username/password");
    }

    /** 
     * register new User to database
     * @async
     * @param {IUser} newUser - new user to add to database
     * @param {string} newUser.username
     * @param {string} password
     * @param {string} newUser.firstName
     * @param {string} newUser.lastName
     * @param {string} newUser.email
     * 
     * @returns {IUser} returns new user object
     */
    static async register({username, password, firstName, lastName, email}: IUser) {
        // check if duplicate username exists
        const duplicateCheck = await db.query(
            `SELECT username
                FROM users
                WHERE username = $1`,
            [username]);
        if(duplicateCheck.rows[0]) {
            throw new BadRequestError("Username taken");
        }

        const hashedPW = await bcrypt.hash(password!, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
                (username, password, first_name, last_name, email)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`,
             [username, hashedPW, firstName, lastName, email]);
        
        const newUser = result.rows[0];
        return newUser;
    }

    /**
     * Find all users
     * 
     * @returns {promise[Array]} array of users
     */
    static async findAll() {
        const results = await db.query(
            `SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
             FROM users
            `);
        return results.rows;
    }

    /**
     * Get user by id
     * @param {number} userId
     * @returns {Promise<IUser>} user object
     * 
     */
    static async get(userId: number){
        const result = await db.query(
            `SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
             FROM users
             WHERE id=$1`,
             [userId]);
        if(result.rows.length === 0){
            throw new NotFoundError("No user found");
        }
        return result.rows[0];
    }

        /**
     * Updates a user's information in the database.
     *
     * @param {Number} id - The ID of the user to update.
     * @param {Partial<IUser>} data - The updated user information.
     * @returns {Promise<IUser>} The updated user object.
     * 
     * @throws {NotFoundError} If the user with the specified ID is not found.
     * 
     * WARNING: this function can set a new password.
     * Callers of this function must be certain the they have 
     * validated inputs to this or a serious security risk is opened
     */
    static async update(id: Number, data: Partial<IUser>){
        const { setCols, values } = sqlForPartialUpdate(data, {
            firstName: "first_name",
            lastName: "last_name"
        })
        
        const result = await db.query(
            `UPDATE users
             SET ${setCols}
             WHERE id=$${values.length + 1}
             RETURNING id, username, password, first_name AS "firstName", last_name AS "lastName", email
            `, [...values, id]
        )

        if(result.rows.length === 0){
            throw new NotFoundError("User not found");
        }
        return result.rows[0];
    }
    
    /** Delete user from database
     * 
     * @param {Number} id - user id
     * @returns {Promise<void>}
     */
    static async remove(id: Number) {
        const result = await db.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING id, username`,
            [id]
        );
        const user = result.rows[0];
        if(!user) {
            throw new NotFoundError("User not found");
        }
    }
}

export default User;