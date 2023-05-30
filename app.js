
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");


const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});
 
app.post("/", function(req, res){
    const query = req.body.cityName;
    const apiKey = "74fd7ba8041e758c679959b5cad006f7";
    const unit = "metric";

    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`;
    https.get(geoUrl, function(response){

        response.on("data", function(data){
            const locationData = JSON.parse(data);
            const lat = locationData[0].lat;
            const lon = locationData[0].lon;
        
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

            https.get(weatherUrl, function(response){

                response.on("data", function(data){
                    const weatherData = JSON.parse(data);
                    const temp = weatherData.main.temp.toFixed(1);
                    const weatherDescription = weatherData.weather[0].description;
                    const icon = weatherData.weather[0].icon;
                    const imageURL = `https://openweathermap.org/img/wn/${icon}.png`;
                    const temperatureColor = getTemperatureColor(temp);

                    res.write(`<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Weather Report</title>
                        <style>
                            body {
                                margin: 0;
                                font-family: Arial, sans-serif;
                                background-color: #F5EBEB;
                                background-image: url("./image/Weather_2.jpg");
                                background-size: cover;
                                background-position: center center;
                                background-repeat: no-repeat;
                            }
                            .container {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                            }
                            .weather-card {
                                display: flex;
                                flex-direction: column;
                                width: 500px;
                                background-color: white;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                                overflow: hidden;
                            }
                            .location {
                                padding: 20px;
                                background-color: ${temperatureColor};
                            }
                            .location h1 {
                                font-size: 48px;
                                color: white;
                                margin: 0;
                            }
                            .temperature {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 96px;
                                font-weight: bold;
                                margin: 20px;
                                color: ${temperatureColor};
                            }
                            .description {
                                text-align: center;
                                font-size: 24px;
                                margin: 20px;
                            }
                            .icon {
                                align-self: center;
                                margin: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="weather-card">
                                <div class="location">
                                    <h1>${query}</h1>
                                </div>
                                <div class="temperature">${temp}&deg;C</div>
                                <div class="description">${weatherDescription}</div>
                                <img class="icon" src="${imageURL}" alt="Weather Icon">
                            </div>
                        </div>
                    </body>
                    </html>`);
                    res.send();
                });

            });

        });
        
    });
    
});

function getTemperatureColor(temp) {
    const temperature = parseFloat(temp);
    if (temperature >= 35) {
        return "#cf0000";
    } else if (temperature >= 25) {
        return "#ff8c00";
    } else if (temperature >= 15) {
        return "#ffd700";
    } else if (temperature >= 5) {
        return "#87cefa";
    } else {
        return "#add8e6";
    }
}

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});