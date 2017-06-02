import Vue from 'vue'
import App from './App.vue'

import idb from './idb'
import store from './store'
import router from './routes'

new Vue({
  el: '#app',
	idb,
  store,
  router,
  render: h => h(App)
})
