var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'chess'
});

/*
 * Serve JSON to our AngularJS client
 */

exports.ping = function(req, res) {
  res.json({
    return: 'PONG'
  });
}

exports.search = function(req, res) {
  connection.query(req.query.value, function(err, data) {
    if (err) {
      res.json({
        data: 'ERROR'
      });
      return;
    } else {
      res.json({
        data: data
      });
    }
  });
}
