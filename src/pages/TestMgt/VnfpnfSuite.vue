<template>
    <div class="test-ins__container">
        <div class="top">
            <a-button type="primary" @click="handleClick">Create xNF TT</a-button>
            <Search class="search" @VNFSuiteSearch="VNFSuiteSearch" :currentPage="currentPage"/>
            <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false"
                           format="DD-MM-YYYY"/>
        </div>
        <div class="table">
            <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="tesyMeterName"
                     size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'EDIT'? 'blue' : 'red'" class="tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
            </a-table>
        </div>
        <xNFCreateOrEdit v-if="visible" @close="close" @getAllTestMeter="getAllTestMeter" :singleData="singleData" :spinning="spinning" :VNFtypes="VNFtypes" :isEdit="isEdit"/>
    </div>
</template>

<script>
    import moment from 'moment'
    import {axiospost, axiosget} from '../../utils/http'
    import Search from '../../components/Search/Search'
    import {VnfpnfSuiteColumns} from '../../const/constant'
    import xNFCreateOrEdit from './VnfpnfCreateOrEdit'

    export default {
        name: "VnfpnfSuite",
        components: {
            Search,
            xNFCreateOrEdit
        },
        data() {
            return {
                visible: false,
                columns: VnfpnfSuiteColumns,
                tableData: [],
                loading: true,
                pagination: {},
                singleData:{},
                currentPage:'VNF/PNFSuiteMGT',
                isEdit: false,
                VNFtypes: [],
                spinning: true
            }
        },
        mounted() {
            this.getAllTestMeter()
        },
        methods: {
            handleClick(){
                this.visible = true;
                this.isEdit = false;
                this.getVNFTypes()
            },
            getVNFTypes(){
                axiosget('/getTestMeterVNFType').then(res => {
                    this.spinning = false;
                    if(res.code === 200){
                        this.VNFtypes = res.body;
                    }else {
                        this.$message.error('Network exception, please try again');
                    }
                })
            },
            getAllTestMeter() {
                axiosget('/getTestMeter').then(res => {
                    if (res.code === 200) {
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
                axiosget('/getTestMeter', {createTime: selectDate}).then(res => {
                    if (res.code === 200) this.formatData(res);
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
            VNFSuiteSearch(data){
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
                        title: 'Are you sure delete this xNF TT?',
                        content: 'Name: '+data.tesyMeterName,
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk: () => {
                            axiospost('/deleteTestMeter', {tesyMeterName: data.tesyMeterName}).then(res => {
                                if (res.code === 200) {
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
