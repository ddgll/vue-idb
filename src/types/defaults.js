import { VIDB, deepFreeze } from '../contants'
import listMutationsTypes from './list-types'
import bigListMutationsTypes from './biglist-types'

export default (options_, db) => {
	let mutations = {}, options
	for(let schema in options_.options){
		options = options_.options[schema]
		switch (options.type) {
			case VIDB.TYPE.LIST:
				mutations = { ...mutations, ...listMutationsTypes(schema) }
				break
			case VIDB.TYPE.BIG_LIST:
				mutations = { ...mutations, ...bigListMutationsTypes(schema) }
				break
			default:
				mutations = { ...mutations, ...listMutationsTypes(schema) }
				break
		}
	}
	deepFreeze(mutations)
	return mutations
}
