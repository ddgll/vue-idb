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

  constructor (dbName, migrations) {
		this._initDB(dbName, migrations)
  }

  _initDB (dbName, migrations) {
    if(!VueIdb._options) VueIdb._options = migrations
    if(VueIdb._db) return
    migrations.forEach(migration => {
      if(!migration.schemas) {
        console.error('VueIdb configuration error: schemas must be set in each version')
      }
    });
    if(!dbName) {
      console.error('VueIdb configuration error: database name need to be present')
    }
    VueIdb._db = new Dexie(dbName)
    dbOpen(VueIdb._db, migrations)
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
