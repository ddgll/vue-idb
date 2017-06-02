# js-vue.library.vue-idb

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
