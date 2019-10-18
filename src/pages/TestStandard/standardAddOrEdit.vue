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
                <a-form-item label="VNF Type"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['testVNFtype',{ rules: [{ required: true,}],initialValue:singleData.VNFtype }]"/>
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
    import http from '../../utils/http';
    export default {
        props: ['singleData','isEdit'],
        data(){
            return {
                form: this.$form.createForm(this),
                showModal: true,
                title: this.isEdit ? 'Edit Standard':'Add Standard'
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
                            VNFtype: values.testVNFtype,
                            publishTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        console.log(data,"data");
                        http.axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.$message.success('Has been added successfully');
                                        this.$emit('getAllTestSpec')
                                    }else this.$message.error('add failed');
                                    this.$emit('close');
                                },
                                error => {
                                    this.$message.error('Network exception, please try again');
                                    this.$emit('close');
                                });
                    }
                });

            },
        }
    }
</script>

<style scoped>


</style>
