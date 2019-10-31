<template>
    <div class="test-ins__container">
        <Loading :loadingMessage="loadingMessage" />
        <a-tabs @change="handleTabsChange">
            <a-tab-pane v-for="tab in tabs" :key="tab" :tab="tab">
                <div class="top">
                    <a-button type="primary" @click="handleClick">Create {{tab}} TT</a-button>
                    <Search class="search" @VNFSuiteSearch="VNFSuiteSearch" :currentPage="currentPage"/>
                    <a-date-picker class="calendar" @change="onChange" placeholder="Select date"/>
                </div>
                <div class="table">
                    <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="tesyMeterName"
                             size="default" :pagination="pagination" @change="handleTableChange">
              <span slot="action" slot-scope="action,record">
                <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="tag"
                       @click="(() => showEditOrDeleteModal(item,tab,record))">{{item}}</a-tag>
              </span>
                    </a-table>
                </div>
            </a-tab-pane>
        </a-tabs>
        <xNFCreateOrEdit v-if="visible" :currentTab="currentTab" @close="close" @getAllTestMeter="getAllTestMeter" :isEdit="isEdit"/>
    </div>
</template>

<script>
    import {axiospost} from '../../utils/http'
    import Search from '../../components/Search/Search'
    import {VnfpnfSuiteColumns} from '../../const/constant'
    import {mapState} from 'vuex'
    import Loading from "../../components/Loading/Loading";
    import xNFCreateOrEdit from './VnfpnfCreateOrEdit'

    export default {
        name: "VnfpnfSuite",
        components: {
            Search,
            xNFCreateOrEdit,
            Loading
        },
        data() {
            return {
                tabs: ['VNF', 'PNF'],
                currentTab: 'VNF',
                visible: false,
                columns: VnfpnfSuiteColumns,
                loading: true,
                currentPage:'VNF/PNFSuiteMGT',
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
                tableData: state => state.VnfpnfSuite.tableData,
                pagination: state => state.VnfpnfSuite.pagination,
                SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
            }),
        },
        mounted() {
            this.loading = true;
            this.$store.dispatch('VnfpnfSuite/getTableData',{}).then(() => setTimeout(() => {
                this.loading = false
            },2000))
        },
        methods: {
            handleClick(){
                this.visible = true;
                this.isEdit = false;
                this.$store.dispatch('VnfpnfSuite/getTestMeter','');
                this.$store.dispatch('VnfpnfSuite/getVNFOptions')
            },
            handleTabsChange(key){
                this.currentTab = key;
                this.loading = true;
                this.$store.dispatch('VnfpnfSuite/getTableData',{}).then(() => setTimeout(() => {
                    this.loading = false
                },2000))
            },
            handleLoadingMessage(type,toast,show){
                this.loadingMessage = {
                    type: type,
                    toast: toast,
                    show:show
                };
            },
            handleTableChange(pagination){
                this.loading = true;
                this.$store.dispatch('VnfpnfSuite/getPagination',{pagination});
                let current = pagination.current,
                    pageSize = pagination.pageSize,
                    obj = {VNFTestName: this.keyword, createTime: this.createTime,pageNum:current,pageSize:pageSize};
                this.$store.dispatch('VnfpnfSuite/getTableData',obj).then(() => this.loading = false)
            },
            // Filter by creating time
            onChange(date,d) {
                this.createTime = d;
                this.VNFSuiteSearch()
            },
            VNFSuiteSearch(keyword, isSearch){
                this.loading = true;
                let obj = {};
                if(isSearch) this.keyword = keyword;
                if(!(keyword === '' && this.createTime === '')) {
                    obj = {VNFTestName: this.keyword, createTime: this.createTime};
                }
                this.$store.dispatch('VnfpnfSuite/clearPagination');
                // Simulation request
                this.$store.dispatch('VnfpnfSuite/getTableData',obj).then(() =>
                    this.loading = false
                )
            },
            close(){
                this.visible = false;
            },
            showEditOrDeleteModal(item,tab,SuiteSingleData){
                if(item === 'Edit') {
                    this.visible = true;
                    this.currentTab = tab;
                    this.isEdit = true;
                    this.$store.dispatch('VnfpnfSuite/getTestMeter',SuiteSingleData)
                }else {
                    this.$confirm({
                        title: 'Are you sure delete this xNF TT?',
                        content: 'Name: '+SuiteSingleData.tesyMeterName,
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk: () => {
                            axiospost('/deleteTestMeter', {tesyMeterName: SuiteSingleData.tesyMeterName}).then(res => {
                                if (res.code === 200) {
                                    this.handleLoadingMessage("success","Deleted successfully",false);
                                }else  this.handleLoadingMessage("error","Network exception, please try again",false);
                            })
                        }
                    });
                }
            },
            getAllTestMeter(){
                this.$store.dispatch('VnfpnfSuite/getTableData',{}).then(() => this.loading = false);

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
