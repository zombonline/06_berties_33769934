# Create database script for Berties books

# Create the database
CREATE DATABASE IF NOT EXISTS berties_books;
USE berties_books;

# Create the tables
CREATE TABLE IF NOT EXISTS books (
    id     INT AUTO_INCREMENT,
    name   VARCHAR(50),
    price  DECIMAL(5, 2),
    PRIMARY KEY(id));

CREATE TABLE IF NOT EXISTS users (
    username  VARCHAR(50),
    hashed_password  VARCHAR(255),
    first_name     VARCHAR(50),
    last_name      VARCHAR(50),
    email     VARCHAR(100));

CREATE TABLE if NOT EXISTS login_attempts (
    id INT AUTO_INCREMENT,
    username VARCHAR(50),
    valid_username BOOLEAN,
    attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN,
    PRIMARY KEY(id)
);


# Create the database user and grant permissions
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop';
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';
FLUSH PRIVILEGES;
CREATE USER IF NOT EXISTS 'berties_books_app'@'localhost' IDENTIFIED BY 'qwertyuiop'; 
GRANT ALL PRIVILEGES ON berties_books.* TO 'berties_books_app'@'localhost';

