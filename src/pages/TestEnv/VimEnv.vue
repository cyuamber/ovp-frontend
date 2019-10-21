<template>
  <div>
    <a-tabs @change="handleChange">
      <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
        <div class="top">
          <a-button type="primary" @click="handleClick">Rigister {{tab}}</a-button>
          <Search class="search" @SearchVIMOrVNFM="SearchVIMOrVNFM" :currentPage="tab === 'VIM ENV' ? currentPage[0] : currentPage[1]"/>
          <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false" format="DD-MM-YYYY"/>
        </div>
        <div class="table">
          <a-table :columns="tab === 'VIM ENV'? VIMColumns : VNFMColumns" :dataSource="tab === 'VIM ENV' ? VIMTableData : VNFMTableData" bordered :loading="loading" 
          rowKey="userName" size="default" :pagination="pagination" :scroll="{ x: 1400 }">
            <span slot="action" slot-scope="action,record">
              <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="tag" 
              @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <CreateOrEditModal :isEdit="isEdit" :currentTab="currentTab" v-if="visible" @close="close" :initValues="initValues" @getAllTableData="getAllTableData"/>
  </div>
</template>

<script>
import Search from '../../components/Search/Search';
import CreateOrEditModal from './CreateOrEditModal'
import {axiospost, axiosget} from '../../utils/http';
import moment from 'moment';

export default {
  name: "VimEnv",
  data(){
    return {
      tabs: ['VIM ENV', 'VNFM ENV'],
      currentPage: ['VIMTestEnvMGT', 'VNFMTestEnvMGT'],
      isEdit: false,
      currentTab: 'VIM ENV',
      visible: false,
      VIMColumns: [
        {
          title: 'State',
          dataIndex: 'state',
          fixed: 'left'
        },
        {
          title: 'CloudOwner',
          dataIndex: 'cloudOwner'
        },
        {
          title: 'Cloud Region ID',
          dataIndex: 'cloudRegionId',
        },
        {
          title: 'Cloud Version',
          dataIndex: 'cloudVersion',
        },
        {
          title: 'Owner Defined Type',
          dataIndex: 'ownerDefinedType',
        },
        {
          title: 'Cloud Zone',
          dataIndex: 'cloudZone'
        },
        {
          title: 'User Name',
          dataIndex: 'userName'
        },
        {
          title: 'Password',
          dataIndex: 'passwd'
        },
        {
          title: 'Auth URL',
          dataIndex: 'authUrl'
        },
        {
          title: 'Tenant',
          dataIndex: 'tenant'
        },
        {
          title: 'Action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ],
      VNFMColumns: [
        {title: 'Name', dataIndex: 'VNFMname',fixed: 'left'},
        {title: 'Type', dataIndex: 'VNFMtype'},
        {title: 'Vendor', dataIndex: 'VNFMvendor'},
        {title: 'Vension', dataIndex: 'VNFMversion'},
        {title: 'URL', dataIndex: 'url'},
        {title: 'VIM', dataIndex: 'vim'},
        {title: 'Certificate URL', dataIndex: 'authUrl'},
        {title: 'User Name', dataIndex: 'userName'},
        {title: 'Password', dataIndex: 'passwd'},
         {
          title: 'Action',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ],
      loading: false,
      VIMTableData: [],
      VNFMTableData: [],
      pagination: {},
      initValues: {}
    }
  },
  methods: {
    handleChange(key){
      this.currentTab = key;
      this.getAllTableData()
    },
    handleClick(){
      this.visible = true;
      this.isEdit = false;
      this.initValues = {}
    },
    SearchVIMOrVNFM(data){
      this.formatData(data)
    },
    onChange(date){
      let selectDate = moment(date._d).format('YYYY-MM-DD')
      let url = this.currentTab === 'VIM ENV' ? '/getVIM': '/getVNFM' 
      axiosget(url,{createTime: selectDate}).then( res => {
        if(res.code === 200) {
          this.formatData(res);
          this.$message.success('The operation has been successful')
        }
        else this.$message.error('Network exception, please try again');
      })
    },
    close(){
      this.visible = false
    },
    getAllTableData(){
      this.loading = true
      let url = this.currentTab === 'VIM ENV' ? '/getVIM': '/getVNFM'
      axiosget(url).then(res => {
        if(res.code === 200){
          this.formatData(res)
        }else {
          this.$message.error('Failed to get form data');
        }
        this.loading = false
      },error => this.$message.error('Network exception, please try again')
      )
    },
    formatData(data){
      this.pagination = {
        current: 1,
        total: data.total
      }
      if (this.currentTab === 'VIM ENV'){
        this.VIMTableData = this.formatTable(data.body)
      }else {
        this.VNFMTableData = this.formatTable(data.body)
      }
    },
    formatTable(list){
      return list.map( item => {
        item.action = ['Edit', 'Delete']
        return item
      })
    },
    showEditOrDeleteModal(item,record){
      if(item === 'Edit'){
        let arr = []
        for (const i in record) {
          if(i !== 'state') arr.push(record[i])
        }
        this.initValues = arr
        this.visible = true;
        this.isEdit = true;
      }else {
        this.$confirm({
          title: 'Are you sure delete this task?',
          content: 'Some descriptions',
          okText: 'Yes',
          okType: 'danger',
          cancelText: 'No',
          onOk: () => {
            let url = this.currentTab === 'VIM ENV' ? '/deleteVIM' : '/deleteVNFM';
            let data = null;
            if(this.currentTab === 'VIM ENV'){
              data = {cloudRegionId: record.cloudRegionId}
            }else {
              data = {
                VNFMname: record.VNFMname,
                VNFMtype: record.VNFMtype
              }
            }
            axiospost(url,data).then( res => {
              if(res.code === 200){
                this.$message.success('Deleted successfully')
                this.getAllTableData()
              }else this.$message.error('Network exception, please try again');
            })
          }
        });
      }
    }
  },
  mounted () {
    this.getAllTableData()
  },
  components: {
    Search,
    CreateOrEditModal
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
    // margin-right: 20px;
  }
}
.table{
    // width: 80%;
    .tag{
      padding:0  8px;
      border-radius: 12px;
    }
  }
</style>>