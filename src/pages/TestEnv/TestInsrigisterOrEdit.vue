<template>
    <a-modal v-bind:title="title" v-model="showModal" :footer="null" @cancel="handleCancel">
        <template>
            <a-form :form="form" @submit="handleSubmit">
                <a-form-item label="Name"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }" >
                    <a-input v-decorator="['Name',{ rules: [{ required: true,}],initialValue:singleData.name }]"/>
                </a-form-item>
                <a-form-item label="Vendor"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['Vendor',{ rules: [{ required: true,}],initialValue:singleData.vendor }]"/>
                </a-form-item>
                <a-form-item label="Mnt Address"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['MntAddress',{ rules: [{ required: true,}],initialValue:singleData.mntAddress }]"/>
                </a-form-item>
                <a-form-item label="User"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input v-decorator="['User',{ rules: [{ required: true,}],initialValue:singleData.username }]"/>
                </a-form-item>
                <a-form-item label="Password"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
                    <a-input-password v-decorator="['Password',{ rules: [{ required: true,}],initialValue:singleData.password }]" type="password">
                    </a-input-password>
                </a-form-item>
                <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
                    <a-button type="primary" html-type="submit">Submit</a-button>
                </a-form-item>
            </a-form>
        </template>
    </a-modal>
</template>

<script type="text/ecmascript-6">
    import { mapState, mapActions } from "vuex";
    export default {
        props: ['isEdit'],
        data(){
            return {
                form: this.$form.createForm(this),
                showModal: true,
                title: this.isEdit ? 'Edit TTMS':'Rigister TTMS',
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
            ...mapActions("testInstrument", [
                "createOrEditTestIns"
            ]),
            handleCancel(){
                this.$emit('close');
            },
            handleSubmit(e){
                e.preventDefault();
                this.form.validateFields((err, values) => {
                    if(!err){
                        let data = {
                            name: values.Name,
                            vendor: values.Vendor,
                            mntAddress: values.MntAddress,
                            username: values.User,
                            password: values.Password
                        };
                        let {isEdit} = this;
                        if(this.isEdit)data.id = this.singleData.id;
                        this.createOrEditTestIns({
                            isEdit,
                            data
                        }).
                            then(
                                ()=>{this.$emit('close');},
                                ()=>{this.$emit('close');}
                            )
                    }
                });

            },
        }
    }
</script>
