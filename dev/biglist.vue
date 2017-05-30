

<style scoped>
.infinite{
	min-height: 600px;
	max-height: 600px;
	min-width: 600px;
	overflow-y: auto;
}
.container{
	overflow: visible;
}
</style>

<template>
  <div>
		<h2>BigList</h2>
		<input @keyup.enter="add($event.target.value); $event.target.value = '';">
		<button type="button" @click="loadData()">LOAD DATA</button><br>
		<button type="button" @click="prev()" :disabled="page <= 1">PREV</button> Page {{ page }} of {{ nbPages }} <button type="button" @click="next()" :disabled="page >= nbPages">NEXT</button>
		<hr>
		<div style="width: calc(50% - 16px); float: left; padding: 8px;">
			<ul>
				<li class="title">LOADED FROM Store from {{ (page-1)*limit }} to {{ page*limit }} of {{ count }} elements </li>
				<li class="search">
					<input @keyup="$store.dispatch('bigsSetFilter', { caption: $event.target.value });" :disabled="filtering" placeholder="Write name and wait">
					<input @keyup="$store.dispatch('bigsSetFilter', { uuid: $event.target.value });" :disabled="filtering" placeholder="Write uuid and wait">
				</li>
				<li class="search">
					<select @change="bigsSetSort($event.target.value)" ref="sort">
						<option value="">- Aucun tri -</option>
						<option value="ta">Title ASC</option>
						<option value="td">Title DESC</option>
						<option value="ca">Création ASC</option>
						<option value="cd">Création DESC</option>
					</select>
					<select @change="bigsSetLimit($event.target.value)" ref="limit">
						<option value="20">- Limite par défaut -</option>
						<option value="10">10</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="1000">1000</option>
					</select>
				</li>
				<li v-for="test in bigs">
					{{ test.caption }} <button type="button" @click="remove(test)" class="remove">&times;</button>
				</li>
			</ul>
		</div>
		<div style="width: calc(50% - 16px); padding: 8px; float: left;">
			<button type="button" @click="handleScroll._reset()">RESET</button>
			<div class="infinite" @scroll="handleScroll.scroll($event)" ref="infinite">
					<div v-for="(test, index) in infinite"> {{ test.caption }} {{ index }} </div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import { uuid, InfiniteList } from '../src'
import _ from 'lodash'

export default {
  name: 'app',
	computed: {
		...mapGetters({ bigs: 'getBigs', infinite: 'getBigsInfinite', filtering: 'getBigsFiltering', count: 'getBigsCount', page: 'getBigsPage', nbPages: 'getBigsNbPages', limit: 'getBigsLimit' }),
	},
  data () {
    return {
			sort: null,
			handleScroll: null
    }
  },
	mounted () {
    this.$store.dispatch('bigsSetPage', 1)
		this.handleScroll = new InfiniteList(this.$refs.infinite, 'bigs', this.$store)
	},
	destroyed () {
		this.handleScroll.unset()
	},
	methods: {
		scrollTo(ev){
			if(!this.handleScroll){
				this.handleScroll = new InfiniteList(ev.target);
			}
		},
		...mapActions({ bigsSetLimit: 'bigsSetLimit' }),
		loadData (){
      console.log('LOAD')
			this.$store.dispatch('bigsLoad')
		},
		add (value){
			console.log('ADD', value)
			this.$store.dispatch('bigsAdd', { uuid: uuid(), caption: value, creation: new Date(), update: new Date() } )
		},
		remove (test){
			console.log('BIGREMOVE', test)
			this.$store.dispatch('bigsRemove', test )
		},
		prev(){
			this.$store.dispatch('bigsSetPage', --this.page)
		},
		next(){
			this.$store.dispatch('bigsSetPage', ++this.page)
		},
    bigsSetSort(type){
			if(type === this.sort) return
			this.sort = type
      switch(type){
        case 'ta': this.$store.dispatch('bigsSetSort', { sort: 'caption', reverse: false }); break;
        case 'td': this.$store.dispatch('bigsSetSort', { sort: 'caption', reverse: true }); break;
        case 'ca': this.$store.dispatch('bigsSetSort', { sort: 'creation', reverse: false }); break;
        case 'cd': this.$store.dispatch('bigsSetSort', { sort: 'creation', reverse: true }); break;
        default: this.$store.dispatch('bigsSetSort', null); break;
      }
    }
	}
}
</script>

