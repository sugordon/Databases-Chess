<template>
<div class='container'>
  <div class='row'>
    <div class='col-lg-6'>
      <div id='viewer-board' class="wood chessground vuejs cburnett"></div>
    </div>
    <div class='col-lg-6'>
      <!--<textarea v-model='pgn' rows="15" cols="50" placeholder='Paste PGN'></textarea>-->
      <div id='pgn-box' class='pgn-scrolling'>
        <div v-for='(move, index) in pgn.split(/[0-9]+\./).slice(1)'>
          <div class="btn-group">
            <button v-bind:id='"move-" + (2*index)' type='button' v-on:click='jump(2*index)' v-bind:class="{ 'selected' : move_number === 2*index+1 }" class='btn btn-default'>{{index+1}}. {{move.split(' ')[1]}}</button>
            <button v-bind:id='"move-" + (2*index+1)' type='button' v-on:click='jump(2*index+1)' v-bind:class="{ 'selected' : move_number === 2*index+2 }" class='btn btn-default'>{{move.split(' ')[2]}}</button>
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
      pgn: '',
      intervalId: -1,
      move_number: 0,
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
    //this.pgn = '1. d4 e6 2. c4 d5 3. Nf3 Nf6 4. Nc3 Bb4 5. Bg5 h6 6. Bxf6 Qxf6 7. e3 O-O 8. Rc1 dxc4 9. Bxc4 c5 10. O-O cxd4 11. Ne4 Qe7 12. exd4 Nc6 13. Qe2 Bd7 14. a3 Bd6 15. Rfd1 Rad8 16. Qe3 Rfe8 17. b4 a6 18. Be2 Nb8 19. Ne5 Ba4 20. Rd2 Bxe5 21. dxe5 Rxd2 22. Qxd2 Rd8 23. Qb2 Bc6 24. Nd6 Bd5 25. f4 Nc6 26. a4 Qc7 27. b5 Qb6+ 28. Kf1 axb5 29. axb5 Ne7 30. Qc3 Rf8 31. Qc5 Qa5 32. Rd1 Qa2 33. g3 f6 34. exf6 Rxf6 35. Qc3 Qa7 36. Ne8 Rf7 37. Bh5 g6 38. Nf6+ Rxf6 39. Qxf6 gxh5 40. Qxe7 Bc4+ 41. Kg2 Bd5+ 42. Kh3 Qa2 43. Rxd5 Qxd5 44. Kh4 Qxb5 45. Qxe6+ Kg7 46. f5 Qc6 47. Qe7+ Kg8 48. Kxh5 b5 49. g4 b4 50. Qxb4 Qc7 51. Qb3+ Kh8 52. Qe6 Qf7+ 53. Qg6 Qc7 54. Qxh6+ Kg8 55. Qe6+ Kh8 56. Qe8+ Kh7 57. h4 Qb7 58. Qg6+ Kh8 59. Qh6+ Kg8 60. Qe6+ Kh8 61. g5 Qf7+ 62. g6 Qf8 63. g7+';
    //this.pgn = '1. e4 Nf6 2. e5 Ne4 3. d3 Nc5 4. d4 Ne4 5. Qd3 d5 6. exd6 Nxd6 7. Nf3 b5 8. Bf4 e5 9. Bxe5 Bf5 10. Qb3 Nc6 11. Bxb5 Qd7 12. O-O Ne4 13. Nc3 a6 14. Ba4 Be6 15. d5 Bf5 16. Bxc6 Qxc6 17. dxc6 Bc5 18. Bxg7 Rg8 19. Ne5 Rxg7 20. Nxe4 Bxe4 21. g3 f5 22. Rad1 Bf3 23. Rd7 Rd8 24. Rxg7 Rd4 25. Qf7+ Kd8 26. Qg8+ Bf8 27. Qxf8#'
    this.pgn = '1. e4 c5 2. Nf3 e6 3. d4 cxd4 4. Nxd4 Nc6 5. Nc3 Qc7 6. Be2 a6 7. O-O Nf6 8. Be3 Be7 9. f4 d6 10. Kh1 O-O 11. Qe1 Nxd4 12. Bxd4 b5 13. a3 Bb7 14. Qg3 Rad8 15. Bd3 Rd7 16. Rae1 Re8 17. Qh3 e5 18. fxe5 dxe5 19. Nd5 Bxd5 20. exd5 Rxd5 21. Bc3 Bd8 22. Rf5 g6 23. Qg3 Re6 24. Bxe5 Qe7 25. Rxf6 Rexe5 26. Rxe5 Rxe5 27. Rf1 Bc7 28. Qf2 Kg7 29. Qd4 f6 30. g3 Qe6 31. Qf2 h5 32. Qf3 Qd6 33. Rd1 Qe7 34. Qc6 Re6 35. Qd5 h4 36. gxh4 Re1+ 37. Rxe1 Qxe1+ 38. Kg2 Qd2+ 39. Kf1 Qf4+ 40. Ke2 Qxh2+ 41. Kf1 Bg3 42. Qd7+ Kh6 43. Qd4 Qh1+ 44. Ke2 Qg2+ 45. Kd1 Qf3+ 46. Kd2 Bf4+ 47. Ke1 Qh1+ 48. Ke2 Qxh4 49. Qf2 Qxf2+ 50. Kxf2 Bc1 51. c4 Bxb2 52. cxb5 a5 53. a4 Kg5 54. Ke3 f5 55. Be2 Be5 56. b6 Kh4 57. b7 g5 58. Bd3 f4+ 59. Ke4 Bb8 60. Be2 g4 61. Bb5 Kg3 62. Kf5 f3 63. Bc4 f2 64. Be2 Ba7 65. Kg5 Kg2 66. Kxg4 f1=Q 67. Bxf1+ Kxf1 ';
    //this.pgn = '1. Nf3 f5 2. d3 Nc6 3. d4 e6 4. g3 Nf6 5. Bg2 d5 6. O-O Rb8 7. Nbd2 b5 8. Ne5 Nxe5 9. dxe5 Nd7 10. Nf3 c5 11. b3 Be7 12. c4 bxc4 13. bxc4 dxc4 14. Qc2 O-O 15. Rd1 Qc7 16. Qxc4 Nb6 17. Qc2 Bb7 18. Ne1 Nd5 19. e4 fxe4 20. Bxe4 Qxe5 21. Bxh7+ Kh8 22. Bb2 Qh5 23. Bg6 Qh3 24. Qe2 Ba6 25. Nd3 c4 26. Ne5 c3 27. Qxa6 Rxf2 28. Kxf2 cxb2 29. Kg1 bxa1=Q 30. Rxa1 Bf6 31. Rb1 Rf8 32. Qa3 Be7 33. Qxa7 Kg8 34. Nd7 Nf4 35. gxf4 Qg4+ 36. Kh1 Qxg6 37. Rb8 Qe4+ 38. Kg1 Qe1+ 39. Kg2 Qd2+ 40. Kg1 Rxb8 41. Qxb8+ Kh7 42. Qb5 Kh6 43. Qc6 Qe2 44. Ne5 Qxa2 45. Qf3 Bc5+ '
    this.chess.load_pgn(this.pgn);
    //this.$http.get('/api/fen/', { params: {value:this.pgn_id}}).then(function(res) {
      //this.data = res.body.data;
      //console.log(this.data);
    //});
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
        console.log('asdfas');
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
