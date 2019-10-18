<template>
  <a-modal
    :title="(isEdit ? 'Edit': 'Create') + ' VNF Type'"
    v-model="showModal"
    :footer="null"
    @cancel="handleCancel"
  >
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="VNF Type Name" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['VNFTypeName', { rules: [{ required: true, message: 'Please input VNF Type Name!' }],initialValue: VnfTypeName }]"
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
import moment from "moment";
import http from "../../utils/http";
export default {
  props: ["VnfTypeName", "isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      showModal: true
    };
  },
  methods: {
    handleCancel() {
      this.$emit("close");
    },
    handleSubmit(e) {
      let url = this.isEdit ? "/updateVNFType" : "/createVNFType";
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            VNFTypeName: values.VNFTypeName,
            createTime: moment(new Date()).format("YYYY-MM-DD"),
            id: Math.ceil(Math.random() * 1000)
          };
          if (this.isEdit && this.VnfTypeName === values.VNFTypeName) {
            this.$message.warning("Please modify and submit");
            return;
          }
          if (this.isEdit && this.VnfTypeName === values.VNFTypeName) {
            this.$message.warning("Please modify and submit");
            return;
          }
          http.axiospost(url, data).then(
            res => {
              if (res.code === 200) {
                console.log(res);
                this.$message.success(
                  this.isEdit
                    ? "Successfully updated"
                    : "Has been added successfully"
                );
                this.$emit("getAllVnfType");
              } else
                this.$message.error(
                  this.isEdit ? "Update failed" : "add failed"
                );
            },
            error => {
              console.log(error);
              this.$message.error("Network exception, please try again");
            }
          );
          this.$emit("close");
        }
      });
    }
  }
};
</script>

<style scoped>
</style>
