export default (name, options, db) => {
  const id = options.primary ? options.primary : 'id'
  const updated_at = options.updated_at ? options.updated_at : 'updated_at'

  return ( ) => {
    console.log('HYDRATE', name)
    return db[name].toArray((result) => {
      console.log('ADD RESULT', result)
      let collection = [], last
      for(let entity of result){
        if(!last || last < entity.updated_at) last = entity.updated_at
        collection.push(entity)
      }
      return {
        last,
        collection
      }
    })
  }
}
