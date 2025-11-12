// Create a new router
const express = require("express")
const router = express.Router()

router.get('/list', function(req,res,next){
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

router.get('/addbook', function(req,res,next){
    res.render("addbook.ejs", {})
})

router.post('/bookadded', function (req, res, next) {
    console.log(req.body)
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This book is added to database, name: '+ req.body.name + ' price '+ req.body.price)
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
