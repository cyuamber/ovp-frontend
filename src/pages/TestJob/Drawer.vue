<template>
  <a-drawer
    title="Create Test Job"
    :width="550"
    @close="onClose"
    :visible="visible"
    :closable="false"
  >
    <a-form :form="form" class="form">
      <a-form-item v-for="(item,i) in inputs" :key="item" :label="item"  :label-col="{ span: 8 }" 
       :wrapper-col="{ span: (item === 'SUT Name' || item === 'Job Specification'|| item === 'SUT Type')? 9:14 }" 
      >
        <a-input v-if="item !== 'SUT Name' && item !=='Job Specification' && item !== 'SUT Type'" v-decorator="[formList[i],{ rules: [{ required: true, message: item +' is required'}]}]"/>
        <a-select v-if="item === 'SUT Type'" v-decorator="[formList[i],{ rules: [{ required: true, }], initialValue: SUTTypes[0]}]" 
          @select="((key) => selectSUTType(key))" class="select"
        >
          <a-select-option  v-for="type in SUTTypes" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <a-select v-if="item === 'SUT Name'" :disabled="!getSUTName" class="select"
         v-decorator="[formList[i],{ rules: [{ required: true }], initialValue: getSUTName ? SUTNames[0]: ''}]"
         @select="((key) => selectSUTName(key))"
        >
          <a-select-option  v-for="type in SUTNames" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <a-select v-if="item === 'Job Specification'" :disabled="!getSpecification" class="select"
         v-decorator="[formList[i],{ rules: [{ required: true }], initialValue: getSpecification ? specifications[0]: ''}]" 
         @select="((key)=> selectSpecification(key))"
        >
          <a-select-option  v-for="type in specifications" :key="type" :value="type"> {{type}} </a-select-option>
        </a-select>
        <a-spin :spinning="nameSpin" v-if="item === 'SUT Name'">
          <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
        </a-spin>
        <a-spin :spinning="specificationSpin" v-if="item === 'Job Specification'">
          <a-icon slot="indicator" type="loading-3-quarters" size="small" spin/>
        </a-spin>
      </a-form-item>
      <a-spin size="large" :spinning="testCaseSpin" tip="loading...">
        <div class="testCases spin-content">
          <div class="testCase" v-for="(item,index) in testCases" :key="item">
            <a-form-item :wrapper-col="{span: 7}" >
              <a-checkbox-group v-decorator="['checkboxGroup', { initialValue: ['case1'] }]">
                <a-checkbox :value="'case'+index" @change="onChange">{{item}}</a-checkbox>
              </a-checkbox-group>
            </a-form-item>
              <label :for="'case'+index+'VNFM'">Test VNFM ENV:</label> 
              <a-select v-decorator="['case'+index+'VNFM']" style="width: 120px" class="select-margin" :id="'case'+index+'VNFM'">
                <a-select-option  v-for="type in VNFMOption" :key="type" :value="type"> {{type}} </a-select-option>
              </a-select>
            </a-form-item>
            <label :for="'case'+index+'VNFM'">Test VIM ENV:</label>
              <a-select v-decorator="['case'+index+'VNFM']" style="width: 120px"  class="select-margin" :id="'case'+index+'VNFM'" >
                <a-select-option  v-for="type in VIMOption" :key="type" :value="type"> {{type}} </a-select-option>
              </a-select>
            </a-form-item>
          </div>
          <p class="wain" v-show="isShowWain">Select at least one test case！</p>
        </div>
      </a-spin>     
    </a-form>
     <div class="footer">
        <a-button @click="onClose" size="large" class="btn-color">
          Cancel
        </a-button>
        <a-button type="primary" size="large" @click="handleSubmit">Submit</a-button>
      </div>
  </a-drawer>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['isShow'],
    data(){
      return {
        visible: false,
        inputs: ['Job Name', 'Job Description', 'SUT Type', 'SUT Name', 'Job Specification'],
        formList: [],
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
        isShowWain: false,
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
          this.form.setFieldsValue({SUTType: 'VNF', SUTName: '', JobSpecification: ''})
        }
      }
    },
    created(){
      this.formList = this.inputs.map(item => {
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
              this.isShowWain = true
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
        this.isShowWain = false
        console.log(e.target,e)
      }

    }
    
  }
</script>

<style lang="less" scope>

  .form{
    
    .select{
      width: 70%;
      margin-right: 10%;
    }
    .select-margin{
      margin: 0 20px 24px 10px;
    }
    .wain{
      color: red;
    }
  }
  .footer{
    position: absolute;
    bottom: 0;
    left:0;
    width: 100%;
    .ant-btn{
      width: 50%;
      border: none;
      border-radius: 0;
    }
    .btn-color{
      background-color: #7A7A86;

    }
  }

</style>

