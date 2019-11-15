<template>
  <div class="row">
    <rowchart :options="chartOptions"></rowchart>
  </div>
</template>
<script>
import { Chart } from "highcharts-vue";
export default {
  name: "Row",
  components: {
    rowchart: Chart
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "bar"
        },
        title: {
          text: ""
        },
        xAxis: {
          categories: ["vFW", "vCPE", "vMME", "vGW", "vPCRF", "vDNS"],
          lineWidth: 0
          // title: {
          //   text: null
          // }
        },
        yAxis: {
          min: 0,
          lineWidth: 0,
          title: {
            text: "Test case",
            align: "high"
          },
          labels: {
            overflow: "justify"
          }
        },
        tooltip: {
          valueSuffix: " millions"
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          }
        },
        legend: {
          align: "center",
          verticalAlign: "top",
          x: 0,
          y: 0
        },
        credits: {
          enabled: false
        },
        series: [
          {
            colorByPoint: true,
            data: [20, 30, 60, 46, 59, 32],
            showInLegend: false
          }
        ]
      }
    };
  }
};
</script>

<style lang="less" scoped>
.row {
  width: 100%;
  background: #fff;
  padding: 10px;
}
</style>