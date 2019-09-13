export default {
  namespaced: true,
  state: {
    setting_data: {
      user: [],
      station: [],
      gate: []
    },

    create_user_modal_state: false,
    edit_user_modal_state: false,
    delete_user_modal_state: false,

    create_station_modal_state: false,
    edit_station_modal_state: false,
    delete_station_modal_state: false,

    create_gate_modal_state: false,
    edit_gate_modal_state: false,
    delete_gate_modal_state: false
  },
  getters: {
    getActiveStationName: state => {
      let options = [{ value: "", text: "เลือกสถานี" }];
      state.setting_data.station.forEach(each => {
        options.push({ value: each.station, text: each.station });
      });

      return options;
    },
    getActiveGateName: state => {
      let options = [{ value: "", text: "เลือกสถานี" }];
      state.setting_data.gate.forEach(each => {
        options.push({ value: each.station, text: each.station });
      });

      return options;
    },

    createUserModalState: state => {
      return state.create_user_modal_state;
    },
    editUserModalState: state => {
      return state.edit_user_modal_state;
    },
    deleteUserModalState: state => {
      return state.delete_user_modal_state;
    },

    createStationModalState: state => {
      return state.create_station_modal_state;
    },
    editStationModalState: state => {
      return state.edit_station_modal_state;
    },
    deleteStationModalState: state => {
      return state.delete_station_modal_state;
    },

    createGateModalState: state => {
      return state.create_gate_modal_state;
    },
    editGateModalState: state => {
      return state.edit_gate_modal_state;
    },
    deleteGateModalState: state => {
      return state.delete_gate_modal_state;
    }
  },
  mutations: {
    USERS: (state, users) => {
      state.setting_data.user = users;
    },
    APPEND_USER: (state, newUser) => {
      state.setting_data.user.push(newUser);
    },
    UPDATE_USER: (state, payload) => {
      let index = state.setting_data.user.findIndex(
        o => Number(o.id) === Number(payload.id)
      );
      state.setting_data.user.splice(index, 1, payload);
    },
    DELETE_USER: (state, payload) => {
      let index = state.setting_data.user.findIndex(
        o => Number(o.id) === Number(payload.id)
      );
      state.setting_data.user.splice(index, 1);
    },

    STATIONS: (state, stations) => {
      state.setting_data.station = stations;
    },
    APPEND_STATION: (state, newStation) => {
      state.setting_data.station.push(newStation);
    },
    UPDATE_STATION: (state, payload) => {
      let index = state.setting_data.station.findIndex(
        o => Number(o.id) === Number(payload.id)
      );
      state.setting_data.station.splice(index, 1, payload);
    },
    DELETE_STATION: (state, payload) => {
      let index = state.setting_data.station.findIndex(
        o => Number(o.id) === Number(payload.id)
      );
      state.setting_data.station.splice(index, 1);
    },

    GATES: (state, gates) => {
      state.setting_data.gate = gates;
    },
    APPEND_GATE: (state, newGate) => {
      state.setting_data.gate.push(newGate);
    },
    UPDATE_GATE: (state, payload) => {
      let index = state.setting_data.gate.findIndex(
        o => Number(o.id) === Number(payload.id)
      );
      state.setting_data.gate.splice(index, 1, payload);
    },
    DELETE_GATE: (state, payload) => {
      let index = state.setting_data.gate.findIndex(
        o => Number(o.id) === Number(payload.id)
      );
      state.setting_data.gate.splice(index, 1);
    },

    TOGGLE_CREATE_USER_MODAL: (state, bool) => {
      state.create_user_modal_state = bool;
    },
    TOGGLE_EDIT_USER_MODAL: (state, bool) => {
      state.edit_user_modal_state = bool;
    },
    TOGGLE_DELETE_USER_MODAL: (state, bool) => {
      state.delete_user_modal_state = bool;
    },

    TOGGLE_CREATE_STATION_MODAL: (state, bool) => {
      state.create_station_modal_state = bool;
    },
    TOGGLE_EDIT_STATION_MODAL: (state, bool) => {
      state.edit_station_modal_state = bool;
    },
    TOGGLE_DELETE_STATION_MODAL: (state, bool) => {
      state.delete_station_modal_state = bool;
    },

    TOGGLE_CREATE_GATE_MODAL: (state, bool) => {
      state.create_gate_modal_state = bool;
    },
    TOGGLE_EDIT_GATE_MODAL: (state, bool) => {
      state.edit_gate_modal_state = bool;
    },
    TOGGLE_DELETE_GATE_MODAL: (state, bool) => {
      state.delete_gate_modal_state = bool;
    }
  },
  actions: {
    users: (context, users) => {
      context.commit("USERS", users);
    },
    appendUser: (context, newUser) => {
      context.commit("APPEND_USER", newUser);
    },
    updateUserState: (context, payload) => {
      context.commit("UPDATE_USER", payload);
    },
    deleteUserState: (context, payload) => {
      context.commit("DELETE_USER", payload);
    },

    stations: (context, stations) => {
      context.commit("STATIONS", stations);
    },
    appendStation: (context, newStation) => {
      context.commit("APPEND_STATION", newStation);
    },
    updateStationState: (context, payload) => {
      context.commit("UPDATE_STATION", payload);
    },
    deleteStationState: (context, payload) => {
      context.commit("DELETE_STATION", payload);
    },

    gates: (context, gates) => {
      context.commit("GATES", gates);
    },
    appendGate: (context, newGate) => {
      context.commit("APPEND_GATE", newGate);
    },
    updateGateState: (context, payload) => {
      context.commit("UPDATE_GATE", payload);
    },
    deleteGateState: (context, payload) => {
      context.commit("DELETE_GATE", payload);
    },

    toggleCreateUserModal: (context, bool) => {
      context.commit("TOGGLE_CREATE_USER_MODAL", bool);
    },
    toggleEditUserModal: (context, bool) => {
      context.commit("TOGGLE_EDIT_USER_MODAL", bool);
    },
    toggleDeleteUserModal: (context, bool) => {
      context.commit("TOGGLE_DELETE_USER_MODAL", bool);
    },

    toggleCreateStationModal: (context, bool) => {
      context.commit("TOGGLE_CREATE_STATION_MODAL", bool);
    },
    toggleEditStationModal: (context, bool) => {
      context.commit("TOGGLE_EDIT_STATION_MODAL", bool);
    },
    toggleDeleteStationModal: (context, bool) => {
      context.commit("TOGGLE_DELETE_STATION_MODAL", bool);
    },

    toggleCreateGateModal: (context, bool) => {
      context.commit("TOGGLE_CREATE_GATE_MODAL", bool);
    },
    toggleEditGateModal: (context, bool) => {
      context.commit("TOGGLE_EDIT_GATE_MODAL", bool);
    },
    toggleDeleteGateModal: (context, bool) => {
      context.commit("TOGGLE_DELETE_GATE_MODAL", bool);
    }
  }
};
