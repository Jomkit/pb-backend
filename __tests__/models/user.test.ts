/* tests for user Model, checks that the models communicate with the database */

import { BadRequestError, NotFoundError, UnauthorizedError } from "../../src/ExpressError";
import User from "../../src/models/user";
import { IUser } from "../../src/types";
import { commonAfterAll, commonAfterEach, commonBeforeAll, commonBeforeEach } from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("authenticate", function () {
    test("it works", async function () {
        const user = await User.authenticate("u1", "password1");
        expect(user).toEqual({
            id: 1,
            username: "u1",
            firstName: "U1F",
            lastName: "U1L",
            email: "u1@email.com",
        })
    })
    
    test("unauth if bad password", async function() {
        try{
            await User.authenticate("u1", "badpassword");
            fail();
        }catch(err: unknown){
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    })
    test("unauth if user not found", async function() {
        try{
            await User.authenticate("notUser", "password1");
            fail();
        }catch(err: unknown){
            expect(err instanceof UnauthorizedError).toBeTruthy();
        }
    })
})

describe("register", function () {
    const testNewUser: IUser = {
        username: "testNewUser", 
        firstName: "TF",
        lastName: "TL",
        email: "test@email.com"
    }

    test("it works", async function() {
        const newUser = await User.register({
            ...testNewUser,
            password: "testPW"
        });
        expect(newUser).toEqual({...testNewUser, id: expect.any(Number)});
    })

    test("it throws badrequest if username taken", async function() {
        try{
            const takenUser = await User.register({
                username: "u1", 
                password: "testpassword",
                firstName: "TF", 
                lastName: "TL",
                email: "test@gmail.com"
            })
            fail();
        }catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})

describe("findAll", function() {
    test("it returns all users", async function() {
        const users = await User.findAll();
        expect(users).toHaveLength(2);
    })
})

describe("get", function() {
    test("it gets a user by userId", async function() {
        const user: IUser = await User.get(1);
        expect(user).toEqual({
            id: 1,
            username: "u1", 
            firstName: "U1F",
            lastName: "U1L",
            email: "u1@email.com"
        })
    })

    test("it throws NotFound error when userId doesn't exist", async function() {
        try{
            await User.get(99999);
            fail();
        } catch(err: unknown){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})

describe("update", function() {
    test("it fully updates users given username and data to update", async function() {
        const updateData: IUser = {
            username: "u1Updated",
            password: "updatedPassword",
            firstName: "U1FUpdated",
            lastName: "U1LUpdated",
            email: "u1Updated@email.com"
        }
        expect(await User.get(1)).toBeTruthy();
        const updatedUser = await User.update(1, updateData);
        expect(updatedUser).toEqual({id: 1, ...updateData});
    });

    test("it partially updates a user given username and data", async function() {
        const originalUser = await User.get(1);
        const updateData: Partial<IUser> = {
            firstName: "U1FUpdated"
        }

        const updatedUser = await User.update(1, updateData);
        
        expect(updatedUser).toEqual({
            id: 1,
            username: originalUser.username,
            password: expect.any(String),
            firstName: updateData.firstName,
            lastName: originalUser.lastName,
            email: originalUser.email
        });
    })
    
    test("it throws NotFound error when id doesn't match", async function() {
        const updateData: IUser = {
            username: "u1Updated",
            password: "updatedPassword",
            firstName: "U1FUpdated",
            lastName: "U1LUpdated",
            email: "u1Updated@email.com"
        }
        try{
            await User.update(99999, updateData);
            fail();
        }catch(err: unknown){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });    
})

describe("remove", function() {
    test("it removes a user given id", async function(){
        expect(await User.findAll()).toHaveLength(2);
        await User.remove(1);
        expect(await User.findAll()).toHaveLength(1);
    });
    test("it throws NotFound error when id doesn't match", async function() {
        try{
            await User.remove(99999);
            fail();
        }catch(err: unknown){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})