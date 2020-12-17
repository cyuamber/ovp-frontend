<template>
  <a-modal v-bind:title="title" :visible="visible" :footer="null" @cancel="handleCancel">
    <template>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="Name" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['Name',{ rules: [{ required: true,}],initialValue:singleData.name }]"
          />
        </a-form-item>
        <a-form-item label="Vendor" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['Vendor',{ rules: [{ required: true,}],initialValue:singleData.vendor }]"
          />
        </a-form-item>
        <a-form-item label="Address" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['address',{ rules: [{ required: true,}],initialValue:singleData.address }]"
          />
        </a-form-item>
        <a-form-item label="User" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input
            v-decorator="['User',{ rules: [{ required: true,}],initialValue:singleData.username }]"
          />
        </a-form-item>
        <a-form-item label="Password" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input-password
            v-decorator="['Password',{ rules: [{ required: true,}],initialValue:singleData.password }]"
            type="password"
          ></a-input-password>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      title: this.isEdit ? "Edit TTMS" : "Rigister TTMS",
      count: 0
    };
  },
  computed: {
    ...mapState({
      singleData: state => state.TestInstrument.singleData,
      visible: state => state.TestInstrument.visible
    })
  },
    watch: {
        visible(val) {
            if (val) {
                setTimeout(() => {
                  if (this.isEdit) {
                    this.form.setFieldsValue({
                        Name: this.singleData.name,
                        Vendor: this.singleData.vendor,
                        address: this.singleData.address,
                        User: this.singleData.username,
                        Password: this.singleData.password
                    });
                }
                }, 100);
            } else {
                this.updateMeterSys({});
                this.form.setFieldsValue({
                    Name: "",
                    Vendor: "",
                    address: "",
                    User: "",
                    Password: ""
                });
            }
        }
    },

  methods: {
    ...mapActions("TestInstrument", ["createOrEditTestIns"]),
    ...mapMutations("TestInstrument", [
        "updateVisible",
        "updateMeterSys"
    ]),
    handleCancel() {
        this.updateVisible(false);
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let data = {
            name: values.Name,
            vendor: values.Vendor,
            address: values.address,
            username: values.User,
            password: values.Password
          };
          let { isEdit } = this;
          if (this.isEdit) data.id = this.singleData.id;
          this.createOrEditTestIns({
            isEdit,
            data
          }).then(
            () => {
                this.updateVisible(false);
                this.form.resetFields();
                this.updateMeterSys({});
            },
            () => {
                this.updateVisible(false);
            }
          );
        }
      });
    }
  },
  destroyed() {
      this.updateMeterSys({});
  }
};
</script>
