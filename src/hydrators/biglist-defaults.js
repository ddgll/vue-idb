export default (name, options, db) => {
  const update = (payload) => db[name].put(payload)
  const id = options.primary ? options.primary : 'id'
  const updated_at = options.updated_at ? options.updated_at : 'updated_at'

  return ( ) => {
		return db[name].orderBy(updated_at).reverse().limit(1).toArray().then((max) => {
			let last = null
			if(max && max.length){
				last = max[0].updated_at
			}
			return {
				last
			}
		})
  }
}
