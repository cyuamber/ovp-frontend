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
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      keyword: '',
      url: '',
      key: '',
      event: ''
    }
  },
  computed: {
    ...mapState({
      searchKeyword: state => state.searching.keyword
    })
  },
  watch: {
    searchKeyword(val) {
      this.keyword = val
    }
  },
  methods: {
    ...mapMutations('searching', ['setKeyword']),
    setSearchWord(e) {
      this.setKeyword(e.target.value)
    },
    searchTypeID() {
      this.$emit('searchInput', this.keyword.trim(), true)
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.search {
  width: 240px;
  /deep/ .ant-input {
    border-radius: 20px;
  }
}
</style>
