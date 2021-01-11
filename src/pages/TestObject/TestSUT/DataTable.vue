<template>
  <div>
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
        <span slot="action" slot-scope="action, record">
          <a-tag
            v-for="item in action"
            :key="item"
            :color="
              item === 'Edit' ? 'blue' : item === 'Delete' ? 'red' : 'green'
            "
            class="table__tag"
            @click="() => showEditOrDeleteModal(item, record)"
          >
            {{ item }}
          </a-tag>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import { TestSUTColumns } from './constant'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'DataTable',
  data() {
    return {
      currentPage: 'TestSUT',
      columns: TestSUTColumns
    }
  },
  computed: {
    ...mapState({
      tableData: state => state.testSUT.tableData,
      pagination: state => state.testSUT.pagination,
      VNFTest: state => state.testSUT.VNFTest,
      tableLoading: state => state.loading.tableLoading
    })
  },

  methods: {
    ...mapActions('testSUT', ['setParams', 'deleteVNFTest', 'downloadFile']),
    ...mapMutations('testSUT', [
      'updateVisible',
      'updateEdit',
      'setFilterItem',
      'updateVNFTest'
    ]),

    showEditOrDeleteModal(item, VNFTest) {
      if (item === 'Edit') {
        this.updateEdit(true)
        this.updateVNFTest(VNFTest)
        this.updateVisible(true)
      } else if (item === 'Delete')
        this.showConfirm(item, 'Are you sure delete this task?', VNFTest)
      else {
        if (VNFTest.fileName) {
          this.$confirm({
            title: 'Are you sure download this Spec?',
            content: 'fileName: ' + VNFTest.fileName,
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => {
              this.downloadFile({
                fileName: VNFTest.fileName,
                fileAliasName: VNFTest.fileAliasName
              })
            }
          })
        } else {
          this.$message.warning("There's no file for this package")
        }
      }
    },
    showConfirm(item, title, VNFTest) {
      this.$confirm({
        title,
        content: 'Are you sure to delete this package?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          this.deleteVNFTest({
            id: VNFTest.id
          })
        }
      })
    },
    pageChange(pageObj) {
      this.setFilterItem({ pageObj })
      this.setParams(true)
    }
  }
}
</script>

<style lang="less" scoped>
.table {
  .table__tag {
    padding: 0 8px;
    border-radius: 12px;
  }
}</style
>>
