<template>
    <div class="test-ins__container">
        <div class="top">
            <a-button type="primary" @click="handleClick">Create xNF TT</a-button>
            <Search class="search" @VNFSuiteSearch="VNFSuiteSearch" :currentPage="currentPage"/>
            <a-date-picker class="calendar" @change="onChange" placeholder="Select date"/>
        </div>
        <div class="table">
            <a-table :columns="columns" :dataSource="tableData" bordered :loading="loading" rowKey="tesyMeterName"
                     size="default" :pagination="pagination">
      <span slot="action" slot-scope="action,record">
        <a-tag v-for="item in action" :key="item" :color="item === 'Edit'? 'blue' : 'red'" class="tag"
               @click="(() => showEditOrDeleteModal(item,record))">{{item}}</a-tag>
      </span>
            </a-table>
        </div>
        <xNFCreateOrEdit v-if="visible" @close="close" @getAllTestMeter="getAllTestMeter" :isEdit="isEdit"/>
    </div>
</template>

<script>
    import {axiospost} from '../../utils/http'
    import Search from '../../components/Search/Search'
    import {VnfpnfSuiteColumns} from '../../const/constant'
    import {mapState} from 'vuex'
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
            }),
        },
        mounted() {
            this.loading = true;
            this.$store.dispatch('VnfpnfSuite/getTableData',{}).then(() => this.loading = false)
        },
        methods: {
            handleClick(){
                this.visible = true;
                this.isEdit = false;
                this.$store.dispatch('VnfpnfSuite/getTestMeter','');
                this.$store.dispatch('VnfpnfSuite/getVNFOptions')
            },
            // Filter by creating time
            onChange(date,d) {
                this.createTime = d;
                this.serchTestSUT()
            },
            VNFSuiteSearch(keyword, isSearch){
                this.loading = true;
                if(isSearch) this.keyword = keyword;
                if(keyword === '' && this.createTime === '') {
                    this.$message.warning('Please enter valid search information');
                    return
                }
                let obj = {keyword: this.keyword, createTime: this.createTime};
                // Simulation request
                this.$store.dispatch('VnfpnfSuite/getTableData',obj).then(() => setTimeout(() => {
                    this.loading = false
                },2000))
            },
            close(){
                this.visible = false;
            },
            showEditOrDeleteModal(item,SuiteSingleData){
                if(item === 'Edit') {
                    this.visible = true;
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
                                    this.$message.success('Deleted successfully')
                                }else this.$message.error('Network exception, please try again');
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
