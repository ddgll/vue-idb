import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import list from './list.vue'
import biglist from './biglist.vue'
import withoutVuex from './without-vuex.vue'

export default new VueRouter({
  base: '/',
  routes: [
    { path: '/', component: list }, // Default
    { path: '/big', component: biglist }, // Default
    { path: '/without-vuex', component: withoutVuex }, // Default
  ]
})

