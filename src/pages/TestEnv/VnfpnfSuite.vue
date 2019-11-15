<template>
    <div class="test-ins__container">
        <Loading :loadingMessage="loadingMessage" />
        <a-tabs @change="handleTabsChanges">
            <a-tab-pane v-for="tab in tabss" :key="tab.val" :tab="tab.key">
                <div class="top">
                    <a-button type="primary" @click="handleClick">Create {{tab.key}} TT</a-button>
                    <Search class="search" @VNFSuiteSearch="VNFSuiteSearch" :currentPage="currentPage"/>
                    <a-date-picker class="calendar" @change="onChange" placeholder="Select date"/>
                </div>
                <div class="table">
                    <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="id"
                             size="default" :pagination="pagination" @change="handleTableChange">
              <span slot="action" slot-scope="action,record">
                <a-tag v-for="(item,index) in action" :key="index" :color="item === 'Edit'? 'blue' : 'red'" class="tag"
                       @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
              </span>
                    </a-table>
                </div>
            </a-tab-pane>
        </a-tabs>
        <xNFCreateOrEdit v-if="visible" @close="close" @getAllTestMeter="getAllTestMeter" :isEdit="isEdit" :visible="visible"/>
    </div>
</template>

<script>
    import Search from '../../components/Search/Search'
    import {PackageMGTTabs,VnfpnfSuiteColumns} from '../../const/constant'
    import { mapState, mapActions, mapMutations } from "vuex";
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
                tabss:PackageMGTTabs,
                visible: false,
                columns: VnfpnfSuiteColumns,
                loading: true,
                currentPage:'VNF/PNFSuiteMGT',
                isEdit: false,
                createTime: '',
                keyword: ''
            }
        },
        computed: {
            ...mapState ({
                tableData: state => state.VnfpnfSuite.tableData,
                pagination: state => state.VnfpnfSuite.pagination,
                SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
                loadingMessage: state => state.VnfpnfSuite.loadingMessage,
                currentTab: state => state.VnfpnfSuite.currentTab,
            }),
        },
        watch: {
            currentTab(val) {
                if (val) {
                    this.getVNFOptions()
                }
            }
        },
        mounted() {
            this.initVnfPnfSuiteTable()
        },
        methods: {
            ...mapActions("VnfpnfSuite", [
                "getTableData",
                "getTestMeter",
                "getVNFOptions",
                "getPagination",
                "clearPagination",
                "deleteTestMeter"
            ]),
            ...mapMutations("VnfpnfSuite", [
                "changeTab"
            ]),
            initVnfPnfSuiteTable() {
                this.loading = true;
                this.getVNFOptions();
                this.getTableData({}).then(() =>this.loading = false)
            },
            handleClick(){
                this.visible = true;
                this.isEdit = false;
                this.getTestMeter("");
            },
            handleTabsChanges(key){
                console.log(key,"key")
                this.changeTab(key);
                this.loading = true;
                this.getTableData({}).then(() =>this.loading = false)
            },
            handleTableChange(pagination){
                this.loading = true;
                this.getPagination({pagination});
                let current = pagination.current,
                    pageSize = pagination.pageSize,
                    obj = {name: this.keyword, createTime: this.createTime,pageNum:current,pageSize:pageSize};
                this.getTableData(obj).then(() =>this.loading = false)
            },
            // Filter by creating time
            onChange(date,d) {
                this.createTime = d;
                this.VNFSuiteSearch()
            },
            VNFSuiteSearch(keyword, isSearch){
                this.loading = true;
                let obj = {flag:this.currentTab};
                if(isSearch) this.keyword = keyword;
                if(!(keyword === '' && this.createTime === '')) {
                    obj = {name: this.keyword, createTime: this.createTime};
                }
                this.clearPagination();
                // Simulation request
                this.getTableData(obj).then(() =>this.loading = false)
            },
            close(){
                this.visible = false;
            },
            showEditOrDeleteModal(item,SuiteSingleData){
                if(item === 'Edit') {
                    this.visible = true;
                    this.isEdit = true;
                    this.getTestMeter(SuiteSingleData)
                }else {
                    this.$confirm({
                        title: 'Are you sure delete this xNF TT?',
                        content: 'Name: '+SuiteSingleData.name,
                        okText: 'Yes',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk: () => {
                            this.deleteTestMeter({name: SuiteSingleData.name})
                        }
                    });
                }
            },
            getAllTestMeter(){
                this.getTableData({}).then(() =>this.loading = false)
            }
        },destroyed(){
            this.changeTab(101)
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
