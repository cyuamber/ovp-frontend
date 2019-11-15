<template>
  <div class="column">
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>
<script>
import { Chart } from "highcharts-vue";

export default {
  name: "Column",
  components: {
    highcharts: Chart
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "solidgauge"
        },
        title: null,
        credits: {
          enabled: false
        },
        // events: {
        //   load: function() {
        //     // Bring life to the dials
        //     // setInterval(function() {
        //     //   // Speed
        //     //   var point, newVal, inc;
        //     //   var series = this.series[0];
        //     //   point = series.points[0];
        //     //   inc = Math.round((Math.random() - 0.5) * 100);
        //     //   newVal = point.y + inc;
        //     //   if (newVal < 0 || newVal > 200) {
        //     //     newVal = point.y - inc;
        //     //   }
        //     //   point.update(newVal);
        //     // }, 2000);
        //   }
        // },
        pane: {
          center: ["50%", "85%"],
          size: "140%",
          startAngle: -90,
          endAngle: 90,
          background: {
            backgroundColor: "#fff",
            innerRadius: "60%",
            outerRadius: "100%",
            shape: "arc"
          },

          tooltip: {
            enabled: false
          },
          plotOptions: {
            solidgauge: {
              dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
              }
            }
          },
          yAxis: {
            min: 0,
            max: 200,
            title: {
              text: "Speed"
            },
            stops: [
              [0.1, "#55BF3B"], // green
              [0.5, "#DDDF0D"], // yellow
              [0.9, "#DF5353"] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            // title: {
            //   y: -70
            // },
            labels: {
              y: 16
            }
          },
          series: [
            {
              name: "Speed",
              data: [80],
              dataLabels: {
                format:
                  '<div style="text-align:center">' +
                  '<span style="font-size:25px">{y}</span><br/>' +
                  '<span style="font-size:12px;opacity:0.4">km/h</span>' +
                  "</div>"
              },
              tooltip: {
                valueSuffix: " km/h"
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    // The RPM gauge
    // var chartRpm = Highcharts.chart(
    //   "container-rpm",
    //   Highcharts.merge(gaugeOptions, {
    //     yAxis: {
    //       min: 0,
    //       max: 5,
    //       title: {
    //         text: "RPM"
    //       }
    //     },
    //     series: [
    //       {
    //         name: "RPM",
    //         data: [1],
    //         dataLabels: {
    //           format:
    //             '<div style="text-align:center">' +
    //             '<span style="font-size:25px">{y:.1f}</span><br/>' +
    //             '<span style="font-size:12px;opacity:0.4">' +
    //             "* 1000 / min" +
    //             "</span>" +
    //             "</div>"
    //         },
    //         tooltip: {
    //           valueSuffix: " revolutions/min"
    //         }
    //       }
    //     ]
    //   })
    // );
  }
};
</script>

<style lang="less" scoped>
.column {
  width: 100%;
  margin-top: 20px;
  background: #fff;
}
</style>