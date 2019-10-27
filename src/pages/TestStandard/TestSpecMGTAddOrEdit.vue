<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <Loading :loadingMessage="loadingMessage" />
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item label="ID"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input v-decorator="['ID',{ rules: [{ required: true,}],initialValue:testSpecSingleData.testSpecId }]"/>
                </a-form-item>
                <a-form-item label="Name"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['Name',{ rules: [{ required: true,}],initialValue:testSpecSingleData.testSpecName }]"/>
                </a-form-item>
                <a-form-item label="Version"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['Version',{ rules: [{ required: true,}],initialValue:testSpecSingleData.testSpecVersion }]"/>
                </a-form-item>
                <a-form-item label="VNF Type"  :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
                    <a-select class="select" :disabled="spin" v-decorator="['VNFType',{ rules: [{ required: true, }],initialValue:this.isEdit ? testSpecSingleData.VNFtype:VNFOptions[0]}]" @dropdownVisibleChange="dropdownVisibleChange">
                        <a-select-option v-for="type of VNFOptions" :key="type" :value="type">
                            {{type}}
                        </a-select-option>
                    </a-select>
                    <a-spin :spinning="spin">
                        <a-icon slot="indicator"  type="loading-3-quarters" size="small" spin />
                    </a-spin>
                </a-form-item>
                <a-form-item label="Publish ORG"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['PublishORG',{ rules: [{ required: true,}],initialValue:testSpecSingleData.PublishORG }]"/>
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
                title: this.isEdit ? 'Edit Spec':'Add Spec',
                spin: false,
                count: 0,
                loadingMessage : {
                    type: '',
                    toast: '',
                    show: true
                }
            }
        },
        computed: {
            ...mapState({
                VNFOptions: state => state.testSpecMGT.VNFOptions,
                testSpecSingleData: state => state.testSpecMGT.testSpecSingleData
            })
        },
        watch: {
            visible(val){
                if(val) {
                    this.showModal = val;
                    this.count ++;
                    if(!this.showModal.length && this.isEdit && this.count !== 1){
                        this.form.setFieldsValue({
                            testSpecId: this.testSpecSingleData.testSpecId,
                            testSpecName: this.testSpecSingleData.testSpecName,
                            testSpecVersion: this.testSpecSingleData.testSpecVersion,
                            VNFtype: this.testSpecSingleData.VNFtype,
                            PublishORG: this.testSpecSingleData.PublishORG
                        })
                    }
                    if(!this.showModal.length && !this.isEdit) this.spin = true
                }
            },
            showModal(val){
                if(!val) {
                    this.$emit('close');
                    this.$store.dispatch('testSpecMGT/clearOptions');
                    this.$store.dispatch('testSpecMGT/getTestSpec', {});
                    this.form.setFieldsValue({testSpecId: '', testSpecName: '', testSpecVersion: '', VNFtype: '',PublishORG:''})
                }
            },
            VNFOptions(val){
                if(val.length) {
                    this.spin = false
                }
                if(val.length && !this.isEdit){
                    this.form.setFieldsValue({VNFtype: val[0]})
                }
            }
        },
        destroyed () {
            this.$store.dispatch('testSpecMGT/clearOptions');
            this.$store.dispatch('testSpecMGT/getTestSpec', {})
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
                    this.$store.dispatch('testSpecMGT/getVNFOptions').then(() => {this.spin = true})
                }
            },
            handleCancel(){
                this.$emit('close');
            },
            handleSubmit(){
                let url = this.isEdit ? '/updateTestSpec':'/addTestSpec';
                this.form.validateFields((err, values) => {
                    if(!err){
                        let data = {
                            testSpecId: values.ID,
                            testSpecName: values.Name,
                            testSpecVersion: values.Version,
                            VNFtype: values.VNFType,
                            PublishORG: values.PublishORG,
                            publishTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        this.handleLoadingMessage("","",true);
                        axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.handleLoadingMessage("success",this.isEdit ? 'Successfully updated' : 'successfully added ',false);
                                        this.$emit('getAllTestSpec')
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
                                });
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