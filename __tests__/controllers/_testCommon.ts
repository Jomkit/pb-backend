import db from "../../db";
import User from "../../src/models/user";

async function resetTables() {
    await db.query("DELETE FROM users");
    await db.query("DELETE FROM users_projects");
    await db.query("DELETE FROM users_timers");
    await db.query("DELETE FROM users_tasks");
    await db.query("DELETE FROM surveys");
}

async function commonBeforeAll() {
    // noinspection SqlWithoutWhere
    await resetTables();

    // create test users
    await User.register(
        {
            username: "u1",
            firstName: "U1F",
            lastName: "U1L",
            email: "u1@email.com",
            password: "password1"
        }
    );
    await User.register(
        {
            username: "u2",
            firstName: "U2F",
            lastName: "U2L",
            email: "u2@email.com",
            password: "password2"
        }
    );
    await User.register(
        {
            username: "u3",
            firstName: "U3F",
            lastName: "U3L",
            email: "u3@email.com",
            password: "password3"
        }
    );

    // create test survey//create test users_projects instances
    await db.query(`
        INSERT INTO users_projects
            (user_id, clockify_project_id)
        VALUES
            (1, 1),
            (1, 2),
            (2, 3)
        `);

    // create test users_timers instances
    await db.query(`
        INSERT INTO users_timers
            (user_id, clockify_timer_id)
        VALUES
            (1, 1),
            (1, 2),
            (2, 3),
            (2, 4)
        `);
        
    // create test users_tasks instances
    await db.query(`
        INSERT INTO users_tasks
            (user_id, clockify_task_id)
        VALUES
            (1, 1),
            (1, 2),
            (2, 3)
        `);

    // create test surveys
    await db.query(`
        INSERT INTO surveys
            (task_id, project_id, timer_id, score, description)
        VALUES
            (1, 1, 1, 5, 'test survey'),
            (1, 1, 2, 3, 'test survey 2'),
            (2, 2, 3, 1, 'test survey 3')
        `);
}

async function commonBeforeEach() {
    await db.query("BEGIN");
}

async function commonAfterEach() {
    await db.query("ROLLBACK");
}

async function commonAfterAll() {
    await resetTables();
    await db.query("ALTER SEQUENCE users_id_seq RESTART");
    await db.query("ALTER SEQUENCE users_projects_id_seq RESTART");
    await db.query("ALTER SEQUENCE users_timers_id_seq RESTART");
    await db.query("ALTER SEQUENCE users_tasks_id_seq RESTART");
    await db.query("ALTER SEQUENCE surveys_id_seq RESTART");
    await db.end();
}

export { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll }