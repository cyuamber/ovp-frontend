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
        <div v-else-if="currentTab === 'MANO ENV'">
          <a-form-item
                  v-for="(item,i) in MANOForm"
                  :key="i"
                  :label="item.title"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: item.title === 'MANO Type'? 8:12 }"
          >
            <a-input
                    v-if="item.title !== 'MANO Type'"
                    v-decorator="[
				item.key,
				{ rules: [{ required: true, message: item.title +' is required' }], initialValue: initValues[item.key] },
				]"
            />
            <a-select
                    v-if="item.title === 'MANO Type'"
                    v-decorator="[item.key,{ rules: [{ required: true }], initialValue: initCloudType.name}]"
                    :disabled="cloudTypeOptions.length ===0"
                    class="select"
                    @change="handleMANOTypeChange"
            >
              <a-select-option
                      v-for="type in cloudTypeOptions"
                      :key="type.dictValue"
                      :value="type.dictValue"
              >{{type.dictLabel}}</a-select-option>
            </a-select>

            <a-spin :spinning="cloudTypeOptions.length ===0" v-if="item.title === 'MANO Type'">
              <a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
            </a-spin>
          </a-form-item>
         <div v-if="onapProfilesShow" >
            <span class="onap-border"></span>
           <a-form-item
                   label="MANO Profile"
                   :colon="false"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 12 }"
           >
             <a-button type="primary" class="add-btn" @click="handleAdd">
               <a-icon type="plus" />add profile setting
             </a-button>
           </a-form-item>
           <a-form-item
                   v-for="(item,i) in MANOONAPForm"
                   :key="i"
                   :label="item.key"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 12 }"
           >
             <a-input
                     v-decorator="[
				item.value,
				{ rules: [{ required: true, message: item.title +' is required' }], initialValue: initOnapDefaultProfiles[item.value] },
				]"
             />
           </a-form-item>
               <a-table
                       v-if="onapProfileDataSource.length>0"
                       :columns="columns"
                       :dataSource="onapProfileDataSource"
                       rowKey="customParamsNumber"
                       :bordered="false"
                       :showHeader="false"
                       :pagination="false"
                       class="onap-profile-table"
               >
                  <span slot="key" slot-scope="key,record">
                      <a-input
                              class="equipment-input"
                              v-model="record.key"
                              @change="(() => onChangeSelectInput(record.key,record,'key'))"
                      /> :
                  </span>
                   <span slot="value" slot-scope="value,record">
                      <a-input
                              class="equipment-input"
                              v-model="record.value"
                              @change="(() => onChangeSelectInput(record.value,record,'value'))"
                      />
                  </span>
                   <span slot="action" slot-scope="action,record">
                        <a-icon type="minus-circle"
                                @click="(() => handleDeleteONAPProfile(record))"
                        />
                   </span>
               </a-table>
         </div>
        </div>
        <a-form-item :wrapper-col="{ span: 12, offset: 10 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </template>
  </a-modal>
</template>

<script type="text/ecmascript-6">
import { VIMForm, VNFMForm, MANOForm, MANOONAPForm, customProfiles } from "../../const/constant";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  props: ["isEdit"],
  data() {
    return {
      form: this.$form.createForm(this),
      VIMForm: VIMForm,
      VNFMForm: VNFMForm,
      MANOForm: MANOForm,
      MANOONAPForm: MANOONAPForm,
      columns: customProfiles,
      VIMCount: 0,
      VNFMCount: 0,
      MANOCount: 0,
      initCloudType: {
        name: null,
        code: null
      },
      onapProfilesShow: false,
      customParamsNumber: 0,
      onapProfileDataSource: [],
    initOnapDefaultProfiles:{}
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
            this.currentTab === "VIM ENV" ? this.VIMForm : this.currentTab === "VNFM ENV"?this.VNFMForm : this.MANOForm;
          this.initCloudType = { name: null, code: null };
          this.onapProfilesShow = false;
          this.onapProfileDataSource = [];
          this.customParamsNumber = 0;
          this.initOnapDefaultProfiles = {};
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
        }else if (this.currentTab === "MANO ENV") {
            this.MANOCount++;
            if (!this.isEdit && this.MANOCount > 1) {
                this.initCloudType = {
                    name: this.cloudTypeOptions[0].dictLabel,
                    code: this.cloudTypeOptions[0].dictValue
                };
                this.customParamsNumber = 0;
                this.onapProfileDataSource = [];
            } else if (this.isEdit && this.MANOCount > 1) {
                this.initCloudType = {
                    name: this.initValues.monoType,
                    code: this.keyValueConversion(this.initValues.monoType,this.cloudTypeOptions)
                };
                this.onapProfileDataSource = [];
                this.customParamsNumber = 0;
                this.initValues.profiles.map(item=>{
                    if(item.edit === true){
                        this.customParamsNumber++;
                        this.onapProfileDataSource.push(item)
                    }else {
                        this.initOnapDefaultProfiles[item.key] = item.value
                    }
                });
                if(this.onapProfileDataSource.length>0){
                    this.onapProfileDataSource.map((item,index)=>{
                        item.customParamsNumber = index;
                        return item
                    })
                }
                console.log(this.initValues,this.onapProfileDataSource,this.customParamsNumber,"----1111")
            }
            if(this.initCloudType.name.toUpperCase() === 'ONAP'){
                this.onapProfilesShow = true;
            }else {
                this.onapProfilesShow = false;
            }
        }
      }
    },
    cloudTypeOptions(val) {
      if (val.length) {
        if (!this.isEdit) {
          this.initCloudType = {
            name: val[0].dictLabel,
            code: this.currentTab === "MANO ENV"?val[0].dictValue:val[0].code
          };
          if(this.initCloudType.name.toUpperCase() === 'ONAP'){
              this.onapProfilesShow = true;
          }else {
              this.onapProfilesShow = false;
          }
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
      }else if (this.currentTab === "MANO ENV") {
          if (Object.keys(val).length > 0) {
              this.initCloudType = {
                  name: val.monoType,
                  code: this.keyValueConversion(val.monoType,this.cloudTypeOptions)
              };
              if(this.initCloudType.name.toUpperCase() === 'ONAP'){
                  this.onapProfilesShow = true;
                  this.onapProfileDataSource = [];
                  this.customParamsNumber = 0;
                  val.profiles.map(item=>{
                      if(item.edit === true){
                          this.customParamsNumber++;
                          this.onapProfileDataSource.push(item)
                      }else {
                          this.initOnapDefaultProfiles[item.key] = item.value
                      }
                  });
                  if(this.onapProfileDataSource.length>0){
                      this.onapProfileDataSource.map((item,index)=>{
                          item.customParamsNumber = index;
                          return item
                      })
                  }
                  console.log(this.initValues,this.onapProfileDataSource,this.customParamsNumber,"----2222")
              }else {
                  this.onapProfilesShow = false;
              }
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
          } else if (this.currentTab === "VNFM ENV") {
            this.VNFMForm.forEach(item => {
              data[item.key] = values[item.key];
            });
          }else {
              console.log(values,this.initCloudType,"----values");
              this.MANOForm.forEach(item => {
                  if (item.title === "MANO Type") {
                      data[item.key] =
                          values[item.key] === this.initCloudType.name
                              ? this.initCloudType.code
                              : values[item.key];
                  } else data[item.key] = values[item.key];
              });
              data['profiles'] = [];
              this.MANOONAPForm.forEach(item => {
                  data['profiles'].push({
                      key:item.value,
                      value:values[item.value],
                      edit:false
                  })
              });
              if(this.onapProfileDataSource.length>0){
                  this.onapProfileDataSource.forEach(item => {
                      data['profiles'].push({
                          key:item.key,
                          value:item.value,
                          edit:true
                      })
                  });
              }
              console.log(data,this.onapProfileDataSource,"----data----onapProfileDataSource")
          }
          this.updateVisible(false);
          this.loginVIN({
            isEdit: this.isEdit,
            data
          });
        }
      });
    },
    keyValueConversion(val,options){
        if (val && options.length>0){
            return options.find(item=>{
                return item.dictLabel === val
            }).dictValue
        }
    },
      valueKeyConversion(val,options){
        if (val && options.length>0){
            return options.find(item=>{
                return item.dictValue === val
            }).dictLabel
        }
    },
    handleMANOTypeChange(val){
        let manoName = this.valueKeyConversion(val,this.cloudTypeOptions);
        if(manoName.toUpperCase() !== 'ONAP'){
            this.onapProfilesShow = false;
            this.onapProfileDataSource = [];
        }else {
            this.onapProfilesShow = true
        }
    },
    handleAdd() {
        const {  customParamsNumber,onapProfileDataSource } = this;
        const newData = {
            customParamsNumber: customParamsNumber,
            key:'',
            value:'',
            edit:true
        };
        this.onapProfileDataSource = [...onapProfileDataSource, newData];
        this.customParamsNumber = customParamsNumber + 1;
    },
    handleDeleteONAPProfile(record){
        const onapProfileDataSource = [...this.onapProfileDataSource];
        this.onapProfileDataSource = onapProfileDataSource.filter(item => item.customParamsNumber !== record.customParamsNumber);
    },
  onChangeSelectInput(val, record, type) {
      record[type] = val;
      this.onapProfileDataSource[record.customParamsNumber] = record;
      this.onapProfileDataSource = [...this.onapProfileDataSource];
  },
  }
};
</script>

<style lang="less" >
.select {
  width: 70%;
  margin-right: 10%;
}
.onap-border{
  width: 90%;
  margin: 0 5%;
  text-align: center;
  display: inline-block;
  border-top: 1px #ababab dashed;
}
.onap-profile-table{
    margin-top:-20px;
    margin-bottom: 20px;
    table{
            tr.ant-table-row >td{
                border: none!important;
            }

    }
    .equipment-input{
        width: 90%;
    }
}
.ant-checkbox-group{
    .ant-card-grid:hover{
        z-index: 0!important;
    }
}
</style>
