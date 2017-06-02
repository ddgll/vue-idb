import { VIDB, deepFreeze } from '../contants'
import listModule from './list-module'
import bigListModule from './biglist-module'

export default (options_, db_) => {
	let modules = {}, options
	for(let schema in options_.options){
		options = options_.options[schema]
		switch (options.type) {
			case VIDB.TYPE.LIST:
				modules[schema] = listModule(schema, options, db_, options_.apis ? options_.apis[schema] : null )
				break
			case VIDB.TYPE.BIG_LIST:
				modules[schema] = bigListModule(schema, options, db_, options_.apis ? options_.apis[schema] : null)
				break
			default:
				modules[schema] = listModule(schema, options, db_, options_.apis ? options_.apis[schema] : null)
				break
		}
	}
	//deepFreeze(modules)
	return modules
}
