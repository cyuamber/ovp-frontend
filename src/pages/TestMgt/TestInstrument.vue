<template>
  <div class="test-ins__container">
    <div class="top">
      <a-button type="primary" @click="handleClick">Rigister TTMS</a-button>
      <Search class="search" @searchID="searchID" :currentPage="currentPage"/>
      <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false" format="DD-MM-YYYY"/>
    </div>
    <div class="table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="meterSysName" size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'edit'? 'blue' : 'red'" class="tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
      </a-table>
    </div>
    <RigisterOrEdit v-if="visible" @close="close" @getAllMeterSys="getAllMeterSys" :singleData="singleData" :isEdit="isEdit"/>
  </div>
</template>

<script>
    import moment from 'moment'
    import http from '../../utils/http'
    import Search from '../../components/Search/Search'
    import RigisterOrEdit from './testInsrigisterOrEdit'
export default {
  name: "TestInstrument",
    data(){
        return{
            visible: false,
            columns: [
                {
                    title: 'Name',
                    dataIndex: 'meterSysName'
                },
                {
                    title: 'Vendor',
                    dataIndex: 'meterSysVendor'
                },
                {
                    title: 'Mnt Address',
                    dataIndex: 'meterSysUrl'
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
            singleData:{},
            currentPage:'TestInstrumentMGT',
            isEdit: false,
        }
    },

    methods: {
        handleClick(){
            this.visible = true;
            this.isEdit = false
        },
        getAllMeterSys(){
            http.axiosget('/getMeterSys').then(res => {
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
            http.axiosget('/getMeterSys',{createTime: selectDate}).then( res => {
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
                item.action = ['edit', 'delete'];
                return item
            })
        },
        searchID(data){
            this.formatData(data)
        },
        close(){
            this.visible = false;
        },
        showEditOrDeleteModal(item,data){
            console.log(item,"item")
            if(item === 'edit') {
                this.visible = true;
                this.isEdit = true;
                this.singleData = Object.assign({},data);
            }else {
                this.$confirm({
                    title: 'Are you sure delete this task?',
                    content: 'Some descriptions',
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        http.axiospost('/deleteMeterSys',{meterSysName:data.meterSysName}).then( res => {
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
        this.getAllMeterSys()
    },
    components: {
        Search,
        RigisterOrEdit
    },
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