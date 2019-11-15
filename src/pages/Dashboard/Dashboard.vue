<template>
  <div class="dashboard-block">
    <div class="dashboard-block_chart__top">
      <a-row type="flex" :gutter="16" justify="space-around" align="top">
        <a-col :span="10">
          <Live />
        </a-col>
        <a-col :span="14">
          <!-- <Doughnut /> -->
          <Lines />
        </a-col>
        <!-- <a-col :span="6">
          <Doughnut />
        </a-col>-->
      </a-row>
    </div>
    <div class="dashboard-block_chart__bottom">
      <div class="bottom_left">
        <Circles />
        <!-- <Doughnut /> -->
        <!-- <Row /> -->
      </div>
      <div class="bottom_right">
        <!-- <Circles /> -->
        <Doughnut />
        <!-- <Lines /> -->
      </div>
    </div>
  </div>
</template>

<script>
import Circles from "./components/Circles";
import Column from "./components/Column";
import Doughnut from "./components/Doughnut";
import Lines from "./components/Lines";
import Row from "./components/Row";
import Live from "./components/Star";

export default {
  name: "Dashboard",
  components: { Circles, Column, Doughnut, Lines, Row, Live }
};
</script>
<style lang="less" scoped>
.dashboard-block {
  .dashboard-block_chart__top {
    width: 100%;
    background: #fff;
    // box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
  }
  .dashboard-block_chart__bottom {
    width: 100%;
    height: 100%;
    // display: flex;
    justify-content: space-around;
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