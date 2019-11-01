<template>
  <div class="test-job__container">
    <Loading :loadingMessage="loadingMessage" />
    <div class="test-job__top">
      <a-button type="primary" @click="handleCreate">Create Test Job</a-button>
      <a-date-picker class="calendar" @change="handleSelectCreateTime" placeholder="Select date" />
    </div>
    <div class="test-job__table">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        bordered
        :loading="loading"
        rowKey="index"
        size="default"
        :pagination="pagination"
        :scroll="{x: 1630}"
        @change="handlePageChange"
      >
        <span slot="status" slot-scope="status,record">
          <span
            class="test-job__showState"
            :style="getStatusStyle(record.status)"
            :title="getStatusTitle(record.status)"
          ></span>
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
    <Drawer :isShow="isShow" @close="close" />
  </div>
</template>

<script>
import { testJobColumns } from "../../const/constant.js";
import Loading from "../../components/Loading/Loading";
import Drawer from "./Drawer";
import { mapState } from "vuex";

export default {
  name: "TestJob",

  data() {
    return {
      columns: testJobColumns,
      loading: false
    };
  },
  computed: {
    ...mapState({
      isShow: state => state.testJob.isShow,
      loadingMessage: state => state.testJob.loadingMessage,
      tableData: state => state.testJob.tableData,
      pagination: state => state.testJob.pagination
	}),
  },
  components: { Drawer, Loading },
  mounted() {
    this.$store.dispatch("testJob/getTableData");
  },
  methods: {
    handleCreate() {
      this.$store.commit("testJob/setIsShow", true);
    },
    handleSelectCreateTime(date, d) {
      this.$store.commit("testJob/setFilter", { time: d });
      this.$store.dispatch("testJob/getTableData");
    },
    handleActions(action, data) {
      if (
        action === "Start" ||
        action === "Pause" ||
        action === "Success" ||
        action === "Fail"
      )
        this.handleStart(action, data);
      else if (action === "Delete") this.handleDelete(data);
      else if (action === "More") this.handleOpenDetail(data);
    },
    handleStart(action, data) {
      data.currentAction = action;
      this.$store.commit("setCurrentMenu", ["Test Job MGT"]);
      this.$store.commit("setBreadcrumb", ["Test Job MGT"]);
      this.$router.push({ name: "JobDetail", params: data });
    },
    handleDelete(data) {
      this.$confirm({
        title: "Are you sure delete this task?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          this.$store.dispatch("testJob/delete", data);
        },
        onCancel() {
          console.log("Cancel");
        }
      });
    },
    handleDownload() {
      console.log(555);
    },
    handleOpenDetail(data) {
      data.currentAction = "More";
      this.$router.push({ name: "JobDetail", params: data });
    },
    close() {
      this.$store.commit("testJob/setIsShow", false);
    },
    handlePageChange(pageObj) {
      this.$store.commit("testJob/setFilter", { pageObj });
      this.$store.dispatch("testJob/getTableData");
	},
	getStatusTitle(status){
		return status === 0? 'Pending execution': (status === 1? 'Executing':(status === 2? 'Execution completed':'Execution failed'))
	},
	getStatusStyle(status){
		let color = status === 0? '#979797': (status === 1? '#F5A623':(status === 2? '#7ED321':'#D0021B'))
		return {backgroundColor: color}
	},
	getActionsColor(actions, item){
		return item === actions[0]? 'blue': (item === actions[1]? 'red':(item === actions[2]? 'green': 'purple'))
	}
  }
};
</script>
<style lang="less" scope>
.test-job__container {
  .test-job__top {
    margin-bottom: 30px;
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
}
</style>