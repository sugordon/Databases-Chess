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
var player = {	  //THIS QUERIES THE PLAYER TABLE, RETURNS MATCHING PLAYER TUPLES IN JSON FORMAT
    "type"    :   "1",
	"name"	  :   "Sophie",
	"birth_year_lower" : "1964",
	"birth_year_upper" : "2001",
	"elo_lower" : "1970",
	"elo_upper" : "2600",
	"nationality" : "",
	"sex" : "F"
};

var game = {   //THIS QUERIES THE GAMES TABLE, RETURNS MATCHING GAMES TUPLES (ONLY GAME INFO, NOT GAME MOVES) IN JSON FORMAT
	"type" : "2",
	"event" : "World Cup",
	"player1" : "Boris",
	"player2" : "Rahman",
	"date_lower" : "",
	"date_upper" : "",
	"eco" : "A40",
	"position" : "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1",
};

var opening = { //THIS QUERIES THE OPENINGS TABLE, RETURNS OPENINGS TUPLES (ONLY OPENING INFO, NOT OPENING MOVES) IN JSON FORMAT
	"type" : "3",
	"eco" : "A40",
	"name_white" : "Queen's pawn",
	"name_black" : "",
	"position" : "rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1",
}; 

var games_moves = { //THIS QUERIES A PARTICULAR GAME FOR ALL ITS MOVES AND RETURNS ALL THE MOVES AND FEN STRINGS FOR THAT GAME
	"type" : "4",
	"game_id" : "1"
};

var openings_moves = { //THIS QUERIES A PARTICULAR OPENING FOR ALL ITS MOVES AND RETURNS ALL THE MOVES AND FEN STRINGS
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
			if (conjuncts.length != 0){
				command += (" WHERE " + conjuncts);
			}
			break;		
		case 2: //games table
			command = "SELECT distinct G.game_id, G.event, G.white_player as white_player_id, G.black_player as ";			command += "black_player_id,P1.name ";
			command += (" as white_player_name, P2.name as black_player_name,  G.result, G.date, G.eco, O.name_white as ");
			command += (" white_opening, O.name_black as black_opening from games G, openings O, players P1, players P2 ");
			command += (" where P1.pid = G.white_player  and P2.pid = G.black_player and O.eco = G.eco ");
			command += (" and G.game_id in (SELECT G3.game_id FROM games_moves G3) ");
			event = object.event;
			player1 = object.player1;
			player2 = object.player2;
			pid1 = object.pid1;
			pid2 = object.pid2;
			date_lower = object.date_lower;
			date_upper = object.date_upper;
			eco = object.eco;
			position = object.position;
			length = object.length;
			//event
			if (event != ""){
				conjuncts += ("AND G.event LIKE '%" + event + "%'");
			}
			//player1 or player2 (or both)
			if (player1 != ""){
				conjuncts += " AND ";
				if (player2 != ""){
					first = "(SELECT P3.pid FROM players P3 where P3.name LIKE '%" + player1 + "%')";
					second = "(SELECT P4.pid FROM players P4 where P4.name LIKE '%" + player2 + "%')";
					conjuncts += ("((G.white_player in " + first + "AND G.black_player in " + second + ") OR ");
					conjuncts += ("(G.white_player in " + second + "AND G.black_player in " + first + "))");
				}else{
					first = "(SELECT P3.pid FROM players P3 where P3.name LIKE '%" + player1 + "%')";
					second = "(SELECT P4.pid FROM players P4 where P4.name LIKE '%" + player1 + "%')";
					conjuncts += ("(G.white_player in " + first + "OR G.black_player in " + second + ")");
				}
			}else if (player2 != ""){
				conjuncts += " AND ";
				first = "(SELECT P3.pid FROM players P3 where P3.name LIKE '%" + player2 + "%')";
				second = "(SELECT P4.pid FROM players P4 where P4.name LIKE '%" + player2 + "%')";
				conjuncts += ("G.white_player in " + first + "OR G.black_player in " + second + ")");
			}
			//pid1 or pid2 (or both)
			if (pid1 != ""){
				conjuncts += " AND ";
				if (pid2 != ""){
					conjuncts += ("((G.white_player = " + pid1 + " AND G.black_player = " + pid2 + ")");
					conjuncts += ("OR (G.white_player = " + pid2 + " AND G.black_player = " + pid1 + "))");
				}else{
					conjuncts += ("(G.white_player = " + pid2 + "OR G.black_player = " + pid2 + ")");
				}
			}else if (pid2 != ""){
				conjuncts += " AND ";
				conjuncts += ("G.white_player = " + pid + "OR G.black_player in " + second + ")");
			}
			//date
			if (date_lower != ""){
				conjuncts += " AND ";
				if (date_upper == date_lower){
					conjuncts += ("G.date_year = " + date_upper);
				}else if (date_upper != ""){
					conjuncts += ("G.date BETWEEN " + date_lower + " AND " + date_upper);
				}else{
					conjuncts += ("G.date > " + date_lower);
				}
			}else if (date_upper != ""){
				conjuncts += " AND " ;
				conjuncts += ("G.date < " + date_upper);
			}
			//eco
			if (eco != ""){
				conjuncts += " AND ";
				conjuncts += ("G.eco = '" + eco + "'");
			}
			if (position != ""){
				conjuncts += " AND ";
				move_id = "(SELECT M.move_id FROM moves M where M.position LIKE '%" + position + "%')";
				game_id = "(SELECT G2.game_id FROM games_moves G2 where G2.move_id in " + move_id + ")";
				conjuncts += ("G.game_id in " + game_id);
			}
			command += conjuncts;
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
				move_id = "(SELECT M.move_id FROM moves M where M.position LIKE '%" + position + "%')";
				eco = "(SELECT O2.eco FROM openings_moves O2 where O2.move_id in " + move_id + ")";
				conjuncts += ("eco in " + eco);
			}
			if (conjuncts.length != 0){
				command += (" WHERE " + conjuncts);
			}
			break;
		case 4:
			command = "SELECT distinct G.game_id,G.move_number,M.position,M.move FROM games_moves G, moves M "
			command += ("where G.move_id = M.move_id AND G.game_id = " + object.game_id + " order by game_id,move_number");
			if (conjuncts.length != 0){
				command += (" WHERE " + conjuncts);
			}
			break;
		case 5:
			command = "SELECT distinct O.eco,O.move_number,M.position,M.move FROM openings_moves O, moves M "
			command += ("where O.move_id = M.move_id AND O.eco = '" + object.eco + "' order by eco,move_number");
			if (conjuncts.length != 0){
				command += (" WHERE " + conjuncts);
			}
			break;
	}
	command += " LIMIT 500";
	console.log(command);
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
