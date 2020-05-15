<template>
  <div class="test-ins__container">
    <Loading :loadingMessage="loadingMessage" />
    <div class="top">
      <a-button type="primary" @click="handleCreateClick">Register TTMS</a-button>
      <Search class="search" @testInsSearch="testInsSearch" :currentPage="currentPage" />
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
            v-for="item in action"
            :key="item"
            :color="item === 'Edit'? 'blue' : 'red'"
            class="tag"
            @click="(() => showEditOrDeleteModal(item,record))"
          >{{item}}</a-tag>
        </span>
      </a-table>
    </div>
    <RigisterOrEdit
      v-if="visible"
      @close="close"
      :isEdit="isEdit"
      @getAllMeterSys="getAllMeterSys"
    />
  </div>
</template>

<script>
import Search from "../../../components/Search/Search";
import { TestInsrigisterColumns } from "./constant";
import RigisterOrEdit from "./TestInsrigisterOrEdit";
import Loading from "../../../components/Loading/Loading";
import { mapState, mapActions } from "vuex";
export default {
  name: "TestInstrument",
  components: {
    Search,
    RigisterOrEdit,
    Loading
  },
  data() {
    return {
      visible: false,
      columns: TestInsrigisterColumns,
      currentPage: "TestInstrumentMGT",
      isEdit: false,
      createTime: "",
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.testInstrument.tableData,
      pagination: state => state.testInstrument.pagination,
      singleData: state => state.testInstrument.singleData,
      loadingMessage: state => state.loading.loadingMessage,
      tableLoading: state => state.loading.tableLoading
    })
  },
  mounted() {
    this.initTestInsTable();
  },
  methods: {
    ...mapActions("testInstrument", [
      "getTableData",
      "getMeterSys",
      "getPagination",
      "clearPagination",
      "deleteMeterSys"
    ]),
    initTestInsTable() {
      this.getTableData({});
    },
    handleCreateClick() {
      this.getMeterSys("");
      this.visible = true;
      this.isEdit = false;
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
      this.testInsSearch();
    },
    testInsSearch(keyword, isSearch) {
      let obj = {};
      if (isSearch) this.keyword = keyword;
      if (!(keyword === "" && this.createTime === "")) {
        obj = { name: this.keyword, createTime: this.createTime };
      }
      this.clearPagination();
      // Simulation request
      this.getTableData(obj);
    },
    close() {
      this.visible = false;
    },
    showEditOrDeleteModal(item, singleData) {
      if (item === "Edit") {
        this.visible = true;
        this.isEdit = true;
        this.getMeterSys(singleData);
      } else {
        this.$confirm({
          title: "Are you sure delete this TTMS?",
          content: "Id: " + singleData.id,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.deleteMeterSys({
              id: singleData.id
            });
          }
        });
      }
    },
    getAllMeterSys() {
      this.getTableData({});
    }
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