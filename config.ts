/** Shared config for application; can be required many places */

require("dotenv").config();
import colors from "colors";

const SECRET_KEY = process.env.SECRET_KEY || 'secret-dev';

const PORT = +process.env.PORT! || 3001;

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

// use dev db, test db, or production db
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test") 
    ? "postgresql:///pb_test"
    : process.env.DATABASE_URL || "postgresql:///pb";
}

console.log(colors.green("Productivity Buddy Config:"));
console.log(colors.yellow("SECRET_KEY: " + SECRET_KEY));
console.log(colors.yellow("PORT: " + PORT.toString()));
console.log(colors.yellow("Database URI: " + getDatabaseUri()));
console.log("---");

export { SECRET_KEY, PORT, BCRYPT_WORK_FACTOR, getDatabaseUri };