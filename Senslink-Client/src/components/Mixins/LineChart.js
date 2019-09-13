import { Line, mixins } from "vue-chartjs";

export default {
  extends: Line,

  props: ["options"],

  mixins: [mixins.reactiveProp],

  watch: {
    options: {
      handler(newVal) {
        var self = this;
        self.renderChart(self.chartData, newVal);
      },
      deep: true
    }
  },

  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.options);
  }
};
