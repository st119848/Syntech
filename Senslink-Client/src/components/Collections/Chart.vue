<template>
  <div class="chart">
    <b-card class="chart_frame">
      <div slot="header">
        <b-row align-h="between">
          <b-col sm="12" lg="4">
            <b-row>
              <b-col cols="4">
                <label
                  class="m-md-1"
                  for="selected_date"
                  style="font-size: 20px; font-weight: 400;"
                >
                  เลือกวันที่
                </label>
              </b-col>
              <b-col cols="7">
                <b-form-input
                  id="selected_date"
                  v-model="selected_date"
                  type="date"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-col>
          <b-col sm="12" lg="4" class="text-align: center;">
            <b-row align-h="center">
              <b-col cols="4">
                <h3>ระดับน้ำ</h3>
              </b-col>
            </b-row>
          </b-col>

          <b-col sm="12" lg="4">
            <b-form-group class="float-right m-1">
              <b-form-radio-group
                id="btn-radios-2"
                v-model="selected_interval"
                :options="interval_options"
                buttons
                button-variant="outline-primary"
                size="sm"
                name="radio-btn-outline"
              ></b-form-radio-group>
            </b-form-group>
          </b-col>
        </b-row>
      </div>

      <b-card-body class="p-0">
        <line-chart :chart-data="chartGenerator" :options="options" />
      </b-card-body>

      <div slot="footer">
        <b-form-input
          class="m-md-2"
          v-model="n"
          type="range"
          min="1"
          max="28"
        ></b-form-input>
      </div>
    </b-card>

    <!-- <div class="d-flex flex-wrap justify-content-between pt-5">
      <div>
        <b-card
          no-body
          style="max-width: 22rem;"
          :img-src="require('../../assets/station.png')"
          img-alt="Image"
          img-top
        >
          <h4 slot="header" style="display: table-cell; vertical-align: middle">สถานีวัดระดับน้ำที่ 1</h4>

          <b-card-body class="py-2">
            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ที่ตั้ง
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  อำเภอ พรานกระต่าย จังหวัด กำแพงเพชร
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ความลึกของน้ำ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  2.15 ม.
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ระดับน้ำ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  72.15 ม. รทก.
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  สถานะ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  ปกติ
                </b-card-text>
              </b-col>
            </b-row>
            
          </b-card-body>

          <b-list-group flush>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    แบตเตอรี่
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    12.95 โวลต์
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    โซลาเซลล์
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    13.56 โวลต์
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    อุณหภูมิอุปกรณ์
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    46 องศา
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    ความแรงสัญญาณ
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    -55 dBm
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </div>

      <div>
        <b-card
          no-body
          style="max-width: 22rem;"
          :img-src="require('../../assets/station.png')"
          img-alt="Image"
          img-top
        >
          <h4 slot="header" style="display: table-cell; vertical-align: middle">สถานีวัดระดับน้ำที่ 1</h4>

          <b-card-body class="py-2">
            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ที่ตั้ง
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  อำเภอ พรานกระต่าย จังหวัด กำแพงเพชร
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ความลึกของน้ำ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  2.15 ม.
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ระดับน้ำ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  72.15 ม. รทก.
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  สถานะ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  ปกติ
                </b-card-text>
              </b-col>
            </b-row>
            
          </b-card-body>

          <b-list-group flush>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    แบตเตอรี่
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    12.95 โวลต์
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    โซลาเซลล์
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    13.56 โวลต์
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    อุณหภูมิอุปกรณ์
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    46 องศา
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    ความแรงสัญญาณ
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    -55 dBm
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </div>

      <div>
        <b-card
          no-body
          style="max-width: 22rem;"
          :img-src="require('../../assets/station.png')"
          img-alt="Image"
          img-top
        >
          <h4 slot="header" style="display: table-cell; vertical-align: middle">สถานีวัดระดับน้ำที่ 1</h4>

          <b-card-body class="py-2">
            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ที่ตั้ง
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  อำเภอ พรานกระต่าย จังหวัด กำแพงเพชร
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ความลึกของน้ำ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  2.15 ม.
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  ระดับน้ำ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  72.15 ม. รทก.
                </b-card-text>
              </b-col>
            </b-row>

            <b-row>
              <b-col cols="5">
                <b-card-text>
                  สถานะ
                </b-card-text>
              </b-col>
              <b-col>
                <b-card-text>
                  ปกติ
                </b-card-text>
              </b-col>
            </b-row>
            
          </b-card-body>

          <b-list-group flush>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    แบตเตอรี่
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    12.95 โวลต์
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    โซลาเซลล์
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    13.56 โวลต์
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    อุณหภูมิอุปกรณ์
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    46 องศา
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item class="py-1">
              <b-row>
                <b-col cols="5">
                  <b-card-text>
                    ความแรงสัญญาณ
                  </b-card-text>
                </b-col>
                <b-col>
                  <b-card-text>
                    -55 dBm
                  </b-card-text>
                </b-col>
              </b-row>
            </b-list-group-item>
          </b-list-group>
        </b-card>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import LineChart from "../Mixins/LineChart.js";
