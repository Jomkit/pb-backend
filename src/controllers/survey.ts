import express, {Request, Response, NextFunction } from "express";
import Survey from "../models/survey";



const router = express.Router();

/**
 * Create Survey
 * surveys/
 * - POST:
 *      summary: creates a new survey
 *      description: creates a new survey
 */
router.post("/", async function(req: Request, res: Response, next: NextFunction) {
    try{
        const survey = await Survey.create(req.body);
        return res.status(201).json(survey);
    }catch(err){
        next(err);
    }
});

/** 
 * Find all Surveys
 * surveys/
 * - GET:
 *      summary: gets all surveys
 */
router.get("/", async function(req: Request, res: Response, next: NextFunction) {
    const surveys = await Survey.findAll();
    return res.json({surveys});
})

/** 
 * Find all surveys given timer id
 * surveys/timers/:timerId
 * - GET:
 *      summary: gets all surveys given timer id
 */
router.get("/timers/:timerId", async function(req: Request, res: Response, next: NextFunction) {
    const surveys = await Survey.findAll();
    return res.json({surveys});
})

/**
 * Get survey by survey id
 * surveys/:surveyId
 * - GET:
 *      summary: gets survey by survey id
 */
router.get("/:surveyId", async function(req: Request, res: Response, next: NextFunction) {
    const surveyId = parseInt(req.params.surveyId);
    const survey = await Survey.get(surveyId);
    return res.json({survey});
})

/** 
 * Update survey
 * surveys/:surveyId
 * - PATCH:
 *      summary: updates survey
 */
router.patch("/:surveyId", async function(req: Request, res: Response, next: NextFunction) {
    const surveyId = parseInt(req.params.surveyId);
    const survey = await Survey.update(surveyId, req.body);
    return res.json({survey});
})

/**
 * Delete survey
 * surveys/:surveyId
 * - DELETE:
 *      summary: deletes survey
 */
router.delete("/:surveyId", async function(req: Request, res: Response, next: NextFunction) {
    const surveyId = parseInt(req.params.surveyId);
    const deletedId = await Survey.remove(surveyId);
    return res.status(200).json({message: `Deleted survey ${deletedId}`});
})

export default router;