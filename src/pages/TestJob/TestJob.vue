<template>
  <div class="test-job__container">
    <Loading :loadingMessage="loadingMessage" />
    <div class="test-job__top">
      <a-button type="primary" @click="handleCreate">Create Test Job</a-button>
      <a-select
        class="select"
        :defaultValue="dashboardJumpStatus"
        @change="handleSelectStatusChange"
      >
        <a-select-option v-for="status of statusOptions" :key="status" :value="status">{{status}}</a-select-option>
      </a-select>
      <a-date-picker class="calendar" @change="handleSelectCreateTime" placeholder="Select date" />
    </div>
    <div class="test-job__table">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        :loading="tableLoading"
        rowKey="index"
        size="default"
        :pagination="pagination"
        :scroll="{x: 1630}"
        @change="handlePageChange"
      >
        <span slot="status" slot-scope="status">
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{status}}</span>
            </template>
            <span class="test-job__showState" :style="getStatusStyle(status)"></span>
          </a-tooltip>
        </span>
        <span slot="action" slot-scope="action,record">
          <a-tag
            v-for="item in record.actions"
            :key="item"
            class="test-job__tag"
            :color="getActionsColor(record.actions,item)"
            @click="(()=> handleActions(item,record))"
          >{{item}}</a-tag>
        </span>
      </a-table>
    </div>
    <Drawer :isShow="isShow" :isEdit="isEdit" />
  </div>
</template>

