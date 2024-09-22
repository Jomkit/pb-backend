import express, { NextFunction, Request, Response } from "express";
import Project from "../models/project";
import ClockifyProject from "../models/clockify/project";
import validate from "../middleware/inputValidation";
import { createProjectSchema, updateProjectSchema } from "../schemas/projectSchemas";
import ClockifyTask from "../models/clockify/task";
import Task from "../models/task";
import { createTaskSchema } from "../schemas/taskSchemas";

const router = express.Router();

/**Create Project
 * projects/
 * - POST:
 *      summary: creates a project in clockify
 *      requestBody: accepts userId and data object containing (name, note, estimate)
 */
router.post("/", validate(createProjectSchema), async function(req: Request, res: Response, next: NextFunction) {
    try{
        const { userId, data } = req.body;
        const clockifyProject = await ClockifyProject.create(data);
        await Project.create(userId, clockifyProject.id);
    
        return res.status(201).json({clockifyProject});
    }catch(err){
        return next(err);
    }
})  

/**Find all projects
 * projects/
 * - GET:
 *      summary: get all projects
 *      description: get all projects, TODO: make admin only or filter by userId according to 
 *      local db
 */
router.get("/", async function(req: Request, res: Response, next: NextFunction) {
    const clockifyProjects = await ClockifyProject.findAll();
    
    return res.json({clockifyProjects});
})

/**
 * Find project by id
 */
router.get("/:projectId", async function(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;
    const clockifyProject = await ClockifyProject.findById(projectId);
    return res.json({clockifyProject});
})

/** 
 * Update Projects
 * /:projectId
 * - PUT:
 *      summary: updates a project in clockify
 *      requestParameters: projectId
 *      requestBody: accepts userId and data object containing (name, note, estimate)
 */
router.put("/:projectId", validate(updateProjectSchema), async function(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;
    const { name, note } = req.body;
    const updatedClockifyProject = await ClockifyProject.update(projectId, {name, note});
    return res.json({message: "Project updated", clockifyProject: updatedClockifyProject});
})

/** Delete Project
 * /:projectId
 * - DELETE:
 *      summary: deletes a project in clockify
 *      requestParameters: projectId
 */
router.delete("/:projectId", async function(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;
    
    await ClockifyProject.update(projectId, {archived: true});
    await ClockifyProject.delete(projectId);
    console.log("Clockify operations success");
    await Project.remove(projectId);
    return res.json({message: "Project deleted"});
})

/********************** Tasks assigned to projects */

/** 
 * Create Task in Clockify assigned to a project
 * /:projectId/tasks:
 *  - POST:
 *      summary: creates a task in clockify
 *      requestParameters: projectId
 *      requestBody: accepts userId and data object containing (name, status?, estimate?)
 * 
*/
router.post("/:projectId/tasks", validate(createTaskSchema), async function(req: Request, res: Response, next: NextFunction) {
    try{
        const { userId, data } = req.body;
        const { projectId } = req.params;
    
        const clockifyTask = await ClockifyTask.create(projectId, data);
        await Task.create(userId, clockifyTask.id);
    
        return res.json({clockifyTask});
    } catch (err: any) {
        console.error(err);
        return next(err);
    }
})

/**
 * Find all tasks in a project
 * /:projectId/tasks
 * - GET:
 *      summary: gets all tasks in a project
 *      requestParameters: projectId
 */
router.get("/:projectId/tasks", async function(req: Request, res: Response, next: NextFunction) {
    const { projectId } = req.params;
    const clockifyTasks = await ClockifyTask.findAll(projectId);
    return res.json({clockifyTasks});
})

/**
 * Find task by id
 */
router.get("/:projectId/tasks/:taskId", async function(req: Request, res: Response, next: NextFunction) {
    const { projectId, taskId } = req.params;
    const clockifyTask = await ClockifyTask.findById(projectId, taskId);
    return res.json({clockifyTask});
})

/** 
 * Update Task
 * /:projectId/tasks/:taskId
 * - PUT:
 *      summary: updates a task in clockify
 *      description: updates a task in clockify, most likely case is setting status
 *      requestParameters: projectId, taskId
 *      requestBody: accepts userId and data object containing (name, status, estimate)
 */
router.put("/:projectId/tasks/:taskId", async function(req: Request, res: Response, next: NextFunction) {
    const { projectId, taskId } = req.params;
    const { data } = req.body;
    const clockifyTask = await ClockifyTask.update(projectId, taskId, data);
    return res.json({message: "Task updated", clockifyTask: clockifyTask});
})

/** 
 * Delete Task
 * /:projectId/tasks/:taskId
 * - DELETE:
 *      summary: deletes a task
 *      description: updates task in clockify to "DONE" and deletes a task in clockify and local db
 */
router.delete("/:projectId/tasks/:taskId", async function(req: Request, res: Response, next: NextFunction) {
    const { projectId, taskId } = req.params;

    // Might be a good place to implement Promise.all() so that whatever fails fails first, these
    // operations being rather asynchronous/independent 
    // await Task.remove(taskId);
    const { name } = await ClockifyTask.findById(projectId, taskId); // TODO: save name in local db
    await ClockifyTask.update(projectId, taskId, {name: name, status: "DONE"});
    await ClockifyTask.delete(projectId, taskId);
    return res.json({message: "Task deleted"});
})


export default router;