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
      <span slot="action" slot-scope="action, record">
        <a-tag
          v-for="item in action"
          :key="item"
          :color="item === 'Edit' ? 'blue' : 'red'"
          class="tag"
          @click="() => showEditOrDeleteModal(item, record)"
          >{{ item }}</a-tag
        >
      </span>
    </a-table>
  </div>
</template>

<script>
import { TestInsrigisterColumns } from './constant'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'DataTable',

  data() {
    return {
      columns: TestInsrigisterColumns,
      createTime: '',
      keyword: ''
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.TestInstrument.tableData,
      pagination: state => state.TestInstrument.pagination,
      singleData: state => state.TestInstrument.singleData,
      tableLoading: state => state.loading.tableLoading
    })
  },

  methods: {
    ...mapActions('TestInstrument', [
      'getTableData',
      'getPagination',
      'deleteMeterSys'
    ]),
    ...mapMutations('TestInstrument', [
      'updateVisible',
      'updateEdit',
      'updateMeterSys'
    ]),

    handleTableChange(pagination) {
      this.getPagination({ pagination })
      let current = pagination.current,
        pageSize = pagination.pageSize,
        obj = {
          name: this.keyword,
          createTime: this.createTime,
          pageNum: current,
          pageSize: pageSize
        }
      this.getTableData(obj)
    },
    showEditOrDeleteModal(item, singleData) {
      if (item === 'Edit') {
        this.updateVisible(true)
        this.updateEdit(true)
        this.updateMeterSys(singleData)
      } else {
        this.$confirm({
          title: 'Are you sure delete this TTMS?',
          content: 'Id: ' + singleData.id,
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => {
            this.deleteMeterSys({
              id: singleData.id
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.test-ins__container {
  .tag {
    padding: 0 8px;
    border-radius: 12px;
  }
}
</style>
