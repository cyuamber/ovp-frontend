<template>
  <div class="vnf-type__container">
    <div class="top">
      <a-button type="primary" @click="handleClick">Create VNF Type</a-button>
      <Search class="search" @searchVNFTypeID="searchVNFTypeID" :currentPage="currentPage"/>
      <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false" format="DD-MM-YYYY"/>
    </div>
    <div class="table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="id" size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'edit'? 'blue' : 'red'" class="tag" 
        @click="(() => showEditOrDeleteModal(item,record.VNFTypeName,record.id))">{{item}}</a-tag>
      </span>
    </a-table>
    </div>
    <CreateOrEdit :visible="visible" @close="close" @getAllVnfType="getAllVnfType" :VnfTypeName="VnfTypeName" :isEdit="isEdit"/>
  </div>
</template>

<script>
import moment from 'moment'
import http from '../../utils/http'
import Search from '../../components/Search/Search'
import CreateOrEdit from './VnfTypeCreateOrEdit'

export default {
  name: "VnfType",
  data(){
    return{
      visible: false,
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: 'VNF Type',
          dataIndex: 'VNFTypeName'
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
      loading: true,
      pagination: {},
      VnfTypeName: '',
      isEdit: false,
      currentPage: 'vnfTypeMC'
    }
  },
  
  methods: {
    handleClick(){
      this.visible = true;
      this.isEdit = false
    },
    getAllVnfType(){
      http.axiosget('/getVNFType').then(res => {
        if(res.code === 200){
          this.formatData(res)
        }else {
          this.$message.error('Network exception, please try again');
        }
        this.loading = false
      })
    },
    // Filter by creating time
    onChange(date) {
      let selectDate = moment(date._d).format('YYYY-MM-DD')
      http.axiosget('/getVNFType',{createTime: selectDate}).then( res => {
        if(res.code === 200) this.formatData(res);
        else this.$message.error('Network exception, please try again');
      })
    }, 
    // Format response table data
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
    searchVNFTypeID(data){
      this.formatData(data)
    },
    close(){
      this.visible = false;
    },
    showEditOrDeleteModal(item,VnfTypeName,id){
      if(item === 'edit') {
        this.visible = true;
        this.isEdit = true;
        this.VnfTypeName = VnfTypeName
      }else {
        this.$confirm({
          title: 'Are you sure delete this task?',
          content: 'Some descriptions',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => {
            http.axiospost('/deleteVNFType',{id}).then( res => {
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
    this.getAllVnfType()
  },
  components: {
    Search,
    CreateOrEdit
  },
};
</script>

<style lang="less" scoped> 
.vnf-type__container{
  .top{
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
    width: 70%;
  }
  .tag{
    padding:0  8px;
    border-radius: 12px;
  }
}
  
</style>