import db from "../../db";
import { BadRequestError, NotFoundError } from "../../src/ExpressError";
import Survey from "../../src/models/survey";
import { commonAfterAll, commonAfterEach, commonBeforeAll, commonBeforeEach } from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function() {
    test("it creates a new survey given taskId, projectId, timerId, score, and description", async function() {
        //Setup task for test
        await db.query(`
            INSERT INTO users_tasks
            (user_id, clockify_task_id)
            VALUES
            (1, 4)
            `);
        
        const testSurveyData = {
            taskId: "4",
            projectId: "1",
            timerId: "4",
            score: 5,
            description: "test create survey"
        }
        
        const survey = await Survey.create(testSurveyData);
        expect(survey).toEqual({
            id: 4, 
            ...testSurveyData});
    })
    
    test("throws BadRequest Error if timer already has survey", async function() {
        try{
            const badData = {
                taskId: "4",
                projectId: "1",
                timerId: "1",
                score: 5,
                description: "test create survey"
            }
            await Survey.create(badData);
            fail();
        }catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})

describe("findAll", function() {
    test("it finds all surveys", async function() {
        const surveys = await Survey.findAll();
        expect(surveys).toEqual([
            {
                id: 1, 
                taskId: "1",
                projectId: "1",
                timerId: "1",
                score: 5,
                description: "test survey"
            },
            {
                id: 2, 
                taskId: "1",
                projectId: "1",
                timerId: "2",
                score: 3,
                description: "test survey 2"
            },
            {
                id: 3, 
                taskId: "2",
                projectId: "2",
                timerId: "3",
                score: 1,
                description: "test survey 3"
            }
        ])
    })
})

describe("get", function() {
    test("it finds a survey given survey's id", async function() {
        const survey = await Survey.get(1);
        expect(survey).toEqual({
            id: 1, 
            taskId: "1",
            projectId: "1",
            timerId: "1",
            score: 5,
            description: "test survey"
        });
    });
    test("throws NotFoundError if survey id doesn't exist", async function(){
        try{
            await Survey.get(99999);
            fail();
        }catch(err: unknown){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe("update", function() {
    test("it fully updates a survey given survey's id and data to update", async function() {
        const updateData = {
            score: 4,
            description: "test update survey"
        }
        expect(await Survey.get(1)).toEqual({
            id: 1, 
            taskId: "1",
            projectId: "1",
            timerId: "1",
            score: 5,
            description: "test survey"
        })
        const survey = await Survey.update(1, updateData);
        expect(survey).toEqual({
            id: 1, 
            taskId: "1",
            projectId: "1",
            timerId: "1",
            score: 4,
            description: "test update survey"
        });
    })
    test("throws NotFound error if surveyId doesn't exist", async function() {
        const fakeData = {
            score: 4,
            description: "test update not found survey"
        };
        try{
            await Survey.update(99999, fakeData);
            fail();
        }catch(err: unknown){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe("remove", function() {
    test("it removes a survey given survey's id", async function(){
        expect(await Survey.findAll()).toHaveLength(3);
        await Survey.remove(1);
        expect(await Survey.findAll()).toHaveLength(2);
    });
    test("it throws NotFound error when id doesn't match", async function() {
        try{
            await Survey.remove(99999);
            fail();
        }catch(err: unknown){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})