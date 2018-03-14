import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import VueResource from 'vue-resource'
Vue.use(VueResource)

if(process.env.NODE_ENV === 'production') {
  Vue.prototype.$isProduction = true;
  Vue.http.options.root = '//api.vote.ybusad.com'
}else {
  Vue.prototype.$isProduction = false;
  Vue.http.options.root = '//api.vote.me:3000'
}

Vue.http.options.emulateJSON = true
Vue.http.options.credentials = true

Vue.prototype.$bus = new Vue()

import App from './App.vue'
import routes from './routes'
import './common/main.less'
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'

import WebsiteHeader from './common/components/Header.vue'
import WebsiteFooter from './common/components/Footer.vue'

Vue.mixin({
  components: {WebsiteHeader, WebsiteFooter}
})

new Vue({
  el: '#app',
  router: new VueRouter({routes, mode: 'history'}),
  render: h => h(App)
})