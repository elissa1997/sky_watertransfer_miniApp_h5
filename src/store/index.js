import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import command from './modules/command'
import user from './modules/user'

export default new Vuex.Store({
  namespaced: true,
  state: {},
  mutations: {},
  actions: {},
  modules: {
    command,
    user
  }

})