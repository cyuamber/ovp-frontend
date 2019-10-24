<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
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
                title: this.isEdit ? 'Edit TTMS':'Rigister TTMS'
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
            handleCancel(){
                Object.keys(this.singleData).map(key => this.singleData[key] = '');
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
                        console.log(data,"data");
                        axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.$message.success('Has been added successfully');
                                        this.$emit('getAllMeterSys')
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
