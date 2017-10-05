

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
		<button type="button" :disabled="thinking" @click="loadData('tinydata.json')">LOAD TINY DATA</button>
		<button type="button" :disabled="thinking" @click="loadData('data.json')">LOAD DATA</button>
		<button type="button" :disabled="thinking" @click="loadData('bigdata.json')">LOAD BIG DATA</button>
		<button type="button" :disabled="thinking" @click="loadData('hugedata.json')">LOAD HUGE DATA</button><br>
		<br>
		<hr>
		<div style="width: calc(50% - 16px); float: left; padding: 8px;">
			<ul>
				<li class="title">LOADED FROM Store from {{ (page-1)*limit }} to {{ page*limit }} of {{ count }} elements </li>
				<li class="search">
					<input @keyup="$store.dispatch('bigsSetFilter', { caption: $event.target.value });" :disabled="thinking" placeholder="Write name and wait">
					<input @keyup="$store.dispatch('bigsSetFilter', { uuid: $event.target.value });" :disabled="thinking" placeholder="Write uuid and wait">
				</li>
				<li class="search">
					<select @change="bigsSetSort($event.target.value)" :disabled="thinking">
						<option value="">- Sort -</option>
						<option value="ta">Title ASC</option>
						<option value="td">Title DESC</option>
						<option value="ca">Création ASC</option>
						<option value="cd">Création DESC</option>
					</select>
					<select @change="bigsSetLimit($event.target.value)" :disabled="thinking">
						<option value="20">- Page size -</option>
						<option value="10">10</option>
						<option value="50">50</option>
						<option value="100">100</option>
						<option value="1000">1000</option>
					</select>
					<button type="button" @click="prev()" :disabled="page <= 1 || thinking">PREV</button> Page {{ page }} of {{ nbPages }} <button type="button" @click="next()" :disabled="page >= nbPages || thinking">NEXT</button>
				</li>
				<li v-for="test in bigs" :key="test.id" @click="bigsSelect(test)">
					{{ test.caption }} <button type="button" @click.stop.prevent="remove(test)" class="remove" :disabled="thinking">&times;</button>
				</li>
			</ul>
		</div>
		<div style="width: calc(50% - 16px); padding: 8px; float: left;">
			<button type="button" @click="handleScroll._reset()">RESET</button>
			<div class="infinite" @scroll="handleScroll.scroll($event)" ref="infinite">
				<div v-for="(test, index) in infinite"> {{ test.caption }} {{ index }} </div>
			</div>
			<button type="button" @click="bigsSelect(null)">CLEAR SELECTION</button>
			<pre>{{ selected }}</pre>
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
		...mapGetters({ bigs: 'getBigs', selected: 'getBigsSelected', infinite: 'getBigsInfinite', thinking: 'getBigsThinking', count: 'getBigsCount', page: 'getBigsPage', nbPages: 'getBigsNbPages', limit: 'getBigsLimit' }),
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
		...mapActions({ bigsSetLimit: 'bigsSetLimit', bigsSelect: 'bigsSelect' }),
		loadData (file){
      console.log('DELETE DB')
			this.$store.commit('DELETE_INDEXED_DB', () => {
				console.log('LOAD', file)
				this.$store.dispatch('bigsLoad', file).then(() => {
					console.log('LOADED !')
					this.$store.dispatch('bigsSetPage', 1)
					console.log('infinite 1')
					this.$store.dispatch('bigsSetInfinite')
				})
			})
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

