
/**
 * Module dependencies
 */

var express = require('express');
var routes = require('./routes');
var api = require('./routes/api');
var http = require('http');
var compress = require('compression');
var path = require('path');
var logger = require('morgan')
var bodyParser = require('body-parser');

var app = module.exports = express();

/**
* Configuration
*/

// all environments
app.use(compress());
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.use('/components', express.static('bower_components'));


// Routes
app.get('/', routes.index);

// JSON API
app.get('/api/ping', api.ping);
app.get('/api/search/', api.search);

// redirect all others to the index (HTML5 history)
app.get('*', routes.notFound);

/**
* Start Server
*/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
