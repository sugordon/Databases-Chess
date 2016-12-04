import 'jquery';
import 'bootstrap/dist/js/bootstrap';

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import Landing from './Landing.vue'

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/', component: Landing },
  { path: '/board', component: Landing }
];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router
}).$mount('#app');
