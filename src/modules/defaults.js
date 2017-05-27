import { VIDB, deepFreeze } from '../contants'
import listModule from './list-module'

export default (options_, db_) => {
	let modules = {}, options
	for(let schema in options_.options){
		options = options_.options[schema]
		switch (options.types) {
			case VIDB.TYPE.LIST:{
				modules[schema] = listModule(schema, options, db_)
			}
			default:{
				modules[schema] = listModule(schema, options, db_)
			}
		}
	}
	deepFreeze(modules)
	return modules
}
