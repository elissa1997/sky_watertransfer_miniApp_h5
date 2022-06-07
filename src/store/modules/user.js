export default {
  namespaced: true,
  state: {
    info: undefined,
  },
  getters: {},
  mutations: {
    setInfo(state, data) {
      state.info = data;
    },
  },
  actions: {},
}