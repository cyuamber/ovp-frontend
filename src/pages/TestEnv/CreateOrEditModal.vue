<template>
  <a-modal :title="(isEdit ? 'Edit ': 'Rigister ') + currentTab" v-model="showModal" :footer="null" @cancel="handleCancel" centered>
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <div v-if="currentTab === 'VIM ENV'">
          <a-form-item v-for="(item,i) in VIMForm" :key="i" :label="item" :label-col="{ span: 8 }" 
          :wrapper-col="{ span: (item === 'Cloud Type' || item === 'Cloud Region ID')? 8:12 }">
            <a-input v-if="item !== 'Cloud Type' && item !== 'Cloud Region ID'" v-decorator="[
              VIMformList[i],
              { rules: [{ required: true, message: item +' is required' }], initialValue: initValues[i] },
            ]" />
            <a-select v-if="item === 'Cloud Region ID'" v-decorator="[VIMformList[i],{ rules: [{ required: true }]}]" :disabled="regionId.length === 0" class="select">
              <a-select-option v-for="type in regionId" :key="type" :value="type"> {{type}} </a-select-option>
            </a-select>
            <a-select v-if="item === 'Cloud Type'" v-decorator="[VIMformList[i],{ rules: [{ required: true }]}]" :disabled="cloudType.length ===0" class="select">
              <a-select-option v-for="type in cloudType" :key="type" :value="type"> {{type}} </a-select-option>
            </a-select>
            <a-spin :spinning="regionId.length === 0" v-if="item === 'Cloud Region ID'">
              <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
            </a-spin>
            <a-spin :spinning="cloudType.length ===0" v-if="item === 'Cloud Type'">
              <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
            </a-spin>
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
import {VIMForm, VNFMForm} from '../../const/TestEnvConst.js'
  export default {
    props: ['currentTab', 'isEdit', 'initValues','cloudTypeOptions','regionIdOptions'],
    data(){
      return {
        showModal: true,
        form: this.$form.createForm(this),
        VIMForm: VIMForm,
        VIMformList: [],
        VNFMForm: VNFMForm,
        VNFMformList: [],
        cloudType: this.cloudTypeOptions,
        regionId: this.regionIdOptions
      }
    },
    watch: {
      cloudTypeOptions(val){
        this.cloudType = val
      },
      regionIdOptions(val){
        this.regionId = val
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
.select{
  width: 70%;
  margin-right: 10%;
}
 
</style>
