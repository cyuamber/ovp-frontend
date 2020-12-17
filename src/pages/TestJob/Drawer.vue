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
        v-for="(item, i) in formList"
        :key="item"
        :label="item"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-input
          v-if="item === formList[0]"
          :disabled="isEdit"
          v-decorator="[
            keyList[i],
            {
              rules: [{ required: true, message: item + ' is required' }],
              initialValue: testJobSingleData.jobName,
            },
          ]"
        />
        <a-textarea
          v-if="item === formList[1]"
          v-decorator="[
            keyList[i],
            {
              rules: [{ required: true, message: item + ' is required' }],
              initialValue: testJobSingleData.remark,
            },
          ]"
          :auto-size="{ minRows: 3, maxRows: 10 }"
        />
        <a-select
          v-else-if="item === 'SUT Type'"
          v-decorator="[
            keyList[i],
            { rules: [{ required: true }], initialValue: initSUTType.name },
          ]"
          @select="(key) => selectSUTType(key)"
          class="form__select--width"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <a-select-option
            v-for="type in SUTTypeList"
            :key="type.code"
            :value="type.code"
            >{{ type.dictLabel }}</a-select-option
          >
        </a-select>
        <a-select
          v-else-if="item === 'SUT Name'"
          :disabled="!getSUTNames"
          class="form__select--width"
          v-decorator="[
            keyList[i],
            { rules: [{ required: true }], initialValue: initSUTName.name },
          ]"
          :title="!getSUTNames ? 'Please select SUT Type first' : ''"
          @select="(key) => selectSUTName(key)"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <a-select-option
            v-for="types in SUTNameList"
            :key="types.type + '+' + types.id"
            :value="types.type + '+' + types.id"
            >{{ types.name }}</a-select-option
          >
        </a-select>
        <a-select
          v-else-if="item === 'Test Specification'"
          :disabled="!getSpecifications"
          class="form__select--width"
          v-decorator="[
            keyList[i],
            {
              rules: [{ required: true }],
              initialValue: initSpecification.name,
            },
          ]"
          @select="(key) => selectSpecification(key)"
          :title="
            !getSUTNames
              ? 'Please select SUT Type and SUT Name first'
              : !getSpecifications
              ? 'Please select SUT Name first'
              : ''
          "
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <a-select-option
            v-for="type in specificationList"
            :key="type.id"
            :value="type.id"
            >{{ type.name }}</a-select-option
          >
        </a-select>
        <!-- Test VNFM/VIM  -->
        <a-select
          v-else-if="item === 'Test VNFM ENV'"
          v-decorator="[keyList[i], { initialValue: initTestVNFMENV.name }]"
          class="form__select--width"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <a-select-option
            v-for="type in VNFMOption"
            :key="type.id"
            :value="type.id"
            >{{ type.name }}</a-select-option
          >
        </a-select>
        <a-select
          v-else-if="item === 'Test VIM ENV'"
          v-decorator="[keyList[i], { initialValue: initTestVIMENV.name }]"
          class="form__select--width"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <a-select-option
            v-for="type in VIMOption"
            :key="type.id"
            :value="type.id"
            >{{ type.cloudOwner }}</a-select-option
          >
        </a-select>
        <a-select
          v-else-if="item === 'Test MANO ENV'"
          v-decorator="[keyList[i], { initialValue: initMANOENV.name }]"
          class="form__select--width"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <a-select-option
            v-for="type in MANOOption"
            :key="type.id"
            :value="type.id"
            >{{ type.name }}</a-select-option
          >
        </a-select>
        <a-select
          v-else-if="item === 'Test Instrument'"
          v-decorator="[keyList[i], { initialValue: initTestInstrument.name }]"
          class="form__select--width"
          mode="multiple"
          :showArrow="true"
          @change="onChangeTestInstrument"
          :getPopupContainer="
            (triggerNode) => {
              return triggerNode.parentNode || document.body;
            }
          "
        >
          <a-select-option
            v-for="type in TestInstrumentOption"
            :key="type.id"
            :value="type.id"
            >{{ type.name }}</a-select-option
          >
        </a-select>
        <!-- loading -->
        <a-spin :spinning="nameSpin" v-if="item === 'SUT Name'">
          <a-icon
            slot="indicator"
            type="loading-3-quarters"
            size="small"
            spin
          />
        </a-spin>
        <a-spin
          :spinning="specificationSpin"
          v-if="item === 'Test Specification'"
        >
          <a-icon
            slot="indicator"
            type="loading-3-quarters"
            size="small"
            spin
          />
        </a-spin>
      </a-form-item>
      <!-- Test Case -->
      <a-spin :spinning="testCaseSpin" tip="loading...">
        <div class="form__spin-content">
          <a-form-item v-if="testCaseList.length !== 0">
            <h3 class="form__checkboxtitle">
              <span>Test Case List:</span>
              <a-checkbox @change="onCheckAllChange" :checked="testCaseCheckAll"
                >Check all</a-checkbox
              >
            </h3>
            <a-checkbox-group
              class="form__checkboxgroup--margin"
              v-decorator="[
                'checkboxGroup',
                {
                  rules: [
                    {
                      required: true,
                      message: 'At least one test case to choose',
                    },
                  ],
                  initialValue: initcheckboxGroup,
                },
              ]"
              @change="onChange"
            >
              <a-list
                itemLayout="vertical"
                :pagination="caseListPagination"
                :dataSource="testCaseList"
                bordered
              >
                <a-list-item
                  slot="renderItem"
                  slot-scope="item"
                  :key="item.id"
                  class="form__card--padding"
                >
                  <a-checkbox
                    :value="item.id"
                    :checked="initcheckboxGroup.includes(item.id)"
                    class="form__checkbox--size"
                  />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ item.name }}
                  <a-tooltip placement="topLeft" :title="item.description">
                    <a-icon type="info-circle" class="form__info-cursor" />
                  </a-tooltip>
                  <a-icon
                    v-if="
                      initcheckboxGroup.includes(item.id) &&
                      cheangeTestInstrument.length > 0
                    "
                    type="unordered-list"
                    class="form__info-cursor"
                    @click="() => caseParamsEdit(item)"
                  />
                </a-list-item>
              </a-list>
            </a-checkbox-group>
            <CaseParams :isEdit="isEdit" />
          </a-form-item>
        </div>
      </a-spin>
    </a-form>
    <div class="footer">
      <a-button @click="onClose" size="large">Cancel</a-button>
      <a-button type="primary" size="large" @click="handleSubmit"
        >Submit</a-button
      >
    </div>
  </a-drawer>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { formList } from "./constants";
