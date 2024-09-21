import { NextFunction, Request, Response } from "express";
import { Schema } from "yup";

const validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
    try{
        await schema.validate({
            body: req.body,
            query: req.query,
            params: req.params
        });
        return next();
    } catch(err: Error | any) {
        return res.status(500).json({ type: err.name, message: err.message });
    }
}

export default validate;