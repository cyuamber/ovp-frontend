<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <a-form :form="form" @submit="handleSubmit">
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
    export default {
        props: ['isEdit'],
        data(){
            return {
                form: this.$form.createForm(this),
                showModal: true,
                title: this.isEdit ? 'Edit Spec':'Add Spec',
                spin: false,
                count: 0,
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
                            Name: this.testSpecSingleData.testSpecName,
                            Version: this.testSpecSingleData.testSpecVersion,
                            VNFType: this.testSpecSingleData.VNFtype,
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
                    this.form.setFieldsValue({Name: '', Version: '', VNFType: '',PublishORG:''})
                }
            },
            VNFOptions(val){
                if(val.length) {
                    this.spin = false
                }
                if(val.length && !this.isEdit){
                    this.form.setFieldsValue({VNFType: val[0]})
                }
            }
        },
        methods: {
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
                this.form.validateFields((err, values) => {
                    if(!err){
                        let data = {
                            testSpecName: values.Name,
                            testSpecVersion: values.Version,
                            VNFtype: values.VNFType,
                            PublishORG: values.PublishORG,
                            publishTime: moment(new Date()).format('YYYY-MM-DD')
                        };
                        let {isEdit} = this;
                        this.$store.dispatch('testSpecMGT/createOrEditTestSpec',{isEdit,data}).then(()=>{this.$emit('close');},()=>{this.$emit('close');})
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