import express, {Request, Response, NextFunction } from "express";
import User from "../models/user";
import ClockifyProject from "../models/clockify/project";
import Project from "../models/project";
import Timer from "../models/timer";
import ClockifyTimer from "../models/clockify/timer";
import ClockifyReport from "../models/clockify/reports";

const router = express.Router();
/**
 * Find all users
 * users/
 * - GET:
 *      summary: gets all users
 *      description: gets all users, STRETCH: admin only
 */
router.get("/", async function(req: Request, res: Response, next: NextFunction) {
    const users = await User.findAll();
    return res.json({users});
})

/**
 * Get user by id
 * users/:userId
 * - GET:
 *      summary: gets a user by userId
 */
router.get("/:userId", async function(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId);
    const user = await User.get(userId);
    return res.json({user});
})

/** 
 * Create project for user
 * users/:userId/projects
 * - POST:
 *      summary: creates a project in clockify
 */
router.post("/:userId/projects", async function(req: Request, res: Response, next: NextFunction) {
    try{
        const userId = parseInt(req.params.userId);
        const { name, note } = req.body;
        const clockifyProject = await ClockifyProject.create({name: name, note: note});
        await Project.create(userId, clockifyProject.id);
        return res.status(201).json({clockifyProject});
    }catch(err: any){
        return next(err);
    }
})

/**
 * Find projects for user
 * users/:userId/projects
 * - GET:
 *      summary: gets all projects for a user
 */
router.get("/:userId/projects", async function(req: Request, res: Response, next: NextFunction) {
    const clockifyProjects = await ClockifyProject.findAll();
    const userId = parseInt(req.params.userId);
    const localProjects = await Project.findByUserId(userId);
    // Filter projects by user id, the filter method will check if a clockifyProject exists in localProjects
    const projects = clockifyProjects.filter((clockifyProject: any) => localProjects.some(project => project.clockifyProjectId === clockifyProject.id));
    return res.json({projects});
})

/**
 * Get Timers for a User
 * 
 * users/:userId/timers
 * - GET:
 *      summary: gets all timers for a User
 *      description: gets all timers for a User by userId
 * 
 */
router.get("/:userId/timers", async function(req: Request, res: Response, next: NextFunction) {
    const timers = await Timer.findAll(parseInt(req.params.userId));
    const clockifyTimers = await ClockifyTimer.findAll();
    const filtered = clockifyTimers.filter((clockifyTimer: any) => {
        return timers.some(timer => timer.clockifyTimerId === clockifyTimer.id)
    })

    return res.json({timers: filtered});
})


/**
 * Create Report
 * /report
 * - POST:
 *      summary: gets report of all projects for a user
 *      description: gets report of all projects for a user, optionally accepts a period in days
 */
router.post("/:userId/report", async function(req: Request, res: Response, next: NextFunction) {
    const userId = parseInt(req.params.userId);
    const userProjectIds = await Project.findByUserId(userId as number);
    const report = await ClockifyReport.createReport();

    const usersTimers = report.timeentries.filter((entry: any) => userProjectIds.some(project => project.clockifyProjectId === entry.projectId));

    return res.status(201).json({usersTimers});
})


export default router;