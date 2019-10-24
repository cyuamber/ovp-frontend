<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item label="XNF Name"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input v-decorator="['XNFName',{ rules: [{ required: true,}],initialValue:SuiteSingleData.tesyMeterName }]"/>
                </a-form-item>
                <a-form-item label="XNF Type" :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
                    <a-select :disabled="VNFOptions.length === 0" class="select"  v-decorator="['XNFType',{ rules: [{ required: true, }],initialValue:this.isEdit ? SuiteSingleData.tesyMeterType:VNFOptions[0]}]"
                    >
                        <a-select-option v-for="type of VNFOptions" :key="type" :value="type">
                           {{type}}
                        </a-select-option>
                    </a-select>
                    <a-spin  :spinning="VNFOptions.length === 0" class='skip-size'>
                        <a-icon slot="indicator"  type="loading-3-quarters" size="small" spin />
                    </a-spin>
                </a-form-item>
                <a-form-item label="XNF Vendor"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['XNFVendor',{ rules: [{ required: true,}],initialValue:SuiteSingleData.tesyMeterVendor }]"/>
                </a-form-item>
                <a-form-item label="Version"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['Version',{ rules: [{ required: true,}],initialValue:SuiteSingleData.tesyMeterVersion }]"/>
                </a-form-item>
                <a-form-item label="Upload CSAR File"  :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
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
    import {mapState} from 'vuex'
    import {axiospost} from '../../utils/http'
    export default {
        props: ['isEdit'],
        data(){
            return {
                form: this.$form.createForm(this),
                showModal: true,
                title: this.isEdit ? 'Edit XNF Type':'Create XNF Type',
                fileList: [],
            }
        },
        computed: {
            ...mapState({
                VNFOptions: state => state.VnfpnfSuite.VNFOptions,
                SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData
            })
        },
        watch: {
            showModal(val){
                if(!val) this.$store.dispatch('VnfpnfSuite/clearOptions')
            }
        },
        destroyed () {
            this.$store.dispatch('VnfpnfSuite/clearOptions');
            this.$store.dispatch('VnfpnfSuite/getTestMeter', {})
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
                axiospost('/uploadVNFFile',{VNFFileName:formData}).then(res => {
                    if(res.code === 200){
                        this.fileList = [];
                        this.$message.success('upload successfully.');
                    }else {
                        this.$message.error('upload failed.');
                    }
                });
            },
            handleCancel(){
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
                            tesyMeterName: values.XNFName,
                            tesyMeterType: values.XNFType,
                            tesyMeterVendor: values.XNFVendor,
                            tesyMeterVersion: values.Version,
                            VNFFileName:formData,
                            createTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        this.handleUpload(formData);
                        axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.$message.success(this.isEdit ? 'Successfully updated' : 'Has been added successfully');
                                        this.$emit('getAllTestMeter')
                                    }else this.$message.error(this.isEdit ? 'updated failed' : 'Has been added failed');
                                    this.$emit('close');
                                },
                                () => {
                                    this.$message.error('Network exception, please try again');
                                    this.$emit('close');
                                });}
                });

            },
        }
    }
</script>

<style scoped>
    .upload-test{
        font-size: 12px !important;
    }
    .select{
        width: 70%;
        margin-right: 5%;
    }

</style>
