import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'list',
    component: () => import(/* webpackChunkName: "about" */ '../views/maintenance-list.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
