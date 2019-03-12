import { VIDB, deepFreeze } from '../contants'
import listModule from './list-module'
import bigListModule from './biglist-module'

export default (migrations_, db_) => {
	let modules = {}, options

	for (let index in migrations_) {
		let migration = migrations_[index]
		for (let schema in migration.options) {
			options = migration.options[schema]
			switch (options.type) {
				case VIDB.TYPE.LIST:
					modules[schema] = listModule(schema, options, db_, options.apis ? options.apis[schema] : null)
					break
				case VIDB.TYPE.BIG_LIST:
					modules[schema] = bigListModule(schema, options, db_, options.apis ? options.apis[schema] : null)
					break
				default:
					modules[schema] = listModule(schema, options, db_, options.apis ? options.apis[schema] : null)
					break
			}
		}
	}
	//deepFreeze(modules)
	return modules
}
