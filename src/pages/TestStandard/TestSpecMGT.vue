<template>
  <div class="test-spec">
    <div class="test-spec__top">
      <Loading :loadingMessage="loadingMessage" />
      <a-button type="primary" @click="handleCreateClick">Add Spec</a-button>
      <Search
        class="search test-spec__search"
        @testSpecSearch="testSpecSearch"
        :currentPage="currentPage"
      />
      <a-date-picker
        class="calendar test-spec__calendar"
        @change="onChange"
        placeholder="Select date"
      />
    </div>
    <div class="test-spec__table">
      <a-table
        :columns="columns"
        :dataSource="tableData"
        :loading="tableLoading"
        rowKey="id"
        size="default"
        :pagination="pagination"
        @change="handleTableChange"
        @expand="caseMgtTableShow"
      >
        <span slot="action" slot-scope="action,record">
          <a-tag
            v-for="item in action"
            :key="item"
            :color="item === 'Edit'? 'blue' : 'red'"
            class="test-spec__tag"
            @click="(() => showEditOrDeleteModal(item,record))"
          >{{item}}</a-tag>
        </span>
        <a-table
          class="test-case__table"
          slot="expandedRowRender"
          :columns="innerColumns"
          :dataSource="caseMgtTableData"
          rowKey="id"
          size="default"
          :pagination="false"
        >
          <span slot="status" slot-scope="status">
            <span
              class="test-case__showState"
              :style="{backgroundColor: status==='able'? '#d0021b': '#7ED321'}"
              :title="status===0? 'Available': 'unavailable'"
            ></span>
          </span>
        </a-table>
      </a-table>
    </div>
    <TestSpecMGTAddOrEdit
      :isEdit="isEdit"
    />
  </div>
</template>
<script>
import Search from "../../components/Search/Search";
import { TestSpecColumns, TestCaseColumns } from "../../const/constant";
import { mapState, mapActions, mapMutations } from "vuex";
import Loading from "../../components/Loading/Loading";
import TestSpecMGTAddOrEdit from "./TestSpecMGTAddOrEdit";
export default {
  name: "TestSpecMGT",
  components: {
    Search,
    TestSpecMGTAddOrEdit,
    Loading
  },
  data() {
    return {
      columns: TestSpecColumns,
      innerColumns: TestCaseColumns,
      currentPage: "TestSpecMGT",
      isEdit: false,
      publishTime: "",
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.testSpecMGT.tableData,
      caseMgtTableData: state => state.testSpecMGT.caseMgtTableData,
      pagination: state => state.testSpecMGT.pagination,
      testSpecSingleData: state => state.testSpecMGT.testSpecSingleData,
      loadingMessage: state => state.testSpecMGT.loadingMessage,
      tableLoading: state => state.testSpecMGT.tableLoading,
        visible: state => state.testSpecMGT.visible
    })
  },
  mounted() {
    this.initTestStandardTable();
  },
  methods: {
    ...mapActions("testSpecMGT", [
      "getTableData",
      "getTestSpec",
      "deleteTestSpec",
      "getPagination",
      "clearPagination",
      "getSUTOptions"
    ]),
    ...mapMutations("testSpecMGT", ["updatecaseMgtTableData","updateVisible"]),
    initTestStandardTable() {
      this.getSUTOptions();
      this.getTableData({});
    },
    handleCreateClick() {
        this.updateVisible(true);
      this.isEdit = false;
      this.getTestSpec("");
    },
    handleTableChange(pagination) {
      this.getPagination({ pagination });
      let current = pagination.current,
        pageSize = pagination.pageSize,
        obj = {
          testSpecName: this.keyword,
          publishTime: this.publishTime,
          pageNum: current,
          pageSize: pageSize
        };
      this.getTableData(obj);
    },
    caseMgtTableShow(expanded, record) {
      this.updatecaseMgtTableData(record);
    },
    // Filter by creating time
    onChange(date, d) {
      this.publishTime = d;
      this.testSpecSearch();
    },
    testSpecSearch(keyword, isSearch) {
      let obj = {};
      if (isSearch) this.keyword = keyword;
      if (!(keyword === "" && this.publishTime === "")) {
        obj = { testSpecName: this.keyword, publishTime: this.publishTime };
      }
      this.clearPagination();
      // Simulation request
      this.getTableData(obj);
    },
    showEditOrDeleteModal(item, testSpecSingleData) {
      if (item === "Edit") {
          this.updateVisible(true);
        this.isEdit = true;
        this.getTestSpec(testSpecSingleData);
      } else {
        this.$confirm({
          title: "Are you sure delete this Spec?",
          content: "Id: " + testSpecSingleData.id,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.deleteTestSpec(testSpecSingleData.id);
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.test-spec {
  .test-spec__top {
    margin-bottom: 30px;
    .test-spec__search {
      display: inline-block;
      margin-left: 40px;
    }
    .test-spec__calendar {
      float: right;
      width: 280px;
    }
  }
  .test-spec__tag {
    padding: 0 8px;
    border-radius: 12px;
  }
  .test-case__table {
    .test-case__showState {
      display: block;
      margin: 0 auto;
      width: 15px;
      height: 15px;
      border-radius: 50%;
    }
  }
}
</style>