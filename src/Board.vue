<template>
<div class='container'>
  <div class='row'>
    <div class='col-lg-6'>
      <div class='spare-pieces'>
        <img v-bind:class='{ selected: (piece == "bK") }' v-on:click='pickup("bK")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/bK.svg"'>
        <img v-bind:class='{ selected: (piece == "bQ") }' v-on:click='pickup("bQ")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/bQ.svg"'>
        <img v-bind:class='{ selected: (piece == "bR") }' v-on:click='pickup("bR")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/bR.svg"'>
        <img v-bind:class='{ selected: (piece == "bB") }' v-on:click='pickup("bB")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/bB.svg"'>
        <img v-bind:class='{ selected: (piece == "bN") }' v-on:click='pickup("bN")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/bN.svg"'>
        <img v-bind:class='{ selected: (piece == "bP") }' v-on:click='pickup("bP")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/bP.svg"'>
        <i v-on:click='pickup("dd")' class="fa fa-times" aria-hidden="true"></i>
      </div>
      <div id='main-board' class="wood chessground vuejs cburnett"></div>
      <div class='spare-pieces'>
        <img v-bind:class='{ selected: (piece == "wK") }' v-on:click='pickup("wK")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/wK.svg"'>
        <img v-bind:class='{ selected: (piece == "wQ") }' v-on:click='pickup("wQ")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/wQ.svg"'>
        <img v-bind:class='{ selected: (piece == "wR") }' v-on:click='pickup("wR")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/wR.svg"'>
        <img v-bind:class='{ selected: (piece == "wB") }' v-on:click='pickup("wB")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/wB.svg"'>
        <img v-bind:class='{ selected: (piece == "wN") }' v-on:click='pickup("wN")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/wN.svg"'>
        <img v-bind:class='{ selected: (piece == "wP") }' v-on:click='pickup("wP")' v-bind:src='"/components/chessground/assets/images/pieces/cburnett/wP.svg"'>
        <i v-on:click='pickup("dd")' class="fa fa-times" aria-hidden="true"></i>
      </div>
      <div>
        <button v-on:click='empty()' type="submit" class="btn btn-default">Empty Board</button>
        <button v-on:click='starting()' type="submit" class="btn btn-default">Starting Board</button>
        <button v-on:click='ground.toggleOrientation()' type="submit" class="btn btn-default">Flip</button>
      </div>
    </div>
    </br>
    <div class='col-lg-6'>
      <div>
        <input v-model='fen' type='text' class='form-control' placeholder=''>
        </br>
        <button v-on:click='updateBoard' type="submit" class="btn btn-default">Update</button>
        <button v-on:click='searchOpenings' type="submit" class="btn btn-default">Search Openings</button>
        <button v-on:click='searchGames' type="submit" class="btn btn-default">Search Games</button>
      </div>
      <!--TODO-->
      <div v-if='gamedata' class='row'>
        <table class='table'>
          <thead>
            <tr>
              <th v-on:click='sort("white_player_name")'>White Player</th>
              <th v-on:click='sort("black_player_name")'>Black Player</th>
              <th v-on:click='sort("result")'>Result</th>
              <th v-on:click='sort("event")'>Event</th>
              <th v-on:click='sort("date")'>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in gamedata">
              <td><a v-bind:href='"#/player/"+row.white_player_id'>{{row.white_player_name}}</a></td>
              <td><a v-bind:href='"#/player/"+row.black_player_id'>{{row.black_player_name}}</a></td>
              <td style='cursor: pointer' v-on:click='loadGame(row.game_id)'>{{row.result}}</td>
              <td style='cursor: pointer' v-on:click='loadGame(row.game_id)'>{{row.event}}</td>
              <td style='cursor: pointer' v-on:click='locaGame(row.game_id)'>{{row.date}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if='openingdata' class='row'>
        <table class='table'>
          <thead>
            <tr>
              <th v-on:click='sort(openingdata, "name")'>Name</th>
              <th v-on:click='sort(openingdata, "elo")'>Games</th>
              <th v-on:click='sort(openingdata, "nationality")'>Nationality</th>
              <th v-on:click='sort(openingdata, "sex")'>Sex</th>
              <th v-on:click='sort(openingdata, "elo")'>ELO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in openingdata">
              <td><a v-bind:href='"#/player/"+row.pid'>{{row.name}}</a></td>
              <td>0</td>
              <td>{{row.nationality}}</td>
              <td>{{row.sex}}</td>
              <td>{{row.elo}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Chessground from 'chessground'
export default {
  name: 'app',
  data () {
    return {
      gamedata: false,
      openingdata: false,
      ground: 0,
      piece: '',
      fen: this.$route.params.fen !== '0' ? this.$route.params.fen : '8/8/8/8/8/8/8/8',
      options: {
        fen: this.$route.params.fen !== '0' ? this.$route.params.fen : '8/8/8/8/8/8/8/8',
        orientation: 'white',
        highlight: {
          lastMove: false,       // add last-move class to squares
          check: false,          // add check class to squares
          dragOver: true        // add drag-over class to square when dragging over it
        },
        events: {
          select: this.drop,
          change: this.change
        }
      }
    }
  },
  mounted () {
    var element = document.getElementById('main-board');
    this.ground = Chessground(element, this.options);
    var Width = element.clientWidth;
    element.style.height = Width + 'px';
    element.style.width = Width + 'px';
  },
  methods: {
    pickup(piece) {
      if (this.piece !== '') {
        this.piece = '';
        return;
      }
      this.piece = piece;
      console.log(this.piece);
    },
    loadGame(id) {
      window.location = '#/pgn/' + id;
    },
    sort(data, type) {
      if (this.sorted === type) {
        this.reversed*=-1;
      } else {
        this.sorted = type;
        this.reversed = 1;
      }
      if (this.reversed === 1) {
        data.sort(function(a, b) {
          if (a[type] > b[type]) {
            return 1;
          } else if (a[type] < b[type]){
            return -1;
          } else {
            return 0;
          }
        });
      } else {
        data.sort(function(a, b) {
          if (a[type] > b[type]) {
            return -1;
          } else if (a[type] < b[type]){
            return 1;
          } else {
            return 0;
          }
        });
      }
    },
    empty() {
      this.fen = '8/8/8/8/8/8/8/8';
      this.updateBoard();
    },
    starting() {
      this.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
      this.updateBoard();
    },
    updateBoard() {
      this.options.fen = this.fen;
      this.ground.set(this.options);
    },
    change() {
      this.fen = this.ground.getFen();
    },
    searchOpenings() {
      this.$http.get('/api/playersearch/', {
        params: {
          "type" : "3",
          "eco" : "",
          "name_white" : "",
          "name_black" : "",
          "position" : this.fen,
        }
      }).then(function(res) {
        this.openingdata = res.body.data;
        console.log(this.openingdata);
      });
    },
    searchGames() {
      this.$http.get('/api/playersearch/', {
        params: {
          "type" : "2",
          "event" : "",
          "player1" : "",
          "player2" : "",
          "date_lower" : "",
          "date_upper" : "",
          "eco" : "",
          "position" : this.fen,
        }
      }).then(function(res) {
        this.gamedata = res.body.data;
        console.log(this.gamedata);
      });
    },
    drop(position) {
      if (_.isEmpty(this.piece)) {
        console.log("No Piece");
        return;
      }
      var r = null;
      switch(this.piece[1]) {
        case 'K':
          r = 'king';
          break;
        case 'Q':
          r = 'queen';
          break;
        case 'R':
          r = 'rook';
          break;
        case 'B':
          r = 'bishop';
          break;
        case 'N':
          r = 'knight';
          break;
        case 'P':
          r = 'pawn';
          break;
        default:
      }
      var put = {};
      put[position] = {
        color: this.piece[0] === 'w' ? 'white' : 'black',
        role: r
      };
      this.ground.setPieces(put);
      this.piece = '';
      this.change();
    }
  }
}
</script>

<style>
#main-board {
  width: 50%;
  margin: auto auto;
}
.spare-pieces img {
  width: 35px;
  cursor: pointer
}
i {
  cursor: pointer
}
.spare-pieces .selected {
  background-color: #A9A9A9;
}
</style>
