import { sqlForPartialUpdate } from "../../src/helpers/sql";

describe("partialUpdate function", function() {
    test("it should work for one item", function() {
        const dataToUpdate = {
            fN1: "val1"
        }
        const jsToSql = {fN1: "f_n1"}
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
        expect(result).toEqual({
            setCols: '"f_n1"=$1',
            values: ["val1"]
        })
    })
    test("it should work for two items", function() {
        const dataToUpdate = {
            fN1: "val1",
            fN2: 2
        }
        const jsToSql = {fN1: "f_n1", fN2: "f_n2"}
        const result = sqlForPartialUpdate(dataToUpdate, jsToSql);
        expect(result).toEqual({
            setCols: '"f_n1"=$1, "f_n2"=$2',
            values: ["val1", 2]
        })
    })
})