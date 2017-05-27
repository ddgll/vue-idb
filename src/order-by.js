export default (array, args, reverse) => {
  let fields
  let field
  let ordered = array ? [...array] : []
	console.log('SORT', args, reverse)
	if(!args) return ordered
  if(typeof args !== 'string'){
    ordered.sort((a, b) => {
      if (a < b) {
        return reverse ? 1 : -1
      } else if (a > b) {
        return reverse ? -1 : 1
      } else {
        return 0
      }
    });
  }else{
    fields = args.split(',');
    ordered.sort((a, b) => {
      for(let key in fields){
        field = fields[key];
        if (a[field] < b[field]) {
          return reverse[key] ? 1 : -1
        } else if (a[field] > b[field]) {
          return reverse[key] ? -1 : 1
        } else {
          return 0
        }
      }
      return 0
    });
  }
  return ordered;
}
