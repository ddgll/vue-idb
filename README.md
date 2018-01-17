# vue-idb

IndexedDB wrapper for Vuejs based on Dexie

## Install

  ``` bash
  npm install vue-idb --save
  ```
## Exemples

  ``` bash
  npm run dev
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
# 0.2.0 BUGFIX
  BUGFIX on adding schemas on existing DB
  UPDATES dependencies #32

# 0.1.11 BUGFIX
  ADD xxxReset action
  ADD payload to load action

# 0.1.10 BUGFIX
  RETURN Promise.reject()
  BUGFIX #22

# 0.1.4 Enhancement
  BUGFIX on listSelect vuex action
  BUGFIX on toggleSelect vuex action
  
# 0.1.3 Enhancement
  Add Dexie DB version in options

# 0.1.2 Enhancement
  Add Select action in biglist
