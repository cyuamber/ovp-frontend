<template>
  <div class="components-input-demo-presuffix">
    <a-input placeholder="Input ID"  v-model="keyword" class="search"  @keyup.enter="searchTypeID">
      <a-icon slot="prefix" type="search"/>
    </a-input>
  </div>
</template>

<script type="text/ecmascript-6">
import {axiosget} from '../../utils/http'
  export default {
    props: ['currentPage'],
    data(){
      return {
        keyword: '',
        url: '',
        key: '',
        event: '',
      }
    },
    methods: {
      searchTypeID(){
        if(this.currentPage === 'TestSUT'){
          this.$emit(this.event,this.keyword.trim(), true)
        }else {
          let {url, key, event, keyword} = this
          axiosget(url,{[key]: keyword}).then(res => {
            if(res.code === 200){
              this.$emit(event,res)
              this.keyword = ''
              this.$message.success('The operation has been successful')
            }else this.$message.error('Network exception, please try again');
          })
        }
        
      }
    },
    mounted () {
      switch (this.currentPage){
        case 'TestSUT':
          this.event = 'serchTestSUT';
          break;
        case 'VIMTestEnvMGT':
          this.url = '/getVIM';
          this.key = 'cloudRegionId';
          this.event = 'SearchVIMOrVNFM'
          break;
        case 'VNFMTestEnvMGT':
          this.url = '/getVNFM';
          this.key = 'VNFMname';
          this.event = 'SearchVIMOrVNFM'
          break;
        case 'TestInstrumentMGT':
          this.url = '/getMeterSys';
          this.key = 'meterSysName';
          this.event = 'testInsSearch'
          break;
        case 'VNF/PNFSuiteMGT':
          this.url = '/getTestTask';
          this.key = 'testTaskId';
          this.event ='VNFSuiteSearch';
          break;
        case 'TestStandardMGT':
          this.url = '/GETTestSpec';
          this.key = 'testSpecId';
          this.event ='testStandardSearch';
          break;
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
