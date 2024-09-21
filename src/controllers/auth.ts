import express, {Request, Response, NextFunction } from "express";
import User from "../models/user";
import { userSchema } from "../schemas/userSchemas";
import validate from "../middleware/inputValidation";
import { createToken } from "../helpers/token";

const router = express.Router();


/**
 * Authenticates a user and returns a token
 * - POST /auth/token
 * 
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @returns {Promise<string>} A token that can be used for future authentication
 */
router.post("/token", validate(userSchema), async function(req: Request, res: Response, next: NextFunction) {
    try{
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        const token = await createToken(user);

        return res.json({token});
    } catch(err: unknown){
        return next(err);
    }
})

/**
 * Authenticates a user and returns a token
 * - POST /auth/register
 * 
 * @function
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 * @param {express.NextFunction} next - The express next function
 * 
 * @returns {Promise<express.Response>} The express response object with the json property set to the token
 */
router.post("/register", validate(userSchema), async function(req: Request, res: Response, next: NextFunction) {
    try{
        const newUser = await User.register({...req.body});
        const token = await createToken(newUser);
        return res.status(201).json({token: token});
    } catch(err: unknown){
        next(err);
    }
})

export default router;