<template>
  <div class="monitor">
    {{ activeStationName }}
    <b-modal id="modal-fields-mon" ref="modal-fields-mon" size="sm">
      <div slot="modal-title"><strong>ส่งออกข้อมูล</strong></div>

      <div>
        <b-form-group>
          <b-form-checkbox-group
            v-model="fields_selected"
            :options="fields_options"
            switches
            stacked
          ></b-form-checkbox-group>
        </b-form-group>

        <b-form-input
          v-model="filename"
          placeholder="ตั้งชื่อไฟล์"
        ></b-form-input>
      </div>

      <div slot="modal-footer" class="w-100">
        <b-button
          variant="primary"
          size="sm"
          class="float-right"
          @click="CSV()"
        >
          CSV
        </b-button>
        <b-button
          variant="success"
          size="sm"
          class="float-right mx-2"
          @click="XLSX()"
        >
          XLSX
        </b-button>
      </div>
    </b-modal>

    <b-row class="pb-3">
      <div class="m-2" sm="12" md="6">
        <b-form-select
          class="w-100"
          v-model="station_selected"
          :options="activeStationName"
        ></b-form-select>
      </div>

      <div class="m-2" sm="12" md="6">
        <b-form-select
          v-model="interval_selected"
          :options="interval_options"
        ></b-form-select>
      </div>

      <div class="m-2">
        <b-row align-h="center">
          <b-col class="pr-0" sm="12" md="2" lg="2">
            <label
              class="m-md-1"
              for="date_from"
              style="font-size: 20px; font-weight: 400;"
              >วันที่</label
            >
          </b-col>
          <b-col class="px-lg-0" sm="12" md="5" lg="5">
            <b-form-input
              id="date_from"
              v-model="date_from"
              type="date"
            ></b-form-input>
          </b-col>
          <b-col class="pl-lg-0" sm="12" md="5" lg="5">
            <b-form-input
              id="date_to"
              v-model="date_to"
              type="date"
            ></b-form-input>
          </b-col>
        </b-row>
      </div>

      <div class="m-2">
        <div v-if="station_selected">
          <b-button @click="submitSearch()" variant="primary">ค้นหา</b-button>
        </div>
        <div v-else v-b-tooltip.hover title="ต้องเลือกชื่อสถานีก่อน">
          <b-button disabled>ค้นหา</b-button>
        </div>
      </div>

      <div class="m-2">
        <b-button v-b-modal.modal-fields-mon variant="warning"
          >ส่งออกข้อมูล</b-button
        >
      </div>
    </b-row>

    <b-table
      hover
      small
      bordered
      responsive="sm"
      :busy="table_busy"
      :items="filterTable"
      :fields="table_fields"
      :current-page="currentPage"
      :per-page="perPage"
    >
      <template slot="thead-top">
        <b-tr>
          <b-td colspan="2">ข้อมูลทั่วไป</b-td>
          <b-td colspan="5">ข้อมูลจากเครื่องโทรมาตร</b-td>
        </b-tr>
      </template>

      <template slot="table-caption">
        {{ tableCaption }}
      </template>

      <div slot="table-busy" class="text-center text-danger my-2">
        <b-spinner class="align-middle"></b-spinner>
        <strong> Loading...</strong>
      </div>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <div class="overflow-auto">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            class="my-0"
          ></b-pagination>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { json2excel } from "js2excel";
import { parse } from "json2csv";
import moment from "moment";

import Mixins from "./Mixins";
import { mapState, mapGetters } from "vuex";

import { resolve } from "url";
import zipcelx from "zipcelx";

