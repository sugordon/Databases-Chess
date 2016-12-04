
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index.html');
};

exports.notFound = function(req, res) {
  console.log("404");
  res.render('index.html');
}
