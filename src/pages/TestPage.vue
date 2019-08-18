<template>
  <div class="about">
    <h1>This is a test page</h1>
    <a-button :loading="buttonloading" type="primary" @click="getData">Get data</a-button>
    <a-table :columns="columns" :loading="tableloading" :dataSource="metaData" />
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
      buttonloading: false,
      tableloading: false,
      metaData: null,
      columns
    };
  },
  methods: {
    getData() {
      this.buttonloading = true;
      this.tableloading = true;
      http
        .axiospost(API.test.testapi)
        .then(res => {
          console.log(res);
          this.metaData = res.result;
          this.buttonloading = false;
          this.tableloading = false;
        })
        .catch(err => {
          console.error(err);
          this.buttonloading = false;
          this.tableloading = false;
        });
    }
  }
};
</script>

