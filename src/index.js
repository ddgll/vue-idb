/* @flow */

import { install, Vue } from './install'
import Dexie  from 'dexie'
import { VIDB } from './contants'
import vuexIndexedDB from './vuex-idb'
import dbOpen from './db-open'
import defaultMutations from './mutations/defaults'
import defaultHydrators from './hydrators/defaults'
import getModules from './modules/defaults'
import orderByFunc from './order-by'
import filterByFunc from './filter-by'
import filterByPromisedFunc from './filter-by-promised'

export const orderBy = orderByFunc
export const filterBy = filterByFunc
export const filterByThread = filterByPromisedFunc

export { deepFreeze, arrayMax, uuid, jsUcfirst } from './contants'
export * from './infinite-scroll'

export default class VueIdb {
  static install
  static version
  static _db
  static _plugin
  static _options

  constructor (options) {
		this._initDB(options)
  }

  _initDB (options) {
    if(!VueIdb._options) VueIdb._options = options
    if(VueIdb._db) return
    if(!options.schemas){
      console.error('VueIdb configuration error: schemas must be set')
    }
    VueIdb._db = new Dexie(options.database ? options.database : 'database')
    dbOpen(VueIdb._db, options.schemas)
  }

  get plugin () {
    if(!VueIdb._plugin){
      VueIdb._options.mutations = defaultMutations(VueIdb._options, VueIdb._db)
      VueIdb._options.hydrators = defaultHydrators(VueIdb._options, VueIdb._db)
      VueIdb._plugin = vuexIndexedDB(VueIdb._db, VueIdb._options)
    }
    return VueIdb._plugin
  }

  get modules () {
    return getModules(VueIdb._options, VueIdb._db)
  }

  get db () { return VueIdb._db }
}

VueIdb.install = install
VueIdb.version = '__VERSION__'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueIdb)
}
