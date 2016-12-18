<template>
<div class='container'>
  <div class='row'>
    <div class='col-lg-6'>
      <div id='viewer-board' class="wood chessground vuejs cburnett"></div>
    </div>
    <div class='col-lg-6'>
      <h4 v-if='moveArray.length===0'>No game loaded: enter ECO code or Game Id</h4>
      <div v-if='moveArray.length===0' class="input-group">
        <input v-on:keyup.enter='getById' v-model='pgn_id' type='text' class='form-control' placeholder=''>
        <span class="input-group-btn">
          <button v-on:click='getById' class="btn btn-default" type="button">Load</button>
        </span>
      </div><!-- /input-group -->
      <div id='pgn-box' class='pgn-scrolling'>
        <div v-for='(move, index) in moveArray'>
          <div class="btn-group">
            <button v-bind:id='"move-" + (2*index)' type='button' v-on:click='jump(2*index)' v-bind:class="{ 'selected' : move_number === 2*index+1 }" class='btn btn-default'>{{index+1}}. {{move[0]}}</button>
            <button v-bind:id='"move-" + (2*index+1)' type='button' v-on:click='jump(2*index+1)' v-bind:class="{ 'selected' : move_number === 2*index+2 }" class='btn btn-default'>{{move[1]}}</button>
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
      <i v-on:click='ground.toggleOrientation()' class="control-icon fa-2x fa fa-repeat"></i>
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
    this.getById();
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
    getById() {
      this.chess = new Chess();
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
    loadResult (res) {
      var data = res.body.data;
      console.log(data.length);
      var chess = this.chess;
      _.each(_.pluck(data.sort(function(a, b) {
        if (a.move_number === b.move_number) {
          return a.position.split(' ')[1] === 'w' ? -1 : 1
        }
        return a.move_number - b.move_number;
      }), 'move'), function(val) {
        if (chess.move(val) == null) {
          alert('fatal error');
        }
      });

      var history = this.chess.history();
      for (var i = 0; i < history.length; i += 2) {
        this.moveArray.push([history[i], history[i+1]]);
      }
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
