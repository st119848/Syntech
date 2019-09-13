<template>
  <div class="delete_gate">
    <b-modal ref="modal-delete" size="sm" centered>
      <div slot="modal-title"><strong>ยืนยันการลบประตูน้ำ</strong></div>

      <div>ยืนยันการลบสถานี {{ station }}</div>

      <div slot="modal-footer" class="w-100">
        <b-button
          block
          variant="danger"
          size="sm"
          @click="handleSubmitDelete(station_id)"
        >
          ลบ
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Mixins from "./Mixins.js";

export default {
  name: "DeleteGate",

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
    deleteGateModalState: function(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.station_id = this.selected_gate.station_id;
          this.station = this.selected_gate.station;
        });

        this.$refs["modal-delete"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleDeleteGateModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["deleteGateModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", [
      "deleteGateState",

      "toggleDeleteGateModal"
    ]),

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

    handleOkDelete(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmitDelete();
    },

    handleSubmitDelete(station_id) {
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
      bodyFormData.append("id", station_id);

      this.$http({
        method: "delete",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/gate`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.deleteGateState(resp.data);

          this.makeToast(
            "success",
            "Delete Gates",
            `Gates of ${this.station} has been deleted.`
          );

          this.$nextTick(() => {
            this.$refs["modal-delete"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "Delete Gates",
            `There is an error deleting gates.`
          );
        });
    }
  }
};
</script>

<style scoped></style>
