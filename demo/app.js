var express = require('express');
var path = require('path');

var app = express();

// define static resources
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// redefine express's default settings for locating views
app.set('views', __dirname + '/views');

app.set('view engine', 'vash');

// define routes
app.get('/', function (req, res) {
    res.render('index', { title: 'Menu', errorMessage: ''});
});

app.get('/step1', function (req, res) {
    res.render('step1', { title: 'Step 1', errorMessage: ''});
});

app.listen(process.env.PORT || 3000);