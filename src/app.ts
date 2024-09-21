import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import userRoutes from "./controllers/user";
import projectRoutes from "./controllers/project";
import timerRoutes from "./controllers/timer";
import authRoutes from "./controllers/auth";
import surveyRoutes from "./controllers/survey";
import cors from "cors";
import morgan from "morgan";
import { authenticateJWT } from "./middleware/auth";

dotenv.config();

const app: Express = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/projects", projectRoutes);
app.use("/timers", timerRoutes);
app.use("/surveys", surveyRoutes);


/** Generic error handler; anything unhandled goes here. */
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
    
    return res.status(status).json({
        error: { message, status },
      });
});

export default app;