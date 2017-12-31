const express = require("express");
const hbs = require('hbs');
const fs = require('fs');

//for heroku: add the port variable with process.env, give port to app.listen, and provide start script to package.json. when done, you can start the app from the command line with npm start  
//declare the environment variable that heroku will assign
const port = process.env.PORT || 3000;
//create the app server
var app = express();

//declare reusable content --partials-- with an hbs method passing in the path from the root --dirname--
hbs.registerPartials(__dirname + '/views/partials');

//declare helper to generate programatic content like dates
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

//configure express using set with key value pairs --http://expressjs.com/en/4x/api.html#app.set-- including what the templating engine and where the views directory
app.set('view engine', 'hbs');

//add middleware with use then provide the express method or function. First get information about the request.
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {console.log('unable to append log file.');}
    });
    next();
});

//Add maintenance mode renderer to prevent ugly 400s
//app.use((req, res, next) => {
//    res.render('maintenance.hbs');
//});

//takes the absolute path to the project. specify the variable __dirname which stores the path to the project. Add as much middleware as needed. Examples are dynamic content, authentication, and performance tracking. Call next to sequence middleware and keep app going. Without next, user request "hangs, spins, etc" because server has nowhere to go.
app.use(express.static(__dirname + '/public'));

//when rendering, page the page url and the object
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        dynamicContent: "This is content from an object",
        welcomeMessage: "Hi Harry"
    });
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
        dynamicContent: "This is content from an object",
        welcomeMessage: "Hi Harry"
    });
});


//bind the app to a port with listen. IRL this number would be determined dynamically and stored in an environment variable. Listen stops only when told. Listen takes two arguments, the port nbr and a function that executes when the server starts.
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});