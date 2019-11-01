<template>
  <a-modal :title="(isEdit ? 'Edit ': 'Register ') + currentTab" v-model="visible" :footer="null" @cancel="handleCancel" centered>
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <div v-if="currentTab === 'VIM ENV'">
          <a-form-item v-for="(item,i) in VIMForm" :key="i" :label="item" :label-col="{ span: 8 }" 
          :wrapper-col="{ span: (item === 'Cloud Type' || item === 'Cloud Region ID')? 8:12 }">
            <a-input v-if="item !== 'Cloud Type' && item !== 'Cloud Region ID'" v-decorator="[
              VIMformList[i],
              { rules: [{ required: true, message: item +' is required' }], initialValue: initValues[i] },
            ]" />
            <a-select v-if="item === 'Cloud Region ID'" v-decorator="[VIMformList[i],{ rules: [{ required: true }]}]" :disabled="regionIdOptions.length === 0" class="select">
              <a-select-option v-for="type in regionIdOptions" :key="type" :value="type"> {{type}} </a-select-option>
            </a-select>
            <a-select v-if="item === 'Cloud Type'" v-decorator="[VIMformList[i],{ rules: [{ required: true }]}]" :disabled="cloudTypeOptions.length ===0" class="select">
              <a-select-option v-for="type in cloudTypeOptions" :key="type" :value="type"> {{type}} </a-select-option>
            </a-select>
            <a-spin :spinning="regionIdOptions.length === 0" v-if="item === 'Cloud Region ID'">
              <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
            </a-spin>
            <a-spin :spinning="cloudTypeOptions.length ===0" v-if="item === 'Cloud Type'">
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
import { mapState } from 'vuex'

  export default {
    props: [ 'isEdit', 'initValues'],
    data(){
      return {
        form: this.$form.createForm(this),
        VIMForm: VIMForm,
        VIMformList: [],
        VNFMForm: VNFMForm,
        VNFMformList: [],
      }
    },
    computed: {
      ...mapState({
        currentTab: state => state.testENV.currentTab,
        cloudTypeOptions: state => state.testENV.cloudTypeOptions,
        regionIdOptions: state => state.testENV.regionIdOptions,

      }),
      visible: {
        get(){
          return this.$store.state.testENV.visible
        },
        set(val){
          if(!val) {
           
            // this.$store.commit('testSUT/updateVNFOptions', [])
            // this.$store.commit('testSUT/updateVNFTest', {})
            // this.form.setFieldsValue({testName: '', version: '', vendor: ''})
            // this.spin = false
          }
        }
      }
    },
    created () {
      if(this.currentTab === 'VIM ENV') this.formatFormList(this.VIMForm,this.VIMformList)
      else this.formatFormList(this.VNFMForm,this.VNFMformList)
    },
    methods: {
      handleCancel(){
        this.$store.commit('testENV/updateVisible', false)
        this.clear()
      },
      handleSubmit(e){
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if(!err){
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
            this.$store.commit('testENV/updateVisible', false)
            this.clear()
            this.$store.dispatch('testENV/loginVIN',{isEdit: this.isEdit, data})
          }
        })
      },
      formatFormList(list,decorator){
        list.forEach((item,index) => {
          let ite = item.replace(' ','')
          decorator[index] = ite.replace(' ','').replace(ite[0],ite[0].toLowerCase())
        }) 
      },
      clear(){
        let list = this.currentTab === 'VIM ENV' ? this.VIMformList : this.VNFMformList
        list.forEach(item => {
          this.form.setFieldsValue({ [item]: ''})
        })
      }
    },
   
  }
</script>

<style scoped>
.select{
  width: 70%;
  margin-right: 10%;
}
 
</style>
