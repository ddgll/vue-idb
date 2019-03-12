import { VIDB, deepFreeze } from '../contants'
import listDefaults from './list-defaults'
import bigListDefaults from './biglist-defaults'

export default (migrations_, db_) => {
	let defaults = {}, options

	for (let index in migrations_) {
		let migration = migrations_[index]
		for (let schema in migration.options) {
			options = migration.options[schema]
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
	}
	deepFreeze(defaults)
	return defaults
}
