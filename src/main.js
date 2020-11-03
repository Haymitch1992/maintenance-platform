import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'ant-design-vue/dist/antd.css'
import antd from 'ant-design-vue'
import axios from 'axios'
import qs from 'qs'

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;
Vue.config.productionTip = false
Vue.use(antd)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
