<template>
  <div class="job-detail">
    <Loading :loadingMessage="loadingMessage" />
    <div>
      <p class="job-detail__back-btn" @click="handleBack">
        <a-icon type="left" />&nbsp;Back
      </p>
    </div>
    <div class="job-detail__progress-container">
      <a-progress
        :percent="percent"
        :showInfo="true"
        :status="progressStatus"
        class="job-detail__progress"
      />
      <a-button
        class="job-detail__refresh-btn"
        @click="handleRefresh"
        :disabled="$route.query.detail.jobStatus === 'DONE'"
      >
        <a-icon type="sync" />Refresh
      </a-button>
    </div>
    <a-spin tip="Loading..." :spinning="detailLoading" size="large">
      <div class="job-detail__content">
        <div class="job-detail__info">
          <a-card title="Test Job Info">
            <a-row>
              <a-col :span="9">
                <!-- <h2 class="job-detail__info-title">Test Job Info</h2> -->
                <div
                  v-for="(item,index) in infoList"
                  :key="index"
                  class="job-detail__item-container"
                >
                  <p class="job-detail__item-title">{{item.title}}:</p>
                  <p class="job-detail__item-text">
                    {{item.title !== 'SUT Name' && item.title !== 'Test Speciflcation'?currentJob[item.dataIndex]:(item.title === 'SUT Name'?currentJob.sut.name:currentJob.spec.name)}}
                    <span
                      v-if="item.title === 'SUT Name' && statusText === 'DONE'"
                    >
                      <a-divider type="vertical" />
                      <a-button type="link" size="small" @click="jumpToUpload">Upload SUT</a-button>
                    </span>
                  </p>
                </div>
                <div class="job-detail__item-container">
                  <p class="job-detail__item-title">Test Job Status:</p>
                  <p class="job-detail__item-text">{{this.statusText}}</p>
                </div>
              </a-col>
              <a-col :span="10" :offset="2">
                <testCasePie v-if="this.statusText" />
              </a-col>
            </a-row>
          </a-card>
        </div>
        <div class="job-detail__detail">
          <a-card :hoverable="false">
            <a-card-grid style="width: 100%" :hoverable="false">
              <h2>Test Job Detail</h2>
              <div class="job-detail__test-env">
                <p>{{currentJob.remark}}</p>
              </div>
            </a-card-grid>
            <div v-if="detailTestCase.length >0">
              <a-table
                class="detailtestcase-table"
                :columns="columns"
                :dataSource="detailTestCase"
                rowKey="index"
                bordered
                size="default"
                :expandedRowKeys="expandedRowKeys"
                @expand="caseSecondaryTableShow"
              >
                <span slot="caseStatus" slot-scope="caseStatus,record">
                  <a-tooltip placement="top">
                    <template slot="title">
                      <span>{{caseStatus}}</span>
                    </template>
                    <span
                      @click="pasteReason(record)"
                      class="job-detail__testCase-status"
                      :style="getCaseStatusStyle(caseStatus)"
                    ></span>
                  </a-tooltip>
                </span>
                <a-table
                  class="test-case__table"
                  slot-scope="record"
                  slot="expandedRowRender"
                  :loading="testCaseChildtableLoading"
                  :columns="innerColumns"
                  :dataSource="record.caseMgt"
                  rowKey="executionId"
                  size="default"
                >
                  <span slot="status" slot-scope="status">
                    {{status}}
                    <!--<a-tooltip placement="top">-->
                    <!--<template slot="title">-->
                    <!--<span>{{status}}</span>-->
                    <!--</template>-->
                    <!--<span class="job-detail__testCase-status" :style="getCaseStatusStyle(status)"></span>-->
                    <!--</a-tooltip>-->
                  </span>
                </a-table>
              </a-table>
            </div>
          </a-card>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script type="text/ecmascript-6">
