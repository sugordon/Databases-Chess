<template>
<div class='container'>
  <div class='row'>
    <div class='col-lg-6'>
      <div id='viewer-board' class="wood chessground vuejs cburnett"></div>
    </div>
    <div class='col-lg-6'>
      <!--<textarea v-model='pgn' rows="15" cols="50" placeholder='Paste PGN'></textarea>-->
      <div id='pgn-box' class='pgn-scrolling'>
        <div v-for='(move, index) in moveArray'>
          <div class="btn-group">
            <button v-bind:id='"move-" + (2*index)' type='button' v-on:click='jump(2*index)' v-bind:class="{ 'selected' : move_number === 2*index+1 }" class='btn btn-default'>{{index+1}}. {{move}}</button>
            <button v-bind:id='"move-" + (2*index+1)' type='button' v-on:click='jump(2*index+1)' v-bind:class="{ 'selected' : move_number === 2*index+2 }" class='btn btn-default'>{{move}}</button>
          </div>
        </div>
      </div>
      <div>
        <input v-model='fen' type='text' class='form-control' placeholder=''>
        <a v-bind:href='"#/board/" + encodedFen' class="btn btn-default">Search this Position</a>
      </div>
      <i v-on:click='beg' class="control-icon fa-2x fa fa-fast-backward"></i>
      <i v-on:click='back' class="control-icon fa-2x fa fa-step-backward"></i>
      <i v-on:click='play' v-bind:class="{ 'control-icon fa-2x fa fa-play' : !isPlaying, 'control-icon fa-2x fa fa-pause' : isPlaying }"></i>
      <i v-on:click='next' class="control-icon fa-2x fa fa-step-forward"></i>
      <i v-on:click='end' class="control-icon fa-2x fa fa-fast-forward"></i>
    </div>
  </div>
</div>
</template>

<script>
import Chessground from 'chessground'
import Chess from '../node_modules/chess.js/chess.min.js';

function letterToPiece(letter) {
  switch (letter) {
    case 'q':
      return 'queen'
      break;
    case 'r':
      return 'rook'
      break;
    case 'b':
      return 'bishop'
      break;
    case 'n':
      return 'knight'
      break;
    case 'p':
      return 'pawn'
      break;
    default:
      alert('fatal error');
  }
}

