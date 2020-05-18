<template>
  <div class="dashboard-block">
    <div class="dashboard-block_chart__top">
      <a-row type="flex" :gutter="16" justify="space-around" align="top">
        <a-col :span="10">
          <Live />
        </a-col>
        <a-col :span="14">
          <Lines />
        </a-col>
      </a-row>
    </div>
    <div class="dashboard-block_chart__bottom">
      <div class="bottom_left">
        <Circles />
      </div>
      <div class="bottom_right">
        <Doughnut />
      </div>
    </div>
  </div>
</template>

<script>
import Circles from "./components/Circles";
import Doughnut from "./components/Doughnut";
import Lines from "./components/Lines";
import Live from "./components/Live";
import { mapActions } from "vuex";
export default {
  name: "Dashboard",
  components: { Circles, Doughnut, Lines, Live },
  data() {
    return {
      liveChartsTimer: ""
    };
  },
  mounted() {
    this.initDashBoard();
  },
  methods: {
    ...mapActions("dashBoard", [
      "getLiveData",
      "getLinesData",
      "getTestJobCirclesData",
      "getSUTAmountData",
      "getJobAmountData",
      "getTestEnvAmountData",
      "clearData"
    ]),
    initDashBoard() {
      this.clearData();
      this.getLiveData({
        message: this.$message
      });
      this.liveChartsTimer = setInterval(() => {
        this.getLiveData({
          message: this.$message
        });
      }, 10000);
      this.getLinesData({
        message: this.$message
      });
      this.getTestJobCirclesData({
        message: this.$message
      });
      this.getSUTAmountData({
        message: this.$message
      });
      this.getJobAmountData({
        message: this.$message
      });
      this.getTestEnvAmountData({
        message: this.$message
      });
    }
  },
  beforeDestroy: function() {
    clearInterval(this.liveChartsTimer);
  }
};
</script>
<style lang="less" scoped>
.dashboard-block {
  .dashboard-block_chart__top {
    width: 100%;
    background: #fff;
  }
  .dashboard-block_chart__bottom {
    width: 100%;
    height: 100%;
    margin-top: 30px;
    background: #fff;

    .bottom_left {
      display: flex;
      align-items: center;
      width: 100%;
      margin-right: 20px;
      margin-bottom: 20px;
      box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
    }
    .bottom_right {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>