export default (name, options, db) => {
	const update = (payload) => db[name].put(payload)
	const id = options.primary ? options.primary : 'id'

  const NAME = name.toUpperCase()

	return  {
		[NAME + '_LOAD_SUCCESS'](payload){
      db[name].bulkPut(payload)
    },
		[NAME + '_ADD']: update,
		[NAME + '_ADD_FAIL']: update,
    [NAME + '_ADD_SUCCESS']: update,
    [NAME + '_UPDATE']: update,
		[NAME + '_UPDATE_FAIL']: update,
    [NAME + '_UPDATE_SUCCESS']: update,
    [NAME + '_UPDATES']: update,
		[NAME + '_UPDATES_FAIL']: update,
    [NAME + '_UPDATES_SUCCESS']: update,
    [NAME + '_REMOVE'](payload){
      db[name].where(id).equals(payload[id]).delete()
    },
    [NAME + '_REMOVE_FAIL']: update
	}
}
