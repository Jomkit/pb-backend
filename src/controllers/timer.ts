import express, { NextFunction, Request, Response } from "express";
import ClockifyTimer from "../models/clockify/timer";
import Timer from "../models/timer";
import validate from "../middleware/inputValidation";
import { createTimerSchema } from "../schemas/timerSchemas";

const router = express.Router();

/** 
 * Create Timer
 * timers/
 * - POST:
 *      summary: creates a new timer
 *      description: creates a new timer
 *      requestBody: accepts userId and data object containing (start, end, projectId, taskId)
 */
router.post("/", validate(createTimerSchema), async function(req: Request, res: Response, next: NextFunction) {
    const { userId, data } = req.body;
    const clockifyTimer = await ClockifyTimer.create(data);
    await Timer.create(userId, clockifyTimer.id);
    return res.status(201).json({clockifyTimer});
})

/**
 * Get Timers
 * timers/
 * - GET:
 *      summary: gets all timers
 *      description: gets all timers, STRETCH: admin only
 */
router.get("/", async function(req: Request, res: Response, next: NextFunction) {
    const clockifyTimers = await ClockifyTimer.findAll();
    return res.json({clockifyTimers});
})

/** 
 * Get Timer
 * timers/:clockifyTimerId
 * - GET:
 *      summary: gets a timer
 *      description: gets a timer by clockifyTimerId
 */
router.get("/:timerId", async function(req: Request, res: Response, next: NextFunction) {
    const clockifyTimer = await ClockifyTimer.get(req.params.timerId);
    return res.json({clockifyTimer});
})

/** 
 * Update Timer
 * timers/:clockifyTimerId
 * - PUT:
 *      summary: updates a timer
 *      description: updates a timer
 *      requestBody: accepts data object containing (start, end, projectId, type)
 */
router.put("/:timerId", async function(req: Request, res: Response, next: NextFunction) {
    const timerId = req.params.timerId;
    if(!req.body.data.start) {
        let cTimer = await ClockifyTimer.get(timerId);
        req.body.data.start = cTimer.timeInterval.start;
    }
    const clockifyTimer = await ClockifyTimer.update(timerId, req.body.data);
    return res.json({message: `Successfully updated timer ${timerId}`, clockifyTimer: clockifyTimer});
})

/**
 * Delete Timer
 * timers/:clockifyTimerId
 * - DELETE:
 *      summary: deletes a timer
 *      description: deletes a timer
 */
router.delete("/:timerId", async function(req: Request, res: Response, next: NextFunction) {
    const timerId = req.params.timerId;
    await Timer.remove(req.params.timerId);
    await ClockifyTimer.delete(timerId);
    return res.json({message: `Successfully deleted timer ${timerId}`});
})

export default router;