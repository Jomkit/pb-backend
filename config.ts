/** Shared config for application; can be required many places */

import * as dotenv from 'dotenv'
dotenv.config({path: __dirname + '/.env'})

const SECRET_KEY = process.env.SECRET_KEY || 'secret-dev';

const PORT = +process.env.PORT! || 3001;

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

// use dev db, test db, or production db
function getDatabaseUri() {
    return (process.env.NODE_ENV === "test") 
    ? "postgresql:///pb_test"
    : process.env.DATABASE_URL || "postgresql:///pb";
}

export { SECRET_KEY, PORT, BCRYPT_WORK_FACTOR, getDatabaseUri };