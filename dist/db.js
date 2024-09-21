"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Database setup for Productivity Buddy */
const pg_1 = require("pg");
const config_1 = require("./config");
let db;
if (process.env.NODE_ENV === "production") {
    db = new pg_1.Client({
        connectionString: (0, config_1.getDatabaseUri)(),
        ssl: {
            rejectUnauthorized: false
        }
    });
}
else {
    db = new pg_1.Client({
        connectionString: (0, config_1.getDatabaseUri)()
    });
}
db.connect();
exports.default = db;
