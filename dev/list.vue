<template>
  <div>
		<h2>List</h2>
		<input @keyup.enter="add($event.target.value); $event.target.value = '';" placeholder="Write and press enter">
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
					<select @change="testsSetSort($event.target.value)" ref="sort">
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
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import { uuid } from '../src'

export default {
  name: 'app',
	computed: {
		...mapGetters({ testsStore: 'getTests', selection: 'getTestsSelectable', bigs: 'getBigs' }),
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
    testsSetSort(type){
      switch(type){
        case 'ta': this.$store.dispatch('testsSetSort', { sort: 'title', reverse: false }); break;
        case 'td': this.$store.dispatch('testsSetSort', { sort: 'title', reverse: true }); break;
        case 'ca': this.$store.dispatch('testsSetSort', { sort: 'created_at', reverse: false }); break;
        case 'cd': this.$store.dispatch('testsSetSort', { sort: 'created_at', reverse: true }); break;
        default: this.$store.dispatch('testsSetSort', null); break;
      }
    }
	}
}
</script>
