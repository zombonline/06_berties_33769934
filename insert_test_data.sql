# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (userName, hashed_password, first_name, last_name, email)VALUES
('gold', '$2b$10$7.F9mqAo8EAc876E2d0cpeWFu0tGxPr5eZCnhzpw6oI2JpT3H9aKu', 'John', 'Goldmiths', 'john_goldsmiths@example.com');