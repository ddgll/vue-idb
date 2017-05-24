/* @flow */

import { install, Vue } from './install'
import Dexie  from 'dexie'
import vuexIndexedDB from './vuex-idb'

import dbOpen from './db-open'
import defaultMutations from './default-mutations'
import defaultHydrators from './default-hydrators'

export default class VueIdb {
  static install
  static version
  static _db
  static _plugin
  static _options

  _vm

  constructor (options) {
		this._initDB(this._options)
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

  get plugin() {
    if(!VueIdb._options.mutations){
      VueIdb._options.mutations = defaultMutations(VueIdb._options);
    }
    if(!VueIdb._options.hydrators){
      VueIdb._options.hydrators = defaultHydrators(VueIdb._options);
    }
    if(!VueIdb._plugin){
      VueIdb._plugin = vuexIndexedDB(VueIdb._db, VueIdb._options)
    }
    return VueIdb._plugin
  }

  get db () { return VueIdb._db }
}

VueIdb.install = install
VueIdb.version = '__VERSION__'

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(VueIdb)
}