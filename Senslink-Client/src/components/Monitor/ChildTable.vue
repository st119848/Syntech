<template>
    <div class="chart">
        <b-card class="chart_frame">
        <div slot="header">
            Table
        </div>

        <b-card-body class="p-0">
            <!-- {{tableGenerator}} -->
            <b-table
                hover
                small
                bordered
                responsive="sm"
                :items="tableGenerator"
                :fields="tableFields"
                :current-page="currentPage"
                :per-page="perPage"
            >
                <template slot="table-caption">
                    {{ tableCaption }}
                </template>
            </b-table>

            <b-row>
                <b-col md="6" class="my-1">
                    <div class="overflow-auto">
                    <b-pagination
                        v-model="currentPage"
                        :total-rows="totalRows"
                        :per-page="perPage"
                        class="my-0"
                    ></b-pagination>
                    </div>
                </b-col>
            </b-row>
        </b-card-body>
        
        </b-card>
    </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

import moment from "moment-timezone";
import { stat, statSync } from "fs";

export default {
    name: "Table",

    components: {

    },

    data() {
        return {
            currentPage: 1,
            totalRows: 1,
            perPage: 18,
        };
    },

    created() {
        
    },

    computed: {
        ...mapState("Monitor", [
            "sync_chart_table"
        ]),

        tableFields() {
            let fields = [
                { key: "timestamp", label: "เวลา" },
            ];

            let stations = this.sync_chart_table.datasets.map(o => o?.label);

            stations.forEach((o, index) => {
                fields.push(
                    { key: `s${index}`, label: o }
                )
            })

            return fields;
        },

        tableGenerator() {
            let parsedData = [];

            let labels = this.sync_chart_table.labels;
            let datas = this.sync_chart_table.datasets.map(o => o?.data);

            for (let i = 0, len = labels.length; i < len; i++) {
                let obj = {timestamp: labels[i]};
                datas.forEach((o, index) => {
                    obj[`s${index}`] = o[i];
                })

                parsedData.push(obj);
            }

            return parsedData;
        },

        tableCaption() {
            let start =
                Array.isArray(this.tableGenerator) && this.tableGenerator.length > 0
                ? (this.currentPage - 1) * this.perPage || 1
                : 0;
            let end =
                this.tableGenerator.length > this.perPage * this.currentPage
                ? this.perPage * this.currentPage
                : this.tableGenerator.length;
            let all = this.tableGenerator.length;

            return `แสดงผล ${start} ถึง ${end} จากทั้งหมด ${all}`;
        }
        
    },

    watch: {
        sync_chart_table: function(newVal) {
            this.totalRows = newVal.labels.length;
        }
    },

    methods: {
      
    }
};
</script>

<style scoped>

</style>
