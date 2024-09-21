import request from "supertest";
import app from "../../src/app";

import { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } from "./_testCommon";
import { NotFoundError } from "../../src/ExpressError";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("POST /surveys", function() {
    test("it works", async function() {
        const resp = await request(app).post("/surveys").send({
            taskId: "3",
            projectId: "3",
            timerId: "4",
            score: 5
        });
        expect(resp.body).toEqual({
            id: expect.any(Number),
            taskId: "3",
            projectId: "3",
            timerId: "4",
            score: 5,
            description: null
        })
    });
})

describe("GET /surveys", function() {
    test("it works", async function() {
        const resp = await request(app).get("/surveys");
        expect(resp.body).toEqual({
            surveys: [
                {
                    id: expect.any(Number),
                    taskId: "1",
                    projectId: "1",
                    timerId: "1",
                    score: 5,
                    description: 'test survey'
                },
                {
                    id: expect.any(Number),
                    taskId: "1",
                    projectId: "1",
                    timerId: "2",
                    score: 3,
                    description: 'test survey 2'
                },
                {
                    id: expect.any(Number),
                    taskId: "2",
                    projectId: "2",
                    timerId: "3",
                    score: 1,
                    description: 'test survey 3'
                }
            ]
        })
    })
})

describe("GET /surveys/:surveyId", function() {
    test("it works", async function() {
        const resp = await request(app).get("/surveys/1");
        expect(resp.body).toEqual({
            survey: {
                id: expect.any(Number),
                taskId: "1",
                projectId: "1",
                timerId: "1",
                score: 5,
                description: 'test survey'
            }
        })
    })
})

describe("PATCH /surveys/:surveyId", function() {
    test("it works", async function() {
        const resp = await request(app).patch("/surveys/1").send({
            score: 4
        });
        expect(resp.body).toEqual({
            survey: {
                id: expect.any(Number),
                taskId: "1",
                projectId: "1",
                timerId: "1",
                score: 4,
                description: 'test survey'
            }
        })
    })
})

describe("DELETE /surveys/:surveyId", function() {
    test("it works", async function() {
        const allSurveys = await request(app).get("/surveys");
        expect(allSurveys.body.surveys).toHaveLength(3);

        const resp = await request(app).delete("/surveys/1");
        expect(resp.status).toEqual(200);

        const allSurveysAfter = await request(app).get("/surveys");
        expect(allSurveysAfter.body.surveys).toHaveLength(2);
        
        expect(resp.body).toEqual({
            message: `Deleted survey 1`
        })
    })
})