// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request');

router.get('/' , function(req,res,next){
    //api call
    let apiKey = process.env.WEATHER_API_KEY;
    let city = req.query.city || 'London';
    let url =  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`

    request(url, function (err, response, body) {
        if(err){
            next(err)
        } else {
            let weatherData = JSON.parse(body)
            //check error code
            if(weatherData.cod != 200){
                return res.send(`Error retrieving weather data for ${city}: ${weatherData.message}`);
            }
            if(weatherData!== undefined && weatherData.main !== undefined){
                res.render("weather.ejs", {weatherData})
            }
        }
    });
})

module.exports = router;