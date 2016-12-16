<template>
<div class='container'>
    <div class='jumbotron'>
      <h1>Games Search</h1>
        <input v-on:keyup.enter='search' v-model='input' type='text' class='form-control' placeholder='Player1'>
        <input v-on:keyup.enter='search' v-model='input' type='text' class='form-control' placeholder='Player2'>
        <input v-on:keyup.enter='search' v-model='input' type='text' class='form-control' placeholder='Event'>
    </div>
    <div v-if='data' class='row'>
      <div class='col-lg-12'>
        <table class='table'>
          <thead>
            <tr>
              <th v-on:click='sort("Name")'>Name</th>
              <th v-on:click='sort("ELO")'>Games</th>
              <th v-on:click='sort("Nationality")'>Nationality</th>
              <th v-on:click='sort("Sex")'>Sex</th>
              <th v-on:click='sort("ELO")'>ELO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in data">
              <td><a v-bind:href='"#/player/"+row.pid'>{{row.Name}}</a></td>
              <td>0</td>
              <td>{{row.Nationality}}</td>
              <td>{{row.Sex}}</td>
              <td>{{row.ELO}}</td>
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
      input: '',
      data: false,
      sorted: '',
      reversed: 1
    }
  },
  methods: {
    search() {
        console.log(this.input);
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
