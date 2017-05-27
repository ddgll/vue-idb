import { VIDB, deepFreeze } from '../contants'
import listMutationsTypes from './list-types'

export default (options_, db) => {
	let mutations = {}, options
	for(let schema in options_.options){
		options = options_.options[schema]
		switch (options.types) {
			case VIDB.TYPE.LIST:{
				mutations = { ...mutations, ...listMutationsTypes(schema) }
			}
			default:{
				mutations = { ...mutations, ...listMutationsTypes(schema) }
			}
		}
	}
	deepFreeze(mutations)
	return mutations
}
