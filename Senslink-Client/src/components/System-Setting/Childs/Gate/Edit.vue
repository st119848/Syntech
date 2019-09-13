<template>
  <div class="edit_gate">
    <b-modal
      ref="modal-edit"
      size="xl"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOkEdit"
    >
      <div slot="modal-title"><strong>เปลี่ยนแปลงประตู</strong></div>

      <b-form-group>
        <b-row>
          <b-col md="12" lg="6">
            <b-form-group
              label-cols-sm="4"
              label="ชื่อสถานี:"
              label-align-sm="left"
              label-for="nested-station"
            >
              <b-form-input
                id="nested-station"
                v-model="station"
                aria-describedby="input-live-feedback"
              />
              <b-form-text id="input-live-feedback">ห้ามเว้นว่าง</b-form-text>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ละติจูด:"
              label-align-sm="left"
              label-for="nested-latitude"
            >
              <b-form-input
                id="nested-latitude"
                v-model="latitude"
                :state="latitudeState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback"
                >รองรับตัวเลข XX.XXXXXX</b-form-invalid-feedback
              >
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ลองจิจูด:"
              label-align-sm="left"
              label-for="nested-longitude"
            >
              <b-form-input
                id="nested-longitude"
                v-model="longitude"
                :state="longitudeState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback"
                >รองรับตัวเลข XX.XXXXXX</b-form-invalid-feedback
              >
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ความถี่การบันทึก:"
              label-align-sm="left"
              label-for="nested-record_log_interval"
            >
              <b-form-select
                id="nested-record-log_interval"
                v-model="log_interval"
                :options="intervalOptions"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="จำนวนประตู:"
              label-align-sm="left"
              label-for="nested-amount"
            >
              <b-form-select
                id="nested-amount"
                v-model="amount"
                :options="gateAmountOptions"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ระดับประตูสูงสุด:"
              label-align-sm="left"
              label-for="nested-max_level"
            >
              <b-form-input
                id="nested-max_level"
                v-model="max_level"
                type="number"
                placeholder="cm"
                :state="maxLevelState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback"
                >รองรับตัวเลข</b-form-invalid-feedback
              >
            </b-form-group>
          </b-col>

          <b-col md="12" lg="6">
            <b-form-group
              label-cols-sm="4"
              label="ไอพี:"
              label-align-sm="left"
              label-for="nested-ip"
            >
              <b-form-input
                id="nested-ip"
                v-model="ip"
                :state="ipState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                รองรับ IPv4
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="พอร์ท:"
              label-align-sm="left"
              label-for="nested-port"
            >
              <b-form-input
                id="nested-port"
                v-model="port"
                type="number"
                :state="portState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                รองรับตัวเลข
              </b-form-invalid-feedback>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form-group>

      <template slot="modal-footer" slot-scope="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()">
          แก้ไข
        </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          ยกเลิก
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Mixins from "./Mixins.js";

export default {
  name: "EditGate",

  mixins: [Mixins],

  props: {
    selected_gate: {
      type: [Object, String],
      required: true
    }
  },

  data() {
    return {};
  },

  watch: {
    editGateModalState: function(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.station_id = this.selected_gate.station_id;
          this.station = this.selected_gate.station;
          this.latitude = this.selected_gate.coordinates[0];
          this.longitude = this.selected_gate.coordinates[1];
          this.amount = this.selected_gate.amount;
          this.max_level = this.selected_gate.max_level;
          this.log_interval = this.selected_gate.log_interval;

          this.ip = this.selected_gate.ip;
          this.port = this.selected_gate.port;
        });

        this.$refs["modal-edit"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleEditGateModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["editGateModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", ["updateGateState", "toggleEditGateModal"]),

    resetModal() {
      this.station = "";
      this.latitude = "";
      this.longitude = "";
      this.amount = "";
      this.max_level = "";
      this.log_interval = "";

      this.ip = "";
      this.port = "";
    },

    handleOkEdit(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitEdit();
    },

    handleSubmitEdit() {
      if (
        !this.station ||
        !this.latitudeState ||
        !this.longitudeState ||
        !this.amount ||
        !this.maxLevelState ||
        !this.ipState ||
        !this.portState
      ) {
        return;
      }

      let bodyFormData = new FormData();
      bodyFormData.append("id", this.station_id);
      bodyFormData.append("station", this.station);
      bodyFormData.append("coordinates", [this.latitude, this.longitude]);
      bodyFormData.append("amount", this.amount);
      bodyFormData.append("max_level", this.max_level);
      bodyFormData.append("log_interval", this.log_interval);
      bodyFormData.append("ip", this.ip);
      bodyFormData.append("port", this.port);

      this.$http({
        method: "put",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/gate`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.updateGateState(resp.data);

          this.makeToast(
            "success",
            "New gates edited",
            `Gates of ${this.station} has been edited.`
          );

          this.$nextTick(() => {
            this.$refs["modal-edit"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "New gates are not edited",
            `There is an error editing new gates.`
          );
        });
    }
  }
};
</script>

<style scoped></style>
