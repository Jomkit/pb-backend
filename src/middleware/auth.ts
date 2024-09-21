/** Convenience middleware to handle common auth cases in routes. */

import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../config";
import { UnauthorizedError } from "../ExpressError";
import { NextFunction, Request, Response } from "express";


/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username and isAdmin field.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req: Request, res: Response, next: NextFunction) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** 
 * Check for valid token and that the username logged in is same as the username provided by the route param
 * 
 * If not, raises Unauthorized.
 */

function ensureCorrectUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = res.locals.user;
    if(!(user && user.username === req.params.username)) throw new UnauthorizedError();

    return next();
  } catch (err) {
    return next(err);
  }
}

export { authenticateJWT, ensureLoggedIn, ensureCorrectUser };