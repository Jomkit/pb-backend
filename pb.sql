\echo 'Delete and recreate productivity buddy db?'
\prompt 'return for yes or control-C to cancel > ' foo
\connect postgres;

DROP DATABASE IF EXISTS pb;
CREATE DATABASE pb;
\connect pb;

\i pb-schema.sql
\i pb-seed.sql

\echo 'Delete and recreate productivity buddy test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS pb_test;
CREATE DATABASE pb_test;
\connect pb_test;

\i pb-schema.sql    