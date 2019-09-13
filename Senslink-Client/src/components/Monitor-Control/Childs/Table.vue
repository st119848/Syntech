<template>
  <div class="table">
    <div v-if="arrIsNotEmpty(stationsTableGenerator)">
      <b-modal
        id="modal-stationTable"
        ref="modal_stationTable"
        centered
        size="lg"
        hide-footer
        title="สถานีวัดระดับน้ำ"
      >
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline">ชื่อสถานี: </b-col>
          <b-col cols="6" class="modal_normal inline">{{
            stations[syncStationIndex].station_name
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline">ตำแหน่ง: </b-col>
          <b-col cols="6" class="modal_normal inline"
            >Lat: {{ stations[syncStationIndex].location[0] }}, Long:
            {{ stations[syncStationIndex].location[1] }}</b-col
          >
        </b-row>
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline">ระดับน้ำ (m): </b-col>
          <b-col cols="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[0] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline">แบตเตอรี่ (V): </b-col>
          <b-col cols="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[1] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline">พลังงานแสง (V): </b-col>
          <b-col cols="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[2] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline"
            >อุณหภูมิอุปกรณ์ (C):
          </b-col>
          <b-col cols="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[3] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline">ระดับสัญญาณ (dBm): </b-col>
          <b-col cols="6" class="modal_normal inline">{{
            stations[syncStationIndex].measures[4] | fixedDigit
          }}</b-col>
        </b-row>
        <b-row class="my-2">
          <b-col cols="4" class="modal_bold inline">สถานะการเชื่อมต่อ: </b-col>
          <b-col
            v-if="checkMonitorConnection(syncStationIndex)"
            key="station_time"
            cols="6"
            class="modal_normal inline"
            >เชื่อมต่อ</b-col
          >
          <b-col v-else key="station_time" cols="6" class="modal_normal inline"
            >ไม่เชื่อมต่อ</b-col
          >
        </b-row>
      </b-modal>
    </div>

    <div v-if="arrIsNotEmpty(gatesTableGenerator)">
      <b-modal
        id="modal-gateTable"
        ref="modal_gateTable"
        centered
        size="xl"
        hide-footer
        title="ประตูน้ำ"
      >
        <!-- 
          First Row
        -->
        <b-row align-h="between">
          <b-col sm="12" md="6" lg="5">
            <div class="my-2">
              <div class="modal_bold">ชื่อสถานี:</div>
              <div class="modal_normal">
                {{ gates[syncGateIndex].station_name }}
              </div>
            </div>
          </b-col>

          <b-col sm="12" md="6" lg="5">
            <b-row>
              <b-col cols="6">
                <div class="my-2 modal_bold">โหมดการสั่งการ:</div>
              </b-col>
              <b-col cols="6">
                <b-dropdown
                  class="my-2"
                  :text="controller_mode"
                  variant="success"
                >
                  <b-dropdown-item @click="controller_mode = 'Manual'"
                    >ควบคุมโดยผู้ใช้</b-dropdown-item
                  >
                  <b-dropdown-item @click="controller_mode = 'Advisory'"
                    >แนะนำ</b-dropdown-item
                  >
                  <b-dropdown-item @click="controller_mode = 'Automatic'"
                    >อัตโนมัติ</b-dropdown-item
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
            <div class="my-2">
              <div class="modal_bold">ตำแหน่ง:</div>
              <div class="modal_normal">
                Lat: {{ gates[syncGateIndex].location[0] }}, Long:
                {{ gates[syncGateIndex].location[1] }}
              </div>
            </div>
          </b-col>

          <b-col sm="12" md="6" lg="5">
            <b-row>
              <b-col cols="6">
                <div class="my-2 modal_bold">สถานะระบบอัตโนมัติ:</div>
              </b-col>
              <b-col cols="6">
                <div
                  v-if="
                    controller_mode !== 'Manual' &&
                      syncAdvisory(gates[syncGateIndex].ip).length !== 0
                  "
                  class="my-2 modal_normal"
                >
                  พร้อม
                </div>
                <div v-else class="my-2 modal_normal">ไม่พร้อม</div>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <!-- 
          Third Row
        -->
        <b-row class="mt-4" align-h="between">
          <b-col sm="12" md="12" lg="6">
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
                        index
                      )
                    "
                    >สั่งการ</b-button
                  >
                  <!-- <b-spinner v-else-if="gates[syncGateIndex].levels[index] !== gates[syncGateIndex].sensors[index]" class="m-5" label="Busy"></b-spinner> -->
                  <b-button v-else disabled squared size="md" class="my-2"
                    >สั่งการ</b-button
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
                >เปลี่ยนเป็นโหมดนี้</b-button
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
                          index
                        )
                      "
                      >สั่งการ</b-button
                    >
                    <b-button v-else disabled squared size="md" class="my-2"
                      >สั่งการ</b-button
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
                >เปลี่ยนเป็นโหมดนี้</b-button
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
                >เปลี่ยนเป็นโหมดนี้</b-button
              >
            </div>

            <p class="pt-4">อัปเดต: {{ gates[syncGateIndex].updated }}</p>
            <div>
              <p v-if="checkControllerConnection(syncGateIndex)">เชื่อมต่อ</p>
              <p v-else>ไม่เชื่อมต่อ</p>
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

    <b-card
      border-variant="dark"
      header-border-variant="dark"
      class="container_station"
    >
      <div slot="header" style="font-size: 21px;">
        <b-row align-h="between">
          <b-col sm="12" md="6" lg="2">
            <b-dropdown
              variant="primary"
              class="border w-100"
              :text="table_selected"
            >
              <b-dropdown-item @click="selectTable(1, 0)"
                >สถานีวัดระดับน้ำ</b-dropdown-item
              >
              <b-dropdown-item @click="selectTable(0, 1)"
                >ประตูน้ำ</b-dropdown-item
              >
            </b-dropdown>
          </b-col>

          <b-col sm="12" md="6" lg="3">
            <b-form-group
              v-show="table_selected === 'สถานีวัดระดับน้ำ'"
              class="mb-0"
            >
              <b-input-group>
                <b-form-input
                  v-model="filterStation"
                  placeholder="พิมพ์เพื่อค้นหา"
                ></b-form-input>
                <b-input-group-append>
                  <b-button
                    :disabled="!filterStation"
                    @click="filterStation = ''"
                    >ค้นหา</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
            <b-form-group v-show="table_selected === 'ประตูน้ำ'" class="mb-0">
              <b-input-group>
                <b-form-input
                  v-model="filterGate"
                  placeholder="Type to Search Gate"
                ></b-form-input>
                <b-input-group-append>
                  <b-button :disabled="!filterGate" @click="filterGate = ''"
                    >Clear</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
      </div>

      <div class="m-3">
        <div v-if="arrIsNotEmpty(stationsTableGenerator)" v-show="showStation">
          <b-table
            hover
            responsive="sm"
            :busy="!arrIsNotEmpty(stations)"
            :filter="filterStation"
            :items="stationsTableGenerator"
            :fields="stations_table_fields"
          >
            <template slot="detail" slot-scope="row">
              <b-link class="mr-2" @click="syncStationPopUp(row.item)">
                <font-awesome-icon size="lg" icon="info-circle" />
              </b-link>
            </template>

            <div slot="table-busy" class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong> Waiting...</strong>
            </div>

            <template slot="position" slot-scope="row">
              {{ row.item.position[0].toFixed(5) }},
              {{ row.item.position[1].toFixed(5) }}
            </template>

            <template slot="status" slot-scope="row">
              <div v-if="row.item.status === 'Normal'" style="color: green">
                {{ row.item.status }}
              </div>
              <div
                v-else-if="row.item.status === 'Notification'"
                style="color: #DAA520"
              >
                {{ row.item.status }}
              </div>
              <div
                v-else-if="row.item.status === 'Warning'"
                style="color: orange"
              >
                {{ row.item.status }}
              </div>
              <div v-else-if="row.item.status === 'Hazard'" style="color: red">
                {{ row.item.status }}
              </div>
            </template>
          </b-table>
        </div>

        <div v-if="arrIsNotEmpty(gatesTableGenerator)" v-show="showGate">
          <b-table
            hover
            responsive="sm"
            :busy="!arrIsNotEmpty(gates)"
            :filter="filterGate"
            :items="gatesTableGenerator"
            :fields="gates_table_fields"
          >
            <template
              v-if="guard(['admin', 'power'])"
              slot="detail"
              slot-scope="row"
            >
              <b-link class="mr-2" @click="syncGatePopUp(row.item)">
                <font-awesome-icon size="lg" icon="info-circle" />
              </b-link>
            </template>

            <div slot="table-busy" class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong> Waiting...</strong>
            </div>

            <template slot="position" slot-scope="row">
              {{ row.item.position[0].toFixed(5) }},
              {{ row.item.position[1].toFixed(5) }}
            </template>

            <template slot="status" slot-scope="row">
              <div v-if="row.item.status === 'Ready'" style="color: green">
                {{ row.item.status }}
              </div>
              <div
                v-else-if="row.item.status === 'Processing'"
                style="color: orange"
              >
                {{ row.item.status }}
              </div>
              <div
                v-else-if="row.item.status === 'Defective'"
                style="color: orange"
              >
                {{ row.item.status }}
              </div>
            </template>

            <template slot="mode" slot-scope="row">
              <div v-if="row.item.mode === 3">
                Manual
              </div>
              <div v-else-if="row.item.mode === 2">
                Advisory
              </div>
              <div v-else-if="row.item.mode === 1">
                Automatic
              </div>
            </template>

            <template slot="ai" slot-scope="row">
              <div v-if="checkIfAiActive(row.item.ip)" style="color: green">
                Active
              </div>
              <div v-else style="color: gray">N/A</div>
            </template>
          </b-table>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>
