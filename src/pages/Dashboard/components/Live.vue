<template>
  <div class="star">
    <!-- <div class="star-container"></div>
    <div class="star-container"></div>
    <div class="star-container"></div>-->
    <starchart :options="chartOptions" />
  </div>
</template>
<script>
import { Chart } from "highcharts-vue";
import { mapState } from "vuex";
import Highcharts from "highcharts";
export default {
  name: "Live",
  components: {
    starchart: Chart
  },
    computed: {
        ...mapState({
            liveData: state => state.dashBoard.liveData,
        })
    },
    watch:{
        liveData(val){
            if(val){
                console.log(val,"111---live")
                let x = (new Date()).getTime(), // current time
                    y = val;
                this.chartOptions.series[0].data.push([x, y]);
            }else {
                console.log(val,"2222-live")
                let x = (new Date()).getTime(), // current time
                    y = val;
                this.chartOptions.series[0].data.push([x, y]);
            }

        }
    },
  data() {
      return {
          chartOptions : {
              chart: {
                  type: "spline",
                  animation: Highcharts.svg, // don't animate in old IE
                  marginRight: 10,
                  // events: {
                  //     load: function() {
                  //         // set up the updating of the chart each second
                  //         var series = this.series[0];
                  //         console.log(series,"series")
                  //         setInterval(function() {
                  //             var x = (new Date()).getTime(), // current time
                  //                 y = this.liveData;
                  //             series.addPoint([x, y], true, true);
                  //         }, 5000);
                  //     }
                  // }
              },

              time: {
                  useUTC: false
              },

              title: {
                  text: "Live Test Job Case Amount"
              },
              xAxis: {
                  type: "datetime",
                  tickPixelInterval: 100
              },
              yAxis: {
                  title: {
                      text: ""
                  },
                  plotLines: [
                      {
                          value: 0,
                          width: 1,
                          color: "#808080"
                      }
                  ]
              },
              credits: {
                  enabled: false
              },
              tooltip: {
                  headerFormat: "<b>{series.name}</b><br/>",
                  pointFormat: "{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}"
              },
              legend: {
                  enabled: false
              },
              exporting: {
                  enabled: false
              },
              series: [
                  {
                      name: "Test Job Case",
                      data: (function() {
                          // generate an array of random data
                          var data = [],
                              time = new Date().getTime(),
                              i;

                          for (i = -10; i <= 0; i += 1) {
                              data.push({
                                  x: time + i * 5000,
                                  y: 0
                              });
                          }
                          return data;
                      })()
                  }
              ]
          },
          liveValue:0
      };
  }
};
</script>

<style lang="less" scoped>
.star {
  padding: 20px;
  background: #fff;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
}
</style>