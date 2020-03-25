<template>
  <div class="job-detail">
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
        :disabled="$route.params.jobStatus === 'DONE'"
      >
        <a-icon type="sync" />Refresh
      </a-button>
    </div>
    <a-spin tip="Loading..." :spinning="detailLoading" size="large">
      <div class="job-detail__content">
        <div class="job-detail__info">
          <a-card>
            <h2 class="job-detail__info-title">Test Job Info</h2>
            <div v-for="(item,index) in infoList" :key="index" class="job-detail__item-container">
              <p class="job-detail__item-title">{{item.title}}:</p>
              <p class="job-detail__item-text">
                {{item.title !== 'SUT Name' && item.title !== 'Test Speciflcation'?currentJob[item.dataIndex]:(item.title === 'SUT Name'?currentJob.sut.name:currentJob.spec.name)}}
                <span
                  v-if="item.title === 'SUT Name' && currentJob.jobStatus === 'DONE'"
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
            <testCasePie v-if="this.statusText" />
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
              <a-card-grid
                style="width: 100%"
                v-for="(item,index) in detailTestCase"
                :key="index"
                :hoverable="false"
              >
                Case Name：{{item.caseEntity.name}}
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>{{item.caseStatus}}</span>
                  </template>
                  <span
                    @click="pasteReason(item)"
                    class="job-detail__testCase-status"
                    v-if="item.caseStatus!==null && item.caseStatus!==undefined"
                    :style="getCaseStatusStyle(item.caseStatus)"
                  ></span>
                </a-tooltip>
              </a-card-grid>
            </div>
          </a-card>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script type="text/ecmascript-6">
import testCasePie from "./testCasePie";
import { testJobColumns } from "../../const/constant";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "JobDetail",
  components: { testCasePie },
  data() {
    return {
      statusColor: "",
      stompClient: "",
      timer: "",
      progressTimer: "",
      progressStatus: "normal",
      sutvalidLind: "http://192.168.235.16:8080/onapui/vnfmarket"
    };
  },
  computed: {
    ...mapState({
      detailLoading: state => state.testJob.detailLoading,
      percent: state => state.testJob.percent,
      statusText: state => state.testJob.statusText,
      detailTestCase: state => state.testJob.detailTestCase,
      // testFailDetail: state => state.testJob.testFailDetail,
      failLoading: state => state.testJob.failLoading,
      executionStartTime: state => state.testJob.executionStartTime
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
      return this.$route.params;
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
      "detailTestCaseJop",
      "getTestFail"
    ]),
    ...mapMutations("testJob", [
      "changeComponent",
      "updateProgress",
      "updateExecutionStartTime",
      "updateDetailTestCase",
      "updateTestCasePieData",
      "updateDetailLoading",
      "updateFailDetail"
    ]),
    initJobDetail() {
      if (this.currentJob.jobStatus !== "CREATED") {
        this.getProgress({ jobId: this.currentJob.jobId });
        this.progressTimer = setInterval(() => {
          this.getProgress({ jobId: this.currentJob.jobId });
        }, 5000);
      } else {
        this.updateDetailLoading(false);
      }
    },
    handleBack() {
      clearInterval(this.progressTimer);
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
          : status === "RUNNING"
          ? "#F5A623"
          : status === "CREATED"
          ? "#78E5D7"
          : status === "DONE"
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
      window.open(this.sutvalidLind, "_blank");
    }
  },
  beforeDestroy: function() {
    clearInterval(this.progressTimer);
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

<style lang="less" scoped>
.job-detail {
  .job-detail__back-btn {
    display: inline-biock;
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
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .job-detail__info {
      width: 45%;
      .ant-card {
        height: 100%;
      }
      .job-detail__info-title {
        margin-bottom: 24px;
      }
      .job-detail__item-container {
        overflow: hidden;
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
      width: 54%;
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
        float: right;
        width: 15px;
        height: 15px;
        margin-top: 5px;
        border-radius: 50%;
      }
    }
  }
}
</style>
