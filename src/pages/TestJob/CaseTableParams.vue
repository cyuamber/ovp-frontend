<template>
  <a-modal
    v-bind:title="title"
    :visible="caseParamsIsShow"
    :closable="false"
    :width="750"
    @ok="handleSubmit"
    @cancel="handleAbolish"
  >
    <template>
      <a-table
        :columns="columnsTitle"
        :data-source="tabData"
        :scroll="{ x: 1300 }"
        bordered
      >
        <template
          v-for="col in columnsContentFn"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              :disabled="col == '*instrument-ips' || col == '*sutaddress'"
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>
              {{ text || '--' }}
            </template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => save(record.key)">Save</a>
              <a-popconfirm
                title="Sure to cancel?"
                @confirm="() => cancel(record.key)"
              >
                <a>Cancel</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a :disabled="editingKey !== ''" @click="() => edit(record.key)"
                >Edit</a
              >
            </span>
          </div>
        </template>
      </a-table>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
let valArr,
  jsonParameters,
  optionalParam = []
export default {
  name: 'CaseTableParams',
  props: ['isEdit', 'instrument'],
  data() {
    this.init = () => {
      let caseParamsIsShow = this.$store.state.testJob.caseParamsIsShow
      //let caseParamsData = this.$store.state.testJob.caseParamsData
      let instrumentArr = this.$store.state.testJob.TestInstrumentOption
      let instrumentJson = []
      if (instrumentArr) {
        instrumentArr.map(item => {
          this.instrument.map(val => {
            if (item.id == val) {
              instrumentJson.push(item.name)
            }
            return instrumentJson
          })
        })
      }

      let valObj = { 'test instrument': instrumentJson }
      let tabDataArr = []
      let dataTab = JSON.parse(sessionStorage.getItem('tabdata'))
      let json
      if (caseParamsIsShow && dataTab.parameters.length > 0) {
        // if (caseParamsData && caseParamsData.parameters.length > 0) {
        //   json = caseParamsData.parameters
        // } else {
        json = dataTab.parameters
        //}
        let nameItem = ['test instrument']

        json.map(item => {
          const nameText = item.isOptional ? '*' + item.name : item.name
          if (item.defaultValue === null) {
            item.defaultValue = ''
          }
          valObj[nameText] = item.defaultValue.split(';')
          if (item.visible) {
            //如果是true的话展示列
            nameItem.push(nameText)
          }
          if (item.isOptional && item.visible) {
            optionalParam.push(nameText)
          }
        })
        let obj = {}
        const instrument = this.instrument.length
        nameItem.map(val => {
          // let fillArr = Array.from({ length: instrument }, () => '--')
          let fillArr = Array.from({ length: instrument }, () => '--')
          valObj[val] = [...valObj[val], ...fillArr]
          if (!obj.val) {
            obj['test instrument'] = '--'
            obj[val] = '--'
            tabDataArr.push(obj)
          }
        })
        tabDataArr = tabDataArr.slice(0, instrument)
        var copytab = JSON.parse(JSON.stringify(tabDataArr)) || []
        let paramObj = {
          '*instrument-ids': '*instrument-ids',
          '*timeout': '*timeout',
          '*sutaddress': '*sutaddress'
        }
        for (var n in valObj) {
          copytab.map((ele, i) => {
            switch (n) {
              case n:
                ele[n] = valObj[n][i]
                ele['key'] = i

                if (paramObj[n] == n) {
                  ele[n] = valObj[n][0]
                }
                break
            }
          })
        }
      }
      this.tabData = copytab
      if (copytab && copytab.length > 0) {
        this.cacheData = copytab.map(item => ({ ...item }))
      }

      return copytab
    }

    let data = this.init() || []
    return {
      tabData: data,
      editingKey: '',
      count: 0,

      cacheData: null,
      caseData: [],
      flag: false,
      title: this.isEdit ? 'Edit Case Parameters' : 'Add Case Parameters'
    }
  },
  created() {},

  computed: {
    ...mapState({
      caseParamsData: state => {
        sessionStorage.setItem(
          'tabdata',
          JSON.stringify(state.testJob.caseParamsData)
        )
        return state.testJob.caseParamsData
      },
      testCaseList: store => store.testJob.testCaseList,
      caseParamsIsShow: store => store.testJob.caseParamsIsShow
    }),
    columnsTitle() {
      let columnsArr = [
        {
          title: 'test instrument',
          dataIndex: 'test instrument',
          scopedSlots: { customRender: 'test instrument' }
        }
      ]
      const onlyOperation = {
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      if (this.caseParamsData.parameters) {
        this.caseParamsData.parameters.map((item, key) => {
          const nameText = item.isOptional ? '*' + item.name : item.name
          if (item.visible) {
            columnsArr.push({
              title: nameText,
              dataIndex: nameText,
              key: key,
              editable: false,
              scopedSlots: { customRender: nameText }
            })
          }
        })
        columnsArr.push(onlyOperation)
      }
      return columnsArr
    },
    columnsContentFn() {
      const columnsHead = ['test instrument']
      if (this.caseParamsData.parameters) {
        this.caseParamsData.parameters.map(item => {
          const nameText = item.isOptional ? '*' + item.name : item.name
          if (item.visible) {
            columnsHead.push(nameText)
          }
        })
      }
      return columnsHead
    }
  },
  watch: {
    caseParamsIsShow(val) {
      if (val) {
        this.init()
      } else {
        this.caseParamsData.parameters.map(item => {
          item.editable = false
        })
      }
    },

    caseParamsData(val) {
      // 只有第一次监控到打开
      this.caseParams = val.parameters.filter(item => {
        return item.visible !== false
      })
    }
  },

  methods: {
    ...mapMutations('testJob', ['setCaseParamsIsShow', 'updateTestCaseList']),
    // 提交表单事件
    handleSubmit() {
      if (this.$store.state.testJob.caseParamsData) {
        const reqData = [
          {
            ...this.$store.state.testJob.caseParamsData,
            ...{ parameters: this.caseData }
          }
        ]
        for (var i = 0; i < optionalParam.length; i++) {
          for (let j = 0; j < this.tabData.length; j++) {
            const target = this.tabData[j]
            if (!target[optionalParam[i]]) {
              if (optionalParam[i] !== '*instrument-ips') {
                this.$message.error(optionalParam[i] + ' is required')
                return
              }
            }
          }
        }
        this.updateTestCaseList({ spin: false, list: reqData })
      }
      this.$emit(
        'updateSingleCase',
        this.$store.state.testJob.caseParamsData.id
      ) // 告诉父组件该项不用初始值
      this.setCaseParamsIsShow(false)
    },
    // 取消弹层的逻辑
    handleAbolish() {
      // 将值恢复
      this.caseParams = this.caseParamsData.parameters.filter(item => {
        return item.visible !== false
      })
      // if(this.isEidt){
      this.init()
      // }else{
      //   this.addinit()
      // }
      // this.init()
      this.setCaseParamsIsShow(false)
    },
    strBool(val) {
      return val === 'true' ? true : false
    },
    handleChange(value, key, column) {
      const newData = [...this.tabData]
      const target = newData.filter(item => key === item.key)[0]
      if (!jsonParameters) {
        let jsonArr = JSON.parse(sessionStorage.getItem('tabdata')).parameters
        jsonParameters = JSON.parse(JSON.stringify(jsonArr))
      }
      if (target) {
        target[column] = value
        if (column == '*timeout') {
          newData.map(outItem => {
            outItem['*timeout'] = value
          })
        }
        this.tabData = newData
        //if (this.isEdit) {
        jsonParameters.map(item => {
          column = column.replace(/^[*]/g, '')
          if (item.name == column) {
            if (item.defaultValue === null) {
              item.defaultValue = ''
            }
            if (item.value === null) {
              item.value = ''
            }
            if (column == 'timeout') {
              item.value = value
              item.defaultValue = value
            }
            valArr = item.defaultValue.split(';')
            valArr.splice(key, 1, value)
            item.defaultValue = valArr.join(';')
            item.value = valArr.join(';')
          }

          return item
        })
        this.caseData = jsonParameters
        //}
      }
    },
    edit(key) {
      const newData = [...this.tabData]
      const target = newData.filter(item => key === item.key)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.tabData = newData
      }
    },
    save(key) {
      const newData = [...this.tabData]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => key === item.key)[0]
      const targetCache = newCacheData.filter(item => key === item.key)[0]
      // if (this.isEdit) {
      for (var i = 0; i < optionalParam.length; i++) {
        if (!target[optionalParam[i]]) {
          if (
            optionalParam[i] !== '*instrument-ips' ||
            optionalParam[i] !== '*sutaddress'
          ) {
            this.$message.error(optionalParam[i] + ' is required')
            return
          }
        }
      }
      //  }
      if (target && targetCache) {
        delete target.editable
        this.tabData = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel(key) {
      const newData = [...this.tabData]
      const target = newData.filter(item => key === item.key)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter(item => key === item.key)[0]
        )
        delete target.editable
        this.tabData = newData
      }
    }
  }
}
</script>

<style lang="less" scope>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
