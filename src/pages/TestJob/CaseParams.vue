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
            v-if="item.visible===true &&item.type==='string'"
            v-decorator="[item.name,{ rules: [{ required: item.isOptional,message: item.name+'is required'}],initialValue:!isEdit?item.defaultValue:item.value }]"
          />
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
            console.log(this.form.getFieldValue('string3'),typeof this.form.getFieldValue('string3'), '-----string3')
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
          let caseParameters = this.caseParamsData;
          let testCaseLists = this.testCaseList;
          caseParameters.parameters.forEach(item => {
            if (values[item.name] !== undefined) {
              item.value = values[item.name];
            }
          });
          testCaseLists.map((item, index) => {
            if (item.id === caseParameters.id) {
              testCaseLists.splice(index, 1, caseParameters);
            }
          });
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