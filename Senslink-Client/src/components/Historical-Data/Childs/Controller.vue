<template>
  <div class="controller">
    <b-modal id="modal-fields-con" ref="modal-fields-con" size="sm">
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
          :options="getActiveGateName"
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
          <b-td colspan="2">ประตู 1</b-td>
          <b-td colspan="2">ประตู 2</b-td>
          <b-td colspan="2">ประตู 3</b-td>
          <b-td colspan="2">ประตู 4</b-td>
          <b-td colspan="2">ประตู 5</b-td>
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
import moment from "moment";
import { parse } from "json2csv";

import Mixins from "./Mixins";
import { mapState, mapGetters } from "vuex";

import zipcelx from "zipcelx";

const parseOverload = status => {
  return !status ? "ปกติ" : "มีปัญหา";
};

const overloadVariant = overloads => {
  let variant = {};

  overloads.forEach((each, index) => {
    variant[`s${index + 1}`] = each === 1 ? "danger" : "success";
  });

  return variant;
};

export default {
  name: "Controller",

  mixins: [Mixins],

  data() {
    return {
      table_fields: [
        { key: "timestamp", label: "เวลา", sortable: true },
        { key: "station", label: "สถานี" },
        { key: "g1", label: "ระดับน้ำ (cm)" },
        { key: "s1", label: "สถานะ" },
        { key: "g2", label: "ระดับน้ำ (cm)" },
        { key: "s2", label: "สถานะ" },
        { key: "g3", label: "ระดับน้ำ (cm)" },
        { key: "s3", label: "สถานะ" },
        { key: "g4", label: "ระดับน้ำ (cm)" },
        { key: "s4", label: "สถานะ" },
        { key: "g5", label: "ระดับน้ำ (cm)" },
        { key: "s5", label: "สถานะ" }
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
        { text: "Date", value: "date" },
        { text: "Time", value: "time" },
        { text: "Sensor", value: "sensor" },
        { text: "Status", value: "status" }
      ],
      filename: "",

      first_timestamp: ""
    };
  },

  computed: {
    ...mapGetters("SystemSetting", ["getActiveGateName"]),
    ...mapState(["socket"]),

    activeGateName() {
      return this.getActiveGateName || [];
    },

    tableGenerator() {
      let originalData = [...this.data];
      let parsedData = [];

      for (let i = 0, len = originalData.length; i < len; i++) {
        let [timestamp, station] = originalData[i].metas;
        let [sensors, overloads] = originalData[i].measures;

        let temp = {};
        temp.timestamp = this.formatTimestamp(timestamp);
        temp.station = station;
        temp._cellVariants = overloadVariant(overloads);

        for (let j = 0, len = 4; j < len; j++) {
          temp[`g${j + 1}`] = sensors[j];
          temp[`s${j + 1}`] = parseOverload(overloads[j]);
        }

        parsedData.push(temp);
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

    this.socket.on("gates_db", data => {
      this.data.unshift(data);
    });
  },

  methods: {
    selectStation(val) {
      if (val) {
        this.station_placeholder = val;
        this.station_selected = val;
      } else {
        this.station_placeholder = "All";
        this.station_selected = val;
      }
    },

    selectIntervalDivider(val) {
      this.interval_selected = val;

      if (val === 5) {
        this.interval_placeholder = "5 mins";
      } else if (val === 10) {
        this.interval_placeholder = "10 mins";
      } else if (val === 15) {
        this.interval_placeholder = "15 mins";
      } else if (val === 20) {
        this.interval_placeholder = "20 mins";
      } else if (val === 30) {
        this.interval_placeholder = "30 mins";
      } else if (val === 60) {
        this.interval_placeholder = "1 hr";
      } else if (val === 120) {
        this.interval_placeholder = "2 hrs";
      } else if (val === 180) {
        this.interval_placeholder = "3 hrs";
      } else if (val === 240) {
        this.interval_placeholder = "4 hrs";
      } else if (val === 300) {
        this.interval_placeholder = "5 hrs";
      } else if (val === 360) {
        this.interval_placeholder = "6 hrs";
      }
    },

    CSV() {
      const FILTERED_DATA = [...this.filterTable];

      let headers = [
        "Timestamp",
        "Gate 1 (cm)",
        "Status",
        "Gate 2 (cm)",
        "Status",
        "Gate 3 (cm)",
        "Status",
        "Gate 4 (cm)",
        "Status",
        "Gate 5 (cm)"
      ];

      let values = [];
      for (let i = 0, len = FILTERED_DATA.length; i < len; i++) {
        let each = FILTERED_DATA[i];

        values.push([
          `${each.date} ${each.time}`,
          each["g1"],
          each["s1"],
          each["g2"],
          each["s2"],
          each["g3"],
          each["s3"],
          each["g4"],
          each["s4"],
          each["g5"],
          each["s5"]
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

      this.$refs["modal-fields-con"].hide();
    },

    XLSX() {
      const FILTERED_DATA = [...this.filterTable];

      let headers = [
        { value: "Timestamp", type: "string" },
        { value: "Gate 1 (cm)", type: "string" },
        { value: "Status", type: "string" },
        { value: "Gate 2 (cm)", type: "string" },
        { value: "Status", type: "string" },
        { value: "Gate 3 (cm)", type: "string" },
        { value: "Status", type: "string" },
        { value: "Gate 4 (cm)", type: "string" },
        { value: "Status", type: "string" },
        { value: "Gate 5 (cm)", type: "string" },
        { value: "Status", type: "string" }
      ];

      let values = [];
      for (let i = 0, len = FILTERED_DATA.length; i < len; i++) {
        let each = FILTERED_DATA[i];

        values.push([
          { value: `${each.date} ${each.time}`, type: "string" },
          { value: each["g1"], type: "number" },
          { value: each["s1"], type: "string" },
          { value: each["g2"], type: "number" },
          { value: each["s2"], type: "string" },
          { value: each["g3"], type: "number" },
          { value: each["s3"], type: "string" },
          { value: each["g4"], type: "number" },
          { value: each["s4"], type: "string" },
          { value: each["g5"], type: "number" },
          { value: each["s5"], type: "string" }
        ]);
      }

      zipcelx({
        filename: this.filename || this.station_selected,
        sheet: {
          data: [headers, ...values]
        }
      });

      this.$refs["modal-fields-con"].hide();
    },

    submitSearch() {
      this.table_busy = true;

      let bodyFormData = new FormData();
      bodyFormData.append("station", this.station_selected);
      bodyFormData.append("from", this.date_from);
      bodyFormData.append("to", this.date_to);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/QueryController/get`,
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
