# Berties Books

Sample code for Dynamic Web Applications module.

Uses node.js with Express and EJS.

To install and run:

npm install
node index.js


## Using dotenv

I made us of the dotenv module to manage environment variables for things like the database credentials and server port. A .env file was created in the project root to store these values, and the app now loads them automatically when starting. This .env file is ignored by git as to not share it to the online repository. This keeps sensitive information out of the source code and makes the project easier to configure across different environments.

## Auditing Login Attempts

The application includes a login-attempt auditing feature that records every sign-in attempt, whether successful or not. Each attempt is stored in the database with the username used, the timestamp, and a success flag. This allows administrators to monitor activity and identify unusual or repeated failed login behaviour.

Both valid and invalid usernames are recorded. This ensures that attempts made with incorrect or similar usernames are still logged, providing a more complete picture of access patterns.

The /audit page displays all recorded attempts in a table and includes a filter to view only valid usernames, only invalid usernames, or all attempts together.

## Access Control
I set up a middleware function inside `middleware/redirectLogin.js`. It will simply check there is a userID in the current session and if there is not one, it will serve the login page.
I implemented this on the list of users page and also the add book page. These seemed like appropriate examples of where some access control would be needed, as not everyone should have access to people's information and not everyone should be allowed to add books to our database. 

## Validation
I set up some validation checks inside the `/registered` route to confirm the user has entered valid details, such as a long enough username and password and a valid email. The email is checked already via HTML but multiple layers of validation are best practise. I also set up some validation rules inside the `/bookadded` route to confirm the price of the book being entered was not negative and also that the book title was not an empty string.

## Sanitisation
I applied sanitisation to particular user-inputted fields. In this project I have only sanitised values such as names (usernames, first and last names, names of books etc.) as these were values that would later be displayed on the books list page and user list page etc.
I chose not to sanitise the following:
- Price: This can be validated and then converted to an actual number value (express-validator isNumber check) and then processed further using the Number() function to check if it turns into a NaN value.
- Email: Emails can have a lot of technically valid symbols and nonsense in them so sanitising may break them. Using validation will ensure the input adheres to the RFC format which doesn't allow chars such as `<` and `>`
- Password: This will never be rendered/displayed on screen anyway and is hashed before entering the database where it can cause no harm.

## Note about redirect login.
I wanted to create a way of resuing the redirect login middleware wherever, so I made it its own file I could load with the `require` function. I made it explicity load `/users/login` so that routes in the `/books` handler would still be able to use it. This presented an issue when posted on the virtual machine since the base url include some sub directories `(/usr/224)`. For this reason I made the middleware check the `.env` file for a `BASE_URL` parameter so that I could specify one in the virtual machine environment and it would work both in the dev and production environment.

## Books API Endpoint
I created a flexible API endpoint at `/api/books` that allows clients to retrieve book data with optional filtering and sorting. This endpoint responds with JSON and is intended for programmatic access rather than rendering views.

### Query Parameters
| Parameter | Description                                                                       |
|-----------|-----------------------------------------------------------------------------------|
| search    | Filters books whose name contains the provided search term.                       |
| min_price | Only returns books with a price greater than or equal to this value.              |
| max_price | Only returns books with a price less than or equal to this value.                 |
| sort      | Sorts the results. Accepted values are: price (ascending) or name (alphabetical). |   
```
/api/books?search=doc
/api/books?min_price=5&max_price=20
/api/books?search=the&sort=name
/api/books?search=data&min_price=5&sort=price
```

This is achieved by allowing each term to attach their own "AND value" string to the sqlquery, the initial statement starts with `SELECT * FROM books WHERE 1=1` so that any parameter can be applied using the `AND` keyword.