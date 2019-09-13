<template>
  <div class="map">
    <div v-if="arrIsNotEmpty(keepStationIcons)">
      <b-modal
        id="modal-station"
        ref="modal_station"
        centered
        size="lg"
        hide-footer
        title="รายละเอียดสถานีวัดระดับน้ำ"
        header-bg-variant="outlined-danger"
      >
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline">ชื่อสถานี: </b-col>
          <b-col md="6" lg="6" class="modal_normal inline">{{
            stations[syncStationIndex].station_name
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline">ตำแหน่ง: </b-col>
          <b-col md="6" lg="6" class="modal_normal inline"
            >Lat: {{ stations[syncStationIndex].location[0] }}, Long:
            {{ stations[syncStationIndex].location[1] }}</b-col
          >
        </b-row>
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline">ระดับน้ำ (m): </b-col>
          <b-col md="6" lg="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[0] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline">แบตเตอรี่ (V): </b-col>
          <b-col md="6" lg="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[1] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline"
            >แผงโซลาเซลล์ (V):
          </b-col>
          <b-col md="6" lg="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[2] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline"
            >อุณหภูมิอุปกรณ์ (C):
          </b-col>
          <b-col md="6" lg="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[3] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline"
            >ระดับสัญญาณ (dBm):
          </b-col>
          <b-col md="6" lg="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[4] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col md="6" lg="4" class="modal_bold inline"
            >สถานะการเชื่อมต่อ:
          </b-col>
          <b-col
            v-if="checkMonitorConnection(syncStationIndex)"
            key="station_time"
            md="6"
            lg="6"
            class="modal_normal inline"
            >เชื่อมต่อ</b-col
          >
          <b-col
            v-else
            key="station_time"
            md="6"
            lg="6"
            class="modal_normal inline"
            >ไม่เชื่อมต่อ</b-col
          >
        </b-row>
      </b-modal>
    </div>

    <div v-if="arrIsNotEmpty(keepGateIcons)">
      <b-modal
        id="modal-gate"
        ref="modal_gate"
        centered
        size="xl"
        hide-footer
        title="Automatic Gate Station Details"
      >
        <!-- 
          First Row
        -->
        <b-row align-h="between">
          <b-col sm="12" md="6" lg="5">
            <b-row>
              <b-col cols="6">
                <div class="my-2 modal_bold">Station Name:</div>
              </b-col>
              <b-col cols="6">
                <div class="my-2 modal_normal">
                  {{ gates[syncGateIndex].station_name }}
                </div>
              </b-col>
            </b-row>
          </b-col>

          <b-col sm="12" md="6" lg="5">
            <b-row>
              <b-col cols="6">
                <div class="my-2 modal_bold">Controller Mode:</div>
              </b-col>
              <b-col cols="6">
                <b-dropdown
                  class="my-1 border border-success"
                  :text="controller_mode"
                  variant="outline-success"
                >
                  <b-dropdown-item @click="controller_mode = 'Manual'"
                    >Manual</b-dropdown-item
                  >
                  <b-dropdown-item @click="controller_mode = 'Advisory'"
                    >Advisory</b-dropdown-item
                  >
                  <b-dropdown-item @click="controller_mode = 'Automatic'"
                    >Automatic</b-dropdown-item
                  >
                </b-dropdown>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <!-- 
          Second Row
        -->
        <b-row align-h="between">
          <b-col sm="12" md="6" lg="5">
            <b-row>
              <b-col md="12" lg="4">
                <div class="my-2 modal_bold">Position:</div>
              </b-col>
              <b-col md="12" lg="8">
                <div class="my-2 modal_normal">
                  Lat: {{ gates[syncGateIndex].location[0] }}, Long:
                  {{ gates[syncGateIndex].location[1] }}
                </div>
              </b-col>
            </b-row>
          </b-col>

          <b-col sm="12" md="6" lg="5">
            <b-row>
              <b-col cols="6">
                <div class="my-2 modal_bold">AI Status:</div>
              </b-col>
              <b-col cols="6">
                <div
                  v-if="
                    controller_mode !== 'Manual' &&
                      syncAdvisory(gates[syncGateIndex].ip).length !== 0
                  "
                  class="my-2 modal_normal"
                >
                  Active
                </div>
                <div v-else class="my-2 modal_normal">N/A</div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <!-- 
          Third Row
        -->
        <b-row class="mt-4" align-h="between">
          <b-col sm="12" md="12" lg="5">
            <div v-if="controller_mode === 'Manual'">
              <b-row
                v-for="(each, index) in gates[syncGateIndex].levels.slice(
                  0,
                  gates[syncGateIndex].gate_amount
                )"
                :key="index"
                class="my-1"
              >
                <b-col cols="3" class="pr-0">
                  <label class="my-2 modal_bold" for="type-number"
                    >Set Gate #{{ index + 1 }}:</label
                  >
                </b-col>
                <b-col cols="2" class="px-0" style="text-align: center;">
                  <label class="my-2 modal_bold" for="type-number">{{
                    gates[syncGateIndex].levels[index]
                  }}</label>
                </b-col>
                <b-col cols="2" class="px-0">
                  <b-form-input
                    id="type-number"
                    v-model="gateLevelForm[index]"
                    class="my-1 modal_normal"
                    type="number"
                    min="0"
                    :max="gates[syncGateIndex].max_level"
                  ></b-form-input>
                </b-col>
                <b-col cols="2" class="">
                  <label class="my-2 modal_bold">cm</label>
                </b-col>
                <b-col cols="2" class="px-0">
                  <b-button
                    v-if="
                      gateLevelForm[index] <= gates[syncGateIndex].max_level &&
                        gateLevelForm[index] >= 0 &&
                        !gates[syncGateIndex].overloads[index] &&
                        gates[syncGateIndex].levels[index] ===
                          gates[syncGateIndex].sensors[index] &&
                        gates[syncGateIndex].mode === 3
                    "
                    squared
                    size="md"
                    class="my-2"
                    variant="success"
                    @click="
                      submitEach(
                        gates[syncGateIndex].levels[index], // before edited
                        gateLevelForm[index], // after edited
                        gates[syncGateIndex].station_name,
                        gates[syncGateIndex].ip,
                        index,
                        3
                      )
                    "
                    >Confirm</b-button
                  >
                  <b-button v-else disabled squared size="md" class="my-2"
                    >Confirm</b-button
                  >
                </b-col>
              </b-row>

              <b-button
                class="mt-2"
                squared
                variant="info"
                @click="
                  submitMode(
                    3, // Manual
                    gates[syncGateIndex].ip
                  )
                "
                >Confirm Mode Change</b-button
              >
            </div>

            <div v-if="controller_mode === 'Advisory'">
              <b-row>
                <b-col cols="2" class="pr-0"></b-col>
                <b-col cols="2" class="px-2"></b-col>
                <b-col cols="1" class="px-2"></b-col>
                <b-col cols="2" class="px-2" style="text-align: center;">
                  <b-img
                    style="width: 40px; height: 40px;"
                    :src="require('../../../assets/ai.svg')"
                    alt="Advisory logo - Icon made by xnimrodx from www.flaticon.com"
                  />
                </b-col>
              </b-row>

              <div
                v-for="(each, index) in gates[syncGateIndex].levels.slice(
                  0,
                  gates[syncGateIndex].gate_amount
                )"
                :key="index"
              >
                <b-row>
                  <b-col cols="2" class="pr-0">
                    <label class="my-2 modal_bold"
                      >Gate #{{ index + 1 }}:</label
                    >
                  </b-col>

                  <b-col cols="2" class="px-2" style="text-align: center;">
                    <label class="my-2 modal_normal">{{ each }}</label>
                  </b-col>

                  <b-col cols="1" class="px-2">
                    <label class="my-2 modal_bold">to</label>
                  </b-col>

                  <b-col cols="2" class="px-2" style="text-align: center;">
                    <b-badge class="my-2" variant="warning">
                      <div
                        v-if="
                          typeof syncAdvisory(gates[syncGateIndex].ip)[
                            index
                          ] === 'number'
                        "
                        class="modal_normal"
                      >
                        {{ syncAdvisory(gates[syncGateIndex].ip)[index] }}
                      </div>
                      <div v-else class="modal_normal">NA</div>
                    </b-badge>
                  </b-col>

                  <b-col cols="1" class="px-2">
                    <label class="my-2 modal_bold">cm</label>
                  </b-col>

                  <b-col cols="3" class="pl-3">
                    <b-button
                      v-if="
                        syncAdvisory(gates[syncGateIndex].ip).length > 0 &&
                          syncAdvisory(gates[syncGateIndex].ip)[index] <=
                            gates[syncGateIndex].max_level &&
                          !gates[syncGateIndex].overloads[index] &&
                          gates[syncGateIndex].levels[index] ===
                            gates[syncGateIndex].sensors[index] &&
                          gates[syncGateIndex].mode === 2
                      "
                      squared
                      size="md"
                      class="my-2"
                      variant="success"
                      @click="
                        submitEach(
                          gates[syncGateIndex].levels[index], // before edited
                          syncAdvisory(gates[syncGateIndex].ip)[index], // after edited
                          gates[syncGateIndex].station_name,
                          gates[syncGateIndex].ip,
                          index,
                          2
                        )
                      "
                      >Confirm</b-button
                    >
                    <b-button v-else disabled squared size="md" class="my-2"
                      >Confirm</b-button
                    >
                  </b-col>
                </b-row>
              </div>

              <b-button
                squared
                size="md"
                class="my-2"
                variant="success"
                @click="
                  submitMode(
                    2, // Advisory
                    gates[syncGateIndex].ip
                  )
                "
                >Confirm Mode Change</b-button
              >

              <!-- <b-img
                style="width: 60px; height: 60px;"
                :src="require('../../../assets/surge.svg')"
                alt="Surge logo"
              /> -->
            </div>

            <div v-if="controller_mode === 'Automatic'">
              <b-row>
                <b-col cols="2" class="pr-0"></b-col>
                <b-col cols="2" class="px-2"></b-col>
                <b-col cols="1" class="px-2"></b-col>
                <b-col cols="2" class="px-2" style="text-align: center;">
                  <b-img
                    style="width: 40px; height: 40px;"
                    :src="require('../../../assets/ai.svg')"
                    alt="Advisory logo"
                  />
                </b-col>
              </b-row>

              <div
                v-for="(each, index) in gates[syncGateIndex].levels.slice(
                  0,
                  gates[syncGateIndex].gate_amount
                )"
                :key="index"
              >
                <b-row>
                  <b-col cols="2" class="pr-0">
                    <label class="my-2 modal_bold"
                      >Gate #{{ index + 1 }}:</label
                    >
                  </b-col>

                  <b-col cols="2" class="px-2" style="text-align: center;">
                    <label class="my-2 modal_normal">{{ each }}</label>
                  </b-col>

                  <b-col cols="1" class="px-2">
                    <label class="my-2 modal_bold">to</label>
                  </b-col>

                  <b-col cols="2" class="px-2" style="text-align: center;">
                    <b-badge class="my-2" variant="warning">
                      <div
                        v-if="
                          typeof syncAdvisory(gates[syncGateIndex].ip)[
                            index
                          ] === 'number'
                        "
                        class="modal_normal"
                      >
                        {{ syncAdvisory(gates[syncGateIndex].ip)[index] }}
                      </div>
                      <div v-else class="modal_normal">NA</div>
                    </b-badge>
                  </b-col>

                  <b-col cols="1" class="px-2">
                    <label class="my-2 modal_bold">cm</label>
                  </b-col>
                </b-row>
              </div>

              <b-button
                squared
                size="md"
                class="my-2"
                variant="success"
                @click="
                  submitMode(
                    1, // Automatic
                    gates[syncGateIndex].ip
                  )
                "
                >Confirm Mode Change</b-button
              >
            </div>

            <p class="pt-4">Updated: {{ gates[syncGateIndex].updated }}</p>
            <div>
              <p v-if="checkControllerConnection(syncGateIndex)">Connected</p>
              <p v-else>Not Connected</p>
            </div>
          </b-col>

          <b-col sm="12" md="12" lg="5">
            <b-row align-h="center">
              <div
                class="d-flex justify-content-around"
                style="width: 380px; padding-left: 35px;"
              >
                <div
                  v-for="(each, index) in gates[syncGateIndex].sensors.slice(
                    0,
                    gates[syncGateIndex].gate_amount
                  )"
                  :key="index"
                >
                  <div style="text-align: center">{{ each }} cm</div>
                </div>
              </div>
            </b-row>
            <b-row align-h="center">
              <chart-mixins
                v-if="renderChart"
                :chart-data="chartGenerator"
                :options="chart_options"
                :height="280"
                :width="400"
              />
              <!-- :plugins="plugins" -->
            </b-row>
            <b-row align-h="center">
              <div
                class="d-flex justify-content-around"
                style="width: 380px; padding-left: 35px;"
              >
                <div
                  v-for="(each, index) in gates[syncGateIndex].overloads.slice(
                    0,
                    gates[syncGateIndex].gate_amount
                  )"
                  :key="index"
                >
                  <div style="text-align: center">
                    <div v-if="!each">
                      <font-awesome-icon style="color: green" icon="circle" />
                      <br />
                      Ready
                    </div>
                    <div v-else>
                      <font-awesome-icon style="color: red" icon="circle" />
                      <br />
                      Fail
                    </div>
                  </div>
                </div>
              </div>
            </b-row>
          </b-col>
        </b-row>
      </b-modal>
    </div>

    <b-jumbotron class="p-0 map_frame">
      <l-map
        style="height: 100%; width: 100%; border-radius: 5px;"
        :zoom="zoom"
        :center="center"
        :options="map_options"
      >
        <l-tile-layer :url="url_selected" :options="{ detectRetina: true }" />

        <div v-if="arrIsNotEmpty(keepStationIcons)">
          <div v-for="(each, index) in stations" :key="index + 's'">
            <l-marker
              :icon="keepStationMarker[index]"
              :lat-lng="each.location"
              @click="toggleStationMarker(index)"
            />
            <l-marker
              :icon="keepStationIcons[index]"
              :lat-lng="each.location"
              @click="toggleStationIcon(index)"
            >
              <l-popup :options="popup_options">
                <b-row>
                  <b-col class="px-0" cols="10">
                    <h6>
                      <strong>{{ each.station_name }}</strong>
                    </h6>
                    <div style="font-size: 15px;">
                      <b class="pr-1">ระดับน้ำ:</b> {{ each.measures[0] }} m.
                      <br />
                      <b class="pr-1">สถานะระดับน้ำ:</b> Warning <br />
                      {{ each.updated | formatTime }}
                    </div>
                  </b-col>
                  <b-link
                    class="detail"
                    v-b-modal.modal-station
                    @click="syncStationPopUp(each, index)"
                  >
                    <font-awesome-icon size="lg" icon="info-circle" />
                  </b-link>
                </b-row>
              </l-popup>
            </l-marker>
          </div>
        </div>

        <div v-if="arrIsNotEmpty(keepGateIcons)">
          <div v-for="(each, index) in gates" :key="index + 'g'">
            <l-marker
              :icon="keepGateMarker[index]"
              :lat-lng="each.location"
              @click="toggleGateMarker(index)"
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
                  <!-- <b-col> -->
                  <b-link
                    v-if="guard(['admin', 'power'])"
                    ref="btnShow"
                    class="detail"
                    @click="syncGatePopUp(each, index)"
                  >
                    <font-awesome-icon size="lg" icon="info-circle" />
                  </b-link>
                  <!-- </b-col> -->
                </b-row>
              </l-popup>
            </l-marker>
          </div>
        </div>
      </l-map>
    </b-jumbotron>

    <!-- <b-card
      border-variant="dark"
      header-border-variant="dark"
      class="map_frame"
    >
      <div slot="header">
        <b-form-group class="float-right m-1">
          <b-form-radio-group
            id="btn-radios-2"
            v-model="url_selected"
            :options="url_options"
            buttons
            button-variant="outline-primary"
            size="sm"
            name="radio-btn-outline"
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <l-map
        class=""
        style="height: 100%; width: 100%"
        :zoom="zoom"
        :center="center"
        :options="{ trackResize: true, doubleClickZoom: false }"
      >
        <l-tile-layer :url="url_selected" />

        <div v-if="arrIsNotEmpty(keepStationIcons)">
          <div v-for="(each, index) in stations" :key="index + 's'">
            <l-marker
              :icon="keepStationMarker[index]"
              :lat-lng="each.location"
              @click="toggleStationMarker(index)"
            />
            <l-marker
              :icon="keepStationIcons[index]"
              :lat-lng="each.location"
              @click="toggleStationIcon(index)"
            >
              <l-popup :options="popup_options">
                <b-row>
                  <b-col class="px-0" cols="10">
                    <h6><strong>{{ each.station_name }}</strong></h6>
                    <div style="font-size: 15px;">
                      <b class="pr-1">ระดับน้ำ:</b> {{ each.measures[0] }} m.
                      <br />
                      <b class="pr-1">สถานะระดับน้ำ:</b> Warning <br />
                      {{ each.updated | formatTime }}
                    </div>
                  </b-col>
                  <b-link
                    class="detail"
                    v-b-modal.modal-station
                    @click="syncStationPopUp(each, index)"
                  >
                    <font-awesome-icon size="lg" icon="info-circle" />
                  </b-link>
                </b-row>
              </l-popup>
            </l-marker>
          </div>
        </div>

        <div v-if="arrIsNotEmpty(keepGateIcons)">
          <div v-for="(each, index) in gates" :key="index + 'g'">
            <l-marker
              :icon="keepGateMarker[index]"
              :lat-lng="each.location"
              @click="toggleGateMarker(index)"
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
                    <h6><strong>{{ each.station_name }}</strong></h6>
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
                  <b-link
                    v-if="guard(['admin', 'power'])"
                    ref="btnShow"
                    class="detail"
                    @click="syncGatePopUp(each, index)"
                  >
                    <font-awesome-icon size="lg" icon="info-circle" />
                  </b-link>
                </b-row>
              </l-popup>
            </l-marker>
          </div>
        </div>
      </l-map>
    </b-card> -->
  </div>
