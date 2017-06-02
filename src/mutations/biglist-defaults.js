import getListMutations from './list-defaults.js'

export default (name, options, db) => {
	const listMutations = getListMutations(name, options, db)
	const NAME = name.toUpperCase()

  const blMutations = {
    [NAME + '_LOAD_SUCCESS'](payload){
    }
  }

	return  {
    ...listMutations,
    ...blMutations
		/*[NAME + '_LOAD_SUCCESS'](payload){
      db[name].bulkPut(payload)
    },
		[NAME + '_ADD']: update,
		[NAME + '_ADD_FAIL']: update,
    [NAME + '_ADD_SUCCESS']: update,
    [NAME + '_UPDATE']: update,
		[NAME + '_UPDATE_FAIL']: update,
    [NAME + '_UPDATE_SUCCESS']: update,
    [NAME + '_REMOVE'](payload){
      db[name].where(id).equals(payload[id]).delete()
    },
    [NAME + '_REMOVE_FAIL']: update*/
	}
}
