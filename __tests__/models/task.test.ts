import { BadRequestError, NotFoundError } from "../../src/ExpressError";
import Task from "../../src/models/task";
import { commonAfterAll, commonAfterEach, commonBeforeAll, commonBeforeEach } from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function() {
    test("it creates a task given userId and clockifyTaskId", async function() {
        const task = await Task.create(2, "4");
        expect(task).toEqual({
            id: 4, 
            userId: 2, 
            clockifyTaskId: "4"
        });
    })

    test("it throws BadRequestError if task already exists", async function() {
        try{
            await Task.create(1, "1");
            fail();
        }catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})

describe("findAll", function() {
    test("it finds all tasks", async function() {
        const tasks = await Task.findAll();
        expect(tasks).toEqual([
            {
                id: 1, 
                userId: 1, 
                clockifyTaskId: "1"
            },
            {
                id: 2, 
                userId: 1, 
                clockifyTaskId: "2"
            },
            {
                id: 3, 
                userId: 2, 
                clockifyTaskId: "3"
            }
        ])
    })
})

describe("get", function() {
    test("it gets task by clockifyTaskId", async function() {
        const task = await Task.get(1);
        expect(task).toEqual(
            {
                id: 1, 
                userId: 1, 
                clockifyTaskId: "1"
            }
        )
    })

    test("it throws NotFoundError if task doesn't exist", async function() {
        try{
            await Task.get(4);
            fail();
        }catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe("remove", function () {
    test("it deletes task by clockifyTaskId", async function() {
        expect(await Task.findAll()).toHaveLength(3);
        await Task.remove("1");
        const tasks = await Task.findAll();
        expect(tasks).toHaveLength(2);
        expect(tasks).toEqual([
            {
                id: 2, 
                userId: 1, 
                clockifyTaskId: "2"
            },
            {
                id: 3, 
                userId: 2, 
                clockifyTaskId: "3"
            }
        ])
    })

    test("it throws NotFoundError if task doesn't exist", async function() {
        try{
            await Task.remove("99999");
            fail();
        }catch(err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})