<template>
<div class='container'>
    <div class='jumbotron'>
      <h1>Opening Search</h1>
      <div class='row'>
          <input v-on:keyup.enter='search' v-model='eco' type='text' class='form-control' placeholder='ECO'>
          </br>
          <input v-on:keyup.enter='search' v-model='wName' type='text' class='form-control' placeholder='White Name'>
          </br>
          <input v-on:keyup.enter='search' v-model='bName' type='text' class='form-control' placeholder='Black Name'>
      </div>
      </br>
      <button v-on:click='search' class="btn btn-default" type="submit">Search</button>
    </div>
    <div v-if='data' class='row'>
      <div class='col-lg-12'>
        <table class='table'>
          <thead>
            <tr>
              <th v-on:click='sort("eco")'>ECO</th>
              <th v-on:click='sort("name_white")'>White Name</th>
              <th v-on:click='sort("name_black")'>Black Name</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data">
              <td><a v-bind:href='"#/pgn/"+row.eco'>{{row.eco}}</a></td>
              <td>{{row.name_white}}</td>
              <td>{{row.name_black}}</td>
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
      eco: '',
      wName: '',
      bName: '',
      data: false,
      sorted: '',
      reversed: 1
    }
  },
  methods: {
    search() {
      this.$http.get('/api/playersearch/', {
        params: {
          "type" : "3",
          "eco" : this.eco,
          "name_white" : this.wName,
          "name_black" : this.bName,
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
