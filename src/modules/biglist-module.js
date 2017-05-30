import getTypes from '../types/biglist-types'
import getListModule from './list-module'
import { arrayMax, jsUcfirst } from '../contants'
import filterBy from '../filter-by'
import filterByPromised from '../filter-by-promised'
import orderBy from '../order-by'
import _ from 'lodash'


const isEmpty = (value) => {
	if (_.isObject(value)) {
		return !_.some( value, function(value, key) {
			return value !== undefined && String(value).length;
		});
	} 
	return _.isEmpty(value);
}

export default (name, options, db, api) => {
	const listModule = getListModule(name, options, db, api)

	const types = getTypes(name)

	const Name = jsUcfirst(name)
	const NAME = name.toUpperCase()

	const _id = options.primary ? options.primary : 'id'
	const _label = options.label ? options.label : 'label'
	const _updated_at = options.updated_at ? options.updated_at : 'updated_at'
	const _deleted_at = options.deleted_at ? options.deleted_at : 'deleted_at'

	const state = {
		/*collection: [],
		loading: false,
		loaded: false,
		selected: null,
		filter: {},
		sort: null,
		reverse: false,
		last: null*/
		...listModule.state,
		mode: 'page',
		page: 1,		
		nbPages: 1,
		count: 0,	
		limit: 20,
		start: 0,
		offset: 3,
		filtered: [],
		infinite: [],
		iStart: 0,
		iLimit: 100,
		filtering: false
	}

	// getters
	const getters = {
		[`is${Name}Loading`]: state => state.loading,
		[`is${Name}Loaded`]: state => state.loaded,
		[`get${Name}Last`]: state => state.last,
		[`get${Name}Selected`]: state => state.selected !== null ? state.collection[state.selected] : null,
		[`get${Name}`]: state => state.collection,
		[`get${Name}Infinite`]: state => state.infinite,
		[`get${Name}Page`]: state => state.page,
		[`get${Name}Count`]: state => state.count,
		[`get${Name}NbPages`]: state => state.nbPages,
		[`get${Name}Limit`]: state => state.limit,
		[`get${Name}Filtering`]: state => state.filtering
	}

	let filterTimer = null

	const blActions = {
		[`${name}Load`]({ commit, dispatch, state }){
			commit(types[`${NAME}_LOAD`])
			if(api && api.all){
				api.all(state.last).then(
					res => {
						if(!res.data || !res.data.length) {
							return commit(types[`${NAME}_LOAD_SUCCESS`])
						}
						const toAdd = res.data.filter(entity => !entity[_deleted_at])
						const toDelete = res.data.filter(entity => entity[_deleted_at])
						const callback = () => {
							dispatch(`${name}SetCount`)
							db[name].orderBy(_updated_at).reverse().limit(1).toArray().then((last) => {
								if(last && last.length){
									commit(types[`${NAME}_SET_LAST`], last[0][_updated_at])	
								}
								commit(types[`${NAME}_LOAD_SUCCESS`])
								dispatch(`${name}SetPage`, state.page)
							})
						}
						db[name].bulkPut(toAdd).then(() => {
							if(toDelete.length){
								db[name].bulkDelete(toDelete.map(entity => entity[_id])).then(callback)
							}else{
								callback()
							}
						})
					},
					err => commit(types[`${NAME}_LOAD_FAIL`], err)
				)
			}
		},
		[`${name}SetInfinite`]({ commit, dispatch, state }, payload) {
			const iStart = payload && payload.offset >= 0 ? payload.offset : state.iStart
			const iLimit = payload && payload.limit >= 100 ? payload.limit : state.iLimit
			if(isEmpty(state.filter)){
				let query = db[name].orderBy(state.sort ? state.sort : _label)
				if(state.reverse){
					query.reverse()
				}
				query.offset(iStart).limit(iLimit).toArray().then((collection) => {
					commit(types[`${NAME}_SET_INFINITE`], { iStart, iLimit, collection })
				})
			}else{
				commit(types[`${NAME}_SET_INFINITE`], { iStart, iLimit, collection: _.slice(state.filtered, iStart, iStart + iLimit) })
			}
		},
		[`${name}SetPage`]({ commit, dispatch, state }, payload) {
			const page = payload > 0 ? payload : 1
			commit(types[`${NAME}_THINKING`], true)
			if(isEmpty(state.filter)){
				let query = db[name].orderBy(state.sort ? state.sort : _label)
				if(state.reverse){
					query.reverse()
				}
				query.offset((payload-1)*state.limit).limit(state.limit).toArray().then((collection) => {
					commit(types[`${NAME}_THINKING`], false)
					commit(types[`${NAME}_SET_PAGE`], { page: payload, collection })
					if(!state.count){
						dispatch(`${name}SetCount`)
					}
				})
			}else{
				commit(types[`${NAME}_SET_PAGE`], { page: payload, collection: _.slice(state.filtered, (payload-1)*state.limit, payload*state.limit) })
				commit(types[`${NAME}_THINKING`], false)
			}
		},
		[`${name}SetCount`]({ commit, dispatch, state }) {
			if(isEmpty(state.filter)){
				db[name].count().then(count => {
					const nbPages = Math.ceil(count / state.limit)
					commit(types[`${NAME}_SET_COUNT`], count)
					commit(types[`${NAME}_SET_NB_PAGES`], nbPages)
					if(state.page > state.nbPages){
						dispatch(`${name}SetPage`, state.nbPages)
					}
				})
			}else{
				const count = state.filtered.length
				const nbPages = Math.ceil(count / state.limit)
				commit(types[`${NAME}_SET_COUNT`], count)
				commit(types[`${NAME}_SET_NB_PAGES`], nbPages)
				if(state.page > state.nbPages){
					dispatch(`${name}SetPage`, state.nbPages)
				}
			}
		},
		[`${name}SetSort`]({ commit, dispatch, state }, payload){
			if(_.isEqual(payload, { sort: state.sort, reverse: state.reverse })) return
			commit(types[`${NAME}_SET_SORT`], payload)
			if(isEmpty(state.filter)){
				dispatch(`${name}SetPage`, state.page)
			}else{
				dispatch(`${name}SetFiltered`)
			}
		},
		[`${name}SetLimit`]({ commit, dispatch, state }, payload){
			commit(types[`${NAME}_SET_LIMIT`], payload)
			dispatch(`${name}SetCount`)
		},
		[`${name}SetFilter`]({ commit, dispatch, state }, payload){
			if(_.isEqual(payload, state.filter)) return
			if(filterTimer) clearTimeout(filterTimer)
			filterTimer = setTimeout(() => {
				commit(types[`${NAME}_SET_FILTER`], payload)
				if(isEmpty(payload)){
					commit(types[`${NAME}_SET_FILTERED`], [])
					dispatch(`${name}SetCount`)
					dispatch(`${name}SetPage`, state.page)
				}else{
					dispatch(`${name}SetFiltered`)
				}
			}, 300)
		},
		[`${name}SetFiltered`]({ commit, dispatch, state }){
			commit(types[`${NAME}_THINKING`], true)
			let query = db[name].orderBy(state.sort ? state.sort : _label)
			if(state.reverse){
				query.reverse()
			}
			query.toArray().then((collection) => {
				filterByPromised(collection, state.filter).then(filtered => {
					commit(types[`${NAME}_SET_FILTERED`], filtered)
					dispatch(`${name}SetCount`)
					dispatch(`${name}SetPage`, state.page)
				})
			})
		}
	}

	// actions
	const actions = {
		/*[`${name}Select`]({ commit }, payload) {
			commit(types[`${NAME}_SELECT`], payload)
		},
		[`${name}Load`]({ commit }){
			commit(types[`${NAME}_LOAD`])
			if(api && api.all){
				api.all().then(res => commit(types[`${NAME}_LOAD_SUCCESS`], res.data), err => commit(types[`${NAME}_LOAD_FAIL`], res.data))
			}
		},
		[`${name}Changes`]({ commit, state }){
			commit(types[`${NAME}_LOAD`])
			if(api && api.changes){
				api.changes(state.last).then(res => commit(types[`${NAME}_LOAD_SUCCESS`], res.data), err => commit(types[`${NAME}_LOAD_FAIL`], res.data))
			}
		},
		[`${name}Add`]({ commit }, payload){
			commit(types[`${NAME}_ADD`], payload)
			if(api && api.add){
				api.add(payload).then(res => commit(types[`${NAME}_ADD_SUCCESS`], res.data), err => commit(types[`${NAME}_ADD_FAIL`], res.data))
			}
		},
		[`${name}Update`]({ commit }, payload){
			commit(types[`${NAME}_UPDATE`], payload)
			if(api && api.update){
				api.update(payload).then(res => commit(types[`${NAME}_UPDATE_SUCCESS`], res.data), err => commit(types[`${NAME}_UPDATE_FAIL`], res.data))
			}
		},
		[`${name}Remove`]({ commit }, payload){
			commit(types[`${NAME}_REMOVE`], payload)
			if(api && api.remove){
				api.remove(payload).then(res => commit(types[`${NAME}_REMOVE_SUCCESS`], res.data), err => commit(types[`${NAME}_REMOVE_FAIL`], payload))
			}
		},
		[`${name}SetSort`]({ commit }, payload){
			console.log('SET SOTR', payload)
			commit(types[`${NAME}_SET_SORT`], payload)
		},
		[`${name}SetFilter`]({ commit }, payload){
			commit(types[`${NAME}_SET_FILTER`], payload)
		},*/
		...listModule.actions,
		...blActions
	}

	const blMutations = {
		// INFINITE
		[types[`${NAME}_SET_INFINITE`]] (state, { iStart, iLimit, collection }) {
			console.log('SET INFINITE', iStart, iLimit, collection.length)
			state.iStart = iStart
			state.iLimit = iLimit
			state.infinite = [ ...collection ]
		},
		// PAGE
		[types[`${NAME}_SET_PAGE`]] (state, { page, collection }) {
			state.page = page
			state.collection = [ ...collection ]
		},
		// COUNT
		[types[`${NAME}_SET_COUNT`]](state, payload) {
			state.count = payload > 0 ? payload : 0
		},
		// LIMIT
		[types[`${NAME}_SET_LIMIT`]](state, payload) {
			state.limit = payload > 0 ? payload : 1
		},
		// NB_PAGE
		[types[`${NAME}_SET_NB_PAGES`]](state, payload) {
			state.nbPages = payload > 0 ? payload : 1
		},
		[types[`${NAME}_LOAD_SUCCESS`]] (state) {
			state.loading = false
		},
		[types[`${NAME}_THINKING`]] (state, payload) {
			state.filtering = payload
		},
		[types[`${NAME}_SET_FILTERED`]] (state, payload) {
			state.filtered = payload
		},
	}

	const mutations = {
		/*
		// SELECT 
		[types[`${NAME}_SELECT`]] (state, entity) {
			const index = state.collection.findIndex(e => e[_id] == entity[_id])
			(index > -1) ? state.selected = index : state.selected = null
		},
		// LOAD
		[types[`${NAME}_LOAD`]] (state) {
			state.loading = true
		},
		[types[`${NAME}_LOAD_SUCCESS`]] (state, collection) {
			state.loading = false
			state.collection = collection
			const dates = state.collection.map(entity => entity[_updated_at])
			state.last = arrayMax(dates)
		},
		[types[`${NAME}_LOAD_FAIL`]] (state) {
			state.loading = false
			state.loaded = false
			state.collection = []
		},
		// ADD 
		[types[`${NAME}_ADD`]] (state, entity) {
			state.collection = [ ...state.collection, entity ]
		},
		[types[`${NAME}_ADD_SUCCESS`]] (state, entity) {
			state.loading = false
			const index = state.collection.findIndex(e => e[_id] === entity[_id])
			if(index > -1){
				state.collection = [ ...state.collection.slice(0, index), entity, ...state.collection.slice(index+1) ]
				if(entity[_updated_at] > state.last) state.last = entity[_updated_at]
			}
		},
		[types[`${NAME}_ADD_FAIL`]] (state, entity) {
			state.loading = false
			const index = state.collection.findIndex(e => e[_id] == entity[_id])
			if(index > -1){
				state.collection = [ ...state.collection.slice(0, index), ...state.collection.slice(index+1) ]
			}
		},
		// REMOVE
		[types[`${NAME}_REMOVE`]](state, entity) {
			state.collection = state.collection.filter(e => e[_id] !== entity[_id])
		},
		[types[`${NAME}_REMOVE_FAIL`]](state, entity) {
			state.collection = [ ...state.collection, entity ]
		},
		// UPDATE
		[types[`${NAME}_UPDATE`]] (state, entity) {
			const index = state.collection.findIndex(e => e[_id] == entity[_id])
			if(index > -1){
				state.collection = [ ...state.collection.slice(0, index), entity , ...state.collection.slice(index+1) ]
			}
			state.loading = true
		},
		[types[`${NAME}_UPDATE_SUCCESS`]] (state, entity) {
			state.loading = false
			const index = state.collection.findIndex(e => e[_id] == entity[_id])
			if(index > -1){
				state.collection = [ ...state.collection.slice(0, index), entity, ...state.collection.slice(index+1) ]
				if(entity[_updated_at] > state.last) state.last = entity[_updated_at]
			}
		},
		[types[`${NAME}_UPDATE_FAIL`]] (state, entity) {
			state.loading = false
			const index = state.collection.findIndex(e => e[_id] == entity[_id])
			if(index > -1){
				state.collection = [ ...state.collection.slice(0, index), entity, ...state.collection.slice(index+1) ]
			}
		},
		// LAST
		[types[`${NAME}_SET_LAST`]](state, payload) {
			state.last = payload
		},
		// SET SORT
		[types[`${NAME}_SET_SORT`]](state, payload) {
			state.sort = payload.sort
			state.reverse = payload.reverse === 'desc' ? 'desc' : 'asc'
		},
		// SET FILTER
		[types[`${NAME}_SET_FILTER`]](state, payload) {
			state.filter = payload
		},*/
		...listModule.mutations,
		...blMutations
	}

	return {
		state,
		getters,
		actions,
		mutations
	}
}