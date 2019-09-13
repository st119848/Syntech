<template>
  <div class="map">
    <b-jumbotron class="p-0 map_frame">
      <l-map
        style="height: 100%; width: 100%; border-radius: 5px;"
        :zoom="zoom"
        :center="center"
        :options="map_options"
      >
        <!-- <l-tile-layer :url="url_selected" :options="{ detectRetina: true }" /> -->
        <l-control-zoom position="topleft" />
        <l-control-layers position="topright" />

        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :options="{ detectRetina: true }"
          layer-type="base"
        />

        <div>
          <div v-for="(each, index) in stations" :key="index + 's'">
            <l-marker
              :icon="stationMarker(
                each.measures[0], 
                each.thresholds
              )"
              :lat-lng="each.location"
            >
              <l-popup :options="popup_options">
                <b-row>
                  <b-col class="px-0" cols="10">
                    <h6>
                      <strong>{{ each.station_name }}</strong>
                    </h6>
                    <div style="font-size: 15px;">
                      <b class="pr-1">ระดับน้ำ:</b>
                      {{ each.measures[0] }} m.
                      <br />
                      <b class="pr-1">สถานะระดับน้ำ:</b> Warning
                      <br />
                      {{ each.updated | formatTime }}
                    </div>
                  </b-col>
                </b-row>
              </l-popup>
            </l-marker>
          </div>
        </div>

        <div v-if="arrIsNotEmpty(keepGateIcons)">
          <div v-for="(each, index) in gates" :key="index + 'g'">
            <l-marker
              :icon="gateMarker"
              :lat-lng="each.location"
            />
            <l-marker
              v-if="each.overloads.some(o => o !== 0)"
              :icon="warningIcon"
              :lat-lng="each.location"
            />
            <l-marker
              :icon="keepGateIcons[index]"
              :lat-lng="each.location"
              @click="toggleGateIcon(index)"
            >
              <l-popup :options="popup_options">
                <b-row>
                  <b-col class="px-0" cols="10">
                    <h6>
                      <strong>{{ each.station_name }}</strong>
                    </h6>
                    <div style="font-size: 15px;">
                      <div
                        v-for="(_each, _index) in each.sensors.slice(
                          0,
                          each.gate_amount
                        )"
                        :key="_index + 'b'"
                      >
                        <b-row class="pl-3">
                          <b class="pr-1">ประตู {{ _index + 1 }}:</b>
                          {{ _each }} cm.
                        </b-row>
                      </div>
                      {{ each.updated | formatTime }}
                    </div>
                  </b-col>
                </b-row>
              </l-popup>
            </l-marker>
          </div>
        </div>
      </l-map>
    </b-jumbotron>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import moment from "moment-timezone";
import { stat, statSync } from "fs";

const thresholdColor = (arr, val) => {
  if (val < arr[0] || val > arr[1]) return '#E53935';
  if (val < arr[2] || val > arr[3]) return '#FB8C00';
  if (val < arr[4] || val > arr[5]) return '#FDD835';

  return '#43A047';
}

import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup,
  LTooltip,
  LControlLayers,
  LControlZoom
} from "vue2-leaflet";
const L = require("leaflet");

export default {
  name: "Map",

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip,
    LControlLayers,
    LControlZoom
  },

  props: {
    stations: {
      type: [Array, String],
      required: true
    },
    gates: {
      type: [Array, String],
      required: true
    },
    time_now: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      tileProviders: [
        {
          name: 'ปกติ',
          visible: true,
          url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png'
        },
        {
          name: 'ดาวเทียม',
          visible: false,
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        }
      ],
      zoom: 8,
      center: [16.519608, 99.557436],
      map_options: {
        trackResize: true,
        doubleClickZoom: false,
        zoomControl: false,
        attributionControl: false
      },
      popup_options: {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        autoPan: false
      },

      keepStationMarker: [],
      keepGateMarker: [],

      keepStationIcons: [],
      keepGateIcons: [],

      gateMarker: L.icon({
        iconUrl: require("../../assets/gate-icon1.svg"),
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      }),

      warningIcon: L.icon({
        iconUrl: require("../../assets/warning.svg"),
        iconSize: [20, 20],
        iconAnchor: [50, 10]
      })
    };
  },

  created() {},

  computed: {
    ...mapState([""]),
    ...mapGetters(["getUserAccLevel", "guard"]),
  },

  watch: {
    gates: function(newVal) {
      if (newVal || this.arrIsNotEmpty(this.gates)) {
        this.generateKeepGateIcon();
      }
    }
  },

  mounted() {},

  methods: {
    stationMarker(water, thresholds) {
      const color = thresholdColor(thresholds, water)

      return L.divIcon({
        className: 'dummy',
        iconAnchor: [10, 10],
        popupAnchor: [90, 125],
        html: `<svg width='21' height='21' > 
                <circle cx='10.5' cy='10.5' r='10' stroke='black' stroke-width='1' fill='${color}' /> 
              </svg>`
      });
    },

    toggleGateIcon(index) {
      let currVal = [...this.keepGateIcons][index];
      currVal.options.iconUrl = currVal.options.iconUrl.includes("plus")
        ? require("../../assets/minus.svg")
        : require("../../assets/plus.svg");

      this.$set(this.keepGateIcons, index, currVal);
    },

    generateKeepGateIcon() {
      for (let i = 0, len = this.gates.length; i < len; i++) {
        if (this.keepGateIcons[i]) {
          let currVal = [...this.keepGateIcons][i];
          currVal.options.iconUrl = currVal.options.iconUrl.includes("plus")
            ? require("../../assets/plus.svg")
            : require("../../assets/minus.svg");

          this.$set(this.keepGateIcons, i, currVal);
        } else {
          this.$set(
            this.keepGateIcons,
            i,
            L.icon({
              iconUrl: require("../../assets/plus.svg"),
              iconSize: [20, 20],
              iconAnchor: [-5, 8],
              popupAnchor: [100, 145]
            })
          );
        }
      }
    },

    arrIsNotEmpty(arr) {
      return Array.isArray(arr) && arr.length > 0;
    },

    formatDate(str) {
      return str.split(" ")[0];
    },

    formatTime(str) {
      return str.split(" ")[1];
    },

    checkMonitorConnection(val = 0) {
      let [hh, mm] = moment
        .utc(
          moment(this.time_now, "HH:mm:ss").diff(
            moment(this.formatTime(this.stations[val].updated), "HH:mm:ss")
          )
        )
        .format("HH:mm:ss")
        .split(":")
        .map(o => Number(o));

      return Boolean(mm < 10 && hh === 0);
    },

    checkControllerConnection(val = 0) {
      let [hh, mm] = moment
        .utc(
          moment(this.time_now, "HH:mm:ss").diff(
            moment(this.formatTime(this.gates[val].updated), "HH:mm:ss")
          )
        )
        .format("HH:mm:ss")
        .split(":")
        .map(o => Number(o));

      return mm === 59 ? true : Boolean(mm <= 1 && hh === 0);

      // return Boolean(mm <= 5 && hh === 0);
    }
  },

  filters: {
    fixedDigit: function(val) {
      if (typeof val === "number") {
        return Number(val.toFixed(2));
      }
    },

    formatDate: function(str) {
      return str.split(" ")[0];
    },

    formatTime: function(str) {
      return str.split(" ")[1];
    }
  }
};
</script>

<style scoped>
/* @import "../../../../src/assets/css/leaflet.css"; */

.detail {
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px 10px 0px 0px;
}

.map_frame {
  width: 100%;
  height: 400px;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
}
</style>