import testCasePie from "./testCasePie";
import Loading from "../../components/Loading/Loading";
import {
  testJobColumns,
  testJobDetailCaseListColumns,
  testJobDetailCaseChildColumns
} from "../../const/constant";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "JobDetail",
  components: { testCasePie, Loading },
  data() {
    return {
      columns: testJobDetailCaseListColumns,
      innerColumns: testJobDetailCaseChildColumns,
      statusColor: "",
      stompClient: "",
      timer: "",
      progressTimer: "",
      caseChildlistTimer: [],
      progressStatus: "normal",
      sutvalidLind: "http://192.168.235.16:8080/onapui/vnfmarket"
    };
  },
  computed: {
    ...mapState({
      detailLoading: state => state.testJob.detailLoading,
      loadingMessage: state => state.loading.loadingMessage,
      percent: state => state.testJob.percent,
      statusText: state => state.testJob.statusText,
      detailTestCase: state => state.testJob.detailTestCase,
      // testFailDetail: state => state.testJob.testFailDetail,
      failLoading: state => state.testJob.failLoading,
      executionStartTime: state => state.testJob.executionStartTime,
      testCaseChildtableLoading: state =>
        state.testJob.testCaseChildtableLoading,
      expandedRowKeys: state => state.testJob.expandedRowKeys
    }),
    infoList() {
      let list = [];
      testJobColumns.forEach(item => {
        if (item.title !== "Status" && item.title !== "Action") {
          list.push(item);
        }
      });
      return list;
    },
    currentJob() {
      return JSON.parse(this.$route.query.detail);
    }
  },
  watch: {
    percent(val) {
      if (val === 100) {
        clearInterval(this.progressTimer);
      }
      this.progressStatus =
        val === undefined || val === null || val !== 100 ? "normal" : "success";
    }
  },
  created() {
    this.changeComponent(true);
    if (!this.$store.state.router.breadcrumbArr.length) {
      this.$store.commit("setCurrentMenu", ["Test Job MGT"]);
      this.$store.commit("setBreadcrumb", ["Test Job MGT"]);
    }
  },
  mounted() {
    this.initJobDetail();
  },
  methods: {
    ...mapActions("testJob", [
      "getProgress",
      "getTestFail",
      "getTestJobCaseExecutions",
      "jobVNFCsarsUplaod"
    ]),
    ...mapMutations("testJob", [
      "changeComponent",
      "updateProgress",
      "updateExecutionStartTime",
      "updateDetailTestCase",
      "updateTestCasePieData",
      "updateDetailLoading",
      "updateFailDetail",
      "updateExpandedRowKeys",
      "clearexpandedRowKeys"
    ]),
    initJobDetail() {
      if (this.currentJob.jobStatus !== "CREATED") {
        this.getProgress({
          jobId: this.currentJob.jobId,
          message: this.$message
        });
        this.progressTimer = setInterval(() => {
          this.getProgress({
            jobId: this.currentJob.jobId,
            message: this.$message
          });
        }, 5000);
      } else {
        this.updateDetailLoading(false);
      }
    },
    handleBack() {
      clearInterval(this.progressTimer);
      this.caseChildlistTimer.map(item => {
        clearInterval(item);
      });
      this.clearexpandedRowKeys();
      this.updateExecutionStartTime("");
      this.updateDetailLoading(true);
      this.changeComponent(false);
      this.updateDetailTestCase([]);
      this.updateTestCasePieData([
        { name: "DONE", y: 0, color: "#cae76e" },
        { name: "FAILED", y: 0, color: "#e94e75" }
      ]);
      this.updateProgress({
        percent: 0,
        status: ""
      });
      this.$router.push("/testjobmgt");
    },
    getCaseStatusStyle(status) {
      let color =
        status === "STARTED"
          ? "#979797"
          : status === "RUNNING" || status === "in-progress"
          ? "#F5A623"
          : status === "CREATED"
          ? "#78E5D7"
          : status === "DONE" || status === "completed"
          ? "#7ED321"
          : "#D0021B";
      return {
        backgroundColor: color,
        cursor: "pointer"
      };
    },
    pasteReason(item) {
      this.getTestFail(item);
      this.$message.success(this.$t("T.Failed Reason"));
    },
    handleRefresh() {
      this.getProgress({ jobId: this.currentJob.jobId });
    },
    jumpToUpload() {
      this.jobVNFCsarsUplaod({
        jobId: this.currentJob.jobId,
        sutvalidLind: this.sutvalidLind,
        confirm: this.$confirm
      });
      // window.open(this.sutvalidLind, "_blank");
    },
    caseSecondaryTableShow(expanded, record) {
      // console.log(expanded, record, "----expanded, record");
      if (expanded) {
        this.getTestJobCaseExecutions({
          record,
          expanded,
          message: this.$message
        });
        if (
          record.caseStatus !== "DONE" &&
          record.caseStatus !== "FAILED" &&
          record.caseStatus !== "STARTED"
        ) {
          this.caseChildlistTimer[record.index] = setInterval(() => {
            this.getTestJobCaseExecutions({
              record,
              expanded,
              message: this.$message
            });
          }, 5000);
        }
      } else {
        if (
          record.caseStatus !== "DONE" &&
          record.caseStatus !== "FAILED" &&
          record.caseStatus !== "STARTED"
        ) {
          clearInterval(this.caseChildlistTimer[record.index]);
        }
        this.updateExpandedRowKeys({
          key: record.index,
          expanded
        });
      }
    }
  },
  beforeDestroy: function() {
    clearInterval(this.progressTimer);
    this.caseChildlistTimer.map(item => {
      clearInterval(item);
    });
    this.clearexpandedRowKeys();
    this.updateExecutionStartTime("");
    this.changeComponent(false);
    this.updateDetailTestCase([]);
    this.updateTestCasePieData([
      { name: "DONE", y: 0, color: "#cae76e" },
      { name: "FAILED", y: 0, color: "#e94e75" }
    ]);
    this.updateProgress({
      percent: 0,
      status: ""
    });
  }
};
</script>

<style lang="less" >
.job-detail {
  .job-detail__back-btn {
    display: inline-block;
    cursor: pointer;
    font-size: 18px;
  }
  .job-detail__progress-container {
    padding: 20px 30px;
    .job-detail__progress {
      width: 80%;
      margin-right: 7%;
    }
    .job-detail__refresh-btn {
      border-radius: 20px;
    }
  }
  .job-detail__content {
    /*display: flex;*/
    justify-content: space-between;
    margin-top: 30px;
    .job-detail__info {
      width: 100%;
      .ant-card {
        height: 100%;
      }
      .job-detail__info-title {
        margin-bottom: 24px;
      }
      .job-detail__item-container:first-child {
        margin-top: 15px;
      }
      .job-detail__item-container {
        overflow: hidden;
        // margin-top: 15px;
        .job-detail__item-title {
          float: left;
          width: 140px;
          font-weight: 700;
        }
        .job-detail__item-text {
          float: left;
          font-weight: 400;
        }
      }
    }
    .job-detail__detail {
      width: 100%;
      margin: 20px 0;
      .job-detail__test-env {
        margin-top: 16px;
        overflow: hidden;
        p {
          float: left;
          width: 40%;
          font-size: 16px;
        }
      }
      .job-detail__testCase-status {
        display: block;
        width: 15px;
        height: 15px;
        margin-top: 5px;
        border-radius: 50%;
      }
      .detailtestcase-table{
        .ant-spin-nested-loading{
          .ant-pagination{
            padding: 0 16px!important;
          }
        }
      }
    }
  }
}
</style>
