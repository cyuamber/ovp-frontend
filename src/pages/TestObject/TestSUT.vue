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
          <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="id" size="default" :pagination="pagination">
            <span slot="action" slot-scope="action,record">
              <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="table__tag" 
              @click="(() => showEditOrDeleteModal(item,tab,record))">{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <SUTCreateOrEdit :isEdit="isEdit" :currentTab="currentTab" :visible="visible" @close="close"/>
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
      visible: false,
      currentPage: 'TestSUT',
      columns: TestSUTColumns,
      loading: false,
      createTime: '',
      keyword: '',
    }
  },
  computed: {
    ...mapState ({
      tableData: state => state.testSUT.tableData,
      pagination: state => state.testSUT.pagination,
      VNFTest: state => state.testSUT.VNFTest,
      loadingMessage: state => state.testSUT.loadingMessage
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
      this.$store.dispatch('testSUT/getVNFTest','')
      this.$store.dispatch('testSUT/getVNFOptions')
      this.isEdit = false;
      this.visible = true;
    },
    handleTabsChange(key){
      this.currentTab = key
    },
    // Get table data by entering information or selecting time
    serchTestSUT(keyword, isSearch){
      if(keyword === '' && this.createTime === '') {
        if(isSearch) {
          if(!this.keyword){
            this.$message.warning('Please enter valid search information')
          }else {
            this.$store.dispatch('testSUT/getTableData',{}).then(() => this.loading = false)
            this.keyword = ''
          }
        }       
        return
      }
      this.keyword = keyword
      this.loading = true;
      let obj = {keyword: this.keyword, createTime: this.createTime}
      // Simulation request
      this.$store.dispatch('testSUT/getTableData',obj).then(() => setTimeout(() => {
        this.loading = false
      },2000))
    },
    close(){
      this.visible = false;
    },
     // Filter by creating time
    onChange(date,d) {
      this.createTime = d
      this.serchTestSUT()
    }, 
    showEditOrDeleteModal(item,tab,VNFTest){
      if(item === 'Edit'){
        this.isEdit = true;
        this.currentTab = tab
        this.visible = true;
        this.$store.dispatch('testSUT/getVNFTest',VNFTest)
      }else{
        this.$confirm({
          title: 'Are you sure delete this task?',
          content: 'Some descriptions',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => {
            this.$store.dispatch('testSUT/deleteVNFTest',{VNFFileName: VNFTest.VNFFileName})
          }
        });
      }
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

