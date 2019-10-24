<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
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
                    <a-select class="select" :disabled="VNFOptions.length === 0" v-decorator="['VNFType',{ rules: [{ required: true, }],initialValue:this.isEdit ? testSpecSingleData.VNFtype:VNFOptions[0]}]">
                        <a-select-option v-for="type of VNFOptions" :key="type" :value="type">
                            {{type}}
                        </a-select-option>
                    </a-select>
                    <a-spin :spinning="VNFOptions.length === 0">
                        <a-icon slot="indicator"  type="loading-3-quarters" size="small" spin />
                    </a-spin>
                </a-form-item>
                <a-form-item label="Publish ORG"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['PublishORG',{ rules: [{ required: true,}],initialValue:testSpecSingleData.PublishORG }]"/>
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
                title: this.isEdit ? 'Edit Spec':'Add Spec',
            }
        },
        computed: {
            ...mapState({
                VNFOptions: state => state.testSpecMGT.VNFOptions,
                testSpecSingleData: state => state.testSpecMGT.testSpecSingleData
            })
        },
        watch: {
            showModal(val){
                if(!val) this.$store.dispatch('testSpecMGT/clearOptions')
            }
        },
        destroyed () {
            this.$store.dispatch('testSpecMGT/clearOptions');
            this.$store.dispatch('testSpecMGT/getTestSpec', {})
        },
        methods: {
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
                        console.log(data,"data");
                        axiospost(url, data)
                            .then((res) => {
                                    if(res.code === 200){
                                        this.$message.success(this.isEdit ? 'Successfully updated' : 'Has been added successfully');
                                        this.$emit('getAllTestSpec')
                                    }else this.$message.error(this.isEdit ? 'updated failed' : 'Has been added failed');
                                    this.$emit('close');
                                },
                                () => {
                                    this.$message.error('Network exception, please try again');
                                    this.$emit('close');
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