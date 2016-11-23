/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  console.log("HELLO WORLD");
  res.json({
  	name: 'Bob'
  });
};