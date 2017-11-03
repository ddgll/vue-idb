import getTypes from '../types/biglist-types'
import getListModule from './list-module'
import { arrayMax, jsUcfirst, isEmpty } from '../contants'
import filterBy from '../filter-by'
import filterByPromised from '../filter-by-promised'
import orderBy from '../order-by'
import _ from 'lodash'

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
		thinking: false
	}

	// getters
	const getters = {
		[`is${Name}Loading`]: state => state.loading,
		[`is${Name}Loaded`]: state => state.loaded,
		[`get${Name}Last`]: state => state.last,
		[`get${Name}Selected`]: state => state.selected !== null ? state.selected : null,
		[`get${Name}Selection`]: state => state.selection,
		[`get${Name}SelectionCollection`]: state => state.collection.filter(entity => state.selection.indexOf(entity[_id]) > -1),
		[`get${Name}SelectionCount`]: state => state.selection.length,
		[`is${Name}InSelection`]: state => id => (state.selection.indexOf(id) > -1) ? true : false,
		[`get${Name}`]: state => state.collection,
		[`get${Name}Infinite`]: state => state.infinite,
		[`get${Name}Page`]: state => state.page,
		[`get${Name}Count`]: state => state.count,
		[`get${Name}NbPages`]: state => state.nbPages,
		[`get${Name}Limit`]: state => state.limit,
		[`get${Name}Thinking`]: state => state.thinking
	}

	let filterTimer = null

	const blActions = {
		[`${name}Reset`]({ commit, dispatch, state }) {
			commit(types[`${NAME}_LOAD_SUCCESS`], [])
			commit(types[`${NAME}_SELECT`], -1)
			commit(types[`${NAME}_SET_LAST`], null)
			commit(types[`${NAME}_SET_FILTER`], {})
			commit(types[`${NAME}_SET_SORT`], { sort: _label, reverse: false })
			return db[name].clear().then(() => {
				dispatch(`${name}SetCount`)
				dispatch(`${name}SetPage`, 1)
			})
		},
		[`${name}Select`]({ commit }, payload) {
			if (payload) {
				db[name].where(_id).equals(payload[_id]).first().then((entity) => {
					commit(types[`${NAME}_SELECT`], entity)
				})
			} else {
				commit(types[`${NAME}_SELECT`], null)
			}
		},
		[`${name}LoadResponse`]({ commit, dispatch, state }, payload){
			if(!payload || !payload.length) return commit(types[`${NAME}_LOAD_SUCCESS`])
			const toAdd = payload.filter(entity => !entity[_deleted_at])
			const toDelete = payload.filter(entity => entity[_deleted_at])
			const callback = () => {
				dispatch(`${name}SetCount`)
				db[name].orderBy(_updated_at).reverse().limit(1).toArray().then((last) => {
					if(last && last.length){
						commit(types[`${NAME}_SET_LAST`], last[0][_updated_at])	
					}
					commit(types[`${NAME}_LOAD_SUCCESS`])
					if(isEmpty(state.filter)){
						dispatch(`${name}SetPage`, state.page)
					}else{
						dispatch(`${name}SetFiltered`)
					}
				})
			}
			return db[name].bulkPut(toAdd).then(() => {
				if(toDelete.length){
					return db[name].bulkDelete(toDelete.map(entity => entity[_id])).then(callback)
				}else{
					callback()
				}
			})
		},
		[`${name}Load`]({ commit, dispatch, state }, payload){
			const params = { ...payload, last: state.last }
			commit(types[`${NAME}_LOAD`])
			if(api && api.all){
				return api.all(params).then(
					res => dispatch(`${name}LoadResponse`, res.data),
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
					dispatch(`${name}SetInfinite`)
				})
			})
		}
	}

	// actions
	const actions = {
		...listModule.actions,
		...blActions
	}

	const blMutations = {
		// SELECT 
		[types[`${NAME}_SELECT`]] (state, entity) {
			state.selected = entity !== null ? { ...entity } : null
		},
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
			state.thinking = payload
		},
		[types[`${NAME}_SET_FILTERED`]] (state, payload) {
			state.filtered = payload
		},
	}

	const mutations = {
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