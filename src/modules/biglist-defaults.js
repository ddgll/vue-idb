import getTypes from '../types/biglist-types'
import getListModule from './list-module'
import { arrayMax, jsUcfirst } from '../contants'
import filterBy from '../filter-by'
import orderBy from '../order-by'

export default (name, options, db, api) => {
	const listModule = getListModule(name, options, db, api)

	const types = getTypes(name)

	const Name = jsUcfirst(name)
	const NAME = name.toUpperCase()

	const _id = options.primary ? options.primary : 'id'
	const _label = options.label ? options.label : 'label'
	const _updated_at = options.updated_at ? options.updated_at : 'updated_at'

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
		page: 1,
		limit: 20,
		count: 0
	}

	const blGetters = {
	}

	// getters
	const getters = {
		/*[`is${Name}Loading`]: state => state.loading,
		[`is${Name}Loaded`]: state => state.loaded,
		[`get${Name}Last`]: state => state.last,
		[`get${Name}`]: state => {
			return orderBy(filterBy(state.collection, state.filter), state.sort, state.reverse ? true : false)
		},
		[`get${Name}Sorted`]: state => {
			orderBy(state.collection, state.sort, state.reverse ? true : false)
		},
		[`get${Name}Filtered`]: state => {
			filterBy(state.collection, state.filter)
		},
		[`get${Name}Original`]: state => state.collection,
		[`get${Name}Selected`]: state => state.selected !== null ? state.collection[state.selected] : null,
		[`get${Name}Count`]: state => (field, value) => field ? state.collection.filter(entity => entity[field] === value).length : state.collection.length,
		[`get${Name}Ids`]: state => (field, value) => field ?  state.collection.filter(entity => entity[field] === value).map(entity => entity[_id]) : state.collection.map(entity => entity[_id]),
		[`get${Name}Selectable`]: state => state.collection.map(entity => { 
			return {
				label: entity[_label], 
				value: entity[_id] 
			}
		})*/
		...listModule.getters,
		...blGetters
	}

	const blActions = {
		[`${name}SetPage`]({ commit, state }, payload) {
			const page = payload > 0 ? payload : 1
			const callback = (collection) => {
				commit(types[`${NAME}_SET_PAGE`], { page: payload, collection })
			}
			if(state.reverse){
				db[name].orderBy(state.sort).reverse().offset((payload-1)*state.limit).limit(state.limit).toArray().then(callback)
			}else{
				db[name].orderBy(state.sort).offset((payload-1)*state.limit).limit(state.limit).toArray().then(callback)
			}
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

	}

	const mutations = {
		[types[`${NAME}_SET_PAGE`]] (state, { page, collection }) {
			state.collection = collection
		},
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