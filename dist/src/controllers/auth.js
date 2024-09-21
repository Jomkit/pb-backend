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
const userSchemas_1 = require("../schemas/userSchemas");
const inputValidation_1 = __importDefault(require("../middleware/inputValidation"));
const token_1 = require("../helpers/token");
const router = express_1.default.Router();
/**
 * Authenticates a user and returns a token
 * - POST /auth/token
 *
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @returns {Promise<string>} A token that can be used for future authentication
 */
router.post("/token", (0, inputValidation_1.default)(userSchemas_1.userSchema), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, password } = req.body;
            const user = yield user_1.default.authenticate(username, password);
            const token = yield (0, token_1.createToken)(user);
            return res.json({ token });
        }
        catch (err) {
            return next(err);
        }
    });
});
/**
 * Authenticates a user and returns a token
 * - POST /auth/register
 *
 * @function
 * @param {express.Request} req - The express request object
 * @param {express.Response} res - The express response object
 * @param {express.NextFunction} next - The express next function
 *
 * @returns {Promise<express.Response>} The express response object with the json property set to the token
 */
router.post("/register", (0, inputValidation_1.default)(userSchemas_1.userSchema), function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newUser = yield user_1.default.register(Object.assign({}, req.body));
            const token = yield (0, token_1.createToken)(newUser);
            return res.status(201).json({ token: token });
        }
        catch (err) {
            next(err);
        }
    });
});
exports.default = router;
