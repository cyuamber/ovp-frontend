<template>
  <div class="test-case">
    <div class="test-case__top">
      <a-input-group class="test-case__inputgroup">
        <a-row :gutter="6">
          <a-col :span="9">
            <a-input placeholder="Input Name" v-model="inputName" allowClear/>
            <a-icon type="close-circle" :class="[{'ant-calendar-picker-clear':inputName.length === 0},{'ant-calendar-picker-icon':inputName.length !== 0}]" @click="clearInputName()"/>
          </a-col>
          <a-col :span="9">
            <a-input placeholder="Input Version" v-model="inputVersion" allowClear />
            <a-icon type="close-circle" :class="[{'ant-calendar-picker-clear':inputVersion.length === 0},{'ant-calendar-picker-icon':inputVersion.length !== 0}]" @click="clearInputVersion()"/>
          </a-col>
          <a-button type="primary" icon="search" @click="testCaseSearch">Search</a-button>
        </a-row>
      </a-input-group>
      <a-date-picker class="calendar" @change="handleSelectCreateTime"  placeholder="Select date"/>
    </div>
    <div class="test-case__table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="index" size="default" :pagination="pagination">
        <span slot="testCaseState" slot-scope="state,record">
          <span class="test-case__showState" :style="{backgroundColor: record.testCaseState === 0? '#979797': '#7ED321'}"
                :title="record.testCaseState === 0? 'Available': 'unavailable'"></span>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
    import { TestCaseColumns} from '../../const/constant.js'
    import {mapState} from 'vuex'
export default {
  name: "TestCase",
    data(){
        return {
            columns: TestCaseColumns,
            loading: false,
            publishTime: '',
            inputName:"",
            inputVersion:"",
        }
    },
    computed: {
        ...mapState ({
            tableData: state => state.testCase.tableData,
            pagination: state => state.testCase.pagination,
        }),
    },
    mounted () {
        this.loading = true;
        this.$store.dispatch('testCase/getTableData',{}).then(() => this.loading = false)
    },
    methods: {
        clearInputName(){
            if(this.inputName)this.inputName = ''
        },
        clearInputVersion(){
            if(this.inputVersion)this.inputVersion = ''
        },
        handleSelectCreateTime(date,d){
            this.publishTime = d;
            this.testCaseSearch()
        },
        testCaseSearch(){
            this.loading = true;
            let obj = {};
            if(!(this.inputName === '' && this.inputVersion === '' && this.publishTime === '')) {
                obj = {testCaseName: this.inputName, testCaseVersion:this.inputVersion, publishTime: this.publishTime};
            }
            this.$store.dispatch('testCase/getTableData',obj).then(() => setTimeout(() => {
                this.loading = false
            },2000))
        }
    }
};
</script>
<style lang="less" scope>
  .test-case{
    .test-case__top{
      margin-bottom: 30px;
      .test-case__inputgroup{
        display: inline-block;
        width: 480px;
        .ant-calendar-picker-icon{
          cursor: pointer;
        }
      }
      .calendar{
        float: right;
        width: 280px;
      }
    }
    .test-case__table{
      .test-case__showState{
        display: block;
        margin: 0 auto;
        width: 15px;
        height: 15px;
        border-radius: 50%;
      }
    }
  }

</style>