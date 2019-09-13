export default {
  namespaced: true,
  state: {
    historical_data: {
      monitor: [],
      controller: [],
      gate_updated: []
    }
  },
  getters: {},
  mutations: {
    MONITOR_HISTORICAL_DATA: (state, data) => {
      state.historical_data.monitor = data;
    },
    APPEND_MONITOR_HISTORICAL_DATA: (state, data) => {
      state.historical_data.monitor.push(data);
    },

    CONTROLLER_HISTORICAL_DATA: (state, data) => {
      state.historical_data.controller = data;
    },
    APPEND_CONTROLLER_HISTORICAL_DATA: (state, data) => {
      state.historical_data.controller.push(data);
    },

    GATESUPDATE_HISTORICAL_DATA: (state, data) => {
      state.historical_data.gate_updated = data;
    },
    APPEND_GATESUPDATE_HISTORICAL_DATA: (state, data) => {
      state.historical_data.gate_updated.push(data);
    }
  },
  actions: {
    monitorHistoricalData: (context, data) => {
      context.commit("MONITOR_HISTORICAL_DATA", data);
    },
    appendMonitorHistoricalData: (context, data) => {
      context.commit("APPEND_MONITOR_HISTORICAL_DATA", data);
    },

    controllerHistoricalData: (context, data) => {
      context.commit("CONTROLLER_HISTORICAL_DATA", data);
    },
    appendControllerHistoricalData: (context, data) => {
      context.commit("APPEND_CONTROLLER_HISTORICAL_DATA", data);
    },

    gatesupdateHistoricalData: (context, data) => {
      context.commit("GATESUPDATE_HISTORICAL_DATA", data);
    },
    appendGatesUpdateHistoricalData: (context, data) => {
      context.commit("APPEND_GATESUPDATE_HISTORICAL_DATA", data);
    }
  }
};
