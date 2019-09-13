<template>
  <div class="monitor_control">
    <div>
      <Map :stations="stations" :gates="gates" :time_now="time_now" />

      <div class="my-3"></div>

      <Chart />

      <!-- <div class="my-3"></div>

      <Table :stations="stations" :gates="gates" :time_now="time_now" /> -->
    </div>
  </div>
</template>

<script>
const Map = () => import("@/components/Monitor-Control/Childs/Map.vue");
const Table = () => import("@/components/Monitor-Control/Childs/Table.vue");

const Chart = () => import("@/components/Collections/Chart.vue");

import { mapState, mapActions } from "vuex";

import { mixin as VueTimers } from "vue-timers";
import moment from "moment-timezone";

export default {
  name: "MonitorControl",

  components: {
    Map,
    Table,
    Chart
  },

  mixins: [VueTimers],

  timers: {
    log: { time: 1000, autostart: true, repeat: true }
  },

  data() {
    return {
      gates: "",
      stations: "",

      time_now: ""
    };
  },

  computed: {
    ...mapState("MonitorControl", ["socketioGates", "socketioStations"]),
    ...mapState(["socket"])
  },

  watch: {
    socketioGates: function(newVal) {
      this.gates = newVal;
    },

    socketioStations: function(newVal) {
      this.stations = newVal;
    }
  },

  created() {},

  mounted() {
    this.socket.on("gates", data => {
      this.updateSocketioGates(data);
    });

    this.socket.on("stations", data => {
      this.updateSocketioStations(data);
    });

    this.socket.on("advisory", data => {
      this.getAdvisory(data);
    });
  },

  methods: {
    ...mapActions("MonitorControl", [
      "updateSocketioGates",
      "updateSocketioStations",

      "checkMonitorStatus",
      "checkControllerStatus",

      "getAdvisory"
    ]),
    ...mapActions(["addNotification"]),

    log() {
      this.time_now = moment()
        .tz("Asia/Bangkok")
        .format("HH:mm:ss");
    }
  }
};
</script>

<style scoped>
.page_center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
