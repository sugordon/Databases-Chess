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
 
connection.connect();

exports.ping = function(req, res) {
  res.json({
    return: 'PONG'
  });
}

//THIS IS WHAT YOU SHOULD BE SENDING ME, IF A FIELD IS BLANK, MAKE IT AN EMPTY STRING
//THE "type" ATTRIBUTE INDICIATES THE TABLE THAT IS BEING QUERIED
//All tttribute values are to be given to me as strings, I will worry about the conversion

/*
var player = {	  //THIS QUERIES THE PLAYER TABLE
    "type"    :   "1",
	"name"	  :   "Sophie",
	"birth_year_lower" : "1964",
	"birth_year_upper" : "2001",
	"elo_lower" : "1970",
	"elo_upper" : "2600",
	"nationality" : "",
	"sex" : "F"
};

var game = {   //THIS QUERIES THE GAMES TABLE
	"type" : "2",
	"event" : "World Cup",
	"player1" : "Boris",
	"player2" : "Rahman",
	"date_lower" : "",
	"date_upper" : "",
	"eco" : "A40",
	"position" : "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1",
};

var opening = { //THIS QUERIES THE OPENINGS TABLE
	"type" : "3",
	"eco" : "A40",
	"name_white" : "Queen's pawn",
	"name_black" : "",
	"position" : "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1",
}; 

var games_moves = { //THIS QUERIES A PARTICULAR GAME FOR ALL ITS MOVES
	"type" : "4",
	"game_id" : "1"
};

var openings_moves = { //THIS QUERIES A PARTICULAR OPENING FOR ALL ITS MOVES
	"type" : "5",
	"eco" : "B17"
}; */

exports.playersearch = function(req, res) {
  connection.query(getQuery(req.query), function(err, data) {
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

function getQuery(object) {
	//object.query_type determines the table to  query, 1 for players, 2 for games, 3 for openings
	conjuncts = "";
	command = "";
	switch (parseInt(object.type)){
		case 1: //players table
			command = "SELECT * FROM players";
			name = object.name;
			birth_year_lower = object.birth_year_lower;
			birth_year_upper = object.birth_year_upper;
			elo_lower = object.elo_lower;
			elo_upper = object.elo_upper;
			nationality = object.nationality;
			sex = object.sex;
			//name
			if (name != ""){
				conjuncts += ("Name LIKE '%" + name + "%'");
			}
			//birth_year
			if (birth_year_lower != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				if (birth_year_upper == birth_year_lower){
					conjuncts += ("birth_year = " + birth_year_upper);
				}else if (birth_year_upper != ""){
					conjuncts += ("birth_year BETWEEN " + birth_year_lower + " AND " + birth_year_upper);
				}else{
					conjuncts += ("birth_year > " + birth_year_lower);
				}
			}else if (birth_year_upper != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				conjuncts += ("birth_year < " + birth_year_upper);
			}
			//elo
			if (elo_lower != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				if (elo_upper == elo_lower){
					conjuncts += ("elo = " + elo_upper);
				}else if (elo_upper != ""){
					conjuncts += ("elo BETWEEN " + elo_lower + " AND " + elo_upper);
				}else{
					conjuncts += ("elo > " + elo_lower);
				}
			}else if (elo_upper != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				conjuncts += ("elo < " + elo);
			}
			//nationality
			if (nationality != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				conjuncts += ("nationality = '" + nationality + "'");
			}
			//sex
			if (sex != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				conjuncts += ("sex = '" + sex + "'");
			}
			break;
					
		case 2: //games table
			command = "SELECT * FROM games";
			event = object.event;
			player1 = object.player1;
			player2 = object.player2;
			date_lower = object.date_lower;
			date_upper = object.date_upper;
			eco = object.eco;
			position = object.position;
			length = object.length;
			//event
			if (event != ""){
				conjuncts += ("event LIKE '%" + event + "%'");
			}
			//player1 or player2 (or both)
			if (player1 != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				if (player2 != ""){
					first = "(SELECT pid FROM players where name LIKE '%" + player1 + "%')";
					second = "(SELECT pid FROM players where name LIKE '%" + player2 + "%')";
					conjuncts += ("white_player in " + first + "AND black_player in " + second);
				}else{
					first = "(SELECT pid FROM players where name LIKE '%" + player1 + "%')";
					second = "(SELECT pid FROM players where name LIKE '%" + player1 + "%')";
					conjuncts += ("white_player in " + first + "OR black_player in " + second);
				}
			}else if (player2 != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				first = "(SELECT pid FROM players where name LIKE '%" + player2 + "%')";
				second = "(SELECT pid FROM players where name LIKE '%" + player2 + "%')";
				conjuncts += ("white_player in " + first + "OR black_player in " + second);
			}
			//date
			if (date_lower != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				if (date_upper == date_lower){
					conjuncts += ("date_year = " + date_upper);
				}else if (date_upper != ""){
					conjuncts += ("date BETWEEN " + date_lower + " AND " + date_upper);
				}else{
					conjuncts += ("date > " + date_lower);
				}
			}else if (date_upper != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND " ;
				}
				conjuncts += ("date < " + date_upper);
			}
			//eco
			if (eco != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				conjuncts += ("eco = '" + eco + "'");
			}
			if (position != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				subposition = position.substring(0,position.indexOf(" ")+2);
				move_id = "(SELECT move_id FROM moves where position LIKE '%" + subposition + "%')";
				game_id = "(SELECT game_id FROM games_moves where move_id in " + move_id + ")";
				conjuncts += ("game_id in " + game_id);
			}
			break;

		case 3: //openings table
			command = "SELECT * FROM openings";
			eco = object.eco;
			name_white = object.name_white;
			name_black = object.name_black;
			position = object.position;
			length = object.length;
			//eco
			if (eco != ""){
				conjuncts += ("eco = '" + eco + "'");
			}
			//name_white
			if (name_white != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				conjuncts += ("name_white LIKE '%" + name_white + "%'");
			}
			//name_black
			if (name_black != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				conjuncts += ("name_black LIKE '%" + name_black + "%'");
			}
			if (position != ""){
				if (conjuncts.length != 0){
					conjuncts += " AND ";
				}
				subposition = position.substring(0,position.indexOf(" ")+2);
				move_id = "(SELECT move_id FROM moves where position LIKE '%" + subposition + "%')";
				eco = "(SELECT eco FROM openings_moves where move_id in " + move_id + ")";
				conjuncts += ("eco in " + eco);
			}
			break;
		case 4:
			command = "SELECT distinct G.game_id,G.move_number,M.position,M.move FROM games_moves G, moves M "
			command += ("where G.move_id = M.move_id AND G.game_id = " + object.game_id + " order by game_id,move_number");
			break;
		case 5:
			command = "SELECT distinct O.eco,O.move_number,M.position,M.move FROM openings_moves O, moves M "
			command += ("where O.move_id = M.move_id AND O.eco = '" + object.eco + "' order by eco,move_number");
			break;
	}
	if (conjuncts.length != 0){
		command += (" WHERE " + conjuncts);
	}
	if (object.type < 4){
		command += " LIMIT 100";
	}
	//console.log(command);
	return command;
} 

/*
connection.query(getQuery(games_moves), function(err,rows) {
	if (err){ 
		console.log(this.sql);
		console.log("ERROR");
		console.log(err);
		return;
	}
	console.log(rows);
	//console.log(rows);
}); */