<template>
  <a-drawer
    :title="title"
    :width="580"
    @close="onClose"
    :visible="visible"
    :closable="false"
    class="drawer"
  >
    <a-form :form="form" class="form">
      <a-form-item
        v-for="(item,i) in formList"
        :key="item"
        :label="item"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-input
          v-if="item === formList[0]"
          :disabled="isEdit"
          v-decorator="[keyList[i],{ rules: [{ required: true, message: item +' is required'}],initialValue:testJobSingleData.jobName}]"
        />
        <a-textarea
          v-if="item === formList[1]"
          v-decorator="[keyList[i],{ rules: [{ required: true, message: item +' is required'}],initialValue:testJobSingleData.remark}]"
          :autosize="{minRows: 3}"
        />
        <a-select
          v-else-if="item === 'SUT Type'"
          v-decorator="[keyList[i],{ rules: [{ required: true, }],initialValue:initSUTType.name}]"
          @select="((key) => selectSUTType(key))"
          class="form__select--width"
        >
          <a-select-option
            v-for="type in SUTTypeList"
            :key="type.code"
            :value="type.code"
          >{{type.dictLabel}}</a-select-option>
        </a-select>
        <a-select
          v-else-if="item === 'SUT Name'"
          :disabled="!getSUTNames"
          class="form__select--width"
          v-decorator="[keyList[i],{ rules: [{ required: true }],initialValue:initSUTName.name}]"
          :title="!getSUTNames ? 'Please select SUT Type first' : ''"
          @select="((key) => selectSUTName(key))"
        >
          <a-select-option
            v-for="types in SUTNameList"
            :key="types.type+'+'+types.id"
            :value="types.type+'+'+types.id"
          >{{types.name}}</a-select-option>
        </a-select>
        <a-select
          v-else-if="item === 'Test Specification'"
          :disabled="!getSpecifications"
          class="form__select--width"
          v-decorator="[keyList[i],{ rules: [{ required: true }],initialValue:initSpecification.name}]"
          @select="((key)=> selectSpecification(key))"
          :title="!getSUTNames ? 'Please select SUT Type and SUT Name first' : (!getSpecifications ? 'Please select SUT Name first': '')"
        >
          <a-select-option
            v-for="type in specificationList"
            :key="type.id"
            :value="type.id"
          >{{type.name}}</a-select-option>
        </a-select>
        <!-- Test VNFM/VIM  -->
        <a-select
          v-else-if="item === 'Test VNFM ENV'"
          v-decorator="[keyList[i],{initialValue:initTestVNFMENV.name}]"
          class="form__select--width"
        >
          <a-select-option v-for="type in VNFMOption" :key="type.id" :value="type.id">{{type.name}}</a-select-option>
        </a-select>
        <a-select
          v-else-if="item === 'Test VIM ENV'"
          v-decorator="[keyList[i],{initialValue:initTestVIMENV.name}]"
          class="form__select--width"
        >
          <a-select-option
            v-for="type in VIMOption"
            :key="type.id"
            :value="type.id"
          >{{type.cloudOwner}}</a-select-option>
        </a-select>
        <!-- loading -->
        <a-spin :spinning="nameSpin" v-if="item === 'SUT Name'">
          <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
        </a-spin>
        <a-spin :spinning="specificationSpin" v-if="item === 'Test Specification'">
          <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
        </a-spin>
      </a-form-item>
      <!-- Test Case -->
      <a-spin :spinning="testCaseSpin" tip="loading...">
        <div class="form__spin-content">
          <a-form-item v-if="testCaseList.length !== 0">
            <h3>Test Case List:</h3>
            <a-checkbox-group
              class="form__checkboxgroup--margin"
              v-decorator="['checkboxGroup', { rules: [{ required: true, message: 'At least one test case to choose'}],initialValue:initcheckboxGroup}]"
              @change="onChange"
            >
              <a-card-grid v-for="item in testCaseList" :key="item.id " class="form__card--padding">
                <a-checkbox
                  :value="item.id"
                  :checked="initcheckboxGroup.includes(item.id)"
                  class="form__checkbox--size"
                />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.name}}
                <a-tooltip placement="topLeft" :title="item.description">
                  <a-icon type="info-circle" class="form__info-cursor" />
                </a-tooltip>
              </a-card-grid>
            </a-checkbox-group>
          </a-form-item>
        </div>
      </a-spin>
    </a-form>
    <div class="footer">
      <a-button @click="onClose" size="large">Cancel</a-button>
      <a-button type="primary" size="large" @click="handleSubmit">Submit</a-button>
    </div>
  </a-drawer>
