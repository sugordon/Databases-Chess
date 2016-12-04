
/**
 * Module dependencies
 */

var express = require('express');
var routes = require('./server');
var api = require('./server/api');
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
app.set('views', path.join(__dirname, 'src'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/components', express.static('node_modules'));


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
