<template>
  <div class="line">
    <linechart :options="chartOptions" />
  </div>
</template>
<script>
import { Chart } from "highcharts-vue";
import { mapState } from "vuex";
export default {
  name: "Lines",
  components: {
    linechart: Chart
  },
  data() {
    return {
      chartOptions: {}
    };
  },
  computed: {
    ...mapState({
      linesData: state => state.dashBoard.linesData
    })
  },
  watch: {
    linesData(val) {
      if (val) {
        this.initlines();
      }
    }
  },
  methods: {
    initlines() {
      this.chartOptions = {
        title: {
          text: "Passed Test Case Amount in " + 7 + " Days"
        },
        credits: {
          enabled: false
        },
        xAxis: [
          {
            categories: this.linesData.xAxis,
            crosshair: true
          }
        ],
        yAxis: [
          {
            // Primary yAxis
            labels: {
              format: "{value}",
              style: {}
            },
            title: {
              text: ""
            }
          }
        ],
        tooltip: {
          shared: true
        },
        legend: {},
        series: this.linesData.series
      };
    }
  }
};
</script>

<style lang="less" scoped>
.line {
  padding: 20px;
  background: #fff;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
}
</style>