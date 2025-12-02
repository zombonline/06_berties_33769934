//import .env module to load environment variables from .env file
require('dotenv').config();

// Import express and ejs
var express = require ('express')
var ejs = require('ejs')
var mysql = require('mysql2')
const path = require('path')
var session = require ('express-session')
const expressSanitizer = require('express-sanitizer');
// Create the express application object
const app = express()
const port = process.env.PORT || 8000;

// Define the database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
global.db = db;


// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and static js)
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        expires: 6000000    
    } 
}))

app.use(expressSanitizer());

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Define our application-specific data
app.locals.shopData = {
    shopName: "Bertie's Books"

}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /books
const booksRoutes = require('./routes/books')
app.use('/books', booksRoutes)

// Load the route handlers for /weather
const weatherRoutes = require('./routes/weather')
app.use('/weather', weatherRoutes)

// Load the route handlers for /api
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Start the web app listening
app.listen(port, () => console.log(`Example app listening on port ${port}!`))