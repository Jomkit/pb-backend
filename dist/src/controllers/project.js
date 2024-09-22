"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const project_1 = __importDefault(require("../models/project"));
const project_2 = __importDefault(require("../models/clockify/project"));
const inputValidation_1 = __importDefault(require("../middleware/inputValidation"));
const projectSchemas_1 = require("../schemas/projectSchemas");
const task_1 = __importDefault(require("../models/clockify/task"));
const task_2 = __importDefault(require("../models/task"));
const taskSchemas_1 = require("../schemas/taskSchemas");
const router = express_1.default.Router();
/**Create Project
 * projects/
 * - POST:
 *      summary: creates a project in clockify
 *      requestBody: accepts userId and data object containing (name, note, estimate)
 */
router.post("/", (0, inputValidation_1.default)(projectSchemas_1.createProjectSchema), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, data } = req.body;
            const clockifyProject = yield project_2.default.create(data);
            yield project_1.default.create(userId, clockifyProject.id);
            return res.status(201).json({ clockifyProject });
        }
        catch (err) {
            return next(err);
        }
    });
});
/**Find all projects
 * projects/
 * - GET:
 *      summary: get all projects
 *      description: get all projects, TODO: make admin only or filter by userId according to
 *      local db
 */
router.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clockifyProjects = yield project_2.default.findAll();
        return res.json({ clockifyProjects });
    });
});
/**
 * Find project by id
 */
router.get("/:projectId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId } = req.params;
        const clockifyProject = yield project_2.default.findById(projectId);
        return res.json({ clockifyProject });
    });
});
/**
 * Update Projects
 * /:projectId
 * - PUT:
 *      summary: updates a project in clockify
 *      requestParameters: projectId
 *      requestBody: accepts userId and data object containing (name, note, estimate)
 */
router.put("/:projectId", (0, inputValidation_1.default)(projectSchemas_1.updateProjectSchema), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId } = req.params;
        const { name, note } = req.body;
        const updatedClockifyProject = yield project_2.default.update(projectId, { name, note });
        return res.json({ message: "Project updated", clockifyProject: updatedClockifyProject });
    });
});
/** Delete Project
 * /:projectId
 * - DELETE:
 *      summary: deletes a project in clockify
 *      requestParameters: projectId
 */
router.delete("/:projectId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId } = req.params;
        yield project_2.default.update(projectId, { archived: true });
        yield project_2.default.delete(projectId);
        console.log("Clockify operations success");
        yield project_1.default.remove(projectId);
        return res.json({ message: "Project deleted" });
    });
});
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
router.post("/:projectId/tasks", (0, inputValidation_1.default)(taskSchemas_1.createTaskSchema), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId, data } = req.body;
            const { projectId } = req.params;
            const clockifyTask = yield task_1.default.create(projectId, data);
            yield task_2.default.create(userId, clockifyTask.id);
            return res.json({ clockifyTask });
        }
        catch (err) {
            console.error(err);
            return next(err);
        }
    });
});
/**
 * Find all tasks in a project
 * /:projectId/tasks
 * - GET:
 *      summary: gets all tasks in a project
 *      requestParameters: projectId
 */
router.get("/:projectId/tasks", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId } = req.params;
        const clockifyTasks = yield task_1.default.findAll(projectId);
        return res.json({ clockifyTasks });
    });
});
/**
 * Find task by id
 */
router.get("/:projectId/tasks/:taskId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId, taskId } = req.params;
        const clockifyTask = yield task_1.default.findById(projectId, taskId);
        return res.json({ clockifyTask });
    });
});
/**
 * Update Task
 * /:projectId/tasks/:taskId
 * - PUT:
 *      summary: updates a task in clockify
 *      description: updates a task in clockify, most likely case is setting status
 *      requestParameters: projectId, taskId
 *      requestBody: accepts userId and data object containing (name, status, estimate)
 */
router.put("/:projectId/tasks/:taskId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId, taskId } = req.params;
        const { data } = req.body;
        const clockifyTask = yield task_1.default.update(projectId, taskId, data);
        return res.json({ message: "Task updated", clockifyTask: clockifyTask });
    });
});
/**
 * Delete Task
 * /:projectId/tasks/:taskId
 * - DELETE:
 *      summary: deletes a task
 *      description: updates task in clockify to "DONE" and deletes a task in clockify and local db
 */
router.delete("/:projectId/tasks/:taskId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { projectId, taskId } = req.params;
        // Might be a good place to implement Promise.all() so that whatever fails fails first, these
        // operations being rather asynchronous/independent 
        // await Task.remove(taskId);
        const { name } = yield task_1.default.findById(projectId, taskId); // TODO: save name in local db
        yield task_1.default.update(projectId, taskId, { name: name, status: "DONE" });
        yield task_1.default.delete(projectId, taskId);
        return res.json({ message: "Task deleted" });
    });
});
exports.default = router;
