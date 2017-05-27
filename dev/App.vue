<template>
  <div id="app">
    <h1>vue-idb</h1>
    <br>HYDRATED: {{ hydrated }}<br>
		<input @keyup.enter="add($event.target.value); $event.target.value = '';" ref="input"><button type="button">ADD</button>
    <hr>
    <div style="float: right">
      <ul>
        <li class="title">LOADED FROM iDB</li>
        <li>
          <select v-model="selected">
            <option>-Select-</option>
            <option v-for="item in selection" :value="item.value">{{ item.label }}</option>
          </select>
        </li>
        <li v-for="test in tests" :class="{'selected': selected === test.id}">
          {{ test.title }} <button type="button" @click="remove(test)" class="remove">&times;</button>
        </li>
      </ul>
    </div>
    <div style="float: left">
      <ul>
        <li class="title">LOADED FROM Store</li>
        <li class="search">
          <input @keyup="$store.dispatch('testsSetFilter', { title: $event.target.value });" ref="search">
        </li>
        <li class="search">
          <select @change="setSort($event.target.value)" ref="sort">
            <option value="">- Aucun tri -</option>
            <option value="ta">Title ASC</option>
            <option value="td">Title DESC</option>
            <option value="ca">Création ASC</option>
            <option value="cd">Création DESC</option>
          </select>
        </li>
        <li v-for="test in testsStore">
          {{ test.title }} <button type="button" @click="remove(test)" class="remove">&times;</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { uuid } from '../src'

export default {
  name: 'app',
	computed: {
		...mapGetters({ testsStore: 'getTests', hydrated: 'hydrated', selection: 'getTestsSelectable' }),
	},
  data () {
    return {
			tests: [],
      selected: null
    }
  },
	mounted () {
		this.$db.tests.toArray().then( tests => this.tests = tests )
	},
	methods: {
		add (value){
			console.log('ADD', value)
			this.$store.dispatch('testsAdd', { id: uuid(), title: value, created_at: new Date(), updated_at: new Date() } )
      this.$db.tests.toArray().then( tests => this.tests = tests )
		},
		remove (test){
			console.log('REMOVE', test)
			this.$store.dispatch('testsRemove', test )
      this.$db.tests.toArray().then( tests => this.tests = tests )
		},
    setSort(type){
      switch(type){
        case 'ta': this.$store.dispatch('testsSetSort', { sort: 'title', reverse: 'asc' }); break;
        case 'td': this.$store.dispatch('testsSetSort', { sort: 'title', reverse: 'desc' }); break;
        case 'ca': this.$store.dispatch('testsSetSort', { sort: 'created_at', reverse: 'asc' }); break;
        case 'cd': this.$store.dispatch('testsSetSort', { sort: 'created_at', reverse: 'desc' }); break;
        default: this.$store.dispatch('testsSetSort', null); break;
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
