const express = require("express");
const hbs = require('hbs');
const fs = require('fs');

//for heroku: add the port variable with process.env.PORT, then give port to app.listen, and provide the start script to package.json. When done, you can start the app from the command line with npm start. To deploy from the command line, create the heroku repo: heroku create; then git push heroku; then heroku open.
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

//Add middleware with use then provide the express method or function. This first piece of middleware gets information about the request, before you decide how to respond. Add as much middleware as needed. Examples are static files, dynamic content, authentication, and performance tracking. Call next to sequence middleware and keep app going. Without next, user request "hangs, spins, etc" because server has nowhere to go.
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

//Use works with other express methods to serve files. express.static takes the path to the project. Variable __dirname stores the path to the project. 
app.use(express.static(__dirname + '/public'));

//when rendering, provide the file name and an object with prop value pairs. Render is used with templating whereas send is used with static html files.
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home',
        dynamicContent: "This is content from an object",
        welcomeMessage: "Hi Harry"
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About',
        dynamicContent: "This is content from an object",
        welcomeMessage: "Hi Harry"
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    });
});

//bind the app to a port with listen. Listen takes two arguments, the port --variable or nbr-- and a function that executes when the server starts.
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});