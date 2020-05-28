<template>
  <div class="table">
    <a-table
      v-if="tableType !== 'MANO ENV'"
      :columns="tableType === 'VIM ENV'? VIMColumns : VNFMColumns"
      :dataSource="tableType === 'VIM ENV' ? VIMTableData : VNFMTableData"
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
    <a-table
      v-else-if="tableType === 'MANO ENV'"
      :columns="MANOColumns"
      :dataSource="MANOTableData"
      bordered
      :loading="tableLoading"
      rowKey="index"
      size="default"
      :pagination="pagination"
      @change="pageChange"
    >
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
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import {
  testEnvVIMColumns,
  testEvnVNFMColumns,
  testMANOColumns
} from "./constant";
export default {
  props: ["tableType"],
  name: "DataTable",
  data() {
    return {
      VIMColumns: testEnvVIMColumns,
      VNFMColumns: testEvnVNFMColumns,
      MANOColumns: testMANOColumns
    };
  },
  computed: {
    ...mapState({
      tableLoading: state => state.loading.tableLoading,
      pagination: state => state.testENV.pagination,
      VIMTableData: state => state.testENV.VIMTableData,
      VNFMTableData: state => state.testENV.VNFMTableData,
      MANOTableData: state => state.testENV.MANOTableData
    })
  },
  methods: {
    ...mapMutations("testENV", [
      "changeTab",
      "updateVisible",
      "setFilterItem",
      "setInitValues",
      "updateEdit"
    ]),
    ...mapMutations("searching", ["setKeyword"]),
    ...mapMutations("datePicker", ["setDateTime"]),
    ...mapActions("testENV", ["setParams", "deleteData"]),
    showEditOrDeleteModal(item, record) {
      if (item === "Edit") {
        this.setInitValues({ record, item });
        this.updateVisible(true);
        this.updateEdit(true);
      } else {
        this.$confirm({
          title: "Are you sure delete this task?",
          content: "Some descriptions",
          okText: "Yes",
          okType: "danger",
          cancelText: "No",
          onOk: () => {
            this.deleteData({
              data: record
            });
          }
        });
      }
    },
    pageChange(pageObj) {
      this.setFilterItem({ pageObj });
      this.setParams();
    }
  },
    beforeDestroy(){
        this.setKeyword("");
        this.setDateTime("")
    }
};
</script>

<style lang="less" scoped>
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
