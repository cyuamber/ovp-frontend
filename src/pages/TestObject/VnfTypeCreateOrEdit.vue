<template>
   <a-modal title="Create VNF Type" v-model="showModal" :footer="null" @cancel="handleCancel">
      <template>
        <a-form :form="form" @submit="handleSubmit">
          <a-form-item label="VNF Type Name"  :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
            <!-- <a-input
              v-decorator="['VNFTypeName', { rules: [{ required: true, message: 'Please input VNF Type Name!' }],initialValue: vnfName  }]" 
            /> -->
            <a-input v-model="vnfName"/>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
            <a-button type="primary" html-type="submit">
              Submit
            </a-button>
          </a-form-item>
        </a-form>
      </template>
    </a-modal>
</template>

<script type="text/ecmascript-6">
import moment from 'moment';
import http from '../../utils/http';
  export default {
    props: ['visible','VnfTypeName','isEdit'],
    data(){
      return {
        form: this.$form.createForm(this),
        showModal: false,
        vnfName: ''
      }
    },
    methods: {
      handleCancel(){
        this.vnfName = ''
        this.$emit('close')
      },
      handleSubmit(e){
        console.log(111)
        e.preventDefault();
        if(this.vnfName.trim()){
          let data = {
            VNFTypeName: this.vnfName,
            createTime: moment(new Date()).format('YYYY-MM-DD'),
            id: Math.ceil(Math.random()*1000)
          }
          http.axiospost('/createVNFType', data)
            .then((res) => {
              if(res.code === 200){
                this.$message.success('Has been added successfully');
                this.$emit('getAllVnfType')
              }else this.$message.error('add failed');
            },
            error => {
              this.$message.error('Network exception, please try again');
            })
            this.vnfName = ''
            this.$emit('close')
        }
      },
    },
    watch:{
      visible(value){
        this.showModal=value;
        if(this.showModal && this.isEdit){
          this.vnfName = this.VnfTypeName
        }
      },
      VnfTypeName(val){
        if(this.isEdit) this.vnfName = val
      }
    },
  }
</script>

<style scoped>

 
</style>
