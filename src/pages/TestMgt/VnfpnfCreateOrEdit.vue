<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <Loading :loadingMessage="loadingMessage" />
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item :label="currentTab+' Name'"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input v-decorator="['XNFName',{ rules: [{ required: true,message: currentTab +' Name is required' }],initialValue:SuiteSingleData.tesyMeterName }]"/>
                </a-form-item>
                <a-form-item :label="currentTab+'  Type'" :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
                    <a-select :disabled="spin" class="select"  v-decorator="['XNFType',{ rules: [{ required: true, message: currentTab +' Type is required' }],initialValue:this.isEdit ? SuiteSingleData.tesyMeterType:VNFOptions[0]}]" @dropdownVisibleChange="dropdownVisibleChange"
                    >
                        <a-select-option v-for="type of VNFOptions" :key="type" :value="type">
                           {{type}}
                        </a-select-option>
                    </a-select>
                    <a-spin  :spinning="spin" class='skip-size'>
                        <a-icon slot="indicator"  type="loading-3-quarters" size="small" spin />
                    </a-spin>
                </a-form-item>
                <a-form-item :label="currentTab+' Vendor'"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['XNFVendor',{ rules: [{ required: true, message: currentTab +' Vendor is required' }],initialValue:SuiteSingleData.tesyMeterVendor }]"/>
                </a-form-item>
                <a-form-item :label="currentTab+' Version'"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['Version',{ rules: [{ required: true, message: currentTab +' Version is required' }],initialValue:SuiteSingleData.tesyMeterVersion }]"/>
                </a-form-item>
                <a-form-item label="Upload CSAR File"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                   <a-upload-dragger
                           class="upload-float"
                           :remove="handleRemove"
                           :beforeUpload="beforeUpload"
                           name="files"
                           v-decorator="['upload',{valuePropName: 'fileList',getValueFromEvent: normFile,rules: [{ required: true,}]}]"
                   >
                       <p class="ant-upload-text upload-test">Click or drag to upload</p>
                   </a-upload-dragger>
                    <a-spin  :spinning="disabled" class='skip-size skip-float'>
                        <a-icon slot="indicator"  type="loading-3-quarters" size="small" spin />
                    </a-spin>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
                    <a-button type="primary" html-type="submit" :disabled="disabled">Submit</a-button>
                </a-form-item>
            </a-form>
        </template>
    </a-modal>
</template>

<script type="text/ecmascript-6">
    import moment from 'moment';
    import {mapState} from 'vuex'
    import Loading from "../../components/Loading/Loading";
    import {axiospost, axiosCancelToken} from '../../utils/http'
    export default {
        props: ['isEdit', 'currentTab'],
        components: {
            Loading
        },
        data(){
            return {
                form: this.$form.createForm(this),
                showModal: true,
                title: this.isEdit ? 'Edit '+this.currentTab+' TT':'Create '+this.currentTab+'TT',
                spin: false,
                count: 0,
                disabled: false,
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
            visible(val){
                if(val) {
                    this.showModal = val;
                    this.count ++;
                    if(!this.showModal.length && this.isEdit && this.count !== 1){
                        this.form.setFieldsValue({
                            XNFName: this.SuiteSingleData.tesyMeterName,
                            XNFType: this.SuiteSingleData.tesyMeterType,
                            XNFVendor: this.SuiteSingleData.tesyMeterVendor,
                            Version: this.SuiteSingleData.tesyMeterVersion
                        })
                    }
                    if(!this.showModal.length && !this.isEdit) this.spin = true
                }
            },
            showModal(val){
                if(!val) {
                    this.$emit('close');
                    this.$store.dispatch('VnfpnfSuite/clearOptions');
                    this.$store.dispatch('VnfpnfSuite/getTestMeter', {});
                    this.form.setFieldsValue({XNFName: '', XNFType: '', XNFVendor: '', Version: ''})
                }
            },
            VNFOptions(val){
                if(val.length) {
                    this.spin = false
                }
                if(val.length && !this.isEdit){
                    this.form.setFieldsValue({XNFType: val[0]})
                }
            }
        },
        methods: {
            handleLoadingMessage(type,toast,show){
                this.loadingMessage = {
                    type: type,
                    toast: toast,
                    show:show
                };
            },
            dropdownVisibleChange(){
                if(!this.VNFOptions.length) {
                    this.spin = true;
                    this.$store.dispatch('VnfpnfSuite/getVNFOptions').then(() => {this.spin = true})
                }
            },
            normFile(e) {
                if (Array.isArray(e)) {
                    return e;
                }
                if(e.fileList.length >1){
                    e.fileList.splice(0,e.fileList.length-1)
                }
                return e && e.fileList;
            },
            handleRemove() {
                if(this.disabled){
                    axiosCancelToken("/uploadVNFFile").then(res => {
                        if(res.code === 200){
                            this.disabled = false;
                            this.$message.success('cancel upload successfully.');
                        }else {
                            this.$message.error('cancel upload failed.');
                        }
                    });
                }
            },
            beforeUpload() {
                return false;
            },
            handleUpload(url,data) {
                let fileList = this.form.getFieldValue("upload");
                const formData = new FormData();
                formData.append('files', fileList[0]);
                this.disabled = true;
                axiospost('/uploadVNFFile',{VNFFileName:formData}).then(res => {
                    if(res.code === 200){
                        this.$message.success('upload successfully.');
                        this.submitFormData(url,data)
                    }else {
                        this.disabled = false;
                        this.$message.error('upload failed.');
                    }
                });
            },
            handleCancel(){
                if(!this.disabled){
                    this.handleRemove();
                }
                this.$emit('close');
            },
            handleSubmit(){
                let url = this.isEdit ? '/updateTestMeter':'/createTestMeter';
                this.form.validateFields((err, values) => {
                    if(!err){
                        const formData = new FormData();
                        formData.append('files', values.upload[0]);
                        let data = {
                            tesyMeterName: values.XNFName,
                            tesyMeterType: values.XNFType,
                            tesyMeterVendor: values.XNFVendor,
                            tesyMeterVersion: values.Version,
                            VNFFileName:formData,
                            createTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                       this.handleUpload(url,data);
                    }
                });

            },
            submitFormData(url,data){
                axiospost(url, data)
                    .then((res) => {
                            if(res.code === 200){
                                this.$message.success(this.isEdit ? 'Successfully updated' : 'successfully added');
                                this.$emit('getAllTestMeter')
                            }else this.$message.error(this.isEdit ? 'updated failed' : 'updated failed');
                            this.$emit('close');
                        },
                        () => {
                            this.$message.error('Network exception, please try again');
                            this.$emit('close');
                        });
            }
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
    .upload-float{
        width: 85%;
        margin-right: 5%;
        float: left;
    }
    .skip-float{
        float: left;
        line-height: 3.5;
    }

</style>
