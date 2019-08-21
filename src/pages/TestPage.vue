<template>
  <div class="about">
    <Loading :loadingMessage="loadingMessage" />
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
      <div slot="action" slot-scope="row">
        <a href="javascript:;">Add</a>
        <a-divider type="vertical" />
        <a href="javascript:;" @click="deleteFakeData(row.id)">Delete</a>
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
        <img :src="text.avatar" class="test-block__img" />
      </div>
    </a-table>
  </div>
</template>

<script>
import http from "../utils/http";
import API from "../const/apis";
import MOCKDATA from "../mock/json/deleteAddress.json";
import Loading from "../components/Loading/Loading";
import CONSTANTS from "../const/constant";
import { setTimeout } from "timers";

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
  components: {
    Loading: Loading
  },
  mounted() {},
  data() {
    return {
      loadingMessage: {
        show: false,
        type: "",
        toast: ""
      },
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
      this.showLoading = true;
      this.buttonloading = true;
      this.tableloading = true;
      http
        .axiosget(API.mock.address)
        .then(res => {
          this.metaData = res.data;
          this.buttonloading = false;
          this.tableloading = false;
          this.loadingMessage = {
            show: false,
            type: "success",
            toast: res.info
          };
        })
        .catch(err => {
          this.buttonloading = false;
          this.tableloading = false;
          this.loadingMessage = {
            show: false,
            type: "error",
            toast: err
          };
        });
    },
    deleteFakeData(id) {
      this.loadingMessage = {
        show: true,
        type: "",
        toast: ""
      };
      const param = { id: id };
      http
        .axiosmock(API.mock.deletehome, param, MOCKDATA)
        .then(res => {
          if (+res.code === 200) {
            this.loadingMessage = {
              show: false,
              type: "success",
              toast: `Item ${id} successfully deleted`
            };
          } else {
            this.loadingMessage = {
              show: false,
              type: "error",
              toast: "Delete failed"
            };
          }
        })
        .catch(err => {
          this.loadingMessage = {
            show: false,
            type: "error",
            toast: "Delete failed"
          };
        });
    },
    getFakeData() {
      this.showLoading = true;
      this.mockbuttonloading = true;
      this.mocktableloading = true;
      http
        .axiospost(API.mock.home)
        .then(res => {
          this.mockData = res;
          this.mockbuttonloading = false;
          this.mocktableloading = false;
          this.loadingMessage = {
            show: false,
            type: "success",
            toast: "Successfully!"
          };
        })
        .catch(err => {
          this.mockbuttonloading = false;
          this.mocktableloading = false;
          this.loadingMessage = {
            show: false,
            type: "error",
            toast: err
          };
        });
    }
  }
};
</script>

<style lang="less" scoped>
.test-block__img {
  width: 80px;
}
</style>