import CaseParams from "./CaseParams";
export default {
  props: ["isShow", "isEdit"],
  components: { CaseParams },
  data() {
    return {
      visible: this.isShow,
      title: "Create Test Job",
      formList,
      keyList: [],
      form: this.$form.createForm(this),
      selectedSUTType: "",
      selectedSUTNameId: "",
      selectedSUTNameType: "",
      selectedSUTNames: "",
      selectedSUTNameAdress: "",
      selectedSpecification: "",
      initSUTType: {
        name: null,
        code: null,
      },
      initSUTName: {
        name: null,
        code: null,
      },
      initSpecification: {
        name: null,
        code: null,
      },
      initTestVIMENV: {
        name: null,
        code: null,
      },
      initTestVNFMENV: {
        name: null,
        code: null,
      },
      initMANOENV: {
        name: null,
        code: null,
      },
      initTestInstrument: {
        name: [],
        code: [],
      },
      cheangeTestInstrument: [],
      count: 0,
      caseListPagination: {
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 5,
        size: "small",
        showLessItems: true,
      },
    };
  },
  computed: {
    ...mapState({
      SUTTypeList: (store) => store.testJob.SUTTypeList,
      SUTNameList: (store) => store.testJob.SUTNameList,
      VNFMOption: (store) => store.testJob.VNFMOption,
      VIMOption: (store) => store.testJob.VIMOption,
      MANOOption: (store) => store.testJob.MANOOption,
      TestInstrumentOption: (store) => store.testJob.TestInstrumentOption,
      nameSpin: (store) => store.testJob.nameSpin,
      getSUTNames: (store) => store.testJob.getSUTName,
      specificationSpin: (store) => store.testJob.specificationSpin,
      getSpecifications: (store) => store.testJob.getSpecification,
      specificationList: (store) => store.testJob.specificationList,
      testCaseSpin: (store) => store.testJob.testCaseSpin,
      testCaseList: (store) => store.testJob.testCaseList,
      testJobSingleData: (state) => state.testJob.testJobSingleData,
      testCaseCheckAll: (state) => state.testJob.testCaseCheckAll,
      initcheckboxGroup: (state) => state.testJob.initcheckboxGroup,
    }),
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
        this.selectedSUTNameId = "";
        this.selectedSUTNameAdress = "";
        this.selectedSpecification = "";
        this.cheangeTestInstrument = [];
        this.keyList.forEach((item) => {
          this.form.setFieldsValue({
            [item]: item !== "TestInstrument" ? "" : [],
          });
        });
      } else {
        this.count++;
      }
      if (this.isEdit) {
        this.title = "Edit Test Job";
      } else {
        this.title = "Create Test Job";
      }
    },
    testJobSingleData(val) {
      if (Object.keys(val).length > 0) {
        this.initSUTType = {
          name: this.testJobSingleData.sut.flagName,
          code: this.testJobSingleData.sut.flag,
        };
        this.initSUTName = {
          name: this.testJobSingleData.sut.name,
          code: this.testJobSingleData.sut.id,
        };
        this.initSpecification = {
          name: this.testJobSingleData.spec.name,
          code: this.testJobSingleData.spec.id,
        };
        this.initTestVIMENV = {
          name: this.testJobSingleData.vim
            ? this.testJobSingleData.vim.cloudOwner
            : "",
          code: this.testJobSingleData.vim ? this.testJobSingleData.vim.id : "",
        };
        this.initTestVNFMENV = {
          name: this.testJobSingleData.vnfm
            ? this.testJobSingleData.vnfm.name
            : "",
          code: this.testJobSingleData.vnfm
            ? this.testJobSingleData.vnfm.id
            : "",
        };
        this.initMANOENV = {
          name: this.testJobSingleData.mano
            ? this.testJobSingleData.mano.name
            : "",
          code: this.testJobSingleData.mano
            ? this.testJobSingleData.mano.id
            : "",
        };
        this.initTestInstrument = {
          name: this.testJobSingleData.suite
            ? this.testJobSingleData.suite.map((item) => {
                if (item.name && item.name !== null) {
                  return item.name;
                }
              })
            : [],
          code: this.testJobSingleData.suite
            ? this.testJobSingleData.suite.map((item) => {
                if (item.id && item.id !== null) {
                  return item.id;
                }
              })
            : [],
        };
        this.selectedSUTNames = this.testJobSingleData.sut.flagName;
        this.selectedSUTNameAdress = this.testJobSingleData.sut.address;
        this.cheangeTestInstrument = this.testJobSingleData.suite
          ? this.testJobSingleData.suite.map((item) => {
              if (item.id && item.id !== null && item.address) {
                return item.address;
              }
            })
          : [];
        // setTimeout()
        if (this.isEdit && this.count > 1) {
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
              : "",
            TestMANOENV: this.testJobSingleData.mano
              ? this.testJobSingleData.mano.name
              : "",
            TestInstrument: this.testJobSingleData.suite
              ? this.testJobSingleData.suite.map((item) => {
                  return item.id;
                })
              : [],
          });
        }
      }
    },
  },
  created() {
    this.keyList = this.formList.map((item) => {
      item = item.replace(" ", "").replace(" ", "");
      return item;
    });
  },
  mounted() {},
  methods: {
    ...mapActions("testJob", [
      "createrTestJobMGT",
      "getSUTName",
      "getSpecification",
      "getTestCase",
      "getEditTestJob",
    ]),
    ...mapMutations("testJob", [
      "clean",
      "setIsShow",
      "updateInitcheckboxGroup",
      "setCaseParamsIsShow",
      "updateCaseParamsData",
      "changeCaseCheckAll",
    ]),
    onClose() {
      this.visible = false;
      this.setIsShow(false);
    },
    onCheckAllChange(e) {
      this.changeCaseCheckAll(e.target.checked);
      let caseCheckedList = !e.target.checked
        ? []
        : this.testCaseList.map((item) => {
            return item.id;
          });
      console.log(caseCheckedList);
      this.updateInitcheckboxGroup(caseCheckedList);
    },
    handleSubmit() {
      this.form.validateFields((error, values) => {
        if (!error) {
          let { isEdit } = this;
          if (isEdit) {
            console.log(values, this.initTestInstrument, "-----values");
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
            values.TestMANOENV =
              values.TestMANOENV === this.initMANOENV.name
                ? this.initMANOENV.code
                : values.TestMANOENV;
            values.TestInstrument =
              values.TestInstrument === this.initTestInstrument.name
                ? this.initTestInstrument.code
                : values.TestInstrument;
          }
          let caseReqs = [];
          if (this.initcheckboxGroup.length > 0) {
            this.testCaseList.map((item) => {
              // console.log(item, "=========>item");
              if (+item.subSutType === 101009) {
                item.parameters.map((param) => {
                  if (param.name === "instrument") {
                    param.address = this.selectedSUTNameAdress; // 如果是海鸥将其放到参数中返回给后端
                  }
                });
              }
            });
            if (!isEdit) {
              this.testCaseList.forEach((item) => {
                if (this.initcheckboxGroup.includes(item.id)) {
                  caseReqs.push({
                    caseId: item.id.toString(),
                    parameters: item.parameters,
                  });
                }
              });
            } else {
              this.testJobSingleData.cases.map((item) => {
                if (this.initcheckboxGroup.includes(item.id)) {
                  let index = this.initcheckboxGroup.indexOf(item.id);
                  caseReqs.push({
                    caseId: item.id.toString(),
                    parameters: item.parameters,
                  });
                  this.initcheckboxGroup.splice(index, 1);
                }
              });
              this.testCaseList.forEach((item) => {
                if (this.initcheckboxGroup.includes(item.id)) {
                  caseReqs.push({
                    caseId: item.id.toString(),
                    parameters: item.parameters,
                  });
                }
              });
            }
          }
          this.createrTestJobMGT({
            isEdit,
            values,
            caseReqs,
            message: this.$message,
          });
          this.visible = false;
          this.setIsShow(false);
        }
      });
    },
    selectSUTType(key) {
      if (key === this.selectedSUTType) return;
      this.selectedSUTType = key;
      this.selectedSUTNameId = "";
      this.selectedSpecification = "";
      this.getSUTName({
        SUTType: key,
        message: this.$message,
      });
      this.form.setFieldsValue({ SUTName: "", TestSpecification: "" });
      this.selectedSUTNames = this.SUTTypeList.find((item) => {
        return item.code === key;
      }).dictLabel;
    },
    selectSUTName(key) {
      // if (key === this.selectedSUTName) return;
      this.selectedSUTNameId = key.split("+")[1];
      this.selectedSUTNameType = Number(key.split("+")[0]);
      this.selectedSpecification = "";
      this.getSpecification({
        SUTName: key.split("+")[0],
        message: this.$message,
      });
      this.form.setFieldsValue({ TestSpecification: "" });
      this.selectedSUTNameAdress = this.SUTNameList.find((item) => {
        return Number(item.type) === Number(key.split("+")[0]);
      }).address;
    },
    selectSpecification(key) {
      if (key === this.selectedSpecification) return;
      this.selectedSpecification = key;
      let obj = {
        specId: key,
        sutId: this.selectedSUTNameId,
      };
      this.getTestCase({
        obj,
        message: this.$message,
      });
    },
    onChange(e) {
      console.log("hello", e);
      this.updateInitcheckboxGroup(e);
      this.changeCaseCheckAll(e.length === this.testCaseList.length);
      if (
        this.selectedSUTNames === "DRA" &&
        this.cheangeTestInstrument.length > 0
      ) {
        this.testCaseList.map((item) => {
          if (e.indexOf(item.id) > -1) {
            item.parameters.map((items) => {
              if (items.name === "vm_ips") {
                items.defaultValue = this.cheangeTestInstrument.join(";");
                items.value = this.cheangeTestInstrument.join(";");
              }
            });
          }
        });
        console.log(this.testCaseList, "-----this.testCaseList");
      }
    },
    caseParamsEdit(caseData) {
      if (this.isEdit) {
        this.testJobSingleData.cases.map((item) => {
          if (item.id === caseData.id) {
            caseData.parameters = [].concat(item.parameters);
          }
        });
      }
      let hasvisible =
        caseData.parameters && caseData.parameters.length > 0
          ? caseData.parameters.map((item) => {
              return item.visible;
            })
          : [];
      if (hasvisible.indexOf(true) < 0) {
        this.$message.info("This testCase has no editable parameters.");
        return false;
      }
      this.cheangeTestInstrument = this.TestInstrumentOption.map((item) => {
        if (this.form.getFieldValue("TestInstrument").indexOf(item.id) > -1) {
          return item.address;
        }
      });
      if (this.cheangeTestInstrument.length > 0) {
        this.cheangeTestInstrument = this.cheangeTestInstrument.filter(
          (item) => {
            return item !== undefined;
          }
        );
      }
      if (
        this.selectedSUTNameType === 101009 &&
        this.cheangeTestInstrument.length > 0
      ) {
        console.log(caseData, "----caseData");
        if (caseData.parameters.length > 0) {
          this.cheangeTestInstrument.map((itm, index) => {
            caseData.parameters.map((items) => {
              if (items.name === "caps") {
                if (
                  items.defaultValue === "" ||
                  items.value === "" ||
                  items.defaultValue.split(";").length <
                    this.cheangeTestInstrument.length ||
                  items.value.split(";").length <
                    this.cheangeTestInstrument.length
                ) {
                  items.defaultValue = items.defaultValue + ";";
                  items.value = items.value + ";";
                } else if (
                  ((items.defaultValue !== "" || items.value !== "") &&
                    items.defaultValue.split(";").length >
                      this.cheangeTestInstrument.length) ||
                  items.value.split(";").length >
                    this.cheangeTestInstrument.length
                ) {
                  items.defaultValue = items.defaultValue
                    .split(";")
                    .slice(0, this.cheangeTestInstrument.length)
                    .join(";");
                  items.value = items.value
                    .split(";")
                    .slice(0, this.cheangeTestInstrument.length)
                    .join(";");
                }
              }
              if (items.name === "vm_ips") {
                if (
                  items.defaultValue === "" ||
                  items.value === "" ||
                  items.defaultValue.split(";").length <
                    this.cheangeTestInstrument.length ||
                  items.value.split(";").length <
                    this.cheangeTestInstrument.length
                ) {
                  items.defaultValue = this.cheangeTestInstrument.join(";");
                  items.value = this.cheangeTestInstrument.join(";");
                } else if (
                  ((items.defaultValue !== "" || items.value !== "") &&
                    items.defaultValue.split(";").length >
                      this.cheangeTestInstrument.length) ||
                  items.value.split(";").length >
                    this.cheangeTestInstrument.length
                ) {
                  items.defaultValue = items.defaultValue
                    .split(";")
                    .slice(0, this.cheangeTestInstrument.length)
                    .join(";");
                  items.value = items.value
                    .split(";")
                    .slice(0, this.cheangeTestInstrument.length)
                    .join(";");
                }
              }
            });
          });
          caseData.parameters.map((items) => {
            if (
              (items.name === "caps" || items.name === "vm_ips") &&
              (items.defaultValue.split(";").length >
                this.cheangeTestInstrument.length ||
                items.value.split(";").length >
                  this.cheangeTestInstrument.length)
            ) {
              items.defaultValue =
                items.defaultValue.charAt(items.defaultValue.length - 1) === ";"
                  ? items.defaultValue.substring(
                      0,
                      items.defaultValue.length - 1
                    )
                  : items.defaultValue;
              items.value =
                items.value.charAt(items.value.length - 1) === ";"
                  ? items.value.substring(0, items.value.length - 1)
                  : items.value;
            }
          });
        }
      } else if (
        this.selectedSUTNameType === 101009 &&
        this.cheangeTestInstrument.length === 0
      ) {
        caseData.parameters.map((items) => {
          if (
            items.name === "vm_ips" ||
            items.name === "caps" ||
            items.name === "test_times"
          ) {
            items.defaultValue = "";
            items.value = "";
          }
        });
      }
      this.updateCaseParamsData(caseData);
      this.setCaseParamsIsShow(true);
    },
    onChangeTestInstrument(value) {
      this.cheangeTestInstrument = this.TestInstrumentOption.map((item) => {
        if (value.indexOf(item.id) > -1) {
          return item.address;
        }
      });
      if (this.cheangeTestInstrument.length > 0) {
        this.cheangeTestInstrument = this.cheangeTestInstrument.filter(
          (item) => {
            return item !== undefined;
          }
        );
      }
    },
  },
};
</script>

<style lang="less" scope>
.ant-drawer-body {
  padding-left: 40px;
}
// .ant-select-dropdown{
//   top:67px!important
// }
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
    /*width: 100%;*/
    padding: 14px;
    text-indent: 0.5em;
    .form__info-cursor {
      cursor: pointer;
      margin-right: 10px;
    }
  }
  .form__checkboxtitle > span {
    margin-right: 15px;
  }
  .form__checkboxgroup--margin {
    width: 100%;
    margin-bottom: 50px;
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

