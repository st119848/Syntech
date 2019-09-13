<template>
  <div class="station">
    <b-card>
      <h3 slot="header" style="display: table-cell; vertical-align: middle">
        สถานี
      </h3>

      <b-card-body class="p-0">
        <!-- CREATE STATION -->
        <CreateStation />

        <!-- EDIT STATION -->
        <EditStation :selected_station="selected_station" />

        <!-- DELETE STATION -->
        <DeleteStation :selected_station="selected_station" />

        <b-row class="mx-2 pb-3" align-h="between">
          <b-col sm="12" md="4" lg="2">
            <b-button squared block variant="primary" @click="createStation()"
              >สร้างสถานี</b-button
            >
          </b-col>

          <b-col sm="12" md="7" lg="3">
            <b-form-group class="mb-0">
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
          </b-col>
        </b-row>

        <b-table
          hover
          small
          responsive
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :items="tableGenerator"
          :fields="fields_options"
          :filter="filterStation"
          :current-page="currentPage"
          :per-page="perPage"
        >
          <template v-slot:cell(action)="data">
            <b-link class="mx-1" style="color: orange" @click="editStation(data.item)">
              แก้ไข
              <!-- <font-awesome-icon size="lg" style="color: orange" icon="edit" /> -->
            </b-link>
            <b-link class="mx-1" style="color: red" @click="deleteStation(data.item)">
              ลบ
              <!-- <font-awesome-icon size="lg" style="color: red" icon="trash" /> -->
            </b-link>
          </template>

          <template v-slot:cell(log_interval)="data">
            {{ data.item.log_interval }} minutes
          </template>

          <template v-slot:table-caption>{{ tableCaption }}</template>
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
      </b-card-body>
    </b-card>
  </div>
</template>

<script>
const CreateStation = () =>
  import("@/components/System-Setting/Childs/Station/Create.vue");
const EditStation = () =>
  import("@/components/System-Setting/Childs/Station/Edit.vue");
const DeleteStation = () =>
  import("@/components/System-Setting/Childs/Station/Delete.vue");

import { mapState, mapActions } from "vuex";

export default {
  name: "Station",

  components: {
    CreateStation,
    EditStation,
    DeleteStation
  },

  data() {
    return {
      currentPage: 1,
      totalRows: 1,
      perPage: 30,

      selected_station: "",

      filterStation: null,

      sortBy: "station",
      sortDesc: false,

      fields_options: [
        { key: "station", label: "ชื่อสถานี", sortable: true },
        { key: "address", label: "ตำแหน่่ง" },
        { key: "log_interval", label: "ความถี่การเก็บข้อมูล" },
        { key: "action", label: "ตั้งค่า" }
      ]
    };
  },

  computed: {
    ...mapState("SystemSetting", ["setting_data"]),
    ...mapState(["socket"]),

    tableGenerator() {
      let newData = [];

      if (
        Array.isArray(this.setting_data.station) &&
        this.setting_data.station.length > 0
      ) {
        for (let i = 0, len = this.setting_data.station.length; i < len; i++) {
          newData.push({
            station_id: this.setting_data.station[i].id,
            station: this.setting_data.station[i].station,
            coordinates: this.setting_data.station[i].coordinates,
            address: this.setting_data.station[i].address,
            log_interval: this.setting_data.station[i].log_interval,
            thresholds: this.setting_data.station[i].thresholds,

            client_id: this.setting_data.station[i].client_id,
            client_secret: this.setting_data.station[i].client_secret,
            battery_id: this.setting_data.station[i].battery_id,
            board_id: this.setting_data.station[i].temp_id,
            signal_id: this.setting_data.station[i].signal_id,
            solar_id: this.setting_data.station[i].solar_id,
            water_id: this.setting_data.station[i].water_id
          });
        }
      }

      return newData;
    },

    tableCaption() {
      let start =
        Array.isArray(this.tableGenerator) && this.tableGenerator.length > 0
          ? (this.currentPage - 1) * this.perPage || 1
          : 0;
      let end =
        this.tableGenerator.length > this.perPage * this.currentPage
          ? this.perPage * this.currentPage
          : this.tableGenerator.length;
      let all = this.tableGenerator.length;

      return `แสดงผล ${start} ถึง ${end} จากทั้งหมด ${all}`;
    }
  },

  watch: {
    tableGenerator: function(newVal) {
      this.totalRows = newVal.length;
    }
  },

  created() {
    this.$http({
      method: "get",
      url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/GetSystemSetting/station`
    })
      .then(resp => {
        this.stations(resp.data);
      })
      .catch(err => {
        this.makeToast("danger", "Error fetching Stations ID", err);
      });
  },

  mounted() {
    this.totalRows = this.tableGenerator.length;
  },

  methods: {
    ...mapActions("SystemSetting", [
      "stations",

      "toggleCreateStationModal",
      "toggleEditStationModal",
      "toggleDeleteStationModal"
    ]),

    makeToast(variant = null, body, title) {
      this.$bvToast.toast(title, {
        title: body,
        variant: variant,
        solid: true
      });
    },

    createStation() {
      this.toggleCreateStationModal(true);
    },

    editStation(station) {
      this.selected_station = station;
      this.toggleEditStationModal(true);
    },

    deleteStation(station) {
      this.selected_station = station;
      this.toggleDeleteStationModal(true);
    }
  }
};
</script>

<style scoped>
h3 {
  font-family: "Kanit", sans-serif;
}
</style>
