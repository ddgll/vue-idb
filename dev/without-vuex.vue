<template>
  <div>
		<h2>List without vuex</h2>
		<input @keyup.enter="add($event.target.value); $event.target.value = '';" placeholder="Write and press enter">
		<hr>
		<div style="float: right">
			<ul>
				<li class="title">LOADED FROM iDB</li>
				<li class="search">
					<input v-model="filter" @keyup="update()" ref="search">
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
				<li>
					<select v-model="selected">
						<option>-Select-</option>
						<option v-for="item in ordered()" :value="item.id">{{ item.title }}</option>
					</select>
				</li>
				<li v-for="test in tests" :class="{'selected': selected === test.id}">
					{{ test.title }} <button type="button" @click="remove(test)" class="remove">&times;</button>
				</li>
			</ul>
		</div>
  </div>
</template>

<script>
import { uuid, orderBy } from '../src'

export default {
  name: 'app',
  data () {
    return {
			tests: [],
      selected: null,
			filter: '',
			sort: null,
			reverse: false
    }
  },
	mounted () {
		this.update()
	},
	methods: {
		update(){
			let query = this.$db.tests
			if(this.sort){
				query.orderBy(this.sort)
				if(this.reverse){
					query.reverse()
				}
			}
			if(this.filter){
				query.where('label').startsWithIgnoreCase(this.filter)
			}
			console.log('UPDATE', query)
			query.toArray().then(tests => this.tests = tests, err => console.error(err))
		},
		ordered(){
			return orderBy(this.tests, 'title')
		},
		add (value){
			console.log('ADD', value)
			this.$db.tests.add({ 
				id: uuid(), 
				title: value, 
				created_at: new Date(), 
				updated_at: new Date() 
			}).then(this.update)
		},
		remove (test){
			this.$db.tests.where('id').equals(test.id).delete().then(this.update)
		},
    testsSetSort(type){
      switch(type){
        case 'ta': this.sort = 'title'; this.reverse = false; this.update(); break;
        case 'td': this.sort = 'title'; this.reverse = true; this.update(); break;
        case 'ca': this.sort = 'created_at'; this.reverse = false; this.update(); break;
        case 'cd': this.sort = 'created_at'; this.reverse = true; this.update(); break;
        default: this.sort = null; this.update(); break;
      }
    }
	}
}
</script>
