<template>
  <div class="gates_update">
    <b-modal id="modal-fields-gu" ref="modal-fields-gu" size="sm">
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
          placeholder="FIle name without extension"
        ></b-form-input>
      </div>

      <div slot="modal-footer" class="w-100">
        <b-button
          variant="primary"
          size="md"
          class="float-right"
          @click="CSV()"
        >
          CSV
        </b-button>
        <b-button
          variant="success"
          size="md"
          class="float-right mx-2"
          @click="XLSX()"
        >
          XLSX
        </b-button>
      </div>
    </b-modal>

    <b-row class="mb-3">
      <b-col sm="12" md="12" lg="5">
        <b-row>
          <b-col sm="12" md="8" lg="4">
            <b-form-select
              class="mx-2"
              v-model="day_selected"
              :options="day_options"
            />
          </b-col>
          <b-col sm="12" md="8" lg="4">
            <b-form-select
              class="mx-2"
              v-model="month_selected"
              :options="month_options"
            />
          </b-col>
          <b-col sm="12" md="8" lg="4">
            <b-form-select
              class="mx-2"
              v-model="year_selected"
              :options="year_options"
            />
          </b-col>
        </b-row>
      </b-col>

      <b-col sm="12" md="12" lg="5">
        <b-row>
          <b-col sm="12" md="8" lg="4">
            <b-form-select
              class="mx-2"
              v-model="user_selected"
              :options="userOptions"
            />
          </b-col>
          <b-col sm="12" md="8" lg="4">
            <b-form-select
              class="mx-2"
              v-model="station_selected"
              :options="stationOptions"
            />
          </b-col>
          <b-col sm="12" md="8" lg="4">
            <b-form-select
              class="mx-2"
              v-model="action_selected"
              :options="actionOptions"
            />
          </b-col>
        </b-row>
        <!-- <div class="m-2">
          <b-dropdown
            split
            right
            :text="user_placeholder"
            variant="primary"
            class="mx-2 inline"
          >
            <div class="scrollable-menu">
              <b-dropdown-item @click="userSelectedHandler('')"
                >Any</b-dropdown-item
              >
              <div v-for="(each, index) in userSelectors" :key="index">
                <b-dropdown-item @click="userSelectedHandler(each)">{{
                  each
                }}</b-dropdown-item>
              </div>
            </div>
          </b-dropdown>

          <b-dropdown
            split
            right
            :text="station_placeholder"
            variant="primary"
            class="mx-2 inline"
          >
            <div class="scrollable-menu">
              <b-dropdown-item @click="stationSelectedHandler('')"
                >Any</b-dropdown-item
              >
              <div v-for="(each, index) in stationSelectors" :key="index">
                <b-dropdown-item @click="stationSelectedHandler(each)">{{
                  each
                }}</b-dropdown-item>
              </div>
            </div>
          </b-dropdown>

          <b-dropdown
            split
            right
            :text="action_placeholder"
            variant="primary"
            class="mx-2 inline"
          >
            <div class="scrollable-menu">
              <b-dropdown-item @click="actionSelectedHandler('')"
                >Any</b-dropdown-item
              >
              <div v-for="(each, index) in actionSelectors" :key="index">
                <b-dropdown-item @click="actionSelectedHandler(each)">{{
                  each
                }}</b-dropdown-item>
              </div>
            </div>
          </b-dropdown>
        </div> -->
      </b-col>

      <b-col sm="12" md="12" lg="2">
        <b-button v-b-modal.modal-fields-gu variant="warning">
          ส่งออกข้อมูล
        </b-button>
      </b-col>
    </b-row>

    <b-table
      hover
      small
      responsive
      :busy="table_busy"
      :items="filterTable"
      :fields="table_fields"
      :current-page="currentPage"
      :per-page="perPage"
    >
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

import Mixins from "./Mixins";

import { mapState } from "vuex";

