<template>
  <div class="gate">
    <b-card>
      <h3 slot="header" style="display: table-cell; vertical-align: middle">
        ประตู
      </h3>

      <b-card-body class="p-0">
        <!-- CREATE GATE -->
        <CreateGate />

        <!-- EDIT GATE -->
        <EditGate :selected_gate="selected_gate" />

        <!-- DELETE GATE -->
        <DeleteGate :selected_gate="selected_gate" />

        <b-row class="mx-2 pb-3" align-h="between">
          <b-col sm="12" md="4" lg="2">
            <b-button squared block variant="primary" @click="createGate()"
              >สร้างประตูน้ำ</b-button
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
            <b-link class="mx-1" style="color: orange" @click="editGate(data.item)">
              แก้ไข
              <!-- <font-awesome-icon size="lg" style="color: orange" icon="edit" /> -->
            </b-link>
            <b-link class="mx-1" style="color: red" @click="deleteGate(data.item)">
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
const CreateGate = () =>
  import("@/components/System-Setting/Childs/Gate/Create.vue");
const EditGate = () =>
  import("@/components/System-Setting/Childs/Gate/Edit.vue");
const DeleteGate = () =>
  import("@/components/System-Setting/Childs/Gate/Delete.vue");

import { mapState, mapActions } from "vuex";

export default {
  name: "Gate",

  components: {
    CreateGate,
    EditGate,
    DeleteGate
  },

  data() {
    return {
      currentPage: 1,
      totalRows: 1,
      perPage: 30,

      selected_gate: "",

      filterStation: null,

      sortBy: "station_name",
      sortDesc: false,

      fields_options: [
        { key: "station", label: "ชื่อบัญชี", sortable: true },
        { key: "coordinates", label: "ตำแหน่ง" },
        { key: "log_interval", label: "ความถี่การเก็บข้อมูล" },
        { key: "amount", label: "จำนวนประตู" },
        { key: "action", label: "ตั้งค่า" }
      ]
    };
  },

  computed: {
    ...mapState("SystemSetting", ["setting_data"]),
    ...mapState(["socket"]),

    tableGenerator() {
      let newData = [];

      for (let i = 0, len = this.setting_data.gate.length; i < len; i++) {
        newData.push({
          station_id: this.setting_data.gate[i].id,
          station: this.setting_data.gate[i].station,
          coordinates: this.setting_data.gate[i].coordinates,
          amount: this.setting_data.gate[i].amount,
          max_level: this.setting_data.gate[i].max_level,
          log_interval: this.setting_data.gate[i].log_interval,

          ip: this.setting_data.gate[i].ip,
          port: this.setting_data.gate[i].port
        });
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
      url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/GetSystemSetting/gate`
    })
      .then(resp => {
        this.gates(resp.data);
      })
      .catch(err => {
        this.makeToast("danger", "Error fetching Gates ID", err);
      });
  },

  mounted() {
    this.totalRows = this.tableGenerator.length;
  },

  methods: {
    ...mapActions("SystemSetting", [
      "gates",

      "toggleCreateGateModal",
      "toggleEditGateModal",
      "toggleDeleteGateModal"
    ]),

    makeToast(variant = null, body, title) {
      this.$bvToast.toast(title, {
        title: body,
        variant: variant,
        solid: true
      });
    },

    createGate() {
      this.toggleCreateGateModal(true);
    },

    editGate(gate) {
      this.selected_gate = gate;
      this.toggleEditGateModal(true);
    },

    deleteGate(gate) {
      this.selected_gate = gate;
      this.toggleDeleteGateModal(true);
    }
  }
};
</script>

<style scoped>
h3 {
  font-family: "Kanit", sans-serif;
}
</style>
