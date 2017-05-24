import Vue from 'vue'
import Vuex from 'vuex'

import VueIdb from '../src'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    hydrated: false,
    tests: {
      tests: []
    }
  },
  actions: {
    add({ commit, state }, payload){
      console.log('ADD ACTION', payload)
      commit('ADD', { id: new Date().getTime(), title: payload })
    }
  },
  mutations: {
    ['ADD'](state, payload) {
      console.log('ADD MUTATION', payload)
      state.tests.tests = [ ...state.tests, payload ]
    }
  },
  getters: {
    hydrated: state => state.hydrated,
    tests: state => state.tests.tests
  },
  plugins: [ VueIdb.plugin() ],
  strict: true
})
