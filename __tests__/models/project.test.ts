/** tests for project Model */
import { BadRequestError, NotFoundError } from "../../src/ExpressError";
import Project from "../../src/models/project";
import { commonAfterAll, commonAfterEach, commonBeforeAll, commonBeforeEach } from "./_testCommon";

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("findAll", function() {
    test("it works", async function() {
        const projects = await Project.findAll();
        expect(projects).toEqual([
            {
                id: 1, 
                userId: 1, 
                clockifyProjectId: "1"
            },
            {
                id: 2, 
                userId: 1, 
                clockifyProjectId: "2"
            },
            {
                id: 3, 
                userId: 2, 
                clockifyProjectId: "3"
            }
        ])
    })
})

describe("findById", function() {
    test("it finds all projects with same user", async function() {
        const project = await Project.findByUserId(1);
        expect(project).toEqual([
            {id: 1, userId: 1, clockifyProjectId: "1"},
            {id: 2, userId: 1, clockifyProjectId: "2"}
        ])
    })
})

describe("create", function() {
    test("it works", async function() {
        const project = await Project.create(2, "5");
        expect(project).toEqual({
            id: 4, 
            userId: 2, 
            clockifyProjectId: "5"
        });
    });

    test("it throws BadRequestError if project already exists", async function() {
        try{
            await Project.create(1, "1");
            fail();
        }catch(err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    })
})

describe("remove", function() {
    test("it works", async function() {
        expect(await Project.findAll()).toHaveLength(3);
        await Project.remove("1");
        const projects = await Project.findAll();
        expect(projects).toHaveLength(2);
        expect(projects).toEqual([
            {
                id: 2, 
                userId: 1, 
                clockifyProjectId: "2"
            },
            {
                id: 3, 
                userId: 2, 
                clockifyProjectId: "3"
            }
        ])
    })

    test("it throws NotFound error when id doesn't match", async function() {
        try{
            await Project.remove("99999");
            fail();
        }catch(err: unknown){
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    })
})