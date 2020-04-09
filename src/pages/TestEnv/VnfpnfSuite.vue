<template>
  <div class="test-ins__container">
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChanges">
      <a-tab-pane v-for="tab in tabss" :key="tab.val" :tab="tab.key">
        <div class="top">
          <a-button type="primary" @click="handleClick">Create {{tab.key}} TT</a-button>
          <Search class="search" @VNFSuiteSearch="VNFSuiteSearch" :currentPage="currentPage" />
          <a-date-picker class="calendar" @change="onChange" placeholder="Select date" />
        </div>
        <div class="table">
          <a-table
            :columns="columns"
            :dataSource="tableData"
            bordered
            :loading="tableLoading"
            rowKey="id"
            size="default"
            :pagination="pagination"
            @change="handleTableChange"
          >
            <span slot="action" slot-scope="action,record">
              <a-tag
                v-for="(item,index) in action"
                :key="index"
                :color="item === 'Edit'? 'blue' : (item === 'Delete'?'red':'green')"
                class="tag"
                @click="(() => showEditOrDeleteModal(item,record))"
              >{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <xNFCreateOrEdit :isEdit="isEdit" />
  </div>
</template>

<script>
import Search from "../../components/Search/Search";
import { PackageMGTTabs, VnfpnfSuiteColumns } from "../../const/constant";
import { mapState, mapActions, mapMutations } from "vuex";
import Loading from "../../components/Loading/Loading";
import xNFCreateOrEdit from "./VnfpnfCreateOrEdit";

export default {
  name: "VnfpnfSuite",
  components: {
    Search,
    xNFCreateOrEdit,
    Loading
  },
  data() {
    return {
      tabss: PackageMGTTabs,
      columns: VnfpnfSuiteColumns,
      currentPage: "VNF/PNFSuiteMGT",
      isEdit: false,
      createTime: "",
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.VnfpnfSuite.tableData,
      pagination: state => state.VnfpnfSuite.pagination,
      SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
      loadingMessage: state => state.VnfpnfSuite.loadingMessage,
      currentTab: state => state.VnfpnfSuite.currentTab,
      tableLoading: state => state.VnfpnfSuite.tableLoading
    })
  },
  watch: {
    currentTab(val) {
      if (val) {
        this.getVNFOptions();
      }
    }
  },
  mounted() {
    this.initVnfPnfSuiteTable();
  },
  methods: {
    ...mapActions("VnfpnfSuite", [
      "getTableData",
      "getVNFOptions",
      "getPagination",
      "clearPagination",
      "deleteTestMeter",
      "downloadFile"
    ]),
    ...mapMutations("VnfpnfSuite", [
      "changeTab",
      "updateVisible",
      "updateVNFTest"
    ]),
    initVnfPnfSuiteTable() {
      this.getVNFOptions();
      this.getTableData({});
    },
    handleClick() {
      this.updateVisible(true);
      this.isEdit = false;
      this.updateVNFTest({});
    },
    handleTabsChanges(key) {
      console.log(key, "key");
      this.changeTab(key);
      this.getTableData({});
    },
    handleTableChange(pagination) {
      this.getPagination({ pagination });
      let current = pagination.current,
        pageSize = pagination.pageSize,
        obj = {
          name: this.keyword,
          createTime: this.createTime,
          pageNum: current,
          pageSize: pageSize
        };
      this.getTableData(obj);
    },
    // Filter by creating time
    onChange(date, d) {
      this.createTime = d;
      this.VNFSuiteSearch();
    },
    VNFSuiteSearch(keyword, isSearch) {
      let obj = { flag: this.currentTab };
      if (isSearch) this.keyword = keyword;
      if (!(keyword === "" && this.createTime === "")) {
        obj = { name: this.keyword, createTime: this.createTime };
      }
      this.clearPagination();
      // Simulation request
      this.getTableData(obj);
    },
    showEditOrDeleteModal(item, SuiteSingleData) {
      console.log(SuiteSingleData, "---singleData");
      if (item === "Edit") {
        this.updateVisible(true);
        this.isEdit = true;
        this.updateVNFTest(SuiteSingleData);
      } else if (item === "Delete") {
        this.$confirm({
          title: "Are you sure delete this xNF TT?",
          content: "Name: " + SuiteSingleData.name,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.deleteTestMeter({
                id: SuiteSingleData.id,
                message: this.$message
            });
          }
        });
      } else {
          console.log(SuiteSingleData,"-----123")
        this.$confirm({
          title: "Are you sure download this xNF TT?",
          content: "File Name: " + SuiteSingleData.fileName,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.downloadFile({
              fileName: SuiteSingleData.fileName,
              fileAliasName:SuiteSingleData.fileAliasName
            });
          }
        });
      }
    }
  },
  destroyed() {
    this.changeTab(101);
  }
};
</script>

<style lang="less" scoped>
.test-ins__container {
  .top {
    margin-bottom: 30px;
    .search {
      display: inline-block;
      margin-left: 40px;
    }
    .calendar {
      float: right;
      width: 280px;
    }
  }
  .tag {
    padding: 0 8px;
    border-radius: 12px;
  }
}
</style>
