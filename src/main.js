import 'jquery';
import 'bootstrap/dist/js/bootstrap';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import PlayerSearch from './PlayerSearch.vue';
import GameSearch from './GameSearch.vue';
import Player from './Player.vue';
import Board from './Board.vue';
import Viewer from './Viewer.vue';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  { path: '/', component: PlayerSearch },
  { path: '/gamesearch', component: GameSearch },
  { path: '/player/:id', component: Player },
  { path: '/pgn/:id', component: Viewer },
  { path: '/board/:fen', component: Board } ];

const router = new VueRouter({
  routes
});

const app = new Vue({
  router
}).$mount('#app');
