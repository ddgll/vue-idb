
export default (db, options) => {
	for (let migration of options) {
		for (let schema of migration.schemas) {
			console.log('Create/Migrate DB schema, Version:', migration.version ? migration.version : 1)
			db.version(migration.version ? migration.version : 1).stores(schema)
		}
	}

	if (!db.isOpen()) {
		console.log('DB not open, opening...')
		db.open().catch(function (error) {
			console.error('A IndexedDB error occured', error)
		})
	}
}
