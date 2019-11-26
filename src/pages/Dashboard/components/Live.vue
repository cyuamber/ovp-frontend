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
                console.log(val,"val----live")
                this.initLive(val);
            }
        }
    },
  data() {
    return {
      chartOptions:{}
    };
  },
    methods: {
        initLive(val){
            this.chartOptions = {
                chart: {
                    type: "spline",
                        animation: Highcharts.svg, // don't animate in old IE
                        marginRight: 10,
                        events: {
                        load: function() {
                            // set up the updating of the chart each second
                            var series = this.series[0];
                            setInterval(function() {
                                var x = new Date().getTime(), // current time
                                    y = val;
                                console.log(this.liveData,"----this.liveData")
                                series.addPoint([x, y], true, true);
                            }, 2000);
                        }
                    }
                },

                time: {
                    useUTC: false
                },

                title: {
                    text: "Live Test Job Case Amount"
                },
                xAxis: {
                    type: "datetime",
                        tickPixelInterval: 150
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
                            console.log(this.liveData,"this.liveData")
                            for (i = -19; i <= 0; i += 1) {
                                data.push({
                                    x: time + i * 2000,
                                    y: val
                                });
                            }
                            return data;
                        })()
                    }
                ]
            }
        }
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