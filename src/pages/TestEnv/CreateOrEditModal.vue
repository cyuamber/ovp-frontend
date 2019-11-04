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
				v-if="item.title !== 'Cloud Type' && item.title !== 'Cloud Region ID'"
				v-decorator="[
				item.key,
				{ rules: [{ required: true, message: item.title +' is required' }], initialValue: initValues[item.key] },
				]"
			/>
			<a-select
				v-if="item.title === 'Cloud Region ID'"
				v-decorator="[item.key,{ rules: [{ required: true }],  initialValue: isEdit? initValues[item.key] :regionIdOptions[0]}]"
				:disabled="regionIdOptions.length === 0"
				class="select"
			>
				<a-select-option v-for="type in regionIdOptions" :key="type" :value="type">{{type}}</a-select-option>
			</a-select>
			<a-select
				v-if="item.title === 'Cloud Type'"
				v-decorator="[item.key,{ rules: [{ required: true }], initialValue: isEdit? initValues[item.key] : cloudTypeOptions[0]}]"
				:disabled="cloudTypeOptions.length ===0"
				class="select"
			>
				<a-select-option v-for="type in cloudTypeOptions" :key="type" :value="type">{{type}}</a-select-option>
			</a-select>
			<a-spin :spinning="regionIdOptions.length === 0" v-if="item.title === 'Cloud Region ID'">
				<a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
			</a-spin>
			<a-spin :spinning="cloudTypeOptions.length ===0" v-if="item.title === 'Cloud Type'">
				<a-icon slot="indicator" type="loading-3-quarters" size="small" spin />
			</a-spin>
			</a-form-item>
		</div>
		<div v-else>
			<a-form-item
			v-for="(item,i) in VNFMForm"
			:key="i"
			:label="item.title"
			:label-col="{ span: 8 }"
			:wrapper-col="{ span: 12}"
			>
			<a-input
				v-decorator="[
				item.key,
				{ rules: [{ required: true, message: item +' is required' }], initialValue: initValues[item.key] },
				]"
			/>
			</a-form-item>
		</div>
		<a-form-item :wrapper-col="{ span: 12, offset: 10 }">
			<a-button type="primary" html-type="submit">Submit</a-button>
		</a-form-item>
		</a-form>
	</template>
	</a-modal>
</template>

<script type="text/ecmascript-6">
import { VIMForm, VNFMForm } from "../../const/constant";
import { mapState } from "vuex";

export default {
	props: ["isEdit"],
	data() {
		return {
			form: this.$form.createForm(this),
			VIMForm,
			VNFMForm: VNFMForm,
			VIMCount: 0,
			VNFMCount: 0
		};
	},
	computed: {
		...mapState({
			currentTab: state => state.testENV.currentTab,
			cloudTypeOptions: state => state.testENV.cloudTypeOptions,
			regionIdOptions: state => state.testENV.regionIdOptions,
			initValues: state => state.testENV.initValues
		}),
		visible: {
			get() {
				return this.$store.state.testENV.visible;
			},
			set(val) {
				if (!val) {
					let list = this.currentTab === "VIM ENV" ? this.VIMForm : this.VNFMForm;
					list.forEach(item => {
						this.form.setFieldsValue({ [item.key]: '' });
					});
					this.$store.commit('testENV/setInitValues',{})
				}
			}
		}
	},
	watch: {
		visible(val){
			if(val) {
				if(this.currentTab === 'VIM ENV'){
					this.VIMCount ++
					if(this.isEdit && this.VIMCount > 1){
						this.VIMForm.forEach(item => {
							this.form.setFieldsValue({[item.key]: this.initValues[item.key]})
						})
					}else if(!this.isEdit && this.VIMCount > 1){
						this.form.setFieldsValue({cloudRegionId: this.regionIdOptions[0], cloudType: this.cloudTypeOptions[0]})
					}
				}else{
					this.VNFMCount ++
					if(this.isEdit && this.VNFMCount > 1){
						this.VNFMForm.forEach(item => {
							this.form.setFieldsValue({[item.key]: this.initValues[item.key]})
						})
					}
				}
			}
		},
	},
	methods: {
		handleCancel() {
			this.$store.commit("testENV/updateVisible", false);
		},
		handleSubmit(e) {
			e.preventDefault();
			this.form.validateFields((err, values) => {
			if (!err) {
				// Did not implement the check if there is a change
				let data = {};
				if (this.currentTab === "VIM ENV") {
					this.VIMformList.forEach(item => {
						if (item === "password") data.passwd = values[item];
						else data[item] = values[item];
					});
				} else {
					data = {
						VNFMname: values.name,
						VNFMtype: values.type,
						VNFMvendor: values.vendor,
						VNFMversion: values.version,
						url: values.uRL,
						authUrl: values.certificateURL,
						username: values.userName,
						password: values.password
					};
				}
				this.$store.commit("testENV/updateVisible", false);
				this.$store.dispatch("testENV/loginVIN", {
					isEdit: this.isEdit,
					data
				});
			}
			});
		},
	}
};
</script>

<style scoped>
.select {
	width: 70%;
	margin-right: 10%;
}
</style>
