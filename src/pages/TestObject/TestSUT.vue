<template>
  <div>
    <Loading :loadingMessage="loadingMessage" />
    <a-tabs @change="handleTabsChange">
      <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
        <div class="tab-content tab-content--margin">
          <a-button type="primary" @click="handleCreate">Create {{tab}} SUT</a-button>
          <Search class="tab-content__button" @serchTestSUT="serchTestSUT" :currentPage="currentPage"/>
          <a-date-picker class="tab-content__calendar" @change="onChange" placeholder="Select date"/>
        </div>
        <div class="table">
          <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="id" size="default" :pagination="pagination" @change="pageChange">
            <span slot="action" slot-scope="action,record">
              <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue': (item === 'Delete'?'red': 'green')" class="table__tag" 
              @click="(() => showEditOrDeleteModal(item,tab,record))">{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <SUTCreateOrEdit :isEdit="isEdit" :currentTab="currentTab"/>
  </div>
</template>

<script>
import Search from '../../components/Search/Search'
import SUTCreateOrEdit from './SUTCreateOrEdit'
import {TestSUTColumns} from '../../const/constant'
import Loading from '../../components/Loading/Loading'
import {mapState} from 'vuex'

export default {
  name: "VnfTypeobject",
  data(){
    return {
      tabs: ['VNF', 'PNF', 'NFVI'],
      currentTab: 'VNF',
      isEdit: false,
      currentPage: 'TestSUT',
      columns: TestSUTColumns,
      loading: false,
      // createTime: '',
      // keyword: '',
    }
  },
  computed: {
    ...mapState ({
      tableData: state => state.testSUT.tableData,
      pagination: state => state.testSUT.pagination,
      VNFTest: state => state.testSUT.VNFTest,
      loadingMessage: state => state.testSUT.loadingMessage,
      visible: state => state.testSUT.visible,
      createTime: state => state.testSUT.createTime,
      keyword: state => state.testSUT.keyword,
    }),
  },
  components: {
    SUTCreateOrEdit,
    Search,
    Loading
  },
  mounted () {
    this.loading = true;
    this.$store.dispatch('testSUT/getTableData',{}).then(() => this.loading = false)
  },
  methods: {
    handleCreate() {
      this.$store.commit('testSUT/updateVisible', true)
      this.$store.dispatch('testSUT/getVNFOptions')
      this.isEdit = false;
    },
    handleTabsChange(key){
      this.currentTab = key
    },
    // Get table data by entering information or selecting time
    serchTestSUT(keyword){
      this.$store.commit('testSUT/setFilterItem',{key: keyword, isSearch: true, message: this.$message})
      this.$store.dispatch('testSUT/setParams',true)
    },
     // Filter by creating time
    onChange(date,d) {
      this.$store.commit('testSUT/setFilterItem',{time: d})
      this.$store.dispatch('testSUT/setParams',true)
    }, 
    showEditOrDeleteModal(item,tab,VNFTest){
      console.log(VNFTest)
      if(item === 'Edit'){
        this.isEdit = true;
        this.currentTab = tab
        this.$store.commit('testSUT/updateVNFTest',VNFTest)
        this.$store.commit('testSUT/updateVisible',true)
      }else if(item === 'Delete') this.showConfirm(item,'Are you sure delete this task?', VNFTest)
      else this.showConfirm(item,'Whether to confirm the download？',VNT)
    },
    showConfirm(item,title,VNFTest){
      this.$confirm({
        title,
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk: () => {
          if(item === 'Delete') this.$store.dispatch('testSUT/deleteVNFTest',{VNFFileName: VNFTest.VNFFileName})
          else console.log('下载')
        }
      });
    },
    pageChange(pageObj){
      // this.$store.dispatch('getTableData',pageObj)
      this.$store.commit('testSUT/setFilterItem',{pageObj})
      this.$store.dispatch('testSUT/setParams',true)
    }
  },
  

};
</script>

<style lang="less" scoped>
.tab-content--margin{
  margin-top: 10px;
  margin-bottom: 30px;
  .tab-content__button{
    display: inline-block;
    margin-left: 40px;
  }
  .tab-content__calendar{
    float: right;
    width: 280px;
  }
}
.table{
    .table__tag{
      padding:0  8px;
      border-radius: 12px;
    }
  }
</style>>

