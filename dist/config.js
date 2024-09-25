"use strict";
/** Shared config for application; can be required many places */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCRYPT_WORK_FACTOR = exports.PORT = exports.SECRET_KEY = void 0;
exports.getDatabaseUri = getDatabaseUri;
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + '/.env' });
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
