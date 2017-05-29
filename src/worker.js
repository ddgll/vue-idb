function getValue(value){ return typeof value === 'function' ? value() : value }
function filterDefault(filter) {
	return function (value) {
		return !filter || filter == value
	}
}
function isNumber(value) { return !isNaN(parseInt(value, 10)) && isFinite(value) }
function filterByString(filter){
	if (filter) filter = String(filter).toLowerCase()
	return (value) => !filter || (value ? String(value).toLowerCase().indexOf(filter) !== -1 : false)
}
function filterByBoolean(filter){
	return function (value) { return Boolean(value) === filter }
}

function filterByObject(filter) {
	return function (value){
		var match, val, type
		for (var key in filter) {
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

function filterBy(array, filter){
	var type = typeof filter
	if (!array) return array
	switch(type) {
		case 'boolean': return array.filter(filterByBoolean(filter))
		case 'string': return isNumber(filter) ? array.filter(filterDefault(filter)) : array.filter(filterByString(filter))
		case 'object': return array.filter(filterByObject(filter))
		default: return array.filter(filterDefault(filter))
	}
}

addEventListener("message", function (evt) {
	var result;
	try{
		console.log('WW DATA', evt.data);
		result = filterBy(evt.data.array, evt.data.filter);
		if(result){
			console.log('IN WW', result);
			postMessage(result);
		}
	}catch(e){
		console.error(e);
	}
}, false);
