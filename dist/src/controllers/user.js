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
const user_1 = __importDefault(require("../models/user"));
const project_1 = __importDefault(require("../models/clockify/project"));
const project_2 = __importDefault(require("../models/project"));
const timer_1 = __importDefault(require("../models/timer"));
const timer_2 = __importDefault(require("../models/clockify/timer"));
const reports_1 = __importDefault(require("../models/clockify/reports"));
const router = express_1.default.Router();
/**
 * Find all users
 * users/
 * - GET:
 *      summary: gets all users
 *      description: gets all users, STRETCH: admin only
 */
router.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield user_1.default.findAll();
        return res.json({ users });
    });
});
/**
 * Get user by id
 * users/:userId
 * - GET:
 *      summary: gets a user by userId
 */
router.get("/:userId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = parseInt(req.params.userId);
        const user = yield user_1.default.get(userId);
        return res.json({ user });
    });
});
/**
 * Create project for user
 * users/:userId/projects
 * - POST:
 *      summary: creates a project in clockify
 */
router.post("/:userId/projects", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = parseInt(req.params.userId);
            const { name, note } = req.body;
            const clockifyProject = yield project_1.default.create({ name: name, note: note });
            yield project_2.default.create(userId, clockifyProject.id);
            return res.status(201).json({ clockifyProject });
        }
        catch (err) {
            return next(err);
        }
    });
});
/**
 * Find projects for user
 * users/:userId/projects
 * - GET:
 *      summary: gets all projects for a user
 */
router.get("/:userId/projects", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clockifyProjects = yield project_1.default.findAll();
        const userId = parseInt(req.params.userId);
        const localProjects = yield project_2.default.findByUserId(userId);
        // Filter projects by user id, the filter method will check if a clockifyProject exists in localProjects
        const projects = clockifyProjects.filter((clockifyProject) => localProjects.some(project => project.clockifyProjectId === clockifyProject.id));
        return res.json({ projects });
    });
});
/**
 * Get Timers for a User
 *
 * users/:userId/timers
 * - GET:
 *      summary: gets all timers for a User
 *      description: gets all timers for a User by userId
 *
 */
router.get("/:userId/timers", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const timers = yield timer_1.default.findAll(parseInt(req.params.userId));
        const clockifyTimers = yield timer_2.default.findAll();
        const filtered = clockifyTimers.filter((clockifyTimer) => {
            return timers.some(timer => timer.clockifyTimerId === clockifyTimer.id);
        });
        return res.json({ timers: filtered });
    });
});
/**
 * Create Report
 * /report
 * - POST:
 *      summary: gets report of all projects for a user
 *      description: gets report of all projects for a user, optionally accepts a period in days
 */
router.post("/:userId/report", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = parseInt(req.params.userId);
        const userProjectIds = yield project_2.default.findByUserId(userId);
        const report = yield reports_1.default.createReport();
        const usersTimers = report.timeentries.filter((entry) => userProjectIds.some(project => project.clockifyProjectId === entry.projectId));
        return res.status(201).json({ usersTimers });
    });
});
exports.default = router;
