<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <Loading :loadingMessage="loadingMessage" />
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
                <a-form-item label="Upload CSAR File"  :label-col="{ span: 7 }" :wrapper-col="{ span: 7 }">
                   <a-upload-dragger
                           :remove="handleRemove"
                           :beforeUpload="beforeUpload"
                           name="files"
                           v-decorator="['upload',{valuePropName: 'fileList',getValueFromEvent: normFile,rules: [{ required: true,}]}]"
                   >
                       <p class="ant-upload-text upload-test">Click or drag to upload</p>
                   </a-upload-dragger>
                    <a-button
                            type="primary"
                            @click="handleUpload"
                            :disabled="disabled"
                            :loading="uploading"
                            style="margin-top: 16px"
                    >
                        {{uploading ? 'Uploading' : 'Start Upload' }}
                    </a-button>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
                    <a-button type="primary" html-type="submit">Submit</a-button>
                </a-form-item>
            </a-form>
        </template>
    </a-modal>
</template>

<script type="text/ecmascript-6">
    import moment from 'moment';
    import {mapState} from 'vuex'
    import Loading from "../../components/Loading/Loading";
    import {axiospost} from '../../utils/http'
    export default {
        props: ['isEdit'],
        components: {
            Loading
        },
        data(){
            return {
                form: this.$form.createForm(this),
                showModal: true,
                title: this.isEdit ? 'Edit XNF Type':'Create XNF Type',
                disabled: true,
                uploading: false,
                loadingMessage : {
                    type: '',
                    toast: '',
                    show: true
                }
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
            handleLoadingMessage(type,toast,show){
                this.loadingMessage = {
                    type: type,
                    toast: toast,
                    show:show
                };
            },
            normFile(e) {
                if (Array.isArray(e)) {
                    return e;
                }
                if(e.fileList.length >1){
                    e.fileList.splice(e.fileList.length-1, 1)
                }
                return e && e.fileList;
            },
            handleRemove() {
                this.disabled = true;
            },
            beforeUpload() {
                this.disabled = false;
                return false;
            },
            handleUpload() {
                let fileList = this.form.getFieldValue("upload");
                const formData = new FormData();
                formData.append('files[]', fileList[0]);
                this.uploading = true;
                axiospost('/uploadVNFFile',{VNFFileName:formData}).then(res => {
                    this.uploading = false;
                    if(res.code === 200){
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
                this.form.validateFields((err, values) => {
                    if(!err){
                        const formData = new FormData();
                        formData.append('files[]', values.upload[0]);
                        let data = {
                            tesyMeterName: values.XNFName,
                            tesyMeterType: values.XNFType,
                            tesyMeterVendor: values.XNFVendor,
                            tesyMeterVersion: values.Version,
                            VNFFileName:formData,
                            createTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        this.handleLoadingMessage("","",true);
                        axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.handleLoadingMessage("success",this.isEdit ? 'Successfully updated' : 'successfully added ',false);
                                        this.$emit('getAllTestMeter')
                                    }else this.handleLoadingMessage("error",this.isEdit ? 'updated failed' : 'added failed',false);
                                    setTimeout(() => {
                                        this.$emit('close');
                                    },1000)
                                },
                                () => {
                                    this.handleLoadingMessage("error","Network exception, please try again",false);
                                    setTimeout(() => {
                                        this.$emit('close');
                                    },1000)
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
