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

  const idb = new VueIdb({
    version: 1,
    database: 'test',
    schemas: [
      { tests: 'id, title, created_at, updated_at' },
			{ posts: 'id, owner' }
    ]
  })

  new Vue({
    el: '#app',
    idb: idb,
    render: h => h(App)
  })
  ```
  
# 0.1.4 Enhancement
  BUGFIX on listSelect vuex action
  BUGFIX on toggleSelect vuex action
  
# 0.1.3 Enhancement
  Add Dexie DB version in options

# 0.1.2 Enhancement
  Add Select action in biglist