</template>

<script>
import { LMap, LTileLayer, LCircle, LMarker, LPopup } from "vue2-leaflet";

import { mapState, mapGetters } from "vuex";

import ModalMixins from "./Mixins.js";

const L = require("leaflet");

export default {
  name: "Map",

  components: {
    LMap,
    LTileLayer,
    LCircle,
    LMarker,
    LPopup
  },

  mixins: [ModalMixins],

  data() {
    return {
      zoom: 8,
      center: [16.519608, 99.557436],
      map_options: {
        trackResize: true,
        // doubleClickZoom: false,
        zoomControl: false,
        attributionControl: false
      },
      popup_options: {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        autoPan: false
      },

      circle: {
        center: [47.41322, -1.0482],
        radius: 4500,
        color: "red"
      },

      url_selected: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png",
      url_options: [
        {
          text: "ปกติ",
          value: "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}{r}.png"
        },
        {
          text: "ดาวเทียม",
          value:
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        }
      ],

      keepStationMarker: [],
      keepGateMarker: [],

      keepStationIcons: [],
      keepGateIcons: [],

      warningIcon: L.icon({
        iconUrl: require("../../../assets/warning.svg"),
        iconSize: [20, 20],
        iconAnchor: [50, 10]
      }),

      syncGateIndex: 0,
      syncStationIndex: 0,
      gateLevelForm: [],

      advisoryLog: [],
      advisory_levels: []
    };
  },

  computed: {
    ...mapGetters("MonitorControl", ["getAdvisoryByStationId"]),
    ...mapGetters(["getUserAccLevel", "guard"]),
    ...mapState(["selected_station"])
  },

  watch: {
    stations: function(newVal) {
      if (newVal || this.arrIsNotEmpty(this.stations)) {
        this.generateKeepStationIcon();
      }
    },

    gates: function(newVal) {
      if (newVal || this.arrIsNotEmpty(this.gates)) {
        this.generateKeepGateIcon();
      }
    }
  },

  methods: {
    toggleStationIcon(index) {
      let currVal = [...this.keepStationIcons][index];
      currVal.options.iconUrl = currVal.options.iconUrl.includes("plus")
        ? require("../../../assets/minus.svg")
        : require("../../../assets/plus.svg");

      this.$set(this.keepStationIcons, index, currVal);
    },
    toggleGateIcon(index) {
      let currVal = [...this.keepGateIcons][index];
      currVal.options.iconUrl = currVal.options.iconUrl.includes("plus")
        ? require("../../../assets/minus.svg")
        : require("../../../assets/plus.svg");

      this.$set(this.keepGateIcons, index, currVal);
    },

    toggleStationMarker(index) {
      let currSize = this.keepStationMarker[index].options.iconSize[0];

      for (let i = 0, len = this.keepStationMarker.length; i < len; i++) {
        if (index === i && currSize === 40) {
          this.$set(
            this.keepStationMarker,
            i,
            L.icon({
              iconUrl: require("../../../assets/station-icon.svg"),
              iconSize: [52, 52],
              iconAnchor: [52, 52]
            })
          );
        } else {
          this.$set(
            this.keepStationMarker,
            i,
            L.icon({
              iconUrl: require("../../../assets/station-icon.svg"),
              iconSize: [40, 40],
              iconAnchor: [40, 40]
            })
          );
        }
      }
    },
    toggleGateMarker(index) {
      let currSize = this.keepGateMarker[index].options.iconSize[0];

      for (let i = 0, len = this.keepGateMarker.length; i < len; i++) {
        if (index === i && currSize === 40) {
          this.$set(
            this.keepGateMarker,
            i,
            L.icon({
              iconUrl: require("../../../assets/gate-icon1.svg"),
              iconSize: [52, 52],
              iconAnchor: [52, 52]
            })
          );
        } else {
          this.$set(
            this.keepGateMarker,
            i,
            L.icon({
              iconUrl: require("../../../assets/gate-icon1.svg"),
              iconSize: [40, 40],
              iconAnchor: [40, 40]
            })
          );
        }
      }
    },

    generateKeepStationIcon() {
      for (let i = 0, len = this.stations.length; i < len; i++) {
        if (this.keepStationIcons[i]) {
          let currVal = [...this.keepStationIcons][i];
          currVal.options.iconUrl = currVal.options.iconUrl.includes("plus")
            ? require("../../../assets/plus.svg")
            : require("../../../assets/minus.svg");

          this.$set(this.keepStationIcons, i, currVal);
        } else {
          this.$set(
            this.keepStationIcons,
            i,
            L.icon({
              iconUrl: require("../../../assets/plus.svg"),
              iconSize: [20, 20],
              popupAnchor: [95, 140]
            })
          );
        }

        this.$set(
          this.keepStationMarker,
          i,
          L.icon({
            iconUrl: require("../../../assets/station-icon.svg"),
            iconSize: [40, 40],
            iconAnchor: [40, 40]
          })
        );
      }
    },
    generateKeepGateIcon() {
      for (let i = 0, len = this.gates.length; i < len; i++) {
        if (this.keepGateIcons[i]) {
          let currVal = [...this.keepGateIcons][i];
          currVal.options.iconUrl = currVal.options.iconUrl.includes("plus")
            ? require("../../../assets/plus.svg")
            : require("../../../assets/minus.svg");

          this.$set(this.keepGateIcons, i, currVal);
        } else {
          this.$set(
            this.keepGateIcons,
            i,
            L.icon({
              iconUrl: require("../../../assets/plus.svg"),
              iconSize: [20, 20],
              popupAnchor: [95, 140]
            })
          );
        }

        this.$set(
          this.keepGateMarker,
          i,
          L.icon({
            iconUrl: require("../../../assets/gate-icon1.svg"),
            iconSize: [40, 40],
            iconAnchor: [40, 40]
          })
        );
      }
    },

    selectControllerMode(val) {
      if (val === 3) {
        this.controller_mode = "Manual";
      } else if (val === 2) {
        this.controller_mode = "Advisory";
      } else if (val === 1) {
        this.controller_mode = "Automatic";
      }
    },

    syncStationPopUp(data, index) {
      this.syncStationIndex = index;
    },
    syncGatePopUp(data, index) {
      this.syncGateIndex = index;
      this.gateLevelForm = [...Array(data.gate_amount)].map(() => 0);

      this.selectControllerMode(data.mode);
      this.$root.$emit("bv::show::modal", "modal-gate", "#btnShow");
    },

    arrIsNotEmpty(arr) {
      return Array.isArray(arr) && arr.length > 0;
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
.card-header {
  padding: 0rem;
}
.card-body {
  padding: 0rem;
}

.modal_bold {
  font-size: 18px;
  font-weight: 600;
}
.modal_normal {
  font-size: 18px;
  font-weight: 400;
}
</style>