export default {
  name: "Monitor",

  mixins: [Mixins],

  data() {
    return {
      table_fields: [
        { key: "timestamp", label: "เวลา", sortable: true },
        { key: "station_name", label: "ชื่อสถานี" },
        { key: "water", label: "ระดับน้ำ (m)" },
        { key: "battery", label: "แบตเตอรี่ (V)" },
        { key: "temp", label: "อุณหภูมิอุปกรณ์ (C)" },
        { key: "solar", label: "พลังงานแสงอาทิตย์ (V)" },
        { key: "signal", label: "ความแรงสัญญาณ (dBm)" }
      ],
      currentPage: 1,
      totalRows: 1,
      perPage: 18,

      station_selected: "",
      date_from: "",
      date_to: "",
      interval_selected: "",
      interval_options: [
        { value: "", text: "ความถี่การแสดงผล" },
        { value: 5, text: "5 นาที" },
        { value: 10, text: "10 นาที" },
        { value: 15, text: "15 นาที" },
        { value: 20, text: "20 นาที" },
        { value: 30, text: "30 นาที" },
        { value: 60, text: "1 ชม" },
        { value: 120, text: "2 ชม" },
        { value: 180, text: "3 ชม" },
        { value: 240, text: "4 ชม" },
        { value: 300, text: "5 ชม" },
        { value: 360, text: "6 ชม" }
      ],

      data: "",
      table_busy: false,

      fields_selected: [], // Must be an array reference!
      fields_options: [
        { text: "ระดับน้ำ", value: "water" },
        { text: "แบตเตอรี่", value: "battery" },
        { text: "อุณหภูมิอุปกรณ์", value: "temp" },
        { text: "พลังงานแสง", value: "solar" },
        { text: "ความแรงสัญญาณ", value: "signal" }
      ],
      filename: "",

      first_timestamp: ""
    };
  },

  computed: {
    ...mapGetters("SystemSetting", ["getActiveStationName"]),
    ...mapState(["socket"]),

    activeStationName() {
      return this.getActiveStationName || [];
    },

    tableGenerator() {
      let originalData = [...this.data];
      let parsedData = [];

      for (let i = 0, len = originalData.length; i < len; i++) {
        // let measures = originalData[i].measures.split('/');
        // let timestamp = moment(originalData[i].time).add(7, 'hours').toISOString();
        let [timestamp, station_name] = originalData[i].metas;
        let [water, battery, solar, temp, signal] = originalData[i].measures;

        parsedData.push({
          timestamp: this.formatTimestamp(timestamp),
          station_name: station_name,
          water: water,
          battery: battery,
          temp: temp,
          solar: solar,
          signal: signal
        });
      }

      return parsedData;
    },

    filterTable() {
      return this.interval_selected !== ""
        ? [...this.tableGenerator].filter(
            (_, index) => index % (this.interval_selected / 5) === 0
          )
        : [];
    },

    tableCaption() {
      let start =
        Array.isArray(this.filterTable) && this.filterTable.length > 0
          ? (this.currentPage - 1) * this.perPage || 1
          : 0;
      let end =
        this.filterTable.length > this.perPage * this.currentPage
          ? this.perPage * this.currentPage
          : this.filterTable.length;
      let all = this.filterTable.length;

      return `แสดงผล ${start} ถึง ${end} จากทั้งหมด ${all}`;
    }
  },

  watch: {
    filterTable: function(newVal) {
      this.totalRows = newVal.length;
    }
  },

  mounted() {
    this.totalRows = this.filterTable.length;

    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.fields_selected = [];
        this.filename = "";
      });
    });
  },

  methods: {
    CSV() {
      const FILTERED_DATA = [...this.filterTable];

      let headers = [
        "Timestamp",
        ...this.fields_selected.map(each => {
          return `${this.station_selected} ${this.parseUnit(each)}`;
        })
      ];

      let values = [];
      for (let i = 0, len = FILTERED_DATA.length; i < len; i++) {
        let each = FILTERED_DATA[i];

        values.push([
          `${each.date} ${each.time}`,
          ...this.fields_selected.map(key => {
            return each[key];
          })
        ]);
      }

      try {
        let csv = parse(values, { headers });
        let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, this.filename || this.station_selected); // IE 10+
        } else {
          let link = document.createElement("a");
          if (link.download !== undefined) {
            let url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute(
              "download",
              this.filename || this.station_selected
            );
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      } catch (err) {
        console.log(err);
      }

      this.$refs["modal-fields-mon"].hide();
    },

    XLSX() {
      const FILTERED_DATA = [...this.filterTable];

      let headers = [
        { value: "Timestamp", type: "string" },
        ...this.fields_selected.map(each => {
          return {
            value: `${this.station_selected} ${this.parseUnit(each)}`,
            type: "string"
          };
        })
      ];

      let values = [];
      for (let i = 0, len = FILTERED_DATA.length; i < len; i++) {
        let each = FILTERED_DATA[i];

        values.push([
          { value: `${each.date} ${each.time}`, type: "string" },
          ...this.fields_selected.map(key => {
            return { value: each[key], type: "number" };
          })
        ]);
      }

      zipcelx({
        filename: this.filename || this.station_selected,
        sheet: {
          data: [headers, ...values]
        }
      });

      this.$refs["modal-fields-mon"].hide();
    },

    submitSearch() {
      this.table_busy = true;

      let bodyFormData = new FormData();
      bodyFormData.append("station", this.station_selected);
      bodyFormData.append("from", this.date_from);
      bodyFormData.append("to", this.date_to);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/QueryMonitor/get`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.interval_selected = 5;
          this.data = resp.data;
          this.table_busy = false;
        })
        .catch(err => {
          this.table_busy = false;
        });
    }
  }
};
</script>

<style scoped>
.scrollable-menu {
  height: auto;
  max-height: 200px;
  overflow-x: hidden;
}
</style>
