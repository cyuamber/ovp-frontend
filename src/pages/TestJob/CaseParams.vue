<template>
    <a-modal v-bind:title="title" v-model="caseParamsIsShow" @ok="handleSubmit" @cancel="handleCancel">
        <template>
            <a-form :form="form" >
                <a-form-item
                        v-for="item in caseParams"
                        :key="item.name"
                        :label="item.name"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 14 }">
                    <a-input
                            v-if="item.visible===true &&item.type==='string'"
                            v-decorator="[item.name,{ rules: [{ required: item.isOptional,message: item.name+'is required'}],initialValue:item.defaultValue!==null?item.defaultValue:item.value }]"
                    />
                    <a-switch
                            v-if="item.visible===true &&item.type==='bool'"
                            v-decorator="[item.name,{ rules: [{ required: item.isOptional,message: item.name+'is required'}],initialValue:item.defaultValue!==null?item.defaultValue:item.value }]"/>
                </a-form-item>
            </a-form>
        </template>
    </a-modal>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from "vuex";
    export default {
        name: "CaseParams",
        props: ["isEdit"],
        data() {
            return {
                form: this.$form.createForm(this),
                title: this.isEdit ? "Edit Case Parameters" : "Add Case Parameters",
                caseParams:[],
                count: 0
            };
        },
        computed: {
            ...mapState({
                caseParamsData: state => state.testJob.caseParamsData,
                testCaseList: store => store.testJob.testCaseList,
            }),
            caseParamsIsShow: {
                get() {
                    return this.$store.state.testJob.caseParamsIsShow;
                },
                set(val) {
                    if (!val) {
                        this.caseParams.forEach(item=>{
                            this.form.setFieldsValue({
                                [item.name]: item.defaultValue!==null?item.defaultValue:item.value
                            });
                        })
                    }
                }
            }
        },
        watch: {
            caseParamsIsShow(val) {
                if (val) {
                    this.count++;
                    if(this.count>1){
                        this.caseParams = this.caseParamsData.parameters.filter(item =>{
                            return item.visible !== false
                        });
                        this.caseParams.forEach(item=>{
                            this.form.setFieldsValue({
                                [item.name]: item.defaultValue!==null?item.defaultValue:item.value
                            });
                        })
                    }
                }
            },
            caseParamsData(val) {
                this.caseParams = val.parameters.filter(item =>{
                    return item.visible !== false
                });
            },
        },
        methods: {
            ...mapMutations("testJob", [
                "setCaseParamsIsShow",
                "updateTestCaseList"
            ]),
            handleCancel(){
                this.setCaseParamsIsShow(false);
            },
            handleSubmit(){
                this.form.validateFields((error, values) => {
                    if (!error) {
                        let caseParameters = this.caseParamsData;
                        let testCaseLists = this.testCaseList;
                        caseParameters.parameters.forEach(item=>{
                            if(values[item.name]!==undefined){
                                item.value = values[item.name]
                            }
                        });
                        testCaseLists.map((item,index)=>{
                            if(item.id === caseParameters.id){
                                testCaseLists.splice(index,1,caseParameters)
                            }
                        });
                        this.updateTestCaseList({ spin: false, list: testCaseLists });
                        this.setCaseParamsIsShow(false);
                        console.log(values,caseParameters,"caseParams------");
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>