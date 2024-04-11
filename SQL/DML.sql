-- Insert data into members
INSERT INTO members (name, email, password, dob, fitness_goals, health_metrics)
VALUES ('John Doe', 'john@example.com', '1234', '1990-01-01', '{"weight": "180lbs", "runTime": "30min"}', '{"heartRate": 60}');

-- Insert data into trainers
INSERT INTO trainers (name, specialization, password)
VALUES ('Jane Smith', 'Yoga Instructor', '1234');

-- Insert availability for trainers
INSERT INTO trainer_availability (trainer_id, available_from, available_to)
VALUES 
(1, '2024-04-09 08:00:00', '2024-04-09 12:00:00'),
(1, '2024-04-09 14:00:00', '2024-04-09 18:00:00'),
(1, '2024-04-10 08:00:00', '2024-04-10 12:00:00'),
(1, '2024-04-10 14:00:00', '2024-04-10 18:00:00');

-- Insert data into admin_staff
INSERT INTO admin_staff (name, role)
VALUES ('Alice Johnson', 'Manager'),
       ('Bob Smith', 'Assistant Manager');

-- Insert data into rooms
INSERT INTO rooms (name) VALUES ('Yoga Studio'), ('Spinning Room'), ('Aerobics Hall');

-- Insert data into fitness_classes
INSERT INTO fitness_classes (name, trainer_id, room_id, capacity, start_time, end_time)
VALUES 
('Morning Yoga', 1, 1, 20, '2024-04-09 09:00:00', '2024-04-09 11:00:00'),
('Evening Spinning', 1, 2, 15, '2024-04-09 17:00:00', '2024-04-09 19:00:00'),
('Aerobics Class', 1, 3, 25, '2024-04-10 10:00:00', '2024-04-10 12:00:00');

-- Insert sample payments for member_id = 1
INSERT INTO payments (member_id, amount, payment_date, description)
VALUES
(1, 99.99, '2024-04-01 12:00:00', 'Monthly Gym Membership Fee for April 2024'),
(1, 50.00, '2024-04-03 12:00:00', 'Yoga Class Fees'),
(1, 150.00, '2024-04-15 12:00:00', 'Personal Training Session Package'),
(1, 75.00, '2024-05-01 12:00:00', 'Monthly Gym Membership Fee for May 2024'),
(1, 200.00, '2024-05-10 12:00:00', 'Advanced Personal Training'),
(1, 120.00, '2024-05-20 12:00:00', 'Half-Year Wellness Package');
