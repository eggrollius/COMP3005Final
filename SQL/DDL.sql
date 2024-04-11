DROP TABLE IF EXISTS members, trainers, trainer_availability, admin_staff, fitness_classes, class_enrollments, personal_training_sessions, rooms, room_bookings, equipment, payments CASCADE;
DROP TYPE IF EXISTS equipment_status;
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
    name VARCHAR(255) NOT NULL
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

CREATE TABLE personal_training_sessions (
    session_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    trainer_id INTEGER REFERENCES trainers(trainer_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

CREATE TABLE rooms (
    room_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Probably remove this table: 
CREATE TABLE room_bookings (
    booking_id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL REFERENCES rooms(room_id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    purpose VARCHAR(255),
    booked_by INTEGER REFERENCES admin_staff(admin_id),
    UNIQUE (room_id, start_time, end_time),
    CHECK (start_time < end_time)
);

CREATE TABLE fitness_classes (
    class_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    trainer_id INTEGER REFERENCES trainers(trainer_id),
    room_id INTEGER,
    room_booking_id INTEGER REFERENCES room_bookings(booking_id),
    capacity INTEGER,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL
);

CREATE TABLE class_enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL REFERENCES members(member_id),
    class_id INTEGER NOT NULL REFERENCES fitness_classes(class_id),
    enrollment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (member_id, class_id)
);

-- Create ENUM type for equipment status
CREATE TYPE equipment_status AS ENUM ('operational', 'maintenance', 'out_of_service');

-- Create the table using the ENUM type
CREATE TABLE equipment (
    equipment_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    status equipment_status NOT NULL
);

CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(member_id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP NOT NULL,
    description VARCHAR(255) NOT NULL 
);
