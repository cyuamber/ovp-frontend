<template>
  <div class="components-input-demo-presuffix">
    <a-input placeholder="Input ID"  v-model="keyword" class="search"  @keyup.enter="searchTypeID">
      <a-icon slot="prefix" type="search"/>
    </a-input>
  </div>
</template>

<script type="text/ecmascript-6">
import moment from 'moment'
import http from '../../utils/http'
  export default {
    data(){
      return {
        keyword: ''
      }
    },
    methods: {
      searchTypeID(){
        http.axiosget('/getVNFType',{id: this.keyword}).then(res => {
          if(res.code === 200){
            this.$emit('searchID',res)
            this.keyword = ''
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
.search{
  width: 240px;
  /deep/ .ant-input{
    border-radius: 20px;
  }
}
 
</style>
