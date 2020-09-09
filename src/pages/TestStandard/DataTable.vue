<template>
    <div class="test-ins__container">
        <a-table
                :columns="columns"
                :dataSource="tableData"
                :loading="tableLoading"
                rowKey="id"
                size="default"
                bordered
                :pagination="pagination"
                @change="handleTableChange"
                @expand="caseMgtTableShow"
        >
        <span slot="action" slot-scope="action, record">
          <a-tag
                  v-for="item in action"
                  :key="item"
                  :color="item === 'Edit' ? 'blue' : 'red'"
                  class="test-spec__tag"
                  @click="() => showEditOrDeleteModal(item, record)"
          >{{ item }}</a-tag>
        </span>
            <div v-if="tableData.length>0">
                <a-table
                        class="test-case__table"
                        slot="expandedRowRender"
                        slot-scope="record"
                        :loading="testCasetableLoading"
                        :columns="innerColumns"
                        :dataSource="record.caseMgt"
                        rowKey="id"
                        size="default"
                        :pagination="record.specpagination"
                        @change="(pagination) =>handleSpecTableChange(pagination, record.index)"
                >
          <span slot="status" slot-scope="status">
            <span
                    class="test-case__showState"
                    :style="{ backgroundColor:status === 'enable' ? '#7ED321' : '#d0021b' }"
                    :title="status === 'enable' ? 'enable' : 'disable'"
            ></span>
          </span>
                    <span slot="action" slot-scope="action, record">
            <a-switch
                    checkedChildren="enable"
                    unCheckedChildren="disable"
                    :checked="record.status === 'enable'"
                    @click="() => activationModal(record)"
            />
          </span>
                </a-table>
            </div>
        </a-table>
    </div>
</template>

<script>
    import {TestSpecColumns, TestCaseColumns} from "./constant";
    import {mapState, mapActions, mapMutations} from "vuex";

    export default {
        name: "DataTable",

        data() {
            return {
                columns: TestSpecColumns,
                innerColumns: TestCaseColumns,
                publishTime: "",
                keyword: ""
            };
        },
        computed: {
            ...mapState({
                tableData: state => state.testSpecMGT.tableData,
                pagination: state => state.testSpecMGT.pagination,
                testSpecSingleData: state => state.testSpecMGT.testSpecSingleData,
                tableLoading: state => state.loading.tableLoading,
                testCasetableLoading: state => state.testSpecMGT.testCasetableLoading
            })
        },

        methods: {
            ...mapActions("testSpecMGT", [
                "getTableData",
                "getTestCaseTableData",
                "getTestCaseList",
                "getTestSpec",
                "deleteTestSpec",
                "getPagination",
                "getVNFOptions",
                "activateTestCase",
                "getSpecPagination"
            ]),
            ...mapMutations("testSpecMGT", [
                "updateVisible",
                "updateEdit"
            ]),
            handleTableChange(pagination) {
                this.getPagination({ pagination });
                let current = pagination.current,
                    pageSize = pagination.pageSize,
                    obj = {
                        testSpecName: this.keyword,
                        publishTime: this.publishTime,
                        pageNum: current,
                        pageSize: pageSize
                    };
                this.getTableData(obj);
            },
            caseMgtTableShow(expanded, record) {
                if (expanded) {
                    this.getTestCaseTableData({ record, expanded });
                }
                if (!expanded) {
                    let pagination = { current: 1, total: 0, pageSize: 5 };
                    this.getSpecPagination({ pagination, index: record.index });
                }
            },
            handleSpecTableChange(pagination, index) {
                this.getSpecPagination({ pagination, index });
            },

            showEditOrDeleteModal(item, testSpecSingleData) {
                if (item === "Edit") {
                    this.getTestSpec(testSpecSingleData);
                    this.getTestCaseList({
                        sutCode: testSpecSingleData.sutTypeCH.code,
                        subSutCode: testSpecSingleData.subSutTypeCH.code,
                        testSpecSingleData: testSpecSingleData,
                        message: this.$message
                    });
                    this.updateVisible(true);
                    this.updateEdit(true);
                } else {
                    this.$confirm({
                        title: "Are you sure delete this Spec?",
                        content: "Id: " + testSpecSingleData.id,
                        okText: "Yes",
                        okType: "danger",
                        cancelText: "No",
                        onOk: () => {
                            this.deleteTestSpec({
                                id: testSpecSingleData.id
                            });
                        }
                    });
                }
            },
            activationModal(testCaseSingleData) {
                this.$confirm({
                    title: "Are you sure activate this Case?",
                    content: "Id: " + testCaseSingleData.id,
                    okText: "Yes",
                    okType: "danger",
                    cancelText: "No",
                    onOk: () => {
                        this.activateTestCase({
                            obj: testCaseSingleData
                        });
                    }
                });
            }

        }
    };
</script>

<style lang="less" scoped>
    .test-ins__container {
        .tag {
            padding: 0 8px;
            border-radius: 12px;
        }
        .test-case__table {
            margin: auto;
            .test-case__showState {
                display: block;
                margin: 0 auto;
                width: 15px;
                height: 15px;
                border-radius: 50%;
            }
        }
    }
</style>