</template>

<script type="text/ecmascript-6">
import { mapState, mapActions, mapMutations } from "vuex";
import { formList } from "./constants";

export default {
  props: ["isShow", "isEdit"],
  data() {
    return {
      visible: this.isShow,
      title: "Create Test Job",
      formList,
      keyList: [],
      form: this.$form.createForm(this),
      selectedSUTType: "",
      selectedSUTName: "",
      selectedSpecification: "",
      initSUTType: {
        name: null,
        code: null
      },
      initSUTName: {
        name: null,
        code: null
      },
      initSpecification: {
        name: null,
        code: null
      },
      initTestVIMENV: {
        name: null,
        code: null
      },
      initTestVNFMENV: {
        name: null,
        code: null
      },
      count: 0
    };
  },
  computed: {
    ...mapState({
      SUTTypeList: store => store.testJob.SUTTypeList,
      SUTNameList: store => store.testJob.SUTNameList,
      VNFMOption: store => store.testJob.VNFMOption,
      VIMOption: store => store.testJob.VIMOption,
      nameSpin: store => store.testJob.nameSpin,
      getSUTNames: store => store.testJob.getSUTName,
      specificationSpin: store => store.testJob.specificationSpin,
      getSpecifications: store => store.testJob.getSpecification,
      specificationList: store => store.testJob.specificationList,
      testCaseSpin: store => store.testJob.testCaseSpin,
      testCaseList: store => store.testJob.testCaseList,
      testJobSingleData: state => state.testJob.testJobSingleData,
      initcheckboxGroup: state => state.testJob.initcheckboxGroup
    })
  },
  watch: {
    isShow(val) {
      if (val) {
        this.visible = this.isShow;
      }
    },
    visible(val) {
      if (!val) {
        this.clean();
        this.selectedSUTType = "";
        this.selectedSUTName = "";
        this.selectedSpecification = "";
        this.keyList.forEach(item => {
          this.form.setFieldsValue({ [item]: "" });
        });
        console.log(
          this.testJobSingleData,
          "visible----this.testJobSingleData"
        );
      } else {
        console.log(this.count, "this.count++");
        this.count++;
      }
      if (this.isEdit) {
        this.title = "Edit Test Job";
      } else {
        this.title = "Create Test Job";
      }
    },
    testJobSingleData(val) {
      console.log(this.count, "this.count---testJobSingleData");
      if (Object.keys(val).length > 0) {
        console.log(this.testJobSingleData, "val---testJobSingleData");
        this.initSUTType = {
          name: this.testJobSingleData.sut.flagName,
          code: this.testJobSingleData.sut.flag
        };
        this.initSUTName = {
          name: this.testJobSingleData.sut.name,
          code: this.testJobSingleData.sut.id
        };
        this.initSpecification = {
          name: this.testJobSingleData.spec.name,
          code: this.testJobSingleData.spec.id
        };
        this.initTestVIMENV = {
          name: this.testJobSingleData.vim
            ? this.testJobSingleData.vim.cloudOwner
            : "",
          code: this.testJobSingleData.vim ? this.testJobSingleData.vim.id : ""
        };
        this.initTestVNFMENV = {
          name: this.testJobSingleData.vnfm
            ? this.testJobSingleData.vnfm.name
            : "",
          code: this.testJobSingleData.vnfm
            ? this.testJobSingleData.vnfm.id
            : ""
        };
        // setTimeout()
        if (this.isEdit && this.count > 1) {
          console.log(
            this.testJobSingleData,
            "vibiliti---this.testJobSingleData"
          );
          this.form.setFieldsValue({
            JobName: this.testJobSingleData.jobName,
            JobDescription: this.testJobSingleData.remark,
            SUTType: this.testJobSingleData.sut.flagName,
            SUTName: this.testJobSingleData.sut.name,
            TestSpecification: this.testJobSingleData.spec.name,
            TestVIMENV: this.testJobSingleData.vim
              ? this.testJobSingleData.vim.cloudOwner
              : "",
            TestVNFMENV: this.testJobSingleData.vnfm
              ? this.testJobSingleData.vnfm.name
              : ""
          });
        }
      }
    }
    // initcheckboxGroup(val){
    //     if(val.length>0 && this.isEdit && this.count > 1){
    //         console.log(val,"val--initcheckboxGroup")
    //         this.form.setFieldsValue({
    //             checkboxGroup:val
    //         });
    //     }
    // }
  },
  created() {
    this.keyList = this.formList.map(item => {
      item = item.replace(" ", "").replace(" ", "");
      return item;
    });
    // console.log(this.isShow, "this.isShow----created");
  },
  mounted() {
    // console.log(this.isShow, "this.isShow----mounted");
  },
  methods: {
    ...mapActions("testJob", [
      "createrTestJobMGT",
      "getSUTName",
      "getSpecification",
      "getTestCase",
      "getEditTestJob"
    ]),
    ...mapMutations("testJob", ["clean", "setIsShow"]),
    onClose() {
      this.visible = false;
      this.setIsShow(false);
    },
    handleSubmit() {
      this.form.validateFields((error, values) => {
        if (!error) {
          let { isEdit } = this;
          if (isEdit) {
            values.SUTName =
              values.SUTName === this.initSUTName.name
                ? this.initSUTName.name + "+" + this.initSUTName.code
                : values.SUTName;
            values.TestSpecification =
              values.TestSpecification === this.initSpecification.name
                ? this.initSpecification.code
                : values.TestSpecification;
            values.TestVIMENV =
              values.TestVIMENV === this.initTestVIMENV.name
                ? this.initTestVIMENV.code
                : values.TestVIMENV;
            values.TestVNFMENV =
              values.TestVNFMENV === this.initTestVNFMENV.name
                ? this.initTestVNFMENV.code
                : values.TestVNFMENV;
          }
          this.createrTestJobMGT({ isEdit, values });
          this.visible = false;
        }
      });
    },
    selectSUTType(key) {
      if (key === this.selectedSUTType) return;
      this.selectedSUTName = "";
      this.selectedSpecification = "";
      this.getSUTName({
        SUTType: key,
        message: this.$message
      });
      this.form.setFieldsValue({ SUTName: "", TestSpecification: "" });
    },
    selectSUTName(key) {
      // if (key === this.selectedSUTName) return;
      this.selectedSUTName = key.split("+")[1];
      this.selectedSpecification = "";
      this.getSpecification({
        SUTName: key.split("+")[0],
        message: this.$message
      });
      this.form.setFieldsValue({ TestSpecification: "" });
    },
    selectSpecification(key) {
      if (key === this.selectedSpecification) return;
      this.selectedSpecification = key;
      this.getTestCase({
        TestSpecification: key,
        message: this.$message
      });
    },
    onChange(e) {
      console.log(e.target, e);
    }
  }
};
</script>

<style lang="less" scope>
.ant-drawer-body {
  padding-left: 40px;
}
.form {
  .ant-form-item-label {
    text-align: left;
  }
  .form__select--width {
    width: 55%;
    margin-right: 10%;
  }
  .form__checkbox--size {
    font-size: 20px;
    cursor: pointer;
  }
  .form__spin-content {
    width: 100%;
    height: 80px;
  }
  .form__card--padding {
    width: 100%;
    padding: 14px;
    text-indent: 0.5em;
    .form__info-cursor {
      cursor: pointer;
    }
  }
  .form__checkboxgroup--margin {
    width: 100%;
    margin-bottom: 30px;
  }
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  .ant-btn {
    width: 50%;
    border-radius: 0;
    height: 50px !important;
    line-height: 50px !important;
  }
}
</style>

