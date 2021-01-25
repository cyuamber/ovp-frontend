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
              initialValue: testJobSingleData.jobName
            }
          ]"
        />
        <a-textarea
          v-if="item === formList[1]"
          v-decorator="[
            keyList[i],
            {
              rules: [{ required: true, message: item + ' is required' }],
              initialValue: testJobSingleData.remark
            }
          ]"
          :auto-size="{ minRows: 3, maxRows: 10 }"
        />
        <a-select
          v-else-if="item === 'SUT Type'"
          v-decorator="[
            keyList[i],
            { rules: [{ required: true }], initialValue: initSUTType.name }
          ]"
          @select="key => selectSUTType(key)"
          class="form__select--width"
          :getPopupContainer="
            triggerNode => {
              return triggerNode.parentNode || document.body
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
            { rules: [{ required: true }], initialValue: initSUTName.name }
          ]"
          :title="!getSUTNames ? 'Please select SUT Type first' : ''"
          @select="key => selectSUTName(key)"
          :getPopupContainer="
            triggerNode => {
              return triggerNode.parentNode || document.body
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
              initialValue: initSpecification.name
            }
          ]"
          @select="key => selectSpecification(key)"
          :title="
            !getSUTNames
              ? 'Please select SUT Type and SUT Name first'
              : !getSpecifications
              ? 'Please select SUT Name first'
              : ''
          "
          :getPopupContainer="
            triggerNode => {
              return triggerNode.parentNode || document.body
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
            triggerNode => {
              return triggerNode.parentNode || document.body
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
            triggerNode => {
              return triggerNode.parentNode || document.body
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
            triggerNode => {
              return triggerNode.parentNode || document.body
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
          v-decorator="[keyList[i], { initialValue: initTestInstrument.code }]"
          class="form__select--width"
          mode="multiple"
          :showArrow="true"
          style="width: 200px"
          @change="onChangeTestInstrument"
          :getPopupContainer="
            triggerNode => {
              return triggerNode.parentNode || document.body
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
                      message: 'At least one test case to choose'
                    }
                  ],
                  initialValue: initcheckboxGroup
                }
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
            <CaseTableParams
              :isEdit="isEdit"
              @updateSingleCase="updateSingleCase"
              v-if="
                selectedSUTNameType === 101009 &&
                  cheangeTestInstrument.length > 0
              "
            />
            <CaseParams
              :isEdit="isEdit"
              @updateSingleCase="updateSingleCase"
              v-if="selectedSUTNameType !== 101009"
            />
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
import { mapState, mapActions, mapMutations } from 'vuex'
import { formList } from './constants'
import CaseTableParams from './CaseTableParams'
import CaseParams from './CaseParams'
export default {
  props: ['isShow', 'isEdit'],
  components: { CaseTableParams, CaseParams },
  data() {
    return {
      visible: this.isShow,
      title: 'Create Test Job',
      formList,
      keyList: [],
      form: this.$form.createForm(this),
      selectedSUTType: '',
      selectedSUTNameId: '',
      selectedSUTNameType: '',
      selectedSUTNames: '',
      selectedSUTNameAdress: '',
      selectedSpecification: '',
      oldInstrumentList: [],
      testCaseStash: [], // test cases列表的初始值暂存
      deleteItemIndex: [],
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
      initMANOENV: {
        name: null,
        code: null
      },
      initTestInstrument: {
        name: [],
        code: []
      },
      cheangeTestInstrument: [],
      count: 0,
      caseListPagination: {
        onChange: page => {
          console.log(page)
        },
        pageSize: 5,
        size: 'small',
        showLessItems: true
      }
    }
  },
  computed: {
    ...mapState({
      SUTTypeList: store => store.testJob.SUTTypeList,
      SUTNameList: store => store.testJob.SUTNameList,
      VNFMOption: store => store.testJob.VNFMOption,
      VIMOption: store => store.testJob.VIMOption,
      MANOOption: store => store.testJob.MANOOption,
      TestInstrumentOption: store => store.testJob.TestInstrumentOption,
      nameSpin: store => store.testJob.nameSpin,
      getSUTNames: store => store.testJob.getSUTName,
      specificationSpin: store => store.testJob.specificationSpin,
      getSpecifications: store => store.testJob.getSpecification,
      specificationList: store => store.testJob.specificationList,
      testCaseSpin: store => store.testJob.testCaseSpin,
      testCaseList: store => store.testJob.testCaseList,
      testJobSingleData: state => state.testJob.testJobSingleData,
      testCaseCheckAll: state => state.testJob.testCaseCheckAll,
      initcheckboxGroup: state => state.testJob.initcheckboxGroup
    })
  },
  watch: {
    cheangeTestInstrument(val, oldVal) {
      if (val.length < oldVal.length) {
        // 只要是删除过的都记录下来
        for (let i = 0; i < oldVal.length; i++) {
          if (val.indexOf(oldVal[i]) === -1) {
            // 不存在
            this.deleteItemIndex.push(i)
          }
        }
      }
    },
    isShow(val) {
      if (val) {
        this.visible = this.isShow
      }
    },
    visible(val) {
      if (!val) {
        // 关闭的时候
        this.clean()
        this.selectedSUTType = ''
        this.selectedSUTNameId = ''
        this.selectedSUTNameAdress = ''
        this.selectedSpecification = ''
        this.cheangeTestInstrument = []
        this.keyList.forEach(item => {
          this.form.setFieldsValue({
            [item]: item !== 'TestInstrument' ? '' : []
          })
        })
      } else {
        // 打开的时候
        this.count++
        this.deleteItemIndex = [] // 一打开得清空删除表，否则就保留了上次关闭modal时候清空instrument选项框时候的删除表
      }
      if (this.isEdit) {
        this.title = 'Edit Test Job'
      } else {
        this.title = 'Create Test Job'
      }
    },
    testJobSingleData(val) {
      this.testCaseStash = val.cases // 用来暂存cases初始信息的，此处获得初始cases
      // 初始值
      if (Object.keys(val).length > 0) {
        this.selectedSUTNameType = val.spec.subSutType
        this.initSUTType = {
          name: this.testJobSingleData.sut.flagName,
          code: this.testJobSingleData.sut.flag
        }
        // 根据初始的suttype获取sutname列表, 根据出事sutname找到其在列表中对应的address
        this.getSUTName({
          SUTType: this.initSUTType.code,
          message: this.$message
        })
        this.initSUTName = {
          name: this.testJobSingleData.sut.name,
          code: this.testJobSingleData.sut.id
        }
        this.initSpecification = {
          name: this.testJobSingleData.spec.name,
          code: this.testJobSingleData.spec.id
        }
        this.initTestVIMENV = {
          name: this.testJobSingleData.vim
            ? this.testJobSingleData.vim.cloudOwner
            : '',
          code: this.testJobSingleData.vim ? this.testJobSingleData.vim.id : ''
        }
        this.initTestVNFMENV = {
          name: this.testJobSingleData.vnfm
            ? this.testJobSingleData.vnfm.name
            : '',
          code: this.testJobSingleData.vnfm
            ? this.testJobSingleData.vnfm.id
            : ''
        }
        this.initMANOENV = {
          name: this.testJobSingleData.mano
            ? this.testJobSingleData.mano.name
            : '',
          code: this.testJobSingleData.mano
            ? this.testJobSingleData.mano.id
            : ''
        }
        this.initTestInstrument = {
          name: this.testJobSingleData.suites
            ? this.testJobSingleData.suites.map(item => {
                if (item.name && item.name !== null) {
                  return item.name
                }
              })
            : [],
          code: this.testJobSingleData.suites
            ? this.testJobSingleData.suites.map(item => {
                if (item.id && item.id !== null) {
                  return item.id
                }
              })
            : []
        }
        if (this.testJobSingleData.cases.length > 0) {
          // 这里如果cases中有一个instrument-ids，就将其换为instrument-ids
          let idItem = this.testJobSingleData.cases[0].parameters.find(item => {
            return item.name === 'instrument-ids'
          })
          if (typeof idItem !== 'undefined') {
            if (idItem.value === null) {
              idItem.value = ''
            }
            this.initTestInstrument.code = idItem.value.split(';')
          }
        }
        this.selectedSUTNames = this.testJobSingleData.sut.flagName
        this.selectedSUTNameAdress = this.testJobSingleData.sut.address
        // 最开始选择的testInstrument组合
        this.cheangeTestInstrument = this.initTestInstrument.code
        // this.oldInstrumentList = JSON.parse(JSON.stringify(this.initTestInstrument.code))
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
              : '',
            TestVNFMENV: this.testJobSingleData.vnfm
              ? this.testJobSingleData.vnfm.name
              : '',
            TestMANOENV: this.testJobSingleData.mano
              ? this.testJobSingleData.mano.name
              : '',
            TestInstrument: this.initTestInstrument.code
              ? this.initTestInstrument.code
              : []
          })
        }
      }
    }
  },
  created() {
    this.keyList = this.formList.map(item => {
      item = item.replace(' ', '').replace(' ', '')
      return item
    })
  },
  mounted() {},
  methods: {
    ...mapActions('testJob', [
      'createrTestJobMGT',
      'getSUTName',
      'getSpecification',
      'getTestCase',
      'getEditTestJob'
    ]),
    ...mapMutations('testJob', [
      'clean',
      'setIsShow',
      'updateInitcheckboxGroup',
      'setCaseParamsIsShow',
      'updateCaseParamsData',
      'changeCaseCheckAll'
    ]),
    updateSingleCase(id) {
      if (this.isEdit) {
        this.testCaseStash = this.testCaseStash.filter(item => {
          return item.id !== id
        })
      }
      // 关闭子弹框后删除该项初始值
      this.deleteItemIndex = []
    },
    onClose() {
      this.visible = false
      this.setIsShow(false)
    },
    onCheckAllChange(e) {
      // 全选
      this.changeCaseCheckAll(e.target.checked)
      let caseCheckedList = !e.target.checked
        ? []
        : this.testCaseList.map(item => {
            return item.id
          }) // 选了全部后
      this.updateInitcheckboxGroup(caseCheckedList)
      this.form.setFieldsValue({ checkboxGroup: caseCheckedList })
    },
    handleSubmit() {
      this.form.validateFields((error, values) => {
        if (!error) {
          let { isEdit } = this
          if (isEdit) {
            values.SUTName =
              values.SUTName === this.initSUTName.name
                ? this.initSUTName.name + '+' + this.initSUTName.code
                : values.SUTName
            values.TestSpecification =
              values.TestSpecification === this.initSpecification.name
                ? this.initSpecification.code
                : values.TestSpecification
            values.TestVIMENV =
              values.TestVIMENV === this.initTestVIMENV.name
                ? this.initTestVIMENV.code
                : values.TestVIMENV
            values.TestVNFMENV =
              values.TestVNFMENV === this.initTestVNFMENV.name
                ? this.initTestVNFMENV.code
                : values.TestVNFMENV
            values.TestMANOENV =
              values.TestMANOENV === this.initMANOENV.name
                ? this.initMANOENV.code
                : values.TestMANOENV
            values.TestInstrument =
              values.TestInstrument === this.initTestInstrument.name
                ? this.initTestInstrument.code
                : values.TestInstrument
          }
          let caseReqs = []
          if (this.initcheckboxGroup.length > 0) {
            this.testCaseList.forEach(item => {
              if (this.initcheckboxGroup.includes(item.id)) {
                caseReqs.push({
                  caseId: item.id.toString(),
                  parameters: item.parameters
                })
              }
            })
          }
          // console.log(values)
          this.createrTestJobMGT({
            isEdit,
            values,
            caseReqs,
            message: this.$message
          })
          this.visible = false
          this.setIsShow(false)
        }
      })
    },
    selectSUTType(key) {
      if (key === this.selectedSUTType) return
      this.selectedSUTType = key
      this.selectedSUTNameId = ''
      this.selectedSpecification = ''
      this.getSUTName({
        SUTType: key,
        message: this.$message
      })
      this.form.setFieldsValue({ SUTName: '', TestSpecification: '' })
      this.selectedSUTNames = this.SUTTypeList.find(item => {
        return item.code === key
      }).dictLabel
    },
    selectSUTName(key) {
      // if (key === this.selectedSUTName) return;
      this.selectedSUTNameId = key.split('+')[1]
      // 选择了才有，如果没选用默认值
      this.selectedSUTNameType = Number(key.split('+')[0])
      this.selectedSpecification = ''
      this.getSpecification({
        SUTName: key.split('+')[0],
        message: this.$message
      })
      this.form.setFieldsValue({ TestSpecification: '' })
      // 选择了才有，如果没选用默认值
      // this.selectedSUTNameAdress = this.SUTNameList.find((item) => {
      //   return Number(item.type) === Number(key.split("+")[0]);
      // }).address;
    },
    selectSpecification(key) {
      if (key === this.selectedSpecification) return
      this.selectedSpecification = key
      let obj = {
        specId: key,
        sutId: this.selectedSUTNameId
      }
      this.getTestCase({
        obj,
        message: this.$message
      })
    },
    onChange(e) {
      // 改变checkbox时
      this.updateInitcheckboxGroup(e)
      this.changeCaseCheckAll(e.length === this.testCaseList.length) // boolean值
    },
    caseParamsEdit(caseData) {
      // console.log(caseData)
      // 初始值源于打开modal的第一个数字请求 data.cases.parameters
      // console.log(JSON.parse(JSON.stringify(this.oldInstrumentList)), JSON.parse(JSON.stringify(this.cheangeTestInstrument)))
      // if (this.cheangeTestInstrument.length < this.oldInstrumentList.length) { // 如果删除了
      //   this.deleteItemIndex = []
      //   for (let i = 0; i < this.oldInstrumentList.length; i++) {
      //     if (this.cheangeTestInstrument.indexOf(this.oldInstrumentList[i]) === -1) { // 不存在
      //       this.deleteItemIndex.push(i) // 删除的项目
      //     }
      //   }
      // } else {
      //   this.deleteItemIndex = []
      // }
      // this.oldInstrumentList = JSON.parse(JSON.stringify(this.cheangeTestInstrument)) // 重新给新的旧值
      if (this.isEdit) {
        this.testCaseStash.map(item => {
          if (item.id === caseData.id) {
            // 有初始值的case提取出来，只有第一次打开testCaseStash有该项的值，关闭时就删掉。后面打开不用初始值
            caseData.parameters = JSON.parse(JSON.stringify(item.parameters))
          }
        })
      }
      // 根据sutnametype获得地址, 直接覆盖
      if (this.selectedSUTNameType) {
        let list = this.SUTNameList.find(item => {
          return Number(item.type) === Number(this.selectedSUTNameType)
        })
        this.selectedSUTNameAdress = list ? list.address : ''
      }
      let hasvisible =
        caseData.parameters && caseData.parameters.length > 0
          ? caseData.parameters.map(item => {
              return item.visible
            })
          : []
      if (hasvisible.indexOf(true) < 0) {
        this.$message.info('This testCase has no editable parameters.')
        return false
      }
      caseData.parameters.forEach(item => {
        // 把null都换成空字符串
        item.value === null ? (item.value = '') : null
        item.defaultValue === null ? (item.defaultValue = '') : null
        if (item.name === 'protocol') {
          if (item.id === null) {
            item.id = ''
          }
        }
      })
      if (this.deleteItemIndex.length !== 0) {
        // 有删除过
        caseData.parameters.forEach(val => {
          if (
            val.name === 'instrument-ips' ||
            val.name === 'caps' ||
            val.name === 'number-calls' ||
            val.name === 'protocol'
          ) {
            // 去除删掉的项目
            let valueList = val.value.split(';')
            let newValueList = []
            for (let i = 0; i < valueList.length; i++) {
              if (this.deleteItemIndex.indexOf(i) === -1) {
                // 在删除项目中不存在
                newValueList.push(valueList[i])
              }
            }
            const newValue = newValueList.join(';')
            val.value = newValue
            val.defaultValue = newValue
          }
        })
      }
      if (
        // 海鸥情况下
        this.selectedSUTNameType === 101009 &&
        this.cheangeTestInstrument.length > 0
      ) {
        if (caseData.parameters.length > 0) {
          caseData.parameters.map(items => {
            if (items.name === 'instrument-ids') {
              items.value = this.cheangeTestInstrument.join(';')
              items.defaultValue = this.cheangeTestInstrument.join(';')
            }
            if (
              items.name === 'caps' ||
              items.name === 'number-calls' ||
              items.name === 'protocol'
            ) {
              if (
                // 空或者数量小于界面所选testInstrument,代表新增了,少多少加多少行
                items.defaultValue === '' ||
                items.value === '' ||
                items.defaultValue.split(';').length <
                  this.cheangeTestInstrument.length ||
                items.value.split(';').length <
                  this.cheangeTestInstrument.length
              ) {
                const diff =
                  this.cheangeTestInstrument.length -
                  items.value.split(';').length
                for (let i = 0; i < diff; i++) {
                  items.defaultValue = items.defaultValue + ';'
                  items.value = items.value + ';'
                }
              }
              // else if ( // 不是空或者比界面所选的多，用部分初始值
              //   ((items.defaultValue !== "" || items.value !== "") &&
              //     items.defaultValue.split(";").length >
              //       this.cheangeTestInstrument.length) ||
              //   items.value.split(";").length >
              //     this.cheangeTestInstrument.length
              // ) {
              //   //  console.log('删除，默认多了')
              //   items.defaultValue = items.defaultValue
              //     .split(";")
              //     .slice(0, this.cheangeTestInstrument.length)
              //     .join(";");
              //   items.value = items.value
              //     .split(";")
              //     .slice(0, this.cheangeTestInstrument.length)
              //     .join(";");
              // }
            }
            if (items.name === 'instrument-ips') {
              // 取出选择的instrument的address, 按照select框内选择的顺序排列
              let instrumentAddress = []
              this.cheangeTestInstrument.forEach(item => {
                this.TestInstrumentOption.forEach(val => {
                  if (val.id === item) {
                    instrumentAddress.push(val.instrumentMgs.address)
                  }
                })
              })
              if (
                // 如果初始值是空, 直接按页面选择的来
                items.defaultValue === '' ||
                items.value === ''
              ) {
                items.defaultValue = instrumentAddress.join(';')
                items.value = instrumentAddress.join(';')
              } else if (
                // 少于界面选择的, 新增项按页面选择的来
                items.defaultValue.split(';').length <
                  instrumentAddress.length ||
                items.value.split(';').length < instrumentAddress.length
              ) {
                items.defaultValue = `${
                  items.defaultValue
                };${instrumentAddress
                  .slice(
                    items.defaultValue.split(';').length,
                    instrumentAddress.length
                  )
                  .join(';')}`
                items.value = `${items.value};${instrumentAddress
                  .slice(
                    items.value.split(';').length,
                    instrumentAddress.length
                  )
                  .join(';')}`
              }
              //   else if ( // 不是空或多于页面选择的, 按部分初始值
              //   ((items.defaultValue !== "" || items.value !== "") &&
              //     items.defaultValue.split(";").length >
              //       instrumentAddress.length) ||
              //   items.value.split(";").length >
              //     instrumentAddress.length
              //   ) {
              //     items.defaultValue = items.defaultValue
              //       .split(";")
              //       .slice(0, instrumentAddress.length)
              //       .join(";");
              //     items.value = items.value
              //       .split(";")
              //       .slice(0, instrumentAddress.length)
              //       .join(";");
              // }
            }
            if (items.name === 'sutaddress') {
              // 只有海鸥有这个参数
              items.value = this.selectedSUTNameAdress
              items.defaultValue = this.selectedSUTNameAdress
            }
          })
          caseData.parameters.map(items => {
            if (
              (items.name === 'caps' ||
                items.name === 'instrument-ips' ||
                items.name === 'number-calls' ||
                items.name === 'protocol') &&
              items.defaultValue !== null &&
              items.value !== null &&
              (items.defaultValue.split(';').length >
                this.cheangeTestInstrument.length ||
                items.value.split(';').length >
                  this.cheangeTestInstrument.length)
            ) {
              items.defaultValue =
                items.defaultValue.charAt(items.defaultValue.length - 1) === ';'
                  ? items.defaultValue.substring(
                      0,
                      items.defaultValue.length - 1
                    )
                  : items.defaultValue
              items.value =
                items.value.charAt(items.value.length - 1) === ';'
                  ? items.value.substring(0, items.value.length - 1)
                  : items.value
            }
          })
        }
      } else if (
        this.selectedSUTNameType === 101009 &&
        this.cheangeTestInstrument.length === 0
      ) {
        caseData.parameters.map(items => {
          if (
            items.name === 'instrument-ips' ||
            items.name === 'caps' ||
            items.name === 'number-calls' ||
            items.name === 'protocol'
          ) {
            items.defaultValue = ''
            items.value = ''
          }
        })
      }
      this.updateCaseParamsData(caseData)
      this.setCaseParamsIsShow(true)
    },
    onChangeTestInstrument(value) {
      // console.log(value)
      // this.cheangeTestInstrument = this.TestInstrumentOption.map((item) => {
      //   if (value.indexOf(item.id) > -1) {
      //     return item.id ? item.id : "";
      //   }
      // });
      // // 删除一项的时候该项会变为undefined，所以要过滤
      // if (this.cheangeTestInstrument.length > 0) {
      //   this.cheangeTestInstrument = this.cheangeTestInstrument.filter(
      //     (item) => {
      //       return item !== undefined;
      //     }
      //   );
      // }
      this.cheangeTestInstrument = value
      // if (this.cheangeTestInstrument < this.oldChangeInstrument) { // 如果删除了
      //   this.deleteItemIndex = []
      //   for (let i = 0; i < this.oldChangeInstrument.length; i++) {
      //     if (this.cheangeTestInstrument.indexOf(this.oldChangeInstrument[i]) === -1) {
      //       this.deleteItemIndex.push(i)
      //     }
      //   }
      // } else {
      //   this.deleteItemIndex = []
      // }
      // console.log('deleteindex', this.deleteItemIndex)
      // // 一旦change，就不要删除的那一项的初始值
      // if (this.isEdit && this.cheangeTestInstrument.length < this.testJobSingleData.suites.length) {
      //   let deleteItem = this.testJobSingleData.suites.filter((item) => {
      //     return this.cheangeTestInstrument.indexOf(item.id) === -1
      //   }) // 返回的是删掉的项目
      //   // 再按select选项里的顺序为其排序
      //   this.testCaseStash
      //   console.log(deleteItem)
      // }
      // // this.TestInstrumentOption
      // console.log(value ,i,  this.testCaseStash)
    }
  }
}
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
