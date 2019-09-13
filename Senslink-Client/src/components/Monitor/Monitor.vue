<template>
  <div class="monitor">
    <div class="px-3 py-3" style="background-color: #1976D2">
      <h4 style="display: table-cell; vertical-align: middle; color: white;">
        สถานี
      </h4>
    </div>

    <div class="mx-4 py-4">
      <Map 
        :stations="stations" 
        :gates="gates" 
        :time_now="time_now" 
      />
      <Chart />
      <Table />
    </div>
  </div>
</template>

<script>
const Map = () => import("@/components/Collections/Map.vue");
const Chart = () => import("@/components/Monitor/ChildChart.vue");
const Table = () => import("@/components/Monitor/ChildTable.vue");

import { mapState, mapGetters } from "vuex";

export default {
  name: "Monitor",

  components: {
    Map,
    Chart,
    Table
  },

  mixins: [],

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
      
    };
  },

  computed: {
    ...mapGetters("MonitorControl", ["getAdvisoryByStationId"]),
    ...mapGetters(["getUserAccLevel", "guard"]),
    ...mapState(["selected_station"])
  },

  watch: {
    
  },

  methods: {
    
  }
};
</script>

<style scoped>

</style>
