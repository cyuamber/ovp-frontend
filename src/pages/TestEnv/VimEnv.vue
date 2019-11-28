<template>
  <div>
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChange">
      <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
        <div class="tab-content tab-content--margin">
          <a-button type="primary" @click="handleRigister">Register {{tab}}</a-button>
          <a-input
            class="tab-content__button"
            :placeholder="tab === 'VIM ENV'?'Cloud Type':'Name'"
            @keyup.enter="searchTypeID"
            v-model="keyword"
          >
            <a-icon slot="prefix" type="search" />
          </a-input>
          <a-date-picker
            class="tab-content__calendar"
            @change="selectedTime"
            placeholder="Select date"
          />
        </div>
        <div class="table">
          <a-table
            :columns="tab === 'VIM ENV'? VIMColumns : VNFMColumns"
            :dataSource="tab === 'VIM ENV' ? VIMTableData : VNFMTableData"
            bordered
            :loading="tableLoading"
            rowKey="index"
            size="default"
            :pagination="pagination"
            :scroll="{x: 1630}"
            @change="pageChange"
          >
            <span slot="status" slot-scope="status">
              <span
                class="showState"
                :style="{backgroundColor: +status===1 ? '#F5222D': '#52C41A'}"
                :title="+status===1 ? 'offline': 'online'"
              ></span>
            </span>
            <span slot="action" slot-scope="action,record">
              <a-tag
                v-for="(item,index) in action"
                :key="index"
                :color="item === 'Edit'? 'blue' : 'red'"
                class="tag"
                @click="(() => showEditOrDeleteModal(item,record))"
              >{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <CreateOrEditModal :isEdit="isEdit" />
  </div>
</template>

<script>
import CreateOrEditModal from "./CreateOrEditModal";
import Loading from "../../components/Loading/Loading";
import { testEnvVIMColumns, testEvnVNFMColumns } from "../../const/constant";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "VimEnv",
  data() {
    return {
      tabs: ["VIM ENV", "VNFM ENV"],
      keyword: "",
      VIMColumns: testEnvVIMColumns,
      VNFMColumns: testEvnVNFMColumns,
      isEdit: false
    };
  },
  computed: {
    ...mapState({
      tableLoading: state => state.testENV.tableLoading,
      loadingMessage: state => state.testENV.loadingMessage,
      VIMTableData: state => state.testENV.VIMTableData,
      VNFMTableData: state => state.testENV.VNFMTableData,
      pagination: state => state.testENV.pagination,
      searchKeyword: state => state.testENV.searchKeyword,
      currentTab: state => state.testENV.currentTab,
      visible: state => state.testENV.visible
    })
  },
  components: {
    Loading,
    CreateOrEditModal
  },
  mounted() {
    this.initVimEnvTable();
  },
  methods: {
    ...mapActions("testENV", [
      "getTableData",
      "setParams",
      "deleteData",
      "getCloudTypeOptions"
    ]),
    ...mapMutations("testENV", [
      "changeTab",
      "updateVisible",
      "setFilterItem",
      "setInitValues"
    ]),
    initVimEnvTable() {
      this.getCloudTypeOptions();
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
    },
    handleTabsChange(key) {
      this.changeTab(key);
      this.keyword = "";
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
    },
    handleRigister() {
      this.updateVisible(true);
      this.isEdit = false;
    },
    searchTypeID() {
      this.setFilterItem({
        key: this.keyword,
        isSearch: true,
        message: this.$message
      });
      this.setParams();
    },
    selectedTime(date, d) {
      this.setFilterItem({ time: d });
      this.setParams();
    },
    showEditOrDeleteModal(item, record) {
      if (item === "Edit") {
        this.setInitValues({ record, item });
        this.updateVisible(true);
        this.isEdit = true;
      } else {
        this.$confirm({
          title: "Are you sure delete this task?",
          content: "Some descriptions",
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.deleteData(record);
          }
        });
      }
    },
    pageChange(pageObj) {
      this.setFilterItem({ pageObj });
      this.setParams();
    }
  },
  destroyed() {
    this.changeTab("VIM ENV");
  }
};
</script>

<style lang="less" scoped>
.tab-content--margin {
  margin-top: 10px;
  margin-bottom: 30px;
  .tab-content__button {
    display: inline-block;
    width: 240px;
    margin-left: 40px;
    /deep/ .ant-input {
      border-radius: 20px;
    }
  }
  .tab-content__calendar {
    float: right;
    width: 280px;
  }
}
.table {
  .tag {
    padding: 0 8px;
    border-radius: 12px;
  }
  .showState {
    display: block;
    margin: 0 auto;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
}
/deep/ .ant-table-thead > tr > th {
  text-align: center;
  white-space: nowrap;
}
</style>