
<template>
  <div>
    <a-tabs @change="handleChange">
      <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
        <div class="top">
          <a-button type="primary" @click="handleClick">Create {{tab}} SUT</a-button>
          <Search class="search" @SearchVNFTestName="SearchVNFTestName" :currentPage="currentPage"/>
          <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false" format="DD-MM-YYYY"/>
        </div>
        <div class="table">
          <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="id" size="default" :pagination="pagination">
            <span slot="action" slot-scope="action,record">
              <a-tag v-for="item in action" :key="item" :color="item === 'edit'? 'blue' : 'red'" class="tag" 
              @click="(() => showEditOrDeleteModal(item,tab,record))">{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <CreateOrEditModal :isEdit="isEdit" :currentTab="currentTab" v-if="visible" @close="close" :VNFTest="VNFTest" />
  </div>
</template>

<script>
import Search from '../../components/Search/Search'
import CreateOrEditModal from './VnfTypeObjectsModal'
import http from '../../utils/http'
import moment from 'moment';

export default {
  name: "VnfTypeobject",
  data(){
    return {
      tabs: ['XNF', 'NFVI'],
      currentTab: 'XNF',
      isEdit: false,
      visible: false,
      currentPage: 'VNFTypeObjectsMGT',
      columns: [
        {
          title: 'Name',
          dataIndex: 'VNFTestName'
        },
        {
          title: 'Type',
          dataIndex: 'VNFTypeName'
        },
        { 
          title: 'Vendor',
          dataIndex: 'VNFTestVersion'
        },
        { 
          title: 'Suit',
          dataIndex: 'VNFTestVendor'
        },
        { 
          title: 'Create Time',
          dataIndex: 'createTime'
        },
        {
          title: 'Action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: [],
      loading: false,
      pagination: {},
      VNFTest: {}
    }
  },
  methods: {
    handleClick() {
      this.VNFTest = {} 
      this.isEdit = false;
      this.visible = true;
    },
    handleChange(key){
      this.currentTab = key
    },
    close(){
      this.visible = false;
    },
    formatData(data){
      this.pagination = {
        current: 1,
        total: data.total
      }
      this.tableData = data.body.map( item => {
        item.createTime = moment(item.createTime).format('YYYY-MM-DD') 
        item.action = ['edit', 'delete']
        return item
      })
    },
    SearchVNFTestName(data){
      this.formatData(data)
    },
     // Filter by creating time
    onChange(date) {
      let selectDate = moment(date._d).format('YYYY-MM-DD')
      http.axiosget('/getVNFTest',{createTime: selectDate}).then( res => {
        if(res.code === 200) {
          this.formatData(res);
          this.$message.success('The operation has been successful')
        }
        else this.$message.error('Network exception, please try again');
      })
    }, 
    getAllVnfTest(){
      http.axiosget('/getVNFTest').then(res => {
        if(res.code === 200){
          this.formatData(res)
        }else {
          this.$message.error('Network exception, please try again');
        }
        this.loading = false
      })
    },
    showEditOrDeleteModal(item,tab,VNFTest){
      if(item === 'edit'){
        this.isEdit = true;
        this.currentTab = tab
        this.visible = true;
        this.VNFTest = VNFTest
      }else{
        this.$confirm({
          title: 'Are you sure delete this task?',
          content: 'Some descriptions',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => {
            http.axiospost('/deleteVNFTest',{VNFFileName: VNFTest.VNFFileName}).then( res => {
              if(res.code === 200){
                this.$message.success('Deleted successfully')
              }else this.$message.error('Network exception, please try again');
            })
          }
        });
      }
    }
  },
  mounted () {
    this.getAllVnfTest()
  },
  components: {
    CreateOrEditModal,
    Search
  }

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
    margin-right: 20px;
  }
}
.table{
    width: 80%;
    .tag{
      padding:0  8px;
      border-radius: 12px;
    }
  }
</style>>

