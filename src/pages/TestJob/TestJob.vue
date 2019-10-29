<template>
  <div class="test-job__container">
    <div class="test-job__top">
      <a-button type="primary" @click="handleCreate">Create Test Job</a-button>
      <a-date-picker class="calendar" @change="handleSelectCreateTime" placeholder="Select date" :allowClear="false"/>
    </div>
    <div class="test-job__table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" 
        rowKey="index" size="default" :pagination="pagination" :scroll="{x: 1630}">
        <span slot="state" slot-scope="state,record">
          <span class="test-job__showState" :style="{backgroundColor: record.status === 0? '#979797': (record.status === 1? '#F5A623':(record.status === 2? '#7ED321':'#D0021B'))}" 
          :title="record.status === 0? '待执行': (record.status === 1? '执行中':(record.status === 2? '执行成功':'执行失败'))"></span>
        </span>
        <span slot="action">
          <a-tag v-for="item in tags" :key="item.name" class='test-job__tag'
            :style="{backgroundColor: item === tags[0]? '#7416EB': (item === tags[1]? '#C109DE':(item === tags[2]? '#588091':(item === tags[3]? '#916858':'#486593')))}"
            @click="item.method"
          >
            {{item.name}}
          </a-tag>
        </span>
      </a-table>
    </div>
    <Drawer :isShow="isShow" @close="close"/>
  </div>
</template>

<script>
import { testJobColumns} from '../../const/constant.js'
import {axiosget} from '../../utils/http.js'
import Drawer from './Drawer'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: "TestJob",
  
  data(){
    return {
      columns: testJobColumns,
      tableData: [],
      loading: false,
      pagination: {},
      tags: [{name: 'Start', method: this.handleStart}, {name: 'Delete', method: this.handleDelete},{name: 'Download',method: this.handleDownload},{name: 'More', method: this.handleOpenDetail}],
    }
  },
  computed: {
    ...mapState({
      isShow: state => state.testJob.isShow
    })
  },
  components: {Drawer},
  mounted () {
    this.getAllTableData()
  },
  methods: {
    handleCreate(){
      this.$store.commit('testJob/setIsShow', true)
    },
    handleSelectCreateTime(date){
      console.log(date._d)
    },
    getAllTableData(){
      axiosget('/getTestJob').then((res) => {
        console.log(res)
        if(res.code === 200){
          this.pagination = {
            current: 1,
            total: res.total
          }
          this.tableData = res.body.map((item,index) => {
            item.createTime = moment(item.createTime).format('YYYY-MM-DD');
            item.index =  res.body.length * (this.pagination.current -1) + index+1;
            return item
          })
        }
      })
    },
    handleStart(){
      console.log(111)
    },
    handleDelete(){
      console.log(444)
    },
    handleDownload(){
      console.log(555)
    },
    handleOpenDetail(){
      console.log(333)
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