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
import { mapState } from "vuex";
export default {
  name: "Doughnut",
  components: {
    doughnutchart: Chart
  },
    computed: {
        ...mapState({
            SUTAmountData: state => state.dashBoard.SUTAmountData,
            jobAmountData: state => state.dashBoard.jobAmountData,
            testEnvAmountData: state => state.dashBoard.testEnvAmountData
        })
    },
    watch:{
        SUTAmountData(val){
            if(val){
                this.initSUTAmount();
            }
        },
        jobAmountData(val){
            if(val){
                this.initjobAmount();
            }
        },
        testEnvAmountData(val){
            if(val){
                this.initTestEnvAmount();
            }
        }
    },
  methods: {
      initSUTAmount(){
          this.chartSut = {
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
                      data: this.SUTAmountData
                  }
              ]
          }
      },
      initjobAmount(){
          this.chartJobs = {
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
                  }
              },
              series: [
                  {
                      name: "Jobs Amount",
                      allowPointSelect: true,
                      data:this.jobAmountData
                  }
              ]
          }
      },
      initTestEnvAmount(){
          this.chartEnv = {
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
                      data: this.testEnvAmountData
                  }
              ]
          }
      }
  },
  data() {
    return {
      chartSut: {},
      chartJobs: {},
      chartEnv: {}
    };
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