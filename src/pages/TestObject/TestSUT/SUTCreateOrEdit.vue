<template>
  <a-modal
    :title="
      (isEdit === true ? 'Edit ' : 'Create ') +
        replaceCurrentTabValue(currentTab) +
        ' SUT'
    "
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
  >
    <template>
      <a-form :form="form" @submit="handleSubmit" class="form">
        <a-form-item
          :label="replaceCurrentTabValue(currentTab) + ' Name'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'name',
              {
                rules: [
                  {
                    required: true,
                    message:
                      replaceCurrentTabValue(currentTab) + ' Name is required'
                  }
                ],
                initialValue: VNFTest.name
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          :label="replaceCurrentTabValue(currentTab) + ' Type'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 8 }"
        >
          <a-select
            style="width: 150px"
            class="form__select"
            :getPopupContainer="
              triggerNoder => {
                return triggerNoder.parentNode || document.body
              }
            "
            :disabled="spin"
            v-decorator="[
              'type',
              { rules: [{ required: true }], initialValue: initNVFTypeValue }
            ]"
          >
            <a-select-option
              v-for="types in VNFOptions"
              :key="types.code"
              :value="types.code"
              >{{ types.dictLabel }}</a-select-option
            >
          </a-select>
          <a-spin :spinning="spin">
            <a-icon
              slot="indicator"
              type="loading-3-quarters"
              size="small"
              spin
            />
          </a-spin>
        </a-form-item>
        <a-form-item
          :label="replaceCurrentTabValue(currentTab) + ' Vendor'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'vendor',
              {
                rules: [{ required: true, message: 'Vendor is required' }],
                initialValue: VNFTest.vendor
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="Version"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="[
              'version',
              {
                rules: [{ required: true, message: 'Version is required' }],
                initialValue: VNFTest.version
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="Upload CSAR File"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-upload-dragger
            action="/portal/business/files/upload"
            :remove="handleRemove"
            @change="handleChange"
            class="form__upload-float"
            name="file"
            v-decorator="[
              'upload',
              { valuePropName: 'fileList', getValueFromEvent: normFile }
            ]"
          >
            <p class="ant-upload-text form__upload-text--font-size">
              <a-icon type="upload" />&nbsp;&nbsp;&nbsp;
              <span>Click or drag to upload</span>
            </p>
          </a-upload-dragger>
          <a-spin :spinning="uploading" class="skip-size form__skip-float">
            <a-icon
              slot="indicator"
              type="loading-3-quarters"
              size="small"
              spin
            />
          </a-spin>
          <br />
          <span
            v-if="isEdit && editUploadtextShow"
            class="form__uploadtext-height"
            >{{ currentFilename }}</span
          >
        </a-form-item>
        <a-form-item
          label="Address"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
          required
        >
          <a-form-item
            :style="{
              display: 'inline-block',
              width: 'calc(70% - 12px)',
              margin: '0 5px 0 0'
            }"
          >
            <a-input
              v-decorator="[
                'ip',
                { rules: [{ validator: checkIp }], initialValue: VNFTest.ip }
              ]"
              @change="changeIp"
            />
          </a-form-item>
          <span>:</span>
          <a-form-item
            :style="{
              display: 'inline-block',
              width: 'calc(30% - 12px)',
              margin: '0 0 0 5px '
            }"
          >
            <a-input
              v-decorator="[
                'port',
                {
                  rules: [{ required: true, message: 'Port is required' }],
                  initialValue: VNFTest.port
                }
              ]"
              onkeyup="this.value=this.value.replace(/\D/g,'')"
            />
          </a-form-item>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit" :disabled="uploading"
            >Submit</a-button
          >
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script type="text/ecmascript-6">
import moment from "moment";
import { TestSUTTabs } from "./constant";
import { axiosCancelToken } from "../../../utils/http";
import util from "../../../utils/utils";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      selected: "",
      count: 0,
      spin: true,
      initNVFTypeValue: null,
      uploading: false,
      uploadAliasFilename: "",
      currentFilename: "",
      editUploadtextShow: true,
      ipCheck: {
        validateStatus: null,
        errorMsg: null,
      },
    };
  },
  computed: {
    ...mapState({
      VNFOptions: (state) => state.testSUT.VNFOptions,
      VNFTest: (state) => state.testSUT.VNFTest,
      currentTab: (state) => state.testSUT.currentTab,
      visible: (state) => state.testSUT.visible,
    }),
  },
  watch: {
    visible(val) {
      if (val) {
        // 可见
        if (!this.isEdit) {
          this.editUploadtextShow = false;
        } else {
          this.editUploadtextShow = true;
          this.uploadAliasFilename = this.VNFTest.fileName;
        }
        if (this.isEdit) {
          // 编辑时
          setTimeout(() => {
            let ip = "";
            let port = "";
            if (this.VNFTest.address) {
              ip = this.VNFTest.address.split(":")[0];
              port = this.VNFTest.address.split(":")[1]
                ? this.VNFTest.address.split(":")[1]
                : "";
            }
            this.form.setFieldsValue({
              name: this.VNFTest.name,
              vendor: this.VNFTest.vendor,
              version: this.VNFTest.version,
              type: this.VNFTest.typeCH.code,
              ip: ip,
              port: port,
            });
          }, 100);
        } else if (!this.isEdit) {
          // 创建时
          setTimeout(() => {
            this.form.setFieldsValue({
              type: this.VNFOptions.length > 0 ? this.VNFOptions[0].code : "",
            });
          }, 100);
        }
      } else {
        // 关闭时
        this.updateVNFTest({});
        // 消除图标
        this.ipCheck = {
          validateStatus: null,
          errorMsg: null,
        };
        this.form.setFieldsValue({
          name: "",
          version: "",
          vendor: "",
          type: "",
          ip: "",
          port: "",
        });
        this.uploadAliasFilename = "";
      }
    },
    VNFOptions(val) {
      if (val.length > 0) {
        this.initNVFTypeValue = val[0].code;
        this.spin = false;
      }
    },
    VNFTest(val) {
      this.currentFilename = val.fileName
        ? util.seperateStr(val.fileName)
        : val.fileName;
      if (val.code !== undefined) {
        this.initNVFTypeValue = val.code;
        this.uploadAliasFilename = val.fileName;
        this.spin = false;
      }
    },
  },
  methods: {
    ...mapActions("testSUT", ["upload", "createOrEditVNFTest"]),
    ...mapMutations("testSUT", ["updateVNFTest", "updateVisible"]),
    getPopupContainer() {},
    changeIp(e) {
      const ipReg = /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/;
      const value = e.target.value;
      if (value && value !== "") {
        if (ipReg.test(value)) {
          this.ipCheck = {
            validateStatus: "success",
            errorMsg: null,
          };
        } else {
          this.ipCheck = {
            validateStatus: "error",
            errorMsg: "Illegal ip address",
          };
        }
      } else {
        this.ipCheck = {
          validateStatus: null,
          errorMsg: null,
        };
      }
    },
    checkIp(rule, value, callback) {
      if (
        value !== "" &&
        value !== null &&
        this.ipCheck.validateStatus !== "error"
      ) {
        callback();
        return;
      } else if (value === "" || value === null) {
        callback("Ip is required");
      } else {
        callback(this.ipCheck.errorMsg);
      }
    },
    handleCancel() {
      if (!this.uploading) {
        this.handleRemove();
      }
      this.updateVisible(false);
      this.form.resetFields();
    },
    handleChange(info) {
      this.editUploadtextShow = false;
      if (info.file.response && typeof info.file.response === "object") {
        const filename = info.file.response.body.filename;
        this.uploadAliasFilename = filename ? filename : "";
      } else {
        this.uploadAliasFilename = "";
      }
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e;
      }
      if (e.fileList.length > 1) {
        e.fileList.splice(0, e.fileList.length - 1);
      }
      return e && e.fileList;
    },
    replaceCurrentTabValue(currentTab) {
      let keyWord = TestSUTTabs.find((item) => {
        return item.val === currentTab;
      }).key;
      return keyWord;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        // check
        if (!err) {
          // Did not implement the check if there is a change
          // const formData = new FormData();
          // file is optional
          const data = {
            flag: this.currentTab,
            name: values.name,
            vendor: values.vendor,
            version: values.version,
            type: values.type,
            fileName: this.uploadAliasFilename,
            address:
              values.ip && values.port ? values.ip + ":" + values.port : "",
            createTime: this.isEdit
              ? this.VNFTest.createTime
              : moment(new Date()).format("YYYY-MM-DD"),
          };
          // data.fileName = this.uploadAliasFilename;
          // if (!data.fileName) {
          //   this.$message.error("Upload file error. Please upload again!");
          //   return;
          // }
          // console.log(data, "---->上传参数");
          // if (values.upload && values.upload.length !== 0) {
          //   if (!this.isEdit || (this.isEdit && !this.editUploadtextShow)) {
          //     values.upload.forEach((file) => {
          //       formData.append("file", file);
          //     });
          //   }
          //   data.fileName = this.uploadAliasFilename;
          //   data.fileName = !this.editUploadtextShow
          //     ? values.upload[0].name
          //     : this.VNFTest.fileName;
          //   if (!data.fileAliasName) {
          //     this.$message.error("Upload file error. Please upload again!");
          //     return;
          //   }
          // }
          this.submitFormData(data);
        }
      });
    },
    handleUpload(data, formData) {
      this.uploading = true;
      this.upload({ formData, message: this.$message }).then(
        () => {
          this.submitFormData(data);
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        }
      );
    },
    submitFormData(data) {
      let { isEdit } = this;
      this.createOrEditVNFTest({
        isEdit,
        data,
      }).then(
        () => {
          this.updateVisible(false);
          this.form.resetFields();
          this.updateVNFTest({});
        },
        () => {
          this.updateVisible(false);
        }
      );
    },
    handleRemove() {
      if (this.uploading) {
        axiosCancelToken("/portal/business/files/upload").then((res) => {
          if (res.code === 200) {
            this.uploading = false;
            this.$message.success("cancel upload successfully.");
          } else {
            this.$message.error("cancel upload failed.");
          }
        });
      }
    },
    beforeUpload() {
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
.form {
  .form__select {
    width: 70%;
    margin-right: 5%;
  }
  .form__upload-text--font-size {
    font-size: 12px !important;
    line-height: 3;
    margin: 0 !important;
  }
  .form__upload-float {
    width: 85%;
    margin-right: 5%;
    float: left;
  }
  .form__skip-float {
    float: left;
    line-height: 3.5;
  }
  .form__uploadtext-height {
    width: 100%;
    line-height: 10px;
    display: inline-block;
  }
}
</style>
