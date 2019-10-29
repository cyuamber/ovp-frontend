<template>
  <a-drawer
    title="Create Test Job"
    :width="450"
    @close="onClose"
    :visible="visible"
    :closable="false"
    class="drawer"
  >
    <a-form :form="form" class="form">
      <a-form-item v-for="(item,i) in formList" :key="item" :label="item"  :label-col="{ span: 8 }" 
       :wrapper-col="{ span: 14 }" 
      >
        <a-input v-if="item === formList[0]" v-decorator="[keyList[i],{ rules: [{ required: true, message: item +' is required'}]}]" /> 
        <a-textarea v-if="item === formList[1]"  v-decorator="[keyList[i],{ rules: [{ required: true, message: item +' is required'}]}]" :autosize="{minRows: 3}"/>
        <a-select v-else-if="item === 'SUT Type'" v-decorator="[keyList[i],{ rules: [{ required: true, }]}]" 
          @select="((key) => selectSUTType(key))" class="form__select--width"
        >
          <a-select-option  v-for="type in SUTTypes" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <a-select v-else-if="item === 'SUT Name'" :disabled="!getSUTName" class="form__select--width"
         v-decorator="[keyList[i],{ rules: [{ required: true }]}]" :title="!getSUTName ? 'Please select SUT Type first' : ''"
         @select="((key) => selectSUTName(key))"
        >
          <a-select-option  v-for="type in SUTNames" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <a-select v-else-if="item === 'Job Specification'" :disabled="!getSpecification" class="form__select--width"
         v-decorator="[keyList[i],{ rules: [{ required: true }]}]" @select="((key)=> selectSpecification(key))"
         :title="!getSUTName ? 'Please select SUT Type and SUT Name first' : (!getSpecification ? 'Please select SUT Name first': '')"
        >
          <a-select-option  v-for="type in specifications" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <!-- Test VNFM/VIM  -->
        <a-select v-else-if="item === 'Test VNFM ENV'" v-decorator="[keyList[i]]" class="form__select--width">
          <a-select-option  v-for="type in VNFMOption" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <a-select v-else-if="item === 'Test VIM ENV'" v-decorator="[keyList[i]]" class="form__select--width">
          <a-select-option  v-for="type in VNFMOption" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <!-- loading -->
        <a-spin :spinning="nameSpin" v-if="item === 'SUT Name'">
          <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
        </a-spin>
        <a-spin :spinning="specificationSpin" v-if="item === 'Job Specification'">
          <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
        </a-spin>
      </a-form-item>
      <!-- Test Case -->
      <a-spin :spinning="testCaseSpin" tip="loading...">
        <div  class="form__spin-content">
          <a-form-item v-if="testCases.length !== 0">
          <h3>Test Case List:</h3>
            <a-checkbox-group v-decorator="['checkboxGroup', { rules: [{ required: true, message: 'At least one test case to choose'}]}]" @change="onChange">
              <a-card-grid v-for="(item,index) in testCases" :key="item"  class="form__card--padding">
                <a-checkbox :value="'case'+index" class="form__checkbox--size"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item}}
              </a-card-grid>
              <!-- <a-checkbox v-for="(item,index) in testCases" :key="item" :value="'case'+index" class="form__checkbox--size"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item}} -->
            </a-checkbox-group>
          </a-form-item>  
        </div>
      </a-spin>
    </a-form>
    <div class="footer">
      <a-button @click="onClose" size="large"> Cancel </a-button>
      <a-button type="primary" size="large" @click="handleSubmit">Submit</a-button>
    </div>
  </a-drawer>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['isShow'],
    data(){
      return {
        visible: this.isShow,
        formList: ['Job Name', 'Job Description', 'SUT Type', 'SUT Name', 'Job Specification', 'Test VNFM ENV', 'Test VIM ENV'],
        keyList: [],
        form: this.$form.createForm(this),
        SUTTypes: ['VNF','PNF', 'NFVI'],
        getSUTName: false,
        SUTNames: [],
        nameSpin: false,
        selectedSUTType: '',
        specifications: [],
        getSpecification: false,
        specificationSpin: false,
        selectedSUTName: '',
        selectedSpecification: '',
        testCases: [],
        testCaseSpin: false,
        VNFMOption: ['111','ssss','sss'],
        VIMOption: ['111','ssss','sss'],
      }
    },
    watch: {
      isShow(val){
        if(val) {
          this.visible = this.isShow;
        }
      },
      visible(val){
        if(!val){
          this.getSUTName = false
          this.SUTNames = []
          this.selectedSUTType = ''
          this.specifications = []
          this.getSpecification = false
          this.specificationSpin = false
          this.selectedSUTName = ''
          this.selectedSpecification = ''
          this.testCases =  []
          this.testCaseSpin = false
          this.form.setFieldsValue({SUTType: '', SUTName: '', JobSpecification: ''})
        }
      }
    },
    created(){
      this.keyList = this.formList.map(item => {
        item = item.replace(' ','')
        return item
      })
    },
    methods: {
      onClose(){
        this.visible = false;
        this.$emit('close')
        
      },
      handleSubmit(){
        this.form.validateFields((error,values) => {
          if(!error){
            if(values.checkboxGroup.length === 0){
              return
            }
            this.visible = false;
          }
        })
      },
      selectSUTType(key){
        if(key === this.selectedSUTType) return
        this.selectedSUTType = key
        // Simulation request
        this.nameSpin = true
        this.getSUTName = false
        setTimeout(() => {
          this.getSUTName = true;
          this.SUTNames = ['name1', 'name2', 'name3']
          this.nameSpin = false
        },1000)
      },
      selectSUTName(key){
        if(key === this.selectedSUTName) return
        this.selectedSUTName = key
        // Simulation request
        this.specificationSpin = true
        this.getSpecification = false
        setTimeout(() => {
          this.getSpecification = true;
          this.specifications = ['name1', 'name2', 'name3']
          this.specificationSpin = false
        },1000)
      },
      selectSpecification(key){
        if(key === this.selectedSpecification) return
        this.selectedSpecification = key
        this.testCaseSpin = true
        this.testCases = []
        setTimeout(() => {
          this.testCaseSpin = false
          this.testCases = ['Test Case01', 'Test Case02', 'Test Case03']
        },2000)
      },
      onChange(e){
        console.log(e.target,e)
      }

    }
    
  }
</script>

<style lang="less" scope>

  .form{
    .ant-form-item-label {
      text-align: left;
    }
    .form__select--width{
      width: 55%;
      margin-right: 10%;
    }
    .form__checkbox--size{
      font-size: 20px;
    }
    .form__spin-content{
      width: 100%;
      height: 80px;
    }
    .form__card--padding{
      width: 50%;
      padding: 14px;
      text-indent: .5em;
    }
  }
  .footer{
    position: absolute;
    bottom: 0;
    left:0;
    width: 100%;
    .ant-btn{
      width: 50%;
    }
  }

</style>

