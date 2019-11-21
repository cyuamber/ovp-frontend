<template>
  <div class="line">
    <linechart :options="chartOptions" />
  </div>
</template>
<script>
// import moment from "moment";
// import util from "../../../utils/utils";
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
          linesData: state => state.dashBoard.linesData,
      })
  },
  mounted() {
      this.initlines();
  },
  methods: {
      initlines(){
          this.chartOptions = {
              title: {
                  text: "Passed Test Case Amount in "+this.linesData.xAxis.length+" Days"
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
                          style: {
                              // color: Highcharts.getOptions().colors[1]
                          }
                      },
                      title: {
                          text: "",
                          style: {
                              // color: Highcharts.getOptions().colors[1]
                          }
                      }
                  }
                  // {
                  //   // Secondary yAxis
                  //   title: {
                  //     text: "Pass rate",
                  //     style: {
                  //       // color: Highcharts.getOptions().colors[0]
                  //     }
                  //   },
                  //   labels: {
                  //     format: "{value} %",
                  //     style: {
                  //       // color: Highcharts.getOptions().colors[0]
                  //     }
                  //   },
                  //   opposite: true
                  // }
              ],
                  tooltip: {
                  shared: true
              },
              legend: {
                  // layout: "vertical",
                  // align: "left",
                  // x: 120,
                  // verticalAlign: "top",
                  // y: 100,
                  // floating: true,
                  // backgroundColor: "rgba(255,255,255,0.25)"
              },
              series: this.linesData.series
          }
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