<template>
  <a-modal v-bind:title="this.isEdit ? 'Edit ' + (this.currentTab === 101?'VNF':'PNF') + ' TT' : 'Create ' + (this.currentTab === 101?'VNF':'PNF') + 'TT'" v-model="showModal" :footer="null" @cancel="handleCancel">
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          :label="(this.currentTab === 101?'VNF':'PNF')+' Name'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="['XNFName',{ rules: [{ required: true,message: (this.currentTab === 101?'VNF':'PNF') +' Name is required' }],initialValue:SuiteSingleData.name }]"
          />
        </a-form-item>
        <a-form-item
          :label="(this.currentTab === 101?'VNF':'PNF')+'  Type'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 8 }"
        >
          <a-select
            :disabled="spin"
            class="select"
            v-decorator="['XNFType',{ rules: [{ required: true, message: (this.currentTab === 101?'VNF':'PNF') +' Type is required' }],initialValue:isEdit?SuiteSingleData.typeCH.dictLabel : this.VNFOptions[0].code}]"
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
          :label="(this.currentTab === 101?'VNF':'PNF')+' Vendor'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="['XNFVendor',{ rules: [{ required: true, message: (this.currentTab === 101?'VNF':'PNF') +' Vendor is required' }],initialValue:SuiteSingleData.vendor }]"
          />
        </a-form-item>
        <a-form-item
          :label="(this.currentTab === 101?'VNF':'PNF')+' Version'"
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-input
            v-decorator="['Version',{ rules: [{ required: true, message: (this.currentTab === 101?'VNF':'PNF') +' Version is required' }],initialValue:SuiteSingleData.version }]"
          />
        </a-form-item>
        <a-form-item label="Upload CSAR File" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-upload-dragger
            class="upload-float"
            :remove="handleRemove"
            :beforeUpload="beforeUpload"
            name="files"
            v-decorator="['upload',{valuePropName: 'fileList',getValueFromEvent: normFile,rules: [{ required: true,}]}]"
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
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit" :disabled="disabled">Submit</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script type="text/ecmascript-6">
    import {mapState, mapActions} from "vuex";
    import {axiosCancelToken} from '../../utils/http'
    export default {
        props: ['isEdit', 'visible'],
        data() {
            return {
                form: this.$form.createForm(this),
                showModal: true,
                spin: false,
                count: 0,
                disabled: false,
                initNVFTypeValue: null,
                editUploadtextShow: true
            }
        },
        computed: {
            ...mapState({
                VNFOptions: state => state.VnfpnfSuite.VNFOptions,
                SuiteSingleData: state => state.VnfpnfSuite.SuiteSingleData,
                currentTab: state => state.VnfpnfSuite.currentTab,
            })
        },
        watch: {
            visible(val) {
                console.log(val, "-----");
                if (val) {
                    if (!this.isEdit) {
                        this.editUploadtextShow = false;
                    } else {
                        this.editUploadtextShow = true;
                    }
                    this.showModal = val;
                    this.count++;
                    if (!this.showModal.length && this.isEdit && this.count > 1) {
                        this.form.setFieldsValue({
                            XNFName: this.SuiteSingleData.name,
                            XNFType: this.SuiteSingleData.type,
                            XNFVendor: this.SuiteSingleData.vendor,
                            Version: this.SuiteSingleData.version,
                            type: this.SuiteSingleData.code
                        })
                    }
                    if (!this.showModal.length && !this.isEdit) {
                        this.spin = true;
                        this.initNVFTypeValue = this.VNFOptions[0].code;
                        console.log(this.initNVFTypeValue, "--------")
                    }
                }
            },
            showModal(val) {
                if (!val) {
                    this.$emit('close');
                    this.clearOptions();
                    this.getTestMeter({});
                    this.form.setFieldsValue({XNFName: '', XNFType: '', XNFVendor: '', Version: '', type: ''})
                }
            },
            VNFOptions(val) {
                if (val.length) {
                    this.spin = false
                }
                if (val.length && !this.isEdit) {
                    this.initNVFTypeValue = val[0].code;
                    console.log(this.initNVFTypeValue, "this.initNVFTypeValue")
                }
            },
            SuiteSingleData(val) {
                if (val.code !== undefined) {
                    this.initNVFTypeValue = val.code;
                    this.spin = false;
                }
            }
        },
        methods: {
            ...mapActions("VnfpnfSuite", [
                "getTestMeter",
                "getVNFOptions",
                "clearOptions",
                "uploadVNFFile",
                "createOrEditTestMeter"
            ]),
            normFile(e) {
                if (Array.isArray(e)) {
                    return e;
                }
                if (e.fileList.length > 1) {
                    e.fileList.splice(0, e.fileList.length - 1)
                }
                return e && e.fileList;
            },
            handleRemove() {
                if (this.disabled) {
                    axiosCancelToken("/uploadVNFFile").then(res => {
                        if (res.code === 200) {
                            this.disabled = false;
                            this.$message.success('cancel upload successfully.');
                        } else {
                            this.$message.error('cancel upload failed.');
                        }
                    });
                }
            },
            beforeUpload() {
                return false;
            },
            handleUpload(data, formData) {
                this.disabled = true;
                this.uploadVNFFile({formData, message: this.$message})
                    .then(
                    () => { this.submitFormData(data)},
                    () => { this.disabled = false;}
                    );
            },
            handleCancel() {
                if (!this.disabled) {
                    this.handleRemove();
                }
                this.$emit('close');
            },
            handleSubmit() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        const formData = new FormData();
                        console.log(formData, "formData")
                        if (!this.isEdit || (this.isEdit && !this.editUploadtextShow)) {
                            formData.append("file", values.upload[0]);
                        }
                        let data = {
                            flag: this.currentTab,
                            name: values.XNFName,
                            type: values.XNFType,
                            vendor: values.XNFVendor,
                            version: values.Version,
                            // fileName:"test.casr"
                            fileName: !this.editUploadtextShow ? values.upload[0].name : this.SuiteSingleData.fileName
                        };
                        // this.submitFormData(data)
                        if (this.isEdit && this.editUploadtextShow) this.submitFormData(data);
                        else this.handleUpload(data, formData)
                    }
                });

            },
            submitFormData(data) {
                this.createOrEditTestMeter({isEdit: this.isEdit, data})
                    .then(() => {
                        this.$emit('close');
                    }, () => {
                        this.$emit('close');
                    })

            }
        }
    }
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
</style>
