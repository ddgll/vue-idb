const getValue = (value) => typeof value === 'function' ? value() : value
const filterDefault = (filter) => (value) => {
	console.log('default', filter, value, filter === value)
	!filter || filter == value
}
const isNumber = (value) => !isNaN(parseInt(value, 10)) && isFinite(value)
const filterByString = (filter) => {
	if (filter) filter = ('' + filter).toLowerCase()
	return (value) => !filter || (value ? String(value).toLowerCase().indexOf(filter) !== -1 : false)
}
const filterByBoolean = (filter) => (value) => Boolean(value) === filter

const filterByObject = (filter) => {
	return (value) => {
		let match, val, type
		for (let key in filter) {
			if (!value.hasOwnProperty(key) && !Object.getOwnPropertyDescriptor(Object.getPrototypeOf(value), key)) return false
			val = getValue(value[key])
			type = typeof filter[key]
			match = false
			switch(type) {
				case 'boolean': match = filterByBoolean(filter[key])(val); break;
				case 'string': 	match = filterByString(filter[key])(val); break;
				case 'object': match = filterByObject(filter[key])(val); break;
				default: match = filterDefault(filter[key])(val); break;
			}
			if (!match) return false
		}
		return true
	}
}

export default (array, filter) => {
	const type = typeof filter
	//console.log('FILTER BY', filter, array, type)
	if (!array) return array
	switch(type) {
		case 'boolean': return array.filter(filterByBoolean(filter))
		case 'string': return isNumber(filter) ? array.filter(filterDefault(filter)) : array.filter(filterByString(filter))
		case 'object': return array.filter(filterByObject(filter))
		default: return array.filter(filterDefault(filter))
	}
}
