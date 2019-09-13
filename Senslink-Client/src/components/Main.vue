<template>
  <div class="h-100">
    <div class="wrapper" style="height: auto; min-height: 100%;">
      <header class="main-header">
        <!-- Logo -->
        <a href="" class="logo">
          <span class="logo-mini">
            <b-img
              style="height: 100%;"
              :src="require('../assets/RID.png')"
              alt="RID image"
            />
          </span>

          <span class="logo-lg">
            <b-img
              style="height: 50%;"
              :src="require('../assets/TSRI.png')"
              alt="TSRI image"
            />
            <b-img
              style="height: 50%;"
              :src="require('../assets/RID.png')"
              alt="RID image"
            />
            <b-img
              style="height: 50%;"
              :src="require('../assets/KMUT.png')"
              alt="KMUT image"
            />
          </span>

          <!-- <span class="logo-mini"><b>CIR</b></span>
          <span class="logo-lg"><b>CWEIR</b></span> -->
        </a>

        <!-- Header Navbar: style can be found in header.less -->
        <nav class="navbar navbar-static-top">
          <!-- Sidebar toggle button-->
          <a
            href="#"
            class="sidebar-toggle py-0"
            data-toggle="push-menu"
            role="button"
          >
            <span class="sr-only">Toggle navigation</span>
          </a>

          <div
            class="d-none d-lg-block"
            style="text-align: center; color: yellow"
          >
            <h4 style="display: table-cell; vertical-align: middle">
              โครงการพัฒนาเทคโนโลยีการบริหารจัดการพื้นที่เกษตรกรรมที่เหมาะสม
            </h4>
            <!-- <h4 style="display: table-cell; vertical-align: middle; color: white">
              A Development of Technology for Improved Water Management in Irrigation Projects
            </h4> -->
          </div>

          <!-- Navbar Right Menu -->
          <div class="navbar-custom-menu">
            <b-button size="sm" class="mx-3" variant="primary" @click="logout()"
              >ออกจากระบบ</b-button
            >
          </div>
        </nav>
      </header>

      <aside class="main-sidebar">
        <!-- sidebar: style can be found in sidebar.less -->
        <section class="sidebar" style="height: auto;">
          <!-- sidebar menu: : style can be found in sidebar.less -->
          <ul class="sidebar-menu tree" data-widget="tree">
            <!-- <li class="header"><h6>เมนู</h6></li> -->
            <li
              v-if="guard(['admin', 'power', 'user'])"
              id="dashboard"
              class="active"
            >
              <b-link @click="componentSelector(1, 0, 0, 0, 0, 0, 0)">
                <font-awesome-icon icon="map-marked-alt" />
                <span class="px-2">เฝ้าดูและสั่งการ</span>
              </b-link>
            </li>

            <li v-if="guard(['admin', 'power'])" id="monitor">
              <b-link @click="componentSelector(0, 1, 0, 0, 0, 0, 0)">
                <font-awesome-icon icon="stop-circle" />
                <span class="px-2">สถานี</span>
              </b-link>
            </li>

            <li
              v-if="guard(['admin'])"
              class="treeview menu-open"
              id="setting"
              style="height: auto;"
            >
              <b-link>
                <font-awesome-icon icon="cogs" />
                <span class="px-2">ตั้งค่าระบบ</span>
                <span class="pull-right-container">
                  <i class="fa fa-angle-left pull-right"></i>
                </span>
              </b-link>
              <ul class="treeview-menu" style="display: block;">
                <li id="user">
                  <b-link @click="componentSelector(0, 0, 0, 0, 1, 0, 0)">
                    <i class="fa fa-circle-o" />
                    ผู้ใช้
                  </b-link>
                </li>
                <li id="station">
                  <b-link @click="componentSelector(0, 0, 0, 0, 0, 1, 0)">
                    <i class="fa fa-circle-o" />
                    สถานี
                  </b-link>
                </li>
                <li id="gate">
                  <b-link @click="componentSelector(0, 0, 0, 0, 0, 0, 1)">
                    <i class="fa fa-circle-o" />
                    ประตู
                  </b-link>
                </li>
              </ul>
            </li>
          </ul>
        </section>
        <!-- /.sidebar -->
      </aside>

      <div class="content-wrapper">
        <div class="">
          <!-- <keep-alive>
            <component :is="myComponent" />
          </keep-alive> -->
          <!-- <Dashboard 
            :stations="stations" 
            :gates="gates" 
            :time_now="time_now" 
          /> -->
          <div v-if="show_dashboard">
            <Dashboard
              :stations="stations" 
              :gates="gates" 
              :time_now="time_now"
             />
          </div>

          <div v-if="show_monitor">
            <Monitor 
              :stations="stations" 
              :gates="gates" 
              :time_now="time_now"
            />
          </div>

          <div v-if="show_setting_user">
            <User />
          </div>
          <div v-if="show_setting_station">
            <Station />
          </div>
          <div v-if="show_setting_gate">
            <Gate />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script scoped>
