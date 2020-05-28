<template>
  <div class="components-input-demo-presuffix">
    <a-input
      placeholder="Input Name"
      v-model="keyword"
      class="search"
      @change="setSearchWord"
      @keyup.enter="searchTypeID"
    >
      <a-icon slot="prefix" type="search" />
    </a-input>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
// import { axiosget } from "../../utils/http";
export default {
  data() {
    return {
      keyword: "",
      url: "",
      key: "",
      event: ""
    };
  },
  computed: {
    ...mapState({
      searchKeyword: state => state.searching.keyword
    })
  },
  watch: {
    searchKeyword(val) {
      this.keyword = val;
    }
  },
  methods: {
    ...mapMutations("searching", ["setKeyword"]),
    setSearchWord(e) {
      this.setKeyword(e.target.value);
    },
    searchTypeID() {
        this.$emit("searchInput", this.keyword.trim(), true);
      // if (
      //   this.currentPage === "TestSUT" ||
      //   this.currentPage === "TestInstrumentMGT" ||
      //   this.currentPage === "VNF/PNFSuiteMGT" ||
      //   this.currentPage === "TestSpecMGT"
      // ) {
      //   this.$emit(this.event, this.keyword.trim(), true);
      // } else {
      //   let { url, key, event, keyword } = this;
      //   axiosget(url, { [key]: keyword }).then(res => {
      //     if (res.code === 200) {
      //       this.$emit(event, res);
      //       this.keyword = "";
      //       this.$message.success("The operation has been successful");
      //     } else this.$message.error("Network exception, please try again");
      //   });
      // }
    }
  },
  mounted() {
    // switch (this.currentPage) {
    //   case "TestSUT":
    //     this.event = "serchTestSUT";
    //     break;
    //   case "VIMTestEnvMGT":
    //     this.url = "/getVIM";
    //     this.event = "SearchVIMOrVNFM";
    //     break;
    //   case "VNFMTestEnvMGT":
    //     this.url = "/getVNFM";
    //     this.event = "SearchVIMOrVNFM";
    //     break;
    //   case "TestInstrumentMGT":
    //     this.url = "/getMeterSys";
    //     this.event = "testInsSearch";
    //     break;
    //   case "VNF/PNFSuiteMGT":
    //     this.url = "/getTestTask";
    //     this.event = "VNFSuiteSearch";
    //     break;
    //   case "TestSpecMGT":
    //     this.url = "/GETTestSpec";
    //     this.event = "testSpecSearch";
    //     break;
    // }
  }
};
</script>

<style lang="less" scoped>
.search {
  width: 240px;
  /deep/ .ant-input {
    border-radius: 20px;
  }
}
</style>
