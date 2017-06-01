'use strict'

import lodash from 'lodash'

require("babel-core/register")
if (! window._babelPolyfill) {
  require("babel-polyfill");
}

import dbOpen from './db-open'

export default function (db, options) {
	return async store => {
		let prevState = _.cloneDeep(store.state)

		for(let schema in options.hydrators){
			const hydrated = await options.hydrators[schema]()
			const substate = { ...store.state[schema], ...hydrated }
			store.replaceState({ ...store.state, [schema]: substate })
			console.log('SCHEME', store.state)
		}

		console.log('HYDRATED')
		store.replaceState({ ...store.state, hydrated: true })

		store.subscribe((mutation, state) => {
			let nextState = _.cloneDeep(state)

			if(options.mutations[mutation.type]){
				//console.log('LAUCNH MUTATION', mutation)
				options.mutations[mutation.type](mutation.payload, store)
			}

			if(mutation.type === 'DELETE_INDEXED_DB'){
				db.delete().then(() => {
					dbOpen(db, options.schemas)
					if(typeof mutation.payload === 'function'){
						mutation.payload()
					}
				})
			}

			prevState = nextState
		})
	}
}
