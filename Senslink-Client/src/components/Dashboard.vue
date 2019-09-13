<template>
    <div class="dashboard">
        <div class="px-3 py-3" style="background-color: #1976D2">
            <h4 style="display: table-cell; vertical-align: middle; color: white;">
                หน้าหลัก
            </h4>
        </div>

        <div class="mx-4 py-4">
            <Map 
                :stations="stations" 
                :gates="gates" 
                :time_now="time_now" 
            />
            <Chart />
            <Gate />
        </div>
  </div>
</template>

<script>
const Map = () => import("@/components/Collections/Map.vue");
const Chart = () => import("@/components/Collections/Chart.vue");
const Gate = () => import("@/components/Collections/Gate.vue");

import { mapState, mapGetters } from "vuex";

export default {
    name: "Dashboard",

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

    components: {
        Map,
        Chart,
        Gate
    },

    data() {
        return {
        
        };
    },

    created() {
        
    },

    computed: {
        ...mapState([""]),

        
    },

    watch: {
        
    },

    methods: {}
};
</script>


<style scoped>


</style>
