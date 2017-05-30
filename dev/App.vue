<template>
  <div id="app">
    <h1>vue-idb</h1>
    <br>HYDRATED: {{ hydrated }}<br>
    <router-link to="/">List</router-link>
    <router-link to="/big">BigList</router-link>
    <router-link to="/without-vuex">Without Vuex</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
	computed: {
		...mapGetters({ hydrated: 'hydrated' }),
	}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
}

h1, h2, h3 {
  font-weight: normal;
  margin: 0;
  padding: 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: block;
  min-width: 10vw;
  margin: 0 10px;
  padding: 8px;
  clear: both;
}

li:hover {
  background-color: rgba(0, 0, 0, 0.2)
}

li.selected {
  background-color: rgba(0, 0, 0, 0.3)
}

li.title{
  background-color: rgba(0, 0, 0, 0.1);
  font-weight: bold;
}

.remove{
  float: right;
}

a {
  color: #42b983;
}
.t-center{
  text-align: center;
  margin: 20px;
}
</style>
