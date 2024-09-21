"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./controllers/user"));
const project_1 = __importDefault(require("./controllers/project"));
const timer_1 = __importDefault(require("./controllers/timer"));
const auth_1 = __importDefault(require("./controllers/auth"));
const survey_1 = __importDefault(require("./controllers/survey"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("tiny"));
app.use(express_1.default.json());
app.use(auth_2.authenticateJWT);
app.use("/auth", auth_1.default);
app.use("/users", user_1.default);
app.use("/projects", project_1.default);
app.use("/timers", timer_1.default);
app.use("/surveys", survey_1.default);
/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test")
        console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    return res.status(status).json({
        error: { message, status },
    });
});
exports.default = app;
