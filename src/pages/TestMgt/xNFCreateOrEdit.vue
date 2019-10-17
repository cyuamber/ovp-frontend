<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item label="XNF Name"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input v-decorator="['meterName',{ rules: [{ required: true,}],initialValue:singleData.tesyMeterName }]"/>
                </a-form-item>
                <a-form-item label="XNF Type"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-select v-decorator="['meterType',{ rules: [{ required: true, }],initialValue:this.isEdit ? singleData.tesyMeterType:types[0]}]"
                    >
                        <a-select-option v-for="type of types" :key="type" :value="type">
                           {{type}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="XNF Vendor"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['meterVendor',{ rules: [{ required: true,}],initialValue:singleData.tesyMeterVendor }]"/>
                </a-form-item>
                <a-form-item label="Version"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['meterVersion',{ rules: [{ required: true,}],initialValue:singleData.tesyMeterVersion }]"/>
                </a-form-item>
                <a-form-item label="Upload"  :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
                   <a-upload-dragger
                        name="file"
                        @change="handleChange"
                   >
                       <p class="ant-upload-text upload-test">Click or drag to upload</p>
                   </a-upload-dragger>
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
                title: this.isEdit ? 'Edit XNF Type':'Create XNF Type',
                types:["VNF","PNF"]
            }
        },
        methods: {
            handleChange(){

            },
            handleCancel(){
                Object.keys(this.singleData).map(key => this.singleData[key] = '');
                this.$emit('close');
            },
            handleSubmit(e){
                let url = this.isEdit ? '/updateTestMeter':'/createTestMeter';
                this.form.validateFields((err, values) => {
                    if(!err){
                        let data = {
                            tesyMeterName: values.meterName,
                            tesyMeterType: values.meterType,
                            tesyMeterVendor: values.meterVendor,
                            tesyMeterVersion: values.meterVersion,
                            VNFFileName:'',
                            createTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        console.log(data,"data");
                        http.axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.$message.success('Has been added successfully');
                                        this.$emit('getAllTestMeter')
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
