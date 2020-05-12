<template>
  <div class="test-ins__container">
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
</template>

<script>
import { VnfpnfSuiteColumns } from "./constant";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "DataTable",

  data() {
    return {
      columns: VnfpnfSuiteColumns,
      currentPage: "VNF/PNFSuiteMGT",
      createTime: "",
      keyword: ""
    };
  },
  computed: {
    ...mapState({
      tableData: state => state.VnfpnfSuite.tableData,
      pagination: state => state.VnfpnfSuite.pagination,
      SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
      loadingMessage: state => state.loading.loadingMessage,
      tableLoading: state => state.loading.tableLoading
    })
  },

  methods: {
    ...mapActions("VnfpnfSuite", [
      "getTableData",
      "getPagination",
      "deleteTestMeter",
      "downloadFile"
    ]),
    ...mapMutations("VnfpnfSuite", [
      "updateVisible",
      "updateEdit",
      "updateVNFTest"
    ]),

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

    showEditOrDeleteModal(item, SuiteSingleData) {
      if (item === "Edit") {
        this.updateVisible(true);
        this.updateEdit(true);
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
        this.$confirm({
          title: "Are you sure download this xNF TT?",
          content: "File Name: " + SuiteSingleData.fileName,
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.downloadFile({
              fileName: SuiteSingleData.fileName,
              fileAliasName: SuiteSingleData.fileAliasName
            });
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.test-ins__container {
  .tag {
    padding: 0 8px;
    border-radius: 12px;
  }
}
</style>
