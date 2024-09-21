"use strict";
/** Convenience middleware to handle common auth cases in routes. */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = authenticateJWT;
exports.ensureLoggedIn = ensureLoggedIn;
exports.ensureCorrectUser = ensureCorrectUser;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const ExpressError_1 = require("../ExpressError");
/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */
function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
        }
        return next();
    }
    catch (err) {
        return next();
    }
}
/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */
function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user)
            throw new ExpressError_1.UnauthorizedError();
        return next();
    }
    catch (err) {
        return next(err);
    }
}
/**
 * Check for valid token and that the username logged in is same as the username provided by the route param
 *
 * If not, raises Unauthorized.
 */
function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user;
        if (!(user && user.username === req.params.username))
            throw new ExpressError_1.UnauthorizedError();
        return next();
    }
    catch (err) {
        return next(err);
    }
}
