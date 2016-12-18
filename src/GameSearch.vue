<template>
<div class='container'>
    <div class='jumbotron'>
      <h1>Games Search</h1>
        <input v-on:keyup.enter='search' v-model='player1' type='text' class='form-control' placeholder='Player1'>
        <input v-on:keyup.enter='search' v-model='player2' type='text' class='form-control' placeholder='Player2'>
        <input v-on:keyup.enter='search' v-model='event' type='text' class='form-control' placeholder='Event'>
        <input v-on:keyup.enter='search' v-model='eco' type='text' class='form-control' placeholder='ECO'>
    </div>
    <div v-if='data' class='row'>
      <div class='col-lg-12'>
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
            <tr v-for="row in data">
              <td><a v-bind:href='"#/player/"+row.white_player_id'>{{row.white_player_name}}</a></td>
              <td><a v-bind:href='"#/player/"+row.black_player_id'>{{row.black_player_name}}</a></td>
              <td style='cursor: pointer' v-on:click='loadGame(row.game_id)'>{{row.result}}</td>
              <td style='cursor: pointer' v-on:click='loadGame(row.game_id)'>{{row.event}}</td>
              <td style='cursor: pointer' v-on:click='locaGame(row.game_id)'>{{row.date}}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</div>
</template>

<script>
export default { name: 'app',
  data () {
    return {
      player1: '',
      player2: '',
      event: '',
      eco: '',
      data: false,
      sorted: '',
      reversed: 1
    }
  },
  methods: {
    search() {
      this.$http.get('/api/playersearch/', {
        params: {
          "type" : "2",
          "event" : this.event,
          "player1" : this.player1,
          "player2" : this.player2,
          "date_lower" : "",
          "date_upper" : "",
          "eco" : this.eco,
          "position" : "",
        }
      }).then(function(res) {
        this.data = res.body.data;
        console.log(this.data[0]);
      });
    },
    loadGame(id) {
      window.location = '#/pgn/' + id;
    },
    sort(type) {
      if (this.sorted === type) {
        this.reversed*=-1;
      } else {
        this.sorted = type;
        this.reversed = 1;
      }
      if (this.reversed === 1) {
        this.data.sort(function(a, b) {
          if (a[type] > b[type]) {
            return 1;
          } else if (a[type] < b[type]){
            return -1;
          } else {
            return 0;
          }
        });
      } else {
        this.data.sort(function(a, b) {
          if (a[type] > b[type]) {
            return -1;
          } else if (a[type] < b[type]){
            return 1;
          } else {
            return 0;
          }
        });
      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
td {
  text-align: left;
}
</style>