import ModalMixins from "./Mixins.js";

import { mapGetters } from "vuex";

export default {
  name: "Table",

  filters: {
    toNumber: function(str) {
      if (Number(str)) {
        return Number(str).toFixed(2);
      }
    }
  },

  mixins: [ModalMixins],

  data() {
    return {
      table_selected: "สถานีวัดระดับน้ำ",
      gate_updates: [],

      showStation: true,
      showGate: false,

      gates_table_fields: [
        { key: "detail", label: "" },
        { key: "name", label: "ชื่อสถานี" },
        { key: "position", label: "ตำแหน่ง" },
        { key: "sensors", label: "ระดับประตู (cm)" },
        { key: "overloads", label: "สถานะ" },
        { key: "mode", label: "โหมด" },
        { key: "ai", label: "เอไอ" },
        { key: "timestamp", label: "อัปเดต" }
      ],

      stations_table_fields: [
        { key: "detail", label: "" },
        { key: "name", label: "ชื่อสถานี" },
        { key: "position", label: "ตำแหน่ง" },
        { key: "water", label: "ระดับน้ำ (m)" },
        { key: "status", label: "สถานะ" },
        { key: "timestamp", label: "อัปเดต" }
      ],

      filterGate: null,
      filterStation: null,

      syncGateIndex: 0,
      syncStationIndex: 0,
      gateLevelForm: [],

      advisoryLog: []
    };
  },

  computed: {
    ...mapGetters("MonitorControl", ["getAdvisoryByStationId"]),
    ...mapGetters(["getUserAccLevel", "guard"]),

    stationsTableGenerator() {
      let tableJson = [];
      let station = [...this.stations];

      const thresholdStatus = (water_level, thresholds) => {
        let [hazard_min, hazard_max] = [thresholds[0], thresholds[1]];
        let [warning_min, warning_max] = [thresholds[2], thresholds[3]];
        let [notif_min, notif_max] = [thresholds[4], thresholds[5]];

        if (water_level <= hazard_min || water_level >= hazard_max) {
          return "Hazard";
        } else if (water_level <= warning_min || water_level >= warning_max) {
          return "Warning";
        } else if (water_level <= notif_min || water_level >= notif_max) {
          return "Notification";
        } else {
          return "Normal";
        }
      };

      for (let i = 0, len = station.length; i < len; i++) {
        tableJson.push({
          index: i,
          name: station[i].station_name,
          position: station[i].location,
          water: station[i].measures[0],
          battery: station[i].measures[1].toFixed(2),
          solar: station[i].measures[2],
          temp: station[i].measures[3],
          signal: station[i].measures[4],
          status: thresholdStatus(
            station[i].measures[0],
            station[i].thresholds
          ),
          timestamp: this.formatTime(station[i].updated)
        });
      }

      return tableJson;
    },

    gatesTableGenerator() {
      let tableJson = [];
      let gate = [...this.gates];

      for (let i = 0, len = gate.length; i < len; i++) {
        let overloads_status = gate[i].overloads.map(each => {
          return each === 0 ? "Ready" : "Fail";
        });

        tableJson.push({
          index: i,
          name: gate[i].station_name,
          position: gate[i].location,
          levels: gate[i].levels.slice(0, gate[i].gate_amount),
          sensors: gate[i].sensors.slice(0, gate[i].gate_amount),
          overloads: overloads_status.slice(0, gate[i].gate_amount),
          mode: gate[i].mode,
          ip: gate[i].ip,
          max_level: gate[i].max_level,
          gate_amount: gate[i].gate_amount,
          timestamp: this.formatTime(gate[i].updated)
        });
      }

      return tableJson;
    }
  },

  methods: {
    selectTable(v1, v2) {
      if (v1) this.table_selected = "สถานีวัดระดับน้ำ";
      if (v2) this.table_selected = "ประตูน้ำ";
      this.showStation = v1;
      this.showGate = v2;
    },

    syncStationPopUp(data) {
      this.syncStationIndex = data.index;

      this.$root.$emit("bv::show::modal", "modal-stationTable", "#btnShow");
    },

    syncGatePopUp(data) {
      this.syncGateIndex = data.index;
      this.gateLevelForm = [...Array(data.gate_amount)].map(() => 0);

      this.selectControllerMode(data.mode);

      this.$root.$emit("bv::show::modal", "modal-gateTable", "#btnShow");
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

    checkIfAiActive(gate_ip) {
      return this.syncAdvisory(gate_ip).length !== 0 ? true : false;
    }
  }
};
</script>

<style scoped>
.modal_bold {
  font-size: 18px;
  font-weight: 600;
}
.modal_normal {
  font-size: 18px;
  font-weight: 400;
}
</style>
