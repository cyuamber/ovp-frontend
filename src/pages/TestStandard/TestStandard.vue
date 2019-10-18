<template>
  <div class="test-ins__container">
    <div class="top">
      <a-button type="primary" @click="handleClick">Add Standard</a-button>
      <Search class="search" @testStandardSearch="testStandardSearch" :currentPage="currentPage"/>
      <a-date-picker class="calendar" @change="onChange" placeholder="Select date" :allowClear="false" format="DD-MM-YYYY"/>
    </div>
    <div class="table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="testSpecId" size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'EDIT'? 'blue' : 'red'" class="tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
      </a-table>
    </div>
    <StandardAddOrEdit v-if="visible" @close="close" @getAllTestSpec="getAllTestSpec" :singleData="singleData" :isEdit="isEdit"/>
  </div>
</template>
<script>
    import moment from 'moment'
    import http from '../../utils/http'
    import Search from '../../components/Search/Search'
    import StandardAddOrEdit from './TestStandardAddOrEdit'
export default {
  name: "TestStandard",
    data(){
        return{
            visible: false,
            columns: [
                {
                    title: 'ID',
                    dataIndex: 'testSpecId'
                },
                {
                    title: 'Name',
                    dataIndex: 'testSpecName'
                },
                {
                    title: 'Version',
                    dataIndex: 'testSpecVersion'
                },
                {
                    title: 'VNF Type',
                    dataIndex: 'VNFtype'
                },
                {
                    title: 'Publish Time',
                    dataIndex: 'publishTime'
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
        getAllTestSpec(){
            http.axiosget('/getTestSpec').then(res => {
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
            http.axiosget('/getTestSpec',{createTime: selectDate}).then( res => {
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
        testStandardSearch(data){
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
                    title: 'Are you sure delete this standard?',
                    content: 'Id: '+data.testSpecId,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        http.axiospost('/deleteTestSpec',{testSpecId:data.testSpecId}).then( res => {
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
        this.getAllTestSpec()
    },
    components: {
        Search,
        StandardAddOrEdit
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
      }
    }
    .tag{
      padding:0  8px;
      border-radius: 12px;
    }
  }

</style>