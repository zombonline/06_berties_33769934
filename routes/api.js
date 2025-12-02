const express = require("express")
const router = express.Router()

router.get('/books', function (req, res, next) {
    let searchTerm = req.query.search; 
    let priceMin = req.query.min_price;
    let priceMax = req.query.max_price;
    let sortMode = req.query.sort; 
    //check if search term is provided, if not provide all books
    let sqlquery = "SELECT * FROM books WHERE 1=1";
    let queryParams = [];

    if (searchTerm) {
        sqlquery += " AND name LIKE ?";
        queryParams.push(`%${searchTerm}%`);
    }
    if (priceMin) {
        sqlquery += " AND price >= ?";
        queryParams.push(Number(priceMin));
    }
    if (priceMax) {
        sqlquery += " AND price <= ?";
        queryParams.push(Number(priceMax));
    }
    if(sortMode){
        switch (sortMode) {
            case 'price':
                sqlquery += " ORDER BY price ASC";
                break;
            case 'name':
                sqlquery += " ORDER BY name ASC";
                break;
            default:
                // no sorting
        }
    }
    console.log(sqlquery + " with params " + queryParams);
    db.query(sqlquery, queryParams, (err, result) => {
        if (err) {
            next(err)
        } else {
            res.json(result);
        }
    });
});





module.exports = router;