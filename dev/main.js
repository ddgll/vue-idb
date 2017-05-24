import Vue from 'vue'
import App from './App.vue'

import idb from './idb'
import store from './store'

new Vue({
  el: '#app',
	idb,
  store,
  render: h => h(App)
})
