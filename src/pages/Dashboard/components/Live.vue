<template>
  <div class="star">
    <starchart :options="chartOptions" />
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue'
import { mapState } from 'vuex'
import Highcharts from 'highcharts'
export default {
  name: 'Star',
  components: {
    starchart: Chart
  },
  computed: {
    ...mapState({
      liveData: state => state.dashBoard.liveData
    })
  },
  watch: {
    liveData: {
      handler: function(val) {
        this.initLive(val)
      },
      deep: true
    }
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: 'spline',
          animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10
        },

        time: {
          useUTC: false
        },

        title: {
          text: 'Live Test Job Case Amount'
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 100
        },
        yAxis: {
          title: {
            text: null
          },
          plotLines: [
            {
              value: 0,
              width: 1,
              color: '#808080'
            }
          ]
        },
        credits: {
          enabled: false
        },
        tooltip: {
          headerFormat: '<b>{series.name}: {point.y:f}</b><br/>',
          pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>'
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [
          {
            name: 'Test Job Case',
            data: (function() {
              // generate an array of random data
              var data = [],
                time = new Date().getTime()

              for (var i = -10; i <= 0; i += 1) {
                data.push({
                  x: time + i * 5000,
                  y: 0
                })
              }
              return data
            })()
          }
        ]
      }
    }
  },
  methods: {
    initLive(val) {
      this.chartOptions.series[0].data.push([val.x, val.y])
    }
  }
}
</script>

<style lang="less" scoped>
.star {
  padding: 20px;
  background: #fff;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
}
</style>
