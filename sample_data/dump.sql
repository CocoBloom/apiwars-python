ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS pk_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.registration DROP CONSTRAINT IF EXISTS pk_registration_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.registration DROP CONSTRAINT IF EXISTS fk_user_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.registration DROP CONSTRAINT IF EXISTS fk_user_name CASCADE;

DROP TABLE IF EXISTS public.users;
CREATE TABLE users (
    id serial NOT NULL,
    user_name text UNIQUE
);

DROP TABLE IF EXISTS public.registration;
CREATE TABLE registration (
    id serial NOT NULL,
    user_name text,
    user_password text,
    registration_date timestamp without time zone
);

ALTER TABLE ONLY users
    ADD CONSTRAINT pk_user_id PRIMARY KEY (id);

ALTER TABLE ONLY registration
    ADD CONSTRAINT fk_user_name FOREIGN KEY (user_name) REFERENCES users(user_name);

INSERT INTO users VALUES (1, 'coco@gmail.com');
INSERT INTO registration VALUES (1, 'coco@gmail.com', '$2b$12$bZuY9lN0kxC56Er503hGtewIizHsvH8HuOb1.l1MDyRJjzlbH9uCC','2017-05-01 05:49:00');