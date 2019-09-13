export default {
  data() {
    return {
      station_id: "",

      station: "",
      latitude: "",
      longitude: "",
      address: "",
      log_interval: "",

      battery_id: "",
      board_id: "",
      signal_id: "",
      solar_id: "",
      water_id: "",
      thresholds: ["", "", "", "", "", ""],

      intervalOptions: [
        { value: "", text: "ตัวเลือก" },
        { value: "5", text: "5 นาที" },
        { value: "10", text: "10 นาที" },
        { value: "15", text: "15 นาที" }
      ]
    };
  },

  computed: {
    latitudeState() {
      if (!~String(this.latitude).indexOf("e")) {
        return String(this.latitude).length > 0;
      } else return false;
    },
    longitudeState() {
      if (!~String(this.longitude).indexOf("e")) {
        return String(this.longitude).length > 0;
      } else return false;
    },
    addressState() {
      let re = /^\d+$/;
      return !re.test(String(this.address)) && this.address.length > 0;
    },

    hazardMinState() {
      if (!~String(this.thresholds[0]).indexOf("e")) {
        return String(this.thresholds[0]).length > 0;
      } else return false;
    },
    hazardMaxState() {
      if (!~String(this.thresholds[1]).indexOf("e")) {
        return String(this.thresholds[1]).length > 0;
      } else return false;
    },
    warningMinState() {
      if (!~String(this.thresholds[2]).indexOf("e")) {
        return String(this.thresholds[2]).length > 0;
      } else return false;
    },
    warningMaxState() {
      if (!~String(this.thresholds[3]).indexOf("e")) {
        return String(this.thresholds[3]).length > 0;
      } else return false;
    },
    notificationMinState() {
      if (!~String(this.thresholds[4]).indexOf("e")) {
        return String(this.thresholds[4]).length > 0;
      } else return false;
    },
    notificationMaxState() {
      if (!~String(this.thresholds[5]).indexOf("e")) {
        return String(this.thresholds[5]).length > 0;
      } else return false;
    },

    waterState() {
      let re = /^\d+$/;
      let v1, v2, v3, v4, v5;

      if (this.water_id.split("-").length - 1 === 4) {
        [v1, v2, v3, v4, v5] = this.water_id.split("-");
        return (
          v1.length === 8 &&
          v2.length === 4 &&
          v3.length === 4 &&
          v4.length === 4 &&
          v5.length === 12 &&
          !re.test(String(this.water_id))
        );
      } else return false;
    },
    batteryState() {
      let re = /^\d+$/;
      let v1, v2, v3, v4, v5;

      if (this.battery_id.split("-").length - 1 === 4) {
        [v1, v2, v3, v4, v5] = this.battery_id.split("-");
        return (
          v1.length === 8 &&
          v2.length === 4 &&
          v3.length === 4 &&
          v4.length === 4 &&
          v5.length === 12 &&
          !re.test(String(this.battery_id))
        );
      } else return false;
    },
    tempState() {
      let re = /^\d+$/;
      let v1, v2, v3, v4, v5;

      if (this.board_id.split("-").length - 1 === 4) {
        [v1, v2, v3, v4, v5] = this.board_id.split("-");
        return (
          v1.length === 8 &&
          v2.length === 4 &&
          v3.length === 4 &&
          v4.length === 4 &&
          v5.length === 12 &&
          !re.test(String(this.board_id))
        );
      } else return false;
    },
    solarState() {
      let re = /^\d+$/;
      let v1, v2, v3, v4, v5;

      if (this.solar_id.split("-").length - 1 === 4) {
        [v1, v2, v3, v4, v5] = this.solar_id.split("-");
        return (
          v1.length === 8 &&
          v2.length === 4 &&
          v3.length === 4 &&
          v4.length === 4 &&
          v5.length === 12 &&
          !re.test(String(this.solar_id))
        );
      } else return false;
    },
    signalState() {
      let re = /^\d+$/;
      let v1, v2, v3, v4, v5;

      if (this.signal_id.split("-").length - 1 === 4) {
        [v1, v2, v3, v4, v5] = this.signal_id.split("-");
        return (
          v1.length === 8 &&
          v2.length === 4 &&
          v3.length === 4 &&
          v4.length === 4 &&
          v5.length === 12 &&
          !re.test(String(this.signal_id))
        );
      } else return false;
    }
  },

  watch: {},

  mounted() {},

  methods: {
    makeToast(variant = null, body, title) {
      this.$bvToast.toast(title, {
        title: body,
        variant: variant,
        solid: true
      });
    }
  }
};
