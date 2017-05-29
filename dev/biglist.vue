

<style scoped>
.infinite{
	min-height: 200px;
	max-height: 200px;
	min-width: 200px;
	overflow-y: auto;
	background-color: green;
	position: relative;
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
			<div class="infinite" @scroll="handleScroll.scroll($event)" ref="infinite">
					<div v-for="(test, index) in infinite"> {{ test.caption }} {{ index }} </div>
			</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { mapGetters, mapActions } from 'vuex'
import { uuid } from '../src'
import _ from 'lodash'

class InfiniteList {
	_el
	_store
	_children
	_tops
	_limitTop
	_limitBottom
	_top
	_bottom
	_height
	_scrollHeight
	_scrollTop
	_loading
	_start
	_offset

	constructor(el, store) {
		this._el = el
		this._store = store
		this._scrollTop = 0
		this._start = 0
		this._offset = 60
		this._store.dispatch('bigsSetInfinite', this._start, this._offset)
		this._init()
	}

	_init (){
		const rect = this._el.getBoundingClientRect()
		this._height = rect.height
		this._top = rect.top
		this._bottom = this._top + this._el.scrollHeight
		this._limitTop = this._top * 1.1
		this._limitBottom = this._bottom * 0.8
		this._scrollHeight = this._el.scrollHeight
		this._children = [].map.call(this._el.childNodes, (element)  => element)
		this._tops = this._children.map(child => {
			const rect = child.getBoundingClientRect()
			return rect.top
		})
		console.log(this)
	}

	scroll (ev) {
		this._init(this._el)
		//console.log(this)
		if(this._loading) return
		const scrollTop = ev.target.scrollTop
		//console.log('scroll', this._scrollTop, scrollTop)
		if(this._scrollTop < scrollTop){
			this._loadNext(scrollTop)
		}else{
			this._loadPrevious(scrollTop)
		}
		this._scrollTop = scrollTop
		//console.log(ev)
	}

	_loadNext (scrollTop) {
		const index = this._getChildIndexToBottom(scrollTop)
		if(!index) return
		console.log('INDEX TO BOTTOM FOUND LOAD !!!', index, this._tops[index])
		this._loading = true
		this._children[index].style.backgroundColor = 'red'
		this._store.dispatch('bigsSetInfinite', { offset: this._start, limit: this._offset+30 })
	}

	_loadPrevious (scrollTop) {
		const index = this._getChildIndexToTop(scrollTop)
		if(!index) return
		console.log('INDEX TO TOP FOUND LOAD !!!', index, this._tops[index])
		this._loading = true
		this._children[index].style.backgroundColor = 'blue'
		this._store.dispatch('bigsSetInfinite', { offset: this._start-30, limit: this._offset+30 })
	}

	_getChildIndexToTop(scrollTop){
		let top
		const current = scrollTop
		for(let index in this._tops){
			top  = this._tops[index]
			//console.log('ON TOP ?', this._tops[index], this._limitTop)
			if(top < this._limitTop && top > this._top) return index
		}
		return null
	}

	_getChildIndexToBottom(scrollTop){
		let top
		const current = scrollTop
		for(let index in this._tops){
			top  = this._tops[index]
			//console.log('ON BOTTOM ?', this._limitBottom, top, this._bottom)
			if(top > this._limitBottom && top < this._bottom) return index
		}
		return null
	}
}

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
		this.handleScroll = new InfiniteList(this.$refs.infinite, this.$store)
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