<script>
import { testJobColumns } from "../../const/constant.js";
import { statusOptions } from "./constants";
import Loading from "../../components/Loading/Loading";
import Drawer from "./Drawer";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "TestJob",
  data() {
    return {
      columns: testJobColumns,
      statusOptions: statusOptions,
      loading: false,
      tableQueryTimer: "",
      isEdit: false
    };
  },
  computed: {
    ...mapState({
      isShow: state => state.testJob.isShow,
      loadingMessage: state => state.testJob.loadingMessage,
      tableData: state => state.testJob.tableData,
      pagination: state => state.testJob.pagination,
      tableLoading: state => state.testJob.tableLoading,
      testJobSingleData: state => state.testJob.testJobSingleData,
      lang: state => state.router.lang
    }),
    dashboardJumpStatus: {
      get() {
        return this.$store.state.testJob.dashboardJumpStatus;
      }
    }
  },
  components: { Drawer, Loading },
  created() {
    if (window.location.href.includes("?")) {
      let JumpStatus = window.location.href.split("?")[1].split("=")[1];
      this.updateDashboardJumpStatus(JumpStatus);
    }
  },
  mounted() {
    this.initTestJobTable();
  },
  methods: {
    ...mapActions("testJob", [
      "getTableData",
      "runTestJobMGT",
      "delete",
      "download",
      "stopJop",
      "getSUTType",
      "getVNFMOption",
      "getVIMOption",
      "getMANOOption",
      "getTestInstrumentOption",
      "getEditTestJob"
    ]),
    ...mapMutations("testJob", [
      "setIsShow",
      "setFilter",
      "updateDashboardJumpStatus",
      "clearSearchKeyword"
    ]),
    initTestJobTable() {
      this.getTableData({ bool: false });
      // this.tableQueryTimer = setInterval(() => {
      //   this.getTableData({bool:false,loading:false});
      // }, 5000);
    },
    handleCreate() {
      this.isEdit = false;
      this.setIsShow(true);
      this.getSUTType({
        message: this.$message
      });
      this.getVNFMOption({
        message: this.$message
      });
      this.getVIMOption({
        message: this.$message
      });
      this.getMANOOption({
        message: this.$message
      });
      this.getTestInstrumentOption({
        message: this.$message
      });
    },
    handleSelectCreateTime(date, d) {
      this.setFilter({ time: d });
      this.getTableData({ bool: true });
    },
    handleSelectStatusChange(val) {
      if (window.location.href.includes("?")) {
        window.location.href = window.location.href.split("?")[0];
      }
      this.updateDashboardJumpStatus("All");
      if (val === "All") this.clearSearchKeyword(val);
      this.setFilter({
        key: val
      });
      this.getTableData({ bool: true });
    },
    handleActions(action, data) {
      if (action === "Start") this.handleStart(data);
      else if (action === "Edit") this.handleEdit(data);
      else if (action === "Delete") this.handleDelete(data);
      else if (action === "More") this.handleOpenDetail(data);
      else if (action === "Download") this.handleDownload(data);
      else if (action === "Stop") this.handleStop(data);
    },
    handleStart(data) {
      data.currentAction = "Start";
      this.$store.commit("setCurrentMenu", ["Test Job MGT"]);
      this.$store.commit("setBreadcrumb", ["Test Job MGT"]);
      this.$confirm({
        title: "Are you sure start this task?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          this.runTestJobMGT({
              data,
              message: this.$message
          });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    },
    handleEdit(data) {
      this.isEdit = true;
      this.setIsShow(true);
      this.getEditTestJob({
          data,
          message: this.$message
      });
      this.getSUTType({
        message: this.$message
      });
      this.getVNFMOption({
        message: this.$message
      });
      this.getVIMOption({
        message: this.$message
      });
      this.getMANOOption({
        message: this.$message,
        pageSize: 100
      });
      this.getTestInstrumentOption({
        message: this.$message,
        pageSize: 100
      });
    },
    handleDelete(data) {
      this.$confirm({
        title: "Are you sure delete this task?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          this.delete({
              data,
              message: this.$message
          });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    },
    handleDownload(data) {
      this.$confirm({
        title: "Are you sure download this task?",
        content: "jobId: " + data.jobId,
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          this.download({ jobId: data.jobId, lang: this.lang });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    },
    handleOpenDetail(data) {
      data.currentAction = "More";
      this.$router.push({ name: "JobDetail", params: data });
    },
    handlePageChange(pageObj) {
      this.setFilter({ pageObj });
      this.getTableData({ bool: true });
    },
    handleStop(data) {
      // The analog call interface changes a single piece of data in a single table
      this.$confirm({
        title: "Are you sure stop this task?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          this.stopJop({
              data,
              message: this.$message
          });
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    },
    getStatusTitle(status) {
      switch (status) {
        case "CREATED":
          status = "Waiting to execute";
          break;
        case "STARTED":
          status = "Waiting to execute";
          break;
        case "RUNNING":
          status = "Executing";
          break;
        case "DONE":
          status = "Execution completed";
          break;
        case "FAILED":
          status = "Execution failed";
          break;
        default:
          status = "";
          break;
      }
      return status;
    },
    getStatusStyle(status) {
      let color = "#979797";
      switch (status) {
        case "RUNNING":
          color = "#F5A623";
          break;
        case "CREATED":
          color = "#78E5D7";
          break;
        case "UPDATED":
          color = "#2db7f5";
          break;
        case "DONE":
          color = "#7ED321";
          break;
        case "FAILED":
          color = "#D0021B";
          break;
        default:
          break;
      }
      return { backgroundColor: color };
    },
    getActionsColor(actions, item) {
      return item === actions[0]
        ? "blue"
        : item === actions[1]
        ? "green"
        : item === actions[2]
        ? "red"
        : item === actions[3]
        ? "#D3B230"
        : "purple";
    }
  },
  beforeDestroy: function() {
    clearInterval(this.tableQueryTimer);
  }
};
</script>
<style lang="less" scope>
.test-job__container {
  .test-job__top {
    margin-bottom: 30px;
    .select {
      width: 150px;
      margin-left: 30px;
    }
    .calendar {
      float: right;
      width: 280px;
    }
  }
  .test-job__table {
    .test-job__showState {
      display: block;
      margin: 0 auto;
      width: 15px;
      height: 15px;
      border-radius: 50%;
    }
    .test-job__tag {
      line-height: 20px;
      padding: 0 8px;
      border-radius: 12px;
      font-size: 14px;
    }
  }
  .tab-content__button {
    display: inline-block;
    width: 240px;
    margin-left: 40px;
    /deep/ .ant-input {
      border-radius: 20px;
    }
  }
}
</style>