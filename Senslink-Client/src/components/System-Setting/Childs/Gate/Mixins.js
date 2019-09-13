export default {
  data() {
    return {
      station_id: "",

      station: "",
      latitude: "",
      longitude: "",
      amount: "",
      max_level: "",
      log_interval: "",

      ip: "",
      port: "",

      intervalOptions: [
        { value: "", text: "โปรดเลือกความถี่ในการบันทึก" },
        { value: "5", text: "5 mins" },
        { value: "10", text: "10 mins" },
        { value: "15", text: "15 mins" }
      ],
      gateAmountOptions: [
        { value: "", text: "โปรดเลือกจำนวนประตู" },
        { value: 1, text: "1" },
        { value: 2, text: "2" },
        { value: 3, text: "3" },
        { value: 4, text: "4" },
        { value: 5, text: "5" }
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

    maxLevelState() {
      if (!~String(this.max_level).indexOf("e")) {
        return String(this.max_level).length > 0;
      } else return false;
    },

    ipState() {
      let re = /^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/;
      return re.test(String(this.ip)) && this.ip.length > 0;
    },

    portState() {
      if (!~String(this.port).indexOf("e")) {
        return String(this.port).length > 0;
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
