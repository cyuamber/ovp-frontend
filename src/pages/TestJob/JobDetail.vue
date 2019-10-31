<template>
  <div class="job-detail">
    <div>
      <p  class="job-detail__back-btn" @click="handleBack"><a-icon type="left" />&nbsp;Back</p>
    </div>
    <div class="job-detail__progress-container" v-if="!(currentJob.currentAction === 'more' && !currentJob.status)">
      <a-progress :percent="percent" :status="status" :showInfo="false" class="job-detail__progress"/>
      <a-button class="job-detail__refresh-btn" @click="handleRefresh"><a-icon type="sync" />Refresh</a-button>
    </div>
    <div class="job-detail__content">
      <div class="job-detail__info">
        <a-card>
          <h2 class="job-detail__info-title">Test Job Info</h2>
          <div v-for="(item,index) in infoList" :key="index" class="job-detail__item-container">
            <p class="job-detail__item-title">{{item.title}}:</p>
            <p class="job-detail__item-text">{{currentJob[item.dataIndex]}}</p>
          </div>
        </a-card>
      </div>
      <div class="job-detail__detail">
        <a-card>
          <a-card-grid style="width: 100%">
            <h2 >Test Job Detail</h2>
            <div class="job-detail__test-env">
              <p v-for="item in currentJob.testENV" :key="item.title"><span>{{item.title}}: </span><span>{{item.text}}</span></p>
            </div>
          </a-card-grid>
          <a-card-grid style="width: 100%" v-for="item in currentJob.testCase" :key="item">
            {{item}} 
          </a-card-grid>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {testJobColumns} from '../../const/constant'
import { mapState } from 'vuex'

  export default {
    name: 'JobDetail',
    computed: {
      ...mapState({
        percent: state => state.testJob.percent,
        status: state => state.testJob.status
      }),
      infoList(){
        let list = []
        testJobColumns.forEach((item) => {
          if(item.title !== 'No.' && item.title !== 'Status' && item.title !== 'Action'){
            list.push(item)
          }
        })
        return list
      },
      currentJob(){
        return this.$route.params
      },     
    },
    created(){
      if(!this.$store.state.router.breadcrumbArr.length){
        this.$store.commit("setCurrentMenu", ["Test Job MGT"]);
        this.$store.commit("setBreadcrumb", ["Test Job MGT"])
      }
    },
    mounted () {
      // If not executed, start the test first.
      let {currentAction, status} = this.$route.params;
      if(currentAction === 'start' && !status){
        this.$store.dispatch('testJob/runTestJobMGT',this.$route.params)
      }else if(status === 1 && currentAction === 'more'){
        this.$store.dispatch('testJob/getProgress')
      }
    },
    methods: {
      handleBack(){
        // this.$router.back()
        this.$router.push('/testjobmgt')
      },
      getProgress(){
        this.$store.dispatch('testJob/getProgress')
      },
      handleRefresh(){
        this.$store.dispatch('testJob/getProgress')
      }
    }
    
  }
</script>

<style lang="less" scoped>
.job-detail{
  .job-detail__back-btn{
    display: inline-biock;
    cursor: pointer;
    font-size: 18px;
  }
  .job-detail__progress-container{
    padding: 20px 30px;
    .job-detail__progress{
      width: 80%;
      margin-right: 7%;
    }
    .job-detail__refresh-btn{
      border-radius: 20px;
    }
  }
  .job-detail__content{
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    .job-detail__info{
      width: 40%;
      .ant-card{
        height: 100%;
      }
      .job-detail__info-title{
        margin-bottom: 24px;
      }
      .job-detail__item-container{
        overflow: hidden;
        .job-detail__item-title{
          float: left;
          width: 140px;
          font-weight: 700;
        }
        .job-detail__item-text{
          float: left;
          font-weight: 400;
        }
      }
    }
    .job-detail__detail{
      width: 59.5%;
      
      .job-detail__test-env{
        margin-top: 16px;
        overflow: hidden;
        p{
          float: left;
          width: 40%;
          font-size: 16px;
        }
      } 
      
    }
  }
}
 
</style>
