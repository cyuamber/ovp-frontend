<template>
  <div class="testCasePie">
    <doughnutchart
      id="chart-jobs"
      class="pie"
      :options="chartJobs"
    ></doughnutchart>
  </div>
</template>
<script>
import { Chart } from 'highcharts-vue'
import { mapState } from 'vuex'
export default {
  name: 'testCasePie',
  components: {
    doughnutchart: Chart
  },
  computed: {
    ...mapState({
      testCasePieData: state => state.testJob.testCasePieData
    })
  },
  data() {
    return {
      chartJobs: {}
    }
  },
  mounted() {
    this.initTestCasePie()
  },
  methods: {
    initTestCasePie() {
      this.chartJobs = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'Test Case',
          style: { color: '#000', opacity: 0.6 },
          floating: true,
          y: 220
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat:
            'Percent: <b>{point.percentage:.1f}%</b><br/>Total: <b>{point.y:1f}</b>'
        },
        legend: {
          align: 'center',
          verticalAlign: 'top',
          borderWidth: 0
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            showInLegend: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.y:1f}<br>',
              distance: -45,
              filter: {
                property: 'percentage',
                operator: '>',
                value: 4
              }
            }
          }
        },
        series: [
          {
            name: 'Test Case',
            data: this.testCasePieData
          }
        ]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.testCasePie {
  background: #fff;
}
</style>
