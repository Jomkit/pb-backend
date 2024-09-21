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
const timer_1 = __importDefault(require("../models/clockify/timer"));
const timer_2 = __importDefault(require("../models/timer"));
const inputValidation_1 = __importDefault(require("../middleware/inputValidation"));
const timerSchemas_1 = require("../schemas/timerSchemas");
const router = express_1.default.Router();
/**
 * Create Timer
 * timers/
 * - POST:
 *      summary: creates a new timer
 *      description: creates a new timer
 *      requestBody: accepts userId and data object containing (start, end, projectId, taskId)
 */
router.post("/", (0, inputValidation_1.default)(timerSchemas_1.createTimerSchema), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId, data } = req.body;
        const clockifyTimer = yield timer_1.default.create(data);
        yield timer_2.default.create(userId, clockifyTimer.id);
        return res.status(201).json({ clockifyTimer });
    });
});
/**
 * Get Timers
 * timers/
 * - GET:
 *      summary: gets all timers
 *      description: gets all timers, STRETCH: admin only
 */
router.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clockifyTimers = yield timer_1.default.findAll();
        return res.json({ clockifyTimers });
    });
});
/**
 * Get Timer
 * timers/:clockifyTimerId
 * - GET:
 *      summary: gets a timer
 *      description: gets a timer by clockifyTimerId
 */
router.get("/:timerId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const clockifyTimer = yield timer_1.default.get(req.params.timerId);
        return res.json({ clockifyTimer });
    });
});
/**
 * Update Timer
 * timers/:clockifyTimerId
 * - PUT:
 *      summary: updates a timer
 *      description: updates a timer
 *      requestBody: accepts data object containing (start, end, projectId, type)
 */
router.put("/:timerId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const timerId = req.params.timerId;
        if (!req.body.data.start) {
            let cTimer = yield timer_1.default.get(timerId);
            req.body.data.start = cTimer.timeInterval.start;
        }
        const clockifyTimer = yield timer_1.default.update(timerId, req.body.data);
        return res.json({ message: `Successfully updated timer ${timerId}`, clockifyTimer: clockifyTimer });
    });
});
/**
 * Delete Timer
 * timers/:clockifyTimerId
 * - DELETE:
 *      summary: deletes a timer
 *      description: deletes a timer
 */
router.delete("/:timerId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const timerId = req.params.timerId;
        yield timer_2.default.remove(req.params.timerId);
        yield timer_1.default.delete(timerId);
        return res.json({ message: `Successfully deleted timer ${timerId}` });
    });
});
exports.default = router;
