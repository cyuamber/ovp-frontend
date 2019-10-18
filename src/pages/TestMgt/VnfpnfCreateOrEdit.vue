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
                           :fileList="fileList"
                           :remove="handleRemove"
                           :beforeUpload="beforeUpload"
                           :disabled="fileList.length === 1"
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
                types:["VNF","PNF"],
                fileList: [],
            }
        },
        methods: {
            handleRemove(file) {
                const index = this.fileList.indexOf(file);
                const newFileList = this.fileList.slice();
                newFileList.splice(index, 1);
                this.fileList = newFileList;
            },
            beforeUpload(file) {
                this.fileList = [...this.fileList, file];
                console.log(this.fileList,"fileList");
                return false;
            },
            handleUpload(formData) {
                http.axiospost('/uploadVNFFile',{VNFFileName:formData}).then(res => {
                    if(res.code === 200){
                        this.fileList = [];
                        this.$message.success('upload successfully.');
                    }else {
                        this.$message.error('upload failed.');
                    }
                });
            },
            handleCancel(){
                Object.keys(this.singleData).map(key => this.singleData[key] = '');
                this.$emit('close');
            },
            handleSubmit(){
                let url = this.isEdit ? '/updateTestMeter':'/createTestMeter';
                const { fileList } = this;
                const formData = new FormData();
                fileList.forEach(file => {
                    formData.append('files[]', file);
                });
                this.form.validateFields((err, values) => {
                    if(!err){
                        let data = {
                            tesyMeterName: values.meterName,
                            tesyMeterType: values.meterType,
                            tesyMeterVendor: values.meterVendor,
                            tesyMeterVersion: values.meterVersion,
                            VNFFileName:formData,
                            createTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        this.handleUpload(formData);
                        http.axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.$message.success('Has been added successfully');
                                        this.$emit('getAllTestMeter')
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

<style scoped>


</style>
