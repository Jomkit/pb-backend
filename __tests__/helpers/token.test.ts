import { createToken } from "../../src/helpers/token";
import { IUser } from "../../src/types";

describe("createToken", function() {
    const testUser: IUser = {
        username: "u1",
        firstName: "U1F",
        lastName: "U1L",
        email: "u1@email.com"
    }
    test("it works", function() {
        const token = createToken(testUser);
        expect(typeof(token)).toEqual("string");
    })
})