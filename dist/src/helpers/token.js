"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const config_1 = require("../../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Return signed JWT from user data
 * @param {IUser} user - user object
 * @param {string} user.username
 *
 * @return {string} signed JWT
 */
function createToken(user) {
    let payload = {
        username: user.username,
        id: user.id
    };
    return jsonwebtoken_1.default.sign(payload, config_1.SECRET_KEY);
}
