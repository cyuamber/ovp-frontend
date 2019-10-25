<template>
  <div class="test-ins__container">
    <Loading :loadingMessage="loadingMessage" />
    <div class="top">
      <a-button type="primary" @click="handleCreateClick">Rigister TTMS</a-button>
      <Search class="search" @testInsSearch="testInsSearch" :currentPage="currentPage"/>
      <a-date-picker class="calendar" @change="onChange" placeholder="Select date"/>
    </div>
    <div class="table">
      <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="meterSysName" size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
      </a-table>
    </div>
    <RigisterOrEdit v-if="visible" @close="close" :isEdit="isEdit"  @getAllMeterSys="getAllMeterSys"/>
  </div>
</template>

<script>
    import {axiospost} from '../../utils/http'
    import Search from '../../components/Search/Search'
    import {TestInsrigisterColumns} from '../../const/constant'
    import RigisterOrEdit from './TestInsrigisterOrEdit'
    import Loading from "../../components/Loading/Loading";
    import {mapState} from 'vuex'
export default {
    name: "TestInstrument",
    components: {
        Search,
        RigisterOrEdit,
        Loading
    },
    data(){
        return{
            visible: false,
            columns: TestInsrigisterColumns,
            loading: false,
            currentPage:'TestInstrumentMGT',
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
            tableData: state => state.testInstrument.tableData,
            pagination: state => state.testInstrument.pagination,
            singleData: state => state.testInstrument.singleData,
        }),
    },
    mounted () {
        this.loading = true;
        this.handleLoadingMessage("","",true);
        this.$store.dispatch('testInstrument/getTableData',{}).then(() =>
            this.loading = false,
            this.loadingMessage.show = false
        )
    },
    methods: {
        handleCreateClick(){
            this.$store.dispatch('testInstrument/getMeterSys','');
            this.visible = true;
            this.isEdit = false;
        },
        handleLoadingMessage(type,toast,show){
            this.loadingMessage = {
                type: type,
                toast: toast,
                show:show
            };
        },
        // Filter by creating time
        onChange(date,d) {
            this.createTime = d;
            this.testInsSearch()
        },
        testInsSearch(keyword, isSearch){
            this.loading = true;
            this.handleLoadingMessage("","",true);
            if(isSearch) this.keyword = keyword;
            if(keyword === '' && this.createTime === '') {
                this.$message.warning('Please enter valid search information');
                return
            }
            let obj = {keyword: this.keyword, createTime: this.createTime};
            // Simulation request
            this.$store.dispatch('testInstrument/getTableData',obj).then(() =>
                this.loading = false,
                this.loadingMessage.show = false
            )
        },
        close(){
            this.visible = false;
        },
        showEditOrDeleteModal(item,singleData){
            if(item === 'Edit') {
                this.visible = true;
                this.isEdit = true;
                this.$store.dispatch('testInstrument/getMeterSys',singleData)
            }else {
                this.$confirm({
                    title: 'Are you sure delete this TTMS?',
                    content: 'Name: '+singleData.meterSysName,
                    okText: 'Yes',
                    okType: 'danger',
                    cancelText: 'No',
                    onOk: () => {
                        axiospost('/deleteMeterSys',{meterSysName:singleData.meterSysName}).then( res => {
                            if(res.code === 200){
                                this.handleLoadingMessage("success","Deleted successfully",false);
                            }else {
                                this.handleLoadingMessage("error","Network exception, please try again",false);
                            }
                        })
                    }
                });
            }
        },
        getAllMeterSys(){
            this.$store.dispatch('testInstrument/getTableData',{}).then(() => this.loading = false);
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