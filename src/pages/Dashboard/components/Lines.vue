<template>
  <div class="line">
    <linechart :options="chartOptions" />
  </div>
</template>
<script>
import moment from "moment";
import util from "../../../utils/utils";
import { Chart } from "highcharts-vue";
export default {
  name: "Lines",
  components: {
    linechart: Chart
  },
  mounted() {},
  data() {
    return {
      chartOptions: {
        title: {
          text: "Passed Test Case Amount in 7 Days"
        },
        credits: {
          enabled: false
        },
        xAxis: [
          {
            categories: util.getLastDaysPeriod(7),
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
        series: [
          {
            // name: "Test case amount",
            // type: "column",
            // yAxis: 1,
            // {
            name: "vFW",
            type: "column",
            data: [50, 30, 48, 66, 72, 39, 55]
          },
          {
            name: "vCPE",
            type: "column",
            data: [20, 130, 45, 70, 52, 33, 45]
          },
          {
            name: "vMME",
            type: "column",
            data: [60, 35, 41, 75, 21, 138, 55]
          },
          {
            name: "vGW",
            type: "column",
            data: [70, 39, 34, 37, 27, 35, 15]
          },
          {
            name: "vPCRF",
            type: "column",
            data: [60, 23, 24, 97, 82, 34, 35]
          },
          {
            name: "vDNS",
            type: "column",
            data: [50, 37, 48, 71, 120, 23, 55]
          }
          // {
          //   name: "Temperature",
          //   type: "spline",
          //   data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3],
          //   tooltip: {
          //     valueSuffix: "°C"
          //   }
          // }
        ]
      }
    };
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