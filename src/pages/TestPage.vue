<template>
  <div class="about">
    <h3>This is a test page</h3>
    <a-button :loading="buttonloading" type="primary" @click="getMockData">Get data</a-button>
    <a-button
      style="marginLeft:10px"
      :loading="mockbuttonloading"
      type="primary"
      @click="getFakeData"
    >Mock data</a-button>
    <a-table
      style="marginTop:10px"
      :rowKey="(row,index)=>index"
      :columns="columns"
      :loading="tableloading"
      :dataSource="metaData"
    >
      <div slot="action" slot-scope>
        <a href="javascript:;">Add</a>
        <a-divider type="vertical" />
        <a href="javascript:;">Delete</a>
        <a-divider type="vertical" />
        <a href="javascript:;" class="ant-dropdown-link">
          More actions
          <a-icon type="down" />
        </a>
      </div>
    </a-table>
    <a-table
      style="marginTop:10px"
      :rowKey="(row,index)=>index"
      :columns="mockcolumns"
      :dataSource="mockData"
      :loading="mocktableloading"
    >
      <div slot="avatar" slot-scope="text">
        <img :src="text.avatar" />
      </div>
    </a-table>
  </div>
</template>

<script>
import http from "../utils/http";
import API from "../const/apis";
import CONSTANTS from "../const/constant";

const mockcolumns = CONSTANTS.columns.mockcolumns;
const columns = [
  {
    title: "Id",
    dataIndex: "id"
  },
  {
    title: "Address",
    dataIndex: "address"
  },
  {
    title: "User",
    dataIndex: "user"
  },
  {
    title: "Action",
    key: "action",
    scopedSlots: { customRender: "action" }
  }
];

export default {
  name: "About",
  mounted() {},
  data() {
    return {
      buttonloading: false,
      tableloading: false,
      mocktableloading: false,
      mockbuttonloading: false,
      metaData: null,
      mockData: [],
      columns,
      mockcolumns
    };
  },
  methods: {
    getMockData() {
      this.buttonloading = true;
      this.tableloading = true;
      http
        .axiosget(API.mock.address)
        .then(res => {
          this.metaData = res.data;
          this.buttonloading = false;
          this.tableloading = false;
        })
        .catch(err => {
          console.error(err);
          this.buttonloading = false;
          this.tableloading = false;
        });
    },
    getFakeData() {
      this.mockbuttonloading = true;
      this.mocktableloading = true;
      http
        .axiospost(API.mock.home)
        .then(res => {
          this.mockData = res;
          this.mockbuttonloading = false;
          this.mocktableloading = false;
        })
        .catch(err => {
          console.error(err);
          this.mockbuttonloading = false;
          this.mocktableloading = false;
        });
    }
  }
};
</script>

