CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(25) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL 
        CHECK (position('@' IN email) > 1)
);

CREATE TABLE users_projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    clockify_project_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    clockify_task_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE users_timers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    clockify_timer_id VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    task_id VARCHAR(255) REFERENCES users_tasks(clockify_task_id) ON DELETE CASCADE,
    project_id VARCHAR(255) REFERENCES users_projects(clockify_project_id) ON DELETE CASCADE,
    timer_id VARCHAR(255) REFERENCES users_timers(clockify_timer_id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score > 0 AND score <= 5),
    description TEXT
);