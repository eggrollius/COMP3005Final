DROP TABLE IF EXISTS members, trainers, trainer_availability, admin_staff, fitness_classes, class_enrollments, personal_training_sessions, rooms, equipment, payments CASCADE;

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
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255)
);

CREATE TABLE trainer_availability (
    availability_id SERIAL PRIMARY KEY,
    trainer_id INTEGER NOT NULL REFERENCES trainers(trainer_id),
    available_from TIMESTAMP NOT NULL,
    available_to TIMESTAMP NOT NULL,
    UNIQUE (trainer_id, available_from, available_to),
    CHECK (available_from < available_to)
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
    capacity INTEGER,
    schedule TIMESTAMP NOT NULL
);

CREATE TABLE class_enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(member_id),
    class_id INTEGER NOT NULL REFERENCES fitness_classes(class_id),
    enrollment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (member_id, class_id)
);


CREATE TABLE personal_training_sessions (
    session_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    trainer_id INTEGER REFERENCES trainers(trainer_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
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
VALUES ('John Doe', 'john@example.com', '1234', '1990-01-01', '{"weight": "180lbs", "runTime": "30min"}', '{"heartRate": 60}');

INSERT INTO trainers (name, specialization, password)
VALUES ('Jane Smith', 'Yoga Instructor', '1234');

-- Insert availability times for Jane Smith around April 9th, 2024
INSERT INTO trainer_availability (trainer_id, available_from, available_to)
VALUES 
    (1, '2024-04-09 08:00:00', '2024-04-09 12:00:00'), -- Morning session
    (1, '2024-04-09 14:00:00', '2024-04-09 18:00:00'), -- Afternoon session
    (1, '2024-04-10 08:00:00', '2024-04-10 12:00:00'), -- Next day morning session
    (1, '2024-04-10 14:00:00', '2024-04-10 18:00:00'); -- Next day afternoon session

INSERT INTO rooms (name, capacity) VALUES
('Yoga Studio', 20),
('Spinning Room', 15),
('Aerobics Hall', 30);

INSERT INTO fitness_classes (name, trainer_id, room_id, capacity, schedule)
VALUES 
('Morning Yoga', 1, 1, 20, '2024-04-09 09:00:00'),
('Evening Spinning', 1, 2, 15, '2024-04-09 17:00:00'),
('Aerobics Class', 1, 3, 25, '2024-04-10 10:00:00');