export default {
  name: 'app',
  data () {
    return {
      pgn_id: this.$route.params.id,
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR',
      isPlaying: false,
      intervalId: -1,
      move_number: 0,
      moveArray: [],
      chess: null,
      ground: 0,
      options: {
        events: {
          change: this.updateFen
        }
      }
    }
  },
  computed: {
    // a computed getter
    encodedFen: function () {
      return this.fen.replace(/\//g, '%2F');
    }
  },
  created() {
    this.chess = new Chess();
    //this.pgn = '1. e4 Nf6 2. e5 Ne4 3. d3 Nc5 4. d4 Ne4 5. Qd3 d5 6. exd6 Nxd6 7. Nf3 b5 8. Bf4 e5 9. Bxe5 Bf5 10. Qb3 Nc6 11. Bxb5 Qd7 12. O-O Ne4 13. Nc3 a6 14. Ba4 Be6 15. d5 Bf5 16. Bxc6 Qxc6 17. dxc6 Bc5 18. Bxg7 Rg8 19. Ne5 Rxg7 20. Nxe4 Bxe4 21. g3 f5 22. Rad1 Bf3 23. Rd7 Rd8 24. Rxg7 Rd4 25. Qf7+ Kd8 26. Qg8+ Bf8 27. Qxf8#'
    var params = {};
    if (this.pgn_id.match(/[A-Z]/)) {
      params = {
        params: {
          "type" : "5",
          "eco" : this.pgn_id
        }
      }
    } else {
      params = {
        params: {
          "type" : "4",
          "game_id" : this.pgn_id
        }
      }
    }
    this.$http.get('/api/playersearch/', params).then(this.loadResult);
  },
  mounted () {
    var element = document.getElementById('viewer-board');
    this.ground = Chessground(element, this.options);
    var Width = element.clientWidth;
    element.style.height = Width + 'px';
    element.style.width = Width + 'px';
  },
  methods: {
    updateFen() {
      this.fen = this.ground.getFen();
    },
    loadResult (res) {
      var data = res.body.data;
      var chess = this.chess;
      _.each(data, function(val) {
        chess.move(val.move);
      });
      this.moveArray = this.chess.history();
      console.log(this.chess.history());
    },
    jump(index) {
      this.isPlaying = false;
      clearInterval(this.intervalId);
      while (this.move_number < index) {
        this.next();
      }
      while (this.move_number > index) {
        this.back();
      }
      this.next();
    },
    beg() {
      this.isPlaying = false;
      clearInterval(this.intervalId);
      this.move_number = 0;
      this.options.fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
      this.options.lastMove = null;
      this.ground.set(this.options);
    },
    back() {
      this.isPlaying = false;
      clearInterval(this.intervalId);
      console.log(this.move_number);
      if (this.move_number === 0) {
        this.beg();
        return;
      }
      var move = this.chess.history({verbose: true})[--this.move_number];
      if (move === null) {
        console.log('Invalid move');
      }

      var locto = move.to;
      //Handles en passant
      if (move.flags === 'e') {
        var ep = {};
        ep[locto.replace('6', '5').replace('3', '4')] = {
          color: move.color === 'b' ? 'white' : 'black',
          role: 'pawn'
        };
        this.ground.setPieces(ep);
      }
      //Handles Castling
      if (move.flags === 'k') {
        this.ground.move(locto.replace('g', 'f'), locto.replace('g', 'h'));
      }
      if (move.flags === 'q') {
        this.ground.move(locto.replace('c', 'd'), locto.replace('c', 'a'));
      }
      //Handles Promotions
      if (move.flags.includes('p')) {
        var promote = {};
        var promotedPiece = letterToPiece(move.piece);
        promote[move.to] = {
          color: move.color === 'w' ? 'white' : 'black',
          role: promotedPiece
        }
        this.ground.setPieces(promote);
      }

      this.ground.move(move.to, move.from);
      //Revert captured pieces if moved
      if (move.flags.includes('c')) {
        console.log(move.flags);
        var captured = {};
        var capturedPiece = null;
        capturedPiece = letterToPiece(move.captured);
        captured[locto] = {
          color: move.color === 'b' ? 'white' : 'black',
          role: capturedPiece
        };
        this.ground.setPieces(captured);
      }

      var currentMove = document.getElementById('move-' + this.move_number).parentElement;
      var topPos = currentMove.offsetTop;
      var element = document.getElementById('pgn-box');
      element.scrollTop = topPos - 153;
    },
    play() {
      if (!this.isPlaying) {
        this.isPlaying = true;
        this.intervalId = window.setInterval(this.next,750);
        this.next();
      } else {
        this.isPlaying = false;
        clearInterval(this.intervalId);
        this.intervalId = -1;
      }
    },
    next() {
      if (this.move_number === this.chess.history().length) {
        console.log('no more moves');
        return;
      }
      var move = this.chess.history({verbose: true})[this.move_number++];
      console.log(move);
      if (move === null) {
        console.log('Invalid move');
      }
      var locto = move.to;
      //Handles en passant
      if (move.flags === 'e') {
        var ep = {};
        ep[locto.replace('6', '5').replace('3', '4')] = null;
        this.ground.setPieces(ep);
      }
      //Handles Castling
      if (move.flags === 'k') {
        this.ground.move(locto.replace('g', 'h'), locto.replace('g', 'f'));
      }
      if (move.flags === 'q') {
        this.ground.move(locto.replace('c', 'a'), locto.replace('c', 'd'));
      }
      //Handles Promotions
      if (move.flags.includes('p')) {
        var promote = {};
        var promotedPiece = letterToPiece(move.promotion);
        promote[move.from] = {
          color: move.color === 'w' ? 'white' : 'black',
          role: promotedPiece
        }
        this.ground.setPieces(promote);
      }
      this.ground.move(move.from, move.to);


      var currentMove = document.getElementById('move-' + this.move_number).parentElement;
      var topPos = currentMove.offsetTop;
      var element = document.getElementById('pgn-box');
      element.scrollTop = topPos - 153;
    },
    end() {
      this.isPlaying = false;
      clearInterval(this.intervalId);
      this.options.fen = this.chess.fen();
      var history = this.chess.history({verbose: true});
      this.move_number = history.length;
      var lastMove = history[this.move_number-1];
      this.options.lastMove = [lastMove.from, lastMove.to];
      this.ground.set(this.options);
    }
  }
}
</script>
<style>
.control-icon {
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px
}
.pgn-scrolling {
  height:306px;
  width:auto;
  overflow:auto;
}
a {
  cursor: pointer
}
.pgn-scrolling {
  margin-top: 15px;
}
.pgn-scrolling .selected {
  background-color: #A9A9A9;
}
.pgn-scrolling .btn-group {
  width: 100%
}
.pgn-scrolling button {
  width: 50%
}
</style>
