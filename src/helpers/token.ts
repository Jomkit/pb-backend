import { SECRET_KEY } from "../../config";
import jwt from "jsonwebtoken";
import { IUser } from "../types";

/** 
 * Return signed JWT from user data
 * @param {IUser} user - user object
 * @param {string} user.username 
 * 
 * @return {string} signed JWT
 */
function createToken(user: IUser) {
    let payload = {
        username: user.username,
        id: user.id
    }

    return jwt.sign(payload, SECRET_KEY);
}

export { createToken }