const MonitorControl = () =>
  import("@/components/Monitor-Control/MonitorControl.vue");
const HistoricalData = () =>
  import("@/components/Historical-Data/HistoricalData.vue");

const User = () => import("@/components/System-Setting/Childs/User.vue");
const Station = () => import("@/components/System-Setting/Childs/Station.vue");
const Gate = () => import("@/components/System-Setting/Childs/Gate.vue");

const Dashboard = () => import("@/components/Dashboard.vue");
const Monitor = () => import("@/components/Monitor/Monitor.vue");

import { mapState, mapGetters, mapActions } from "vuex";
import { mixin as VueTimers } from "vue-timers";
import moment from "moment-timezone";

export default {
  name: "Mains",

  mixins: [VueTimers],

  timers: {
    log: { time: 1000, autostart: true, repeat: true }
  },

  components: {
    MonitorControl,
    HistoricalData,
    User,
    Station,
    Gate,

    Dashboard,
    Monitor
  },

  data() {
    return {
      selected: "dashboard",
      show_dashboard: 1,
      show_monitor: 0,
      show_gate_one: 0,
      show_gate_two: 0,
      show_setting_user: 0,
      show_setting_station: 0,
      show_setting_gate: 0,

      gates: "",
      stations: "",

      time_now: ""
    };
  },

  computed: {
    ...mapState(["socket", "account_level"]),
    ...mapState("MonitorControl", ["socketioGates", "socketioStations"]),

    ...mapGetters(["getUserAccLevel", "guard"]),

    myComponent() {
      switch (this.selected) {
        case "dashboard":
          return MonitorControl;
        case "history":
          return HistoricalData;
        case "user":
          return User;
        case "station":
          return Station;
        case "gate":
          return Gate;

        default:
          return;
      }
    }
  },

  created() {
    let adminLTEHtml = document.querySelector("html");
    adminLTEHtml.style.minHeight = "100%";

    let adminLTEBody = document.querySelector("body");
    adminLTEBody.classList.add("hold-transition");
    adminLTEBody.classList.add("skin-blue");
    adminLTEBody.classList.add("sidebar-mini");
    adminLTEBody.style.minHeight = "100%";

    // window.dispatchEvent(new Event('resize'));
  },

  mounted() {
    window.dispatchEvent(new Event("resize")); // making page load full height

    this.socket.on("automatic_change", payload => {
      this.makeToast(payload.variant, payload.title, payload.msg);
    });

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
    makeToast(variant = null, body, title) {
      this.$bvToast.toast(title, {
        title: body,
        variant: variant,
        solid: true
      });
    },

    componentSelector(v1, v2, v3, v4, v5, v6, v7) {
      this.show_dashboard = v1;
      this.show_monitor = v2;
      this.show_gate_one = v3;
      this.show_gate_two = v4;
      this.show_setting_user = v5;
      this.show_setting_station = v6;
      this.show_setting_gate = v7;
    },

    logout() {
      sessionStorage.clear();
      this.$router.push({ name: "landing_page" });
    },

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
  },

  watch: {
    selected: function(newVal) {
      if (newVal === "dashboard") {
        document.getElementById("dashboard").className = "active";
        document.getElementById("history").className = "";
        document.getElementById("setting").className = "";
      } else if (newVal === "history") {
        document.getElementById("dashboard").className = "";
        document.getElementById("history").className = "active";
        document.getElementById("setting").className = "";
      } else if (
        newVal === "user" ||
        newVal === "station" ||
        newVal === "gate"
      ) {
        document.getElementById("dashboard").className = "";
        document.getElementById("history").className = "";
        document.getElementById("setting").className = "active";
      }
    },

    socketioGates: function(newVal) {
      this.gates = newVal;
    },

    socketioStations: function(newVal) {
      this.stations = newVal;
    }
  }
};
</script>

<style>
@import "../../src/assets/css/leaflet.css";

@import url("https://fonts.googleapis.com/css?family=Kanit&display=swap");
* {
  font-family: "Kanit", sans-serif;
}
h4 {
  font-family: "Kanit", sans-serif;
}
</style>
