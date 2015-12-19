var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

// define static resources
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// redefine express's default settings for locating views
app.set('views', __dirname + '/views');
app.set('view engine', 'vash');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true}));

// define routes
app.get('/', function (req, res) {
    res.render('index', { title: 'Menu', errorMessage: ''});
});

app.get('/step1', function (req, res) {
    res.render('demo-step1', { title: 'Demo 1/2', errorMessage: ''});
});

app.post('/step1', function (req, res) {
    if (req.body.requiredField.length < 3){
        res.render('demo-step1', { title: 'Demo 1/2', errorMessage: 'requiredField must be >= 3 chars'});
        return;
    }
    res.render('demo-step2', { title: 'Demo 2/2', errorMessage: ''});
});

app.post('/step2', function (req, res) {
    res.render('index', { title: 'Menu', errorMessage: 'The last answer was ' + req.body.answer});
});

app.listen(process.env.PORT || 3000);