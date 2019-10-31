<template>
  <div class="test-job__container">
    <Loading :loadingMessage="loadingMessage" />
    <div class="test-job__top">
      <a-button type="primary" @click="handleCreate">Create Test Job</a-button>
      <a-date-picker class="calendar" @change="handleSelectCreateTime" placeholder="Select date" :allowClear="false"/>
    </div>
    <div class="test-job__table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" 
        rowKey="index" size="default" :pagination="pagination" :scroll="{x: 1630}">
        <span slot="status" slot-scope="status,record">
          <span class="test-job__showState" :style="{backgroundColor: record.status === 0? '#979797': (record.status === 1? '#F5A623':(record.status === 2? '#7ED321':'#D0021B'))}" 
          :title="record.status === 0? '待执行': (record.status === 1? '执行中':(record.status === 2? '执行成功':'执行失败'))"></span>
        </span>
        <span slot="action" slot-scope="action,record">
          <a-tag v-for="item in record.actions" :key="item" class='test-job__tag'
            :style="{backgroundColor: item === record.actions[0]? '#7416EB': (item === record.actions[1]? '#C109DE':(item === record.actions[2]? '#588091':(item === record.actions[3]? '#916858':'#486593')))}"
            @click="(()=> handleActions(item,record))"
          >
            {{item}}
          </a-tag>
        </span>
      </a-table>
    </div>
    <Drawer :isShow="isShow" @close="close"/>
  </div>
</template>

<script>
import {testJobColumns} from '../../const/constant.js'
import Loading from '../../components/Loading/Loading'
import Drawer from './Drawer'
import { mapState } from 'vuex'

export default {
  name: "TestJob",
  
  data(){
    return {
      columns: testJobColumns,
      loading: false,
      // tags: [{name: 'Start', method: this.handleStart}, {name: 'Delete', method: this.handleDelete},{name: 'Download',method: this.handleDownload},{name: 'More', method: this.handleOpenDetail}],
    }
  },
  computed: {
    ...mapState({
      isShow: state => state.testJob.isShow,
      loadingMessage: state => state.testJob.loadingMessage,
      tableData: state => state.testJob.tableData,
      pagination: state => state.testJob.pagination
    }),
  },
  components: {Drawer, Loading},
  mounted () {
    this.$store.dispatch('testJob/getTableData')
  },
  methods: {
    handleCreate(){
      this.$store.commit('testJob/setIsShow', true)
    },
    handleSelectCreateTime(date){
      console.log(date._d)
    },
    handleActions(action, data){
      if(action === 'Start') this.handleStart(data)
       /* this.$router.push({name: 'JobDetail', params: data}) */
      else if(action === 'Delete') this.handleDelete(data)
      else if(action === 'More') this.handleOpenDetail(data)
    },
    handleStart(data){
      data.currentAction = 'start'
      this.$store.commit("setCurrentMenu", ["Test Job MGT"]);
      this.$store.commit("setBreadcrumb", ["Test Job MGT"])
        // this.$router.push({path: 'testjobmgt'})
      this.$router.push({name: 'JobDetail', params: data})
    },
    handleDelete(data){
      this.$confirm({
        title: 'Are you sure delete this task?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk:() => {
          this.$store.dispatch('testJob/delete',data)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    },
    handleDownload(){
      console.log(555)
    },
    handleOpenDetail(data){
      data.currentAction = 'more'
      this.$router.push({name: 'JobDetail', params: data})
    },
    close(){
      this.$store.commit('testJob/setIsShow', false)
    }
  }
};
</script>
<style lang="less" scope>
.test-job__container{
  .test-job__top{
    margin-bottom: 30px;
    .calendar{
      float: right;
      width: 280px;
    }
  }
  .test-job__table{
    .test-job__showState{
      display: block;
      margin: 0 auto;
      width: 15px;
      height: 15px;
      border-radius: 50%;
    }
    .test-job__tag{
      line-height: 20px;  
      padding:0  8px;
      border-radius: 12px;
      color: white;
      font-size: 14px;
    }
  }
}

</style>