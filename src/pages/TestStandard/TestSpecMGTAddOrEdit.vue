<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item label="ID"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input v-decorator="['testId',{ rules: [{ required: true,}],initialValue:singleData.testSpecId }]"/>
                </a-form-item>
                <a-form-item label="Name"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['testName',{ rules: [{ required: true,}],initialValue:singleData.testSpecName }]"/>
                </a-form-item>
                <a-form-item label="Version"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['testVersion',{ rules: [{ required: true,}],initialValue:singleData.testSpecVersion }]"/>
                </a-form-item>
                <a-form-item label="VNF Type"  :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
                    <a-select class="select" v-decorator="['VNFtype',{ rules: [{ required: true, }],initialValue:this.isEdit ? singleData.VNFtype:VNFtypes[0]}]">
                        <a-select-option v-for="type of VNFtypes" :key="type" :value="type">
                            {{type}}
                        </a-select-option>
                    </a-select>
                    <a-spin  size="small" :spinning="spinning">
                        <a-icon slot="indicator"  type="loading-3-quarters" style="font-size: 24px" spin />
                    </a-spin>
                </a-form-item>
                <a-form-item label="Publish ORG"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['PublishORG',{ rules: [{ required: true,}],initialValue:singleData.PublishORG }]"/>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
                    <a-button type="primary" html-type="submit">OK</a-button>
                </a-form-item>
            </a-form>
        </template>
    </a-modal>
</template>

<script type="text/ecmascript-6">
    import moment from 'moment';
    import {axiospost} from '../../utils/http'
    export default {
        props: ['singleData','VNFtypes','spinning','isEdit'],
        data(){
            return {
                form: this.$form.createForm(this),
                showModal: true,
                title: this.isEdit ? 'Edit Spec':'Add Spec',
            }
        },
        methods: {
            handleCancel(){
                Object.keys(this.singleData).map(key => this.singleData[key] = '');
                this.$emit('close');
            },
            handleSubmit(){
                let url = this.isEdit ? '/updateTestSpec':'/addTestSpec';
                this.form.validateFields((err, values) => {
                    if(!err){
                        let data = {
                            testSpecId: values.testId,
                            testSpecName: values.testName,
                            testSpecVersion: values.testVersion,
                            VNFtype: values.VNFtype,
                            PublishORG: values.PublishORG,
                            publishTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        console.log(data,"data");
                        axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.$message.success('Has been added successfully');
                                        this.$emit('getAllTestSpec')
                                    }else this.$message.error('add failed');
                                    this.$emit('close');
                                },
                                () => {
                                    this.$message.error('Network exception, please try again');
                                    this.$emit('close');
                                });
                        Object.keys(this.singleData).map(key => this.singleData[key] = '');
                    }
                });

            },
        }
    }
</script>

<style lang="less" scoped>
    .select{
        width: 70%;
        margin-right: 5%;
    }

</style>