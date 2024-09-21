import { commonAfterAll, commonAfterEach, commonBeforeAll, commonBeforeEach } from "./_testCommon";
import Timer from "../../src/models/timer";
import { BadRequestError, NotFoundError } from "../../src/ExpressError";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("create", function () {
    test("it creates a timer given userId and clockifyTimerId", async function () {
        const result = await Timer.create(2, "5");
        expect(result).toEqual({
            id: 5,
            userId: 2,
            clockifyTimerId: "5"
        })
    })

    test("throws BadRequestError if timer already exists", async function () {
        try {
            await Timer.create(1, "1");
            fail();
        } catch (err: unknown) {
            console.log(err);
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
    test("throws NotFoundError if user doesn't exist", async function () {
        try {
            await Timer.create(99999, "123");
            fail();
        } catch (err: unknown) {
            console.log(err);
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe("findAll", function() {
    test("it finds all timers", async function() {
        const timers = await Timer.findAll(1);
        expect(timers).toEqual([
            {
                id: 1, 
                userId: 1, 
                clockifyTimerId: "1"
            },
            {
                id: 2, 
                userId: 1, 
                clockifyTimerId: "2"
            }
        ]);
    })
})

describe("get", function() {
    test("it gets timer by clockifyTimerId", async function() {
        const timer = await Timer.get("1");
        expect(timer).toEqual({
            id: 1, 
            userId: 1, 
            clockifyTimerId: "1"
        })
    })
    test("it throws NotFoundError if timer doesn't exist", async function() {
        try{
            await Timer.get("9999");
            fail();
        }catch(err: unknown) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe("delete", function() {
    test("it deletes a timer by ClockifyTimerId", async function (){
        expect(await Timer.findAll(1)).toHaveLength(2);
        await Timer.remove("1");
        const timers = await Timer.findAll(1);
        expect(timers).toHaveLength(1);
        expect(timers).toEqual([
            {
                id: 2, 
                userId: 1, 
                clockifyTimerId: "2"
            }
        ]);
    })

    test("throws NotFoundError if timer doesn't exist", async function() {
        try{
            await Timer.remove("999999999");
            fail();
        }catch(err: unknown) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})