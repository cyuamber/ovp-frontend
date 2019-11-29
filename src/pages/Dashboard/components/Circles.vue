<template>
  <div class="circles">
    <h2>Task Flow</h2>
    <a-steps>
      <a-step status="wait" title="Unexecuted job">
        <a-icon type="schedule" slot="icon" />
      </a-step>

      <a-step status="finish" title="Executing job">
        <a-icon type="loading" slot="icon" />
      </a-step>
      <a-step status="finish" title="Finished job"></a-step>
    </a-steps>
    <circleschart style="margin-bottom:-50px" :options="chartOPtions" />
  </div>
</template>
<script>
import { Chart } from "highcharts-vue";
import { mapState } from "vuex";
export default {
  name: "Circles",
  components: {
    circleschart: Chart
  },
  computed: {
    ...mapState({
      testJobCirclesData: state => state.dashBoard.testJobCirclesData
    })
  },
  watch: {
    testJobCirclesData(val) {
      if (val) {
        this.initcircles();
      }
    }
  },
  data() {
    return {
      chartOPtions: {}
    };
  },
  methods: {
    initcircles() {
      this.chartOPtions = {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: 0,
          plotShadow: false
        },
        title: {
          text: "Test job",
          align: "center",
          verticalAlign: "middle",
          y: 60
        },
        credits: {
          enabled: false
        },
        tooltip: {
          pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>"
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: true,
              format: "<b>{point.name}</b>: {point.y:1f} ",
              distance: 50,
              style: {
                color: "white",
                fontSize: 14
              }
            },
            startAngle: -90,
            endAngle: 90,
            center: ["50%", "75%"],
            size: "110%"
          }
        },
        series: [
          {
            type: "pie",
            name: "Browser share",
            colorByPoint: true,
            innerSize: "50%",
            data: this.testJobCirclesData
          }
        ]
      };
    }
  }
};
</script>

<style lang="less" scoped>
.circles {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background: #fff;
  margin-bottom: 20px;
  padding: 30px;
  .progress {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }
}
</style>