// Create a new router
const express = require("express")
const router = express.Router()
const redirectLogin = require('../middleware/redirectLogin');
const { check, validationResult } = require('express-validator');

router.get('/list',  function(req,res,next){
    let sqlquery = "SELECT * FROM books";
    
    db.query(sqlquery, (err, result) => {
        if(err){
            next(err)
        }
        console.log(result)
        res.render("list.ejs", {availableBooks:result, title: "All Available Books"})
    })
})

router.get('/bargainbooks', function(req,res,next){
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    
    db.query(sqlquery, (err, result) => {
        if(err){
            next(err)
        }
        console.log(result)
        res.render("list.ejs", {availableBooks:result, title: "Bargain Books under £20"})
    })
})

router.get('/addbook', redirectLogin, function(req,res,next){
    res.render("addbook.ejs", { errors: [] })
})

router.post('/bookadded', 
    [
        check('price').isFloat({ min: 0.00 }).withMessage('Price must be a positive number'),
        check('name').isLength({ min: 1 }).withMessage('Book name cannot be empty')
    ],
    function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('addbook.ejs', { errors: errors.array() });
    }
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.sanitize(req.body.name), Number(req.body.price)]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.sanitize(req.body.name) + ' price '+ Number(req.body.price))
    })
}) 


router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search_result', function (req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchterm = ['%' + req.query.keyword + '%']
    
    db.query(sqlquery, searchterm, (err, result) => {
        if(err){
            next(err)
        }
        console.log(result)
        res.render("list.ejs", {availableBooks:result, title: "Search Results for: " + req.query.keyword})
    })
});

// Export the router object so index.js can access it
module.exports = router
