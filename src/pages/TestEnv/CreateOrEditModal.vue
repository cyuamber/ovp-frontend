<template>
  <a-modal
    :title="(isEdit ? 'Edit ': 'Register ') + currentTab"
    v-model="visible"
    :footer="null"
    @cancel="handleCancel"
    centered
  >
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <div v-if="currentTab === 'VIM ENV'">
          <a-form-item
            v-for="(item,i) in VIMForm"
            :key="i"
            :label="item.title"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: (item.title === 'Cloud Type' || item.title === 'Cloud Region ID')? 8:12 }"
          >
            <a-input
              v-if="item.title !== 'Cloud Type' && item.title !== 'Password'"
              v-decorator="[
				item.key,
				{ rules: [{ required: item.key !== 'sslCacert'?true:false, message: item.title +' is required' }], initialValue: initValues[item.key] },
				]"
            />
            <a-input-password
              v-if="item.title === 'Password'"
              type="password"
              v-decorator="[
				item.key,
				{ rules: [{ required: true, message: item.title +' is required' }], initialValue: initValues[item.key] },
				]"
            ></a-input-password>

            <a-select
              v-if="item.title === 'Cloud Type'"
              v-decorator="[item.key,{ rules: [{ required: true }], initialValue: initCloudType.name}]"
              :disabled="cloudTypeOptions.length ===0"
              class="select"
            >
              <a-select-option
                v-for="type in cloudTypeOptions"
                :key="type.code"
                :value="type.code"
              >{{type.dictLabel}}</a-select-option>
            </a-select>

            <a-spin :spinning="cloudTypeOptions.length ===0" v-if="item.title === 'Cloud Type'">
              <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
            </a-spin>
          </a-form-item>
        </div>
        <div v-else-if="currentTab === 'VNFM ENV'">
          <a-form-item
            v-for="(item,i) in VNFMForm"
            :key="i"
            :label="item.title"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 12}"
          >
            <a-input
              v-if="item.title !== 'Password'"
              v-decorator="[
				item.key,
				{ rules: [{ required: (item.title !== 'Certificate URL' && item.title !== 'User Name') ? true:false, message: item.title +' is required' }], initialValue: initValues[item.key] },
				]"
            />
            <a-input-password
              v-if="item.title === 'Password'"
              type="password"
              v-decorator="[
				item.key,
				{ initialValue: initValues[item.key] },
				]"
            ></a-input-password>
          </a-form-item>
        </div>
        <div v-else-if="currentTab === 'MANO ENV'"></div>
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script type="text/ecmascript-6">
import { VIMForm, VNFMForm } from "../../const/constant";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      VIMForm: VIMForm,
      VNFMForm: VNFMForm,
      VIMCount: 0,
      VNFMCount: 0,
      initCloudType: {
        name: null,
        code: null
      }
    };
  },
  computed: {
    ...mapState({
      currentTab: state => state.testENV.currentTab,
      cloudTypeOptions: state => state.testENV.cloudTypeOptions,
      initValues: state => state.testENV.initValues,
      visible: state => state.testENV.visible
    }),
    visible: {
      get() {
        return this.$store.state.testENV.visible;
      },
      set(val) {
        if (!val) {
          let list =
            this.currentTab === "VIM ENV" ? this.VIMForm : this.VNFMForm;
          this.initCloudType = { name: null, code: null };
          this.setInitValues({});
          list.forEach(item => {
            this.form.setFieldsValue({ [item.key]: "" });
          });
        }
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = this.$form.createForm(this);
        if (this.currentTab === "VIM ENV") {
          this.VIMCount++;
          if (!this.isEdit && this.VIMCount > 1) {
            // this.form.setFieldsValue({cloudType: this.cloudTypeOptions[0].code})
            this.initCloudType = {
              name: this.cloudTypeOptions[0].dictLabel,
              code: this.cloudTypeOptions[0].code
            };
          } else if (this.isEdit && this.VIMCount > 1) {
            this.initCloudType = {
              name: this.initValues.cloudTypeCH.dictLabel,
              code: this.initValues.cloudTypeCH.code
            };
            // this.form.setFieldsValue({cloudType: this.initValues.cloudTypeCH.dictLabel})
          }
        }
      }
    },
    cloudTypeOptions(val) {
      if (val.length) {
        if (!this.isEdit) {
          this.initCloudType = {
            name: val[0].dictLabel,
            code: val[0].code
          };
        }
      }
    },
    initValues(val) {
      if (this.currentTab === "VIM ENV") {
        if (Object.keys(val).length > 0) {
          this.initCloudType = {
            name: val.cloudTypeCH.dictLabel,
            code: val.cloudType
          };
        }
      }
    }
  },
  methods: {
    ...mapActions("testENV", ["loginVIN"]),
    ...mapMutations("testENV", [
      "setFilterItem",
      "setInitValues",
      "updateVisible"
    ]),
    handleCancel() {
      this.updateVisible(false);
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          // Did not implement the check if there is a change
          let data = {};
          if (this.currentTab === "VIM ENV") {
            this.VIMForm.forEach(item => {
              if (item.title === "Cloud Type") {
                data[item.key] =
                  values[item.key] === this.initCloudType.name
                    ? this.initCloudType.code
                    : values[item.key];
              } else data[item.key] = values[item.key];
            });
          } else {
            this.VNFMForm.forEach(item => {
              data[item.key] = values[item.key];
            });
          }
          this.updateVisible(false);
          this.loginVIN({
            isEdit: this.isEdit,
            data
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.select {
  width: 70%;
  margin-right: 10%;
}
</style>
