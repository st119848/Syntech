<template>
  <div class="create_station">
    <b-modal
      ref="modal-create"
      size="xl"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOkCreate"
    >
      <div slot="modal-title">
        <strong>แบบฟอร์มสร้างสถานีวัดระดับน้ำ</strong>
      </div>

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
              <b-form-text id="input-live-feedback">
                ห้ามเว้นว่าง
              </b-form-text>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ที่อยู่:"
              label-align-sm="left"
              label-for="nested-address"
            >
              <b-form-input
                id="nested-address"
                type="text"
                v-model="address"
                :state="addressState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                ใส่ที่อยู่
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="พิกัด:"
              label-align-sm="left"
              label-for="nested-coordinates"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    id="nested-latitude"
                    type="number"
                    v-model="latitude"
                    :state="latitudeState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    รองรับตัวเลข XX.XXXXXX
                  </b-form-invalid-feedback>
                </b-col>
                <b-col>
                  <b-form-input
                    id="nested-longitude"
                    type="number"
                    v-model="longitude"
                    :state="longitudeState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    รองรับตัวเลข XX.XXXXXX
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ความถี่การบันทึก:"
              label-align-sm="left"
              label-for="nested-record_interval"
            >
              <b-form-select
                id="nested-record-interval"
                v-model="log_interval"
                :options="intervalOptions"
                required
              ></b-form-select>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="อันตราย (min - max):"
              label-align-sm="left"
              label-for="nested-hazard"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    id="nested-hazard-min"
                    v-model="thresholds[0]"
                    type="number"
                    placeholder="เมตร"
                    :state="hazardMinState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    อนุญาติเฉพาะตัวเลข
                  </b-form-invalid-feedback>
                </b-col>
                <b-col>
                  <b-form-input
                    id="nested-hazard-max"
                    v-model="thresholds[1]"
                    type="number"
                    placeholder="เมตร"
                    :state="hazardMaxState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    อนุญาติเฉพาะตัวเลข
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="เริ่มอันตราย (min - max):"
              label-align-sm="left"
              label-for="nested-warning"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    id="nested-warning-min"
                    v-model="thresholds[2]"
                    type="number"
                    placeholder="เมตร"
                    :state="warningMinState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    อนุญาติเฉพาะตัวเลข
                  </b-form-invalid-feedback>
                </b-col>
                <b-col>
                  <b-form-input
                    id="nested-warning-max"
                    v-model="thresholds[3]"
                    type="number"
                    placeholder="เมตร"
                    :state="warningMaxState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    อนุญาติเฉพาะตัวเลข
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="แจ้งเตือน (min - max):"
              label-align-sm="left"
              label-for="nested-notification"
            >
              <b-row>
                <b-col>
                  <b-form-input
                    id="nested-notification-min"
                    v-model="thresholds[4]"
                    type="number"
                    placeholder="เมตร"
                    :state="notificationMinState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    อนุญาติเฉพาะตัวเลข
                  </b-form-invalid-feedback>
                </b-col>
                <b-col>
                  <b-form-input
                    id="nested-notification-max"
                    v-model="thresholds[5]"
                    type="number"
                    placeholder="เมตร"
                    :state="notificationMaxState"
                    aria-describedby="input-live-feedback"
                  />
                  <b-form-invalid-feedback id="input-live-feedback">
                    อนุญาติเฉพาะตัวเลข
                  </b-form-invalid-feedback>
                </b-col>
              </b-row>
            </b-form-group>
          </b-col>

          <b-col md="12" lg="6">
            <b-form-group
              label-cols-sm="4"
              label="ไอดีค่าระดับน้ำ:"
              label-align-sm="left"
              label-for="nested-water_id"
            >
              <b-form-input
                id="nested-water_id"
                v-model="water_id"
                :state="waterState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                ห้ามเว้นว่าง
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ไอดีค่าแบตเตอรี่:"
              label-align-sm="left"
              label-for="nested-battery_id"
            >
              <b-form-input
                id="nested-battery_id"
                v-model="battery_id"
                :state="batteryState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                ห้ามเว้นว่าง
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ไอดีค่าอุณหภูมิอุปกรณ์:"
              label-align-sm="left"
              label-for="nested-board_id"
            >
              <b-form-input
                id="nested-board_id"
                v-model="board_id"
                :state="tempState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                ห้ามเว้นว่าง
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ไอดีค่าระดับสัญญาณ:"
              label-align-sm="left"
              label-for="nested-signal_id"
            >
              <b-form-input
                id="nested-signal_id"
                v-model="signal_id"
                :state="signalState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                ห้ามเว้นว่าง
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group
              label-cols-sm="4"
              label="ไอดีค่าระดับพลังงานแสง:"
              label-align-sm="left"
              label-for="nested-solar_id"
            >
              <b-form-input
                id="nested-solar_id"
                v-model="solar_id"
                :state="solarState"
                aria-describedby="input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback">
                ห้ามเว้นว่าง
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
  name: "CreateStation",

  mixins: [Mixins],

  data() {
    return {};
  },

  watch: {
    createStationModalState: function(newVal) {
      if (newVal) {
        this.$refs["modal-create"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleCreateStationModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["createStationModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", [
      "appendStation",
      "toggleCreateStationModal"
    ]),

    resetModal() {
      this.station = "";
      this.latitude = "";
      this.longitude = "";
      (this.address = ""), (this.log_interval = "");

      this.battery_id = "";
      this.board_id = "";
      this.signal_id = "";
      this.solar_id = "";
      this.water_id = "";
      this.thresholds = ["", "", "", "", "", ""];
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
        !this.latitude ||
        !this.longitude ||
        !this.address ||
        !this.log_interval ||
        !this.thresholds.every(o => o !== "") ||
        !this.waterState ||
        !this.batteryState ||
        !this.tempState ||
        !this.solarState ||
        !this.signalState
      ) {
        return;
      }

      let bodyFormData = new FormData();
      bodyFormData.append("station", this.station);
      bodyFormData.append("coordinates", [this.latitude, this.longitude]);
      bodyFormData.append("address", this.address);
      bodyFormData.append("log_interval", this.log_interval);
      bodyFormData.append("battery_id", this.battery_id);
      bodyFormData.append("board_id", this.board_id);
      bodyFormData.append("signal_id", this.signal_id);
      bodyFormData.append("solar_id", this.solar_id);
      bodyFormData.append("water_id", this.water_id);
      bodyFormData.append("thresholds", this.thresholds);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/station/`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.appendStation(resp.data);

          this.makeToast(
            "success",
            "New station created",
            `Station ${this.station} has been created.`
          );

          this.$nextTick(() => {
            this.$refs["modal-create"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "New station not created",
            `There is an error creating new station.`
          );
        });
    }
  }
};
</script>

<style scoped></style>
