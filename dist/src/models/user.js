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
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = require("../../config");
const ExpressError_1 = require("../ExpressError");
const sql_1 = require("../helpers/sql");
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
    static authenticate(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            // check if user exists
            const result = yield db_1.default.query(`SELECT id,
                    username, 
                    password,
                    first_name AS "firstName",
                    last_name AS "lastName", 
                    email
                FROM users
                WHERE username = $1`, [username]);
            const user = result.rows[0];
            if (user) {
                // compare hashed pw to new hash from pw
                const isValid = yield bcrypt_1.default.compare(password, user.password);
                if (isValid === true) {
                    delete user.password;
                    return user;
                }
            }
            throw new ExpressError_1.UnauthorizedError("Invalid username/password");
        });
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
    static register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, password, firstName, lastName, email }) {
            // check if duplicate username exists
            const duplicateCheck = yield db_1.default.query(`SELECT username
                FROM users
                WHERE username = $1`, [username]);
            if (duplicateCheck.rows[0]) {
                throw new ExpressError_1.BadRequestError("Username taken");
            }
            const hashedPW = yield bcrypt_1.default.hash(password, config_1.BCRYPT_WORK_FACTOR);
            const result = yield db_1.default.query(`INSERT INTO users
                (username, password, first_name, last_name, email)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, username, first_name AS "firstName", last_name AS "lastName", email`, [username, hashedPW, firstName, lastName, email]);
            const newUser = result.rows[0];
            return newUser;
        });
    }
    /**
     * Find all users
     *
     * @returns {promise[Array]} array of users
     */
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield db_1.default.query(`SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
             FROM users
            `);
            return results.rows;
        });
    }
    /**
     * Get user by id
     * @param {number} userId
     * @returns {Promise<IUser>} user object
     *
     */
    static get(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`SELECT id, username, first_name AS "firstName", last_name AS "lastName", email
             FROM users
             WHERE id=$1`, [userId]);
            if (result.rows.length === 0) {
                throw new ExpressError_1.NotFoundError("No user found");
            }
            return result.rows[0];
        });
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
    static update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { setCols, values } = (0, sql_1.sqlForPartialUpdate)(data, {
                firstName: "first_name",
                lastName: "last_name"
            });
            const result = yield db_1.default.query(`UPDATE users
             SET ${setCols}
             WHERE id=$${values.length + 1}
             RETURNING id, username, password, first_name AS "firstName", last_name AS "lastName", email
            `, [...values, id]);
            if (result.rows.length === 0) {
                throw new ExpressError_1.NotFoundError("User not found");
            }
            return result.rows[0];
        });
    }
    /** Delete user from database
     *
     * @param {Number} id - user id
     * @returns {Promise<void>}
     */
    static remove(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.default.query(`DELETE FROM users
             WHERE id = $1
             RETURNING id, username`, [id]);
            const user = result.rows[0];
            if (!user) {
                throw new ExpressError_1.NotFoundError("User not found");
            }
        });
    }
}
exports.default = User;
