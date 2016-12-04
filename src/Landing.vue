<template>
<div class='container'>
    <div class='jumbotron'>
      <h1>Search</h1>
        <input v-on:keyup.enter='search' v-model='input' type='text' class='form-control' placeholder=''>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      input: ''
    }
  },
  methods: {
    search() {
      console.log(this.input);
      this.$http.get('/api/search/', { params: {value:this.input}}).then(function(res) {
        console.log(res.body);
      });
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
</style>
