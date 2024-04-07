DROP TABLE IF EXISTS members, trainers, admin_staff, fitness_classes, personal_training_sessions, rooms, equipment, payments CASCADE;

CREATE TABLE members (
    member_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    fitness_goals JSONB,
    health_metrics JSONB
);

CREATE TABLE trainers (
    trainer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255)
);

CREATE TABLE admin_staff (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE fitness_classes (
    class_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trainer_id INTEGER REFERENCES trainers(trainer_id),
    room_id INTEGER,
    schedule TIMESTAMP NOT NULL
);

CREATE TABLE personal_training_sessions (
    session_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    trainer_id INTEGER REFERENCES trainers(trainer_id),
    scheduled_time TIMESTAMP NOT NULL
);

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capacity INTEGER NOT NULL
);

CREATE TABLE equipment (
    equipment_id SERIAL PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL 
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    description VARCHAR(255) NOT NULL 
);

INSERT INTO members (name, email, password, dob, fitness_goals, health_metrics)
VALUES ('John Doe', 'john@example.com', 'hashed_password_here', '1990-01-01', '{"weight": "180lbs", "runTime": "30min"}', '{"heartRate": 60}');

INSERT INTO trainers (name, specialization)
VALUES ('Jane Smith', 'Yoga Instructor');
