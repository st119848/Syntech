<template>
  <div class="create_gate">
    <b-modal
      ref="modal-create"
      size="xl"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOkCreate"
    >
      <div slot="modal-title"><strong>เพิ่มสถานีควบคุมประตูน้ำ</strong></div>

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
              <b-form-text id="input-live-feedback"
                >กรุณากรอกข้อมูล</b-form-text
              >
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
          สร้าง
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
  name: "CreateGate",

  mixins: [Mixins],

  data() {
    return {};
  },

  watch: {
    createGateModalState: function(newVal) {
      if (newVal) {
        this.$refs["modal-create"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleCreateGateModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["createGateModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", ["appendGate", "toggleCreateGateModal"]),

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

    handleOkCreate(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitCreate();
    },

    handleSubmitCreate() {
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
      bodyFormData.append("station", this.station);
      bodyFormData.append("coordinates", [this.latitude, this.longitude]);
      bodyFormData.append("amount", this.amount);
      bodyFormData.append("max_level", this.max_level);
      bodyFormData.append("log_interval", this.log_interval);
      bodyFormData.append("ip", this.ip);
      bodyFormData.append("port", this.port);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/gate`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.appendGate(resp.data);

          this.makeToast(
            "success",
            "New gates created",
            `Gates of ${this.station} has been created.`
          );

          this.$nextTick(() => {
            this.$refs["modal-create"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "New gates are not created",
            `There is an error creating new gates.`
          );
        });
    }
  }
};
</script>

<style scoped></style>
