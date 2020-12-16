<template>
  <a-modal
    v-bind:title="title"
    :visible="caseParamsIsShow"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <template>
      <a-form :form="form">
        <a-form-item
          v-for="item in caseParams"
          :key="item.name"
          :label="item.name"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 14 }"
          :class="{'checkboxgroup': item.visible===true &&item.type==='checkbox'}"
        >
          <a-input
            v-if="item.visible===true &&(item.type==='string' || item.type==='datetime') && item.name !== 'vm_ips' & item.name !== 'caps'"
            v-decorator="[item.name,{ rules: [{ required: item.isOptional,message: item.name+'is required'}],initialValue:!isEdit?item.defaultValue:item.value }]"
          />
          <div v-if="item.visible===true &&item.type==='string' && (item.name === 'vm_ips' || item.name === 'caps')">
            <a-input
              v-for="(items, index) in (!isEdit?item.defaultValue.split(';'):item.value.split(';'))"
              :key="index"
              :disabled="item.name === 'vm_ips'?true:false"
              v-decorator="[item.name === 'vm_ips'?'vm_ips'+index+caseParamsData.id:'caps'+index+caseParamsData.id,{ rules: [{ required: item.isOptional,message: item.name+'is required'}],initialValue:items }]"
            />
          </div>
          <a-switch
            v-if="item.visible===true &&item.type==='bool'"
            v-decorator="[item.name,{ valuePropName: 'checked',rules: [{ required: item.isOptional,message: item.name+'is required'}],initialValue:isEdit === true ?strBool(item.value):strBool(item.defaultValue) }]"
          />
          <a-checkbox-group
            v-if="item.visible===true &&item.type==='checkbox'"
            v-decorator="[item.name, { initialValue: !isEdit?item.defaultValue:item.value }]"
          >
           <a-row>
            <a-col 
            :span="8" 
            v-for="items in item.allValue"
            :key="items"
            >
              <a-checkbox :value="items">
                {{items}}
              </a-checkbox>
            </a-col>
           </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script type="text/ecmascript-6">
import { mapState, mapMutations } from "vuex";
export default {
  name: "CaseParams",
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      title: this.isEdit ? "Edit Case Parameters" : "Add Case Parameters",
      caseParams: [],
      count: 0
    };
  },
  computed: {
    ...mapState({
      caseParamsData: state => state.testJob.caseParamsData,
      testCaseList: store => store.testJob.testCaseList,
      caseParamsIsShow: store => store.testJob.caseParamsIsShow
    })
  },
  watch: {
    caseParamsIsShow(val) {
        if (val) {
            this.count++;
            if (this.count > 1) {
                this.caseParams = this.caseParamsData.parameters.filter(item => {
                    return item.visible !== false;
                });
                this.caseParams.forEach(item => {
                    this.form.setFieldsValue({
                        [item.name]:
                            this.isEdit === false && item.type !== "bool"
                                ? item.defaultValue
                                : this.isEdit === false && item.type === "bool"
                                ? this.strBool(item.defaultValue)
                                : this.isEdit === true && item.type !== "bool"
                                ? item.value
                                : this.strBool(item.value)
                    });
                });
            }
        }else{
            this.caseParams.forEach(item => {
                this.form.setFieldsValue({
                    [item.name]:
                        this.isEdit === false && item.type !== "bool"
                                ? item.defaultValue
                                : this.isEdit === false && item.type === "bool"
                                ? this.strBool(item.defaultValue)
                                : this.isEdit === true && item.type !== "bool"
                                ? item.value
                                : this.strBool(item.value)
                });
            });
        }
    },
    caseParamsData(val) {
      this.caseParams = val.parameters.filter(item => {
        return item.visible !== false;
      });
    }
  },
  methods: {
    ...mapMutations("testJob", ["setCaseParamsIsShow", "updateTestCaseList"]),
    handleCancel() {
      this.setCaseParamsIsShow(false);
    },
    handleSubmit() {
      this.form.validateFields((error, values) => {
        if (!error) {
          // console.log(values, this.caseParamsData,'---values')
          let caseParameters = this.caseParamsData;
          let testCaseLists = this.testCaseList;
          let DRAValues = {
            vm_ips: '',
            caps: '',
            test_times: ''
          }
          if( Object.keys(values).indexOf('test_times')>-1){
            Object.keys(values).map(items => {
              if(items.indexOf('vm_ips')>-1){
                DRAValues.vm_ips = DRAValues.vm_ips + values[items]+";"
              }else if (items.indexOf('caps')>-1){
                DRAValues.caps = DRAValues.caps + values[items]+";"
              }else if (items.indexOf('test_times')>-1) {
                DRAValues.test_times = DRAValues.test_times + values[items]
              }
            })
            DRAValues.vm_ips = DRAValues.vm_ips.charAt(DRAValues.vm_ips.length-1) === ';' ? DRAValues.vm_ips.substring(0, DRAValues.vm_ips.length - 1) : DRAValues.vm_ips
            DRAValues.caps = DRAValues.caps.charAt(DRAValues.caps.length-1) === ';' ? DRAValues.caps.substring(0, DRAValues.caps.length - 1) : DRAValues.caps
            caseParameters.parameters.forEach(item => {
              if (DRAValues[item.name] !== undefined) {
                item.value = DRAValues[item.name];
                item.defaultValue = DRAValues[item.name];
              }
            });
          } else {
            caseParameters.parameters.forEach(item => {
              if (values[item.name] !== undefined) {
                item.value = values[item.name];
              }
            });
          }
          testCaseLists.map((item, index) => {
            if (item.id === caseParameters.id) {
              testCaseLists.splice(index, 1, caseParameters);
            }
          });
          console.log(testCaseLists, '---testCaseLists')
          this.updateTestCaseList({ spin: false, list: testCaseLists });
          this.setCaseParamsIsShow(false);
        }
      });
    },
    strBool(val) {
      return val === "true" ? true : false;
    }
  }
};
</script>
<style lang="less">
.checkboxgroup.ant-form-item {
  .ant-form-item-label{
    line-height: inherit!important
  }
}
</style>