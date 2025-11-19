// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');


router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    //ensure user does not already exist
    let sqlqueryCheck = "SELECT * FROM users WHERE username = ?";
    let searchterm = [req.body.username];
    db.query(sqlqueryCheck, searchterm, (err, result) => {
        if (err) {
            return next(err);
        }
        if (result.length > 0) {
            return res.send('Username already exists. Please choose another username.');
        }
    });

    const plainPassword = req.body.password;
    const saltRounds = 10;
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err);
        }
        // saving data in database
        let sqlquery = "INSERT INTO users (username, hashed_password, first_name, last_name, email) VALUES (?,?,?,?,?)"
        // execute sql query
        let newrecord = [req.body.username, hashedPassword, req.body.first, req.body.last, req.body.email]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else
                result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            res.send(result)
        })
    });
});

router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})
router.post('/login_attempt', function (req, res, next) {
    console.log(req.body);

    const sqlqueryUsers = "SELECT * FROM users WHERE username = ?";
    const searchterm = [req.body.username];
    let userFound = false;

    db.query(sqlqueryUsers, searchterm, (err, result) => {
        if (err) return next(err);
        userFound = result.length > 0;
        // No user found
        if (!userFound) {
            recordAttempt(req.body.username, false, 0, next); 
            return res.send('No such user found');
        }

        const hashedPassword = result[0].hashed_password;
        const plainPassword = req.body.password;

        bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
            if (err) return next(err);

            // Record login attempt now that we know success/failure
            recordAttempt(req.body.username, true, isMatch ? 1 : 0, next);

            if (isMatch) {
                res.send('Login successful!');
            } else {
                res.send('Invalid password');
            }
        });
    });
});


// Utility function for recording login attempts
function recordAttempt(username, validUsername, success, next) {
    const sql = "INSERT INTO login_attempts (username, valid_username, attempt_date, success) VALUES (?, ?, ?, ?)";
    const params = [username, validUsername, new Date(), success];

    db.query(sql, params, (err) => {
        if (err) return next(err);
        console.log('Login attempt recorded');
    });
}

router.get('/audit', function (req, res, next) {
    //check params for valid_username filter
    let validUsernameFilter = req.query.valid_username;
    let sqlquery = "SELECT * FROM login_attempts";
    if(validUsernameFilter === "valid_only"){
        sqlquery += " WHERE valid_username = TRUE";
    }
    else if(validUsernameFilter === "invalid_only"){
        sqlquery += " WHERE valid_username = FALSE";
    }

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        console.log(result)
        res.render("audit.ejs", { loginAttempts: result, validUsernameFilter: validUsernameFilter })
    });
});

router.get('/list', function (req, res, next) {
    let sqlquery = "SELECT * FROM users";
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        console.log(result)
        res.render("listUsers.ejs", { users: result})
    })
})
       

// Export the router object so index.js can access it
module.exports = router
