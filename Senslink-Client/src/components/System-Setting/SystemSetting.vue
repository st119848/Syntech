<template>
  <div class="system_setting">
    <b-card no-body>
      <b-tabs pills card>
        <b-tab title="ผู้ใช้งาน" active>
          <User />
        </b-tab>

        <b-tab title="สถานีวัดระดับน้ำ">
          <Station />
        </b-tab>

        <b-tab title="ประตูน้ำ">
          <Gate />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
const User = () => import("@/components/System-Setting/Childs/User.vue");
const Station = () => import("@/components/System-Setting/Childs/Station.vue");
const Gate = () => import("@/components/System-Setting/Childs/Gate.vue");

export default {
  name: "SystemSetting",

  components: {
    User,
    Station,
    Gate
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
