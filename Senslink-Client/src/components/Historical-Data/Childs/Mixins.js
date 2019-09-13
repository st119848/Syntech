import moment from "moment";

export default {
  data() {
    return {};
  },

  methods: {
    parseTime(time) {
      const [, mm] = time.split(":");

      const remainder = Number(mm % 5);
      let newHHmm;

      if (remainder !== 0) {
        newHHmm = moment(time, "HH:mm:ss")
          .subtract(remainder, "minutes")
          .format("HH:mm")
          .toString();
      } else {
        newHHmm = moment(time, "HH:mm:ss")
          .format("HH:mm")
          .toString();
      }

      // if (remainder > 0 && remainder <= 2) {
      //   newHHmm = moment(time, "HH:mm:ss")
      //     .subtract(remainder, "minutes")
      //     .format("HH:mm")
      //     .toString();
      // } else if (remainder > 2 && remainder < 5) {
      //   newHHmm = moment(time, "HH:mm:ss")
      //     .add(5 - remainder, "minutes")
      //     .format("HH:mm")
      //     .toString();
      // } else if (remainder === 0) {
      //   newHHmm = moment(time, "HH:mm:ss")
      //     .format("HH:mm")
      //     .toString();
      // }

      return [newHHmm, "00"].join(":");
    },

    filterArrayOfObjectByKey(arr, allowed) {
      let result = [];
      let new_fields = allowed.reduce((a, b) => ((a[b] = ""), a), {});

      for (let i = 0, len = arr.length; i < len; i++) {
        let each_field = { ...new_fields };

        for (let key in each_field) {
          each_field[key] =
            key === "time" ? this.parseTime(arr[i][key]) : arr[i][key];
        }

        result.push(each_field);
      }

      return result;
    },

    parseUnit(str) {
      switch (str) {
        case "water":
          return "Water Level (m)";
        case "battery":
          return "Battery Voltage (V)";
        case "temp":
          return "Board Temp (C)";
        case "solar":
          return "Solar Voltage (V)";
        case "signal":
          return "NB-Iot Signal Strength (dBm)";
        default:
          return str;
      }
    },

    formatDate(str) {
      return str.split("T")[0];
    },

    formatTime(str) {
      return str.split("T")[1].split(".")[0];
    },

    formatTimestamp(str) {
      return moment(str.split(".")[0]).format("DD-MM-YYYY HH:mm:ss");
    },

    arrIsNotEmpty(arr) {
      return Array.isArray(arr) && arr.length > 0;
    }
  },

  mounted() {},

  filters: {
    toNumber: function(str) {
      if (Number(str)) {
        return Number(str).toFixed(2);
      }
    },

    formatDate: function(str) {
      return str.split("T")[0];
    },

    formatTime: function(str) {
      return str.split("T")[1].split(".")[0];
    }
  },

  watch: {}
};
