import Vue from 'vue'
import Vuex from 'vuex'

import VueIdb from './idb'

import axios from 'axios'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

let modules = VueIdb.modules

modules.bigs.actions.bigsLoad = ({ commit, dispatch, state }, payload) => {
  return axios.get('/dev/data/' + payload).then((res) => dispatch('bigsLoadResponse', res.data))
}

export default new Vuex.Store({
  state: {
    hydrated: false
  },
  actions: {
  },
  mutations: {
    'DELETE_INDEXED_DB'(){}
  },
  modules: modules,
  getters: {
    hydrated: state => state.hydrated
  },
  plugins: [ VueIdb.plugin ],
  strict: debug
})