export default {
  name: "GatesUpdate",

  mixins: [Mixins],

  data() {
    return {
      table_fields: [
        { key: "timestamp", label: "เวลา" },
        { key: "fullname", label: "ชื่อผู้แก้ไข" },
        { key: "station", label: "สถานี" },
        { key: "gate", label: "ประตูที่" },
        { key: "oldVal", label: "ก่อนแก้ไข (cm)" },
        { key: "newVal", label: "หลังแก้ไข (cm)" }
      ],
      currentPage: 1,
      totalRows: 1,
      perPage: 10,

      data: "",
      table_busy: false,

      day_options: [
        { value: "", text: "เลือกวันที่" },
        { value: "01", text: "01" },
        { value: "02", text: "02" },
        { value: "03", text: "03" },
        { value: "04", text: "04" },
        { value: "05", text: "05" },
        { value: "06", text: "06" },
        { value: "07", text: "07" },
        { value: "08", text: "08" },
        { value: "09", text: "09" },
        { value: "10", text: "10" },
        { value: "11", text: "11" },
        { value: "12", text: "12" },
        { value: "13", text: "13" },
        { value: "14", text: "14" },
        { value: "15", text: "15" },
        { value: "16", text: "16" },
        { value: "17", text: "17" },
        { value: "18", text: "18" },
        { value: "19", text: "19" },
        { value: "20", text: "20" },
        { value: "21", text: "21" },
        { value: "22", text: "22" },
        { value: "23", text: "23" },
        { value: "24", text: "24" },
        { value: "25", text: "25" },
        { value: "26", text: "26" },
        { value: "27", text: "27" },
        { value: "28", text: "28" },
        { value: "29", text: "29" },
        { value: "30", text: "30" },
        { value: "31", text: "31" }
      ],

      month_options: [
        { value: "", text: "เลือกเดือน" },
        { value: "01", text: "มกราคม" },
        { value: "02", text: "กุมภาพันธ์" },
        { value: "03", text: "มีนาคม" },
        { value: "04", text: "เมษายน" },
        { value: "05", text: "พฤษภาคม" },
        { value: "06", text: "มิถุนายน" },
        { value: "07", text: "กรกฎาคม" },
        { value: "08", text: "สิงหาคม" },
        { value: "09", text: "กันยายน" },
        { value: "10", text: "ตุลาคม" },
        { value: "11", text: "พฤษจิกายน" },
        { value: "12", text: "ธันวาคม" }
      ],

      year_options: [
        { value: "", text: "เลือกปี" },
        { value: "2019", text: "2019" },
        { value: "2020", text: "2020" },
        { value: "2021", text: "2021" },
        { value: "2022", text: "2022" },
        { value: "2023", text: "2023" },
        { value: "2024", text: "2024" },
        { value: "2025", text: "2025" }
      ],

      day_selected: "",
      month_selected: "",
      year_selected: "",
      user_selected: "",
      station_selected: "",
      action_selected: "",

      day_placeholder: "Day",
      month_placeholder: "Month",
      year_placeholder: "Year",
      user_placeholder: "User Name",
      station_placeholder: "Station Name",
      action_placeholder: "Action",

      fields_selected: [], // Must be an array reference!
      fields_options: [
        { text: "Date Time", value: "date_time" },
        { text: "User ID", value: "user_id" },
        { text: "Username", value: "username" },
        { text: "Station", value: "station" },
        { text: "Action Gate", value: "gate" },
        { text: "Old Value", value: "oldVal" },
        { text: "New Value", value: "newVal" }
      ],
      filename: "",

      first_timestamp: ""
    };
  },

  computed: {
    ...mapState(["socket"]),

    tableGenerator() {
      let newData = [];

      for (let i = 0, len = this.data.length; i < len; i++) {
        newData.push({
          timestamp: this.formatTimestamp(this.data[i].timestamp),
          fullname: this.data[i].fullname,
          station: this.data[i].station,
          gate: this.data[i].gate,
          oldVal: this.data[i].m_before,
          newVal: this.data[i].m_after
        });
      }

      return newData;
    },

    filterTable() {
      // const every_nth = (arr, nth) => arr.filter((e, i) => i % nth === nth - 1);

      let data = this.tableGenerator;

      let day_filter = item => {
        return this.day_selected ? Boolean(item === this.day_selected) : true;
      };
      let month_filter = item => {
        return this.month_selected
          ? Boolean(item === this.month_selected)
          : true;
      };
      let year_filter = item => {
        return this.year_selected ? Boolean(item === this.year_selected) : true;
      };

      let user_filter = item => {
        return this.user_selected ? item === this.user_selected : true;
      };
      let station_filter = item => {
        return this.station_selected ? item === this.station_selected : true;
      };
      let action_filter = item => {
        return this.action_selected ? item === this.action_selected : true;
      };

      const getDay = str => str.split(" ")[0].split("-")[0];
      const getMonth = str => str.split(" ")[0].split("-")[1];
      const getYear = str => str.split(" ")[0].split("-")[2];

      return data.filter(
        each =>
          day_filter(getDay(each.timestamp)) &&
          month_filter(getMonth(each.timestamp)) &&
          year_filter(getYear(each.timestamp)) &&
          user_filter(each.fullname) &&
          station_filter(each.station) &&
          action_filter(each.gate)
      );
    },

    userOptions() {
      let uniqueUser = this.tableGenerator.map(each => each.fullname);

      uniqueUser = [...new Set(uniqueUser)];

      let options = [{ value: "", text: "เลือกผู้แก้ไข" }];
      uniqueUser.forEach(each => {
        options.push({ value: each, text: each });
      });

      return options;
    },

    stationOptions() {
      let uniqueStation = this.tableGenerator.map(each => each.station);

      uniqueStation = [...new Set(uniqueStation)];

      let options = [{ value: "", text: "เลือกสถานี" }];
      uniqueStation.forEach(each => {
        options.push({ value: each, text: each });
      });

      return options;
    },

    actionOptions() {
      let uniqueAction = this.tableGenerator.map(each => each.gate);

      uniqueAction = [...new Set(uniqueAction)].sort((a, b) => a - b);

      let options = [{ value: "", text: "เลือกประตู" }];
      uniqueAction.forEach(each => {
        options.push({ value: each, text: each });
      });

      return options;
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
    },

    data_limit: function(newVal) {
      this.table_busy = true;

      this.$http({
        method: "get",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/GetHistoricalData/gatesupdate/limit/${newVal}`
      }).then(resp => {
        this.data = resp.data;
        this.table_busy = false;
      });
    }
  },

  created() {
    this.$http({
      method: "get",
      url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/QueryAction/get`
    })
      .then(resp => {
        this.data = resp.data;
      })
      .catch(err => {
        this.makeToast("danger", "Error fetching Gate Action", err);
      });
  },

  mounted() {
    this.totalRows = this.filterTable.length;

    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.fields_selected = [];
        this.filename = "";
      });
    });

    this.socket.on("gates_update", data => {
      this.data.unshift(data);
    });
  },

  methods: {
    daySelectedHandler(val) {
      this.day_selected = val;

      if (!val) {
        this.day_placeholder = "Day";
      } else {
        this.day_placeholder = `${val}`;
      }
    },

    monthSelectedHandler(key, val) {
      this.month_selected = val;

      if (!key && !val) {
        this.month_placeholder = "Month";
      } else {
        this.month_placeholder = `${key}`;
      }
    },

    yearSelectedHandler(val) {
      this.year_selected = val;

      if (!val) {
        this.year_placeholder = "Year";
      } else {
        this.year_placeholder = `${val}`;
      }
    },

    userSelectedHandler(val) {
      this.user_selected = val;

      if (!val) {
        this.user_placeholder = "User";
      } else {
        this.user_placeholder = `${val}`;
      }
    },

    stationSelectedHandler(val) {
      this.station_selected = val;

      if (!val) {
        this.station_placeholder = "Station";
      } else {
        this.station_placeholder = `${val}`;
      }
    },

    actionSelectedHandler(val) {
      this.action_selected = val;

      if (!val) {
        this.action_placeholder = "Action";
      } else {
        this.action_placeholder = `${val}`;
      }
    },

    CSV() {
      let fields = this.fields_selected;
      let exported_filename = this.filename
        ? `${this.filename}.csv`
        : "log.csv";

      try {
        let csv = parse(this.filterTable, { fields });
        var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

        if (navigator.msSaveBlob) {
          // IE 10+
          navigator.msSaveBlob(blob, exported_filename);
        } else {
          var link = document.createElement("a");
          if (link.download !== undefined) {
            // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exported_filename);
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      } catch {
        // nothing
      }

      this.$refs["modal-fields-gu"].hide();
    },

    XLSX() {
      let fields = this.fields_selected;

      const filterObj = eachObj => {
        return Object.keys(eachObj)
          .filter(key => fields.includes(key))
          .reduce((obj, key) => {
            obj[key] = eachObj[key];
            return obj;
          }, {});
      };

      let data = this.filterTable;
      let exported_filename = this.filename ? this.filename : "log";

      for (var i = 0, len = data.length; i < len; i++) {
        data[i] = filterObj(data[i]);
      }

      try {
        json2excel({
          data,
          name: exported_filename
        });
      } catch {
        // nothing
      }

      this.$refs["modal-fields-gu"].hide();
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
