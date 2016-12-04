<template>
<div class='container'>
  <div class='row'>
    <div class='col-lg-12'>
      <div id='main-board' class="wood chessground vuejs cburnett"></div>
    </div>
  </div>
</div>
</template>

<script>
import Chessground from 'chessground'
console.log(Chessground);
export default {
  name: 'app',
  data () {
    return {
      data: '',
      ground: 0
    }
  },
  mounted () {
    var options = {
      orientation: 'white',
      movable: {
        free: false, // all moves are valid - board editor
        color: 'both', // color that can move. "white" | "black" | "both" | null
        dests: {}, // valid moves. {a2: ["a3", "a4"], b1: ["a3", "c3"]} | null
        dropOff: 'revert', // when a piece is dropped outside the board. "revert" | "trash"
        showDests: true // add the move-dest class to squares
      }
    }
    var element = document.getElementById('main-board');
    this.ground = Chessground(element, options);
    var Width = element.clientWidth;
    element.style.height = Width + 'px';
    element.style.width = Width + 'px';
  }
}
</script>

<style>
#main-board {
  width: 50%;
  margin: auto auto;
}
</style>
