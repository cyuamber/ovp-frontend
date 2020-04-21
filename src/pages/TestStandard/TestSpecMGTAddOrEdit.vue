<template>
  <a-modal v-bind:title="title" v-model="visible" :footer="null" @cancel="handleCancel">
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="Name" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['Name',{ rules: [{ required: true,message:' Name is required'}],initialValue:testSpecSingleData.name }]"
          />
        </a-form-item>
        <a-form-item label="Version" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['Version',{ rules: [{ required: true,message:' Version is required'}],initialValue:testSpecSingleData.version }]"
          />
        </a-form-item>
        <a-form-item label="SUT Type" :label-col="{ span: 7 }" :wrapper-col="{ span: 11 }">
          <a-select
            class="select"
            v-decorator="['SUTType',{ rules: [{ required: true}],initialValue:initSUTTypeValue}]"
            @change="handleSelectSUTChange"
          >
            <a-select-option
              v-for="type of SUTOptions"
              :key="type.code"
              :value="type.code"
            >{{type.dictLabel}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Sub SUT type" :label-col="{ span: 7 }" :wrapper-col="{ span: 11 }">
          <a-select
            class="select"
            v-decorator="['subSutType',{ rules: [{ required: true, }],initialValue:initVNFtypeValue}]"
            @change="handleSelectSubSUTTypeChange"
            @dropdownVisibleChange="dropdownVisibleChange"
          >
            <a-select-option
              v-for="type in VNFOptions"
              :key="type.code"
              :value="type.code"
            >{{type.dictLabel}}</a-select-option>
          </a-select>
          <a-spin :spinning="spin">
            <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
          </a-spin>
        </a-form-item>
        <a-form-item v-if="testCaseList.length>0">
          <h3 class="form__checkboxtitle--size">
            <span>*</span>Test Case List:
            <a-checkbox  @change="onCheckAllChange" :checked="testCaseCheckAll">
              Check all
            </a-checkbox>
          </h3>
          <a-checkbox-group
            class="form__checkboxgroup--margin"
            v-decorator="['checkboxGroup', { rules: [{ required: true, message: 'At least one test case to choose'}],initialValue:initcheckboxGroup}]"
            @change="checkboxGrouponChange"
          >
            <a-list itemLayout="vertical"
                    :pagination="caseListPagination"
                    :dataSource="testCaseList"
                    bordered>
              <a-list-item slot="renderItem"
                           slot-scope="item"
                           :key="item.id"
                           class="form__card--padding">
                <a-checkbox
                        :value="item.id"
                        :checked="initcheckboxGroup.includes(item.id)"
                        class="form__checkbox--size"
                />
                <span :title="item.description">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}</span>
              </a-list-item>
            </a-list>
            <!--<a-card-grid v-for="item in testCaseList" :key="item.id " class="form__card&#45;&#45;padding">-->
              <!--<a-checkbox-->
                <!--:value="item.id"-->
                <!--:checked="initcheckboxGroup.includes(item.id)"-->
                <!--class="form__checkbox&#45;&#45;size"-->
              <!--/>-->
              <!--<span :title="item.description">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}</span>-->
            <!--</a-card-grid>-->
          </a-checkbox-group>
        </a-form-item>
        <a-form-item label="Publish ORG" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['PublishORG',{ rules: [{ required: true,message:' PublishORG is required'}],initialValue:testSpecSingleData.publishOrg }]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script type="text/ecmascript-6">
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      showModal: true,
      title: this.isEdit ? "Edit Spec" : "Add Spec",
      spin: false,
      initSUTTypeValue: null,
      initVNFtypeValue: null,
      count: 0,
      caseListPagination:{
          onChange: page => {
              console.log(page);
          },
          pageSize: 5,
      },
    };
  },
  computed: {
    ...mapState({
      SUTOptions: state => state.testSpecMGT.SUTOptions,
      VNFOptions: state => state.testSpecMGT.VNFOptions,
      testCaseList: store => store.testSpecMGT.testCaseList,
      testSpecSingleData: state => state.testSpecMGT.testSpecSingleData,
      testCaseCheckAll: state => state.testSpecMGT.testCaseCheckAll,
      initcheckboxGroup: state => state.testSpecMGT.initcheckboxGroup
    }),
    visible: {
      get() {
        return this.$store.state.testSpecMGT.visible;
      },
      set(val) {
        if (!val) {
          this.clearOptions();
          this.getTestSpec({});
          this.form.setFieldsValue({
            Name: "",
            Version: "",
            SUTType: "",
            subSutType: "",
            PublishORG: ""
          });
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.count++;
        if (this.isEdit && this.count > 1) {
          this.form.setFieldsValue({
            Name: this.testSpecSingleData.name,
            Version: this.testSpecSingleData.version,
            SUTType: this.testSpecSingleData.sutTypeCH.dictLabel,
            subSutType: this.testSpecSingleData.subSutTypeCH.dictLabel,
            checkboxGroup: this.initcheckboxGroup,
            PublishORG: this.testSpecSingleData.publishOrg
          });
          this.initSUTTypeValue = this.testSpecSingleData.sutTypeCH.dictLabel;
          this.initVNFtypeValue = this.testSpecSingleData.subSutTypeCH.dictLabel;
        } else if (!this.isEdit && this.count > 1) {
          this.spin = true;
          this.initSUTTypeValue = this.SUTOptions[0].code;
          this.form.setFieldsValue({ SUTType: this.SUTOptions[0].code });
          this.getVNFOptions({
            SUTType: this.initSUTTypeValue
          });
        }
      }
    },
    SUTOptions(val) {
      if (val.length && !this.isEdit) {
        this.initSUTTypeValue = this.SUTOptions[0].code;
        if (this.count > 1) {
          this.form.setFieldsValue({ SUTType: this.SUTOptions[0].code });
        }
      }
    },
    VNFOptions(val) {
      this.spin = false;
      if (val.length && !this.isEdit) {
        this.initVNFtypeValue = this.VNFOptions[0].code;
        this.getTestCaseList({
          sutCode: this.initSUTTypeValue,
          subSutCode: this.VNFOptions[0].code,
          testSpecSingleData: this.testSpecSingleData,
          message: this.$message
        });
        if (this.count > 1) {
          this.form.setFieldsValue({ subSutType: this.VNFOptions[0].code });
        }
      }
    },
    testSpecSingleData(val) {
      if (Object.keys(val).length > 0) {
        this.initSUTTypeValue = val.sutTypeCH.dictLabel;
        this.initVNFtypeValue = val.subSutTypeCH.dictLabel;
        this.spin = false;
      }
    },
    initcheckboxGroup(val) {
      this.form.setFieldsValue({
        checkboxGroup: val
      });
     if(val.length === this.testCaseList.length){
         this.changeCaseCheckAll(true)
     }
    }
  },
  methods: {
    ...mapActions("testSpecMGT", [
      "clearOptions",
      "getTestSpec",
      "getSUTOptions",
      "getVNFOptions",
      "activateTestCase",
      "createOrEditTestSpec",
      "getTestCaseList"
    ]),
    ...mapMutations("testSpecMGT", ["updateVisible", "updateTestCaseList","changeCaseCheckAll","updateCheckboxGroup"]),
    handleSelectSUTChange(val) {
      this.spin = true;
      this.clearOptions();
      this.initVNFtypeValue = "";
      this.form.setFieldsValue({ subSutType: "" });
      this.getVNFOptions({ SUTType: val });
    },
    handleSelectSubSUTTypeChange(val) {
      let sutCode = null;
      if (this.isEdit) {
        sutCode =
          this.form.getFieldValue("SUTType") === this.initSUTTypeValue
            ? this.codeConversion(
                this.form.getFieldValue("SUTType"),
                this.SUTOptions
              )
            : this.form.getFieldValue("SUTType");
      } else {
        sutCode = this.form.getFieldValue("SUTType");
      }
      this.getTestCaseList({
        sutCode: sutCode,
        subSutCode: val,
        testSpecSingleData: this.testSpecSingleData,
        message: this.$message
      });
    },
    dropdownVisibleChange() {
      if (!this.VNFOptions.length) {
        this.getVNFOptions({
          SUTType: this.testSpecSingleData.sutTypeCH.code
        });
      }
    },
    codeConversion(value, selectOptions) {
      let code = null;
      selectOptions.map(item => {
        if (item.dictLabel === value) code = item.code;
      });
      return code;
    },
    handleCancel() {
      this.updateVisible(false);
    },
    checkboxGrouponChange(e) {
        this.changeCaseCheckAll(e.length === this.testCaseList.length);
    },
    onCheckAllChange(e) {
        this.changeCaseCheckAll(e.target.checked);
        let caseCheckedList = e.target.checked === false ?[]:this.testCaseList;
        this.updateCheckboxGroup({testCaseData:caseCheckedList});
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            name: values.Name,
            version: values.Version,
            sutType:
              values.SUTType === this.initSUTTypeValue && this.isEdit
                ? this.codeConversion(values.SUTType, this.SUTOptions)
                : values.SUTType,
            subSutType:
              values.subSutType === this.initVNFtypeValue && this.isEdit
                ? this.codeConversion(values.subSutType, this.VNFOptions)
                : values.subSutType,
            caseId: values.checkboxGroup || [],
            publishOrg: values.PublishORG
          };
          let { isEdit } = this;
          if (isEdit) data.id = this.testSpecSingleData.id;
          this.createOrEditTestSpec({
            isEdit,
            data
          }).then(
            () => {
              this.form.resetFields();
              this.getTestSpec({});
              this.updateVisible(false);
            },
            () => {
              this.updateVisible(false);
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.select {
  width: 40%;
  margin-right: 5%;
}
.form__checkboxtitle--size {
  text-indent: 1.2em;
  display: inline-block;
  vertical-align: top;
  font-weight: normal;
  span {
    color: #f5222d;
    margin-right: 4px;
    line-height: 1;
    font-size: 14px;
  }
}
.form__checkboxgroup--margin {
  width: 100%;
  display: inline-block;
  /*margin-bottom: 30px;*/
}
.form__card--padding {
  /*width: 80%;*/
  padding: 14px;
  text-indent: 1.5em;
  /*margin: 0 10%;*/
}
.form__checkbox--size {
  font-size: 20px;
  cursor: pointer;
}
</style>