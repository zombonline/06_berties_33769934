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
