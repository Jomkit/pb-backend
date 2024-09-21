import request from "supertest";
import app from "../../src/app";

import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/****************GET /users */
describe("GET /users", function() {
    test("it works", async function() {
        const resp = await request(app).get("/users");
        expect(resp.body).toEqual({
            users: [
                {id: 1, username: "u1", firstName: "U1F", lastName: "U1L", email: "u1@email.com"},
                {id: 2, username: "u2", firstName: "U2F", lastName: "U2L", email: "u2@email.com"},
                {id: 3, username: "u3", firstName: "U3F", lastName: "U3L", email: "u3@email.com"}
            ]
        })
    })
})