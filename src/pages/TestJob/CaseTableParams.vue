<template>
  <a-modal
    v-bind:title="title"
    :visible="caseParamsIsShow"
    :closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <template>
      <a-table
        :columns="columnsTitle"
        :data-source="tabData ? tabData : []"
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
              @change="e => handleChange(e.target.value, record.key, col)"
            />
            <template v-else>
              {{ text }}
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

<script type="text/ecmascript-6">
import { mapState,mapMutations } from "vuex"
let valArr;
export default {
  name: 'CaseTableParams',
  props: ['isEdit'],
  data() {
    // this.initRanderFn()
    return {
      tabData:[],
      editingKey : '',
      count: 0,
      cacheData:null,
      caseData:[],
      title: this.isEdit ? 'Edit Case Parameters' : 'Add Case Parameters',
    }
  },
  created(){

  },
  mounted(){
    //setTimeout(()=>{
      // sessionStorage.setItem('tabdata', JSON.stringify(this.$store.state.testJob.caseParamsData))
      this.initRanderFn()
   // },1000)
  },
  computed: {
    ...mapState({
      caseParamsData: (state) => {
         sessionStorage.setItem('tabdata', JSON.stringify(state.testJob.caseParamsData))
        return state.testJob.caseParamsData
      },
      testCaseList: (store) => store.testJob.testCaseList,
      caseParamsIsShow: (store) => store.testJob.caseParamsIsShow
    }),
    columnsTitle() {
      let columnsArr = []
      const onlyOperation = {
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      if(this.caseParamsData.parameters){
        this.caseParamsData.parameters.map((item,key)=>{
          columnsArr.push({
            title:item.name,
            dataIndex: item.name,
            key:key,
            editable:false,
            scopedSlots: { customRender: item.name }
          })
        })
        columnsArr.push(onlyOperation)

      }
      return columnsArr
    },
    columnsContentFn() {
      const columnsHead = []
       if(this.caseParamsData.parameters){
        this.caseParamsData.parameters.map((item)=>{
            columnsHead.push(item.name)
        })
       }
        return columnsHead
    },
  },
  watch: {
    caseParamsIsShow(val) {
      if (val) {
        this.count++
        if (this.count > 1 && this.caseParamsData&&this.caseParamsData.parameters.length>0) { // 只有首次用的initialValue，后面每次打开都重新设置值
          this.caseParams = this.caseParamsData.parameters.filter((item) => {
           //  this.columnsData.push(item.name)
            return item.visible !== false;
          });

        }
      }

    },

    caseParamsData(val) { // 只有第一次监控到打开
      this.caseParams = val.parameters.filter((item) => {
        return item.visible !== false
      });
    },
  },

  methods: {
     ...mapMutations('testJob', ['setCaseParamsIsShow', 'updateTestCaseList']),
    // 提交表单事件
    handleSubmit() {
      if(this.$store.state.testJob.caseParamsData){
          const reqData = [{...this.$store.state.testJob.caseParamsData,...{parameters:this.caseData}}]
         this.updateTestCaseList({ spin: false, list: reqData})
            this.$emit('updateSingleCase',this.$store.state.testJob.caseParamsData.id) // 告诉父组件该项不用初始值
       this.setCaseParamsIsShow(false)
      }


    },
    initRanderFn(){
       // let caseParamsData = this.$store.state.testJob.caseParamsData;
    let caseParamsIsShow = this.$store.state.testJob.caseParamsIsShow
     let valObj = {}
     let dataTab =  JSON.parse(sessionStorage.getItem('tabdata'))
     let json;
    if(caseParamsIsShow && dataTab.parameters.length>0 ){
      if(this.caseParamsData.parameters.length<=0){
        json = dataTab.parameters
      }else{
        json = this.caseParamsData.parameters
      }

        let nameItem=[]

      json.map((item)=>{
        if(item.defaultValue===null){
          item.defaultValue = ''
        }
        valObj[item.name] = item.defaultValue.split(';')
        // if(item.visible){//如果是true的话展示列
         nameItem.push(item.name)
        // }

      })
     let obj = {};
      nameItem.map((val)=>{
       let  nameLen = nameItem.length,valLen = valObj[val].length;
       if(!valLen){
         let fillArr = Array.from({length:nameLen},()=> '--');
          valObj[val] = [...valObj[val], ...fillArr]
       }else if(valLen<nameLen){
            let fillLen = nameLen-valLen;
            let fillArr = Array.from({length:fillLen},()=> '--');
            valObj[val] = [...valObj[val], ...fillArr]
        }
        if(!obj.val){
           obj[val]='--'
           this.tabData.push(obj)
        }
       })
      var copytab = JSON.parse(JSON.stringify(this.tabData))
     for(var n in valObj){
        copytab.map((ele,i)=>{
             switch(n){
               case n:
                ele[n] =  valObj[n][i];
                ele["key"] = i;
                break;
           }
         })
     }
    this.tabData = copytab
    this.cacheData = copytab.map(item => ({ ...item }))
    return copytab

    }
    },
    // 取消弹层的逻辑
     handleCancel() {
      // 将值恢复
      this.caseParams = this.caseParamsData.parameters.filter((item) => {
        return item.visible !== false
      })
      this.initRanderFn();
      this.setCaseParamsIsShow(false)
    },
    strBool(val) {
      return val === 'true' ? true : false
    },
    handleChange(value, key, column) {
      const newData = [...this.tabData]
      const target = newData.filter(item => key === item.key)[0]

      this.caseData = JSON.parse(JSON.stringify(this.$store.state.testJob.caseParamsData.parameters));
      if (target) {
        target[column] = value

        this.tabData = newData
        this.caseData.map((item)=>{
            if(item.name==column){
              if(item.defaultValue===null){
                item.defaultValue = ''
              }
              if(item.value===null){
                item.value=''
              }
               valArr =  item.defaultValue.split(';')
               valArr.splice(key,1,value)
              item.defaultValue =valArr.join(';')
              item.value = valArr.join(';')
            }

            return item;
        })
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
        Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
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
<style>
.ant-table-wrapper {
  width: 100%;
  overflow: auto;
}
</style>
