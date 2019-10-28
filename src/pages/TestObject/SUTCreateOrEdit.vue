<template>
  <a-modal
    :title="(isEdit === true ? 'Edit ': 'Create ') + currentTab + ' SUT'"
    v-model="showModal"
    :footer="null"
    @cancel="handleCancel"
  >
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :label=" currentTab +' Name'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
          'testName',
          { rules: [{ required: true, message: currentTab +' Name is required' }], initialValue: VNFTest.VNFTestName },
        ]"
          />
        </a-form-item>
        <a-form-item :label="currentTab + ' Type'" :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
          <a-select :disabled="spin" class="select" @dropdownVisibleChange="handleExpand"
            v-decorator="['typeName',{ rules: [{ required: true, }],initialValue: this.isEdit ? VNFTest.VNFTypeName:VNFOptions[0]}]">
            <a-select-option v-for="type in VNFOptions" :key="type" :value="type"> {{type}} </a-select-option>
          </a-select>
          <a-spin :spinning="spin" class='skip-size'>
            <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
          </a-spin>
        </a-form-item>
        <a-form-item
          :label="currentTab + ' Vendor'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
          'vendor', { rules: [{ required: true, message: 'Vendor is required' }], initialValue: VNFTest.VNFTestVendor},
        ]"
          />
        </a-form-item>
        <a-form-item label="Vension" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="[
          'version', { rules: [{ required: true, message: 'Version is required' }], initialValue: VNFTest.VNFTestVersion},
        ]"
          />
        </a-form-item>
        <a-form-item label="Upload CSAR File" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
           <a-upload-dragger
            name="file"
            @change="handleChange"
          >
            <p class="ant-upload-text upload-text">Click or drag to upload</p>
          </a-upload-dragger>
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
import {axiospost} from '../../utils/http';
  export default {
    props: ['isEdit', 'currentTab','visible'],
    data(){
      return {
        showModal: false,
        form: this.$form.createForm(this),
        selected: '',
        count: 0,
        spin: false
      }
    },
    computed: {
      ...mapState({
        VNFOptions: state => state.testSUT.VNFOptions,
        VNFTest: state => state.testSUT.VNFTest 
      })
    },
    watch: {
      visible(val){
        if(val) {
          this.showModal = val;
          this.count ++
          if(!this.showModal.length && this.isEdit && this.count !== 1){
            this.form.setFieldsValue({
              testName: this.VNFTest.VNFTestName,
              typeName: this.VNFTest.VNFTypeName,
              vendor: this.VNFTest.VNFTestVendor,
              version: this.VNFTest.VNFTestVersion
            })
          } 
          if(!this.showModal.length && !this.isEdit) this.spin = true
        }
      },
      showModal(val){
        if(!val) {
          this.$emit('close')
          this.$store.dispatch('testSUT/clearOptions')
          this.$store.dispatch('testSUT/getVNFTest', {})
          this.form.setFieldsValue({testName: '', version: '', vendor: '', typeName: '', })
        }
      },
      VNFOptions(val){
        if(val.length) {
          this.spin = false
        }      
        if(val.length && !this.isEdit){
          this.form.setFieldsValue({typeName: val[0]})
        }
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
            // Did not implement the check if there is a change
            let data = {
              VNFTestName: values.testName,
              VNFTestVendor: values.vendor,
              VNFTestVersion: values.version,
              VNFTypeName: this.selected,
              createTime: this.isEdit ? this.VNFTest.createTime : moment(new Date()).format('YYYY-MM-DD'),
              VNFFileName: {}
            }
            let {isEdit} = this
            this.$store.dispatch('testSUT/createOrEditVNFTest',{isEdit,data}).then(()=>{this.showModal = false},()=>{this.showModal = false})
          }
        })
      },
      handleExpand(){
        if(!this.VNFOptions.length) {
          this.spin = true
          this.$store.dispatch('testSUT/getVNFOptions').then(() => {this.spin = true})
        }
      },
      handleChange(){
        console.log('上传')
      }
    
  }
};
</script>

<style lang="less" scoped>
.select{
  width: 70%;
  margin-right: 5%;
}
.upload-text{
  font-size: 12px !important;
}
</style>
