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
const survey_1 = __importDefault(require("../models/survey"));
const router = express_1.default.Router();
/**
 * Create Survey
 * surveys/
 * - POST:
 *      summary: creates a new survey
 *      description: creates a new survey
 */
router.post("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const survey = yield survey_1.default.create(req.body);
            return res.status(201).json(survey);
        }
        catch (err) {
            next(err);
        }
    });
});
/**
 * Find all Surveys
 * surveys/
 * - GET:
 *      summary: gets all surveys
 */
router.get("/", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const surveys = yield survey_1.default.findAll();
        return res.json({ surveys });
    });
});
/**
 * Find all surveys given timer id
 * surveys/timers/:timerId
 * - GET:
 *      summary: gets all surveys given timer id
 */
router.get("/timers/:timerId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const surveys = yield survey_1.default.findAll();
        return res.json({ surveys });
    });
});
/**
 * Get survey by survey id
 * surveys/:surveyId
 * - GET:
 *      summary: gets survey by survey id
 */
router.get("/:surveyId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const surveyId = parseInt(req.params.surveyId);
        const survey = yield survey_1.default.get(surveyId);
        return res.json({ survey });
    });
});
/**
 * Update survey
 * surveys/:surveyId
 * - PATCH:
 *      summary: updates survey
 */
router.patch("/:surveyId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const surveyId = parseInt(req.params.surveyId);
        const survey = yield survey_1.default.update(surveyId, req.body);
        return res.json({ survey });
    });
});
/**
 * Delete survey
 * surveys/:surveyId
 * - DELETE:
 *      summary: deletes survey
 */
router.delete("/:surveyId", function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const surveyId = parseInt(req.params.surveyId);
        const deletedId = yield survey_1.default.remove(surveyId);
        return res.status(200).json({ message: `Deleted survey ${deletedId}` });
    });
});
exports.default = router;
