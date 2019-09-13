<template>
  <div class="historical_data">
    <b-card no-body>
      <b-tabs pills card>
        <b-tab title="สถานีวัดระดับน้ำ" active>
          <Monitor />
        </b-tab>

        <b-tab title="ประตูน้ำ">
          <Controller />
        </b-tab>

        <b-tab title="บันทึกการสั่งการ">
          <GatesUpdate />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
const Monitor = () => import("@/components/Historical-Data/Childs/Monitor.vue");
const Controller = () =>
  import("@/components/Historical-Data/Childs/Controller.vue");
const GatesUpdate = () =>
  import("@/components/Historical-Data/Childs/GatesUpdate.vue");

import { mapState, mapActions } from "vuex";

export default {
  name: "HistoricalData",
  components: {
    Monitor,
    Controller,
    GatesUpdate
  },
  data() {
    return {};
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {}
};
</script>

<style scoped></style>
