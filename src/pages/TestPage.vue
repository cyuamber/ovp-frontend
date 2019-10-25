<template>
  <div class="about">
    <Loading :loadingMessage="loadingMessage" />
    <h3>This is a test page</h3>
    <a-button :loading="buttonloading" type="primary" @click="getMockData">Get local data</a-button>
    <a-button
      style="marginLeft:10px"
      :loading="mockbuttonloading"
      type="primary"
      @click="getFakeData"
    >Get remote data</a-button>
    <a-button style="marginLeft:10px" type="primary" @click="getTestData">Get test data</a-button>
    <a-table
      style="marginTop:10px"
      :rowKey="(row,index)=>index"
      :columns="columns"
      :loading="tableloading"
      :dataSource="metaData"
    >
      <div slot="action" slot-scope="row">
        <a href="javascript:;" @click="putMethods(row.user)">Add</a>
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
      :columns="mockColumns"
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
import {axiosget} from "../utils/http";
import API from "../const/apis";
import Loading from "../components/Loading/Loading";

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
        type: "",
        toast: ""
      },
      buttonloading: false,
      tableloading: false,
      mocktableloading: false,
      mockbuttonloading: false,
      metaData: null,
      mockData: [],
      columns
    };
  },
  methods: {
    getMockData() {
      this.showLoading = true;
      this.buttonloading = true;
      this.tableloading = true;
      axiosget(API.mock.address)
        .then(res => {
          this.metaData = res.data;
          this.buttonloading = false;
          this.tableloading = false;
          this.loadingMessage = {
            type: "success",
            toast: res.info
          };
        })
        .catch(err => {
          this.buttonloading = false;
          this.tableloading = false;
          this.loadingMessage = {
            type: "error",
            toast: err
          };
        });
    },
    getFakeData() {
      this.showLoading = true;
      this.mockbuttonloading = true;
      this.mocktableloading = true;
      axiosget(API.mock.home)
        .then(res => {
          this.mockData = res;
          this.mockbuttonloading = false;
          this.mocktableloading = false;
          this.loadingMessage = {
            type: "success",
            toast: "Successfully!"
          };
        })
        .catch(err => {
          this.mockbuttonloading = false;
          this.mocktableloading = false;
          this.loadingMessage = {
            type: "error",
            toast: err
          };
        });
    },
    getTestData() {
      const url = API.mock.alarmformdata;
      axiosget(url)
        .then(res => {
          if (res) {
            console.log(res, "=====> successfully get data");
          } else {
            console.error(res, "=====> oops...");
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    putMethods(name) {
      this.loadingMessage = {
        type: "",
        toast: ""
      };
      let url = `${API.mock.putname}/name`;
      axiosget(url)
        .then(res => {
          if (+res.code === 200 || +res.code === 201) {
            this.loadingMessage = {
              type: "success",
              toast: `Item ${name} successfully added`
            };
          } else {
            this.loadingMessage = {
              type: "error",
              toast: "Add failed"
            };
          }
        })
        .catch(err => {
          this.loadingMessage = {
            type: "error",
            toast: "Add failed" || err
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
      axiosget(API.mock.deleteaddress, param)
        .then(res => {
          if (+res.code === 200 || +res.code === 201) {
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
            toast: "Delete failed" || err
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