import moment from "moment-timezone";
import { stat, statSync } from "fs";

const extractTime = timestamp => {
  return timestamp.split("T")[1].split(".")[0];
};

const createTimeLabels = (gap = 5) => {
  let time_labels = [];
  let iter_time = "00:00:00";
  for (let i = 0; i < 288; i++) {
    time_labels.push(iter_time);
    iter_time = moment(iter_time, "HH:mm:ss")
      .add(gap, "minutes")
      .format("HH:mm:ss");
  }

  return time_labels;
};

const reduceByIndex = (arr, n) => {
  return arr.filter(
    (_, i) => i % n === 0
  );
}

const sliceToFront = (arr, n, k = 10) => {
  return arr.slice(0, n * k);
}

const removeSecond = str => {
  const [hh, mm] = str.split(":");
  return `${hh}:${mm}`;
};

const parseTime = str => {
  return str.split(" ")[1];
};

const getUniqueElement = (arr) => {
  return [...new Set(arr)];
}

const matchDataWithLabels = (arr, times) => {
  let dataset = [];

  for (let i = 0, len = times.length; i < len; i++) {
    const index = arr.findIndex(
      o => removeSecond(times[i]) === removeSecond(parseTime(o.metas[0]))
    );

    dataset.push(
      index !== -1 ? Number(arr[index].measures[0]) : null
    );
  }

  return dataset;
};

const color_lists = [
  '#1E88E5', // blue
  '#D81B60', // red
  '#8E24AA', // purple
  '#43A047', // green
  '#FFB300', // orange
  '#6D4C41', // brown
  '#00ACC1', // green2
  '#546E7A' // gray
]

export default {
  name: "Chart",

  components: {
    LineChart
  },

  data() {
    return {
      selected_date: "",
      data: [],

      selected_interval: 1,
      interval_options: [
        { value: 1, text: "5 นาที" },
        { value: 2, text: "10 นาที" },
        { value: 12, text: "1 ชม" }
      ],

      n: 28,

      options: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: 0
          },
          point: {
            radius: 2
          }
        },
        legend: {
          display: true,
          position: "bottom"
        },
        animation: {
          duration: false
        },
        backgroundColor: "rgba(0, 0, 0, 0)",
        tooltips: {
          callbacks: {
            label: item => `${item.yLabel} ม.(รทก.)`
          }
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'ระดับนำ้ ม.(รทก.)'
              },
              ticks: {
                // userCallback: function(item) {
                //   return `${item} ม.(รทก.)`;
                // }
              }
            }
          ]
        }
      }
    };
  },

  created() {
    this.selected_date = moment()
      .tz("Asia/Bangkok")
      .format("YYYY-MM-DD");

    this.$http({
      method: "get",
      url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/QueryMonitor/${this.selected_date}`
    })
      .then(resp => {
        this.data = resp.data;
      })
      .catch(err => {});
  },

  computed: {
    ...mapState(["selected_station"]),

    chartGenerator() {
      const raw_data = [...this.data];
      const time_series = createTimeLabels();

      let labels;
      labels = reduceByIndex([...time_series], this.selected_interval);
      labels = sliceToFront([...labels], this.n);

      // extract unique station name
      const stations = getUniqueElement(raw_data.map(each => each.metas[1]));

      // chunk stations array into each station array
      let chunked_data = [];
      for (const station of stations) {
        chunked_data.push(raw_data.filter(o => o.metas[1] === station));
      }

      let datasets = [];
      for (let i = 0, len = stations.length; i < len; i++) {
        const each_chunk = chunked_data[i];

        datasets.push({
          data: matchDataWithLabels(each_chunk, labels),
          label: stations[i],
          borderColor: color_lists[i] || '1E88E5',
          borderWidth: 1.2,
          fill: false
        });
      }

      return {
        labels: labels,
        datasets: datasets
      };
    }
  },

  watch: {
    selected_date: function(newVal) {
      this.$http({
        method: "get",
        url: `${this.$store.state.httpProtocal}://${this.$store.state.ip}${this.$store.state.port}/QueryMonitor/${newVal}`
      })
        .then(resp => {
          this.data = resp.data;
        })
        .catch(err => {});
    }
  },

  methods: {}
};
</script>

<style scoped>
.chart_frame {
  width: 100%;
  /* height: 520px; */
}
.card-header {
  padding-top: 5px;
  padding-bottom: 5px;
}
.card-footer {
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
