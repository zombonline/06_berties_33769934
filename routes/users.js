// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt');
const redirectLogin = require('../middleware/redirectLogin');
const { check, validationResult } = require('express-validator');

router.get('/register', function (req, res, next) {
    res.render('register.ejs', { errors: [] })
})

router.post('/registered', 
                [
                    check('email').isEmail().withMessage('Must be a valid email address'), 
                    check('username').isLength({ min: 3, max: 20}).withMessage('Username must be between 3 and 20 characters'),
                    check('password').isLength({ min: 8}).withMessage('Password must be at least 8 characters long')
                ], 
                 function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register', { errors: errors.array() });
    }
    else { 
            let sqlqueryCheck = "SELECT * FROM users WHERE username = ?";
    let searchterm = [req.sanitize(req.body.username)];
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
        let newrecord = [req.sanitize(req.body.username), hashedPassword, req.sanitize(req.body.first), req.sanitize(req.body.last), req.body.email]
        db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                next(err)
            }
            else
                result = 'Hello '+ req.sanitize(req.body.first) + ' '+ req.sanitize(req.body.last) +' you are now registered!  We will send an email to you at ' + req.body.email + '. <br/>'
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            res.send(result)
        })
    });
    }
});


router.get('/login', function (req, res, next) {
    res.render('login.ejs')
})

router.get('/logout', redirectLogin, (req,res) => {
    req.session.destroy(err => {
    if (err) {
        return res.redirect('./')
    }
    res.send('you are now logged out. <a href='+'/'+'>Home</a>');
    })
})

router.post('/login_attempt', function (req, res, next) {
    const sqlqueryUsers = "SELECT * FROM users WHERE username = ?";
    const searchterm = [req.sanitize(req.body.username)];

    db.query(sqlqueryUsers, searchterm, (err, result) => {
        if (err) return next(err);

        // Username not found
        if (result.length === 0) {
            recordAttempt(null, req.sanitize(req.body.username), false, next);
            return res.send('No such user found');
        }

        const user = result[0];
        const hashedPassword = user.hashed_password;
        const plainPassword = req.body.password;

        bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
            if (err) return next(err);

            // Record attempt with user_id and attempted_username
            recordAttempt(user.user_id, req.sanitize(req.body.username), isMatch, next);

            if (isMatch) {
                req.session.userId = user.user_id; // Set the user ID in session
                res.send('Login successful!');
            } else {
                res.send('Invalid password');
            }
        });
    });
});

// Utility function for recording login attempts
function recordAttempt(userId, attemptedUsername, success, next) {
    const sql = `
        INSERT INTO login_attempts (user_id, attempted_username, attempt_date, success)
        VALUES (?, ?, ?, ?)
    `;
    const params = [userId, attemptedUsername, new Date(), success];

    db.query(sql, params, (err) => {
        if (err) return next(err);
        console.log('Login attempt recorded');
    });
}


router.get('/audit', function (req, res, next) {
    let filter = req.query.valid_username || "all";

    let sqlquery = "SELECT * FROM login_attempts";

    if (filter === "valid_only") {
        sqlquery += " WHERE user_id IS NOT NULL";
    } 
    else if (filter === "invalid_only") {
        sqlquery += " WHERE user_id IS NULL";
    }

    db.query(sqlquery, (err, result) => {
        if (err) return next(err);
        
        res.render("audit.ejs", {
            loginAttempts: result,
            validUsernameFilter: filter
        });
    });
});

router.get('/list', redirectLogin ,function (req, res, next) {
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
