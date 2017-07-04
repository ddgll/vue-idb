const compare = (a, b, reverse) =>{
  const sa = String(a).toLowerCase()
  const sb = String(b).toLowerCase()
  if (sa < sb) {
    return reverse ? 1 : -1
  } else if (sa > sb) {
    return reverse ? -1 : 1
  } else {
    return 0
  }
}
export default (array, args, reverse) => {
  let fields, field, revs = {}, ordered = array ? [...array] : []
	// console.log('SORT', args, reverse)
	if(!args) return ordered
  if(typeof args !== 'string'){
    ordered.sort((a, b) => {
      return compare(a, b, reverse)
    });
  }else{
    fields = args.split(',');
    for(field in fields){
      if(reverse && typeof reverse[field] === 'boolean'){
        revs[field] = reverse[field]
      }else{
        revs[field] = reverse
      }
    }
    ordered.sort((a, b) => {
      for(let key in fields){
        field = fields[key]; 
        return compare(a[field], b[field], revs[key])
      }
      return 0
    });
  }
  return ordered;
}
