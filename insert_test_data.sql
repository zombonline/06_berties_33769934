# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, hashed_password, first_name, last_name, email)VALUES
('gold', '$2b$10$rORyNzCI4ILqsZS2JFTsGezKwqSbi2.lhseR6pIZvCdZPGOA2o/aS', 'John', 'Goldmiths', 'john_goldsmiths@example.com');
