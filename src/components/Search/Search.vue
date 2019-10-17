<template>
  <div class="components-input-demo-presuffix">
    <a-input placeholder="Input ID"  v-model="keyword" class="search"  @keyup.enter="searchTypeID">
      <a-icon slot="prefix" type="search"/>
    </a-input>
  </div>
</template>

<script type="text/ecmascript-6">
import http from '../../utils/http'
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
        http.axiosget(this.url,{[this.key]: this.keyword}).then(res => {
          if(res.code === 200){
            this.$emit(this.event,res)
            this.keyword = ''
            this.$message.success('The operation has been successful')
          }else this.$message.error('Network exception, please try again');
        })
      }
    },
    mounted () {
      switch (this.currentPage){
        case 'VNFTypeMGT':
          this.url = '/getVNFType';
          this.key = 'id';
          this.event = 'searchVNFTypeID';
          break;
        case 'VNFTypeObjectsMGT':
          this.url = '/getVNFTest';
          this.key = 'VNFTestName';
          this.event = 'SearchVNFTestName';
          break;
        case 'TestEnvMGT':
          this.url = '/getVIM';
          this.key = 'cloudRegionId';
          this.event = 'testInsSearch'
          break;
        case 'TestInstrumentMGT':
          this.url = '/getMeterSys';
          this.key = 'meterSysName';
          this.event = 'VNFSuiteSearch'
          break;
        case 'VNF/PNFSuiteMGT':
          this.url = '/getTestMeter';
          this.key = 'tesyMeterName';
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
