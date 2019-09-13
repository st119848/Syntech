<template>
  <div class="chart">
    <b-card no-body class="overflow-hidden">
        <h2 slot="header" class="py-0">
            <div class="m-md-1">
                ทรบ. ท่อทองแดง
            </div>
        </h2>
        <b-row no-gutters align-v="center">
            <b-col md="12" lg="4">
                <b-card-body>
                    <b-card-text>
                        <b-list-group>
                        <b-list-group-item variant="info" class="d-flex justify-content-between align-items-center">
                            ปริมานการไหลของน้ำทั้งหมด
                            <div>{{calcQs}} ลบ.ม./วินาที</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 1
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 2
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 3
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 4
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        </b-list-group>
                    </b-card-text>
                </b-card-body>
            </b-col>
            <b-col class="px-1" md="12" lg="8">
                <b-row class="m-3 h-100">
                    <b-col cols="12">
                        <b-row>
                            <div class="gate-container">
                                <b-img
                                    :src="require('../../assets/4gate.svg')"
                                    alt="4gate image"
                                />
                                <div class="four-water-one" style="color: white;">21 ซม</div>
                                <div class="four-water-two" style="color: white;">21 ซม</div>
                                <div class="four-water-three" style="color: white;">21 ซม</div>
                                <div class="four-water-four" style="color: white;">21 ซม</div>

                                <div class="four-gate-one" :style="gateFourStyle" />
                                <div class="four-gate-two" :style="gateFourStyle" />
                                <div class="four-gate-three" :style="gateFourStyle" />
                                <div class="four-gate-four" :style="gateFourStyle" />
                            </div>
                        </b-row>
                        <b-row>
                            <div
                                class="w-100 d-flex justify-content-between"
                                style="padding-left: 13%; padding-right: 11%"
                            >
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                            </div>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-card>

    <b-card no-body class="overflow-hidden">
        <h2 slot="header" class="py-0">
            <div class="m-md-1">
                ทรบ. ท่อทองแดง
            </div>
        </h2>
        <b-row no-gutters align-v="center">
            <b-col md="12" lg="4">
                <b-card-body>
                    <b-card-text>
                        <b-list-group>
                        <b-list-group-item variant="info" class="d-flex justify-content-between align-items-center">
                            ปริมานการไหลของน้ำทั้งหมด
                            <div>{{calcQs}} ลบ.ม./วินาที</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 1
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 2
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 3
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 4
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        <b-list-group-item class="d-flex justify-content-between align-items-center">
                            ระยะยก ประตู 5
                            <div>21 ซม.</div>
                        </b-list-group-item>
                        </b-list-group>
                    </b-card-text>
                </b-card-body>
            </b-col>
            <b-col class="px-1" md="12" lg="8">
                <b-row class="m-3 h-100">
                    <b-col cols="12">
                        <b-row>
                            <div class="gate-container">
                                <b-img
                                    :src="require('../../assets/5gate.svg')"
                                    alt="5gate image"
                                />
                                <div class="five-water-one">21 ซม</div>
                                <div class="five-water-two">21 ซม</div>
                                <div class="five-water-three">21 ซม</div>
                                <div class="five-water-four">21 ซม</div>
                                <div class="five-water-five">21 ซม</div>

                                <div class="five-gate-one" :style="gateFiveStyle" />
                                <div class="five-gate-two" :style="gateFiveStyle" />
                                <div class="five-gate-three" :style="gateFiveStyle" />
                                <div class="five-gate-four" :style="gateFiveStyle" />
                                <div class="five-gate-five" :style="gateFiveStyle" />
                            </div>
                        </b-row>
                        <b-row>
                            <div
                                class="w-100 d-flex justify-content-between"
                                style="padding-left: 9.5%; padding-right: 7.5%"
                            >
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                                <p style="font-size: 1.4vw;">ประตู 1</p>
                            </div>
                        </b-row>
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import moment from "moment-timezone";
import { stat, statSync } from "fs";


export default {
  name: "Gate",

  data() {
    return {
      
    };
  },

  created() {
    
  },

  computed: {
    ...mapState([""]),

    calcQs() {
      const hu = 77.59;
      const E1 = 73.22;
      const Gw = 2.9;

      let n = 4;
      let Go = 0.80;

      let Ao = Gw * n * Go;
      let cdf = 0.8611 * Math.pow((Ao / (hu - E1)), 0.6773);
      let Qs = cdf * (hu - E1) * Math.sqrt(2 * 9.81 * ((hu - E1) - (0.61 * Go)));

      return Qs.toFixed(2);
    },

    gateFourStyle() {
      return {
        'background-color': '#283747',
        // 'height': '47.5%',
        'height': '37.5%',
        'width': '15.5%'
      }
    },

    gateFiveStyle() {
      return {
        'background-color': '#283747',
        'height': '37.5%',
        'width': '12.2%'
      }
    }
  },

  watch: {
    
  },

  methods: {}
};
</script>

<style scoped>
.card-header {
  padding-top: 0px;
  padding-bottom: 0px;
}

.gate-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding-bottom: 591.44px / 1127.34px * 100%;
}

/**
    4 GATES
 */
.four-water-one {
    position: absolute;
    top: 41.5%;
    left: 13.5%;
    font-size: 1.2vw; 
}
.four-water-two {
    position: absolute;
    top: 41.5%;
    left: 37.5%;
    font-size: 1.2vw; 
}
.four-water-three {
    position: absolute;
    top: 41.5%;
    left: 60.5%;
    font-size: 1.2vw; 
}
.four-water-four {
    position: absolute;
    top: 41.5%;
    left: 83.5%;
    font-size: 1.2vw; 
}

.four-gate-one {
  position: absolute;
  top: 48.0%;
  left: 8.3%;
}
.four-gate-two {
  position: absolute;
  top: 48.0%;
  left: 31.6%;
}
.four-gate-three {
  position: absolute;
  top: 48.0%;
  left: 54.8%;
}
.four-gate-four {
  position: absolute;
  top: 48.0%;
  left: 78.0%;
}

/**
    5 GATES
 */
.five-water-one {
    position: absolute;
    top: 40.0%;
    left: 10.8%;
    font-size: 1.1vw; 
    color: white;
}
.five-water-two {
    position: absolute;
    top: 40.0%;
    left: 29.8%;
    font-size: 1.1vw; 
    color: white;
}
.five-water-three {
    position: absolute;
    top: 40.0%;
    left: 48.8%;
    font-size: 1.1vw; 
    color: white;
}
.five-water-four {
    position: absolute;
    top: 40.0%;
    left: 66.8%;
    font-size: 1.1vw; 
    color: white;
}
.five-water-five {
    position: absolute;
    top: 40.0%;
    left: 85.8%;
    font-size: 1.1vw; 
    color: white;
}

.five-gate-one {
  position: absolute;
  top: 47.6%;
  left: 7.2%;
}
.five-gate-two {
  position: absolute;
  top: 47.6%;
  left: 26.0%;
}
.five-gate-three {
  position: absolute;
  top: 47.6%;
  left: 44.7%;
}
.five-gate-four {
  position: absolute;
  top: 47.6%;
  left: 63.5%;
}
.five-gate-five {
  position: absolute;
  top: 47.6%;
  left: 82.3%;
}
</style>
