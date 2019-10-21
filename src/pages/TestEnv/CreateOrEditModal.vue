<template>
  <a-modal :title="(isEdit ? 'Edit ': 'Rigister ') + currentTab" v-model="showModal" :footer="null" @cancel="handleCancel">
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <div v-if="currentTab === 'VIM ENV'">
          <a-form-item v-for="(item,i) in VIMForm" :key="i" :label="item" :label-col="{ span: 8 }" 
          :wrapper-col="{ span: (item === 'Cloud Type' || item === 'Cloud Version')? 5:12 }">
            <a-input v-if="item !== 'Cloud Type' && item !== 'Cloud Version'" v-decorator="[
              VIMformList[i],
              { rules: [{ required: true, message: item +' is required' }], initialValue: initValues[i] },
            ]" />
            <a-select v-else v-decorator="[VIMformList[i],{ rules: [{ required: true, }],initialValue:isEdit ? initValues[i]:selectOption[0]}]" >
              <a-select-option v-for="type in selectOption" :key="type" :value="type"> {{type}} </a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <div v-else>
          <a-form-item v-for="(item,i) in VNFMForm" :key="i" :label="item" :label-col="{ span: 8 }" :wrapper-col="{ span: 12}">
            <a-input v-decorator="[
              VNFMformList[i],
              { rules: [{ required: true, message: item +' is required' }], initialValue: initValues[i] },
            ]" />
          </a-form-item>
        </div>
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
import {axiospost} from '../../utils/http'
  export default {
    props: ['currentTab', 'isEdit', 'initValues'],
    data(){
      return {
        showModal: true,
        form: this.$form.createForm(this),
        VIMForm: ['CloudOwner', 'Cloud Region ID', 'Cloud Type', 'Cloud Version', 'Owner Defined Type', 'Cloud Zone', 'User Name', 'Password', 'Auth URL', 'Tenant'],
        VIMformList: [],
        VNFMForm: ['Name', 'Type', 'Vendor', 'Version', 'URL', 'VIM', 'Certificate URL', 'User Name', 'Password'],
        VNFMformList: [],
        selectOption: ['VNF', 'PNF']
      }
    },
    methods: {
      handleCancel(){
        this.$emit('close')
      },
      handleSubmit(e){
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if(!err){
            let url = (this.isEdit ? '/update' : '/login') + (this.currentTab === 'VIM ENV'? 'VIM': 'VNFM');
            // Did not implement the check if there is a change
            let data = { }
            if(this.currentTab === 'VIM ENV'){
              this.VIMformList.forEach(item => {
                if(item === 'password') data.passwd = values[item]
                else data[item] = values[item];
              })
            }else{
              data = {
                VNFMname: values.name,
                VNFMtype: values.type,
                VNFMvendor: values.vendor,
                VNFMversion: values.version,
                url: values.uRL,
                authUrl: values.certificateURL,
                username: values.userName,
                password: values.password
              }
            }
            axiospost(url, data)
              .then((res) => {
                if(res.code === 200){
                  this.$message.success(this.isEdit ? 'Successfully updated' : 'Has been added successfully');
                  this.$emit('getAllTableData')
                }else this.$message.error(this.isEdit ? 'Update failed' : 'add failed');
                this.$emit('close')
              },
              error => {
                this.$message.error('Network exception, please try again');
                this.$emit('close')
              })
            
          }
        })
      },
      formatFormList(list,decorator){
        list.forEach((item,index) => {
          let ite = item.replace(' ','')
          decorator[index] = ite.replace(' ','').replace(ite[0],ite[0].toLowerCase())
        }) 
      }
    },
    created () {
      if(this.currentTab === 'VIM ENV') this.formatFormList(this.VIMForm,this.VIMformList)
      else this.formatFormList(this.VNFMForm,this.VNFMformList)
    }
  }
</script>

<style scoped>

 
</style>
