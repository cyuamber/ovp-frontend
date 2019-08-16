<template>
  <div class="about">
    <h1>This is a test page</h1>
    <a-button type="primary" @click="getData">Get data</a-button>
    <a-table :columns="columns" :dataSource="metaData" />
  </div>
</template>

<script>
import http from "../utils/http";
import API from "../const/apis";

const columns = [
  {
    title: "Name",
    dataIndex: "type"
  }
];

export default {
  name: "About",
  mounted() {},
  data() {
    return {
      metaData: null,
      columns
    };
  },
  methods: {
    getData() {
      http
        .axiospost(API.test.testapi)
        .then(res => {
          console.log(res);
          this.metaData = res.result;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>

