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
          :class="{
            checkboxgroup: item.visible === true && item.type === 'checkbox'
          }"
        >
          <a-input
            :disabled="item.name === 'sutaddress'"
            v-if="
              item.visible === true &&
                (item.type === 'string' || item.type === 'datetime') &&
                (item.name !== 'instrument-ips') &
                  (item.name !== 'caps') &
                  (item.name !== 'number-calls') &
                  (item.name !== 'protocol')
            "
            v-decorator="[
              item.name,
              {
                rules: [
                  {
                    required: item.isOptional,
                    message: item.name + 'is required'
                  }
                ],
                initialValue: !isEdit ? item.defaultValue : item.value
              }
            ]"
          />
          <div
            v-if="
              item.visible === true &&
                item.type === 'string' &&
                (item.name === 'instrument-ips' ||
                  item.name === 'caps' ||
                  item.name === 'number-calls' ||
                  item.name === 'protocol')
            "
          >
            <!-- 这是一段神奇的代码，!isEdit后面是一大坨返回结果哦 -->
            <a-input
              v-for="(items, index) in typeof item.defaultValue !==
                'undefined' || typeof item.value !== 'undefined'
                ? item.defaultValue.split(';') || item.value.split(';')
                : []"
              :key="index"
              :disabled="item.name === 'instrument-ips' ? true : false"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
              v-decorator="[
                formParma[item.name] + index + caseParamsData.id,
                {
                  rules: [
                    {
                      required: item.isOptional,
                      message: item.name + 'is required'
                    }
                  ],
                  initialValue: items
                }
              ]"
            />
          </div>
          <a-switch
            v-if="item.visible === true && item.type === 'bool'"
            v-decorator="[
              item.name,
              {
                valuePropName: 'checked',
                rules: [
                  {
                    required: item.isOptional,
                    message: item.name + 'is required'
                  }
                ],
                initialValue:
                  isEdit === true
                    ? strBool(item.value)
                    : strBool(item.defaultValue)
              }
            ]"
          />
          <a-checkbox-group
            v-if="item.visible === true && item.type === 'checkbox'"
            v-decorator="[
              item.name,
              { initialValue: !isEdit ? item.defaultValue : item.value }
            ]"
          >
            <a-row>
              <a-col :span="8" v-for="items in item.allValue" :key="items">
                <a-checkbox :value="items">
                  {{ items }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'CaseParams',
  props: ['isEdit'],
  data() {
    return {
      form: this.$form.createForm(this),
      title: this.isEdit ? 'Edit Case Parameters' : 'Add Case Parameters',
      caseParams: [],
      count: 0,
      displayList: [],
     formParma:{ 'instrument-ips':'instrument-ips',
                    'caps':'caps',
                    'number-calls':'number-calls',
                    'protocol':'protocol'}
    }
  },
  computed: {
    ...mapState({
      caseParamsData: (state) => state.testJob.caseParamsData,
      testCaseList: (store) => store.testJob.testCaseList,
      caseParamsIsShow: (store) => store.testJob.caseParamsIsShow,
    }),
  },
  mounted() {},
  watch: {
    caseParamsIsShow(val) {
      if (val) {
        this.count++
        if (this.count > 1) {
          // 只有首次用的initialValue，后面每次打开都重新设置值
          this.caseParams = this.caseParamsData.parameters.filter((item) => {
            return item.visible !== false
          })
          this.caseParams.forEach((item) => {
            if (
              item.name === 'instrument-ips' ||
              item.name === 'caps' ||
              item.name === 'number-calls'||
              item.name === 'protocol'
            ) {
              const itemList = item.value.split(';') // 目前不用defaultValue
              for (let i = 0; i < itemList.length; i++) {
                this.form.setFieldsValue({
                  [item.name + i + this.caseParamsData.id]: itemList[i],
                })
              }
            } else {
              this.form.setFieldsValue({
                [item.name]: item.value,
              })
            }
          })
        }
      }
    },
    caseParamsData(val) {
      // 只有第一次监控到打开
      this.caseParams = val.parameters.filter((item) => {
        return item.visible !== false
      })
    },
  },
  methods: {
    ...mapMutations('testJob', ['setCaseParamsIsShow', 'updateTestCaseList']),
    handleCancel() {
      // 将值恢复
      this.caseParams = this.caseParamsData.parameters.filter((item) => {
        return item.visible !== false
      })
      this.caseParams.forEach((item) => {
        if (
          item.name === 'instrument-ips' ||
          item.name === 'caps' ||
          item.name === 'number-calls'||
          item.name === 'protocol'
        ) {
          const itemList = item.value.split(';') // 目前不用defaultValue
          for (let i = 0; i < itemList.length; i++) {
            this.form.setFieldsValue({
              [item.name + i + this.caseParamsData.id]: itemList[i],
            })
          }
        } else {
          this.form.setFieldsValue({
            [item.name]: item.value,
          })
        }
      })
      this.setCaseParamsIsShow(false)
    },

    handleSubmit() {
      this.form.validateFields((error, values) => {
        if (!error) {
          let caseParameters = this.caseParamsData
          let testCaseLists = this.testCaseList
          let DRAValues = {
            'instrument-ips': '',
            caps: '',
            'number-calls': '',
            'protocol':'',
          }
          if (Object.keys(values).indexOf('sutaddress') > -1) {
            // 是不是海鸥
            Object.keys(values).map((items) => {
              if (items.indexOf('instrument-ips') > -1) {
                DRAValues['instrument-ips'] =
                  DRAValues['instrument-ips'] + values[items] + ';'
              } else if (items.indexOf('caps') > -1) {
                DRAValues.caps = DRAValues.caps + values[items] + ';'
              } else if (items.indexOf('number-calls') > -1) {
                DRAValues['number-calls'] =
                  DRAValues['number-calls'] + values[items] + ';'
              } else if (items.indexOf('protocol') > -1) {
                DRAValues['protocol'] =
                  DRAValues['protocol'] + values[items] + ';'
              }
            })
            DRAValues['instrument-ips'] =
              DRAValues['instrument-ips'].charAt(
                DRAValues['instrument-ips'].length - 1
              ) === ';'
                ? DRAValues['instrument-ips'].substring(
                    0,
                    DRAValues['instrument-ips'].length - 1
                  )
                : DRAValues['instrument-ips']
            DRAValues.caps =
              DRAValues.caps.charAt(DRAValues.caps.length - 1) === ';'
                ? DRAValues.caps.substring(0, DRAValues.caps.length - 1)
                : DRAValues.caps;
            // 新添加protocol 字段
                DRAValues.protocol =
              DRAValues.protocol.charAt(DRAValues.protocol.length - 1) === ';'
                ? DRAValues.protocol.substring(0, DRAValues.protocol.length - 1)
                : DRAValues.protocol;
            DRAValues['number-calls'] =
              DRAValues['number-calls'].charAt(
                DRAValues['number-calls'].length - 1
              ) === ';'
                ? DRAValues['number-calls'].substring(
                    0,
                    DRAValues['number-calls'].length - 1
                  )
                : DRAValues['number-calls']
            caseParameters.parameters.forEach((item) => {
              // caps和instrument
              if (DRAValues[item.name] !== undefined) {
                item.value = DRAValues[item.name]
                item.defaultValue = DRAValues[item.name]
              } else if (values[item.name] !== undefined) {
                // 其他
                item.value = values[item.name]
                item.defaultValue = values[item.name]
              }
            })
          } else {
            caseParameters.parameters.forEach((item) => {
              if (values[item.name] !== undefined) {
                item.value = values[item.name]
                item.defaultValue = values[item.name]
              }
            })
          }
          testCaseLists.map((item, index) => {
            if (item.id === caseParameters.id) {
              testCaseLists.splice(index, 1, caseParameters)
            }
          })
          console.log('testCaseLists',testCaseLists)
          this.updateTestCaseList({ spin: false, list: testCaseLists })
          this.$emit('updateSingleCase', this.caseParamsData.id) // 告诉父组件该项不用初始值
          this.setCaseParamsIsShow(false)
        }
      })
    },
    strBool(val) {
      return val === 'true' ? true : false
    },
  },
}
</script>
<style lang="less">
.checkboxgroup.ant-form-item {
  .ant-form-item-label {
    line-height: inherit !important;
  }
}
</style>
