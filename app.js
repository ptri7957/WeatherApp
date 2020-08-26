require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

// Allows us to use static files such
// as css and js files. Uses the
// 'public' folder as the relative reference
app.use(express.static('public'));

// Allows us to use the body-parser to assign
// user inputs into variables
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// Allows us to use ejs
app.set('view engine', 'ejs');

let city = "";

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  city = req.body.city;
  searched = true;
  res.redirect('/result');
});

app.get('/result', (req, res) => {
  const appId = "YOUR API KEY";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + appId;

  https.get(url, (response) => {
    response.on('data', (data) => {
      const weather = JSON.parse(data);
      res.render('result', {
        city: city,
        maxTemp: weather['main']['temp_max'],
        minTemp: weather['main']['temp_min'],
        description: weather['weather'][0]['description'],
        icon: weather['weather'][0]['icon'],
        date: "Today"
      });

    });
  });
});

let port = process.env.PORT;

if(port == null || port == ""){
  port = 3000;
}

// Listen to the port in which the server
// is running
app.listen(port, function(){
  console.log('Server is running at ' + port);
});
