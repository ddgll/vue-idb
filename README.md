# vue-idb

IndexedDB wrapper for Vuejs based on Dexie

## Install

  ``` bash
  npm install vue-idb --save
  ```
## Usage

  ``` js
  import Vue from 'vue'
  import VueIdb from 'vue-idb'

  Vue.use(VueIdb)

  const dbName = "database"

  const idb = new VueIdb(database, [{
    version: 1,
    schemas: [
      { tests: 'id, title, created_at, updated_at' },
			{ posts: 'id, owner' }
    ]
  },
  {
    version: 2,
    schemas: [
      { cars: 'id, name, created_at, updated_at'},
    ],
    upgrade: function(tx) {
      return tx.tests.toCollection().modify(item => {
        // modify your table
      })
    }
  })

  new Vue({
    el: '#app',
    idb: idb,
    render: h => h(App)
  })
