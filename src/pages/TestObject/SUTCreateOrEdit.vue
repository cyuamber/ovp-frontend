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
          'TestName',
          { rules: [{ required: true, message: currentTab +' Name is required' }], initialValue: VNFTest.VNFTestName },
        ]"
          />
        </a-form-item>
        <a-form-item :label="currentTab + ' Type'" :label-col="{ span: 7 }" :wrapper-col="{ span: 8 }">
          <a-select :disabled="VNFOptions.length === 0" class="select"
            v-decorator="['typeName',{ rules: [{ required: true, }],initialValue: this.isEdit ? VNFTest.VNFTypeName:VNFOptions[0]}]">
            <a-select-option v-for="type in VNFOptions" :key="type" :value="type"> {{type}} </a-select-option>
          </a-select>
          <a-spin :spinning="VNFOptions.length === 0" class='skip-size'>
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
    props: ['isEdit', 'currentTab'],
    data(){
      return {
        showModal: true,
        form: this.$form.createForm(this),
        selected: '',
      }
    },
    computed: {
      ...mapState({
        VNFOptions: state => state.testSUT.VNFOptions,
        VNFTest: state => state.testSUT.VNFTest 
      })
    },
    watch: {
      showModal(val){
        if(!val) this.$store.dispatch('testSUT/clearOptions')
      }
    },
    destroyed () {
      this.$store.dispatch('testSUT/clearOptions')
      this.$store.dispatch('testSUT/getVNFTest', {})
    },
    methods: {
      handleCancel(){
        this.$emit('close')
      },
      handleSubmit(e){
        let url = this.isEdit ? '/updateVNFTest' : '/createVNFTest'
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if(!err){
            // Did not implement the check if there is a change
            let data = {
              VNFTestName: values.TestName,
              VNFTestVendor: values.vendor,
              VNFTestVersion: values.version,
              VNFTypeName: this.selected,
              createTime: this.isEdit ? this.VNFTest.createTime : moment(new Date()).format('YYYY-MM-DD'),
              VNFFileName: {}
            }
            axiospost(url, data)
              .then((res) => {
                if(res.code === 200){
                  this.$message.success(this.isEdit ? 'Successfully updated' : 'Has been added successfully');
                  this.$emit('getAllVnfType')
                }else this.$message.error(this.isEdit ? 'Update failed' : 'add failed');
              },
              () => {
                this.$message.error('Network exception, please try again');
              })
            this.$emit('close')
        }
      })
    },
    handleSelect(val){
      this.selected = val;
    },
    handleChange(){
      console.log(111)
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
