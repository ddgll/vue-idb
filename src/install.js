
export let Vue

import VueIdb from './index'

export function install (_Vue) {
  Vue = _Vue

  const version = (Vue.version && Number(Vue.version.split('.')[0])) || -1
  if (process.env.NODE_ENV !== 'production' && install.installed) {
    console.error('already installed.')
    return
  }
  install.installed = true

  if (process.env.NODE_ENV !== 'production' && version < 2) {
    console.error(`vue-db (${install.version}) need to use Vue 2.0 or later (Vue: ${Vue.version}).`)
    return
  }

  Object.defineProperty(Vue.prototype, '$db', {
    get () { return VueIdb._db }
  })

  // use object-based merge strategy
  const strats = Vue.config.optionMergeStrategies
  strats.db = strats.methods
}
