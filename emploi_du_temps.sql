CREATE DATABASE IF NOT EXISTS emploi_du_temps;
USE emploi_du_temps;

-- Table des utilisateurs
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','teacher','student') NOT NULL
);

-- Table de l’emploi du temps
CREATE TABLE emploi_du_temps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    enseignant_id INT,
    jour ENUM('lundi','mardi','mercredi','jeudi','vendredi','samedi') NOT NULL,
    horaire VARCHAR(20) NOT NULL,
    salle VARCHAR(50),
    module VARCHAR(50),
    FOREIGN KEY (enseignant_id) REFERENCES users(id)
);

-- Insérer des utilisateurs
INSERT INTO users (username, password, role) VALUES 
('admin', 'admin123', 'admin'),
('teacher', 'teacher123', 'teacher'),
('student', 'student123', 'student'),
('patrick', 'patrick123', 'teacher');

-- Insérer des horaires
INSERT INTO emploi_du_temps (enseignant_id, jour, horaire, salle, module) VALUES 
(2, 'mardi', '10h30-12h30', 'amphi 2', 'java'),
(2, 'lundi', '8h30-10h30', 'amphi 2', 'java'),
(2, 'mercredi', '8h30-10h30', 'amphi 2', 'ASP.NET'),
(2, 'vendredi', '8h30-10h30', 'specia', 'teleinfo');
