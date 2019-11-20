<template>
  <div class="doughnut">
    <a-row type="flex">
      <a-col :span="8">
        <doughnutchart id="chart-sut" class="pie" :options="chartSut"></doughnutchart>
      </a-col>
      <a-col :span="8">
        <doughnutchart id="chart-jobs" class="pie" :options="chartJobs"></doughnutchart>
      </a-col>
      <a-col :span="8">
        <doughnutchart id="chart-env" class="pie" :options="chartEnv"></doughnutchart>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import { Chart } from "highcharts-vue";
import { mapGetters } from "vuex";
export default {
  name: "Doughnut",
  components: {
    doughnutchart: Chart
  },
  methods: {
    clickChart(type) {
      console.log("click:", type);
      window.location.href =
        window.location.origin + "/#/testjobmgt?status=" + type;
    }
  },
  data() {
    return {
      chartSut: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: "SUT Amount"
        },
        credits: {
          enabled: false
        },
        legend: {
          align: "center",
          verticalAlign: "top",
          borderWidth: 0
        },
        tooltip: {
          pointFormat:
            "Percent: <b>{point.percentage:.1f}%</b><br/>Total: <b>{point.y:1f}"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.y:1f}<br>",
              distance: -45,
              filter: {
                property: "percentage",
                operator: ">",
                value: 4
              }
            },
            showInLegend: true
          }
        },
        series: [
          {
            name: "SUT Amount",
            data: [
              { name: "VNF", y: 17, color: "#46b8e0" },
              { name: "PNF", y: 5, color: "#ffca52" },
              { name: "NFVI ", y: 5, color: "#34314b" }
            ]
          }
        ]
      },
      chartJobs: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: "Jobs Amount"
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat:
            "Percent: <b>{point.percentage:.1f}%</b><br/>Total: <b>{point.y:1f}"
        },
        legend: {
          align: "center",
          verticalAlign: "top",
          borderWidth: 0
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            showInLegend: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.y:1f}<br>",
              distance: -45,
              filter: {
                property: "percentage",
                operator: ">",
                value: 4
              }
            },
              events: {
                  click: ((e)=>this.chartJobsClick(e.point.name))
              }
          }
        },
        series: [
          {
            name: "Jobs Amount",
            allowPointSelect: true,
            data: [
              {
                name: "Success",
                y: 20,
                color: "#cae76e",
                events: {
                  click: () => {
                    this.clickChart("success");
                  }
                }
              },
              {
                name: "Failed",
                y: 2,
                color: "#e94e75",
                events: {
                  click: () => {
                    this.clickChart("fail");
                  }
                }
              }
            ]
          }
        ]
      },
      chartEnv: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie"
        },
        title: {
          text: "Test ENV Amount"
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat:
            "Percent: <b>{point.percentage:.1f}%</b><br/>Total: <b>{point.y:1f}"
        },
        legend: {
          align: "center",
          verticalAlign: "top",
          borderWidth: 0
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            showInLegend: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.y:1f}<br>",
              distance: -45,
              filter: {
                property: "percentage",
                operator: ">",
                value: 4
              }
            }
          }
        },
        series: [
          {
            name: "Test ENV Amount",
            data: [
              { name: "VNFM ", y: 17, color: "#ea9e9f" },
              { name: "VIM", y: 5, color: "#f9ebc9" },
              { name: "Test Instrument ", y: 5, color: "#a89c8e" }
            ]
          }
        ]
      }
    };
  },
    computed: {
        ...mapGetters(["updateBread"])
    },
    methods: {
        chartJobsClick(name){
            console.log(name,"----=>chartJobsClick")
            if(name === 'Success'){
                this.$store.commit("setCurrentMenu", ["Test Job MGT"]);
                this.$store.commit("setBreadcrumb", ["Test Job MGT"]);
                this.$router.push({ path: "testjobmgt" });
            }
        }
    }
};
</script>

<style lang="less" scoped>
.doughnut {
  // display: flex;
  // justify-content: space-around;
  background: #fff;
  padding-top: 30px;
  // box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
  .pie {
    // width: 250px;
    // display: inline-block;
  }
}
</style>