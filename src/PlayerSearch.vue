<template>
<div class='container'>
    <div class='jumbotron'>
      <h1>Player Search</h1>
        <input v-on:keyup.enter='search' v-model='input' type='text' class='form-control' placeholder=''>
        <!--<h3 v-if='eloSlider'>ELO Range: {{eloSlider.}}</h3>-->
        <div id='elo-slider'></div>
    </div>
    <div v-if='data' class='row'>
      <div class='col-lg-12'>
        <table class='table'>
          <thead>
            <tr>
              <th v-on:click='sort("name")'>Name</th>
              <th v-on:click='sort("elo")'>Games</th>
              <th v-on:click='sort("nationality")'>Nationality</th>
              <th v-on:click='sort("sex")'>Sex</th>
              <th v-on:click='sort("elo")'>ELO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data">
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
      eloSlider: null
    }
  },
  mounted() {
    var noUiSlider = require('nouislider');

    var slider = document.getElementById('elo-slider');

    noUiSlider.create(slider, {
      start: [0, 3000],
      connect: true,
      range: {
        'min': 0,
        'max': 3000
      },
      step: 100
    });
    function updateSlider(element, s) {
      s = element.noUiSlider.get();
    }
    slider.noUiSlider.on('update', updateSlider(slider, this.eloSlider));
  },
  methods: {
    search() {
      this.$http.get('/api/playersearch/', { params: {value:this.input}}).then(function(res) {
        this.data = res.body.data;
        console.log(this.data);
      });
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
