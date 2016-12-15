import 'jquery';
import 'bootstrap/dist/js/bootstrap';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';


import PlayerSearch from './PlayerSearch.vue';
import Board from './Board.vue';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/', component: PlayerSearch },
  { path: '/board', component: Board } ];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router
}).$mount('#app');
