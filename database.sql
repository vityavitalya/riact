CREATE DATABASE IF NOT EXISTS reactbooks CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reactbooks;

DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'User',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    description TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'Администратор', 'admin@books.ru', '$2y$10$WhZJTZV26649t/6xp4pM3O7oTyofbryN6.s3aldAQm0Zswx9NIT4e', 'Admin'),
(2, 'Иван', 'user@books.ru', '$2y$10$YuRvBv3Y.Wc7gdLRRzlb4.MuQTJqd8eZkEWH5RRkGDBjRNQuWvP7y', 'User'),
(3, 'Анна', 'anna@books.ru', '$2y$10$7SdYB7EyrhQwko2Ds6RC3Opr47g5tOQL6Na0m4zFGtYfJEIA69TV6', 'User');

INSERT INTO items (user_id, title, author, year, description) VALUES
(1, 'Мастер и Маргарита', 'Михаил Булгаков', 1967, 'Роман о визите дьявола в Москву 1930-х и о любви Мастера и Маргариты.'),
(1, 'Евгений Онегин', 'Александр Пушкин', 1833, 'Роман в стихах о скучающем молодом дворянине и Татьяне Лариной.'),
(2, 'Преступление и наказание', 'Фёдор Достоевский', 1866, 'История студента Раскольникова, который решился на преступление.'),
(2, 'Война и мир', 'Лев Толстой', 1869, 'Эпопея о жизни русского общества во время войн с Наполеоном.'),
(2, 'Мёртвые души', 'Николай Гоголь', 1842, 'Чичиков ездит по помещикам и скупает умерших крестьян.'),
(3, 'Отцы и дети', 'Иван Тургенев', 1862, 'Спор поколений и нигилист Евгений Базаров.'),
(3, 'Герой нашего времени', 'Михаил Лермонтов', 1840, 'Несколько историй из жизни офицера Григория Печорина.');
