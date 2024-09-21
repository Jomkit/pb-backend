import { BadRequestError } from "../ExpressError";

/** Helper for making partial update queries
 * 
 * The calling function can use this to make SET clause of
 * an SQL UPDATE statement
 * 
 * @param {Object} dataToUpdate {field1: newVal1, field2: newVal2...}
 * @param {Object} jsToSql maps naming convention of js-style data fields to db column names, ex: {firstName: "first_name", email: "email"}.
 * 
 * @returns {Object} {sqlSetCols, dataToUpdate}
 * 
 * @example {lastName: "bond", email: "james@mib.com"} => 
 * { setCols: '"last_name"=$1, "email"=$2', 
 *   values: ["bond", "james@mib.com"] }
 */
function sqlForPartialUpdate(dataToUpdate: Object, jsToSql: {[key: string]: string | null} = {}) {
    const keys = Object.keys(dataToUpdate);
    if (keys.length === 0) throw new BadRequestError("No data");

    // {firstName: 'james', email: 'bond@mib.com'} => ['"first_name"=$1', '"email"=$2']
    const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`);
    return {
        setCols: cols.join(", "),
        values: Object.values(dataToUpdate)
    }
}

export { sqlForPartialUpdate }