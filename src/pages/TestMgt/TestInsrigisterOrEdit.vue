<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <Loading :loadingMessage="loadingMessage" />
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item label="Name"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input v-decorator="['Name',{ rules: [{ required: true,}],initialValue:singleData.meterSysName }]"/>
                </a-form-item>
                <a-form-item label="Vendor"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['Vendor',{ rules: [{ required: true,}],initialValue:singleData.meterSysVendor }]"/>
                </a-form-item>
                <a-form-item label="Mnt Address"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['MntAddress',{ rules: [{ required: true,}],initialValue:singleData.meterSysUrl }]"/>
                </a-form-item>
                <a-form-item label="User"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['User',{ rules: [{ required: true,}],initialValue:singleData.username }]"/>
                </a-form-item>
                <a-form-item label="Password"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['Password',{ rules: [{ required: true,}],initialValue:singleData.password }]" type="password">
                        <a-icon slot="prefix" type="eye" style="color:rgba(0,0,0,.25)" />
                    </a-input>
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
                title: this.isEdit ? 'Edit TTMS':'Rigister TTMS',
                loadingMessage : {
                    type: '',
                    toast: '',
                    show: true
                }
            }
        },
        computed: {
            ...mapState({
                singleData: state => state.testInstrument.singleData,
            })
        },
        destroyed () {
            this.$store.dispatch('testInstrument/getMeterSys', {})
        },
        methods: {
            handleLoadingMessage(type,toast,show){
                this.loadingMessage = {
                    type: type,
                    toast: toast,
                    show:show
                };
            },
            handleCancel(){
                this.$emit('close');
            },
            handleSubmit(e){
                let url = this.isEdit ? '/updateMeterSys':'/loginMeterSys';
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if(!err){
                        let data = {
                            meterSysName: values.Name,
                            meterSysVendor: values.Vendor,
                            meterSysUrl: values.MntAddress,
                            username: values.User,
                            password: values.Password,
                            createTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        this.handleLoadingMessage("","",true);
                        axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.handleLoadingMessage("success",this.isEdit ? 'Successfully updated' : 'successfully added ',false);
                                        this.$emit('getAllMeterSys');
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
