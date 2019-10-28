<template>
  <div class="test-spec">
    <div class="test-spec__top">
      <Loading :loadingMessage="loadingMessage" />
      <a-button type="primary" @click="handleCreateClick">Add Spec</a-button>
      <Search class="search test-spec__search" @testSpecSearch="testSpecSearch" :currentPage="currentPage"/>
      <a-date-picker class="calendar test-spec__calendar" @change="onChange" placeholder="Select date" />
    </div>
    <div class="test-spec__table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="testSpecId" size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="test-spec__tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
      </a-table>
    </div>
    <TestSpecMGTAddOrEdit v-if="visible" @close="close" @getAllTestSpec="getAllTestSpec" :isEdit="isEdit"/>
  </div>
</template>
<script>
    import {axiospost} from '../../utils/http'
    import Search from '../../components/Search/Search'
    import {TestSpecColumns} from '../../const/constant'
    import {mapState} from 'vuex'
    import Loading from "../../components/Loading/Loading";
    import TestSpecMGTAddOrEdit from './TestSpecMGTAddOrEdit'
export default {
  name: "TestSpecMGT",
    components: {
        Search,
        TestSpecMGTAddOrEdit,
        Loading
    },
    data(){
        return{
            visible: false,
            columns: TestSpecColumns,
            loading: true,
            currentPage:'TestSpecMGT',
            isEdit: false,
            createTime: '',
            keyword: '',
            loadingMessage: {
                type: "",
                toast: "",
                show:true
            }
        }
    },
    computed: {
        ...mapState ({
            tableData: state => state.testSpecMGT.tableData,
            pagination: state => state.testSpecMGT.pagination,
            testSpecSingleData: state => state.testSpecMGT.testSpecSingleData,
        }),
    },
    mounted () {
        this.loading = true;
        this.$store.dispatch('testSpecMGT/getTableData',{}).then(() =>
            this.loading = false,
            this.loadingMessage.show = false
        )
    },
    methods: {
        handleLoadingMessage(type,toast,show){
            this.loadingMessage = {
                type: type,
                toast: toast,
                show:show
            };
        },
        handleCreateClick(){
            this.visible = true;
            this.isEdit = false;
            this.$store.dispatch('testSpecMGT/getTestSpec','');
            this.$store.dispatch('testSpecMGT/getVNFOptions')
        },
        close(){
            this.visible = false;
        },
        // Filter by creating time
        onChange(date,d) {
            this.createTime = d;
            this.testSpecSearch()
        },
        testSpecSearch(keyword, isSearch){
            this.loading = true;
            if(isSearch) this.keyword = keyword;
            if(keyword === '' && this.createTime === '') {
                this.$message.warning('Please enter valid search information');
                return
            }
            let obj = {keyword: this.keyword, createTime: this.createTime};
            // Simulation request
            this.$store.dispatch('testSpecMGT/getTableData',obj).then(() => setTimeout(() => {
                this.loading = false
            },2000))
        },
        showEditOrDeleteModal(item,testSpecSingleData){
            if(item === 'Edit') {
                this.visible = true;
                this.isEdit = true;
                this.$store.dispatch('testSpecMGT/getTestSpec',testSpecSingleData)
            }else {
                this.$confirm({
                    title: 'Are you sure delete this Spec?',
                    content: 'Id: '+testSpecSingleData.testSpecId,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        axiospost('/deleteTestSpec',{testSpecId:testSpecSingleData.testSpecId}).then( res => {
                            if(res.code === 200){
                                this.handleLoadingMessage("success","Deleted successfully",false);
                            }else  this.handleLoadingMessage("error","Network exception, please try again",false);
                        })
                    }
                });
            }
        },
        getAllTestSpec(){
            this.$store.dispatch('testSpecMGT/getTableData',{}).then(() => this.loading = false);
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