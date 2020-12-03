<template>
  <a-modal
    v-bind:title="this.isEdit ? 'Edit ' + (currentTab === 101?'VNF':'PNF') + ' TT' : 'Create ' + (currentTab === 101?'VNF':'PNF') + ' TT'"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
  >
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :label="(currentTab === 101?'VNF':'PNF')+' Name'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="['XNFName',{ rules: [{ required: true,message: (currentTab === 101?'VNF':'PNF') +' Name is required' }],initialValue:SuiteSingleData.name }]"
          />
        </a-form-item>
        <a-form-item
          :label="(currentTab === 101?'VNF':'PNF')+'  Type'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 8 }"
        >
          <a-select
            :disabled="spin"
            class="select"
            v-decorator="['XNFType',{ rules: [{ required: true, message: (currentTab === 101?'VNF':'PNF') +' Type is required' }],initialValue:initNVFTypeValue}]"
          >
            <a-select-option
              v-for="types in VNFOptions"
              :key="types.code"
              :value="types.code"
            >{{types.dictLabel}}</a-select-option>
          </a-select>
          <a-spin :spinning="spin" class="skip-size">
            <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
          </a-spin>
        </a-form-item>
        <a-form-item
          :label="(currentTab === 101?'VNF':'PNF')+' Vendor'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="['XNFVendor',{ rules: [{ required: true, message: (currentTab === 101?'VNF':'PNF') +' Vendor is required' }],initialValue:SuiteSingleData.vendor }]"
          />
        </a-form-item>
        <a-form-item
          :label="(currentTab === 101?'VNF':'PNF')+' Version'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="['Version',{ rules: [{ required: true, message: (currentTab === 101?'VNF':'PNF') +' Version is required' }],initialValue:SuiteSingleData.version }]"
          />
        </a-form-item>
        <a-form-item label="Upload CSAR File" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-upload-dragger
            enctype="multipart/form-data"
            class="upload-float"
            action="/portal/business/files/upload"
            :remove="handleRemove"
            @change="handleChange"
            name="file"
            v-decorator="['upload',{valuePropName: 'fileList',getValueFromEvent: normFile}]"
          >
            <p class="ant-upload-text form__upload-text--font-size">Click or drag to upload</p>
          </a-upload-dragger>
          <a-spin :spinning="disabled" class="skip-size skip-float">
            <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
          </a-spin>
          <br />
          <span
            v-if="isEdit && editUploadtextShow"
            class="form__uploadtext-height"
          >{{SuiteSingleData.fileName}}</span>
        </a-form-item>
        <a-form-item
          label="Manage System"
          v-if="currentTab === 101"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 8 }"
        >
          <a-select
            :disabled="spin"
            class="select"
            v-decorator="['manage',{ rules: [{ required: true, message: 'Manage System is required' }],initialValue: initManageSystemValue}]"
          >
            <a-select-option
              v-for="system in SystemOptions"
              :key="system.id"
              :value="system.id"
            >{{system.name}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit" :disabled="disabled">Submit</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { axiosCancelToken } from "../../../utils/http";
export default {
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      spin: false,
      count: 0,
      disabled: false,
      uploadAliasFilename: "",
      initNVFTypeValue: null,
      initManageSystemValue: null,
      editUploadtextShow: true
    };
  },
  mounted() {
    this.getSystemOptions();
  },
  computed: {
    ...mapState({
      VNFOptions: state => state.VnfpnfSuite.VNFOptions,
      SystemOptions: state => state.VnfpnfSuite.SystemOptions,
      SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
      currentTab: state => state.VnfpnfSuite.currentTab,
      visible: state => state.VnfpnfSuite.visible
    })
  },
  watch: {
    visible(val) {
        if (val) {
            if (!this.isEdit) {
                this.editUploadtextShow = false;
            } else {
                this.editUploadtextShow = true;
            }
            this.count++;
            if (this.isEdit && this.count > 1) {
                this.form.setFieldsValue({
                    XNFName: this.SuiteSingleData.name,
                    XNFType: this.SuiteSingleData.typeCH.code,
                    XNFVendor: this.SuiteSingleData.vendor,
                    Version: this.SuiteSingleData.version,
                    manage: this.SuiteSingleData.instrumentMgs.id
                });
            } else if (
                this.VNFOptions.length !== 0 &&
                !this.isEdit &&
                this.count > 1
            ) {
                this.form.setFieldsValue({ XNFType: this.VNFOptions[0].code });
            }
        }else{
            this.updateVNFTest({});
            this.form.setFieldsValue({
                XNFName: "",
                XNFType: "",
                XNFVendor: "",
                Version: ""
            });
        }
    },
    VNFOptions(val) {
      if (val.length) {
        this.spin = false;
      }
      if (val.length !== 0 && !this.isEdit) {
        this.initNVFTypeValue = val[0].code;
      }
    },
    SystemOptions(val) {
      if (val.length && !this.isEdit) {
        this.initManageSystemValue = val[0].id;
      }
    },
    SuiteSingleData(val) {
      if (Object.keys(val).length > 0) {
        this.initNVFTypeValue = val.type;
        this.uploadAliasFilename = val.fileAliasName;
        this.initManageSystemValue = val.instrumentMgs.id;
        this.spin = false;
      }
    },
    currentTab() {
      this.initNVFTypeValue = null;
    }
  },
  methods: {
    ...mapActions("VnfpnfSuite", [
      "getSystemOptions",
      "clearOptions",
      "uploadVNFFile",
      "createOrEditTestMeter"
    ]),
    ...mapMutations("VnfpnfSuite", [
      "updateVNFTest",
      "updateVisible",
      "updateVNFOptions"
    ]),
    handleChange(info) {
      this.editUploadtextShow = false;
      this.uploadAliasFilename = info.file.response
        ? info.file.response.body.filename
        : "";
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
    handleRemove() {
      if (this.disabled) {
        axiosCancelToken("/portal/business/files/upload").then(res => {
          if (res.code === 200) {
            this.disabled = false;
            this.$message.success("cancel upload successfully.");
          } else {
            this.$message.error("cancel upload failed.");
          }
        });
      }
    },
    handleUpload(data, formData) {
      this.disabled = true;
      this.uploadVNFFile({ formData, message: this.$message }).then(
        () => {
          this.submitFormData(data);
        },
        () => {
          this.disabled = false;
        }
      );
    },
    handleCancel() {
      this.updateVisible(false);
      if (!this.disabled) {
        this.handleRemove();
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          const formData = new FormData();
          if (!this.isEdit || (this.isEdit && !this.editUploadtextShow)) {
            formData.append("file", values.upload[0]);
          }
          let data = {
            flag: this.currentTab,
            name: values.XNFName,
            type: values.XNFType,
            vendor: values.XNFVendor,
            version: values.Version,
            fileAliasName: this.uploadAliasFilename,
            fileName: !this.editUploadtextShow
              ? values.upload[0].name
              : this.SuiteSingleData.fileName
          };
          if (this.currentTab === 101) {
            Object.assign(data, { instrumentMgsId: values.manage });
          }
          // console.log(data, "===>params");
          if (this.isEdit) data.id = this.SuiteSingleData.id;
          if (!data.fileName || !data.fileAliasName) {
            this.$message.error("Upload file error. Please upload again!");
          } else {
            this.submitFormData(data);
          }
        }
      });
    },
    submitFormData(data) {
      this.createOrEditTestMeter({
        isEdit: this.isEdit,
        data,
        message: this.$message.success("Sumbit successfully")
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
    }
  }
};
</script>

<style scoped>
.form__upload-text--font-size {
  font-size: 12px !important;
  line-height: 3;
  margin: 0 !important;
}

.select {
  width: 70%;
  margin-right: 5%;
}

.upload-float {
  width: 85%;
  margin-right: 5%;
  float: left;
}

.skip-float {
  float: left;
  line-height: 3.5;
}
.form__uploadtext-height {
  display: inline-block;
  line-height: 20px;
}
.ant-modal-body {
  background: chartreuse;
}
</style>
