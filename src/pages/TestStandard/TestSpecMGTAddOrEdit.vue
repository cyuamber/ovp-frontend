<template>
  <a-modal v-bind:title="title" v-model="visible" :footer="null" @cancel="handleCancel">
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="Name" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['Name',{ rules: [{ required: true,message:' Name is required'}],initialValue:testSpecSingleData.name }]"
          />
        </a-form-item>
        <a-form-item label="Version" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['Version',{ rules: [{ required: true,message:' Version is required'}],initialValue:testSpecSingleData.version }]"
          />
        </a-form-item>
        <a-form-item label="SUT Type" :label-col="{ span: 7 }" :wrapper-col="{ span: 11 }">
          <a-select
            class="select"
            v-decorator="['SUTType',{ rules: [{ required: true}],initialValue:initSUTTypeValue}]"
            @change="handleSelectSUTChange"
          >
            <a-select-option
              v-for="type of SUTOptions"
              :key="type.code"
              :value="type.code"
            >{{type.dictLabel}}</a-select-option>
          </a-select>
          <a-spin :spinning="spin">
            <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
          </a-spin>
        </a-form-item>
          <a-form-item label="Sub SUT type" :label-col="{ span: 7 }" :wrapper-col="{ span: 11 }">
              <a-select
                      class="select"
                      v-decorator="['VNFType',{ rules: [{ required: true, }],initialValue:initVNFtypeValue}]"
                      @dropdownVisibleChange="dropdownVisibleChange"
              >
                  <a-select-option
                          v-for="type in VNFOptions"
                          :key="type.code"
                          :value="type.code"
                  >{{type.dictLabel}}</a-select-option>
              </a-select>
          </a-form-item>
        <a-form-item label="Sub SUT Type" :label-col="{ span: 7 }" :wrapper-col="{ span: 11 }">
          <a-select
            class="select"
            v-decorator="['VNFType',{ rules: [{ required: true, }],initialValue:initVNFtypeValue}]"
            @dropdownVisibleChange="dropdownVisibleChange"
          >
            <a-select-option
              v-for="type in VNFOptions"
              :key="type.code"
              :value="type.code"
            >{{type.dictLabel}}</a-select-option>
          </a-select>
        </a-form-item>
>>>>>>> origin
        <a-form-item label="Publish ORG" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['PublishORG',{ rules: [{ required: true,message:' PublishORG is required'}],initialValue:testSpecSingleData.publishOrg }]"
          />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script type="text/ecmascript-6">
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      showModal: true,
      title: this.isEdit ? "Edit Spec" : "Add Spec",
      spin: false,
      initSUTTypeValue: null,
      initVNFtypeValue: null,
      count: 0
    };
  },
  computed: {
    ...mapState({
      SUTOptions: state => state.testSpecMGT.SUTOptions,
      VNFOptions: state => state.testSpecMGT.VNFOptions,
      testSpecSingleData: state => state.testSpecMGT.testSpecSingleData
    }),
    visible: {
      get() {
        return this.$store.state.testSpecMGT.visible;
      },
      set(val) {
        if (!val) {
          this.clearOptions();
          this.getTestSpec({});
          this.form.setFieldsValue({
            Name: "",
            Version: "",
            SUTType: "",
            VNFType: "",
            PublishORG: ""
          });
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.count++;
        if (this.isEdit && this.count > 1) {
          this.form.setFieldsValue({
            Name: this.testSpecSingleData.name,
            Version: this.testSpecSingleData.version,
            SUTType: this.testSpecSingleData.sutTypeCH.code,
            VNFType: this.testSpecSingleData.vnfTypeCH.code,
            PublishORG: this.testSpecSingleData.publishOrg
          });
        } else if (!this.isEdit && this.count > 1) {
          this.spin = true;
          this.initSUTTypeValue = this.SUTOptions[0].code;
          this.initVNFtypeValue = this.VNFOptions[0].code;
          console.log(
            this.initSUTTypeValue,
            this.initVNFtypeValue,
            " this.initVNFtypeValue---"
          );
        }
      }
    },
    SUTOptions(val) {
      if (val.length) {
        this.spin = false;
      }
      if (val.length && !this.isEdit) {
        this.initSUTTypeValue = this.SUTOptions[0].code;
      }
    },
    VNFOptions(val) {
      if (val.length) {
        this.spin = false;
      }
      if (val.length && !this.isEdit) {
        this.initVNFtypeValue = this.VNFOptions[0].code;
      }
    },
    testSpecSingleData(val) {
      if (Object.keys(val).length > 0) {
        this.initSUTTypeValue = val.sutTypeCH.code;
        this.initVNFtypeValue = val.vnfTypeCH.code;
        this.spin = false;
      }
    }
  },
  methods: {
    ...mapActions("testSpecMGT", [
      "clearOptions",
      "getTestSpec",
      "getVNFOptions",
      "createOrEditTestSpec"
    ]),
    ...mapMutations("testSpecMGT", ["updateVisible"]),
    handleSelectSUTChange(val) {
      this.spin = true;
      this.getVNFOptions({ STUType: val }).then(() => {
        if (this.VNFOptions.length > 0)
          this.form.setFieldsValue({ VNFType: this.VNFOptions[0] });
      });
    },
    dropdownVisibleChange() {
      if (!this.VNFOptions.length) {
        this.spin = true;
        this.getVNFOptions({
          SUTType: this.testSpecSingleData.sutTypeCH.code
        });
      }
    },
    handleCancel() {
      this.updateVisible(false);
    },
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            name: values.Name,
            version: values.Version,
            sutType: values.SUTType,
            vnfType: values.VNFType,
            publishOrg: values.PublishORG
          };
          let { isEdit } = this;
          this.createOrEditTestSpec({ isEdit, data }).then(
            () => {
              this.form.resetFields();
              this.getTestSpec({});
              this.updateVisible(false);
            },
            () => {
              this.updateVisible(false);
            }
          );
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.select {
  width: 40%;
  margin-right: 5%;
}
</style>