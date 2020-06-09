import Vue from 'vue';
import Vuex from 'vuex';

import config from '@/config/config.json';
import auth from './modules/auth';

process.env.NODE_ENV === 'production';

console.log(config);

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    config: config,
    tabDescription: '',
  },
  getters: {
    config: (state: any) => state.config,
    tabDescription: (state: any) => state.tabDescription,
  },
  mutations: {
    changeTabDescription(state: any, description: string) {
      state.tabDescription = description;
    },
  },
  actions: {},
  modules: { auth },
});
