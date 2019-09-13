export default {
  namespaced: true,
  state: {
    socketioGates: "",
    socketioStations: "",

    intelligenceAdvisory: [],

    if_monitor_connected: true,
    if_controller_connected: true
  },
  getters: {
    getAdvisoryByStationId: () => gate_ip => {
      // console.log(JSON.parse(sessionStorage.getItem("intelligenceAdvisory")))
      let intelligenceAdvisory = JSON.parse(
        sessionStorage.getItem("intelligenceAdvisory")
      );
      return intelligenceAdvisory !== null
        ? intelligenceAdvisory.find(obj => obj.gate_ip === gate_ip)
        : false;
    },

    getStationLists: state => {
      return Array.isArray(state.socketioStations) && state.socketioStations.length > 0
        ? [...new Set(state.socketioStations.map(o => o.station_name))]
        : [];
    }
  },
  mutations: {
    UPDATE_SOCKETIO_GATES: (state, val) => {
      state.socketioGates = val;
    },
    UPDATE_SOCKETIO_STATIONS: (state, val) => {
      state.socketioStations = val;
    },

    GET_ADVISORY: (state, payload) => {
      if (sessionStorage.getItem("intelligenceAdvisory") !== null) {
        let intelligenceAdvisory = JSON.parse(
          sessionStorage.getItem("intelligenceAdvisory")
        );

        let station_index = intelligenceAdvisory.findIndex(
          obj => obj.gate_ip === payload.gate_ip
        );

        if (~station_index) {
          // if statios_id is existed.
          intelligenceAdvisory.splice(station_index, 1, {
            gate_ip: payload.gate_ip,
            gate_levels: payload.gate_levels,
            updated: payload.updated
          });
        } else {
          intelligenceAdvisory.push(payload);
        }

        sessionStorage.setItem(
          "intelligenceAdvisory",
          JSON.stringify(intelligenceAdvisory)
        );
      } else {
        sessionStorage.setItem(
          "intelligenceAdvisory",
          JSON.stringify([payload])
        );
      }
    },

  },
  actions: {
    updateSocketioGates: (context, val) => {
      context.commit("UPDATE_SOCKETIO_GATES", val);
    },
    updateSocketioStations: (context, val) => {
      context.commit("UPDATE_SOCKETIO_STATIONS", val);
    },

    getAdvisory: (context, payload) => {
      context.commit("GET_ADVISORY", payload);
    },

  }
};
