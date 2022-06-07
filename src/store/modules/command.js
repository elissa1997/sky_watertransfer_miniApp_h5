export default {
  namespaced: true,
  state: {
    regData: undefined,
    inspectionData: undefined,
    executeData: undefined,
    waterVolData: undefined,
  },
  getters: {},
  mutations: {
    setRegData(state, data) {
      state.regData = data;
    },
    setInspectionData(state, data) {
      state.inspectionData = data;
    },
    setExecuteData(state, data) {
      state.executeData = data;
    },
    setWaterVolData(state, data) {
      state.waterVolData = data;
    }
  },
  actions: {},
}