import { VIDB, deepFreeze } from '../contants'
import listDefaults from './list-defaults'
import bigListDefaults from './biglist-defaults'

export default (options_, db_) => {
	let defaults = {}, options

	for(let schema in options_.options){
		options = options_.options[schema]
		switch (options.type) {
			case VIDB.TYPE.LIST:
				defaults = { ...defaults, ...listDefaults(schema, options, db_) }
				break
			case VIDB.TYPE.BIG_LIST:
				defaults = { ...defaults, ...bigListDefaults(schema, options, db_) }
				break
			default:
				defaults = { ...defaults, ...listDefaults(schema, options, db_) }
				break
		}
	}
	deepFreeze(defaults)
	return defaults
}
