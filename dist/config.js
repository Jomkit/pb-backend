"use strict";
/** Shared config for application; can be required many places */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCRYPT_WORK_FACTOR = exports.PORT = exports.SECRET_KEY = void 0;
exports.getDatabaseUri = getDatabaseUri;
require("dotenv").config();
const colors_1 = __importDefault(require("colors"));
const SECRET_KEY = process.env.SECRET_KEY || 'secret-dev';
exports.SECRET_KEY = SECRET_KEY;
const PORT = +process.env.PORT || 3001;
exports.PORT = PORT;
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;
exports.BCRYPT_WORK_FACTOR = BCRYPT_WORK_FACTOR;
// use dev db, test db, or production db
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "postgresql:///pb_test"
        : process.env.DATABASE_URL || "postgresql:///pb";
}
console.log(colors_1.default.green("Productivity Buddy Config:"));
console.log(colors_1.default.yellow("SECRET_KEY: " + SECRET_KEY));
console.log(colors_1.default.yellow("PORT: " + PORT.toString()));
console.log(colors_1.default.yellow("Database URI: " + getDatabaseUri()));
console.log("---");
