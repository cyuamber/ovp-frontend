<template>
  <div class="test-case">
    <Loading :loadingMessage="loadingMessage" />
    <div class="test-case__top">
      <a-input-group class="test-case__inputgroup">
        <a-row :gutter="6">
          <a-col :span="9">
            <a-input placeholder="Input Name" v-model="inputName" allowClear/>
            <a-icon type="close-circle" :class="[{'ant-calendar-picker-clear':inputName.length === 0},{'ant-calendar-picker-icon':inputName.length !== 0}]" @click="(() => clearInput('name'))"/>
          </a-col>
          <a-col :span="9">
            <a-input placeholder="Input Version" v-model="inputVersion" allowClear />
            <a-icon type="close-circle" :class="[{'ant-calendar-picker-clear':inputVersion.length === 0},{'ant-calendar-picker-icon':inputVersion.length !== 0}]" @click="(() => clearInput('version'))"/>
          </a-col>
          <a-button type="primary" icon="search" :loading="searchLoading" @click="(() =>testCaseSearch('SearchClick'))">Search</a-button>
        </a-row>
      </a-input-group>
      <a-date-picker class="calendar" @change="handleSelectCreateTime"  placeholder="Select date"/>
    </div>
    <div class="test-case__table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="index" size="default" :pagination="pagination" @change="handleTableChange">
        <span slot="testCaseState" slot-scope="state,record">
          <span class="test-case__showState" :style="{backgroundColor: record.testCaseState === 0? '#d0021b': '#7ED321'}"
                :title="record.testCaseState === 0? 'Available': 'unavailable'"></span>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
    import { TestCaseColumns} from '../../const/constant.js'
    import Loading from "../../components/Loading/Loading";
    import {mapState} from 'vuex'
export default {
  name: "TestCase",
    components: {
        Loading
    },
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
            loadingMessage: state => state.testCase.loadingMessage,
            searchLoading: state => state.testCase.searchLoading,
        }),
    },
    mounted () {
        this.loading = true;
        this.$store.dispatch('testCase/getTableData',{}).then(() => setTimeout(() => {
            this.loading = false
        },2000))
    },
    methods: {
        clearInput(val){
            if(val === 'name'){this.inputName = ''}else {this.inputVersion = ''}
            let obj = {testCaseName: this.inputName, testCaseVersion:this.inputVersion, publishTime: this.publishTime};
            if((this.inputName === '' || this.inputVersion === '') && this.publishTime === '')this.$store.commit('testCase/updateclearFilter', true);
            this.$store.dispatch('testCase/clearPagination');
            this.$store.dispatch('testCase/getTableData',obj)
        },
        handleTableChange(pagination){
            this.loading = true;
            this.$store.dispatch('testCase/getPagination',{pagination});
            let current = pagination.current,
                pageSize = pagination.pageSize,
                obj = {testCaseName: this.inputName, testCaseVersion:this.inputVersion, pageNum:current,pageSize:pageSize};
            this.$store.dispatch('testCase/getTableData',obj).then(() => this.loading = false)
        },
        handleSelectCreateTime(date,d){
            this.publishTime = d;
            this.testCaseSearch();
        },
        testCaseSearch(SearchClick){
            this.loading = true;
            if(SearchClick === 'SearchClick'){
                this.$store.commit('testCase/updateSearchLoading', true)
            }
            let obj = {};
            if(!(this.inputName === '' && this.inputVersion === '' && this.publishTime === '')) {
                obj = {testCaseName: this.inputName, testCaseVersion:this.inputVersion, publishTime: this.publishTime};
            }
            this.$store.dispatch('testCase/clearPagination');
            this.$store.dispatch('testCase/getTableData',obj).then(() => this.loading = false)
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