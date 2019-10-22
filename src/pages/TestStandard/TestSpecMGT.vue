<template>
  <div class="test-spec">
    <div class="test-spec__top">
      <a-button type="primary" @click="handleClick">Add Spec</a-button>
      <Search class="search test-spec__search" @testSpecSearch="testSpecSearch" :currentPage="currentPage"/>
      <a-date-picker class="calendar test-spec__calendar" @change="onChange" placeholder="Select date" :allowClear="false" format="DD-MM-YYYY"/>
    </div>
    <div class="test-spec__table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="testSpecId" size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'EDIT'? 'blue' : 'red'" class="test-spec__tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
      </a-table>
    </div>
    <TestSpecMGTAddOrEdit v-if="visible" @close="close" @getAllTestSpec="getAllTestSpec" :singleData="singleData" :spinning="spinning" :VNFtypes="VNFtypes" :isEdit="isEdit"/>
  </div>
</template>
<script>
    import moment from 'moment'
    import {axiospost, axiosget} from '../../utils/http'
    import Search from '../../components/Search/Search'
    import {TestSpecColumns} from '../../const/constant'
    import TestSpecMGTAddOrEdit from './TestSpecMGTAddOrEdit'
export default {
  name: "TestSpecMGT",
    components: {
        Search,
        TestSpecMGTAddOrEdit
    },
    data(){
        return{
            visible: false,
            columns: TestSpecColumns,
            tableData: [],
            loading: true,
            pagination: {},
            singleData:{},
            currentPage:'TestSpecMGT',
            isEdit: false,
            VNFtypes: [],
            spinning: true
        }
    },
    mounted () {
        this.getAllTestSpec()
    },
    methods: {
        handleClick(){
            this.visible = true;
            this.isEdit = false;
            this.getVNFTypes()
        },
        getVNFTypes(){
            axiosget('/getTestSpecVNFType').then(res => {
                this.spinning = false;
                if(res.code === 200){
                    this.VNFtypes = res.body;
                }else {
                    this.$message.error('Network exception, please try again');
                }
            })
        },
        getAllTestSpec(){
            axiosget('/getTestSpec').then(res => {
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
            axiosget('/getTestSpec',{createTime: selectDate}).then( res => {
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
        testSpecSearch(data){
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
                    title: 'Are you sure delete this Spec?',
                    content: 'Id: '+data.testSpecId,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        axiospost('/deleteTestSpec',{testSpecId:data.testSpecId}).then( res => {
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
  .test-spec{
    .test-spec__top{
      margin-bottom: 30px;
      .test-spec__search{
        display: inline-block;
        margin-left: 40px;
      }
      .test-spec__calendar{
        float: right;
        width: 280px;
      }
    }
    .test-spec__tag{
      padding:0  8px;
      border-radius: 12px;
    }
  }

</style>