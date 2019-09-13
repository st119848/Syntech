import moment from "moment";
export default {
    namespaced: true,
    state: {
        timestamp_labels: [],
        sync_stations_selected: [],
        sync_water_level: [],
        sync_timestamp_label: [],

        sync_chart_table: ""
    },
    getters: {
    },
    mutations: {
        SYNC_CHART_TABLE: (state, payload) => {
            state.sync_chart_table = payload;
        },

        CHANGE_STATIONS_SELECTED: (state, payload) => {
            state.sync_stations_selected = payload;
        },
        CHANGE_WATER_LEVEL: (state, payload) => {
            state.sync_water_level = payload;
        },
        CHANGE_TIMESTAMP_LABEL: (state, payload) => {
            state.sync_timestamp_label = payload;
        },
    },
    actions: {
        syncChartTable: (context, payload) => {
            context.commit("SYNC_CHART_TABLE", payload);
        },

        changeStationsSelected: (context, payload) => {
            context.commit("CHANGE_STATIONS_SELECTED", payload);
        },
        changeWaterLevel: (context, payload) => {
            context.commit("CHANGE_WATER_LEVEL", payload);
        },
        changeTimestampLabel: (context, payload) => {
            context.commit("CHANGE_TIMESTAMP_LABEL", payload);
        }
    }
  };
  