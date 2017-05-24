<template>
  <div id="app">
    <h1>vue-idb</h1>
		<input @keyup.enter="add($event.target.value); $event.target.value = '';" ref="input"><button type="button">ADD</button>
		<ul>
			<li v-for="test in tests">
				{{ test.title }}
			</li>
		</ul>
    <ul>
			<li v-for="test in testsStore">
				{{ test.title }}
			</li>
		</ul>
  </div>
</template>

<script>
export default {
  name: 'app',
	computed: {
		...mapGetters({ testsStore: 'tests' }),
	},
  data () {
    return {
			tests: []
    }
  },
	mounted () {
		this.$db.tests.toArray().then( tests => this.tests = tests )
	},
	methods: {
		add (value){
			console.log('ADD', value)
			this.$db.tests.put( { id: this.tests.length+1, title: value, created_at: new Date(), updated_at: new Date() } )
      this.$db.tests.toArray().then( tests => this.tests = tests )
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
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.t-center{
  text-align: center;
  margin: 20px;
}
</style>
