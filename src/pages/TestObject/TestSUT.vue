<template>
  <div>
    <a-tabs @change="handleTabsChange">
      <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
        <div class="top">
          <a-button type="primary" @click="handleCreate">Create {{tab}} SUT</a-button>
          <Search class="search" @serchTestSUT="serchTestSUT" :currentPage="currentPage"/>
          <a-date-picker class="calendar" @change="onChange" placeholder="Select date"/>
        </div>
        <div class="table">
          <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="id" size="default" :pagination="pagination">
            <span slot="action" slot-scope="action,record">
              <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="tag" 
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
import {axiospost} from '../../utils/http';
import {TestSUTColumns} from '../../const/constant'
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
      keyword: ''
    }
  },
  computed: {
    ...mapState ({
      tableData: state => state.testSUT.tableData,
      pagination: state => state.testSUT.pagination,
      VNFTest: state => state.testSUT.VNFTest,
    }),
  },
  components: {
    SUTCreateOrEdit,
    Search
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
      this.loading = true;
      if(isSearch) this.keyword = keyword; 
      if(keyword === '' && this.createTime === '') {
        this.$message.warning('Please enter valid search information')
        return
      }
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
            axiospost('/deleteVNFTest',{VNFFileName: VNFTest.VNFFileName}).then( res => {
              if(res.code === 200){
                this.$message.success('Deleted successfully')
              }else this.$message.error('Network exception, please try again');
            })
          }
        });
      }
    }
  },
  

};
</script>

<style lang="less" scoped>
.top{
  margin-top: 10px;
  margin-bottom: 30px;
  .search{
    display: inline-block;
    margin-left: 40px;
  }
  .calendar{
    float: right;
    width: 280px;
  }
}
.table{
    .tag{
      padding:0  8px;
      border-radius: 12px;
    }
  }
</style>>

