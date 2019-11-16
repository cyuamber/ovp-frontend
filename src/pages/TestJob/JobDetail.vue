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
        :status="status"
        :showInfo="false"
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
    <div class="job-detail__content">
      <div class="job-detail__info">
        <a-card>
          <h2 class="job-detail__info-title">Test Job Info</h2>
          <div v-for="(item,index) in infoList" :key="index" class="job-detail__item-container">
            <p class="job-detail__item-title">{{item.title}}:</p>
            <p
              class="job-detail__item-text"
            >{{item.title !== 'VNF Name' && item.title !== 'Test Speciflcation'?currentJob[item.dataIndex]:(item.title === 'VNF Name'?currentJob.sut.name:currentJob.spec.name)}}</p>
          </div>
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
              caseName：{{item.caseEntity.name}}
              <span
                class="job-detail__testCase-status"
                v-if="item.caseStatus!==null && item.caseStatus!==undefined"
                :style="getCaseStatusStyle(item.caseStatus)"
              ></span>
            </a-card-grid>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { testJobColumns } from "../../const/constant";
import { mapState, mapMutations, mapActions } from "vuex";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  name: "JobDetail",
  data() {
    return {
      statusColor: "",
      stompClient: "",
      timer: "",
      caseStatusTimer: ""
    };
  },
  computed: {
    ...mapState({
      percent: state => state.testJob.percent,
      status: state => state.testJob.status,
      detailTestCase: state => state.testJob.detailTestCase
    }),
    infoList() {
      let list = [];
      testJobColumns.forEach(item => {
        if (item.title !== "Status" && item.title !== "Action") {
          list.push(item);
        }
      });
      console.log(list, "list");
      return list;
    },
    currentJob() {
      return this.$route.params;
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
  destroyed() {
    this.changeComponent(false);
    this.updateProgress({
      percent: 0,
      status: "normal"
    });
  },
  methods: {
    ...mapActions("testJob", ["getProgress", "detailTestCaseJop"]),
    ...mapMutations("testJob", ["changeComponent", "updateProgress"]),
    initJobDetail() {
      // this.initWebSocket();
      if (this.currentJob.jobStatus !== "CREATED") {
        this.detailTestCaseJop({
          jobId: this.currentJob.jobId,
          executionStartTime: this.currentJob.executionStartTime
        });
        this.caseStatusTimer = setInterval(() => {
          this.detailTestCaseJop({
            jobId: this.currentJob.jobId,
            executionStartTime: this.currentJob.executionStartTime
          });
        }, 5000);
      }
    },
    handleBack() {
      // this.$router.back()
      this.$emit("close");
      clearInterval(this.caseStatusTimer);
      this.$router.push("/testjobmgt");
    },
    getCaseStatusStyle(status) {
      let color =
        status === "STARTED"
          ? "#979797"
          : status === "RUNNING"
          ? "#F5A623"
          : status === "DONE"
          ? "#7ED321"
          : "#D0021B";
      return { backgroundColor: color };
    },
    getDetailProgress() {
      let { status } = this.$route.params;
      console.log(status, "status");
      // If not executed, start the test first.
      if (status === 1) this.getProgress();
      else if (status === 2) {
        this.updateProgress({
          percent: 100,
          status: "success"
        });
      } else if (status === 3) {
        this.updateProgress({
          percent: 90,
          status: "exception"
        });
      } else {
        this.updateProgress({
          percent: 0,
          status: "normal"
        });
      }
    },
    handleRefresh() {
      this.initWebSocket();
    },
    initWebSocket() {
      //initialization weosocket
      this.connection();
      let that = this;
      this.timer = setInterval(() => {
        try {
          that.stompClient.send("Test if the connection is normal");
        } catch (err) {
          console.log("Disconnected: " + err);
          that.connection();
        }
      }, 5000);
    },
    connection() {
      let socket = new SockJS("/webSocketEndPoint");
      // let socket = new SockJS('http://localhost:8080');
      this.stompClient = Stomp.over(socket);
      let headers = {
        Authorization: ""
      };
      this.stompClient.connect(
        headers,
        () => {
          this.stompClient.subscribe(
            "/topic/status",
            msg => {
              console.log(msg, "socket-msg");
              this.updateProgress({
                percent: msg.progress,
                status: msg.state
              });
            },
            headers
          );
        },
        err => {
          console.log(err);
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    }
  },
  beforeDestroy: function() {
    // this.disconnect();
    clearInterval(this.timer);
    clearInterval(this.caseStatusTimer);
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
      width: 40%;
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
      width: 59.5%;
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
        width: 12px;
        height: 12px;
        margin-top: 5px;
        // background-color: red;
        border-radius: 50%;
      }
    }
  }
}
</style>
