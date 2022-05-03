const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

const api_key = "6713448805230391f1bdad58e19040c3";

app.get('/', function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post('/', function(req, res){
  const cityName = req.body.cityName;
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&APPID=" + api_key + "&units=metric";
  console.log(url);
  https.get(url, function(response){
    response.on("data", function(data){
      const weatherData = JSON.parse(data);
      console.log(weatherData);
      if (weatherData.cod == 404){
        res.send("City not found");
        return;
      }
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      res.write("<h1>The temperature is " + temp + " degrees of Celsius.</h1>");
      res.write("The weather in "+ cityName +" is currently " + description);
      res.write("<br><image src=http://openweathermap.org/img/wn/"+ icon +"@2x.png>");
      res.send();
    });
  });
});

app.listen(3000, function(){
  console.log('Server up and running!')
});
