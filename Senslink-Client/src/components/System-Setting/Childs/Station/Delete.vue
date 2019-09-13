<template>
  <div class="delete_station">
    <b-modal ref="modal-delete" size="sm" centered>
      <div slot="modal-title"><strong>ยืนยันการลบสถานีวัดระดับน้ำ</strong></div>

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
  name: "DeleteStation",

  mixins: [Mixins],

  props: {
    selected_station: {
      type: [Object, String],
      required: true
    }
  },

  data() {
    return {};
  },

  watch: {
    deleteStationModalState: function(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.station_id = this.selected_station.station_id;
          this.station = this.selected_station.station;
        });

        this.$refs["modal-delete"].show();
      }
    }
  },

  created() {},

  mounted() {
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.toggleDeleteStationModal(false);
      });
    });
  },

  computed: {
    ...mapGetters("SystemSetting", ["deleteStationModalState"])
  },

  methods: {
    ...mapActions("SystemSetting", [
      "deleteStationState",

      "toggleDeleteStationModal"
    ]),

    handleSubmitDelete(station_id) {
      let bodyFormData = new FormData();
      bodyFormData.append("id", station_id);

      this.$http({
        method: "delete",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/station`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(resp => {
          this.deleteStationState(resp.data);

          this.makeToast(
            "success",
            "Delete Station",
            `Station ${this.station} has been deleted.`
          );

          this.$nextTick(() => {
            this.$refs["modal-delete"].hide();
          });
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "Delete Station",
            `There is an error deleting station.`
          );
        });
    }
  }
};
</script>

<style scoped></style>
