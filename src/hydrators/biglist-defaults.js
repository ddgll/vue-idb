export default (name, options, db) => {
  const update = (payload) => db[name].put(payload)
  const _id = options.primary ? options.primary : 'id'
  const _updated_at = options.updated_at ? options.updated_at : 'updated_at'

  return ( ) => {
    // console.log('HYDRATE', name)
		return db[name].orderBy(_updated_at).reverse().limit(1).toArray().then((max) => {
			let last = null
			if(max && max.length){
				last = max[0][_updated_at]
			}
			return {
				last
			}
		})
  }
}
