import ChartMixins from "../../Mixins/ChartMixins.js";
// import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

export default {
  components: {
    ChartMixins
  },

  props: {
    stations: {
      type: [Array, String],
      required: true
    },
    gates: {
      type: [Array, String],
      required: true
    },
    time_now: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      controller_mode: "Manual",

      chart_options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: { display: false },
        events: [],
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                fontColor: "black",
                fontSize: 16,
                stepSize: 1,
                beginAtZero: true
              },
              gridLines: {
                display: false
              },
              categoryPercentage: 1.0,
              barPercentage: 1.0
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                fontColor: "black",
                fontSize: 16
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
        // plugins: {
        //   datalabels: {
        //     // formatter: function(value, context) {
        //     //   return context.dataset.data[context.dataIndex].label;
        //     // }
        //     // color: function(context) {
        //     //   var index = context.dataIndex;
        //     //   var value = context.dataset.data[index];
        //     //   return value < 50 ? 'red' :  // draw negative values in red
        //     //       'green';
        //     // }
        //   }
        // }
      },
      // plugins: [
      //   {
      //     beforeInit: function(chart) {
      //       chart.data.labels.forEach(function(e, i, a) {
      //         if (/\n/.test(e)) {
      //           a[i] = e.split(/\n/);
      //         }
      //       });
      //     }
      //   }
      // ],

      renderChart: false
    };
  },

  methods: {
    makeToast(variant = null, body, title) {
      this.$bvToast.toast(title, {
        title: body,
        variant: variant,
        solid: true
      });
    },

    submitEach(oldVal, newVal, station, ip, index, mode) {
      let bodyFormData = new FormData();
      bodyFormData.append("id", sessionStorage.getItem("user.id"));
      bodyFormData.append("username", sessionStorage.getItem("user.username"));
      bodyFormData.append("station", station);
      bodyFormData.append("oldVal", oldVal);
      bodyFormData.append("newVal", newVal);
      bodyFormData.append("index", index);
      bodyFormData.append("ip", ip);
      bodyFormData.append("mode", mode);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/HoldingRegister/writeSingleRegister`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(() => {
          this.makeToast(
            "success",
            "Gates Updated",
            `Gates ${index + 1} at ${station} has been modified.`
          );
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "Gates Update Failed",
            `Gates ${index + 1} at ${station} has not been modified.`
          );
        });
    },

    submitAll(oldVal, newVal, station, ip) {
      let bodyFormData = new FormData();
      bodyFormData.append("id", sessionStorage.getItem("user.id"));
      bodyFormData.append("username", sessionStorage.getItem("user.username"));
      bodyFormData.append("station", station);
      bodyFormData.append("oldVal", oldVal);
      bodyFormData.append("newVal", newVal);
      bodyFormData.append("ip", ip);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/HoldingRegister/writeMultipleRegisters`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(() => {
          this.makeToast(
            "success",
            "Gates Updated",
            `All gates at ${station} has been modified.`
          );
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "Gates Update Failed",
            `All gates at ${station} has not been modified.`
          );
        });
    },

    submitMode(mode, ip) {
      let bodyFormData = new FormData();
      bodyFormData.append("mode", mode);
      bodyFormData.append("ip", ip);

      this.$http({
        method: "post",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/HoldingRegister/changeMode`,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" }
      })
        .then(() => {
          this.makeToast(
            "success",
            "Gate Updated",
            `Gate ${ip} mode has been changed.`
          );
        })
        .catch(() => {
          this.makeToast(
            "danger",
            "Gate Update Failed",
            `Gate ${ip} mode has not been changed.`
          );
        });
    },

    formatDate(str) {
      return str.split(" ")[0];
    },

    formatTime(str) {
      return str.split(" ")[1];
    },

    syncAdvisory(gate_ip) {
      let result;

      if (this.getAdvisoryByStationId(gate_ip)) {
        let updated = this.getAdvisoryByStationId(gate_ip).updated;
        result = this.checkIfDelay(updated, 5)
          ? this.getAdvisoryByStationId(gate_ip).gate_levels
          : [];
      }

      return result || [];
    },

    checkIfDelay(time, min) {
      let [hh, mm] = moment
        .utc(moment(this.time_now, "HH:mm:ss").diff(moment(time, "HH:mm:ss")))
        .format("HH:mm:ss")
        .split(":")
        .map(o => Number(o));

      return Boolean(mm < min && hh === 0);
    },

    checkMonitorConnection(val = 0) {
      let [hh, mm] = moment
        .utc(
          moment(this.time_now, "HH:mm:ss").diff(
            moment(this.formatTime(this.stations[val].updated), "HH:mm:ss")
          )
        )
        .format("HH:mm:ss")
        .split(":")
        .map(o => Number(o));

      return Boolean(mm < 10 && hh === 0);
    },

    checkControllerConnection(val = 0) {
      let [hh, mm] = moment
        .utc(
          moment(this.time_now, "HH:mm:ss").diff(
            moment(this.formatTime(this.gates[val].updated), "HH:mm:ss")
          )
        )
        .format("HH:mm:ss")
        .split(":")
        .map(o => Number(o));

      return mm === 59 ? true : Boolean(mm <= 1 && hh === 0);

      // return Boolean(mm <= 5 && hh === 0);
    },

    ifArrayEqual(arr1, arr2) {
      if (arr1.length === arr2.length) {
        for (var i = 0, len = arr1.length; i < len; i++) {
          if (arr1[i] !== arr2[i]) return false;
        }
      } else return false;

      return true;
    },

    arrIsNotEmpty(arr) {
      return Array.isArray(arr) && arr.length > 0;
    }
  },

  computed: {
    chartGenerator() {
      let chartObj;

      if (this.gates[this.syncGateIndex].sensors) {
        let levels = this.gates[this.syncGateIndex].sensors.slice(
          0,
          this.gates[this.syncGateIndex].gate_amount
        );

        let limit = this.gates[this.syncGateIndex].max_level;

        let water_level = [];
        let gate_level = [];

        for (var i = 0, len = levels.length; i < len; i++) {
          let val = levels[i] > limit ? limit : levels[i];
          water_level.push(limit - val);
          gate_level.push(val);
        }

        chartObj = {
          labels: water_level.map((each, index) => `Gate ${index + 1}`),
          datasets: [
            {
              backgroundColor: "#08B2FB",
              data: gate_level
            },
            {
              backgroundColor: "#656262",
              data: water_level
            }
          ]
        };
      }

      return chartObj ? chartObj : "";
    }
  },

  mounted() {
    this.$root.$on("bv::modal::shown", () => {
      this.$nextTick(() => {
        this.renderChart = true;
      });
    });
    this.$root.$on("bv::modal::hidden", () => {
      this.$nextTick(() => {
        this.renderChart = false;
      });
    });
  },

  filters: {
    fixedDigit: function(val) {
      if (typeof val === "number") {
        return Number(val.toFixed(2));
      }
    },

    formatDate: function(str) {
      return str.split(" ")[0];
    },

    formatTime: function(str) {
      return str.split(" ")[1];
    }
  },

  watch: {}
};
