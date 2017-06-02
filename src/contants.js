export const deepFreeze = (obj) => {
  var propNames = Object.getOwnPropertyNames(obj);
  propNames.forEach(function(name) {
    var prop = obj[name];
    if (typeof prop == 'object' && prop !== null && !Object.isFrozen(prop))
      deepFreeze(prop);
  });
  return Object.freeze(obj);
}

export const arrayMax = (arr) => {
  let len = arr.length, max = -Infinity
  while (len--) {
    if (Number(arr[len]) > max)
      max = Number(arr[len])
  }
  return max
}

export const uuid = () => {
  let d = new Date().getTime()
  if(window.performance && typeof window.performance.now === "function") d += performance.now()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (d + Math.random()*16)%16 | 0
    d = Math.floor(d/16)
    return (c=='x' ? r : (r&0x3|0x8)).toString(16)
  })
  return uuid
}

export const jsUcfirst = (string) => string.charAt(0).toUpperCase() + string.slice(1)

export class VIDB { }

VIDB.TYPE = {
	LIST: 'list',
	KEY_VALUE: 'keyvalue',
	BIG_LIST: 'biglist'
}

deepFreeze(VIDB)
