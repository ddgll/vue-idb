import Vue from 'vue'
import VueIdb from '../src'

Vue.use(VueIdb)

import axios from 'axios'

export default new VueIdb({
  version: 1,
  database: 'bigtest',
  schemas: [
    { tests: 'id, title, created_at, updated_at' },
    { bigs: 'uuid, caption, creation, update' },
    { dd: 'uuid, caption, creation, update' }
  ],
  options: {
    tests: { type: 'list', primary: 'id', label: 'title', updated_at: 'updated_at' },
    bigs: { type: 'biglist', primary: 'uuid', label: 'caption', updated_at: 'update' },
    dd: { type: 'biglist', primary: 'uuid', label: 'caption', updated_at: 'update' }
  },
  apis: {
    bigs: {
      all: () => axios.get('/dev/data/bigdata.json')
    }
  }
})
