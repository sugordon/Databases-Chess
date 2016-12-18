<template>
<div class='container'>
    <div class='jumbotron'>
      <h1>Player Search</h1>
        <div class="input-group">
          <input v-on:keyup.enter='search' v-model='input' type='text' class='form-control' placeholder=''>
          <span class="input-group-btn">
          <button v-on:click='search' class="btn btn-default" type="button">Search</button>
          </span>
        </div><!-- /input-group -->
        <h3>ELO Range: {{ eloSlider }}</h3>
        <div id='elo-slider'></div>
    </div>
    <div v-if='data' class='row'>
      <div class='col-lg-12'>
        <table class='table'>
          <thead>
            <tr>
              <th v-on:click='sort("name")'>Name</th>
              <th v-on:click='sort("games")'>Games</th>
              <th v-on:click='sort("nationality")'>Nationality</th>
              <th v-on:click='sort("sex")'>Sex</th>
              <th v-on:click='sort("elo")'>ELO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data">
              <td><a v-bind:href='"#/player/"+row.pid'>{{row.name}}</a></td>
              <td>{{row.games}}</td>
              <td>{{row.nationality}}</td>
              <td>{{row.sex}}</td>
              <td>{{row.elo}}</td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</div>
</template>

<script>
var noUiSlider = require('nouislider');

export default { name: 'app',
  data () {
    return {
      input: '',
      data: false,
      sorted: '',
      reversed: 1,
      eloSlider: null,
      hasGames: [],
      eloEle: null
    }
  },
  mounted() {
    var noUiSlider = require('nouislider');

    this.eloEle = document.getElementById('elo-slider');

    noUiSlider.create(this.eloEle, {
      start: [2000, 3000],
      connect: true,
      range: {
        'min': 0,
        'max': 3000
      },
      step: 100
    });
    this.eloEle.noUiSlider.on('update', this.updateSlider);
  },
  watch: {
    hasGames: function () {
      _.each(this.hasGames, function(val) {
        val[1].then(function(res) {
          val[0].games = res.body.data.length;
        });
      });
    }
  },
  methods: {
    updateSlider() {
      var vals = this.eloEle.noUiSlider.get();
      this.eloSlider = parseInt(vals[0]) + '-' + parseInt(vals[1]);
    },
    search() {
      var vals = this.eloEle.noUiSlider.get();
      this.$http.get('/api/playersearch/', {
        params: {
          "type"    :   "1",
          "name"	:   this.input,
          "birth_year_lower" : "",
          "birth_year_upper" : "",
          "elo_lower" : "" + vals[0] + "",
          "elo_upper" : "" + vals[1] + "",
          "nationality" : "",
          "sex" : ""
        }
      }).then(function(res) {
        var data = res.body.data;
        this.data = data;
        this.hasGames = _.map(data, this.insertGames);
      });
    },
    insertGames(val) {
      val.games = 0;
      return [val, this.$http.get('/api/playersearch/', {
        params: {
          "type" : "2",
          "game_id" : "",
          "event" : "",
          "player1" : "",
          "player2" : "",
          "pid1" : val.pid,
          "pid2" : "",
          "date_lower" : "",
          "date_upper" : "",
          "eco" : "",
          "position" : ""
        }
      })];
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
