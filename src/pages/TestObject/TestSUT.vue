<template>
  <div>
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChange">
      <a-tab-pane v-for="tab in tabs" :key="tab.val" :tab="tab.key">
        <div class="tab-content tab-content--margin">
          <a-button type="primary" @click="handleCreate">Create {{tab.key}} SUT</a-button>
          <Search
            class="tab-content__button"
            @serchTestSUT="serchTestSUT"
            :currentPage="currentPage"
          />
          <a-date-picker
            class="tab-content__calendar"
            @change="onChange"
            placeholder="Select date"
          />
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
            @change="pageChange"
          >
            <span slot="action" slot-scope="action,record">
              <a-tag
                v-for="item in action"
                :key="item"
                :color="item === 'Edit'? 'blue': (item === 'Delete'?'red': 'green')"
                class="table__tag"
                @click="(() => showEditOrDeleteModal(item,record))"
              >{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <SUTCreateOrEdit :isEdit="isEdit" />
  </div>
</template>

<script>
import Search from "../../components/Search/Search";
import SUTCreateOrEdit from "./SUTCreateOrEdit";
import { TestSUTTabs, TestSUTColumns } from "../../const/constant";
import Loading from "../../components/Loading/Loading";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "VnfTypeobject",
  data() {
    return {
      tabs: TestSUTTabs,
      isEdit: false,
      currentPage: "TestSUT",
      columns: TestSUTColumns
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.testSUT.tableData,
      pagination: state => state.testSUT.pagination,
      VNFTest: state => state.testSUT.VNFTest,
      loadingMessage: state => state.loading.loadingMessage,
      visible: state => state.testSUT.visible,
      createTime: state => state.testSUT.createTime,
      currentTab: state => state.testSUT.currentTab,
      tableLoading: state => state.testSUT.tableLoading
    }),
    keyword: {
      get() {
        return this.$store.state.testSUT.keyword;
      },
      set(val) {
        if (val) {
          this.$store.state.testSUT.keyword = "";
        }
      }
    }
  },
  watch: {
    currentTab(val) {
      if (val) {
        this.getVNFOptions();
      }
    }
  },
  components: {
    SUTCreateOrEdit,
    Search,
    Loading
  },
  mounted() {
    this.initTestSUTeTable();
  },
  methods: {
    ...mapActions("testSUT", [
      "getTableData",
      "setParams",
      "getVNFOptions",
      "deleteVNFTest",
      "downloadFile"
    ]),
    ...mapMutations("testSUT", [
      "updateVisible",
      "setFilterItem",
      "updateVNFTest",
      "changeTab"
    ]),
    initTestSUTeTable() {
      this.getVNFOptions();
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
    },
    handleCreate() {
      this.updateVisible(true);
      this.isEdit = false;
    },
    handleTabsChange(key) {
      this.changeTab(key);
      this.keyword = "";
      let paramsObj = {};
      this.getTableData({ paramsObj, isFilter: false });
    },
    // Get table data by entering information or selecting time
    serchTestSUT(keyword) {
      this.setFilterItem({
        key: keyword,
        isSearch: true,
        message: this.$message
      });
      this.setParams(true);
    },
    // Filter by creating time
    onChange(date, d) {
      this.setFilterItem({ time: d });
      this.setParams(true);
    },
    showEditOrDeleteModal(item, VNFTest) {
      if (item === "Edit") {
        this.isEdit = true;
        this.updateVNFTest(VNFTest);
        this.updateVisible(true);
      } else if (item === "Delete")
        this.showConfirm(item, "Are you sure delete this task?", VNFTest);
      else {
        this.$confirm({
          title: "Are you sure download this Spec?",
          content: "fileName: " + VNFTest.fileName,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.downloadFile({
              fileName: VNFTest.fileName,
              fileAliasName: VNFTest.fileAliasName
            });
          }
        });
      }
    },
    showConfirm(item, title, VNFTest) {
      this.$confirm({
        title,
        content: "Are you sure to delete this package?",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          this.deleteVNFTest({
            id: VNFTest.id
          });
        }
      });
    },
    pageChange(pageObj) {
      this.setFilterItem({ pageObj });
      this.setParams(true);
    }
  },
  destroyed() {
    this.changeTab(101);
  }
};
</script>

<style lang="less" scoped>
.tab-content--margin {
  margin-top: 10px;
  margin-bottom: 30px;
  .tab-content__button {
    display: inline-block;
    margin-left: 40px;
  }
  .tab-content__calendar {
    float: right;
    width: 280px;
  }
}
.table {
  .table__tag {
    padding: 0 8px;
    border-radius: 12px;
    cursor: pointer;
  }
}
</style>>

