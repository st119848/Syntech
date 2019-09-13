import Vue from "vue";
import Vuex from "vuex";
import io from "socket.io-client";

Vue.use(Vuex);

import SystemSetting from "./modules/SystemSetting";
import HistoricalData from "./modules/HistoricalData";
import MonitorControl from "./modules/MonitorControl";
import Monitor from "./modules/Monitor";

export default new Vuex.Store({
  modules: {
    MonitorControl,
    HistoricalData,
    SystemSetting,
    Monitor
  },

  // state: {
  //   ip: "syntech.topwork.asia",
  //   port: "",
  //   httpProtocal: "https",
  //   socket: io("https://syntech.topwork.asia", {
  //     secure: true,
  //     rejectUnauthorized: false,
  //     path: "/socket.io/",
  //     transport: ["websocket"]
  //   })
  // },
  state: {
    ip: "127.0.0.1",
    port: ":3333",
    httpProtocal: "http",
    socket: io("http://127.0.0.1:4000"),

    selected_station: ""
  },
  getters: {
    getUserAccLevel: () => {
      return sessionStorage.getItem("user.level");
    },
    guard: () => auths => {
      const LOGGEDIN_ROLE = sessionStorage.getItem("user.level");

      return auths.includes(LOGGEDIN_ROLE);
    }
  },
  mutations: {
    LOGIN: (state, payload) => {
      sessionStorage.setItem("user.id", payload.id);
      sessionStorage.setItem("user.username", payload.username);
      sessionStorage.setItem("user.name", payload.name);
      sessionStorage.setItem("user.surname", payload.surname);
      sessionStorage.setItem("user.level", payload.level);
      sessionStorage.setItem("user.email", payload.email);
      sessionStorage.setItem("user.tel", payload.tel);

      sessionStorage.setItem("loggedIn", true);
    }
  },
  actions: {
    login: (context, payload) => {
      context.commit("LOGIN", payload);
    }
  }
});
