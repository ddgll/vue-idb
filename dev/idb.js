import Vue from 'vue'
import VueIdb from '../src'

Vue.use(VueIdb)

export default new VueIdb({
  database: 'test',
  schemas: [
    { tests: 'id, title, created_at, updated_at' }
  ]
})
