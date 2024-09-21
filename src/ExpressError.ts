/** ExpressError extends normal JS error so we can add a status when we make an instance of it.
 * 
 * The error-handling middleware will return this
 */

class ExpressError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super();
        this.message = message;
        this.status = status;
    }
}

/** 404 Not Found Error */
class NotFoundError extends ExpressError {
    constructor(message: string = "Not Found") {
        super(message, 404);
    }
}

/** 401 Unauthorized Error */
class UnauthorizedError extends ExpressError {
    constructor(message: string = "Unauthorized") {
        super(message, 401);
    }
}

/** 400 Bad Request Error */
class BadRequestError extends ExpressError {
    constructor(message: string = "Bad Request") {
        super(message, 400);
    }
}

export {ExpressError, NotFoundError, UnauthorizedError, BadRequestError}