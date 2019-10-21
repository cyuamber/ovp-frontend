<template>
  <div class="test-ins__container">
    <div class="top">
      <a-button type="primary" @click="handleClick">Rigister TTMS</a-button>
      <Search class="search" @testInsSearch="testInsSearch" :currentPage="currentPage"/>
      <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false" format="DD-MM-YYYY"/>
    </div>
    <div class="table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="meterSysName" size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'EDIT'? 'blue' : 'red'" class="tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
      </a-table>
    </div>
    <RigisterOrEdit v-if="visible" @close="close" @getAllMeterSys="getAllMeterSys" :singleData="singleData" :isEdit="isEdit"/>
  </div>
</template>

<script>
    import moment from 'moment'
    import {axiospost, axiosget} from '../../utils/http'
    import Search from '../../components/Search/Search'
    import {TestInsrigisterColumns} from '../../const/constant'
    import RigisterOrEdit from './TestInsrigisterOrEdit'
export default {
    name: "TestInstrument",
    components: {
        Search,
        RigisterOrEdit
    },
    data(){
        return{
            visible: false,
            columns: TestInsrigisterColumns,
            tableData: [],
            loading: true,
            pagination: {},
            singleData:{},
            currentPage:'TestInstrumentMGT',
            isEdit: false,
        }
    },
    mounted () {
        this.getAllMeterSys()
    },
    methods: {
        handleClick(){
            this.visible = true;
            this.isEdit = false
        },
        getAllMeterSys(){
            axiosget('/getMeterSys').then(res => {
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
            let selectDate = moment(date._d).format('YYYY-MM-DD');
            axiosget('/getMeterSys',{createTime: selectDate}).then( res => {
                if(res.code === 200) this.formatData(res);
                else this.$message.error('Network exception, please try again');
            })
        },
        // Format response table data
        formatData(data){
            this.pagination = {
                current: 1,
                total: data.total
            };
            this.tableData = data.body.map( item => {
                item.createTime = moment(item.createTime).format('YYYY-MM-DD');
                item.action = ['EDIT', 'DELETE'];
                return item
            })
        },
        testInsSearch(data){
            this.formatData(data)
        },
        close(){
            this.visible = false;
        },
        showEditOrDeleteModal(item,data){
            if(item === 'EDIT') {
                this.visible = true;
                this.isEdit = true;
                this.singleData = Object.assign({},data);
            }else {
                this.$confirm({
                    title: 'Are you sure delete this TTMS?',
                    content: 'Name: '+data.meterSysName,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        axiospost('/deleteMeterSys',{meterSysName:data.meterSysName}).then( res => {
                            if(res.code === 200){
                                this.$message.success('Deleted successfully')
                            }else this.$message.error('Network exception, please try again');
                        })
                    }
                });
            }
        }
    }
};
</script>

<style lang="less" scoped>
  .test-ins__container{
    .top{
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
    .tag{
      padding:0  8px;
      border-radius: 12px;
    }
  }

</style>