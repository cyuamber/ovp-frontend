<template>
  <div>
    <a-tabs @change="handleChange">
      <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
        <div class="top">
          <a-button type="primary" @click="handleClick">Rigister {{tab}}</a-button>
          <Search class="search" @SearchVIMOrVNFM="SearchVIMOrVNFM" :currentPage="tab === 'VIM ENV' ? currentPage[0] : currentPage[1]"/>
          <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false"/>
        </div>
        <div class="table">
          <a-table :columns="tab === 'VIM ENV'? VIMColumns : VNFMColumns" :dataSource="tab === 'VIM ENV' ? VIMTableData : VNFMTableData" bordered :loading="loading" 
          rowKey="index" size="default" :pagination="pagination" :scroll="{x: 1630}">
            <span slot="state" slot-scope="state,record">
              <span class="showState" :style="{backgroundColor: record.isOnline? '#52C41A': '#F5222D'}" :title="record.isOnline? 'online': 'offline'"></span>
            </span>
            <span slot="action" slot-scope="action,record">
              <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="tag" 
              @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
            </span>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
    <CreateOrEditModal :isEdit="isEdit" :currentTab="currentTab" v-if="visible" @close="close" :initValues="initValues" @getAllTableData="getAllTableData" :cloudTypeOptions="cloudTypeOptions" :regionIdOptions="regionIdOptions"/>
  </div>
</template>

<script>
import Search from '../../components/Search/Search';
import CreateOrEditModal from './CreateOrEditModal'
import {axiospost, axiosget} from '../../utils/http';
import {testEnvVIMColumns, testEvnVNFMColumns} from '../../const/constant'
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
      VIMColumns: testEnvVIMColumns,
      VNFMColumns: testEvnVNFMColumns,
      loading: false,
      VIMTableData: [],
      VNFMTableData: [],
      pagination: {},
      initValues: {},
      cloudTypeOptions: [],
      regionIdOptions: []
    }
  },
  methods: {
    handleChange(key){
      this.currentTab = key;
      this.getAllTableData()
    },
    handleClick(){
      // Simulation request
      setTimeout(()=> {
        if(this.currentTab === 'VIM ENV'){
          this.CloudTypeOptions = ['VNF', 'PNF', 'FNF'];
          this.regionIdOptions = ['VNF', 'PNF', 'FNF'];
        } 
      },5000)
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
      },() => this.$message.error('Network exception, please try again')
      )
    },
    formatData(data){
      this.pagination = {
        current: 1,
        total: data.total
      }
      console.log(data)
      if (this.currentTab === 'VIM ENV'){
        this.VIMTableData = this.formatTable(data.body)
      }else {
        this.VNFMTableData = this.formatTable(data.body)
      }
    },
    formatTable(list){
      
      return list.map( (item, index) => {
        item.action = ['Edit', 'Delete']
        item.index = list.length * (this.pagination.current -1) + index+1;
        item.createTime = moment(item.createTime).format('YYYY-MM-DD');
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
  }
}
.table{
  .tag{
    padding:0  8px;
    border-radius: 12px;
  }
  .showState{
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