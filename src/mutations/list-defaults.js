export default (name, options, db) => {
  const update = (payload) => db[name].put(payload)
  const id = options.primary ? options.primary : 'id'
  const remove = (payload) => db[name].where(id).equals(payload[id]).delete()

  const NAME = name.toUpperCase()

	return  {
		[NAME + '_LOAD_SUCCESS'](payload){
      db[name].bulkPut(payload)
    },
		[NAME + '_ADD']: update,
		[NAME + '_ADD_FAIL']: remove,
    [NAME + '_ADD_SUCCESS']: update,
    [NAME + '_UPDATE']: update,
		[NAME + '_UPDATE_FAIL']: update,
    [NAME + '_UPDATE_SUCCESS']: update,
    [NAME + '_UPDATES']: update,
		[NAME + '_UPDATES_FAIL']: update,
    [NAME + '_UPDATES_SUCCESS']: update,
    [NAME + '_REMOVE']: remove,
    [NAME + '_REMOVE_FAIL']: update
	}
}
